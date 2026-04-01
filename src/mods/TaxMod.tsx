import { useValue, trigger } from "cs2/api";
import React from "react";
import ToolbarButton from "../UI/components/ToolbarButton";
import { advancedVisible$ } from "./bindings";

const TaxMod: React.FC = () => {
    const advancedVisible = useValue(advancedVisible$) ?? false;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ToolbarButton
                onClick={() => trigger('taxProduction', 'toggleAdvancedWindow')}
                isActive={advancedVisible}
                title="Advanced Tax & Production Manager"
            />
        </div>
    );
};

export default TaxMod;
