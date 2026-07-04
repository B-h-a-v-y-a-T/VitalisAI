import { useEffect, useRef } from 'react';

const CHARS = '0123456789ABCDEF!@#$%^&*';

export default function ScrambleText({ text, delay = 0, duration = 1500, className, style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let timeout;
    let animFrame;
    let startTime;
    let lastUpdate = 0;

    const wordElements = containerRef.current ? containerRef.current.querySelectorAll('.scramble-word') : [];
    
    const animate = () => {
      if (!startTime) startTime = Date.now();
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (wordElements.length === 0) return;

      if (progress === 1) {
        wordElements.forEach((el) => {
          el.textContent = el.getAttribute('data-word');
        });
        return;
      }

      // Throttle updates to ~30fps for visual smoothness without lag
      if (now - lastUpdate > 30) {
        wordElements.forEach((el) => {
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
    <span ref={containerRef} className={className} style={{ ...style, display: 'inline-block' }}>
      {words.map((word, wIdx) => {
        const offset = currentOffset;
        currentOffset += word.length + 1; // +1 for the space

        return (
          <span key={wIdx} style={{ whiteSpace: 'nowrap' }}>
            <span style={{ display: 'inline-grid' }}>
              <span style={{ visibility: 'hidden', gridArea: '1/1' }}>{word}</span>
              <span 
                style={{ 
                  gridArea: '1/1', 
                  placeSelf: 'center',
                  width: 0,
                  height: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'visible'
                }}
              >
                <span 
                  className="scramble-word" 
                  data-word={word} 
                  data-offset={offset}
                  style={{ 
                    color: 'inherit',
                    WebkitTextFillColor: 'inherit',
                    background: 'inherit',
                    backgroundImage: 'inherit',
                    WebkitBackgroundClip: 'inherit',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {word.replace(/./g, () => CHARS[Math.floor(Math.random() * CHARS.length)])}
                </span>
              </span>
            </span>
            {wIdx < words.length - 1 && (
              <span style={{ display: 'inline-block', width: '0.25em' }}> </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
