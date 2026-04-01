# Cities TPM Reference Pattern Map (Step 1)

## Goal
Map concrete architecture patterns from requested reference repos into implementation targets for this project.

## Requested Reference Repos and Extracted Patterns

### 1) `thiago-rcarvalho/cs2-parking-fee-control`
- Pattern: dual stack (`C#` mod backend + `TypeScript`/`React` UI module).
- Pattern: `net472`-style CS2 compatibility and game-managed DLL references.
- Pattern: settings/options and UI alignment for a compact control panel workflow.
- Pattern to adopt in TPM: Parking-style second interface shell and options-driven UI mode selection.

### 2) `rcav8tr/CS2-Modding-Instructions`
- Pattern: project/publish structure discipline (`mod metadata`, publish config, reference conventions).
- Pattern to adopt in TPM: standardize project metadata, build/deploy flow, and options/settings integration points.

### 3) `optimus-code/Cities2Modding`
- Pattern: CS2 runtime/library setup guidance and non-copy-local reference practice.
- Pattern to adopt in TPM: keep CS2-managed assemblies external and maintain runtime-compatible target framework.

### 4) `rcav8tr/CS2Mod-BuildingUse`
- Pattern: rich option surfaces with grouped user controls and visualization modes.
- Pattern: modular folders (`Data`, `Localization`, `ModSettings`, `Systems`, `UI`).
- Pattern to adopt in TPM: grouped settings UX (General, UI mode, Debug) and view-mode-driven data presentation.

### 5) `rcav8tr/CS2Mod-ResourceLocator`
- Pattern: resource taxonomy and grouped resource display concepts.
- Pattern: resource visualization logic with selectable display modes.
- Pattern to adopt in TPM: resource-chain grouping (raw -> industrial -> retail), icon/category mapping, and mode filters.

### 6) `rcav8tr/CS2Mod-ShowMoreHappiness`
- Pattern: options-heavy mod with clear defaults/reset behavior.
- Pattern to adopt in TPM: robust defaults + reset actions in options and predictable persistence.

### 7) `rcav8tr/CS2Mod-ChangeCompany`
- Pattern: advanced options with debug/statistics style surfaces and operational toggles.
- Pattern to adopt in TPM: debug section with diagnostics toggles and runtime state controls.

### 8) `rcav8tr/CS2Mod-IBLIV`
- Pattern: customized infoview UX with selector-driven display behavior.
- Pattern to adopt in TPM: mode-specific selectors for alternative tax-chain visual views.

### 9) `bruceyboy24804/InfoLoom`
- Pattern: larger-scale mixed C# + TypeScript UI architecture.
- Pattern to adopt in TPM: scalable UI composition and toolbar/icon consistency conventions.

### 10) `bruceyboy24804/No-Pollution`
- Pattern: minimal focused gameplay system modification architecture.
- Pattern to adopt in TPM: keep backend systems narrow and stable while UI iterates faster.

### 11) `SteelCodeTeam/CityStats`
- Pattern: lightweight real-time metric display model.
- Pattern to adopt in TPM: straightforward live counters/debug readouts for production/tax telemetry.

## Mapping to Current Workspace

### Current Files Relevant to Pattern Integration
- C#: `src/ModEntry.cs`, `src/Systems/TaxingProductionUISystem.cs`, `cities/cities.csproj`
- UI: `src/index.tsx`, `src/mods/TaxMod.tsx`, `src/mods/TaxWindow.tsx`, `src/UI/components/*`
- Metadata: `mod.json`, `README.md`

### Step-1 Integration Targets Identified
1. Add formal settings backend class for options menu sections and persistence.
2. Bind settings values to runtime UI state and toggles via C# bindings.
3. Add UI mode switch (`Compact`, `ParkingStyle`) in options and runtime bindings.
4. Introduce debug toggle set and lightweight diagnostics in bindings/system logs.
5. Restructure/expand UI shell into dual interface routing with shared state.
6. Add resource taxonomy model and icon/category mapping scaffold.
7. Normalize branding/labels to `Cities TPM - Tax & Production Management` while preserving current mod-id compatibility.
8. Resize toolbar icon/button to standard visual scale and keep single clean entry.

## Constraints and Guardrails
- Keep `mod id` stable for now unless explicit migration step is approved.
- Avoid adding game-managed assemblies to output.
- Keep runtime target compatibility consistent with current working load path.
- Implement in incremental steps with build/deploy validation after each major phase.

## Step-1 Output
This file is the reference map used as the source for Step-2 contract definition and subsequent implementation steps.
