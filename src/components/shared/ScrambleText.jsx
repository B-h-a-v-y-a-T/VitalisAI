import { useEffect, useRef } from 'react';

// Using narrower characters to prevent line wrapping overflow and layout shift
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
    
    // Initialize
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

      // Throttle updates for smooth aesthetic
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
        currentOffset += word.length + 1;

        return (
          <span key={wIdx}>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span className="scramble-original" style={{ opacity: 0, transition: 'opacity 0.1s' }}>
                {word}
              </span>
              <span 
                className="scramble-overlay" 
                data-word={word} 
                data-offset={offset}
                style={{ 
                  position: 'absolute', 
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  color: 'inherit',
                  WebkitTextFillColor: 'inherit',
                }}
              >
                {word.replace(/./g, () => CHARS[Math.floor(Math.random() * CHARS.length)])}
              </span>
            </span>
            {wIdx < words.length - 1 && ' '}
          </span>
        );
      })}
    </span>
  );
}
