import React, { useState } from 'react';

import TaxSlider from './TaxSlider';
import ResourceRow from './ResourceRow';
import ProductionDisplay from './ProductionDisplay';

const TaxProductionWindow = () => {
    const [activeTab, setActiveTab] = useState('Resources');

    return (
        <div>
            <div className="tab-buttons">
                <button onClick={() => setActiveTab('Resources')} className={activeTab === 'Resources' ? 'active' : ''}>Resources</button>
                <button onClick={() => setActiveTab('Statistics')} className={activeTab === 'Statistics' ? 'active' : ''}>Statistics</button>
                <button onClick={() => setActiveTab('Tax Settings')} className={activeTab === 'Tax Settings' ? 'active' : ''}>Tax Settings</button>
            </div>
            <div className="tab-content">
                {activeTab === 'Resources' && <ResourceRow />}
                {activeTab === 'Statistics' && <ProductionDisplay />}
                {activeTab === 'Tax Settings' && <TaxSlider />}
            </div>
        </div>
    );
};

export default TaxProductionWindow;