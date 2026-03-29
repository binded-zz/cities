import React, { useState } from 'react';
import './TaxSlider.css';

const TaxSlider = () => {
    const [taxRate, setTaxRate] = useState(0);
    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value < 0 || value > 100) {
            setError('Tax rate must be between 0 and 100');
        } else {
            setError('');
            setTaxRate(value);
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