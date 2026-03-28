import React from 'react';
import TaxProductionWindow from './UI/components/TaxProductionWindow';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Cities: Skylines 2 - Tax & Production Mod</h1>
        <p>Manage your city's economy efficiently</p>
      </header>
      <main className="app-main">
        <TaxProductionWindow />
      </main>
    </div>
  );
};

export default App;
