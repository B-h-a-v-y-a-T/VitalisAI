import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useScroll, useTransform, useSpring } from 'framer-motion';
import { Lock, Shield, Database, Server, CheckCircle, FileCode2 } from 'lucide-react';

export default function FHEPipelineViz() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const packetsContainerRef = useRef(null);
  
  // Interaction & Scroll State
  const { scrollYProgress } = useScroll();
  const smoothScrollPhase = useSpring(scrollYProgress, { damping: 30, stiffness: 100 });
  
  const [activeStep, setActiveStep] = useState(0);
  
  // Parallax
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);

  // Configuration
  const HEIGHT = 1000;
  const WIDTH = 800;
  const CENTER_X = WIDTH / 2;
  const CENTER_Y = HEIGHT / 2;
  const HELIX_RADIUS = 280; // Large enough to enclose the cards
  
  const steps = [
    { icon: Database, label: 'Hospital\nDataset', color: '#3B82F6' },
    { icon: Lock, label: 'Browser\nEncryption', color: '#2DD4BF' },
    { icon: Shield, label: 'Encrypted\nDataset', color: '#0F6E6A' },
    { icon: Server, label: 'FHE Matching\nEngine', color: '#2DD4BF' },
    { icon: FileCode2, label: 'Encrypted\nEligibility Score', color: '#0F6E6A' },
    { icon: CheckCircle, label: 'Matched\nPatient IDs', color: '#10B981' },
  ];

  // Map steps to precise Y coordinates
  const stepNodes = steps.map((_, i) => ({
    y: 120 + i * ((HEIGHT - 240) / (steps.length - 1))
  }));
  const BROWSER_ENC_Y = stepNodes[1].y;
  const FHE_ENGINE_Y = stepNodes[3].y;

  // DOM Packets State
  const domPackets = useRef([]);
  const hexStrings = ['0xa7f3...', '0xe2b1...', '0xc8e3...', '0x9d4c...', '0x1bf6...', '0xf4a2...', '0x33d1...'];

  useEffect(() => {
    // Mouse tracking for subtle parallax
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX.current = x * 30;
      targetMouseY.current = y * 30;
    };
    
    const unsubscribeScroll = scrollYProgress.onChange((v) => {
      // Map scroll progress to active card
      const stepIndex = Math.min(steps.length - 1, Math.floor(v * steps.length * 1.5));
      setActiveStep(stepIndex);
    });

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribeScroll();
      domPackets.current.forEach(p => p.el.remove());
      domPackets.current = [];
    };
  }, [scrollYProgress, steps.length]);

  // ---------------------------------------------------------
  // CANVAS DNA ENGINE
  // ---------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    const FOV = 800;
    let particles = [];
    let animId;
    let baseRotation = 0;

    // Theme colors
    const colors = [
      { r: 45, g: 212, b: 191 }, // Mint
      { r: 15, g: 110, b: 106 }, // Deep Teal
      { r: 255, g: 255, b: 255 }, // White highlights
    ];

    // Initialize DNA particles
    const initDNA = () => {
      particles = [];
      const numStrandParticles = 3000;
      const numTwists = 2.5;

      // 1. Strand Particles (Traverse along the curve)
      for (let i = 0; i < numStrandParticles; i++) {
        const t = Math.random() * Math.PI * 2 * numTwists;
        const strand = Math.random() > 0.5 ? 0 : Math.PI; // Phase offset
        
        // Noise for organic ribbon width
        const noiseRadius = (Math.random() - 0.5) * 40; 
        
        particles.push({
          type: 'strand',
          t,
          strandOffset: strand,
          noiseRadius,
          speed: (Math.random() * 0.01) + 0.005, // Speed of traversal
          size: Math.random() * 1.5 + 0.5,
          colorObj: Math.random() > 0.1 ? colors[0] : colors[2], // Mostly mint, some white
          isAttached: true,
          velocity: { x: 0, y: 0, z: 0 },
          opacity: Math.random() * 0.7 + 0.3
        });
      }

      // 2. Rung Particles (Horizontal bridges connecting strands)
      const numRungs = 20;
      for (let i = 0; i < numRungs; i++) {
        const rungT = (i / numRungs) * Math.PI * 2 * numTwists;
        for (let j = 0; j < 80; j++) {
          particles.push({
            type: 'rung',
            t: rungT,
            fraction: Math.random(), // Position along the rung (0 to 1)
            speed: (Math.random() - 0.5) * 0.005, // Slight back and forth
            noiseY: (Math.random() - 0.5) * 15,
            noiseZ: (Math.random() - 0.5) * 15,
            size: Math.random() * 1.5 + 0.2,
            colorObj: colors[1], // Teal rungs
            isAttached: true,
            velocity: { x: 0, y: 0, z: 0 },
            opacity: Math.random() * 0.5 + 0.1
          });
        }
      }
    };

    initDNA();

    const renderCanvas = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.globalCompositeOperation = 'screen';
      
      // Calculate rotation (time + scroll)
      baseRotation += 0.002;
      const scrollRot = smoothScrollPhase.get() * Math.PI;
      const totalRotation = baseRotation + scrollRot;
      
      const cos = Math.cos(totalRotation);
      const sin = Math.sin(totalRotation);

      // Random detachment (Disintegration)
      if (Math.random() < 0.1) {
        const attached = particles.filter(p => p.isAttached);
        if (attached.length > 0) {
          const p = attached[Math.floor(Math.random() * attached.length)];
          p.isAttached = false;
          // Slowly drift outward and dissolve
          p.velocity = {
            x: (Math.random() - 0.5) * 1.5,
            y: (Math.random() - 0.5) * 2 - 0.5, // Mostly float up slightly
            z: (Math.random() - 0.5) * 1.5
          };
        }
      }

      const numTwists = 2.5;
      const heightScale = HEIGHT * 1.2 / (Math.PI * 2 * numTwists);

      // Process and render particles
      const renderList = [];

      particles.forEach(p => {
        if (p.opacity <= 0) return;

        let origX, origY, origZ;

        if (p.isAttached) {
          if (p.type === 'strand') {
            // Move along the strand
            p.t += p.speed;
            if (p.t > Math.PI * 2 * numTwists) p.t = 0; // Wrap around
            
            const r = HELIX_RADIUS + p.noiseRadius;
            origX = Math.sin(p.t + p.strandOffset) * r;
            origZ = Math.cos(p.t + p.strandOffset) * r;
            origY = p.t * heightScale - (HEIGHT * 1.2 / 2);
          } else if (p.type === 'rung') {
            // Move along the rung
            p.fraction += p.speed;
            if (p.fraction > 1 || p.fraction < 0) p.speed *= -1; // Bounce
            
            const r = HELIX_RADIUS;
            const x1 = Math.sin(p.t) * r;
            const z1 = Math.cos(p.t) * r;
            const x2 = Math.sin(p.t + Math.PI) * r;
            const z2 = Math.cos(p.t + Math.PI) * r;
            
            origX = x1 + (x2 - x1) * p.fraction;
            origZ = z1 + (z2 - z1) * p.fraction + p.noiseZ;
            origY = p.t * heightScale - (HEIGHT * 1.2 / 2) + p.noiseY;
          }

          // Apply global rotation
          p.x = origX * cos - origZ * sin;
          p.z = origZ * cos + origX * sin;
          p.y = origY;
          
          // Apply mouse parallax locally to 3D space
          p.x += mouseX.current;
          p.y += mouseY.current;

        } else {
          // Detached particle logic (disintegration)
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.z += p.velocity.z;
          p.opacity -= 0.005; // Dissolve
          
          if (p.opacity < 0) {
            // Re-attach to maintain density
            p.isAttached = true;
            p.opacity = Math.random() * 0.7 + 0.3;
            if (p.type === 'strand') p.t = Math.random() * Math.PI * 2 * numTwists;
          }
        }

        renderList.push(p);
      });

      // Z-Sort (Painter's Algorithm)
      renderList.sort((a, b) => b.z - a.z);

      renderList.forEach(p => {
        const perspective = FOV / (FOV + p.z + 500); // 500 offset pushes it back
        if (perspective < 0) return;

        const screenX = p.x * perspective + CENTER_X;
        // Shift entire DNA up slightly on scroll
        const scrollYShift = smoothScrollPhase.get() * -100;
        const screenY = p.y * perspective + CENTER_Y + scrollYShift;
        const projectedSize = p.size * perspective;

        const alpha = Math.min(1, Math.max(0.02, perspective * p.opacity));
        const colorStr = `rgba(${p.colorObj.r}, ${p.colorObj.g}, ${p.colorObj.b}, ${alpha})`;

        ctx.beginPath();
        ctx.arc(screenX, screenY, projectedSize, 0, Math.PI * 2);
        ctx.fillStyle = colorStr;
        ctx.fill();

        // Soft bloom for larger/closer particles
        if (projectedSize > 1.5 && Math.random() > 0.7) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, projectedSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.colorObj.r}, ${p.colorObj.g}, ${p.colorObj.b}, ${alpha * 0.2})`;
          ctx.fill();
        }
      });

      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();
    return () => cancelAnimationFrame(animId);
  }, [smoothScrollPhase]);

  // ---------------------------------------------------------
  // DOM PACKETS ENGINE (Encrypted Data Origin & Flow)
  // ---------------------------------------------------------
  useAnimationFrame((time) => {
    // Parallax easing
    mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
    mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;

    // 1. Spawning Packets from DNA strands
    if (Math.random() < 0.03 && domPackets.current.length < 15) {
      // Find a visual coordinate representing the strand edge
      const yOrig = Math.random() * (BROWSER_ENC_Y - 150) + 50; 
      const isLeft = Math.random() > 0.5;
      const xOrig = isLeft ? CENTER_X - HELIX_RADIUS : CENTER_X + HELIX_RADIUS;

      const el = document.createElement('div');
      el.className = 'dom-packet';
      el.innerHTML = `<span>${hexStrings[Math.floor(Math.random() * hexStrings.length)]}</span>`;
      packetsContainerRef.current?.appendChild(el);

      domPackets.current.push({
        el,
        x: xOrig,
        y: yOrig,
        targetY: HEIGHT + 100, // Flows all the way down
        progress: 0,
        speed: 0.001 + Math.random() * 0.0005, // Smooth slow speed
        state: 'converging', // converging -> fragmenting -> flowing
      });
    }

    // 2. Process Packet Flow
    for (let i = domPackets.current.length - 1; i >= 0; i--) {
      const p = domPackets.current[i];
      p.progress += p.speed;
      
      let currentX = p.x;
      let currentY = p.y + (p.targetY - p.y) * p.progress; // Linear vertical flow

      // State: Converging (Drifting from strand edge to center pipeline)
      if (p.state === 'converging') {
        const distanceToEncryption = Math.max(0, BROWSER_ENC_Y - currentY);
        const totalDistance = BROWSER_ENC_Y - p.y;
        const convergenceFactor = 1 - (distanceToEncryption / totalDistance);
        
        // Easing function for smooth horizontal convergence
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        currentX = p.x + (CENTER_X - p.x) * easeOutCubic(convergenceFactor);

        if (currentY >= BROWSER_ENC_Y - 30) {
          p.state = 'fragmenting';
          p.el.classList.add('packet-fragment');
          
          // Trigger the CSS animation
          setTimeout(() => {
            if (p.el && p.el.parentNode) {
              p.state = 'secured';
              p.el.classList.remove('packet-fragment');
              p.el.classList.add('packet-secured');
              p.el.innerHTML = `<span style="margin-right:4px; font-size:0.6rem">🔒</span>${p.el.textContent}`;
              p.speed *= 1.5; // Accelerate slightly after encryption
            }
          }, 800); // 800ms fragment animation
        }
      } else {
        // Once converging is done, it flows straight down the center axis
        currentX = CENTER_X;
      }

      // State: Computing (FHE Engine)
      if (p.state === 'secured' && currentY >= FHE_ENGINE_Y && currentY <= FHE_ENGINE_Y + 50) {
        if (!p.el.classList.contains('packet-computing')) {
          p.el.classList.add('packet-computing');
          setTimeout(() => {
            if (p.el && p.el.parentNode) p.el.classList.remove('packet-computing');
          }, 1000);
        }
      }

      // Parallax applied to packets (less intense than DNA for depth)
      const px = currentX + mouseX.current * 0.5;
      const py = currentY + mouseY.current * 0.5;

      p.el.style.transform = `translate(${px}px, ${py}px)`;

      // Cleanup
      if (p.progress >= 1 || currentY > HEIGHT) {
        p.el.remove();
        domPackets.current.splice(i, 1);
      }
    }
  });

  return (
    <div ref={containerRef} style={{ position: 'relative', width: WIDTH, height: HEIGHT, margin: '0 auto' }}>
      <style>{`
        .dom-packet {
          position: absolute;
          top: 0; left: 0;
          transform: translate(-50%, -50%);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--mint);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          white-space: nowrap;
          pointer-events: none;
          z-index: 20;
          opacity: 0.8;
          transition: background 0.4s ease, border 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
          background: rgba(10, 46, 54, 0.4);
          border: 1px solid rgba(45, 212, 191, 0.2);
          backdrop-filter: blur(4px);
        }

        .packet-fragment span {
          display: inline-block;
          animation: fragment-anim 0.8s ease-in-out forwards;
        }

        @keyframes fragment-anim {
          0% { filter: blur(0px); letter-spacing: normal; transform: scale(1); opacity: 1; color: var(--mint); }
          40% { filter: blur(3px); letter-spacing: 4px; transform: scale(1.1); opacity: 0.7; color: white; }
          100% { filter: blur(0px); letter-spacing: normal; transform: scale(1); opacity: 1; color: var(--mint); }
        }

        .packet-secured {
          background: rgba(45, 212, 191, 0.15);
          border: 1px solid rgba(45, 212, 191, 0.8);
          color: white;
          box-shadow: 0 0 20px rgba(45, 212, 191, 0.4);
          font-weight: 600;
        }

        .packet-computing {
          background: rgba(15, 110, 106, 0.4);
          border: 1px solid var(--teal);
          box-shadow: 0 0 30px rgba(15, 110, 106, 0.6);
        }

        .pipeline-card {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05); /* Light/Dark friendly */
          backdrop-filter: blur(12px);
          border: 1px solid rgba(45, 212, 191, 0.15);
          border-radius: var(--radius-xl);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
        }
        
        [data-theme="dark"] .pipeline-card {
           background: rgba(10, 46, 54, 0.5);
           border: 1px solid rgba(45, 212, 191, 0.1);
        }

        .pipeline-card.active {
          border-color: rgba(45, 212, 191, 0.8);
          box-shadow: 0 12px 40px rgba(45, 212, 191, 0.25), inset 0 1px 1px rgba(255,255,255,0.4);
          transform: translateX(-50%) scale(1.05);
          background: rgba(255, 255, 255, 0.1);
        }
        
        [data-theme="dark"] .pipeline-card.active {
           background: rgba(10, 46, 54, 0.8);
           box-shadow: 0 12px 40px rgba(45, 212, 191, 0.15), inset 0 1px 1px rgba(255,255,255,0.1);
        }

        .pipeline-card.past {
          border-color: rgba(45, 212, 191, 0.3);
          opacity: 0.8;
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          border-radius: var(--radius-xl);
          border: 2px dashed rgba(45, 212, 191, 0.6);
          animation: pulse-out 2s infinite cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        @keyframes pulse-out {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
      `}</style>

      {/* CANVAS BACKGROUND (DNA Helix) */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: WIDTH, height: HEIGHT,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* PACKETS LAYER (Emerging from DNA) */}
      <div ref={packetsContainerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />

      {/* PIPELINE CARDS (Foreground Enclosure) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep === i;
          const isPast = activeStep > i;
          
          let cardClass = 'pipeline-card';
          if (isActive) cardClass += ' active';
          if (isPast) cardClass += ' past';

          return (
            <div 
              key={i} 
              className={cardClass}
              style={{ top: stepNodes[i].y - 60 }} // Center the 120px tall card on the Y coord
            >
              {isActive && i === 3 && <div className="pulse-ring" />}
              
              <div style={{
                marginBottom: 10,
                color: isActive || isPast ? step.color : 'var(--mint)',
                opacity: isActive ? 1 : 0.6,
                transition: 'all 0.5s ease',
              }}>
                <Icon size={28} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              
              <span style={{
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 600,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textAlign: 'center',
                whiteSpace: 'pre-line',
                lineHeight: 1.3,
                letterSpacing: '0.02em',
                transition: 'color 0.5s ease',
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
