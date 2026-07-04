import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import StatusBadge from '../shared/StatusBadge';

export default function DashboardPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-spacing-lg" style={{
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 80%, rgba(45, 212, 191, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <span style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--mint)',
            marginBottom: 12,
          }}>
            Platform Preview
          </span>
          <h2 className="heading-2" style={{ marginBottom: 16 }}>
            Enterprise-Grade{' '}
            <span className="text-gradient">Command Center</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto',
          }}>
            Monitor encryption, matching, and audit operations from a unified dashboard.
          </p>
        </motion.div>

        {/* Floating Dashboard Panels */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            maxWidth: 960,
            margin: '0 auto',
            perspective: '1000px',
          }}
        >
          {/* Dataset Queue */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GlassCard padding="20px" glow>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>
                Dataset Queue
              </h4>
              {['CARDIO-2025-Q2', 'ONCO-TRIAL-489', 'NEURO-PHASE3'].map((ds, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < 2 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{ds}</span>
                  <StatusBadge status={['encrypted', 'processing', 'encrypting'][i]} />
                </div>
              ))}
            </GlassCard>
          </motion.div>

          {/* Processing Status */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <GlassCard padding="20px" glow>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>
                Processing Status
              </h4>
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--mint)' }}>
                  67%
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-bar-fill" style={{ width: '67%' }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
                  3,417 / 5,100 records encrypted
                </p>
              </div>
              <div style={{
                marginTop: 12,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(45, 212, 191, 0.06)',
                border: '1px solid var(--border-accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--mint)',
                textAlign: 'center',
              }}>
                ETA: 4m 32s • ~142 rows/sec
              </div>
            </GlassCard>
          </motion.div>

          {/* Privacy Indicator */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <GlassCard padding="20px" glow>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>
                Privacy Indicator
              </h4>
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  animation: 'glow-pulse 3s ease infinite',
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>0</span>
                </div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)' }}>
                  Raw Records Viewed
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                  Zero exposure guarantee active
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Matches */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            <GlassCard padding="20px" glow>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>
                Recent Matches
              </h4>
              {['PID-A7X2K9', 'PID-B3M8N1', 'PID-D1R6S4'].map((pid, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: i < 2 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{pid}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>
                    {[94, 87, 91][i]}%
                  </span>
                </div>
              ))}
            </GlassCard>
          </motion.div>

          {/* Audit Timeline */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <GlassCard padding="20px" glow>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>
                Audit Timeline
              </h4>
              {[
                { action: 'Match verified', time: '2m ago' },
                { action: 'Dataset encrypted', time: '15m ago' },
                { action: 'Access logged', time: '1h ago' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 0',
                  borderBottom: i < 2 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--mint)',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '0.78rem', flex: 1 }}>{item.action}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{item.time}</span>
                </div>
              ))}
            </GlassCard>
          </motion.div>

          {/* System Health */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          >
            <GlassCard padding="20px" glow>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>
                System Health
              </h4>
              {[
                { service: 'CoFHE Engine', latency: '45ms' },
                { service: 'Matching API', latency: '12ms' },
                { service: 'Blockchain', latency: '150ms' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: i < 2 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>{item.service}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {item.latency}
                  </span>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
