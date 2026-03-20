// src/components/circuit/CircuitMatrix.jsx
import React, { useState } from 'react';
import EndPoint from '../shared/EndPoint';
import SwitchNode from './SwitchNode';
import ConnectionLine from './ConnectionLine';

function CircuitMatrix() {
  const [userCount, setUserCount] = useState(4);
  const [serverCount, setServerCount] = useState(4);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [statusText, setStatusText] = useState("SYSTEM READY. SELECT A USER AND A SERVER TO CONNECT.");
  
  const [activeConnections, setActiveConnections] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedPath, setBlockedPath] = useState(null);

  const isSettingUp = activeConnections.some(conn => conn.status === 'setup');

  const handleSelectUser = (id) => setSelectedUser(id);
  const handleSelectServer = (id) => setSelectedServer(id);

  const handleEstablishCircuit = () => {
    new Audio('/sounds/click.mp3').play().catch(() => {});

    if (!selectedUser || !selectedServer) {
      setStatusText("ERROR: MUST SELECT BOTH SOURCE AND DESTINATION.");
      return;
    }

    const isUserBusy = activeConnections.some(c => c.user === selectedUser);
    const isServerBusy = activeConnections.some(c => c.server === selectedServer);
    
    if (isUserBusy || isServerBusy) {
       new Audio('/sounds/error.mp3').play().catch(() => {});
       setStatusText(`ERROR: ENDPOINT ALREADY IN USE. CIRCUIT SWITCHING REQUIRES DEDICATED LINES.`);
       setSelectedUser(null);
       setSelectedServer(null);
       return;
    }

    if (activeConnections.length >= 3) {
      new Audio('/sounds/error.mp3').play().catch(() => {});
      setStatusText(`BLOCKED! TRUNK CAPACITY EXHAUSTED (3/3). NO PHYSICAL LINES AVAILABLE FOR ${selectedUser} ⟶ ${selectedServer}.`);
      setIsBlocked(true);
      setBlockedPath({ user: selectedUser, server: selectedServer });
      setTimeout(() => {
        setIsBlocked(false);
        setBlockedPath(null);
      }, 1500);
      setSelectedUser(null);
      setSelectedServer(null);
      return;
    }

    // THE SYNC LOGIC: Find the first available trunk wire index (0, 1, 2)
    const claimedIndices = activeConnections.map(c => c.trunkWireIndex);
    const availableIndices = [0, 1, 2].filter(i => !claimedIndices.includes(i));
    const trunkWireIndex = availableIndices[0]; 

    // Phase 1: Setup
    setStatusText(`ESTABLISHING CIRCUIT ${selectedUser} ⟶ ${selectedServer}... RESERVING PHYSICAL SWITCHES...`);
    const newConnection = { 
      id: Date.now(),
      user: selectedUser,
      server: selectedServer,
      status: 'setup',
      trunkWireIndex: trunkWireIndex // This links the computer to the exact wire!
    };
    setActiveConnections(prev => [...prev, newConnection]);

    // Phase 2: Active Data
    setTimeout(() => {
      setActiveConnections(prev => 
        prev.map(conn => 
          conn.id === newConnection.id ? { ...conn, status: 'active' } : conn
        )
      );
      setStatusText(`CIRCUIT ESTABLISHED. DEDICATED DATA PATH GUARANTEED FOR ${selectedUser} ⟶ ${selectedServer}.`);
    }, 2000);

    setSelectedUser(null);
    setSelectedServer(null);
  };

  const handleClear = () => {
    setActiveConnections([]);
    setStatusText("CIRCUITS TORN DOWN. HARDWARE RESOURCES FREED.");
  };

  // --- UPDATED LAYOUT STYLES FOR LARGER IMAGES ---
  const buttonStyle = { padding: '10px 20px', border: '2px solid var(--text-dark)', borderRadius: 'var(--border-radius)', cursor: 'pointer', fontWeight: 'bold', margin: '5px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1400px', margin: '0 auto', overflowX: 'hidden' }}>
      
      <div style={{ textAlign: 'center', padding: '10px' }}>
        <button 
          className="bg-gradient font-basic" 
          style={{ ...buttonStyle, opacity: isSettingUp ? 0.5 : 1, cursor: isSettingUp ? 'not-allowed' : 'pointer' }} 
          onClick={handleEstablishCircuit}
          disabled={isSettingUp}
        >
          {isSettingUp ? "Connecting..." : "Establish Circuit"}
        </button>
        <button style={{ ...buttonStyle, backgroundColor: '#ffebee' }} onClick={handleClear}>
          Teardown All
        </button>
      </div>

      <div className="matrix-container">
        
        {/* Users with Connected Paths */}
        <div className="node-column">
          {Array.from({ length: userCount }).map((_, i) => {
            const label = String.fromCharCode(65 + i);
            const conn = activeConnections.find(c => c.user === label);
            const isPathBlocked = blockedPath && blockedPath.user === label;
            const currentStatus = isPathBlocked ? 'blocked' : (conn ? conn.status : 'idle');
            return (
              <div key={`user-${i}`} onClick={() => handleSelectUser(label)} style={{ alignSelf: 'stretch', display: 'flex' }}>
                <EndPoint 
                  type="User" 
                  label={label} 
                  imageSrc="/images/computer.png" 
                  isActive={selectedUser === label}
                  connectionStatus={currentStatus}
                  index={i}
                  totalCount={userCount}
                />
              </div>
            );
          })}
        </div>

        {/* --- TRUNK VISUALIZATION (Linked to connections) --- */}
        <div className="trunk-column">
            <div className="trunk-inner">
                
                {/* POINTING TO YOUR SWITCH.PNG */}
                <SwitchNode id="IN" status={isBlocked ? 'blocked' : (activeConnections.length > 0 ? 'active' : 'empty')} imageSrc="/images/switch.png" />
                
                {/* The 3 Physical Wires rendered vertically */}
                <div className="trunk-wires">
                  {[0, 1, 2].map((index) => {
                    const conn = activeConnections.find(c => c.trunkWireIndex === index);
                    return (
                      <div key={index} style={{ position: 'relative', width: '100%', display: 'flex' }}>
                        <ConnectionLine status={conn ? conn.status : 'idle'} />
                        {conn && (
                          <span className="font-basic connection-label" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                            {conn.user} ↔ {conn.server}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* POINTING TO YOUR SWITCH.PNG */}
                <SwitchNode id="OUT" status={isBlocked ? 'blocked' : (activeConnections.length > 0 ? 'active' : 'empty')} imageSrc="/images/switch.png" />
            
            </div>
        </div>
        {/* ------------------------------------------ */}

        {/* Servers with Connected Paths */}
        <div className="node-column">
          {Array.from({ length: serverCount }).map((_, i) => {
            const label = `${i + 1}`;
            const conn = activeConnections.find(c => c.server === label);
            const isPathBlocked = blockedPath && blockedPath.server === label;
            const currentStatus = isPathBlocked ? 'blocked' : (conn ? conn.status : 'idle');
            return (
              <div key={`server-${i}`} onClick={() => handleSelectServer(label)} style={{ alignSelf: 'stretch', display: 'flex' }}>
                <EndPoint 
                  type="Server" 
                  label={label} 
                  imageSrc="/images/server.png" 
                  isActive={selectedServer === label}
                  connectionStatus={currentStatus}
                  index={i}
                  totalCount={serverCount}
                />
              </div>
            );
          })}
        </div>

      </div>

      <div style={{ backgroundColor: 'var(--text-dark)', padding: '15px 20px', margin: '20px', borderRadius: 'var(--border-radius)', border: '3px solid var(--accent-orange)' }}>
        <p className="font-typing" style={{ color: 'var(--accent-peach)', margin: 0, fontSize: '1.2rem' }}>
          &gt; {statusText}<span className="cursor-blink">_</span>
        </p>
      </div>

    </div>
  );
}

export default CircuitMatrix;