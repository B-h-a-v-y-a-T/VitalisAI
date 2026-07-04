import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/shared/GradientButton';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Mock signup by just logging them in for now
    login();
    navigate('/app');
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 15% 50%, rgba(45, 212, 191, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 85% 30%, rgba(15, 110, 106, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass card-glow"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '48px',
          borderRadius: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <img src="/logo.png" alt="Vitalis Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Sign up to access your secure workspace.</p>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="input"
                style={{ paddingLeft: 42, height: 48 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="you@organization.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="input"
                style={{ paddingLeft: 42, height: 48 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="input"
                style={{ paddingLeft: 42, height: 48 }}
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <GradientButton type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', height: 56, borderRadius: '50px' }} icon={ArrowRight}>
            Create Account
          </GradientButton>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: 'var(--mint)', fontWeight: 600, textDecoration: 'none' }} onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}>
                Sign in
              </a>
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
