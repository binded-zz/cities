import React, { useState } from 'react';
import './SettingsPanel.css';

interface SettingsPanelProps {
    buttonEnabled: boolean;
    onButtonEnabledChange: (value: boolean) => void;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ buttonEnabled, onButtonEnabledChange, onClose }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'about'>('general');

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
                                onChange={(e) => onButtonEnabledChange(e.target.checked)}
                            />
                            <span>Enable toolbar button</span>
                        </label>
                        <p className="settings-hint">
                            Uncheck to hide the toolbar button. Recheck via Options → Mods.
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
