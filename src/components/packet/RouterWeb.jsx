// src/components/packet/RouterWeb.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import EndPoint from '../shared/EndPoint';
import RouterNode from './RouterNode';
import Datagram from './Datagram';
import TypewriterText from '../shared/TypewriterText';

// ═══════════════════════════════════════════════════════════
// MESH TOPOLOGY: 3 rows × 4 columns = 12 routers
// ═══════════════════════════════════════════════════════════
const ROWS = 3, COLS = 4;
const MESH = [];
let counter = 1;
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    MESH.push({ id: `R${counter}`, row: r, col: c });
    counter++;
  }
}

// Adjacency: horizontal, vertical, diagonal neighbors
const ADJACENCY = {};
MESH.forEach(r => {
  ADJACENCY[r.id] = MESH
    .filter(n => n.id !== r.id && Math.abs(n.row - r.row) <= 1 && Math.abs(n.col - r.col) <= 1)
    .map(n => n.id);
});
// Backbone express links for internet-like feel
[['R1','R11'],['R4','R10'],['R5','R4'],['R9','R3'],['R2','R12'],['R8','R1']].forEach(([a,b]) => {
  if (!ADJACENCY[a].includes(b)) ADJACENCY[a].push(b);
  if (!ADJACENCY[b].includes(a)) ADJACENCY[b].push(a);
});

const ENTRY_ROUTERS = MESH.filter(r => r.col === 0).map(r => r.id);
const EXIT_ROUTERS  = MESH.filter(r => r.col === COLS - 1).map(r => r.id);

// Deduplicated edges for SVG lines
const EDGES = [];
const _edgeSet = new Set();
Object.entries(ADJACENCY).forEach(([from, neighbors]) => {
  neighbors.forEach(to => {
    const key = [from, to].sort().join('-');
    if (!_edgeSet.has(key)) { _edgeSet.add(key); EDGES.push({ from, to, key }); }
  });
});

// ═══════════════════════════════════════════════════════════
// RANDOM PATH GENERATOR
// ═══════════════════════════════════════════════════════════
function generateRandomPath() {
  const start = ENTRY_ROUTERS[Math.floor(Math.random() * ENTRY_ROUTERS.length)];
  const path = [start];
  let current = start;
  let safety = 0;

  while (safety++ < 12) {
    const curr = MESH.find(r => r.id === current);
    if (curr.col === COLS - 1) break;

    const prev = path.length >= 2 ? path[path.length - 2] : null;
    const candidates = ADJACENCY[current].filter(n => n !== prev);
    if (candidates.length === 0) break;

    const right = candidates.filter(n => MESH.find(x => x.id === n).col > curr.col);
    const same  = candidates.filter(n => MESH.find(x => x.id === n).col === curr.col);

    let pool;
    const roll = Math.random();
    if (right.length > 0 && roll < 0.55) pool = right;
    else if (same.length > 0 && roll < 0.80) pool = same;
    else pool = candidates;

    const next = pool[Math.floor(Math.random() * pool.length)];
    path.push(next);
    current = next;
  }

  // Force reach exit if stuck
  const last = MESH.find(r => r.id === current);
  if (last.col !== COLS - 1) {
    const nearest = EXIT_ROUTERS.sort((a, b) => {
      return Math.abs(MESH.find(r => r.id === a).row - last.row) - Math.abs(MESH.find(r => r.id === b).row - last.row);
    });
    path.push(nearest[0]);
  }
  return path;
}

// Initial queue state
const INIT_QUEUES = {};
MESH.forEach(r => { INIT_QUEUES[r.id] = 0; });

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
function RouterWeb() {
  const [statusText, setStatusText] = useState("MESH DATAGRAM ENGINE READY. AWAITING FILE TRANSFER...");
  const [queuesDisplay, setQueuesDisplay] = useState({ ...INIT_QUEUES });
  const [droppedPackets, setDroppedPackets] = useState(0);
  // arrivedBatches: array of { id, packets: [] } — one entry per Send click
  const [arrivedBatches, setArrivedBatches] = useState([]);
  const batchCountRef = useRef(0);
  const [isSending, setIsSending] = useState(false);
  const [packets, setPackets] = useState([]);
  const [activeLinks, setActiveLinks] = useState(new Set());

  // ── Synchronous queue ref (source of truth for routing logic) ──
  const queuesRef = useRef({ ...INIT_QUEUES });
  const syncQueues = () => setQueuesDisplay({ ...queuesRef.current });

  // Refs for DOM measurement
  const meshRef = useRef(null);
  const routerElsRef = useRef({});
  const posRef = useRef({});
  const dimsRef = useRef({ width: 0, height: 0 });

  // ── Measure router positions relative to mesh container ──
  const measurePositions = useCallback(() => {
    if (!meshRef.current) return;
    const meshRect = meshRef.current.getBoundingClientRect();
    dimsRef.current = { width: meshRect.width, height: meshRect.height };
    const pos = {};
    Object.entries(routerElsRef.current).forEach(([id, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        pos[id] = {
          x: rect.left + rect.width / 2 - meshRect.left,
          y: rect.top + rect.height / 2 - meshRect.top
        };
      }
    });
    posRef.current = pos;
  }, []);

  useEffect(() => {
    const timer = setTimeout(measurePositions, 150);
    window.addEventListener('resize', measurePositions);
    return () => { clearTimeout(timer); window.removeEventListener('resize', measurePositions); };
  }, [measurePositions]);

  // ── Hop-by-hop journey engine (NO side effects inside state updaters) ──
  const processPacketJourney = useCallback((pkt) => {
    const { id, path, label } = pkt;
    let hopIdx = 0;

    const moveToNextHop = () => {
      // All hops done → fly to destination
      if (hopIdx >= path.length) {
        const dx = dimsRef.current.width + 60;
        const dy = dimsRef.current.height / 2;
        setPackets(prev => prev.map(p => p.id === id ? { ...p, x: dx, y: dy, opacity: 0, status: 'moving' } : p));
        setStatusText(`✓ PACKET ${label} DELIVERED TO DESTINATION.`);
        setTimeout(() => {
          setArrivedBatches(prev => prev.map(b =>
            b.id === pkt.batchNum ? { ...b, packets: [...b.packets, label] } : b
          ));
          setPackets(prev => prev.filter(p => p.id !== id));
        }, 600);
        return;
      }

      const targetRouter = path[hopIdx];
      const prevRouter = hopIdx > 0 ? path[hopIdx - 1] : null;
      const pos = posRef.current[targetRouter];
      if (!pos) { setTimeout(moveToNextHop, 200); return; }

      const jx = (Math.random() - 0.5) * 14;
      const jy = (Math.random() - 0.5) * 14;

      // Activate SVG link
      if (prevRouter) {
        const lk = [prevRouter, targetRouter].sort().join('-');
        setActiveLinks(prev => new Set([...prev, lk]));
        setTimeout(() => setActiveLinks(prev => { const n = new Set(prev); n.delete(lk); return n; }), 500);
      }

      // Move packet toward target router
      setPackets(prev => prev.map(p => p.id === id ? { ...p, x: pos.x + jx, y: pos.y + jy, status: 'moving' } : p));

      // After transit animation → check queue synchronously via ref
      setTimeout(() => {
        const currentQ = queuesRef.current[targetRouter];

        if (currentQ >= 5) {
          // DROPPED — queue full
          new Audio('/sounds/error.mp3').play().catch(() => {});
          setDroppedPackets(d => d + 1);
          setStatusText(`⚠ CONGESTION AT R-${targetRouter.replace('R','')}! PKT ${label} DROPPED.`);
          setPackets(p => p.map(pk => pk.id === id ? { ...pk, y: pk.y + 250, opacity: 0, status: 'dropped' } : pk));
          setTimeout(() => setPackets(p => p.filter(pk => pk.id !== id)), 1000);
          return;
        }

        // Accepted into queue — increment ref synchronously
        queuesRef.current[targetRouter] += 1;
        syncQueues();
        setStatusText(`ROUTING PKT ${label} → R-${targetRouter.replace('R','')} [QUEUE: ${queuesRef.current[targetRouter]}/5]`);
        setPackets(p => p.map(pk => pk.id === id ? { ...pk, status: 'queued' } : pk));

        const processingDelay = 500 + Math.random() * 500;
        setTimeout(() => {
          queuesRef.current[targetRouter] = Math.max(0, queuesRef.current[targetRouter] - 1);
          syncQueues();
          hopIdx++;
          moveToNextHop();
        }, processingDelay);
      }, 500);
    };

    moveToNextHop();
  }, []);

  // ── Send handler ──
  const handleSendFile = () => {
    new Audio('/sounds/click.mp3').play().catch(() => {});
    setIsSending(true);
    setTimeout(() => setIsSending(false), 300);
    measurePositions();

    const batchId = Date.now() + Math.floor(Math.random() * 1000);
    batchCountRef.current += 1;
    const currentBatchNum = batchCountRef.current;
    // Register a new batch slot for arrival tracking
    setArrivedBatches(prev => [...prev, { id: currentBatchNum, packets: [] }]);
    const srcX = -60;
    const srcY = dimsRef.current.height / 2;

    const newPackets = [1, 2, 3, 4].map(num => ({
      id: `${batchId}-${num}`,
      label: `0${num}`,
      batchNum: currentBatchNum,
      path: generateRandomPath(),
      x: srcX,
      y: srcY,
      opacity: 1,
      status: 'moving',
    }));

    setPackets(prev => [...prev, ...newPackets]);
    setStatusText(`TRANSMITTING 4 DATAGRAMS VIA MESH TOPOLOGY...`);

    newPackets.forEach((pkt, i) => {
      setTimeout(() => processPacketJourney(pkt), i * 400);
    });
  };

  // ── Clear handler ──
  const handleClear = () => {
    queuesRef.current = { ...INIT_QUEUES };
    setQueuesDisplay({ ...INIT_QUEUES });
    setDroppedPackets(0);
    setArrivedBatches([]);
    batchCountRef.current = 0;
    setPackets([]);
    setActiveLinks(new Set());
    setStatusText("ALL QUEUES FLUSHED. MESH NETWORK RESET.");
  };

  const buttonStyle = { marginTop: '20px', padding: '12px 24px', fontSize: '1.2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', cursor: 'pointer', fontWeight: 'bold', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', boxShadow: 'var(--shadow-sm)', transition: 'all var(--transition-speed)' };

  // ── Build SVG positions for edges ──
  const pos = posRef.current;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="matrix-container">

        {/* ── LEFT: Source Node ── */}
        <div className="node-column">
          <div className="sender-offset">
            <EndPoint type="Sender" label="Source Node" imageSrc="/images/computer.png" isActive={isSending} />
          </div>
          <button
            className="bg-gradient font-basic"
            style={{ ...buttonStyle, opacity: isSending ? 0.5 : 1, cursor: isSending ? 'not-allowed' : 'pointer' }}
            onClick={handleSendFile}
            disabled={isSending}
          >
            {isSending ? "Processing..." : "Send Data"}
          </button>
          <button style={{ ...buttonStyle, backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', fontSize: '1rem', marginTop: '10px' }} onClick={handleClear}>
            Reset Network
          </button>
        </div>

        {/* ── CENTER: Mesh Topology ── */}
        <div className="trunk-column" style={{ overflow: 'visible' }}>
          <div ref={meshRef} className="mesh-grid" style={{ position: 'relative', overflow: 'visible' }}>

            {/* SVG mesh connections */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 0 }}>
              {EDGES.map(edge => {
                const pa = pos[edge.from];
                const pb = pos[edge.to];
                if (!pa || !pb) return null;
                const isAct = activeLinks.has(edge.key);
                return (
                  <line key={edge.key} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                    className={isAct ? "mesh-link-active" : "mesh-link"} />
                );
              })}
            </svg>

            {/* Router nodes */}
            {MESH.map(r => (
              <div
                key={r.id}
                ref={el => { routerElsRef.current[r.id] = el; }}
                style={{ gridRow: r.row + 1, gridColumn: r.col + 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}
              >
                <div style={{ transform: 'scale(0.52)', transformOrigin: 'center center' }}>
                  <RouterNode
                    id={r.id.replace('R', '')}
                    queueCount={queuesDisplay[r.id]}
                    isCongested={queuesDisplay[r.id] >= 5}
                    imageSrc="/images/switch.png"
                  />
                </div>
              </div>
            ))}

            {/* Animated datagrams */}
            {packets.map(pkt => (
              <div
                key={pkt.id}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: `translate(${pkt.x - 15}px, ${pkt.y - 15}px)`,
                  opacity: pkt.opacity,
                  transition: 'transform 0.5s linear, opacity 0.5s ease',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                <Datagram id={pkt.label} status={pkt.status === 'dropped' ? 'dropped' : 'moving'} />
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Destination Server ── */}
        <div className="node-column">
          <EndPoint type="Receiver" label="Destination Server" imageSrc="/images/server.png" isActive={false} />

          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: droppedPackets > 0 ? '#fee2e2' : 'transparent', border: `1px solid ${droppedPackets > 0 ? '#fca5a5' : 'transparent'}`, borderRadius: 'var(--border-radius)', textAlign: 'center' }}>
            <span className="font-typing" style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>
              PACKETS LOST: {droppedPackets}
            </span>
          </div>

          {arrivedBatches.filter(b => b.packets.length > 0).length > 0 && (
            <div style={{ marginTop: '10px', padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: 'var(--border-radius)', textAlign: 'left', maxHeight: '160px', overflowY: 'auto' }}>
              {arrivedBatches.filter(b => b.packets.length > 0).map(batch => (
                <div key={batch.id} style={{ marginBottom: '4px' }}>
                  <span className="font-typing" style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    Batch #{batch.id}: {batch.packets.join(' → ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Status Bar ── */}
      <div style={{ backgroundColor: 'var(--bg-light)', padding: '15px 20px', margin: '20px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <p className="font-typing" style={{ color: 'var(--accent-orange)', margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
          &gt; <TypewriterText text={statusText} /><span className="cursor-blink" style={{color: 'var(--text-dark)'}}>_</span>
        </p>
      </div>

    </div>
  );
}

export default RouterWeb;