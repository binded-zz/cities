import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { areaTypes$, areaResources$, resourceTaxIncomes } from 'cs2/bindings';
import { resourceCategories, ResourceCategory } from '../data/resourceTaxonomy';
import './AdvancedTPMWindow.css';

interface TaxResourceKey {
  resource: number;
  area: number;
}

interface ResourceRowVm {
  key: string;
  label: string;
  stage: string;
  resourceIndex?: number;
  production: number;
  consumption: number;
  taxRate: number;
  surplus: number;
  deficit: number;
  taxIncome: number;
  incomeSource?: string;
  isService?: boolean;
  companyCount?: number;
  maxWorkers?: number;
  currentWorkers?: number;
  demand?: number;
}

interface AdvancedTPMWindowProps {
  selectedCategory: string;
  rows: ResourceRowVm[];
  showTips: boolean;
  autoTaxEnabled: boolean;
  autoTaxStatus: string;
  onAutoTaxToggle: (enabled: boolean) => void;
  onResourceTaxRateChange: (key: string, rate: number) => void;
  onCategoryChange: (category: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  onClose: () => void;
}

/** Parse auto-tax status string: happiness|adjustCount|raiseCount|lowerCount|holdCount|resourceDirections */
interface AutoTaxParsed {
  happiness: number;
  adjustCount: number;
  raiseCount: number;
  lowerCount: number;
  holdCount: number;
  directions: Map<string, { direction: number; score: number }>;
}

const parseAutoTaxStatus = (status: string): AutoTaxParsed | null => {
  if (!status) return null;
  const parts = status.split('|');
  if (parts.length < 6) return null;
  const directions = new Map<string, { direction: number; score: number }>();
  if (parts[5]) {
    parts[5].split(',').forEach((entry) => {
      const [key, rest] = entry.split('=');
      if (key && rest) {
        const [dir, score] = rest.split(':');
        directions.set(key, { direction: Number(dir) || 0, score: Number(score) || 0 });
      }
    });
  }
  return {
    happiness: Number(parts[0]) || 0,
    adjustCount: Number(parts[1]) || 0,
    raiseCount: Number(parts[2]) || 0,
    lowerCount: Number(parts[3]) || 0,
    holdCount: Number(parts[4]) || 0,
    directions,
  };
};

const formatCurrency = (value: number): string => {
  const rounded = Math.round(value);
  return `${rounded < 0 ? '-' : ''}${Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/** Format weight in game-style units: kg / t / kt — unit glued to number (no space) */
const formatWeight = (tonnes: number): string => {
  const abs = Math.abs(tonnes);
  if (abs < 0.001) return '0t';
  if (abs < 1) return `${(tonnes * 1000).toFixed(0)}kg`;
  if (abs < 1000) return `${tonnes.toFixed(abs < 10 ? 2 : 1)}t`;
  return `${(tonnes / 1000).toFixed(abs < 10000 ? 2 : 1)}kt`;
};

const formatCompact = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toFixed(1);
};

const CURRENCY_ICON = 'Media/Game/Icons/Economy.svg';

const getStageIcon = (stage: string): string => {
  switch ((stage || '').toLowerCase()) {
    case 'retail':
    case 'commercial':
      return 'ZoneCommercial';
    case 'industrial':
      return 'ZoneIndustrial';
    case 'immaterial':
      return 'ZoneOffice';
    default:
      return 'ZoneExtractors';
  }
};

/* ── Custom Slider ── */
interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ value, min, max, onChange }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = useCallback((clientX: number) => {
    if (!sliderRef.current) return value;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(min + pct * (max - min));
  }, [min, max, value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    onChange(calculateValue(e.clientX));

    const onMove = (ev: MouseEvent) => onChange(calculateValue(ev.clientX));
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const range = max - min;
  const clampedValue = Math.max(min, Math.min(max, value));
  const pct = range > 0 ? ((clampedValue - min) / range) * 100 : 0;

  return (
    <div className="adv-slider-wrapper">
      <div ref={sliderRef} className="adv-slider-track" onMouseDown={handleMouseDown}>
        <div className="adv-slider-track-bounds">
          <div className="adv-slider-range-bounds" style={{ width: `${pct}%` }}>
            <div className="adv-slider-range" />
            <div className="adv-slider-thumb-container">
              <div className="adv-slider-thumb" style={{ cursor: isDragging ? 'grabbing' : 'grab' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Resource Sub-Row ── */
const ResourceSubRow: React.FC<{
  resource: ResourceRowVm;
  icon: string;
  localRate: number;
  selected: boolean;
  autoTaxDir?: { direction: number; score: number };
  onRateChange: (key: string, rate: number) => void;
  onSelect: (key: string) => void;
}> = ({ resource, icon, localRate, selected, autoTaxDir, onRateChange, onSelect }) => {
  const [hover, setHover] = useState(false);
  const isIncomeNegative = resource.taxIncome < 0;
  const stageIcon = getStageIcon(resource.stage);
  const stageFallbackIcon = resource.stage.toLowerCase() === 'retail' || resource.stage.toLowerCase() === 'commercial'
    ? 'Meals'
    : resource.stage.toLowerCase() === 'industrial'
      ? 'Machinery'
      : resource.stage.toLowerCase() === 'immaterial'
        ? 'Software'
        : 'Ore';
  const incomeText = formatCurrency(resource.taxIncome);
  const isSvc = resource.isService === true;
  const fmtVal = (v: number) => isSvc ? formatCompact(v) : formatWeight(v);
  const maxRef = Math.max(resource.production, resource.consumption, resource.demand ?? 0, 1);
  const prodWidth = `${Math.min(100, (resource.production / maxRef) * 100)}%`;
  const consWidth = `${Math.min(100, (resource.consumption / maxRef) * 100)}%`;
  const surplusWidth = resource.production > 0 ? `${Math.min(100, (resource.surplus / maxRef) * 100)}%` : '0%';
  const deficitWidth = resource.consumption > 0 ? `${Math.min(100, (resource.deficit / maxRef) * 100)}%` : '0%';
  const demandVal = resource.demand ?? 0;
  const demandWidth = demandVal > 0 ? `${Math.min(100, (demandVal / maxRef) * 100)}%` : '0%';
  const maxW = resource.maxWorkers ?? 0;
  const curW = resource.currentWorkers ?? 0;
  const workerPct = maxW > 0 ? Math.round((curW / maxW) * 100) : 0;

  const resourceTooltipLines: string[] = [
    `${isSvc ? 'Capacity' : 'Production'}: ${fmtVal(resource.production)}`,
    `${isSvc ? 'Used' : 'Consumption'}: ${fmtVal(resource.consumption)}`,
    `Surplus: ${fmtVal(resource.surplus)}`,
    `Deficit: ${fmtVal(resource.deficit)}`,
    ...(!isSvc && demandVal > 0 ? [`Demand: ${fmtVal(demandVal)}`] : []),
    ...(maxW > 0 ? [`Workers: ${curW.toLocaleString()}/${maxW.toLocaleString()} (${workerPct}%)`] : []),
    ...(resource.companyCount != null && resource.companyCount > 0 ? [`Companies: ${resource.companyCount}`] : []),
    `Tax Rate: ${localRate}%`,
    `Tax Income: ${formatCurrency(resource.taxIncome)}`,
  ];
  return (
    <div
      className={`adv-resource-row${selected ? ' adv-resource-row-selected' : ''}${hover ? ' adv-resource-row-hover' : ''}`}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={() => onSelect(resource.key)}
    >
      <img className="adv-resource-icon" src={"Media/Game/Resources/" + icon + ".svg"} />
      <img
        className="adv-resource-stage-icon"
        src={"Media/Game/Icons/" + stageIcon + ".svg"}
        title={resource.stage}
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.dataset.fallbackApplied) {
            el.dataset.fallbackApplied = '1';
            el.src = "Media/Game/Resources/" + stageFallbackIcon + ".svg";
          }
        }}
      />
      <div className="adv-resource-name">
        {resource.label}
        {autoTaxDir && autoTaxDir.direction !== 0 && (
          <span
            className={`adv-autotax-indicator ${autoTaxDir.direction > 0 ? 'adv-autotax-up' : 'adv-autotax-down'}`}
            title={`Auto-tax: ${autoTaxDir.direction > 0 ? 'raising' : 'lowering'} (score: ${autoTaxDir.score.toFixed(2)})`}
          >
            {autoTaxDir.direction > 0 ? '▲' : '▼'}
          </span>
        )}
      </div>
      <div className="adv-resource-slider-container">
        <div className="adv-resource-slider-column">
          <div className="adv-resource-rate">{localRate}%</div>
          <CustomSlider value={localRate} min={-10} max={30} onChange={(v) => onRateChange(resource.key, v)} />
        </div>
        <div className="adv-resource-production-column">
          <div className="adv-resource-production-value">
            <div className="adv-prod-bars">
              <div className="adv-prod-bar-row">
                <div className="adv-prod-bar adv-prod-bar-production" style={{ width: prodWidth }} />
                <span className="adv-prod-bar-label">{fmtVal(resource.production)}</span>
              </div>
              <div className="adv-prod-bar-row">
                <div className="adv-prod-bar adv-prod-bar-consumption" style={{ width: consWidth }} />
                <span className="adv-prod-bar-label">{fmtVal(resource.consumption)}</span>
              </div>
              <div className="adv-prod-bar-row">
                <div className="adv-prod-bar adv-prod-bar-surplus" style={{ width: surplusWidth }} />
                <span className="adv-prod-bar-label">{fmtVal(resource.surplus)}</span>
              </div>
              <div className="adv-prod-bar-row">
                <div className="adv-prod-bar adv-prod-bar-deficit" style={{ width: deficitWidth }} />
                <span className="adv-prod-bar-label">{fmtVal(resource.deficit)}</span>
              </div>
              {!isSvc && demandVal > 0 && (
                <div className="adv-prod-bar-row">
                  <div className="adv-prod-bar adv-prod-bar-demand" style={{ width: demandWidth }} />
                  <span className="adv-prod-bar-label">{fmtVal(demandVal)}</span>
                </div>
              )}
            </div>
          </div>
          {hover && (
            <div className="adv-row-tooltip">
              {resourceTooltipLines.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>
        <div className="adv-resource-income-column">
          <div className={`adv-resource-income-value${isIncomeNegative ? ' adv-income-negative' : ''}`}><img className="adv-currency-icon" src={CURRENCY_ICON} />{incomeText}</div>
        </div>
      </div>
    </div>
  );
};

/* ── Category Group Row ── */
const CategoryGroupRow: React.FC<{
  category: ResourceCategory;
  categoryRows: ResourceRowVm[];
  isFirst: boolean;
  iconMap: Map<string, string>;
  localRates: Record<string, number>;
  selectedRowKey: string | null;
  autoTaxDirections: Map<string, { direction: number; score: number }>;
  onRateChange: (key: string, rate: number) => void;
  onSelect: (key: string) => void;
}> = ({ category, categoryRows, isFirst, iconMap, localRates, selectedRowKey, autoTaxDirections, onRateChange, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [headerHover, setHeaderHover] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  const totalProduction = categoryRows.reduce((sum, r) => sum + r.production, 0);
  const totalConsumption = categoryRows.reduce((sum, r) => sum + r.consumption, 0);
  const totalSurplus = categoryRows.reduce((sum, r) => sum + r.surplus, 0);
  const totalDeficit = categoryRows.reduce((sum, r) => sum + r.deficit, 0);
  const totalTaxIncome = categoryRows.reduce((sum, r) => sum + r.taxIncome, 0);
  const isCategoryIncomeNegative = totalTaxIncome < 0;
  const categoryIncomeText = formatCurrency(totalTaxIncome);
  const catIsSvc = categoryRows.some(r => r.isService);
  const catFmt = (v: number) => catIsSvc ? formatCompact(v) : formatWeight(v);
  const totalCompanies = categoryRows.reduce((sum, r) => sum + (r.companyCount ?? 0), 0);
  const totalDemand = categoryRows.reduce((sum, r) => sum + (r.demand ?? 0), 0);
  const totalMaxWorkers = categoryRows.reduce((sum, r) => sum + (r.maxWorkers ?? 0), 0);
  const totalCurrentWorkers = categoryRows.reduce((sum, r) => sum + (r.currentWorkers ?? 0), 0);
  const catWorkerPct = totalMaxWorkers > 0 ? Math.round((totalCurrentWorkers / totalMaxWorkers) * 100) : 0;
  const catMaxRef = Math.max(totalProduction, totalConsumption, totalDemand, 1);
  const prodWidth = `${Math.min(100, (totalProduction / catMaxRef) * 100)}%`;
  const consWidth = `${Math.min(100, (totalConsumption / catMaxRef) * 100)}%`;
  const surplusWidth = totalProduction > 0 ? `${Math.min(100, (totalSurplus / catMaxRef) * 100)}%` : '0%';
  const deficitWidth = totalConsumption > 0 ? `${Math.min(100, (totalDeficit / catMaxRef) * 100)}%` : '0%';
  const catDemandWidth = totalDemand > 0 ? `${Math.min(100, (totalDemand / catMaxRef) * 100)}%` : '0%';
  const avgTax = categoryRows.length > 0
    ? Math.round(categoryRows.reduce((sum, r) => sum + (localRates[r.key] ?? r.taxRate), 0) / categoryRows.length)
    : 0;

  const handleGroupRateChange = (v: number) => {
    categoryRows.forEach((r) => onRateChange(r.key, v));
  };

  return (
    <div className={isFirst ? 'adv-category-group' : 'adv-category-group adv-category-group-border'}>
      <div
        className={`adv-category-header${headerHover ? ' adv-category-header-hover' : ''}`}
        onMouseOver={() => setHeaderHover(true)}
        onMouseOut={() => setHeaderHover(false)}
      >
        <img className="adv-category-icon" src={"Media/Game/Resources/" + category.icon + ".svg"} />
        <div className="adv-category-title">{category.label}</div>
        <div
          className={`adv-expand-button${buttonHover ? ' adv-expand-button-hover' : ''}`}
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          onMouseOver={() => setButtonHover(true)}
          onMouseOut={() => setButtonHover(false)}
        >
          <div className={`adv-expand-icon${expanded ? ' adv-expand-icon-expanded' : ''}`} />
        </div>
        <div className="adv-category-slider-container" onClick={(e) => e.stopPropagation()}>
          <div className="adv-category-slider-column">
            <div className="adv-category-rate">{avgTax}%</div>
            <CustomSlider
              value={avgTax}
              min={-10}
              max={30}
              onChange={handleGroupRateChange}
            />
          </div>
          <div className="adv-category-production-column">
            <div className="adv-category-production-value">
              <div className="adv-prod-bars">
                <div className="adv-prod-bar-row">
                  <div className="adv-prod-bar adv-prod-bar-production" style={{ width: prodWidth }} />
                  <span className="adv-prod-bar-label">{catFmt(totalProduction)}</span>
                </div>
                <div className="adv-prod-bar-row">
                  <div className="adv-prod-bar adv-prod-bar-consumption" style={{ width: consWidth }} />
                  <span className="adv-prod-bar-label">{catFmt(totalConsumption)}</span>
                </div>
                <div className="adv-prod-bar-row">
                  <div className="adv-prod-bar adv-prod-bar-surplus" style={{ width: surplusWidth }} />
                  <span className="adv-prod-bar-label">{catFmt(totalSurplus)}</span>
                </div>
                <div className="adv-prod-bar-row">
                  <div className="adv-prod-bar adv-prod-bar-deficit" style={{ width: deficitWidth }} />
                  <span className="adv-prod-bar-label">{catFmt(totalDeficit)}</span>
                </div>
                {!catIsSvc && totalDemand > 0 && (
                  <div className="adv-prod-bar-row">
                    <div className="adv-prod-bar adv-prod-bar-demand" style={{ width: catDemandWidth }} />
                    <span className="adv-prod-bar-label">{catFmt(totalDemand)}</span>
                  </div>
                )}
              </div>
            {headerHover && (
              <div className="adv-row-tooltip adv-row-tooltip-category">
                <div>{`${catIsSvc ? 'Capacity' : 'Production'}: ${catFmt(totalProduction)}`}</div>
                <div>{`${catIsSvc ? 'Used' : 'Consumption'}: ${catFmt(totalConsumption)}`}</div>
                <div>{`Surplus: ${catFmt(totalSurplus)}`}</div>
                <div>{`Deficit: ${catFmt(totalDeficit)}`}</div>
                {!catIsSvc && totalDemand > 0 && <div>{`Demand: ${catFmt(totalDemand)}`}</div>}
                {totalMaxWorkers > 0 && <div>{`Workers: ${totalCurrentWorkers.toLocaleString()}/${totalMaxWorkers.toLocaleString()} (${catWorkerPct}%)`}</div>}
                {totalCompanies > 0 && <div>{`Companies: ${totalCompanies}`}</div>}
                <div>{`Avg Tax Rate: ${avgTax}%`}</div>
                <div>{`Tax Income: ${categoryIncomeText}`}</div>
              </div>
            )}
            </div>
          </div>
          <div className="adv-category-income-column">
            <div className={`adv-category-income-value${isCategoryIncomeNegative ? ' adv-income-negative' : ''}`}><img className="adv-currency-icon" src={CURRENCY_ICON} />{categoryIncomeText}</div>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="adv-prefab-list">
          {categoryRows.map((r) => (
            <ResourceSubRow
              key={r.key}
              resource={r}
              icon={iconMap.get(r.key) ?? 'Money'}
              localRate={localRates[r.key] ?? r.taxRate}
              selected={selectedRowKey === r.key}
              autoTaxDir={autoTaxDirections.get(r.key)}
              onRateChange={onRateChange}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Advanced Window ── */
const AdvancedTPMWindow: React.FC<AdvancedTPMWindowProps> = ({
  selectedCategory,
  rows,
  showTips,
  autoTaxEnabled,
  autoTaxStatus,
  onAutoTaxToggle,
  onResourceTaxRateChange,
  onCategoryChange,
  onCollapseChange,
  onClose,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const safeCategory = (selectedCategory || 'all').toLowerCase();
  const iconMap = new Map(resourceCategories.flatMap((c) => c.resources.map((r) => [r.key, r.icon] as const)));
  const autoTaxParsed = useMemo(() => parseAutoTaxStatus(autoTaxStatus), [autoTaxStatus]);
  const autoTaxDirections = autoTaxParsed?.directions ?? new Map();

  // Reactive per-resource tax income from the game's native resourceTaxIncomes MapBinding.
  // Uses areaTypes$ → areaResources$ → resourceTaxIncomes chain (same as game's economy panel).
  // Keyed by sequential resource index (TaxResource.resource = EconomyUtils.GetResourceIndex).
  const [bindingIncomes, setBindingIncomes] = useState<Record<number, number>>({});
  const [bindingsReady, setBindingsReady] = useState(false);

  useEffect(() => {
    const subs: Array<{ dispose(): void }> = [];
    const subscribedKeys = new Set<string>();

    const subscribeToResource = (tr: TaxResourceKey) => {
      const key = `${tr.resource}:${tr.area}`;
      if (subscribedKeys.has(key)) return;
      subscribedKeys.add(key);

      const incSub = (resourceTaxIncomes as any).subscribe(tr);
      if (!incSub) return;
      subs.push(incSub);

      const update = (val: number) => {
        setBindingIncomes(prev => {
          const next = { ...prev, [tr.resource]: val ?? 0 };
          return next;
        });
      };
      if (typeof incSub.setChangeListener === 'function') {
        incSub.setChangeListener(update);
      }
      update(incSub.value ?? 0);
    };

    const setupResources = (taxResources: TaxResourceKey[]) => {
      (taxResources || []).forEach(subscribeToResource);
    };

    const setupArea = (areaIndex: number) => {
      const areaSub = (areaResources$ as any).subscribe(areaIndex);
      if (!areaSub) return;
      subs.push(areaSub);
      setupResources(areaSub.value || []);
      if (typeof areaSub.setChangeListener === 'function') {
        areaSub.setChangeListener(setupResources);
      }
    };

    const setupAllAreas = (types: Array<{ index: number }>) => {
      (types || []).forEach((at) => setupArea(at.index));
      setBindingsReady(true);
    };

    try {
      const areaTypesSub = (areaTypes$ as any).subscribe();
      if (areaTypesSub) {
        subs.push(areaTypesSub);
        setupAllAreas(areaTypesSub.value || []);
        if (typeof areaTypesSub.setChangeListener === 'function') {
          areaTypesSub.setChangeListener(setupAllAreas);
        }
      }
    } catch (e) {
      // Game bindings not yet available; fall back to C# income data
    }

    return () => subs.forEach(s => { try { s.dispose(); } catch {} });
  }, []);

  const mergedRows = useMemo(() => {
    return rows.map((r) => {
      if (!bindingsReady || r.resourceIndex === undefined || r.resourceIndex < 0) return r;
      const income = bindingIncomes[r.resourceIndex];
      if (income !== undefined && income !== 0) {
        return { ...r, taxIncome: income, incomeSource: 'binding:resourceTaxIncomes' };
      }
      return r;
    });
  }, [rows, bindingIncomes, bindingsReady]);

  const displayCategories = safeCategory === 'all'
    ? resourceCategories.filter((c) => c.id !== 'all')
    : resourceCategories.filter((c) => c.id === safeCategory);

  const getCategoryRows = (cat: ResourceCategory): ResourceRowVm[] =>
    cat.resources
      .map((cr) => mergedRows.find((r) => r.key === cr.key) ?? {
        key: cr.key,
        label: cr.label,
        stage: cr.stage,
        production: 0,
        consumption: 0,
        taxRate: 0,
        surplus: 0,
        deficit: 0,
        taxIncome: 0,
        maxWorkers: 0,
        currentWorkers: 0,
        demand: 0,
      });

  const visibleRows = useMemo(
    () => displayCategories.flatMap((cat) => getCategoryRows(cat)),
    [displayCategories, mergedRows]
  );

  const [localRates, setLocalRates] = useState<Record<string, number>>({});
  const rowKey = useMemo(() => rows.map((r) => `${r.key}:${r.taxRate}`).join(';'), [rows]);

  useEffect(() => {
    const next: Record<string, number> = {};
    rows.forEach((r) => { next[r.key] = r.taxRate; });
    setLocalRates(next);
  }, [rowKey]);

  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  // Clear selection when category changes
  useEffect(() => {
    setSelectedRowKey(null);
  }, [safeCategory]);

  const handleRowSelect = (key: string) => {
    setSelectedRowKey((prev) => prev === key ? null : key);
  };

  const handleRateChange = (key: string, rate: number) => {
    setLocalRates((prev) => ({ ...prev, [key]: rate }));
    onResourceTaxRateChange(key, rate);
  };

  const selectedRow = selectedRowKey ? visibleRows.find((r) => r.key === selectedRowKey) : null;
  const footerRows = selectedRow ? [selectedRow] : visibleRows;
  const totalProduction = footerRows.reduce((sum, r) => sum + r.production, 0);
  const totalConsumption = footerRows.reduce((sum, r) => sum + r.consumption, 0);
  const totalSurplus = footerRows.reduce((sum, r) => sum + r.surplus, 0);
  const totalDeficit = footerRows.reduce((sum, r) => sum + r.deficit, 0);
  const totalDemandFooter = footerRows.reduce((sum, r) => sum + (r.demand ?? 0), 0);
  const totalTaxIncome = footerRows.reduce((sum, r) => sum + r.taxIncome, 0);
  const isTotalIncomeNegative = totalTaxIncome < 0;
  const totalIncomeText = formatCurrency(totalTaxIncome);

  return (
    <div className={`adv-window${collapsed ? ' adv-window-collapsed' : ''}`}>
      <div className="adv-window-header">
        <div className="adv-window-title">Advanced Tax & Production Manager</div>
        <button
          className={`adv-autotax-toggle${autoTaxEnabled ? ' adv-autotax-toggle-active' : ''}`}
          onClick={() => onAutoTaxToggle(!autoTaxEnabled)}
          title={autoTaxEnabled ? 'Auto-Tax: ON — Click to disable' : 'Auto-Tax: OFF — Click to enable'}
        >
          {autoTaxEnabled ? 'AUTO' : 'AUTO'}
        </button>
        <button className="adv-collapse-btn" onClick={() => setCollapsed((v) => !v)}>{collapsed ? '+' : '−'}</button>
        <button className="adv-close-btn" onClick={onClose}>X</button>
      </div>

      {!collapsed && (
      <>

      {/* Category filter tabs */}
      <div className="adv-filter-bar">
        {resourceCategories.map((cat) => (
          <button
            key={cat.id}
            className={`adv-filter-tab${cat.id === safeCategory ? ' adv-filter-tab-active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {showTips && (
        <div className="adv-tip-bar">
          Expand each category to adjust individual resource tax rates.
        </div>
      )}

      {autoTaxEnabled && autoTaxParsed && (
        <div className="adv-autotax-status-bar">
          <span className="adv-autotax-status-label">Auto-Tax</span>
          <span className="adv-autotax-status-happiness" title="City Happiness">
            {autoTaxParsed.happiness >= 70 ? '😊' : autoTaxParsed.happiness >= 40 ? '😐' : '😟'}
            {`\u00a0${autoTaxParsed.happiness}%`}
          </span>
          {autoTaxParsed.raiseCount > 0 && <span className="adv-autotax-status-raise">{`▲${autoTaxParsed.raiseCount}`}</span>}
          {autoTaxParsed.lowerCount > 0 && <span className="adv-autotax-status-lower">{`▼${autoTaxParsed.lowerCount}`}</span>}
          {autoTaxParsed.holdCount > 0 && <span className="adv-autotax-status-hold">{`→${autoTaxParsed.holdCount}`}</span>}
        </div>
      )}

      {/* Table structure */}
      <div className="adv-table-section">
        <div className="adv-table-header">
          <div className="adv-column-headers">
            <div className="adv-col-type">Resource</div>
            <div className="adv-col-rate">Tax Rate</div>
            <div className="adv-col-production">Prod / Cons</div>
            <div className="adv-col-income">Tax Income</div>
          </div>
          <div className="adv-bar-legend">Blue: Production · Orange: Consumption · Green: Surplus · Red: Deficit · Purple: Demand</div>
        </div>

        <div className="adv-table-content-wrapper">
          <div className="adv-table-content">
            {displayCategories.map((cat, idx) => {
              const catRows = getCategoryRows(cat);
              if (catRows.length === 0) return null;
              return (
                <CategoryGroupRow
                  key={cat.id}
                  category={cat}
                  categoryRows={catRows}
                  isFirst={idx === 0}
                  iconMap={iconMap}
                  localRates={localRates}
                  selectedRowKey={selectedRowKey}
                  autoTaxDirections={autoTaxDirections}
                  onRateChange={handleRateChange}
                  onSelect={handleRowSelect}
                />
              );
            })}
          </div>

          <div className="adv-table-lines">
            <div className="adv-table-lines-name" />
            <div className="adv-table-lines-rate" />
            <div className="adv-table-lines-production" />
            <div className="adv-table-lines-income" />
          </div>
        </div>
      </div>

      {/* Footer summary */}
      <div className="adv-footer">
        <div className="adv-footer-summary">
          {selectedRow && <span className="adv-footer-selected">{selectedRow.label}</span>}
          <span className="adv-footer-prod">{`Production:\u00a0${formatWeight(totalProduction)}`}</span>
          <span className="adv-footer-cons">{`Consumption:\u00a0${formatWeight(totalConsumption)}`}</span>
          {totalSurplus > 0 && <span className="adv-footer-surplus">{`Surplus:\u00a0${formatWeight(totalSurplus)}`}</span>}
          {totalDeficit > 0 && <span className="adv-footer-deficit">{`Deficit:\u00a0${formatWeight(totalDeficit)}`}</span>}
          {totalDemandFooter > 0 && <span className="adv-footer-demand">{`Demand:\u00a0${formatWeight(totalDemandFooter)}`}</span>}
          <span className={`adv-footer-income${isTotalIncomeNegative ? ' adv-income-negative' : ''}`}>{`Tax\u00a0Income:\u00a0`}<img className="adv-currency-icon-footer" src={CURRENCY_ICON} />{totalIncomeText}</span>
          {autoTaxEnabled && autoTaxParsed && (
            <span className="adv-footer-autotax" title="City happiness influences auto-tax decisions">{`Happiness:\u00a0${autoTaxParsed.happiness}%`}</span>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default AdvancedTPMWindow;
