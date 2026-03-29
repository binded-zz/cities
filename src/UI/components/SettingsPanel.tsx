import React, { useState } from 'react';
import './SettingsPanel.css';

declare const engine: any;

interface SettingsPanelProps {
    buttonEnabled: boolean;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ buttonEnabled, onClose }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'about'>('general');

    const handleButtonEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        if (typeof engine !== 'undefined') {
            engine.trigger('taxProduction.setButtonEnabled', value);
        }
    };

    return (
        <div className="settings-panel">
            <div className="settings-header">
                <span>⚙ Settings — Tax &amp; Production</span>
                <button className="settings-close-btn" onClick={onClose}>✕</button>
            </div>
            <div className="settings-tabs">
                <button
                    className={`settings-tab${activeTab === 'general' ? ' active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                </button>
                <button
                    className={`settings-tab${activeTab === 'about' ? ' active' : ''}`}
                    onClick={() => setActiveTab('about')}
                >
                    About
                </button>
            </div>
            <div className="settings-content">
                {activeTab === 'general' && (
                    <div className="settings-section">
                        <h3>Toolbar</h3>
                        <label className="settings-checkbox-row">
                            <input
                                type="checkbox"
                                checked={buttonEnabled}
                                onChange={handleButtonEnabledChange}
                            />
                            <span>Enable toolbar button</span>
                        </label>
                        <p className="settings-hint">
                            Uncheck to hide the toolbar button. Recheck to show it again.
                        </p>
                    </div>
                )}
                {activeTab === 'about' && (
                    <div className="settings-section">
                        <h3>Tax &amp; Production Mod</h3>
                        <p>Version: <strong>1.0.0</strong></p>
                        <p>Author: <strong>binded-zz</strong></p>
                        <p className="settings-hint">
                            Manage your city's tax rates and monitor production statistics
                            from a single convenient panel.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPanel;
