import { useState, useEffect } from 'react';

const CHARS = '0123456789ABCDEF!@#$%^&*';

export default function ScrambleText({ text, delay = 0, duration = 1500, className }) {
  const [displayText, setDisplayText] = useState(
    text.replace(/[a-zA-Z0-9]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)])
  );
  
  useEffect(() => {
    let timeout;
    let interval;
    
    timeout = setTimeout(() => {
      const startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        if (progress === 1) {
          setDisplayText(text);
          clearInterval(interval);
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
        setDisplayText(scrambled);
      }, 50);
      
    }, delay);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, duration]);

  return <span className={className}>{displayText}</span>;
}
