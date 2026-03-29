import React from 'react';

interface ResourceRowProps {
  title: string;
  value: number;
  onChange: (newValue: number) => void;
}

const ResourceRow: React.FC<ResourceRowProps> = ({ title, value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: '10px' }}>{title}:</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={title}
      />
      <span style={{ marginLeft: '10px' }}>{value}</span>
    </div>
  );
};

export default ResourceRow;