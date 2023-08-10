import React, { useState, useEffect, useRef } from 'react';



import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './css/style.css';
import './css/sankey.css'; // Import the CSS file



import { RangeContext, TaskNameContext, PatientIdContext } from './GlobalContext';

import LeftColumn from './components/LeftColumn';
import RangeSliderComponent from './components/RangeSlider';
import JumpingArrow from './components/JumpingIcon'; // Adjust the import path as needed



import PatientFlow from './card/PatientFlow';
import PatientNumberTrend from './card/PatientNumberTrend';
import ResourceOccupationCard from './card/ResourceOccupation';
import TaskTimeSpentCard from './card/TaskTimeSpent';



import dateData from './data/tick_data.json';


const maxValue = Math.max(...dateData);
const minValue = Math.min(...dateData);


const App = () => {
  const [range, setRange] = useState([minValue, maxValue]); // Initial range value
  const [selectedTask, setSelectedTask] = useState("Treatment"); // Initial task name
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSankey, setShowSankey] = useState(true);
  const [showTimeSpent, setShowTimeSpent] = useState(false);
  const [showPatientTrend, setShowPatientTrend] = useState(false);
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

  const handlePatientTdChange = (newValue) => {
    setSelectedPatientId(newValue);
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
    <PatientIdContext.Provider value={selectedPatientId}>
    <div
    style={{
      paddingTop: '40px', // Add some space above the main title
      paddingBottom: '10px', // Add some space above the main title
      backgroundColor: '#3a86ca',
    }}
    >
  
        <h1
          style={{
            textAlign: 'center',
            marginTop: '30px',
            backgroundColor: '#3a86ca', // Change the background color of the dashboard to gray
            color: 'white',
            textTransform: 'uppercase',
            fontSize: '36px', // Increase the font size for the heading
          }}
        >
          Hospital Simulation Data Dashboard
        </h1>


        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            marginBottom: '0px',
            backgroundColor: '#3a86ca', // Change the background color of the dashboard to gray
            minHeight: '100vh',
            padding: '30px',
            display: 'flex',
            flexDirection: 'row', // Make the content side-by-side
            gap: '10px',
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
              backgroundColor: '#5e9dd4', // Change the background color of the dashboard to gray
            }}
          >
            {showSankey && (<PatientFlow/>)}
            {showHeatmap && (<ResourceOccupationCard />)}
            {showPatientTrend && (<PatientNumberTrend onTaskChange={handleTaskChange}/>)}
            {showTimeSpent && <TaskTimeSpentCard onPatientIdChange={handlePatientTdChange}/>}

            {/* Use the ref and conditionally render the RangeSliderComponent */}
            <div className={`rangeSliderContainer ${showSlider ? 'open' : ''}`} ref={rangeSliderRef}>
              <div
                style={{
                  backgroundColor: '#ffffff00',
                  padding: '0px',
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
          <div>
      {/* Other components and content */}
      <JumpingArrow />
      {/* More components and content */}
    </div>
        </div>

    </div>
    </PatientIdContext.Provider>
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