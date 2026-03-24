// src/components/packet/RouterWeb.jsx
import React, { useState } from 'react';
import EndPoint from '../shared/EndPoint';
import RouterNode from './RouterNode';
import Datagram from './Datagram';
import TypewriterText from '../shared/TypewriterText';

function RouterWeb() {
  const [statusText, setStatusText] = useState("DATAGRAM ENGINE READY. AWAITING FILE TRANSFER...");
  
  // Only the Core Router has a buffer now
  const [coreQueue, setCoreQueue] = useState(0);
  const [droppedPackets, setDroppedPackets] = useState(0);
  
  // This locks the button very briefly to prevent accidental double-clicks, 
  // but unlocks quickly so you can SPAM it to cause congestion.
  const [isSending, setIsSending] = useState(false);
  
  // NEW: The React Physics Engine. This tracks the exact location of every packet!
  const [packets, setPackets] = useState([]);

  const handleSendFile = () => {
    new Audio('/sounds/click.mp3').play().catch(() => {});
    
    setIsSending(true);
    setTimeout(() => setIsSending(false), 300); // Unlocks in 0.3s so you can spam!

    // Create 4 new packets with a unique batch ID
    const batchId = Date.now() + Math.floor(Math.random() * 1000);
    const newPackets = [1, 2, 3, 4].map(num => ({
        id: `${batchId}-${num}`,
        label: `0${num}`,
        stage: 'source' // Packets start at the sender
    }));

    setPackets(prev => [...prev, ...newPackets]);

    newPackets.forEach((p, index) => {
        const staggerDelay = index * 400; // Send one packet every 400ms

        // STEP 1: Command packet to move to the Core Router
        setTimeout(() => {
            setPackets(prev => prev.map(pkt => pkt.id === p.id ? { ...pkt, stage: 'core' } : pkt));

            // STEP 2: The packet physically arrives at the Core Router (600ms travel time)
            setTimeout(() => {
                setCoreQueue(prevCore => {
                    if (prevCore >= 5) {
                        // CONGESTION: Drop the packet!
                        new Audio('/sounds/error.mp3').play().catch(() => {});
                        setDroppedPackets(d => d + 1);
                        setStatusText("BOTTLENECK AT CORE: QUEUE FULL. PACKET DROPPED.");
                        
                        // Tell the packet to fall off the screen
                        setPackets(prev => prev.map(pkt => pkt.id === p.id ? { ...pkt, stage: 'dropped' } : pkt));
                        
                        // Delete the dropped packet from memory after 1 second
                        setTimeout(() => setPackets(prev => prev.filter(pkt => pkt.id !== p.id)), 1000);
                        
                        return prevCore; // Queue size remains full
                    } else {
                        // STORED IN BUFFER: Packet pauses its movement and waits!
                        setStatusText(`ROUTING DATAGRAM... CORE QUEUE: ${prevCore + 1}/5.`);

                        // STEP 3: Wait in the buffer for 1.5s, then release to Destination
                        setTimeout(() => {
                            setCoreQueue(c => Math.max(0, c - 1)); // Free up the queue slot
                            
                            // Tell the packet to resume flying to the server!
                            setPackets(prev => prev.map(pkt => pkt.id === p.id ? { ...pkt, stage: 'destination' } : pkt));

                            // STEP 4: Packet arrives at server, delete from memory
                            setTimeout(() => setPackets(prev => prev.filter(pkt => pkt.id !== p.id)), 800);
                        }, 1500); // The 1.5 second pause inside the router

                        return prevCore + 1; // Increase queue
                    }
                });
            }, 600); // 600ms matches the CSS transition time to physically reach the center
        }, staggerDelay + 50); 
    });
  };

  const handleClear = () => {
    setCoreQueue(0);
    setDroppedPackets(0);
    setPackets([]);
    setStatusText("QUEUES FLUSHED. NETWORK RESET.");
  };

  const buttonStyle = { marginTop: '20px', padding: '12px 24px', fontSize: '1.2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', cursor: 'pointer', fontWeight: 'bold', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', boxShadow: 'var(--shadow-sm)', transition: 'all var(--transition-speed)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div className="matrix-container">
        
        <div className="node-column">
          <div className="sender-offset">
            <EndPoint type="Sender" label="Source Node" imageSrc="/images/computer.png" isActive={isSending} />
          </div>
          <button 
            className="bg-gradient font-basic" 
            style={{ 
              ...buttonStyle, 
              opacity: isSending ? 0.5 : 1, 
              cursor: isSending ? 'not-allowed' : 'pointer' 
            }} 
            onClick={handleSendFile}
            disabled={isSending} 
          >
            {isSending ? "Processing..." : "Send Data"}
          </button>
          <button style={{ ...buttonStyle, backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', fontSize: '1rem', marginTop: '10px' }} onClick={handleClear}>
            Reset Network
          </button>
        </div>

        <div className="trunk-column">
          
          <div className="router-column">
             {/* Edge routers no longer have buffers! */}
             <RouterNode id="A" queueCount={0} isCongested={false} imageSrc="/images/switch.png" />
          </div>
          
          <div className="node-column" style={{ position: 'relative' }}>
             <RouterNode id="Core" queueCount={coreQueue} isCongested={coreQueue >= 5} imageSrc="/images/switch.png" />
             
             {/* THE NEW REACT ANIMATION ENGINE */}
             {packets.map((pkt) => {
                 let transform = 'translate(-380px, -50%)'; // Starts on the left
                 let opacity = 1;
                 let status = 'moving';

                 // The Engine updates CSS based on the React State!
                 if (pkt.stage === 'core') {
                     transform = 'translate(0px, -50%)'; // STOPS in the middle!
                 } else if (pkt.stage === 'destination') {
                     transform = 'translate(380px, -50%)'; // Flies to the right
                     opacity = 0; // Fades out as it hits the server
                 } else if (pkt.stage === 'dropped') {
                     transform = 'translate(0px, 150px) scale(0.5)'; // Falls off the screen
                     opacity = 0;
                     status = 'dropped';
                 }

                 return (
                     <div
                         key={pkt.id}
                         style={{
                             position: 'absolute',
                             top: '50%',
                             left: '50%',
                             transform: transform,
                             opacity: opacity,
                             transition: 'transform 0.6s linear, opacity 0.6s ease', // Smooth sliding
                             marginTop: '-15px',
                             marginLeft: '-15px',
                             zIndex: 10
                         }}
                     >
                         <Datagram id={pkt.label} status={status} />
                     </div>
                 );
             })}
          </div>

          <div className="router-column">
             <RouterNode id="C" queueCount={0} isCongested={false} imageSrc="/images/switch.png" />
          </div>

        </div>

        <div className="node-column">
          <EndPoint type="Receiver" label="Destination Server" imageSrc="/images/server.png" isActive={false} />
          
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: droppedPackets > 0 ? '#fee2e2' : 'transparent', border: `1px solid ${droppedPackets > 0 ? '#fca5a5' : 'transparent'}`, borderRadius: 'var(--border-radius)', textAlign: 'center' }}>
            <span className="font-typing" style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>
              PACKETS LOST: {droppedPackets}
            </span>
          </div>
        </div>

      </div>

      <div style={{ backgroundColor: 'var(--bg-light)', padding: '15px 20px', margin: '20px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <p className="font-typing" style={{ color: 'var(--accent-orange)', margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
          &gt; <TypewriterText text={statusText} /><span className="cursor-blink" style={{color: 'var(--text-dark)'}}>_</span>
        </p>
      </div>

    </div>
  );
}

export default RouterWeb;