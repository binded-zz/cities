import React, { useState } from 'react';
import ResourceRow from './ResourceRow';
import ProductionDisplay from './ProductionDisplay';
import TaxSlider from './TaxSlider';

declare const engine: any;

const TaxProductionWindow = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [resourceValue, setResourceValue] = useState(50);

    const handleClose = () => {
        if (typeof engine !== 'undefined') {
            engine.trigger('taxProduction.toggleWindow');
        }
    };

    return (
        <div className="tax-production-window">
            <div className="window-header">
                <span>Tax &amp; Production</span>
                <button className="close-btn" onClick={handleClose}>✕</button>
            </div>
            <div className="tabs">
                <button className={activeTab === 0 ? 'active' : ''} onClick={() => setActiveTab(0)}>Resources</button>
                <button className={activeTab === 1 ? 'active' : ''} onClick={() => setActiveTab(1)}>Production</button>
                <button className={activeTab === 2 ? 'active' : ''} onClick={() => setActiveTab(2)}>Tax</button>
            </div>
            <div className="tab-content">
                {activeTab === 0 && (
                    <ResourceRow
                        title="Resource Rate"
                        value={resourceValue}
                        onChange={setResourceValue}
                    />
                )}
                {activeTab === 1 && <ProductionDisplay />}
                {activeTab === 2 && <TaxSlider />}
            </div>
        </div>
    );
};

export default TaxProductionWindow;