// src/components/shared/EndPoint.jsx
import React from 'react';

function EndPoint({ type, label, imageSrc, isActive, connectionStatus }) {
  const wireColor = connectionStatus === 'active' ? 'var(--accent-peach)' 
                  : connectionStatus === 'setup' ? '#FFC107' 
                  : 'transparent'; 

  const shadow = connectionStatus === 'active' ? '0px 0px 10px rgba(255, 138, 101, 0.8)' 
               : connectionStatus === 'setup' ? '0px 0px 4px #FFC107' 
               : 'none';

  // 🔥 MASSIVE 140px SIZE 🔥
  const imageStyle = {
    width: '140px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: 'var(--border-radius)',
    border: `3px solid ${isActive ? 'var(--accent-peach)' : 'var(--text-dark)'}`,
    boxShadow: `4px 4px 0px ${isActive ? 'var(--accent-peach)' : 'var(--text-dark)'}`,
    backgroundColor: '#fff',
    transition: 'var(--transition-speed)',
    cursor: 'pointer'
  };

  const wireStyle = {
    height: '8px', // Slightly thicker wire to match big images
    width: '120px', 
    backgroundColor: wireColor,
    boxShadow: shadow,
    transition: 'var(--transition-speed)',
    margin: 'auto 0'
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  return (
    <div className="font-basic" style={containerStyle}>
      {type === "Server" && <div style={wireStyle}></div>}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <img src={imageSrc} alt={`${type} ${label}`} style={imageStyle} />
        <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '1.1rem' }}>{type} {label}</span>
      </div>

      {type === "User" || type === "Sender" ? <div style={wireStyle}></div> : null}
    </div>
  );
}

export default EndPoint;