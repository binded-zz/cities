import { useValue, trigger } from "cs2/api";
import React, { useState } from "react";
import AdvancedTPMWindow from "../UI/components/AdvancedTPMWindow";
import DebugPanel from "../UI/components/DebugPanel";
import TPMWindowShell from "../UI/components/TPMWindowShell";
import { advancedVisible$, selectedResourceCategory$, debugEnabled$, debugPanelVisible$, showTips$, debugLastAction$, advancedWindowX$, advancedWindowY$, advancedWindowWidth$, advancedWindowHeight$, resourceRowsData$, autoTaxEnabled$, autoTaxStatus$ } from "./bindings";

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

const parseRows = (payload: string): ResourceRowVm[] => {
    if (!payload) return [];
    return payload
        .split(';')
        .map((chunk) => {
            const parts = chunk.split('|');
            const [key, label, stage, production, consumption, taxRate, surplus, deficit, taxIncome, incomeSource, resourceIndex, isService, companyCount, maxWorkers, currentWorkers, demand] = parts;
            if (!key || !label || !stage || production === undefined || taxRate === undefined) return null;
            return {
                key,
                label,
                stage,
                resourceIndex: resourceIndex !== undefined ? Number(resourceIndex) : undefined,
                production: Number(production) || 0,
                consumption: Number(consumption) || 0,
                taxRate: Number(taxRate) || 0,
                surplus: Number(surplus) || 0,
                deficit: Number(deficit) || 0,
                taxIncome: Number(taxIncome) || 0,
                incomeSource: incomeSource || undefined,
                isService: isService === '1',
                companyCount: companyCount !== undefined ? Number(companyCount) : 0,
                maxWorkers: maxWorkers !== undefined ? Number(maxWorkers) : 0,
                currentWorkers: currentWorkers !== undefined ? Number(currentWorkers) : 0,
                demand: demand !== undefined ? Number(demand) : 0,
            } as ResourceRowVm;
        })
        .filter((x): x is ResourceRowVm => x !== null);
};

const TaxWindow: React.FC = () => {
    const [advancedCollapsed, setAdvancedCollapsed] = useState(false);
    const advancedVisible = useValue(advancedVisible$) ?? false;
    const selectedCategory = useValue(selectedResourceCategory$) ?? 'All';
    const debugEnabled = useValue(debugEnabled$) ?? false;
    const debugPanelVisible = useValue(debugPanelVisible$) ?? false;
    const showTips = useValue(showTips$) ?? true;
    const debugLastAction = useValue(debugLastAction$) ?? 'init';
    const advancedX = useValue(advancedWindowX$) ?? 140;
    const advancedY = useValue(advancedWindowY$) ?? 150;
    const advancedWidth = useValue(advancedWindowWidth$) ?? 520;
    const advancedHeight = useValue(advancedWindowHeight$) ?? 420;
    const rows = parseRows(useValue(resourceRowsData$) ?? '');
    const autoTaxEnabled = useValue(autoTaxEnabled$) ?? false;
    const autoTaxStatus = useValue(autoTaxStatus$) ?? '';

    if (!advancedVisible && !debugPanelVisible) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}>
            {advancedVisible && (
                <div style={{ pointerEvents: 'auto' }}>
                    <TPMWindowShell
                        x={advancedX}
                        y={advancedY}
                        width={advancedWidth}
                        height={advancedHeight}
                        collapsed={advancedCollapsed}
                        collapsedHeight={74}
                        onSaveRect={(x, y, w, h) => trigger('taxProduction', 'setAdvancedWindowRect', `${x},${y},${w},${h}`)}
                    >
                        <AdvancedTPMWindow
                            selectedCategory={selectedCategory}
                            rows={rows}
                            showTips={showTips}
                            autoTaxEnabled={autoTaxEnabled}
                            autoTaxStatus={autoTaxStatus}
                            onAutoTaxToggle={(enabled: boolean) => trigger('taxProduction', 'setAutoTaxEnabled', enabled)}
                            onResourceTaxRateChange={(key: string, rate: number) => trigger('taxProduction', 'setResourceTaxRate', `${key}:${rate}`)}
                            onCategoryChange={(category: string) => trigger('taxProduction', 'setResourceCategory', category)}
                            onCollapseChange={setAdvancedCollapsed}
                            onClose={() => trigger('taxProduction', 'toggleAdvancedWindow')}
                        />
                    </TPMWindowShell>
                </div>
            )}
            {debugPanelVisible && (
                <div style={{ pointerEvents: 'auto' }}>
                    <DebugPanel
                        debugEnabled={debugEnabled}
                        lastAction={debugLastAction}
                        onToggleDebug={(enabled: boolean) => trigger('taxProduction', 'setDebugEnabled', enabled)}
                        onToggleTips={(enabled: boolean) => trigger('taxProduction', 'setShowTips', enabled)}
                        showTips={showTips}
                        onTogglePanel={() => trigger('taxProduction', 'toggleDebugPanel')}
                    />
                </div>
            )}
        </div>
    );
};

export default TaxWindow;
