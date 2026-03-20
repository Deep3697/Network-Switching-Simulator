// src/components/packet/RouterWeb.jsx
import React, { useState } from 'react';
import EndPoint from '../shared/EndPoint';
import RouterNode from './RouterNode';
import Datagram from './Datagram';

function RouterWeb() {
  const [statusText, setStatusText] = useState("DATAGRAM ENGINE READY. AWAITING FILE TRANSFER...");
  
  const [coreQueue, setCoreQueue] = useState(0);
  const [droppedPackets, setDroppedPackets] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendFile = () => {
    new Audio('/sounds/click.mp3').play().catch(err => console.log("Sound muted by browser"));
    setIsSending(true);
    setStatusText("SEGMENTING FILE INTO DATAGRAMS... ROUTING TO CENTRAL CORE.");

    let newPackets = 0;
    const interval = setInterval(() => {
      newPackets++;
      
      setCoreQueue(prevQueue => {
        if (prevQueue >= 5) {
          new Audio('/sounds/error.mp3').play().catch(err => console.log("Sound muted"));
          setDroppedPackets(prev => prev + 1);
          setStatusText(`WARNING: CONGESTION DETECTED! CORE QUEUE FULL. PACKET DROPPED.`);
          return prevQueue; 
        } else {
          setStatusText(`ROUTING DATAGRAM... CORE QUEUE CAPACITY: ${prevQueue + 1}/5.`);
          return prevQueue + 1;
        }
      });

      if (newPackets >= 4) {
        clearInterval(interval);
        // Wait 5 seconds for all animations to finish before resetting the sending state
        setTimeout(() => setIsSending(false), 5000); 
      }
    }, 800); 
  };

  const handleClear = () => {
    setCoreQueue(0);
    setDroppedPackets(0);
    setStatusText("QUEUES FLUSHED. NETWORK RESET.");
  };

  const webContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '60vh', padding: '20px' };
  const buttonStyle = { marginTop: '20px', padding: '12px 24px', fontSize: '1.2rem', border: '2px solid var(--text-dark)', borderRadius: 'var(--border-radius)', cursor: 'pointer', fontWeight: 'bold' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={webContainerStyle}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginRight: '-130px' }}>
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
            disabled={isSending} /* This locks the button! */
          >
            {isSending ? "Routing..." : "Send Data"}
          </button>
          <button style={{ ...buttonStyle, backgroundColor: '#ffebee', fontSize: '1rem', marginTop: '10px' }} onClick={handleClear}>
            Reset Network
          </button>
        </div>

        <div style={{ flex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', borderLeft: '2px dashed #ccc', borderRight: '2px dashed #ccc', margin: '0 20px', minHeight: '400px', position: 'relative' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
             <RouterNode id="A" queueCount={1} isCongested={false} imageSrc="/images/switch.png" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <RouterNode id="Core" queueCount={coreQueue} isCongested={coreQueue >= 5} imageSrc="/images/switch.png" />
             
             {/* THE NEW CSS ANIMATION MAPPING */}
             {isSending && (
               <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                 {[1, 2, 3, 4].map((num, index) => (
                   <div 
                     key={num} 
                     className="packet-animate" 
                     style={{ animationDelay: `${index * 0.6}s` }} 
                   >
                     <Datagram id={`0${num}`} status="moving" />
                   </div>
                 ))}
               </div>
             )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
             <RouterNode id="C" queueCount={0} isCongested={false} imageSrc="/images/switch.png" />
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <EndPoint type="Receiver" label="Destination Server" imageSrc="/images/server.png" isActive={false} />
          
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: droppedPackets > 0 ? '#ffebee' : 'transparent', border: `2px solid ${droppedPackets > 0 ? '#F44336' : 'transparent'}`, borderRadius: 'var(--border-radius)', textAlign: 'center' }}>
            <span className="font-typing" style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>
              PACKETS LOST: {droppedPackets}
            </span>
          </div>
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

export default RouterWeb;