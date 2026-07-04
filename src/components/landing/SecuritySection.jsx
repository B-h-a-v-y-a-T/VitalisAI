import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Lock, Eye, Cpu, Building2, Link as LinkIcon } from 'lucide-react';
import ParticleField from '../shared/ParticleField';

const features = [
  { icon: Lock, label: 'Fully Homomorphic\nEncryption', angle: 0 },
  { icon: Eye, label: 'Zero Raw Data\nExposure', angle: 60 },
  { icon: LinkIcon, label: 'Blockchain\nAuditability', angle: 120 },
  { icon: Cpu, label: 'Secure AI\nComputation', angle: 180 },
  { icon: Building2, label: 'Hospital Controlled\nData', angle: 240 },
  { icon: Shield, label: 'Privacy by\nArchitecture', angle: 300 },
];

export default function SecuritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="security" ref={ref} style={{
      position: 'relative',
      padding: '120px 0',
      background: 'linear-gradient(180deg, var(--navy-dark) 0%, var(--navy) 50%, var(--navy-dark) 100%)',
      overflow: 'hidden',
    }}>
      <ParticleField count={35} color="rgba(45, 212, 191, 0.3)" speed={0.4} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <span style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#2DD4BF',
            marginBottom: 12,
          }}>
            Security
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#F1F5F7',
            marginBottom: 16,
          }}>
            Enterprise-Grade{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2DD4BF, #0F6E6A, #5EEAD4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Security Architecture
            </span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: 600, margin: '0 auto' }}>
            Every layer of the platform is designed with zero-trust security principles.
          </p>
        </motion.div>

        {/* Shield + Orbiting Labels */}
        <div style={{
          position: 'relative',
          width: 440,
          height: 440,
          margin: '0 auto',
        }}>
          {/* Central Shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(45, 212, 191, 0.2) 0%, rgba(45, 212, 191, 0.05) 60%, transparent 80%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'glow-pulse 3s ease infinite',
            }}
          >
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(15, 110, 106, 0.4), rgba(45, 212, 191, 0.2))',
              border: '2px solid rgba(45, 212, 191, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(45, 212, 191, 0.3)',
            }}>
              <Shield size={36} color="#2DD4BF" />
            </div>
          </motion.div>

          {/* Orbit Ring */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 360,
            height: 360,
            borderRadius: '50%',
            border: '1px solid rgba(45, 212, 191, 0.1)',
          }} />

          {/* Feature Labels */}
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const radius = 180;
            const angleRad = (feature.angle - 90) * (Math.PI / 180);
            const x = 220 + radius * Math.cos(angleRad);
            const y = 220 + radius * Math.sin(angleRad);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 8,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.15, boxShadow: '0 0 25px rgba(45, 212, 191, 0.3)' }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(45, 212, 191, 0.08)',
                    border: '1px solid rgba(45, 212, 191, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Icon size={20} color="#2DD4BF" />
                </motion.div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#CBD5DE',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.3,
                }}>
                  {feature.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
