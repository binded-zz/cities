import { bindValue } from "cs2/api";

export const isVisible$ = bindValue<boolean>('taxProduction', 'isVisible', false);
export const settingsVisible$ = bindValue<boolean>('taxProduction', 'settingsVisible', false);
export const buttonEnabled$ = bindValue<boolean>('taxProduction', 'buttonEnabled', true);
export const taxRate$ = bindValue<number>('taxProduction', 'taxRate', 0);
