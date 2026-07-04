import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GradientButton from '../shared/GradientButton';
import ParticleField from '../shared/ParticleField';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} style={{
      position: 'relative',
      padding: '120px 0',
      overflow: 'hidden',
    }}>
      {/* Mesh Gradient Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(15, 110, 106, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(45, 212, 191, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(15, 110, 106, 0.06) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      <ParticleField count={20} color="rgba(45, 212, 191, 0.3)" speed={0.3} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 20,
            color: 'var(--text-primary)',
          }}>
            Ready to Match Patients.{' '}
            <span className="text-gradient">Without Exposing Data.</span>
          </h2>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 40,
          }}>
            Join the next generation of privacy-preserving clinical trial infrastructure.
            Start matching today with zero raw data exposure.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/app">
              <GradientButton size="xl" icon={ArrowRight}>
                Launch Platform
              </GradientButton>
            </Link>
            <a href="#how-it-works">
              <GradientButton size="xl" variant="secondary">
                View Documentation
              </GradientButton>
            </a>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 48,
              marginTop: 64,
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '18,472', label: 'Patients Processed' },
              { value: '24', label: 'Datasets Encrypted' },
              { value: '0', label: 'Records Exposed', highlight: true },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: stat.highlight ? 'var(--success)' : 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: stat.highlight ? 'var(--success)' : 'var(--text-tertiary)',
                  fontWeight: 500,
                  marginTop: 4,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
