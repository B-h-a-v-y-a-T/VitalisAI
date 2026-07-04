import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertTriangle, Eye, FileWarning, UserX, Shield, Lock, Cpu, FileCheck, Network, EyeOff } from 'lucide-react';
import GlassCard from '../shared/GlassCard';

const problems = [
  { icon: Eye, title: 'Raw Data Exposure', desc: 'Traditional platforms require unencrypted patient data for matching, creating massive privacy risks.' },
  { icon: AlertTriangle, title: 'Regulatory Burden', desc: 'HIPAA, GDPR, and cross-border regulations make data sharing complex and legally risky.' },
  { icon: FileWarning, title: 'Siloed Datasets', desc: 'Hospitals hoard patient data because sharing it means losing control of sensitive records.' },
  { icon: UserX, title: 'Patient Distrust', desc: 'Patients are reluctant to participate when their medical data leaves the hospital system.' },
];

const solutions = [
  { icon: Lock, title: 'Encrypted Matching', desc: 'All patient data is encrypted client-side before leaving the hospital. Matching runs on ciphertext.' },
  { icon: Shield, title: 'Privacy by Architecture', desc: 'FHE ensures no party—including Vitalis—ever sees raw patient records. Zero exposure guarantee.' },
  { icon: Cpu, title: 'AI on Ciphertext', desc: 'Our CoFHE-powered engine performs eligibility scoring directly on encrypted data.' },
  { icon: EyeOff, title: 'Hospital Controlled', desc: 'Only the originating hospital can decrypt matched patient IDs. Full data sovereignty maintained.' },
];

export default function ProblemSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" ref={ref} className="section-spacing" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
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
            The Challenge
          </span>
          <h2 className="heading-2" style={{ marginBottom: 16 }}>
            Clinical Trials Need Data.{' '}
            <span className="text-gradient">Patients Need Privacy.</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: 640,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            The healthcare industry faces an impossible trade-off — until now.
          </p>
        </motion.div>

        {/* Two Grids */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* Problems */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--error)',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertTriangle size={16} /> The Problem
            </motion.h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {problems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <GlassCard padding="20px" hover glow={false}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 42,
                          height: 42,
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--error-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon size={20} style={{ color: 'var(--error)' }} />
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{item.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--success)',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Shield size={16} /> The Solution
            </motion.h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {solutions.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <GlassCard padding="20px" hover glow>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 42,
                          height: 42,
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(45, 212, 191, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon size={20} style={{ color: 'var(--mint)' }} />
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{item.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #features .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
