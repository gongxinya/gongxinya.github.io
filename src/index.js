import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import './css/style.css';
import './css/sankey.css'; // Import the CSS file
import SliderIcon from './icon/slider.png'


import { RangeContext, TaskNameContext } from './GlobalContext';

import LeftColumn from './components/LeftColumn';
import DraggableCard from './DraggableCard';
import RangeSliderComponent from './components/RangeSlider';
import Sankey from "./components/Sankey";
import StackedArea from "./components/StackedArea";
import LineChart from "./components/LineChart";


import PatientFlow from './card/PatientFlow';
import PatientNumberTrend from './card/PatientNumberTrend';
import ResourceOccupationCard from './card/ResourceOccupation';
import TaskTimeSpentCard from './card/TaskTimeSpent';
import * as d3 from 'd3';

import dateData from './data/tick_data.json';


const maxValue = Math.max(...dateData);
const minValue = Math.min(...dateData);


const App = () => {
  const [range, setRange] = useState([minValue, maxValue]); // Initial range value
  const [selectedTask, setSelectedTask] = useState("Treatment"); // Initial task name

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSankey, setShowSankey] = useState(false);
  const [showTimeSpent, setShowTimeSpent] = useState(false);
  const [showPatientTrend, setShowPatientTrend] = useState(true);
  const [showSlider, setShowSlider] = useState();
  const rangeSliderRef = useRef(null);

  // console.log(range)

  // Update the range whenever the slider value changes
  const handleRangeChange = (newValue) => {
    setRange(newValue);
  };

  // Update the range whenever the slider value changes
  const handleTaskChange = (newValue) => {
    setSelectedTask(newValue);
  };



  // Handle the checkbox changes for different chart options
  const handleCheckboxChange = (chartName, checked) => {
    if (chartName === 'heatmap') {
      setShowHeatmap(checked);
    } if (chartName === 'sankey') {
      setShowSankey(checked);
    } if (chartName === 'patientTrend') {
      setShowPatientTrend(checked);
    } else if (chartName === 'timeSpent') {
      setShowTimeSpent(checked);
    }
    // Exploring Outliers in Patient Waiting Times
  };

  const toggleSlider = () => {
    setShowSlider((prevShowSlider) => !prevShowSlider);
  };

  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);


  return (
    <RangeContext.Provider value={range}>
      <TaskNameContext.Provider value={selectedTask}>
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#333333',
            textTransform: 'uppercase',
            marginTop: '60px',
            fontSize: '36px', // Increase the font size for the heading
          }}
        >
          Hospital Simulation Data Dashboard
        </h1>


        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            marginBottom: '0px',
            backgroundColor: '#f9f9f9', // Change the background color of the dashboard
            minHeight: '100vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'row', // Make the content side-by-side
          }}
        >
          {/* Add the LeftColumn component */}
          <LeftColumn handleCheckboxChange={handleCheckboxChange} />

          {/* Add the RightColumn component */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1, // Take the remaining space
              maxWidth: '2000px', // Set the maximum width for the right column
              margin: '0 auto', // Center the right column within the screen
            }}
          >
            {showSankey && (<PatientFlow/>)}
            {showHeatmap && (<ResourceOccupationCard />)}
            {showPatientTrend && (<PatientNumberTrend onTaskChange={handleTaskChange}/>)}
            {showTimeSpent && <TaskTimeSpentCard />}

            {/* Use the ref and conditionally render the RangeSliderComponent */}
            <div className={`rangeSliderContainer ${showSlider ? 'open' : ''}`} ref={rangeSliderRef}>
              <div
                style={{
                  backgroundColor: '#ffffff00',
                  padding: '20px',
                  borderRadius: '5px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <RangeSliderComponent onRangeChange={handleRangeChange} />
              </div>
            </div>
          </div>
        </div>


        {/* Use the ref and click event to toggle the slider */}
        <div
          className="drawer-toggle"
          onClick={toggleSlider}
          style={{ position: 'fixed', bottom: 0, left: 0, width: '100px', height: '100px', background: '#95d09b', cursor: 'pointer' }}
        >
          <img src={SliderIcon} alt="Slider Icon" style={{ width: '100%', height: '100%' }} />
        </div>
      </TaskNameContext.Provider>
    </RangeContext.Provider>
  );
};




// const root = createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);