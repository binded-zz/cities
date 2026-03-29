import React, { useState } from 'react';
import ResourceRow from './ResourceRow';
import ProductionDisplay from './ProductionDisplay';
import TaxSlider from './TaxSlider';
import './TaxProductionWindow.css';

interface TaxProductionWindowProps {
    taxRate: number;
    onTaxRateChange: (rate: number) => void;
    onClose: () => void;
}

const TaxProductionWindow: React.FC<TaxProductionWindowProps> = ({ taxRate, onTaxRateChange, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [resourceValue, setResourceValue] = useState(50);

    return (
        <div className="tax-production-window">
            <div className="window-header">
                <span>Tax &amp; Production</span>
                <button className="close-btn" onClick={onClose}>✕</button>
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
                {activeTab === 2 && (
                    <TaxSlider
                        taxRate={taxRate}
                        onTaxRateChange={onTaxRateChange}
                    />
                )}
            </div>
        </div>
    );
};

export default TaxProductionWindow;