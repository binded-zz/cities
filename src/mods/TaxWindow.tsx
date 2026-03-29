import { useValue, trigger } from "cs2/api";
import React, { useEffect } from "react";
import TaxProductionWindow from "../UI/components/TaxProductionWindow";
import SettingsPanel from "../UI/components/SettingsPanel";
import { isVisible$, settingsVisible$, buttonEnabled$, taxRate$ } from "./bindings";

const TaxWindow: React.FC = () => {
    const isVisible = useValue(isVisible$);
    const settingsVisible = useValue(settingsVisible$);
    const buttonEnabled = useValue(buttonEnabled$);
    const taxRate = useValue(taxRate$);

    useEffect(() => {
        console.error("[TaxWindow] mounted — buttonEnabled=", buttonEnabled);
    }, []);

    useEffect(() => {
        console.error("[TaxWindow] state — isVisible=", isVisible, "settingsVisible=", settingsVisible, "buttonEnabled=", buttonEnabled, "taxRate=", taxRate);
    }, [isVisible, settingsVisible, buttonEnabled, taxRate]);

    if (!buttonEnabled) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}>
            {isVisible && (
                <div style={{ pointerEvents: 'auto' }}>
                    <TaxProductionWindow
                        taxRate={taxRate}
                        onTaxRateChange={(rate: number) => trigger('taxProduction', 'setTaxRate', rate)}
                        onClose={() => trigger('taxProduction', 'toggleWindow')}
                    />
                </div>
            )}
            {settingsVisible && (
                <div style={{ pointerEvents: 'auto' }}>
                    <SettingsPanel
                        buttonEnabled={buttonEnabled}
                        onButtonEnabledChange={(v: boolean) => trigger('taxProduction', 'setButtonEnabled', v)}
                        onClose={() => trigger('taxProduction', 'toggleSettings')}
                    />
                </div>
            )}
        </div>
    );
};

export default TaxWindow;
