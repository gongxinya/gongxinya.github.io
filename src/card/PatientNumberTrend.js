import React, { useState, useContext } from 'react';
import { TaskNameContext } from '../GlobalContext';
import { Tooltip } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';

import StackedArea from '../components/StackedArea';
import LineChart from '../components/LineChart';


const PatientNumberTrend = ({onTaskChange}) => {
  // Update the task whenever the selected task changes
  const handleTaskChange = (newValue) => {
    onTaskChange(newValue)
  };

  return (
    
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'alignItems',
          color: '#333333', // Set the text color
        }}
      >
        <h2 style={{ marginLeft: '30px', marginTop: '30px', marginBottom: '10px', color: '#333333' }}>
          Patient number trend
        </h2>
        <div
          style={{ marginLeft: '30px',flexDirection: 'row' }}>
          <b>Number of patients over time for different tasks</b>
          <Tooltip title="The stacked chart shows cumulative people for different tasks over time, while the lower line graph displays patient inflow, outflow, and cumulative numbers for a task. Click on colors in the stacked chart to filter the corresponding line chart. Use the time selector at the bottom to choose the display time range." placement="right" trigger="click" defaultClose>
            <QuestionCircleTwoTone />
          </Tooltip>
        </div>
        <StackedArea onTaskChange={handleTaskChange} />
        <LineChart />
      </div>
  );

};

export default PatientNumberTrend;