import React, { useState, useEffect, useRef } from 'react';

import '../css/style.css';
import '../css/sankey.css'; // Import the CSS file



import Sankey from "../components/Sankey";



const PatientFlow = () => {
    return(<div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          color: '#333333', // Set the text color
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#333333' }}>
          Number of patients flowing between tasks
        </h2>
        <p>Different nodes symbolize distinct tasks, while links represent the flow between these tasks. The thickness of each link corresponds to the number of people who transition between the respective tasks.</p>

        <Sankey />
      </div>
      );
}

export default PatientFlow;