import React, { useState, useEffect } from 'react';
import TaxProductionWindow from './UI/components/TaxProductionWindow';
import './App.css';

declare const engine: any;

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof engine !== 'undefined') {
      engine.on('taxProduction.isVisible', (value: boolean) => setIsVisible(value));
    }
    return () => {
      if (typeof engine !== 'undefined') {
        engine.off('taxProduction.isVisible');
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="app-container">
      <TaxProductionWindow />
    </div>
  );
};

export default App;
