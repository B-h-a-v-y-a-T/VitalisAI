import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GradientButton from '../shared/GradientButton';

export default function TwoFactorPrompt() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { verify2FA } = useAuth();

  const handleVerify = (e) => {
    e.preventDefault();
    if (!token || token.length < 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    
    const isValid = verify2FA(token);
    if (!isValid) {
      setError('Invalid code. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 50% 0%, rgba(45, 212, 191, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 100%, rgba(15, 110, 106, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-strong card-glow"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '40px',
          borderRadius: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <motion.img 
              src="/logo.png"
              alt="Vitalis Logo"
              animate={{ 
                filter: ['drop-shadow(0 4px 15px rgba(45, 212, 191, 0.3))', 'drop-shadow(0 4px 25px rgba(45, 212, 191, 0.6))', 'drop-shadow(0 4px 15px rgba(45, 212, 191, 0.3))'] 
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 48, height: 48, objectFit: 'contain' }}
            />
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: 300, 
              fontFamily: 'var(--font-sans)', 
              letterSpacing: '0.35em', 
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #6ee7b7 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: '8px'
            }}>
              Vitalis AI
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Two-Factor Authentication</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Please enter the 6-digit code from your authenticator app to access the platform.
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
              Authentication Code
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                <Key size={18} />
              </div>
              <input
                type="text"
                placeholder="000000"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                  setError('');
                }}
                className="input"
                style={{ 
                  paddingLeft: 42,
                  fontSize: '1.5rem',
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: 8, textAlign: 'center', fontWeight: 500 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <GradientButton type="submit" variant="glow" style={{ width: '100%', justifyContent: 'center', height: 48 }} icon={ArrowRight}>
            Verify and Proceed
          </GradientButton>
        </form>
      </motion.div>
    </div>
  );
}
