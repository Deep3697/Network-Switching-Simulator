// src/components/circuit/SwitchNode.jsx
import React from 'react';

function SwitchNode({ id, status, imageSrc }) {
  const isCongested = status === 'blocked';
  
  // 🔥 MASSIVE 140px SIZE 🔥
  const imageStyle = {
    width: '140px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: 'var(--border-radius)',
    border: isCongested ? '4px solid #F44336' : '4px solid var(--text-dark)', 
    boxShadow: isCongested ? '4px 4px 0px #F44336' : '4px 4px 0px var(--text-dark)',
    backgroundColor: '#fff',
    transition: 'var(--transition-speed)',
    animation: isCongested ? 'dangerPulse 0.5s infinite' : 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
      <span className="font-typing" style={{ color: 'var(--text-dark)', fontWeight: 'bold', fontSize: '1.1rem' }}>
        SW-{id}
      </span>
      <img src={imageSrc} alt={`Switch ${id}`} style={imageStyle} />
    </div>
  );
}

export default SwitchNode;