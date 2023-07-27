import React, { useState, useEffect, useRef, useContext } from 'react';
import { Select, Tooltip, Button } from 'antd';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


import { QuestionCircleTwoTone } from '@ant-design/icons';

import { TaskNameContext, StateContext } from '../GlobalContext';
import TaskSpentDotChart from '../components/TaskSpentDotChart';
import Boxplot from '../components/BoxPlot';
import PatientDataTable from '../components/PatientDataTable';



const TaskTimeSpentCard = () => {
    const initialSelectedTask = useContext(TaskNameContext)

    const [selectedTask, setSelectedTask] = useState(initialSelectedTask); // Initial task name
    const [selectedState, setSelectedState] = useState("waiting");
    const [selectedPatient, setSelectedPatient] = useState([]);

    // Define state variable to track visibility
    const [isChartVisible, setIsChartVisible] = useState(false);

    // Toggle the visibility of the TaskSpentDotChart component
    const handleToggleChart = () => {
        setIsChartVisible(!isChartVisible);
    };


    // Function to handle the change of the selected task
    const handleTaskChange = (value) => {
        setSelectedTask(value);
        console.log("task: " + selectedTask);
    };

    const handleStateChange = (value) => {
        setSelectedState(value);
        console.log("state: " + value);
    };

    const handlePatientChange = (value) => {
        setSelectedPatient(value);
    };

    useEffect(() => {
        setSelectedTask(initialSelectedTask);
        console.log("initialSelectedTask: " + initialSelectedTask)
    }, [initialSelectedTask]);

    useEffect(() => {
        document.documentElement.scrollTop = document.documentElement.clientHeight;
        document.documentElement.scrollLeft = document.documentElement.clientWidth;
    }, []);


    return (
        <div
            style={{
                backgroundColor: '#FFFFFF',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // Align contents to the left
            }}
        >
            <h2>Patient time spent distribution</h2>
            <p>The scatterplot and boxplot display patients' time spent (y-axis) at different times (x-axis). Drag the mouse to box out areas, select patient groups, and view their information in a table.</p>

            <TaskNameContext.Provider value={selectedTask}>

                {/* Add the Ant Design Select dropdown here */}
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'flex-end', // Align components to the right
                    }}
                >

                    <Select
                        style={{ width: 200, marginBottom: '20px' }}
                        defaultValue={"Select Task"}
                        onChange={handleTaskChange}
                    >
                        <Option value="Admission">Admission</Option>
                        <Option value="Assign">Assign</Option>
                        <Option value="Diagnose">Diagnose</Option>
                        <Option value="Discharge">Discharge</Option>
                        <Option value="Recovery">Recovery</Option>
                        <Option value="Transfer">Transfer</Option>
                        <Option value="Treatment">Treatment</Option>
                    </Select>

                    <Select
                        style={{ width: 200, marginBottom: '20px' }}
                        defaultValue={"Select State"}
                        onChange={handleStateChange}
                    >
                        <Option value="waiting">Waiting</Option>
                        <Option value="current_task">Current</Option>
                    </Select>
                    <Tooltip title="Select the task and state here" trigger="click" defaultOpen>
                        <QuestionCircleTwoTone />
                    </Tooltip>


                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'flex-end', // Align components to the right
                    }}
                >
                    {/* Add button to toggle visibility */}
                    <Tooltip title="Expand the boxplot to see the distribution of patients over time more clearly" placement="bottom">
                    <Button onClick={handleToggleChart} >
                        {isChartVisible ? 'Hide' : 'Expand the boxplot'}
                    </Button>
                    </Tooltip>
                </div>
                <StateContext.Provider value={selectedState}>

                    {/* Conditionally render the TaskSpentDotChart */}
                    {isChartVisible && <TaskSpentDotChart onPatientChange={handlePatientChange} />}
                    <div
                        style={{
                            display: 'flex',
                            gap: '30px',
                            flexDirection: 'row', // Correct typo in flex-direction
                            justifyContent: 'start',
                            alignItems: 'start', // Add this to center contents vertically
                            padding: '20px', // Add some padding to the container
                        }}
                    >
                        <Boxplot onPatientChange={handlePatientChange} />

                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between', // Arrange children with space between them
                                    alignItems: 'start', // Align items vertically at the center
                                    marginBottom: '20px', // Add margin to separate from the content below
                                }}
                            >
                                <h2>Selected Patients</h2>
                                <Link to="/new-page">
                                    <Button type="primary">To specific patient view</Button>
                                </Link>
                            </div>
                            <PatientDataTable data={selectedPatient} />
                        </div>

                    </div>


                </StateContext.Provider>

            </TaskNameContext.Provider>
        </div>

    );
};

export default TaskTimeSpentCard;


