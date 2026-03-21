// src/components/layout/Header.jsx
import React from 'react';

function Header({ currentMode, onToggle }) {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'var(--bg-light)', // Light header
    borderBottom: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)' // Soft flat shadow
  };

  const buttonStyle = {
    padding: '10px 24px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
  };

  return (
    <header style={headerStyle}>
      <div className="title-section">
        <h1 className="font-heading" style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>
          The Network Switching Architecture
        </h1>
        <p className="font-typing" style={{ margin: '5px 0 0 0', color: 'var(--accent-orange)', fontWeight: 'bold' }}>
          &gt; {currentMode}
        </p>
      </div>
      
      <button 
        className="bg-gradient font-basic"
        style={buttonStyle} 
        onClick={onToggle}
      >
        Wanna Switch?
      </button>
    </header>
  );
}

export default Header;