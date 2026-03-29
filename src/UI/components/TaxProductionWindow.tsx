import React, { useState } from 'react';
import ResourceRow from './ResourceRow';
import ProductionDisplay from './ProductionDisplay';
import TaxSlider from './TaxSlider';

const TaxProductionWindow = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [resourceValue, setResourceValue] = useState(50);

    return (
        <div>
            <div className="tabs">
                <button onClick={() => setActiveTab(0)}>Resources</button>
                <button onClick={() => setActiveTab(1)}>Production</button>
                <button onClick={() => setActiveTab(2)}>Tax</button>
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