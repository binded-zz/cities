import React, { useState } from 'react';
import './TaxSlider.css';

interface TaxSliderProps {
    taxRate: number;
    onTaxRateChange: (rate: number) => void;
}

const TaxSlider: React.FC<TaxSliderProps> = ({ taxRate, onTaxRateChange }) => {
    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (value < 0 || value > 100) {
            setError('Tax rate must be between 0 and 100');
        } else {
            setError('');
            onTaxRateChange(value);
        }
    };

    return (
        <div className="tax-slider">
            <label htmlFor="taxRate">Tax Rate: {taxRate}%</label>
            <input
                type="range"
                id="taxRate"
                min="0"
                max="100"
                value={taxRate}
                onChange={handleChange}
            />
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default TaxSlider;