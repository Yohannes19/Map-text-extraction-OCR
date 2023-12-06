// Create a new component, e.g., NoData.js
import React from 'react';
import './NoData.css'; // Include the corresponding styles for your component

const NoData = () => {
  return (
    <div className="no-data-container">
      <p className="no-data-message">Please upload maps to view the comparison results.</p>
      <div className="animated-bulb"></div>
    </div>
    
  );
};

export default NoData;
