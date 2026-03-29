import React from 'react';
import TaxIcon from '../assets/TaxIcon';
import './ToolbarButton.css';

interface ToolbarButtonProps {
    onClick: () => void;
    onSettingsClick: () => void;
    isActive: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, onSettingsClick, isActive }) => {
    return (
        <div className="toolbar-button-wrapper">
            <button
                className={`toolbar-btn${isActive ? ' active' : ''}`}
                onClick={onClick}
                title="Tax & Production Mod"
            >
                <TaxIcon size={20} color={isActive ? '#4fc3f7' : '#ffffff'} />
            </button>
            <button
                className="toolbar-settings-btn"
                onClick={onSettingsClick}
                title="Settings"
            >
                ⚙
            </button>
        </div>
    );
};

export default ToolbarButton;
