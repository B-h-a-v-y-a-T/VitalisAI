import { useRef, useEffect } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';

export default function FHEPipelineViz() {
  const canvasRef = useRef(null);
  
  // Scroll Parallax for rotation speed
  const { scrollYProgress } = useScroll();
  const scrollSpeed = useTransform(scrollYProgress, [0, 1], [0.002, 0.015]);
  const smoothScrollSpeed = useSpring(scrollSpeed, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const WIDTH = rect.width;
    const HEIGHT = rect.height;
    
    // 3D Engine constants
    const FOV = 600;
    const HELIX_RADIUS = 120;
    const HELIX_HEIGHT = HEIGHT * 1.2;
    const CENTER_Y = HEIGHT / 2;
    const CENTER_X = WIDTH / 2;
    
    let particles = [];
    let rotation = 0;
    let animId;

    const hexStrings = ['0xa7f3...', '0xe2b1...', '0xc8e3...', '0x9d4c...', '0x1bf6...', '0xf4a2...', '0x33d1...'];

    // Generate Point Cloud
    const generateDNA = () => {
      particles = [];
      const numTwists = 2.5;
      const pointsPerTwist = 1200;
      const totalPoints = numTwists * pointsPerTwist;

      for (let i = 0; i < totalPoints; i++) {
        const t = (i / totalPoints) * Math.PI * 2 * numTwists;
        const y = (i / totalPoints) * HELIX_HEIGHT - (HELIX_HEIGHT / 2);
        
        // Two strands (0 and PI phase offset)
        [0, Math.PI].forEach((phaseOffset) => {
          // Add noise/thickness to the strand
          const noiseR = Math.random() * 20; 
          const noiseTheta = Math.random() * Math.PI * 2;
          const r = HELIX_RADIUS + Math.cos(noiseTheta) * noiseR;
          
          const x = Math.sin(t + phaseOffset) * r;
          const z = Math.cos(t + phaseOffset) * r;
          
          // Color based on height and strand
          const colorIntensity = Math.random() * 0.5 + 0.5;
          const isMint = Math.random() > 0.5;
          const color = isMint ? `rgba(45, 212, 191, ${colorIntensity})` : `rgba(15, 110, 106, ${colorIntensity})`;
          
          particles.push({
            origX: x, origY: y, origZ: z,
            x, y, z,
            size: Math.random() * 1.5 + 0.5,
            color,
            isAttached: true,
            velocity: { x: 0, y: 0, z: 0 },
            hexText: null,
            opacity: 1
          });
        });
      }

      // Generate rungs (connections)
      const numRungs = 25;
      for (let i = 0; i < numRungs; i++) {
        const t = (i / numRungs) * Math.PI * 2 * numTwists;
        const y = (i / numRungs) * HELIX_HEIGHT - (HELIX_HEIGHT / 2);
        
        const x1 = Math.sin(t) * HELIX_RADIUS;
        const z1 = Math.cos(t) * HELIX_RADIUS;
        const x2 = Math.sin(t + Math.PI) * HELIX_RADIUS;
        const z2 = Math.cos(t + Math.PI) * HELIX_RADIUS;
        
        // Populate rung with dense particles
        const rungDensity = 50;
        for (let j = 0; j <= rungDensity; j++) {
          const f = j / rungDensity;
          // Add noise to rung
          const nx = (Math.random() - 0.5) * 10;
          const ny = (Math.random() - 0.5) * 10;
          const nz = (Math.random() - 0.5) * 10;

          const px = x1 + (x2 - x1) * f + nx;
          const pz = z1 + (z2 - z1) * f + nz;
          const py = y + ny;

          particles.push({
            origX: px, origY: py, origZ: pz,
            x: px, y: py, z: pz,
            size: Math.random() * 1.5 + 0.5,
            color: `rgba(45, 212, 191, ${Math.random() * 0.6 + 0.2})`, // Mint glow
            isAttached: true,
            velocity: { x: 0, y: 0, z: 0 },
            hexText: null,
            opacity: 1
          });
        }
      }
    };

    generateDNA();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Update rotation
      const currentSpeed = smoothScrollSpeed.get() || 0.005;
      rotation += currentSpeed;
      
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      // Disintegration logic: randomly detach a particle
      if (Math.random() < 0.2) {
        const attached = particles.filter(p => p.isAttached);
        if (attached.length > 0) {
          const p = attached[Math.floor(Math.random() * attached.length)];
          p.isAttached = false;
          // Drift outward from the center
          const driftSpeed = 0.5;
          p.velocity = {
            x: (p.origX / HELIX_RADIUS) * driftSpeed + (Math.random() - 0.5),
            y: (Math.random() - 0.5) * 2 - 1, // Mostly drift up
            z: (p.origZ / HELIX_RADIUS) * driftSpeed + (Math.random() - 0.5)
          };
          p.hexText = hexStrings[Math.floor(Math.random() * hexStrings.length)];
          p.size = 10; // Font size
        }
      }

      // Sort by Z for proper rendering order (painter's algorithm)
      // First project all points
      particles.forEach(p => {
        if (p.isAttached) {
          // Rotate original positions
          p.x = p.origX * cos - p.origZ * sin;
          p.z = p.origZ * cos + p.origX * sin;
          p.y = p.origY;
        } else {
          // Floating particles maintain their own rotation/position space but drift
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.z += p.velocity.z;
          p.opacity -= 0.002; // Fade out over time
          if (p.opacity < 0) {
             // Reset to attached to keep the loop going indefinitely
             p.isAttached = true;
             p.opacity = 1;
             p.hexText = null;
             p.size = Math.random() * 1.5 + 0.5;
          }
        }
      });

      // Z-sort
      particles.sort((a, b) => b.z - a.z);

      // Draw
      particles.forEach(p => {
        if (p.opacity <= 0) return;

        const perspective = FOV / (FOV + p.z + 400); // push back on Z
        
        // Culling behind camera
        if (perspective < 0) return;

        const screenX = p.x * perspective + CENTER_X;
        const screenY = p.y * perspective + CENTER_Y;
        const projectedSize = p.size * perspective;

        if (p.isAttached) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, projectedSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, Math.max(0.1, perspective)); // Fade in distance
          ctx.fill();
        } else if (p.hexText) {
          ctx.font = `${Math.max(4, projectedSize)}px var(--font-mono, monospace)`;
          ctx.fillStyle = `rgba(45, 212, 191, ${p.opacity})`;
          ctx.globalAlpha = p.opacity;
          ctx.fillText(p.hexText, screenX, screenY);
        }
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [smoothScrollSpeed]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 900, display: 'flex', justifyContent: 'center' }}>
      <canvas 
        ref={canvasRef} 
        style={{
          width: 700,
          height: 900,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
