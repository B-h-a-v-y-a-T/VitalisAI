import { motion } from 'framer-motion';
import { FlaskConical, Settings, Save, Eye, Sliders } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import { trialConfig } from '../../data/mockData';

export default function ClinicalTrials() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Trial Configuration
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Configure eligibility criteria and matching thresholds for clinical trials.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Configuration */}
        <div>
          {/* Trial Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard padding="24px" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FlaskConical size={16} style={{ color: 'var(--mint)' }} />
                Trial Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Trial ID', value: trialConfig.name },
                  { label: 'Phase', value: trialConfig.phase },
                  { label: 'Sponsor', value: trialConfig.sponsor },
                  { label: 'Indication', value: trialConfig.indication },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <input
                      className="input"
                      defaultValue={field.value}
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Eligibility Criteria */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard padding="24px" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sliders size={16} style={{ color: 'var(--mint)' }} />
                Eligibility Criteria
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {trialConfig.criteria.map((criterion, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 2fr 1fr',
                    gap: 12,
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--mint)' }}>
                      {criterion.field}
                    </span>
                    <span style={{
                      textAlign: 'center',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(45, 212, 191, 0.08)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                    }}>
                      {criterion.operator}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{criterion.value}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                      w: {criterion.weight}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Threshold Controls */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard padding="24px">
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={16} style={{ color: 'var(--mint)' }} />
                Matching Thresholds
              </h3>
              {[
                { label: 'Eligibility Threshold', value: trialConfig.thresholds.eligibility, desc: 'Minimum score for a patient to be considered eligible' },
                { label: 'High Confidence', value: trialConfig.thresholds.highConfidence, desc: 'Score threshold for high-confidence matches' },
              ].map((threshold, i) => (
                <div key={i} style={{ marginBottom: i === 0 ? 20 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{threshold.label}</span>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{threshold.desc}</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--mint)' }}>
                      {threshold.value}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: 6,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    position: 'relative',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${threshold.value * 100}%`,
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(90deg, var(--teal), var(--mint))',
                    }} />
                  </div>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        </div>

        {/* Summary Panel */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <GlassCard padding="24px" glow style={{ position: 'sticky', top: 96 }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20 }}>
                Configuration Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Trial', value: trialConfig.name },
                  { label: 'Phase', value: trialConfig.phase },
                  { label: 'Criteria', value: `${trialConfig.criteria.length} rules` },
                  { label: 'Eligibility', value: `≥ ${trialConfig.thresholds.eligibility}` },
                  { label: 'High Confidence', value: `≥ ${trialConfig.thresholds.highConfidence}` },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: i < 4 ? '1px solid var(--border-secondary)' : 'none',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                <GradientButton icon={Save} style={{ width: '100%' }}>Save Configuration</GradientButton>
                <GradientButton variant="secondary" icon={Eye} style={{ width: '100%' }}>Preview</GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
