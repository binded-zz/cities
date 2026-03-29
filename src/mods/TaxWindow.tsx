import { useValue, trigger } from "cs2/api";
import React from "react";
import TaxProductionWindow from "../UI/components/TaxProductionWindow";
import SettingsPanel from "../UI/components/SettingsPanel";
import { isVisible$, settingsVisible$, buttonEnabled$, taxRate$ } from "./bindings";

const TaxWindow: React.FC = () => {
    const isVisible = useValue(isVisible$);
    const settingsVisible = useValue(settingsVisible$);
    const buttonEnabled = useValue(buttonEnabled$);
    const taxRate = useValue(taxRate$);

    if (!buttonEnabled) return null;

    return (
        <>
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

export default TaxWindow;
