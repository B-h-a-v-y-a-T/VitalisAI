import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Cpu } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';

export default function PlaintextVsEncrypted() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const startDemo = () => {
    setRunning(true);
    setStep(0);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      setStep(s);
      if (s >= 4) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 1500);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Plaintext vs Encrypted Demo
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          See how FHE produces identical results on encrypted data — without ever seeing raw values.
        </p>
      </motion.div>

      {/* Start Demo Button */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <GradientButton size="lg" icon={Cpu} onClick={startDemo} disabled={running}>
          {running ? 'Running Demo...' : 'Run Comparison Demo'}
        </GradientButton>
      </div>

      {/* Split Screen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 0 }}>
        {/* LEFT - Plaintext */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard padding="0" hover={false} style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(239, 68, 68, 0.05)',
            }}>
              <Eye size={16} style={{ color: 'var(--error)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--error)' }}>
                Traditional (Plaintext)
              </span>
            </div>
            <div style={{ padding: 20 }}>
              {/* Patient Data */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                  Patient Record
                </h4>
                <motion.div
                  animate={{ opacity: step >= 1 ? 1 : 0.3 }}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    lineHeight: 1.8,
                  }}
                >
                  <div><span style={{ color: 'var(--text-tertiary)' }}>name:</span> <span style={{ color: 'var(--error)' }}>John Mitchell</span></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>age:</span> <span style={{ color: 'var(--error)' }}>58</span></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>diagnosis:</span> <span style={{ color: 'var(--error)' }}>I25.1</span></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>lab_value:</span> <span style={{ color: 'var(--error)' }}>142</span></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>medication:</span> <span style={{ color: 'var(--error)' }}>Metoprolol</span></div>
                </motion.div>
              </div>

              {/* ML Scoring */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                  ML Score Calculation
                </h4>
                <motion.div
                  animate={{ opacity: step >= 2 ? 1 : 0.3 }}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    lineHeight: 1.8,
                  }}
                >
                  <div>age_score = 1.0 <span style={{ color: 'var(--text-tertiary)' }}>// 40 ≤ 58 ≤ 75</span></div>
                  <div>diag_score = 2.0 <span style={{ color: 'var(--text-tertiary)' }}>// I25.1 ∈ criteria</span></div>
                  <div>lab_score = 1.5 <span style={{ color: 'var(--text-tertiary)' }}>// 142 ≥ 130</span></div>
                  <div>total = 4.5 / 5.5</div>
                </motion.div>
              </div>

              {/* Result */}
              <motion.div
                animate={{ opacity: step >= 3 ? 1 : 0.3, scale: step >= 3 ? 1 : 0.98 }}
                style={{
                  padding: 20,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--success-bg)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-display)' }}>0.82</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>ELIGIBLE</div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Center Arrow */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <motion.div
            animate={step >= 4 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: step >= 4 ? 'var(--success-bg)' : 'var(--bg-tertiary)',
              border: `2px solid ${step >= 4 ? 'var(--success)' : 'var(--border-primary)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {step >= 4 ? (
              <CheckCircle size={18} style={{ color: 'var(--success)' }} />
            ) : (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>=</span>
            )}
          </motion.div>
          {step >= 4 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--success)', writingMode: 'vertical-lr' }}
            >
              IDENTICAL
            </motion.span>
          )}
        </div>

        {/* RIGHT - Encrypted */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard padding="0" hover={false} style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(45, 212, 191, 0.05)',
            }}>
              <EyeOff size={16} style={{ color: 'var(--mint)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--mint)' }}>
                FHE (Encrypted)
              </span>
            </div>
            <div style={{ padding: 20 }}>
              {/* Ciphertext */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                  Encrypted Record
                </h4>
                <motion.div
                  animate={{ opacity: step >= 1 ? 1 : 0.3 }}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(45, 212, 191, 0.05)',
                    border: '1px solid rgba(45, 212, 191, 0.15)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    lineHeight: 1.8,
                    color: 'var(--mint)',
                    wordBreak: 'break-all',
                  }}
                >
                  <div><span style={{ color: 'var(--text-tertiary)' }}>name:</span> 0x7a3f8b2c1d...</div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>age:</span> 0xe2b14f3a8d...</div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>diagnosis:</span> 0xd4e58b7c2f...</div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>lab_value:</span> 0x1f2ac5d63b...</div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>medication:</span> 0x9e8d7a2b5c...</div>
                </motion.div>
              </div>

              {/* Encrypted Computation */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                  Encrypted Computation
                </h4>
                <motion.div
                  animate={{ opacity: step >= 2 ? 1 : 0.3 }}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    lineHeight: 1.8,
                    color: 'var(--mint)',
                  }}
                >
                  <div>FHE.eval(enc_age, criteria) → 0xf4...</div>
                  <div>FHE.eval(enc_diag, criteria) → 0xa2...</div>
                  <div>FHE.eval(enc_lab, criteria) → 0x7e...</div>
                  <div>FHE.aggregate(scores) → 0xb1c...</div>
                </motion.div>
              </div>

              {/* Result */}
              <motion.div
                animate={{ opacity: step >= 3 ? 1 : 0.3, scale: step >= 3 ? 1 : 0.98 }}
                style={{
                  padding: 20,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--success-bg)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-display)' }}>0.82</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>ELIGIBLE</div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom explainer */}
      {step >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 32 }}
        >
          <GlassCard padding="24px" glow style={{ textAlign: 'center' }}>
            <Shield size={32} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
              Identical Results. Zero Exposure.
            </h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', maxWidth: 500, margin: '0 auto' }}>
              Fully Homomorphic Encryption allows computation on ciphertext, producing the exact same eligibility
              result — without ever exposing raw patient data.
            </p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
