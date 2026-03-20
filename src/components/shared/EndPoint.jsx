// src/components/shared/EndPoint.jsx
import React from 'react';

function EndPoint({ type, label, imageSrc, isActive, connectionStatus, index = 0, totalCount = 4 }) {
  const wireColor = connectionStatus === 'active' ? '#4CAF50'
    : connectionStatus === 'setup' ? '#FFC107'
      : connectionStatus === 'blocked' ? '#F44336'
        : 'transparent';

  const shadow = connectionStatus === 'active' ? '0px 0px 10px rgba(76, 175, 80, 0.8)'
    : connectionStatus === 'setup' ? '0px 0px 4px #FFC107'
      : connectionStatus === 'blocked' ? '0px 0px 10px rgba(244, 67, 54, 0.8)'
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

  const desktopOffset = (totalCount / 2 - 0.5 - index) * 180; // Approximate vertical distance

  const svgWire = (
    <svg className="endpoint-wire" style={{ overflow: 'visible', zIndex: 0 }}>
      {connectionStatus !== 'idle' && connectionStatus !== 'transparent' && (
        <>
          {/* Desktop Line - Horizontal orientation, angled vertically */}
          <line 
            className="desktop-line"
            x1="0" 
            y1={type === "User" || type === "Sender" ? 4 : desktopOffset + 4} 
            x2="100%" 
            y2={type === "User" || type === "Sender" ? desktopOffset + 4 : 4} 
            stroke={wireColor} 
            strokeWidth="8"
            strokeLinecap="round"
            style={{ transition: 'stroke 0.3s ease', filter: `drop-shadow(${shadow})` }} 
          />
          {/* Mobile Line - Vertical orientation, points straight down */}
          <line 
            className="mobile-line"
            x1="4" 
            y1="0" 
            x2="4" 
            y2="100%" 
            stroke={wireColor} 
            strokeWidth="8"
            strokeLinecap="round"
            style={{ transition: 'stroke 0.3s ease', filter: `drop-shadow(${shadow})` }} 
          />
        </>
      )}
    </svg>
  );

  return (
    <div className="font-basic endpoint-wrapper">
      {type === "Server" && svgWire}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1, position: 'relative' }}>
        <img src={imageSrc} alt={`${type} ${label}`} style={imageStyle} />
        <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '1.1rem' }}>{type} {label}</span>
      </div>

      {(type === "User" || type === "Sender") && svgWire}
    </div>
  );
}

export default EndPoint;