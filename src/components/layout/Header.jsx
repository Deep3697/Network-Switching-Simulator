// src/components/layout/Header.jsx
import React from 'react';

function Header({ currentMode, onToggle }) {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'var(--bg-light)', // Light header
    borderBottom: '3px solid var(--accent-orange)',
    boxShadow: '0 4px 10px rgba(86, 47, 0, 0.1)' // Soft deep brown shadow
  };

  const buttonStyle = {
    color: 'var(--text-dark)',
    border: '2px solid var(--text-dark)',
    padding: '10px 24px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    boxShadow: '4px 4px 0px var(--text-dark)', /* Hard architectural shadow */
    transition: 'transform 0.1s, box-shadow 0.1s'
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
        onMouseDown={(e) => {
          e.target.style.transform = 'translate(2px, 2px)';
          e.target.style.boxShadow = '2px 2px 0px var(--text-dark)';
        }}
        onMouseUp={(e) => {
          e.target.style.transform = 'translate(0px, 0px)';
          e.target.style.boxShadow = '4px 4px 0px var(--text-dark)';
        }}
      >
        Wanna Switch?
      </button>
    </header>
  );
}

export default Header;