import { useEffect, useRef } from 'react';

const CHARS = '0123456789ABCDEF!@#$%^&*';

export default function ScrambleText({ text, delay = 0, duration = 1500, className, style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let timeout;
    let animFrame;
    let startTime;

    const charsElements = containerRef.current ? containerRef.current.querySelectorAll('.scramble-char') : [];
    
    const animate = () => {
      if (!startTime) startTime = Date.now();
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (charsElements.length === 0) return;

      if (progress === 1) {
        charsElements.forEach((el) => {
          el.textContent = el.getAttribute('data-char');
        });
        return;
      }

      charsElements.forEach((el) => {
        const char = el.getAttribute('data-char');
        const i = parseInt(el.getAttribute('data-index'), 10);
        const revealThreshold = i / text.length;

        if (progress > revealThreshold + Math.random() * 0.3) {
          el.textContent = char;
        } else {
          el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      });

      animFrame = requestAnimationFrame(() => {
        setTimeout(animate, 40);
      });
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
    <span ref={containerRef} className={className} style={style}>
      {words.map((word, wIdx) => (
        <span key={wIdx} style={{ whiteSpace: 'nowrap' }}>
          {word.split('').map((char, cIdx) => {
            const currentIndex = globalIndex++;
            return (
              <span key={cIdx} style={{ display: 'inline-grid' }}>
                <span style={{ visibility: 'hidden', gridArea: '1/1' }}>{char}</span>
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
                    className="scramble-char" 
                    data-char={char} 
                    data-index={currentIndex}
                  >
                    {CHARS[Math.floor(Math.random() * CHARS.length)]}
                  </span>
                </span>
              </span>
            );
          })}
          {wIdx < words.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.25em' }}> </span>
          )}
        </span>
      ))}
    </span>
  );
}
