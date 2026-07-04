import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Upload, Lock, Server, Cpu, CheckCircle, Phone } from 'lucide-react';

const steps = [
  { icon: Building2, title: 'Hospital', desc: 'Hospital identifies patient cohort for trial matching', color: '#3B82F6' },
  { icon: Upload, title: 'Dataset Upload', desc: 'CSV dataset uploaded through secure browser interface', color: '#8B5CF6' },
  { icon: Lock, title: 'Client-side Encryption', desc: 'Every record encrypted in-browser using FHE before transmission', color: '#2DD4BF' },
  { icon: Server, title: 'CoFHE Engine', desc: 'Fhenix CoFHE processes encrypted data without decryption', color: '#0F6E6A' },
  { icon: Cpu, title: 'Encrypted Matching', desc: 'AI eligibility scoring runs entirely on ciphertext', color: '#14B8A6' },
  { icon: CheckCircle, title: 'Matched Patient IDs', desc: 'Only encrypted patient IDs returned as eligible matches', color: '#10B981' },
  { icon: Phone, title: 'Hospital Contact', desc: 'Hospital decrypts IDs internally and contacts patients', color: '#059669' },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" ref={ref} className="section-spacing-lg" style={{
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(45, 212, 191, 0.04) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
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
            How It Works
          </span>
          <h2 className="heading-2" style={{ marginBottom: 16 }}>
            From Upload to Match.{' '}
            <span className="text-gradient">Fully Encrypted.</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Seven steps. Zero raw data exposure. Every operation performed on ciphertext.
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Horizontal line */}
          <div style={{
            position: 'absolute',
            top: 44,
            left: '5%',
            right: '5%',
            height: 2,
            background: 'var(--border-primary)',
            zIndex: 0,
          }} />

          {/* Animated progress line */}
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '90%' } : {}}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
            style={{
              position: 'absolute',
              top: 44,
              left: '5%',
              height: 2,
              background: 'linear-gradient(90deg, var(--teal), var(--mint))',
              zIndex: 1,
            }}
          />

          {/* Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: 8,
            position: 'relative',
            zIndex: 2,
          }}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  {/* Node */}
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      boxShadow: `0 0 25px ${step.color}40`,
                    }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 'var(--radius-lg)',
                      background: `linear-gradient(135deg, ${step.color}15, ${step.color}08)`,
                      border: `1.5px solid ${step.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                      backdropFilter: 'blur(10px)',
                      cursor: 'default',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                  </motion.div>

                  {/* Step number */}
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'var(--mint)',
                    marginBottom: 6,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    STEP {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h4 style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-primary)',
                  }}>
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    lineHeight: 1.5,
                    padding: '0 4px',
                  }}>
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Animated encrypted packets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 48,
            flexWrap: 'wrap',
          }}
        >
          {['0xa7f3e2b1...', '0x9d4c8f6a...', '0x1bf6e3c8...', '0xe2b14a7f...'].map((cipher, i) => (
            <motion.div
              key={i}
              animate={{ x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--mint)',
                backdropFilter: 'blur(10px)',
              }}
            >
              📦 {cipher}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #how-it-works .container > div:last-of-type > div {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          #how-it-works .container > div:last-of-type > div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
