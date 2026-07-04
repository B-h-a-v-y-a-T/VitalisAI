import { useEffect, useRef } from 'react';

// Curated narrow/medium characters to prevent wide layout bleeding
const CHARS = '0123456789/*-+|<>[]{}?!';

export default function ScrambleText({ text, delay = 0, duration = 1500, className = '', style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let timeout;
    let animFrame;
    let startTime;
    let lastUpdate = 0;

    const charElements = containerRef.current ? containerRef.current.querySelectorAll('.scramble-char') : [];

    const animate = () => {
      if (!startTime) startTime = Date.now();
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (charElements.length === 0) return;

      if (progress === 1) {
        charElements.forEach((el) => {
          el.textContent = el.getAttribute('data-char');
        });
        return;
      }

      // Throttle updates for a smooth, readable scramble effect
      if (now - lastUpdate > 30) {
        charElements.forEach((el) => {
          const char = el.getAttribute('data-char');
          const globalIndex = parseInt(el.getAttribute('data-index'), 10);
          const revealThreshold = globalIndex / text.length;

          if (progress > revealThreshold + Math.random() * 0.2) {
            el.textContent = char;
          } else {
            el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
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
  let globalIndex = 0;

  return (
    <span 
      ref={containerRef} 
      className={className} 
      style={{ 
        ...style,
        display: style?.display || 'inline'
      }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} style={{ whiteSpace: 'nowrap', display: 'inline' }}>
          {word.split('').map((char, cIdx) => {
            const currentIndex = globalIndex++;
            return (
              <span 
                key={cIdx} 
                style={{ 
                  display: 'inline-grid', 
                  gridTemplateColumns: 'min-content',
                  lineHeight: 'inherit',
                  verticalAlign: 'baseline'
                }}
              >
                {/* Invisible character strictly locks the layout track size */}
                <span 
                  style={{ 
                    visibility: 'hidden', 
                    gridArea: '1/1',
                    lineHeight: 'inherit'
                  }}
                >
                  {char}
                </span>
                
                {/* Scrambled character perfectly centered, inheriting gradient */}
                <span 
                  className="scramble-char" 
                  data-char={char} 
                  data-index={currentIndex}
                  style={{ 
                    gridArea: '1/1', 
                    placeSelf: 'center',
                    width: '100%',
                    textAlign: 'center',
                    overflow: 'visible',
                    // Explicit inheritance to guarantee WebKit gradient rendering
                    color: 'inherit',
                    WebkitTextFillColor: 'inherit',
                    lineHeight: 'inherit'
                  }}
                >
                  {/* Initial state */}
                  {CHARS[Math.floor(Math.random() * CHARS.length)]}
                </span>
              </span>
            );
          })}
          {wIdx < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}
