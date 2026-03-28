import React from 'react';
import Slider from '@material-ui/core/Slider';

interface ResourceRowProps {
  title: string;
  value: number;
  onChange: (newValue: number) => void;
}

const ResourceRow: React.FC<ResourceRowProps> = ({ title, value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: '10px' }}>{title}:</span>
      <Slider
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        aria-labelledby="continuous-slider"
      />
    </div>
  );
};

export default ResourceRow;