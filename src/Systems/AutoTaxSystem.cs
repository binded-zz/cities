using Colossal.UI.Binding;
using Game.City;
using Game.Economy;
using Game.Simulation;
using Game.UI;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Unity.Collections;
using Unity.Entities;
using Unity.Jobs;

namespace CitiesSkylines2Mod
{
    public partial class AutoTaxSystem : UISystemBase
    {
        private ValueBinding<bool> _autoTaxEnabled;
        private ValueBinding<string> _autoTaxStatus;

        private TaxSystem _taxSystem;
        private CountCompanyDataSystem _countCompanyDataSystem;
        private IndustrialDemandSystem _industrialDemandSystem;
        private CommercialDemandSystem _commercialDemandSystem;
        private CityStatisticsSystem _cityStatisticsSystem;
        private SimulationSystem _simulationSystem;

        private int _lastAdjustmentDay;
        private int _updateCounter;

        private enum ResourceTaxArea { Industrial, Commercial, Office }

        // Per-resource auto-tax state: tracks direction and score for UI display
        private readonly Dictionary<string, AutoTaxResourceState> _resourceStates = new Dictionary<string, AutoTaxResourceState>();

        // Same mappings as TaxingProductionUISystem — resource key → tax area and enum
        private static readonly Dictionary<string, ResourceTaxArea> ResourceTaxAreaMap = new Dictionary<string, ResourceTaxArea>
        {
            ["grain"] = ResourceTaxArea.Industrial,
            ["vegetables"] = ResourceTaxArea.Industrial,
            ["cotton"] = ResourceTaxArea.Industrial,
            ["livestock"] = ResourceTaxArea.Industrial,
            ["fish"] = ResourceTaxArea.Industrial,
            ["wood"] = ResourceTaxArea.Industrial,
            ["ore"] = ResourceTaxArea.Industrial,
            ["stone"] = ResourceTaxArea.Industrial,
            ["coal"] = ResourceTaxArea.Industrial,
            ["oil"] = ResourceTaxArea.Industrial,
            ["food"] = ResourceTaxArea.Industrial,
            ["beverages"] = ResourceTaxArea.Industrial,
            ["conveniencefood"] = ResourceTaxArea.Industrial,
            ["textiles"] = ResourceTaxArea.Industrial,
            ["timber"] = ResourceTaxArea.Industrial,
            ["paper"] = ResourceTaxArea.Industrial,
            ["furniture"] = ResourceTaxArea.Industrial,
            ["metals"] = ResourceTaxArea.Industrial,
            ["steel"] = ResourceTaxArea.Industrial,
            ["minerals"] = ResourceTaxArea.Industrial,
            ["concrete"] = ResourceTaxArea.Industrial,
            ["machinery"] = ResourceTaxArea.Industrial,
            ["electronics"] = ResourceTaxArea.Industrial,
            ["vehicles"] = ResourceTaxArea.Industrial,
            ["petrochemicals"] = ResourceTaxArea.Industrial,
            ["plastics"] = ResourceTaxArea.Industrial,
            ["chemicals"] = ResourceTaxArea.Industrial,
            ["pharmaceuticals"] = ResourceTaxArea.Industrial,
            ["software"] = ResourceTaxArea.Office,
            ["telecom"] = ResourceTaxArea.Office,
            ["financial"] = ResourceTaxArea.Office,
            ["media"] = ResourceTaxArea.Office,
            ["lodging"] = ResourceTaxArea.Commercial,
            ["meals"] = ResourceTaxArea.Commercial,
            ["entertainment"] = ResourceTaxArea.Commercial,
            ["recreation"] = ResourceTaxArea.Commercial,
            ["c_food"] = ResourceTaxArea.Commercial,
            ["c_beverages"] = ResourceTaxArea.Commercial,
            ["c_conveniencefood"] = ResourceTaxArea.Commercial,
            ["c_textiles"] = ResourceTaxArea.Commercial,
            ["c_timber"] = ResourceTaxArea.Commercial,
            ["c_paper"] = ResourceTaxArea.Commercial,
            ["c_furniture"] = ResourceTaxArea.Commercial,
            ["c_metals"] = ResourceTaxArea.Commercial,
            ["c_steel"] = ResourceTaxArea.Commercial,
            ["c_minerals"] = ResourceTaxArea.Commercial,
            ["c_concrete"] = ResourceTaxArea.Commercial,
            ["c_machinery"] = ResourceTaxArea.Commercial,
            ["c_electronics"] = ResourceTaxArea.Commercial,
            ["c_vehicles"] = ResourceTaxArea.Commercial,
            ["c_petrochemicals"] = ResourceTaxArea.Commercial,
            ["c_plastics"] = ResourceTaxArea.Commercial,
            ["c_chemicals"] = ResourceTaxArea.Commercial,
            ["c_pharmaceuticals"] = ResourceTaxArea.Commercial,
        };

        private static readonly Dictionary<string, Resource> ResourceKeyToEnum = new Dictionary<string, Resource>
        {
            ["grain"]           = Resource.Grain,
            ["vegetables"]      = Resource.Vegetables,
            ["cotton"]          = Resource.Cotton,
            ["livestock"]       = Resource.Livestock,
            ["fish"]            = Resource.Fish,
            ["wood"]            = Resource.Wood,
            ["ore"]             = Resource.Ore,
            ["stone"]           = Resource.Stone,
            ["coal"]            = Resource.Coal,
            ["oil"]             = Resource.Oil,
            ["food"]            = Resource.Food,
            ["beverages"]       = Resource.Beverages,
            ["conveniencefood"] = Resource.ConvenienceFood,
            ["textiles"]        = Resource.Textiles,
            ["timber"]          = Resource.Timber,
            ["paper"]           = Resource.Paper,
            ["furniture"]       = Resource.Furniture,
            ["metals"]          = Resource.Metals,
            ["steel"]           = Resource.Steel,
            ["minerals"]        = Resource.Minerals,
            ["concrete"]        = Resource.Concrete,
            ["machinery"]       = Resource.Machinery,
            ["electronics"]     = Resource.Electronics,
            ["vehicles"]        = Resource.Vehicles,
            ["petrochemicals"]  = Resource.Petrochemicals,
            ["plastics"]        = Resource.Plastics,
            ["chemicals"]       = Resource.Chemicals,
            ["pharmaceuticals"] = Resource.Pharmaceuticals,
            ["software"]        = Resource.Software,
            ["telecom"]         = Resource.Telecom,
            ["financial"]       = Resource.Financial,
            ["media"]           = Resource.Media,
            ["lodging"]         = Resource.Lodging,
            ["meals"]           = Resource.Meals,
            ["entertainment"]   = Resource.Entertainment,
            ["recreation"]      = Resource.Recreation,
            ["c_food"]            = Resource.Food,
            ["c_beverages"]       = Resource.Beverages,
            ["c_conveniencefood"] = Resource.ConvenienceFood,
            ["c_textiles"]        = Resource.Textiles,
            ["c_timber"]          = Resource.Timber,
            ["c_paper"]           = Resource.Paper,
            ["c_furniture"]       = Resource.Furniture,
            ["c_metals"]          = Resource.Metals,
            ["c_steel"]           = Resource.Steel,
            ["c_minerals"]        = Resource.Minerals,
            ["c_concrete"]        = Resource.Concrete,
            ["c_machinery"]       = Resource.Machinery,
            ["c_electronics"]     = Resource.Electronics,
            ["c_vehicles"]        = Resource.Vehicles,
            ["c_petrochemicals"]  = Resource.Petrochemicals,
            ["c_plastics"]        = Resource.Plastics,
            ["c_chemicals"]       = Resource.Chemicals,
            ["c_pharmaceuticals"] = Resource.Pharmaceuticals,
        };

        protected override void OnCreate()
        {
            base.OnCreate();

            foreach (var key in ResourceKeyToEnum.Keys)
            {
                _resourceStates[key] = new AutoTaxResourceState();
            }

            try { _taxSystem = World.GetOrCreateSystemManaged<TaxSystem>(); } catch { }
            try { _countCompanyDataSystem = World.GetOrCreateSystemManaged<CountCompanyDataSystem>(); } catch { }
            try { _industrialDemandSystem = World.GetOrCreateSystemManaged<IndustrialDemandSystem>(); } catch { }
            try { _commercialDemandSystem = World.GetOrCreateSystemManaged<CommercialDemandSystem>(); } catch { }
            try { _cityStatisticsSystem = World.GetOrCreateSystemManaged<CityStatisticsSystem>(); } catch { }
            try { _simulationSystem = World.GetOrCreateSystemManaged<SimulationSystem>(); } catch { }

            var settings = Mod.Settings;
            AddBinding(_autoTaxEnabled = new ValueBinding<bool>("taxProduction", "autoTaxEnabled", settings?.AutoTaxEnabled ?? false));
            AddBinding(_autoTaxStatus = new ValueBinding<string>("taxProduction", "autoTaxStatus", ""));

            AddBinding(new TriggerBinding<bool>("taxProduction", "setAutoTaxEnabled", SetAutoTaxEnabled));

            Mod.log.Info("AutoTaxSystem initialized");
        }

        protected override void OnUpdate()
        {
            base.OnUpdate();

            var settings = Mod.Settings;
            if (settings == null) return;

            // Sync enabled state from settings
            if (_autoTaxEnabled.value != settings.AutoTaxEnabled)
            {
                _autoTaxEnabled.Update(settings.AutoTaxEnabled);
            }

            if (!_autoTaxEnabled.value) return;
            if (_taxSystem == null || _countCompanyDataSystem == null) return;

            // Throttle: run every 64 frames to reduce overhead
            _updateCounter++;
            if (_updateCounter < 64) return;
            _updateCounter = 0;

            // Check if enough game days have passed
            int currentDay = GetCurrentGameDay();
            int interval = settings.AutoTaxInterval;
            if (interval < 1) interval = 5;

            if (currentDay - _lastAdjustmentDay < interval) return;
            _lastAdjustmentDay = currentDay;

            RunAutoTaxAdjustment(settings);
        }

        private void RunAutoTaxAdjustment(TPMModSettings settings)
        {
            int minRate = settings.AutoTaxMinRate;
            int maxRate = settings.AutoTaxMaxRate;
            if (minRate > maxRate) { int tmp = minRate; minRate = maxRate; maxRate = tmp; }
            float happinessWeight = settings.AutoTaxHappinessWeight / 100f;

            // Get city wellbeing as happiness proxy (0–100 scale)
            int happiness = 50;
            if (_cityStatisticsSystem != null)
            {
                try
                {
                    happiness = _cityStatisticsSystem.GetStatisticValue(StatisticType.Wellbeing);
                    happiness = Math.Max(0, Math.Min(100, happiness));
                }
                catch { }
            }

            // Happiness modifier: if happiness < 50, bias toward lowering taxes; if > 70, allow raising
            // Range: -1.0 (very unhappy, strong lower bias) to +1.0 (very happy, can raise)
            float happinessBias = (happiness - 50f) / 50f;

            // Get production data
            NativeArray<int> productionArray = default;
            bool hasProduction = false;
            try
            {
                JobHandle prodDeps;
                productionArray = _countCompanyDataSystem.GetProduction(out prodDeps);
                prodDeps.Complete();
                hasProduction = productionArray.IsCreated && productionArray.Length > 0;
            }
            catch { }

            NativeArray<int> industrialConsumption = default;
            bool hasIndustrialConsumption = false;
            if (_industrialDemandSystem != null)
            {
                try
                {
                    JobHandle consDeps;
                    industrialConsumption = _industrialDemandSystem.GetConsumption(out consDeps);
                    consDeps.Complete();
                    hasIndustrialConsumption = industrialConsumption.IsCreated && industrialConsumption.Length > 0;
                }
                catch { }
            }

            NativeArray<int> commercialConsumption = default;
            bool hasCommercialConsumption = false;
            if (_commercialDemandSystem != null)
            {
                try
                {
                    JobHandle commDeps;
                    commercialConsumption = _commercialDemandSystem.GetConsumption(out commDeps);
                    commDeps.Complete();
                    hasCommercialConsumption = commercialConsumption.IsCreated && commercialConsumption.Length > 0;
                }
                catch { }
            }

            // Get company data
            NativeArray<int> industrialCompanies = default;
            NativeArray<int> industrialDemand = default;
            bool hasIndustrialData = false;
            try
            {
                JobHandle indDeps;
                var indData = _countCompanyDataSystem.GetIndustrialCompanyDatas(out indDeps);
                indDeps.Complete();
                industrialCompanies = indData.m_ProductionCompanies;
                industrialDemand = indData.m_Demand;
                hasIndustrialData = industrialCompanies.IsCreated && industrialCompanies.Length > 0;
            }
            catch { }

            NativeArray<int> commercialCompanies = default;
            NativeArray<int> commercialCapacity = default;
            NativeArray<int> commercialAvailables = default;
            bool hasCommercialData = false;
            try
            {
                JobHandle comDeps;
                var comData = _countCompanyDataSystem.GetCommercialCompanyDatas(out comDeps);
                comDeps.Complete();
                commercialCompanies = comData.m_ServiceCompanies;
                commercialCapacity = comData.m_ProduceCapacity;
                commercialAvailables = comData.m_TotalAvailables;
                hasCommercialData = commercialCompanies.IsCreated && commercialCompanies.Length > 0;
            }
            catch { }

            int adjustCount = 0;
            int raiseCount = 0;
            int lowerCount = 0;
            int holdCount = 0;

            foreach (var kvp in ResourceKeyToEnum)
            {
                string key = kvp.Key;
                Resource resource = kvp.Value;
                if (!ResourceTaxAreaMap.TryGetValue(key, out var taxArea)) continue;
                if (!_resourceStates.TryGetValue(key, out var state)) continue;

                int resourceIndex = EconomyUtils.GetResourceIndex(resource);
                if (resourceIndex < 0) continue;

                // Read current game tax rate
                int currentRate;
                switch (taxArea)
                {
                    case ResourceTaxArea.Industrial:
                        currentRate = _taxSystem.GetIndustrialTaxRate(resource);
                        break;
                    case ResourceTaxArea.Commercial:
                        currentRate = _taxSystem.GetCommercialTaxRate(resource);
                        break;
                    case ResourceTaxArea.Office:
                        currentRate = _taxSystem.GetOfficeTaxRate(resource);
                        break;
                    default:
                        continue;
                }

                bool useCommercialData = taxArea == ResourceTaxArea.Office || taxArea == ResourceTaxArea.Commercial;

                // Calculate profitability score (-1.0 to +1.0)
                // Positive = companies thriving, can raise tax
                // Negative = companies struggling, should lower tax
                float profitabilityScore = 0f;

                // Factor 1: Production vs Consumption balance (surplus = good)
                int prodRaw = 0;
                int consRaw = 0;

                if (useCommercialData && hasCommercialData)
                {
                    if (resourceIndex < commercialCapacity.Length)
                        prodRaw = Math.Max(0, commercialCapacity[resourceIndex]);
                    if (resourceIndex < commercialAvailables.Length)
                        consRaw = Math.Max(0, commercialAvailables[resourceIndex]);
                }
                else
                {
                    if (hasProduction && resourceIndex < productionArray.Length)
                        prodRaw = Math.Max(0, productionArray[resourceIndex]);
                    if (hasIndustrialConsumption && resourceIndex < industrialConsumption.Length)
                        consRaw += Math.Max(0, industrialConsumption[resourceIndex]);
                    if (hasCommercialConsumption && resourceIndex < commercialConsumption.Length)
                        consRaw += Math.Max(0, commercialConsumption[resourceIndex]);
                }

                if (prodRaw > 0 || consRaw > 0)
                {
                    float balance = (prodRaw - consRaw) / (float)Math.Max(prodRaw, consRaw);
                    // Surplus (balance > 0): healthy, score positive. Deficit (balance < 0): struggling.
                    profitabilityScore += balance * 0.4f;
                }

                // Factor 2: Company count (0 companies = no activity, skip)
                int companies = 0;
                if (!useCommercialData && hasIndustrialData && resourceIndex < industrialCompanies.Length)
                    companies = Math.Max(0, industrialCompanies[resourceIndex]);
                if (useCommercialData && hasCommercialData && resourceIndex < commercialCompanies.Length)
                    companies = Math.Max(0, commercialCompanies[resourceIndex]);

                if (companies == 0)
                {
                    // No companies producing this resource — hold steady
                    state.Direction = 0;
                    state.Score = 0f;
                    holdCount++;
                    continue;
                }

                // Factor 3: Demand signal (high demand = companies can handle more tax)
                if (!useCommercialData && hasIndustrialData && industrialDemand.IsCreated && resourceIndex < industrialDemand.Length)
                {
                    int demandRaw = Math.Max(0, industrialDemand[resourceIndex]);
                    if (demandRaw > 0 && prodRaw > 0)
                    {
                        float demandRatio = demandRaw / (float)prodRaw;
                        profitabilityScore += Math.Min(0.3f, demandRatio * 0.15f);
                    }
                }

                // Factor 4: Taxable income signal (high income = companies profitable)
                if (_cityStatisticsSystem != null)
                {
                    StatisticType statType;
                    switch (taxArea)
                    {
                        case ResourceTaxArea.Industrial:
                            statType = StatisticType.IndustrialTaxableIncome;
                            break;
                        case ResourceTaxArea.Commercial:
                            statType = StatisticType.CommercialTaxableIncome;
                            break;
                        default:
                            statType = StatisticType.OfficeTaxableIncome;
                            break;
                    }

                    try
                    {
                        int taxableIncome = _cityStatisticsSystem.GetStatisticValue(statType, resourceIndex);
                        if (taxableIncome > 0)
                        {
                            // Per-company income as a health signal
                            float perCompanyIncome = taxableIncome / (float)companies;
                            // If per-company income > 1000, companies are doing well
                            float incomeScore = Math.Min(0.3f, Math.Max(-0.3f, (perCompanyIncome - 500f) / 2000f));
                            profitabilityScore += incomeScore;
                        }
                        else if (taxableIncome == 0 && currentRate > 0)
                        {
                            // No taxable income but tax rate > 0: companies may be struggling
                            profitabilityScore -= 0.15f;
                        }
                    }
                    catch { }
                }

                // Apply happiness weight
                // Blend profitability score with happiness bias
                float finalScore = profitabilityScore * (1f - happinessWeight) + happinessBias * happinessWeight;

                // Clamp final score
                finalScore = Math.Max(-1f, Math.Min(1f, finalScore));

                // Determine direction: only adjust by 1% per interval
                int direction = 0;
                if (finalScore > 0.1f && currentRate < maxRate)
                {
                    direction = 1; // Raise tax
                }
                else if (finalScore < -0.1f && currentRate > minRate)
                {
                    direction = -1; // Lower tax
                }

                state.Direction = direction;
                state.Score = finalScore;

                if (direction != 0)
                {
                    int newRate = currentRate + direction;
                    newRate = Math.Max(minRate, Math.Min(maxRate, newRate));

                    if (newRate != currentRate)
                    {
                        switch (taxArea)
                        {
                            case ResourceTaxArea.Industrial:
                                _taxSystem.SetIndustrialTaxRate(resource, newRate);
                                break;
                            case ResourceTaxArea.Commercial:
                                _taxSystem.SetCommercialTaxRate(resource, newRate);
                                break;
                            case ResourceTaxArea.Office:
                                _taxSystem.SetOfficeTaxRate(resource, newRate);
                                break;
                        }
                        adjustCount++;
                        if (direction > 0) raiseCount++;
                        else lowerCount++;
                    }
                }
                else
                {
                    holdCount++;
                }
            }

            // Update status string for UI
            string status = SerializeStatus(happiness, adjustCount, raiseCount, lowerCount, holdCount);
            _autoTaxStatus.Update(status);

            if (Mod.Settings?.DebugEnabled == true)
            {
                Mod.log.Info($"AutoTax: day={GetCurrentGameDay()} happiness={happiness} adjusted={adjustCount} (↑{raiseCount} ↓{lowerCount} →{holdCount})");
            }
        }

        private string SerializeStatus(int happiness, int adjustCount, int raiseCount, int lowerCount, int holdCount)
        {
            // Format: happiness|adjustCount|raiseCount|lowerCount|holdCount|perResourceDirections
            // Per-resource directions: key=direction:score,key=direction:score,...
            var parts = new List<string>
            {
                happiness.ToString(CultureInfo.InvariantCulture),
                adjustCount.ToString(CultureInfo.InvariantCulture),
                raiseCount.ToString(CultureInfo.InvariantCulture),
                lowerCount.ToString(CultureInfo.InvariantCulture),
                holdCount.ToString(CultureInfo.InvariantCulture)
            };

            var resourceParts = new List<string>();
            foreach (var kvp in _resourceStates)
            {
                if (kvp.Value.Direction != 0 || Math.Abs(kvp.Value.Score) > 0.01f)
                {
                    resourceParts.Add(string.Format(CultureInfo.InvariantCulture,
                        "{0}={1}:{2:0.##}", kvp.Key, kvp.Value.Direction, kvp.Value.Score));
                }
            }
            parts.Add(string.Join(",", resourceParts));

            return string.Join("|", parts);
        }

        private int GetCurrentGameDay()
        {
            if (_simulationSystem == null) return 0;
            try
            {
                return (int)(_simulationSystem.frameIndex / 262144);
            }
            catch
            {
                return 0;
            }
        }

        private void SetAutoTaxEnabled(bool enabled)
        {
            _autoTaxEnabled.Update(enabled);
            if (Mod.Settings != null)
            {
                Mod.Settings.AutoTaxEnabled = enabled;
                Mod.Settings.ApplyAndSave();
            }

            if (!enabled)
            {
                // Clear all auto-tax directions
                foreach (var state in _resourceStates.Values)
                {
                    state.Direction = 0;
                    state.Score = 0f;
                }
                _autoTaxStatus.Update("");
            }

            Mod.log.Info($"AutoTax: enabled={enabled}");
        }

        private class AutoTaxResourceState
        {
            public int Direction { get; set; }   // -1 = lowering, 0 = hold, +1 = raising
            public float Score { get; set; }      // -1.0 to +1.0 profitability score
        }
    }
}
