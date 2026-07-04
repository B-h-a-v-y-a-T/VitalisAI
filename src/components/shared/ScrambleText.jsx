import { useEffect, useRef } from 'react';

const CHARS = '0123456789ABCDEF!@#$%^&*';

export default function ScrambleText({ text, delay = 0, duration = 1500, className, style }) {
  const spanRef = useRef(null);

  useEffect(() => {
    let timeout;
    let animFrame;
    let startTime;
    
    // Set initial scrambled text immediately without React state
    if (spanRef.current) {
      spanRef.current.textContent = text.replace(/[a-zA-Z0-9]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
    }

    const animate = () => {
      if (!startTime) startTime = Date.now();
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (!spanRef.current) return;

      if (progress === 1) {
        spanRef.current.textContent = text;
        return;
      }

      let scrambled = '';
      for (let i = 0; i < text.length; i++) {
        const revealThreshold = i / text.length;
        
        if (text[i] === ' ') {
          scrambled += ' ';
        } else if (progress > revealThreshold + Math.random() * 0.3) {
          scrambled += text[i];
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      
      spanRef.current.textContent = scrambled;
      
      // Throttle the scramble effect slightly for visual aesthetics (e.g. updating every ~30-50ms)
      // but keeping it in requestAnimationFrame for smooth scheduling
      animFrame = requestAnimationFrame(() => {
        setTimeout(animate, 30);
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

  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }} className={className}>
      {/* Invisible placeholder to lock the exact final width and height */}
      <span style={{ visibility: 'hidden' }}>{text}</span>
      {/* Absolutely positioned scrambling text that won't affect layout width */}
      <span 
        ref={spanRef} 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center',
          background: 'inherit',
          backgroundImage: 'inherit',
          WebkitBackgroundClip: 'inherit',
          WebkitTextFillColor: 'inherit',
          color: 'inherit',
          whiteSpace: 'nowrap'
        }} 
      />
    </span>
  );
}
