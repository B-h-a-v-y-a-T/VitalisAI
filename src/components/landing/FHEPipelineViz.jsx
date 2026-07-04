import { useRef, useEffect } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';

export default function FHEPipelineViz() {
  const canvasRef = useRef(null);
  
  // Scroll Parallax for rotation speed
  const { scrollYProgress } = useScroll();
  const scrollSpeed = useTransform(scrollYProgress, [0, 1], [0.002, 0.012]);
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
    
    // 3D Engine constants (ENLARGED)
    const FOV = 700;
    const HELIX_RADIUS = 180; 
    const HELIX_HEIGHT = HEIGHT * 1.3;
    const CENTER_Y = HEIGHT / 2;
    const CENTER_X = WIDTH / 2;
    
    let particles = [];
    let rotation = 0;
    let animId;

    const hexStrings = ['0xa7f3...', '0xe2b1...', '0xc8e3...', '0x9d4c...', '0x1bf6...', '0xf4a2...', '0x33d1...'];

    // Few distinct colors from the theme
    const themeColors = [
      { r: 45, g: 212, b: 191 }, // Mint
      { r: 15, g: 110, b: 106 }, // Deep Teal
      { r: 59, g: 130, b: 246 }, // Blue accent
    ];

    // Generate Point Cloud
    const generateDNA = () => {
      particles = [];
      const numTwists = 2.5;
      const pointsPerTwist = 1800; // Increased density for larger gene
      const totalPoints = numTwists * pointsPerTwist;

      for (let i = 0; i < totalPoints; i++) {
        const t = (i / totalPoints) * Math.PI * 2 * numTwists;
        const y = (i / totalPoints) * HELIX_HEIGHT - (HELIX_HEIGHT / 2);
        
        [0, Math.PI].forEach((phaseOffset) => {
          // Add noise/thickness to the strand
          const noiseR = Math.random() * 30; // Wider spread
          const noiseTheta = Math.random() * Math.PI * 2;
          const r = HELIX_RADIUS + Math.cos(noiseTheta) * noiseR;
          
          const x = Math.sin(t + phaseOffset) * r;
          const z = Math.cos(t + phaseOffset) * r;
          
          // Select one of the few colors
          const colorObj = themeColors[Math.floor(Math.random() * themeColors.length)];
          
          particles.push({
            origX: x, origY: y, origZ: z,
            x, y, z,
            size: Math.random() * 2 + 1, // Slightly larger particles
            colorObj,
            isAttached: true,
            velocity: { x: 0, y: 0, z: 0 },
            hexText: null,
            opacity: Math.random() * 0.7 + 0.3 // Base opacity
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
        
        const rungDensity = 80;
        for (let j = 0; j <= rungDensity; j++) {
          const f = j / rungDensity;
          const nx = (Math.random() - 0.5) * 15;
          const ny = (Math.random() - 0.5) * 15;
          const nz = (Math.random() - 0.5) * 15;

          const px = x1 + (x2 - x1) * f + nx;
          const pz = z1 + (z2 - z1) * f + nz;
          const py = y + ny;

          particles.push({
            origX: px, origY: py, origZ: pz,
            x: px, y: py, z: pz,
            size: Math.random() * 2 + 0.5,
            colorObj: themeColors[0], // Mint glow for rungs
            isAttached: true,
            velocity: { x: 0, y: 0, z: 0 },
            hexText: null,
            opacity: Math.random() * 0.8 + 0.2
          });
        }
      }
    };

    generateDNA();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // ADD EFFECTS: Use screen blending for a glowing look
      ctx.globalCompositeOperation = 'screen';
      
      const currentSpeed = smoothScrollSpeed.get() || 0.005;
      rotation += currentSpeed;
      
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      // Disintegration logic
      if (Math.random() < 0.15) {
        const attached = particles.filter(p => p.isAttached);
        if (attached.length > 0) {
          const p = attached[Math.floor(Math.random() * attached.length)];
          p.isAttached = false;
          // Drift outward from the center
          const driftSpeed = 0.8;
          p.velocity = {
            x: (p.origX / HELIX_RADIUS) * driftSpeed + (Math.random() - 0.5),
            y: (Math.random() - 0.5) * 3 - 1.5,
            z: (p.origZ / HELIX_RADIUS) * driftSpeed + (Math.random() - 0.5)
          };
          p.hexText = hexStrings[Math.floor(Math.random() * hexStrings.length)];
          p.size = 12; // Larger text
        }
      }

      // Sort by Z
      particles.forEach(p => {
        if (p.isAttached) {
          p.x = p.origX * cos - p.origZ * sin;
          p.z = p.origZ * cos + p.origX * sin;
          p.y = p.origY;
        } else {
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.z += p.velocity.z;
          p.opacity -= 0.003; 
          if (p.opacity < 0) {
             p.isAttached = true;
             p.opacity = Math.random() * 0.7 + 0.3;
             p.hexText = null;
             p.size = Math.random() * 2 + 1;
          }
        }
      });

      particles.sort((a, b) => b.z - a.z);

      // Draw
      particles.forEach(p => {
        if (p.opacity <= 0) return;

        const perspective = FOV / (FOV + p.z + 400); 
        if (perspective < 0) return;

        const screenX = p.x * perspective + CENTER_X;
        const screenY = p.y * perspective + CENTER_Y;
        const projectedSize = p.size * perspective;

        const alpha = Math.min(1, Math.max(0.05, perspective * p.opacity));
        const colorStr = `rgba(${p.colorObj.r}, ${p.colorObj.g}, ${p.colorObj.b}, ${alpha})`;

        if (p.isAttached) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, projectedSize, 0, Math.PI * 2);
          ctx.fillStyle = colorStr;
          ctx.fill();
          
          // ADD EFFECTS: Add a secondary glow for larger particles
          if (projectedSize > 2 && Math.random() > 0.8) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, projectedSize * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.colorObj.r}, ${p.colorObj.g}, ${p.colorObj.b}, ${alpha * 0.3})`;
            ctx.fill();
          }
        } else if (p.hexText) {
          ctx.font = `${Math.max(6, projectedSize)}px var(--font-mono, monospace)`;
          ctx.fillStyle = colorStr;
          ctx.fillText(p.hexText, screenX, screenY);
        }
      });

      ctx.globalCompositeOperation = 'source-over'; // Reset for next frame
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [smoothScrollSpeed]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 900, display: 'flex', justifyContent: 'center' }}>
      <canvas 
        ref={canvasRef} 
        style={{
          width: 700,
          height: 900,
          pointerEvents: 'none',
          // TILT THE GENE LEFT BY 15 DEGREES
          transform: 'rotate(-15deg) scale(1.15)',
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}
