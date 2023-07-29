import React, { useEffect } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';

const LeftColumn = ({ handleCheckboxChange }) => {
  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);

  return (
    <div
      style={{
        width: '300px',
        backgroundColor: '#ebf2fa',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'Arial, sans-serif', // Set the font family
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ marginBottom: '20px', color: '#333333', fontSize: '24px', fontWeight: 'bold' }}>
          Chart Options
        </h2>
        <Tooltip title="Choose to display the view you want to see" trigger="click" defaultOpen>
          <QuestionCircleTwoTone />
        </Tooltip>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Checkbox
          name="sankey"
          style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif' }} // Set the font family and size
          onChange={(e) => handleCheckboxChange('sankey', e.target.checked)}
          defaultChecked // Set this to true to make the checkbox checked by default
        >
          Patient Flow View
        </Checkbox>

        <Checkbox
          name="heatmap"
          style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif' }} // Set the font family and size
          onChange={(e) => handleCheckboxChange('heatmap', e.target.checked)}
        >
          Resource Usage View
        </Checkbox>

        <Checkbox
          name="patientTrend"
          style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif' }} // Set the font family and size
          onChange={(e) => handleCheckboxChange('patientTrend', e.target.checked)}
        >
          Patient Number Trend
        </Checkbox>

        <Checkbox
          name="timeSpent"
          style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif' }} // Set the font family and size
          onChange={(e) => handleCheckboxChange('timeSpent', e.target.checked)}
        >
          Exploring Outliers in Patient Times
        </Checkbox>
        {/* Add other checkboxes for different chart options */}
      </div>
    </div>
  );
};

export default LeftColumn;

