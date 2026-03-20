// src/App.jsx
import React, { useState } from 'react';
import Header from './components/layout/Header';
import CircuitMatrix from './components/circuit/CircuitMatrix';
import RouterWeb from './components/packet/RouterWeb'; 

import './styles/theme.css';
import './styles/typography.css';

function App() {
  // State to track the current mode. True = Circuit (Default), False = Packet
  const [isCircuitMode, setIsCircuitMode] = useState(true);

  // Function to handle the "Wanna Switch?" button click
  const toggleMode = () => {
    setIsCircuitMode((prevMode) => !prevMode);
  };

  return (
    <div 
      className="app-container" 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: 'var(--bg-light)' // Ensures the light theme base fills the whole screen
      }}
    >
      
      {/* The Global Navigation Header */}
      <Header 
        currentMode={isCircuitMode ? "CIRCUIT SWITCHING ACTIVE" : "PACKET SWITCHING ACTIVE"} 
        onToggle={toggleMode} 
      />
      
      {/* The Main Interactive Canvas with Smooth Fade-In */}
      <main style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        
        <div key={isCircuitMode ? "circuit" : "packet"} className="fade-in-section" style={{ height: '100%' }}>
          {isCircuitMode ? <CircuitMatrix /> : <RouterWeb />}
        </div>

      </main>

    </div>
  );
}

export default App;