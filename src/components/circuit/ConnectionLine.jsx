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
    height: '6px', // Thick, visible wire
    width: status === 'idle' ? '0%' : '100%',    backgroundColor: lineColor,
    boxShadow: shadow,
    borderRadius: 'var(--border-radius)',
    transition: 'var(--transition-speed)',
    margin: 'auto 0', // Centers it vertically
    animation: status === 'setup' ? 'pulseGlow 1.5s infinite' : 'none'
  };

  return (
    <div style={{ display: 'flex', flex: 1, padding: '0 10px', minWidth: '40px' }}>
      <div style={lineStyle} />
    </div>
  );
}

export default ConnectionLine;