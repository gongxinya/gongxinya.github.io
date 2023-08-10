import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Button } from 'antd';
import { TaskNameContext, StateContext } from '../GlobalContext';

const PatientDataTable = ({ data, onPatientIdChange }) => {
  const selectedState = useContext(StateContext);
  const [columns, setColums] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null); // State to store selected row key
  const [selectedPatientId, setSelectedPatientId] = useState(null);


  console.log(data)
  useEffect(() => {
      setColums(
        [
          {
            title: '',
            key: 'selection',
            dataIndex: 'selection',
            width: '5%',
            render: (_, record) => (
              <input
                type="radio"
                name="radio"
                checked={selectedRowKey === `${record.id}_${record.date}`}
                onChange={() => handleRowSelection(`${record.id}_${record.date}`, record.id)}
              />
            ),
          },
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
  }, [selectedState, selectedRowKey]);

  
  
  const handleRowSelection = (selectedId, selectedPatient) => {
    setSelectedRowKey(selectedId);
    setSelectedPatientId(selectedPatient);
  };

  const handleLogSelectedRow = () => {
    if (selectedPatientId) {
      console.log('Selected Patient ID:', selectedPatientId);
      onPatientIdChange(selectedPatientId);
    }
  };

  const clearSelectedRow = () => {
    if (selectedPatientId) {
      setSelectedPatientId("null");
      onPatientIdChange("null");
    }
  };




  return (
    <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <span>Selected Patient: {selectedPatientId}</span>
      <div>
        <Button
          type="primary"
          onClick={handleLogSelectedRow}
          disabled={!selectedRowKey}
        >
          Track Patient
        </Button>
        <Button
          type="primary"
          onClick={clearSelectedRow}
          disabled={!selectedRowKey}
          style={{ marginLeft: '10px' }} 
        >
          Clear
        </Button>
      </div>
    </div>
    <Table
      dataSource={data}
      columns={columns}
      // pagination={false}
    />
  </div>
  );
};

export default PatientDataTable;
