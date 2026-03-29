import React, { useState, useEffect } from 'react';
import TaxProductionWindow from './UI/components/TaxProductionWindow';
import ToolbarButton from './UI/components/ToolbarButton';
import SettingsPanel from './UI/components/SettingsPanel';
import './App.css';

declare const engine: any;

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);

  useEffect(() => {
    if (typeof engine !== 'undefined') {
      engine.on('taxProduction.isVisible',      (v: boolean) => setIsVisible(v));
      engine.on('taxProduction.settingsVisible', (v: boolean) => setSettingsVisible(v));
      engine.on('taxProduction.buttonEnabled',   (v: boolean) => setButtonEnabled(v));
    }
    return () => {
      if (typeof engine !== 'undefined') {
        engine.off('taxProduction.isVisible');
        engine.off('taxProduction.settingsVisible');
        engine.off('taxProduction.buttonEnabled');
      }
    };
  }, []);

  const handleToolbarClick = () => {
    if (typeof engine !== 'undefined') {
      engine.trigger('taxProduction.toggleWindow');
    } else {
      setIsVisible(v => !v);
    }
  };

  const handleSettingsClick = () => {
    if (typeof engine !== 'undefined') {
      engine.trigger('taxProduction.toggleSettings');
    } else {
      setSettingsVisible(v => !v);
    }
  };

  return (
    <>
      {buttonEnabled && (
        <ToolbarButton
          onClick={handleToolbarClick}
          onSettingsClick={handleSettingsClick}
          isActive={isVisible}
        />
      )}
      {settingsVisible && (
        <SettingsPanel
          buttonEnabled={buttonEnabled}
          onClose={handleSettingsClick}
        />
      )}
      {isVisible && <TaxProductionWindow />}
    </>
  );
};

export default App;
