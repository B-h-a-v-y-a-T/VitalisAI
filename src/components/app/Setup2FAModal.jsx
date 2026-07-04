import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { generateSecret, generateURI, verifySync } from 'otplib';
import { X, Copy, Check, ArrowRight } from 'lucide-react';
import GradientButton from '../shared/GradientButton';
import { useAuth } from '../../context/AuthContext';

export default function Setup2FAModal({ isOpen, onClose }) {
  const [secret, setSecret] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { enable2FA } = useAuth();

  useEffect(() => {
    if (isOpen) {
      // Generate a new secret when the modal opens
      const newSecret = generateSecret();
      setSecret(newSecret);
      
      // Generate the otpauth URL for the QR code
      const otpauth = generateURI({ issuer: 'Vitalis AI', label: 'user@vitalis.ai', secret: newSecret });
      setQrUrl(otpauth);
      setToken('');
      setError('');
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!token || token.length < 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      const isValid = verifySync({ token, secret });
      if (isValid && isValid.valid) {
        enable2FA(secret);
        onClose();
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during verification.');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(6, 14, 18, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '100%',
          maxWidth: 500,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-2xl)'
        }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Enable Two-Factor Authentication</h2>
          <button onClick={onClose} style={{ color: 'var(--text-tertiary)', padding: 4, borderRadius: '50%' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 24 }}>
              Scan this QR code with Google Authenticator or Authy to set up 2FA for your account.
            </p>
            
            <div style={{ 
              background: '#fff', 
              padding: 24, 
              borderRadius: 'var(--radius-lg)', 
              display: 'inline-block',
              marginBottom: 24
            }}>
              {qrUrl && <QRCodeSVG value={qrUrl} size={180} level="M" />}
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: 'var(--bg-tertiary)', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-secondary)'
            }}>
              <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                {secret.match(/.{1,4}/g)?.join(' ')}
              </code>
              <button onClick={handleCopy} style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                {copied ? <><Check size={14} color="var(--mint)" /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>

          <form onSubmit={handleVerify}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                Verify Code
              </label>
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
                  fontSize: '1.25rem',
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  padding: '12px'
                }}
              />
              
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

            <GradientButton type="submit" style={{ width: '100%', justifyContent: 'center' }} icon={ArrowRight}>
              Enable 2FA
            </GradientButton>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
