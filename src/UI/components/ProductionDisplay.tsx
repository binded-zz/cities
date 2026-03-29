import React from 'react';

const ProductionDisplay = () => {
    // Sample data for production statistics
    const productionStats = [
        { product: 'Product A', quantity: 120, target: 150 },
        { product: 'Product B', quantity: 90, target: 100 },
        { product: 'Product C', quantity: 60, target: 75 },
    ];

    return (
        <div className="production-display">
            <h2>Production Statistics</h2>
            <div className="statistics-grid">
                {productionStats.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <h4>{stat.product}</h4>
                        <p>Quantity Produced: {stat.quantity}</p>
                        <p>Target: {stat.target}</p>
                        <progress value={(stat.quantity / stat.target) * 100} max={100} />
                        <span>{Math.round((stat.quantity / stat.target) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductionDisplay;
