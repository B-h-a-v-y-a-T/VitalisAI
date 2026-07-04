import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock, Cpu } from 'lucide-react';
import FHEPipelineViz from './FHEPipelineViz';
import GradientButton from '../shared/GradientButton';
import ParticleField from '../shared/ParticleField';
import ScrambleText from '../shared/ScrambleText';

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start', // Shift up into the available top space
      overflow: 'hidden',
      paddingTop: 100, // Reduced to push everything up even more
      paddingBottom: 80,
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(15, 110, 106, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(45, 212, 191, 0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
      <ParticleField count={25} color="rgba(45, 212, 191, 0.4)" speed={0.3} />

      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'flex-start', // Top-align the grid columns
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ paddingTop: 10 }} // Reduced inner padding to pull it up
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(45, 212, 191, 0.08)',
              border: '1px solid rgba(45, 212, 191, 0.2)',
              marginBottom: 24,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--mint)',
            }}
          >
            <Shield size={14} />
            Powered by Fully Homomorphic Encryption
          </motion.div>

          {/* Headline with Encryption Animation */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 24,
          }}>
            <ScrambleText text="Clinical Trial Matching." delay={100} duration={1200} /> <br />
            <span className="text-gradient">
              <ScrambleText text="Zero Data Exposure." delay={600} duration={1500} />
            </span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            marginBottom: 36,
            maxWidth: 520,
          }}>
            Match patients to clinical trials using AI — while every record stays
            fully encrypted. Built on Fhenix CoFHE for computation on ciphertext.
            Your data is never exposed. Not even to us.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
            <Link to="/app">
              <GradientButton size="lg" icon={ArrowRight}>
                Launch Platform
              </GradientButton>
            </Link>
            <a href="#how-it-works">
              <GradientButton size="lg" variant="secondary">
                See How It Works
              </GradientButton>
            </a>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: Lock, label: 'End-to-End Encrypted' },
              { icon: Shield, label: 'Zero Raw Data Exposure' },
              { icon: Cpu, label: 'On-Chain Auditable' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: 'var(--text-tertiary)',
                }}
              >
                <badge.icon size={14} style={{ color: 'var(--mint)' }} />
                {badge.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FHEPipelineViz />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
