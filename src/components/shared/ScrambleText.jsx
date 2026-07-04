import { useEffect, useRef } from 'react';

// Curated narrow/medium characters to minimize width discrepancies
const CHARS = '0123456789/*-+|<>[]{}?!';

export default function ScrambleText({ text, delay = 0, duration = 1500, className = '', style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let timeout;
    let animFrame;
    let startTime;
    let lastUpdate = 0;

    const overlayElements = containerRef.current ? containerRef.current.querySelectorAll('.scramble-overlay') : [];
    const originalElements = containerRef.current ? containerRef.current.querySelectorAll('.scramble-original') : [];
    
    overlayElements.forEach(el => el.style.opacity = 1);
    originalElements.forEach(el => el.style.opacity = 0);

    const animate = () => {
      if (!startTime) startTime = Date.now();
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (overlayElements.length === 0) return;

      if (progress === 1) {
        overlayElements.forEach(el => el.style.opacity = 0);
        originalElements.forEach(el => el.style.opacity = 1);
        return;
      }

      // Throttle updates for smooth aesthetic (~30fps)
      if (now - lastUpdate > 30) {
        overlayElements.forEach((el) => {
          const word = el.getAttribute('data-word');
          const globalOffset = parseInt(el.getAttribute('data-offset'), 10);
          
          let scrambled = '';
          for (let i = 0; i < word.length; i++) {
            const revealThreshold = (globalOffset + i) / text.length;
            if (progress > revealThreshold + Math.random() * 0.2) {
              scrambled += word[i];
            } else {
              scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
            }
          }
          el.textContent = scrambled;
        });
        lastUpdate = now;
      }

      animFrame = requestAnimationFrame(animate);
    };

    timeout = setTimeout(() => {
      animFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [text, delay, duration]);

  const words = text.split(' ');
  let currentOffset = 0;

  return (
    <span ref={containerRef} className={className} style={style}>
      {words.map((word, wIdx) => {
        const offset = currentOffset;
        currentOffset += word.length + 1; // +1 for the space

        return (
          <span key={wIdx}>
            <span 
              style={{ 
                display: 'inline-grid', 
                // Force grid column to the exact width of the original word
                gridTemplateColumns: 'min-content' 
              }}
            >
              {/* Invisible original word sets the permanent layout size */}
              <span 
                className="scramble-original" 
                style={{ 
                  visibility: 'hidden', 
                  gridArea: '1/1', 
                  opacity: 0, 
                  transition: 'opacity 0.1s' 
                }}
              >
                {word}
              </span>
              
              {/* Normal-flow overlay for perfect gradient rendering */}
              <span 
                className="scramble-overlay" 
                data-word={word} 
                data-offset={offset}
                style={{ 
                  gridArea: '1/1', 
                  placeSelf: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  // Prevent the scrambled text from expanding the grid cell or overlapping
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}
              >
                {/* Initial random state */}
                {word.replace(/./g, () => CHARS[Math.floor(Math.random() * CHARS.length)])}
              </span>
            </span>
            {/* Native spaces for perfect line wrapping */}
            {wIdx < words.length - 1 && ' '}
          </span>
        );
      })}
    </span>
  );
}
