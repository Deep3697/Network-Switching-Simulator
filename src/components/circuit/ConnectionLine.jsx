// src/components/circuit/ConnectionLine.jsx
import React from 'react';

function ConnectionLine({ status }) {
  // status options: 'idle', 'setup', 'active', 'blocked'
  
  let lineColor = '#ccc'; // Default empty gray wire
  let shadow = 'none';

  if (status === 'setup') {
    lineColor = '#FFC107'; // Setup phase (Yellow)
    shadow = '0px 0px 8px #FFC107'; 
  } else if (status === 'active') {
    lineColor = '#4CAF50'; // Data flowing (Green)
    shadow = '0px 0px 8px #4CAF50';
  } else if (status === 'blocked') {
    lineColor = '#F44336'; // Collision/Blocked (Red)
    shadow = '0px 0px 8px #F44336';
  }

  const lineStyle = {
    '--line-main': status === 'idle' ? '0%' : '100%',
    backgroundColor: lineColor,
    boxShadow: shadow,
    borderRadius: 'var(--border-radius)',
    transition: 'var(--transition-speed)',
    animation: status === 'setup' ? 'pulseGlow 1.5s infinite' : 'none'
  };

  return (
    <div className="wire-container">
      <div className="connection-line" style={lineStyle} />
    </div>
  );
}

export default ConnectionLine;