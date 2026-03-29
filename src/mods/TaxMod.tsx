import { useValue, trigger } from "cs2/api";
import React, { useEffect } from "react";
import ToolbarButton from "../UI/components/ToolbarButton";
import { isVisible$, buttonEnabled$ } from "./bindings";

const TaxMod: React.FC = () => {
    const isVisible = useValue(isVisible$);
    const buttonEnabled = useValue(buttonEnabled$);

    useEffect(() => {
        console.error("[TaxMod] mounted — buttonEnabled=", buttonEnabled, "isVisible=", isVisible);
    }, []);

    useEffect(() => {
        console.error("[TaxMod] state — buttonEnabled=", buttonEnabled, "isVisible=", isVisible);
    }, [buttonEnabled, isVisible]);

    if (!buttonEnabled) return null;

    const handleClick = () => {
        console.error("[TaxMod] toggleWindow triggered");
        trigger('taxProduction', 'toggleWindow');
    };

    const handleSettingsClick = () => {
        console.error("[TaxMod] toggleSettings triggered");
        trigger('taxProduction', 'toggleSettings');
    };

    return (
        <ToolbarButton
            onClick={handleClick}
            onSettingsClick={handleSettingsClick}
            isActive={isVisible}
        />
    );
};

export default TaxMod;
