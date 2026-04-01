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
