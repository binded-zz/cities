# Cities TPM Feature Contract (Step 2)

## Product Name
`Cities TPM - Tax & Production Management`

## Purpose
Manage taxes in relation to production across the resource chain, with multiple chain views and two switchable UI modes.

## MVP Scope

### 1) Tax + Production Domain
- Manage tax rates by resource-chain stage:
  - `RawResource`
  - `Industrial`
  - `Retail`
- Support grouped tax controls by resource category.
- Expose summarized production/tax metrics for current city state.

### 2) Dual UI System
- UI Mode A: `Compact` (existing TPM panel evolution).
- UI Mode B: `ParkingStyle` (layout and interaction style inspired by Parking Fee Control patterns).
- User can switch modes from mod settings/options.
- Mode switch updates runtime bindings immediately.

### 3) Options Menu Settings Page
- Top-level mod settings page in game options.
- Required groups/tabs:
  - `General`
  - `About`
  - `UI`
  - `Debug`
- Includes reset/default behavior and persisted settings.

### 4) Debug System
- Toggle debug logging.
- Toggle diagnostics overlay/section visibility.
- Runtime counters for binding state and latest trigger actions.

### 5) Resource Taxonomy + Visuals
- Introduce resource grouping model informed by ResourceLocator-style taxonomy patterns.
- Add resource icon mapping scaffold and category metadata.
- Render chain rows with stage-aware tax sliders.

### 6) Toolbar Integration
- Single mod toolbar entry only.
- Resize icon/button to match common CS2 mod toolbar visual scale.

## Out of Scope (for MVP)
- Full city economy balancing automation.
- Deep company mutation mechanics.
- Nonessential infoview patching beyond TPM UI and options.

## Runtime API Contract (C# <-> UI)

### Binding Group
`taxProduction`

### Value Bindings
- `isVisible: bool`
- `buttonEnabled: bool`
- `uiMode: string` (`Compact` | `ParkingStyle`)
- `debugEnabled: bool`
- `debugPanelVisible: bool`
- `selectedChainView: string` (`Resource` | `Industrial` | `Retail`)
- `selectedResourceCategory: string`
- `globalTaxRate: int` (0..100)
- `resourceTaxRates: map<string,int>` (phase-2; can be serialized in phase-1)

### Triggers
- `toggleWindow()`
- `setButtonEnabled(bool enabled)`
- `setUIMode(string mode)`
- `setDebugEnabled(bool enabled)`
- `toggleDebugPanel()`
- `setChainView(string view)`
- `setResourceCategory(string category)`
- `setGlobalTaxRate(int rate)`
- `setResourceTaxRate(string key, int rate)`
- `resetDefaults()`

## Settings Contract (C#)

### Class
`TPMModSettings` (name tentative; keep namespace stable)

### Groups
- `General`
  - `ButtonEnabled`
  - `DefaultGlobalTaxRate`
- `UI`
  - `UIMode`
  - `DefaultChainView`
- `Debug`
  - `DebugEnabled`
  - `ShowDebugPanel`
- `About`
  - version/author/read-only text

### Behavior
- Load on mod startup.
- Apply to value bindings at UI system initialization.
- Changes persist and reflect immediately in bindings.

## Data Model Contract

### Resource Category
- `id: string`
- `label: string`
- `iconKey: string`
- `resources: ResourceItem[]`

### Resource Item
- `key: string`
- `label: string`
- `stage: RawResource|Industrial|Retail`
- `defaultTaxRate: int`

### Tax Chain View Model
- `view: Resource|Industrial|Retail`
- `rows: TaxChainRow[]`

### Tax Chain Row
- `resourceKey: string`
- `resourceLabel: string`
- `stage: string`
- `taxRate: int`
- `productionMetric: number`

## File-Level Implementation Targets (Next Steps)
- `src/ModEntry.cs`: rename display constants and settings bootstrap wiring.
- `src/Systems/TaxingProductionUISystem.cs`: expand bindings/triggers to contract.
- `cities/cities.csproj`: include new settings and model files.
- `src/mods/bindings.ts`: add new bindings.
- `src/mods/TaxMod.tsx`, `src/mods/TaxWindow.tsx`: UI mode route + toolbar behavior.
- `src/UI/components/*`: add mode-specific shell, chain views, debug panel.
- `mod.json`, `README.md`: product naming updates.

## Acceptance Criteria for Contract Completion
1. Mod options page exposes General/About/UI/Debug sections.
2. UI mode switch in options changes active interface at runtime.
3. Main window opens in selected mode and shows tax-chain controls.
4. Debug toggles and diagnostics work without breaking normal flow.
5. Single correctly sized toolbar button is shown.
6. Build/deploy remains successful and load-stable.
