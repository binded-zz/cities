import { useValue, trigger } from "cs2/api";
import React from "react";
import ToolbarButton from "../UI/components/ToolbarButton";
import { isVisible$, buttonEnabled$ } from "./bindings";

const TaxMod: React.FC = () => {
    const isVisible = useValue(isVisible$);
    const buttonEnabled = useValue(buttonEnabled$);

    if (!buttonEnabled) return null;

    return (
        <ToolbarButton
            onClick={() => trigger('taxProduction', 'toggleWindow')}
            onSettingsClick={() => trigger('taxProduction', 'toggleSettings')}
            isActive={isVisible}
        />
    );
};

export default TaxMod;
