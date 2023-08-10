import React from 'react';

// Create a new context
const RangeContext = React.createContext();

// Create another context for task name sharing
const TaskNameContext = React.createContext();

const StateContext = React.createContext();
const PatientContext = React.createContext();
const PatientIdContext = React.createContext();

export { RangeContext, TaskNameContext, StateContext, PatientContext, PatientIdContext};
