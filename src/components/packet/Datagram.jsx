// src/components/packet/Datagram.jsx
import React from 'react';

function Datagram({ id, status }) {
  // status options: 'moving', 'queued', 'dropped'
  
  let bgColor = 'var(--accent-peach)';
  let borderColor = 'var(--accent-orange)';

  // If the packet falls off the screen (Congestion)
  if (status === 'dropped') {
    bgColor = '#ffebee'; // Very light red
    borderColor = '#F44336'; // Solid Red
  }

  const packetStyle = {
    width: '30px',
    height: '30px',
    backgroundColor: bgColor,
    border: `2px solid ${borderColor}`,
    borderRadius: 'var(--border-radius)', // Keeps your architectural square look
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--text-dark)',
    fontSize: '1rem',
    boxShadow: 'var(--shadow-sm)', // Soft drop shadow
    transition: 'var(--transition-speed)',
    zIndex: 10 // Ensures packets float on top of the wires
  };

  return (
    <div style={packetStyle} className="font-typing">
      {id}
    </div>
  );
}

export default Datagram;