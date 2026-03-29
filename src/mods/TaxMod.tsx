import { bindValue, useValue, trigger } from "cs2/api";
import React from "react";
import ToolbarButton from "../UI/components/ToolbarButton";
import TaxProductionWindow from "../UI/components/TaxProductionWindow";
import SettingsPanel from "../UI/components/SettingsPanel";

const isVisible$ = bindValue<boolean>('taxProduction', 'isVisible', false);
const settingsVisible$ = bindValue<boolean>('taxProduction', 'settingsVisible', false);
const buttonEnabled$ = bindValue<boolean>('taxProduction', 'buttonEnabled', true);
const taxRate$ = bindValue<number>('taxProduction', 'taxRate', 0);

const TaxMod: React.FC = () => {
    const isVisible = useValue(isVisible$);
    const settingsVisible = useValue(settingsVisible$);
    const buttonEnabled = useValue(buttonEnabled$);
    const taxRate = useValue(taxRate$);

    if (!buttonEnabled) return null;

    return (
        <>
            <ToolbarButton
                onClick={() => trigger('taxProduction', 'toggleWindow')}
                onSettingsClick={() => trigger('taxProduction', 'toggleSettings')}
                isActive={isVisible}
            />
            {isVisible && (
                <TaxProductionWindow
                    taxRate={taxRate}
                    onTaxRateChange={(rate: number) => trigger('taxProduction', 'setTaxRate', rate)}
                    onClose={() => trigger('taxProduction', 'toggleWindow')}
                />
            )}
            {settingsVisible && (
                <SettingsPanel
                    buttonEnabled={buttonEnabled}
                    onButtonEnabledChange={(v: boolean) => trigger('taxProduction', 'setButtonEnabled', v)}
                    onClose={() => trigger('taxProduction', 'toggleSettings')}
                />
            )}
        </>
    );
};

export default TaxMod;
