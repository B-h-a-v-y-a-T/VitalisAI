import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Settings, Save, Eye, Sliders, Brain, Upload, CheckCircle } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import StatusBadge from '../../components/shared/StatusBadge';
import modelWeights from '../../../ml/model_weights.json';

export default function ClinicalTrials() {
  const [weightsDeployed, setWeightsDeployed] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const deployWeights = async () => {
    setDeploying(true);
    // In production: call contract.setTrialCriteria(positiveWeights, negativeWeights, threshold)
    await new Promise(r => setTimeout(r, 2000));
    setDeploying(false);
    setWeightsDeployed(true);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Trial Configuration
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Configure eligibility criteria using ML-derived weights for FHE smart contract execution.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Left Column */}
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
                  { label: 'Trial ID', value: 'NCT04892531' },
                  { label: 'Phase', value: 'Phase III' },
                  { label: 'Sponsor', value: 'PharmaCorp Inc.' },
                  { label: 'Indication', value: 'Heart Disease Screening' },
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

          {/* ML Model Weights */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard padding="24px" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={16} style={{ color: 'var(--mint)' }} />
                ML Model Weights (Logistic Regression)
              </h3>
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  display: 'flex',
                  gap: 16,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(45, 212, 191, 0.04)',
                  border: '1px solid rgba(45, 212, 191, 0.15)',
                  marginBottom: 12,
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Accuracy</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--mint)' }}>{(modelWeights.accuracy * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Scale Factor</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>x{modelWeights.scale_factor}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Threshold</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{modelWeights.threshold}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Features</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{modelWeights.num_features}</div>
                  </div>
                </div>
              </div>

              {/* Feature Weights Table */}
              <div className="table-container" style={{ border: 'none' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Raw Coefficient</th>
                      <th>Scaled (x1000)</th>
                      <th>Positive Weight</th>
                      <th>Negative Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelWeights.features.map((feat, i) => (
                      <tr key={feat}>
                        <td>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--mint)',
                          }}>
                            {feat}
                          </span>
                        </td>
                        <td style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: modelWeights.raw_coefficients[i] >= 0 ? 'var(--success)' : 'var(--error)',
                        }}>
                          {modelWeights.raw_coefficients[i] >= 0 ? '+' : ''}{modelWeights.raw_coefficients[i].toFixed(6)}
                        </td>
                        <td style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: modelWeights.scaled_coefficients[i] >= 0 ? 'var(--success)' : 'var(--error)',
                        }}>
                          {modelWeights.scaled_coefficients[i] >= 0 ? '+' : ''}{modelWeights.scaled_coefficients[i]}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                          {modelWeights.positive_weights[i]}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                          {modelWeights.negative_weights[i]}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '2px solid var(--border-primary)' }}>
                      <td style={{ fontWeight: 700, fontSize: '0.82rem' }}>Intercept</td>
                      <td style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: modelWeights.raw_intercept >= 0 ? 'var(--success)' : 'var(--error)',
                      }}>
                        {modelWeights.raw_intercept >= 0 ? '+' : ''}{modelWeights.raw_intercept.toFixed(6)}
                      </td>
                      <td style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: modelWeights.scaled_intercept >= 0 ? 'var(--success)' : 'var(--error)',
                      }}>
                        {modelWeights.scaled_intercept >= 0 ? '+' : ''}{modelWeights.scaled_intercept}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{modelWeights.positive_intercept}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{modelWeights.negative_intercept}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

          {/* FHE Scoring Formula */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard padding="24px">
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={16} style={{ color: 'var(--mint)' }} />
                FHE Scoring Formula
              </h3>
              <div style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                lineHeight: 2,
              }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', marginBottom: 8 }}>// Underflow-safe comparison (all euint32)</div>
                <div><span style={{ color: 'var(--success)' }}>positiveScore</span> = {modelWeights.features.map((f, i) => modelWeights.positive_weights[i] > 0 ? `${modelWeights.positive_weights[i]} * ${f}` : null).filter(Boolean).join(' + ') || '0'}</div>
                <div><span style={{ color: 'var(--error)' }}>negativeScore</span> = {modelWeights.features.map((f, i) => modelWeights.negative_weights[i] > 0 ? `${modelWeights.negative_weights[i]} * ${f}` : null).filter(Boolean).join(' + ')}</div>
                <div style={{ marginTop: 8, fontWeight: 700 }}>
                  <span style={{ color: 'var(--mint)' }}>isMatch</span> = positiveScore {'>'}= negativeScore + <span style={{ color: 'var(--warning)' }}>{modelWeights.threshold}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column — Summary Panel */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <GlassCard padding="24px" glow style={{ position: 'sticky', top: 96 }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20 }}>
                Deployment Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Contract', value: 'VitalisMatching.sol' },
                  { label: 'Network', value: 'Arbitrum Sepolia' },
                  { label: 'Model', value: modelWeights.model },
                  { label: 'Accuracy', value: `${(modelWeights.accuracy * 100).toFixed(1)}%` },
                  { label: 'Threshold', value: String(modelWeights.threshold) },
                  { label: 'Status', value: weightsDeployed ? 'Deployed' : 'Not Deployed' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: i < 5 ? '1px solid var(--border-secondary)' : 'none',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: item.label === 'Status' ? (weightsDeployed ? 'var(--success)' : 'var(--warning)') : 'var(--text-primary)' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                {weightsDeployed ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}>
                    <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--success)' }}>Weights Deployed On-Chain</span>
                  </div>
                ) : (
                  <GradientButton icon={Upload} style={{ width: '100%', border: '1px solid var(--mint)' }} onClick={deployWeights} disabled={deploying}>
                    {deploying ? 'Deploying...' : 'Deploy Weights On-Chain'}
                  </GradientButton>
                )}
                <GradientButton variant="secondary" icon={Upload} style={{ width: '100%', border: '1px solid var(--border-secondary)' }}>Upload New Weights</GradientButton>
                <GradientButton variant="secondary" icon={Eye} style={{ width: '100%', border: '1px solid var(--border-secondary)' }}>Preview</GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
