import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table } from 'antd';
import { TaskNameContext, StateContext } from '../GlobalContext';

const PatientDataTable = ({ data }) => {
  const selectedState = useContext(StateContext);
  const [columns, setColums] = useState([]);

  
  useEffect(() => {
  
      setColums(
        [
          {
            title: 'Patient ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id), // Add sorter for this column
          },
          {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            sorter: (a, b) => a.id.localeCompare(b.id), // Add sorter for this column
          },
          {
            title: `${selectedState} Time`,
            dataIndex: 'value',
            key: 'value',
            sorter: (a, b) => a.value - b.value, // Add sorter for this column
          },
          {
            title: 'Start Tick',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date - b.date, // Add sorter for this column
          },
          {
            title: 'Task',
            dataIndex: 'task',
            key: 'task',
            sorter: (a, b) => a.id.localeCompare(b.id), // Add sorter for this column
          },
        ]
      );
  }, [selectedState]);
  // Define columns for the Ant Design Table


  return <Table dataSource={data} columns={columns} />;
};

export default PatientDataTable;
