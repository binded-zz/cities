import { bindValue } from "cs2/api";

export const advancedVisible$ = bindValue<boolean>('taxProduction', 'advancedVisible', false);
export const globalTaxRate$ = bindValue<number>('taxProduction', 'globalTaxRate', 15);
export const selectedResourceCategory$ = bindValue<string>('taxProduction', 'selectedResourceCategory', 'All');
export const debugEnabled$ = bindValue<boolean>('taxProduction', 'debugEnabled', false);
export const debugPanelVisible$ = bindValue<boolean>('taxProduction', 'debugPanelVisible', false);
export const showTips$ = bindValue<boolean>('taxProduction', 'showTips', true);
export const debugLastAction$ = bindValue<string>('taxProduction', 'debugLastAction', 'init');
export const advancedWindowX$ = bindValue<number>('taxProduction', 'advancedWindowX', 140);
export const advancedWindowY$ = bindValue<number>('taxProduction', 'advancedWindowY', 150);
export const advancedWindowWidth$ = bindValue<number>('taxProduction', 'advancedWindowWidth', 520);
export const advancedWindowHeight$ = bindValue<number>('taxProduction', 'advancedWindowHeight', 420);
export const resourceRowsData$ = bindValue<string>('taxProduction', 'resourceRowsData', '');

// Auto-Tax bindings
export const autoTaxEnabled$ = bindValue<boolean>('taxProduction', 'autoTaxEnabled', false);
export const autoTaxStatus$ = bindValue<string>('taxProduction', 'autoTaxStatus', '');
export const autoTaxSettings$ = bindValue<string>('taxProduction', 'autoTaxSettings', '5|0|25|50|2|');

// Company Browser bindings
export const companyBrowserData$ = bindValue<string>('taxProduction', 'companyBrowserData', '');

// Adaptive Learning / Advisor bindings
export const learningEnabled$ = bindValue<boolean>('taxProduction', 'learningEnabled', false);
export const advisorData$ = bindValue<string>('taxProduction', 'advisorData', '');
export const decisionLogData$ = bindValue<string>('taxProduction', 'decisionLogData', '');
export const learningStats$ = bindValue<string>('taxProduction', 'learningStats', '');
