import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lock, Shield, Database, ArrowRight, Zap, Activity, Server, CheckCircle } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import { matchingJobs } from '../../data/mockData';

export default function MatchingEngine() {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase(prev => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const phases = [
    { icon: Database, label: 'Encrypted\nDataset', color: '#3B82F6' },
    { icon: Lock, label: 'CoFHE\nEngine', color: '#2DD4BF' },
    { icon: Cpu, label: 'Encrypted\nProcessing', color: '#0F6E6A' },
    { icon: CheckCircle, label: 'Eligibility\nResults', color: '#10B981' },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Matching Engine
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          AI-powered eligibility scoring on fully encrypted data.
        </p>
      </motion.div>

      {/* Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { icon: Zap, label: 'Processing Speed', value: 142, suffix: ' rows/s', color: 'var(--mint)' },
          { icon: Activity, label: 'Active Jobs', value: 2, color: 'var(--info)' },
          { icon: Server, label: 'Engine Latency', value: 45, suffix: 'ms', color: 'var(--teal)' },
          { icon: Shield, label: 'Privacy Score', value: 100, suffix: '%', color: 'var(--success)' },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard padding="20px">
                <Icon size={20} style={{ color: metric.color, marginBottom: 12 }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{metric.label}</div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Central Pipeline Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard padding="40px" glow style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>
            FHE Matching Pipeline
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {phases.map((phase, i) => {
              const Icon = phase.icon;
              const isActive = i === activePhase;
              const isPast = i < activePhase;

              return (
                <motion.div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      boxShadow: isActive ? `0 0 30px ${phase.color}40` : '0 4px 15px rgba(0,0,0,0.05)',
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: 'var(--radius-xl)',
                      background: isActive || isPast ? `${phase.color}15` : 'var(--glass-bg)',
                      border: `2px solid ${isActive ? phase.color : isPast ? `${phase.color}60` : 'var(--border-primary)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.4s ease',
                      backdropFilter: 'blur(10px)',
                    }}>
                      <Icon size={28} style={{ color: isActive || isPast ? phase.color : 'var(--text-tertiary)' }} />
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.3,
                    }}>
                      {phase.label}
                    </span>
                  </motion.div>

                  {i < phases.length - 1 && (
                    <motion.div
                      animate={{
                        opacity: isPast ? [0.3, 1, 0.3] : 0.3,
                      }}
                      transition={{ duration: 1.5, repeat: isPast ? Infinity : 0 }}
                    >
                      <ArrowRight size={20} style={{ color: isPast ? phases[i].color : 'var(--text-tertiary)' }} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Animated data packets */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 32,
          }}>
            {['0xa7f3...', '0xe2b1...', '0x9d4c...'].map((cipher, i) => (
              <motion.span
                key={i}
                animate={{ x: [0, 20, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--mint)',
                }}
              >
                📦 {cipher}
              </motion.span>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Jobs Table */}
      <GlassCard padding="0" hover={false}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Processing Queue</h3>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Dataset</th>
                <th>Trial</th>
                <th>Progress</th>
                <th>Matches</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {matchingJobs.map((job, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.8rem' }}>{job.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{job.dataset}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{job.trial}</td>
                  <td style={{ width: 120 }}>
                    <div className="progress-bar" style={{ height: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${job.progress}%` }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{job.progress}%</span>
                  </td>
                  <td style={{ fontWeight: 700, color: job.matches > 0 ? 'var(--success)' : 'var(--text-tertiary)' }}>
                    {job.matches > 0 ? job.matches.toLocaleString() : '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{job.time}</td>
                  <td><StatusBadge status={job.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
