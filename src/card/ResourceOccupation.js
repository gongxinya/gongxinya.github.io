import React, { useState, useEffect, useRef, useContext } from 'react';
import { RangeContext } from '../GlobalContext';
import { Button, InputNumber, Space, Tooltip } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import '../css/style.css';

import BedHeatMap from '../components/BedHeatMap';
import ClinicianHeatMap from '../components/ClinicianHeatMap';
import NurseHeatMap from '../components/NurseHeatMap';
import BedOccupationRate from '../components/BedOccupationRate';
import ClinicianOccupationRate from '../components/ClinicianOccupationRate';
import NurseOccupationRate from '../components/NurseOccupationRate';





const ResourceOccupationCard = () => {
    const range = useContext(RangeContext);
    const [value, setValue] = useState(~~range[1]);
    const [rangeMin, setRangeMin] = useState(~~range[0]);
    const [rangeMax, setRangeMax] = useState(~~range[1]);

    useEffect(() => {
        document.documentElement.scrollTop = document.documentElement.clientHeight;
        document.documentElement.scrollLeft = document.documentElement.clientWidth;
      }, []);

    useEffect(() => {
        setValue(~~range[1]);
        setRangeMin(~~range[0]);
        setRangeMax(~~range[1]);
    },[range])

    return (
        <div
            style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                color: '#333333', // Set the text color
            }}
        >
            <h2 style={{ marginBottom: '20px', color: '#333333' }}>
                Resource usage view
            </h2>
            <p>A dynamic heat map illustrates the current occupancy levels of all hospital resources. Each unit is visually depicted by a small square. Mouse over the box to see the status of the corresponding cell and patient assignment</p>
            <Space>
                <InputNumber min={rangeMin} max={rangeMax} value={value} onChange={setValue} />
            </Space>
            <Tooltip title="Setting up to view resource allocation at a specific point in time. (Make sure you enter a number within the time range you have selected)" trigger="click" defaultOpen>
                  <QuestionCircleTwoTone />
                </Tooltip>
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    alignItems: 'center',
                }}
            >

                <BedHeatMap time={value}/>
                <ClinicianHeatMap time={value}/>
                <NurseHeatMap time={value}/>
            </div>
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    alignItems: 'center',
                }}
            >
                <BedOccupationRate time={value}/>
                <ClinicianOccupationRate time={value}/>
                <NurseOccupationRate time={value}/>
            </div>
        </div>
    );
};

export default ResourceOccupationCard;


