import { useRef, useEffect } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

export default function FHEPipelineViz() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Interaction & Scroll State
  const { scrollYProgress } = useScroll();
  const smoothScrollPhase = useSpring(scrollYProgress, { damping: 30, stiffness: 100 });
  
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
  const HELIX_RADIUS = 280; // Large enough to fill the space
  
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
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

    // Theme colors for higher contrast
    const colors = [
      { r: 15, g: 110, b: 106 }, // Deep Teal (Darkest, most visible)
      { r: 13, g: 148, b: 136 }, // Medium Teal
      { r: 45, g: 212, b: 191 }, // Mint (Highlight)
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
        
        const randColor = Math.random();
        let colorObj = colors[0]; // 50% Deep Teal
        if (randColor > 0.5 && randColor <= 0.85) colorObj = colors[1]; // 35% Medium Teal
        else if (randColor > 0.85) colorObj = colors[2]; // 15% Mint Highlight

        particles.push({
          type: 'strand',
          t,
          strandOffset: strand,
          noiseRadius,
          speed: (Math.random() * 0.01) + 0.005, // Speed of traversal
          size: Math.random() * 2.0 + 1.0, // Increased size for visibility
          colorObj,
          isAttached: true,
          velocity: { x: 0, y: 0, z: 0 },
          opacity: Math.random() * 0.5 + 0.5 // Higher base opacity
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
            size: Math.random() * 1.5 + 0.5,
            colorObj: colors[1], // Medium Teal rungs
            isAttached: true,
            velocity: { x: 0, y: 0, z: 0 },
            opacity: Math.random() * 0.5 + 0.3
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

      // Parallax easing
      mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
      mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;

      // Random detachment (Disintegration into hex strings)
      if (Math.random() < 0.15) {
        const attached = particles.filter(p => p.isAttached);
        if (attached.length > 0) {
          const p = attached[Math.floor(Math.random() * attached.length)];
          p.isAttached = false;
          // Slowly drift outward and dissolve
          p.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2.5 - 0.5, // Mostly float up slightly
            z: (Math.random() - 0.5) * 2
          };
          p.hexText = hexStrings[Math.floor(Math.random() * hexStrings.length)];
          p.size = 12; // Font size for text
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
            p.size = Math.random() * 1.5 + 0.5; // FIX: Reset size back to normal!
            p.hexText = null;
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

        if (p.isAttached) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, projectedSize, 0, Math.PI * 2);
          ctx.fillStyle = colorStr;
          ctx.fill();

          // Soft bloom for larger/closer particles (using fixed p.size so it doesn't flicker)
          if (p.size > 2.2) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, projectedSize * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.colorObj.r}, ${p.colorObj.g}, ${p.colorObj.b}, ${alpha * 0.2})`;
            ctx.fill();
          }
        } else if (p.hexText) {
          // Render floating hex text directly in canvas for disintegrated particles
          ctx.font = `${Math.max(6, projectedSize)}px var(--font-mono, monospace)`;
          ctx.fillStyle = colorStr;
          ctx.fillText(p.hexText, screenX, screenY);
        }
      });

      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();
    return () => cancelAnimationFrame(animId);
  }, [smoothScrollPhase]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: WIDTH, height: HEIGHT, margin: '0 auto' }}>
      {/* CANVAS BACKGROUND (DNA Helix) */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0, left: '15%',
          width: WIDTH, height: HEIGHT,
          pointerEvents: 'none',
          zIndex: 1,
          transform: 'rotate(-15deg) scale(1.15)',
          transformOrigin: 'center center'
        }}
      />
    </div>
  );
}
