// src/components/packet/RouterNode.jsx
import React from 'react';

function RouterNode({ id, queueCount, isCongested, imageSrc }) {
  const maxQueue = 5;
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '15px',
    position: 'relative'
  };

  // Made the queue buffer slightly larger to match the bigger router
  const bufferStyle = {
    display: 'flex',
    flexDirection: 'column-reverse', 
    height: '80px',
    width: '30px',
    border: '3px solid var(--text-dark)',
    borderRadius: 'var(--border-radius)',
    marginBottom: '15px',
    backgroundColor: 'rgba(255, 253, 241, 0.5)' 
  };

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
    animation: isCongested ? 'dangerPulse 0.5s infinite' : 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={bufferStyle} title={isCongested ? "WARNING: Buffer Queue is 100% full!" : `Queue: ${queueCount}/5`}>
        {Array.from({ length: maxQueue }).map((_, index) => (
          <div 
            key={index}
            style={{
              flex: 1,
              borderBottom: index < maxQueue - 1 ? '2px solid var(--text-dark)' : 'none',
              backgroundColor: index < queueCount ? 'var(--accent-orange)' : 'transparent',
              transition: 'background-color 0.2s'
            }}
          />
        ))}
      </div>

      <img src={imageSrc} alt={`Router ${id}`} style={imageStyle} title={isCongested ? "WARNING: Buffer Queue is 100% full. Dropping incoming packets!" : "Active Router: Ready to forward datagrams."} />
      
      <span className="font-basic" style={{ fontSize: '1.1rem', marginTop: '10px', color: 'var(--text-dark)', fontWeight: 'bold' }}>
        R-{id}
      </span>
    </div>
  );
}

export default RouterNode;