import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, Unlock, UserCheck, UserX, RefreshCw, Download, AlertTriangle } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import StatusBadge from '../../components/shared/StatusBadge';
import modelWeights from '../../../ml/model_weights.json';

export default function RecruiterView() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [permitSigned, setPermitSigned] = useState(false);
  const [unsealedResults, setUnsealedResults] = useState([]);
  const [isUnsealing, setIsUnsealing] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState(new Set());

  // Simulated patient evaluation results (in production, these come from the smart contract)
  const [patientEvaluations] = useState(() => {
    const evals = [];
    for (let i = 0; i < 25; i++) {
      evals.push({
        patientId: `PID-${String(i + 1).padStart(4, '0')}`,
        onChainId: i,
        submittedBy: '0x742d...5f2b',
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString().split('T')[0],
        status: 'sealed', // sealed | unsealing | unsealed
        matchResult: null, // null until unsealed, then true/false
      });
    }
    return evals;
  });

  const connectWallet = async () => {
    // In production: await window.ethereum.request({ method: 'eth_requestAccounts' })
    // Demo mode:
    setTimeout(() => {
      setWalletConnected(true);
      setWalletAddress('0x8Ba1...7e03');
    }, 800);
  };

  const signPermit = async () => {
    // In production: cofhejs permit system with EIP-712 signature
    // Demo mode:
    setIsUnsealing(true);
    setTimeout(() => {
      setPermitSigned(true);
      setIsUnsealing(false);
    }, 1500);
  };

  const unsealResults = async () => {
    setIsUnsealing(true);
    
    // Simulate unsealing one by one using the model weights to generate deterministic results
    const results = [];
    for (let i = 0; i < patientEvaluations.length; i++) {
      await new Promise(r => setTimeout(r, 120));
      
      // Deterministic mock: use patient index to create a predictable match pattern
      // In production, this calls getMatchStatus() via cofhejs permit unsealing
      const isMatch = deterministicMatch(i);
      results.push({
        ...patientEvaluations[i],
        status: 'unsealed',
        matchResult: isMatch,
      });
      setUnsealedResults([...results]);
    }
    
    setIsUnsealing(false);
  };

  // Deterministic scoring using the actual model weights from model_weights.json
  const deterministicMatch = (index) => {
    // Simulated patient features (seeded by index for determinism)
    const seed = index * 7 + 13;
    const age = 30 + (seed % 50);
    const sex = seed % 2;
    const trestbps = 100 + (seed * 3 % 80);
    const chol = 150 + (seed * 5 % 200);
    const fbs = (seed * 11) % 3 === 0 ? 1 : 0;
    const thalach = 100 + (seed * 2 % 100);
    
    const features = [age, sex, trestbps, chol, fbs, thalach];
    
    // Apply the real model coefficients
    let score = modelWeights.raw_intercept;
    for (let i = 0; i < features.length; i++) {
      score += features[i] * modelWeights.raw_coefficients[i];
    }
    
    return score >= 0;
  };

  const matchedCount = unsealedResults.filter(r => r.matchResult === true).length;
  const unmatchedCount = unsealedResults.filter(r => r.matchResult === false).length;

  const toggleSelect = (id) => {
    const next = new Set(selectedPatients);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedPatients(next);
  };

  const exportResults = () => {
    const rows = [['PatientID', 'SubmittedBy', 'Date', 'MatchResult']];
    unsealedResults.forEach(r => {
      rows.push([r.patientId, r.submittedBy, r.timestamp, r.matchResult ? 'ELIGIBLE' : 'NOT_ELIGIBLE']);
    });
    const csvStr = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vitalis_match_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Recruiter View
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Securely unseal binary match results without viewing patient health data.
        </p>
      </motion.div>

      {/* Security Notice */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(45, 212, 191, 0.06)',
          border: '1px solid rgba(45, 212, 191, 0.2)',
        }}>
          <Shield size={18} style={{ color: 'var(--mint)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>Zero-Knowledge Recruiter Interface</strong> — You can only view binary match/no-match outcomes. Individual health features (age, blood pressure, cholesterol, etc.) remain permanently encrypted via FHE.
          </span>
        </div>
      </motion.div>

      {/* Wallet & Permit Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard padding="20px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wallet</span>
              <StatusBadge status={walletConnected ? 'success' : 'warning'} label={walletConnected ? 'Connected' : 'Disconnected'} />
            </div>
            {walletConnected ? (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--mint)' }}>{walletAddress}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 4 }}>Pharma Recruiter Wallet</div>
              </div>
            ) : (
              <GradientButton size="sm" onClick={connectWallet} style={{ width: '100%' }}>Connect Wallet</GradientButton>
            )}
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard padding="20px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EIP-712 Permit</span>
              <StatusBadge status={permitSigned ? 'encrypted' : 'pending'} label={permitSigned ? 'Signed' : 'Required'} />
            </div>
            {permitSigned ? (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)' }}>Permit Active</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 4 }}>Authorized for decryption</div>
              </div>
            ) : (
              <GradientButton size="sm" variant="secondary" onClick={signPermit} disabled={!walletConnected || isUnsealing} style={{ width: '100%' }}>
                {isUnsealing ? 'Signing...' : 'Sign Permit'}
              </GradientButton>
            )}
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard padding="20px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Results</span>
              <StatusBadge status={unsealedResults.length > 0 ? 'success' : 'info'} label={`${unsealedResults.length} / ${patientEvaluations.length}`} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--success)' }}>{matchedCount}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Eligible</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--error)' }}>{unmatchedCount}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Not Eligible</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <GradientButton
          icon={Unlock}
          onClick={unsealResults}
          disabled={!permitSigned || isUnsealing || unsealedResults.length > 0}
        >
          {isUnsealing ? 'Unsealing...' : unsealedResults.length > 0 ? 'Results Unsealed' : 'Unseal All Results'}
        </GradientButton>
        {unsealedResults.length > 0 && (
          <GradientButton variant="secondary" icon={Download} onClick={exportResults}>
            Export Results CSV
          </GradientButton>
        )}
      </div>

      {/* Results Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard padding="0" hover={false}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Patient Match Results</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                Model: {modelWeights.model} | Accuracy: {(modelWeights.accuracy * 100).toFixed(1)}% | Features: {modelWeights.num_features}
              </span>
            </div>
          </div>
          <div className="table-container" style={{ border: 'none', maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Patient ID</th>
                  <th>On-Chain ID</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Health Data</th>
                  <th>Match Result</th>
                </tr>
              </thead>
              <tbody>
                {patientEvaluations.map((patient, i) => {
                  const unsealed = unsealedResults.find(r => r.patientId === patient.patientId);
                  const isUnsealed = !!unsealed;
                  const isMatch = unsealed?.matchResult;
                  
                  return (
                    <motion.tr
                      key={patient.patientId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedPatients.has(patient.patientId)}
                          onChange={() => toggleSelect(patient.patientId)}
                          style={{ accentColor: 'var(--mint)' }}
                        />
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.82rem' }}>
                        {patient.patientId}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        #{patient.onChainId}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                        {patient.submittedBy}
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{patient.timestamp}</td>
                      <td>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(239, 68, 68, 0.06)',
                          border: '1px solid rgba(239, 68, 68, 0.15)',
                          width: 'fit-content',
                        }}>
                          <EyeOff size={12} style={{ color: 'var(--error)' }} />
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--error)' }}>
                            ENCRYPTED
                          </span>
                        </div>
                      </td>
                      <td>
                        {!isUnsealed ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-secondary)',
                            width: 'fit-content',
                          }}>
                            <Lock size={12} style={{ color: 'var(--text-tertiary)' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                              SEALED
                            </span>
                          </div>
                        ) : isMatch ? (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(16, 185, 129, 0.08)',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              width: 'fit-content',
                            }}
                          >
                            <UserCheck size={12} style={{ color: 'var(--success)' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)' }}>
                              ELIGIBLE
                            </span>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(239, 68, 68, 0.06)',
                              border: '1px solid rgba(239, 68, 68, 0.15)',
                              width: 'fit-content',
                            }}
                          >
                            <UserX size={12} style={{ color: 'var(--error)' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--error)' }}>
                              NOT ELIGIBLE
                            </span>
                          </motion.div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* Model Info Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginTop: 24 }}>
        <GlassCard padding="20px">
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} style={{ color: 'var(--mint)' }} />
            FHE Model Configuration
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Contract</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600 }}>VitalisMatching.sol</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Scoring Method</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600 }}>
                posScore {'>'}= negScore + {modelWeights.threshold}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Scale Factor</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600 }}>x{modelWeights.scale_factor}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Features</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {modelWeights.features.map((f, i) => (
                  <span key={i} style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(45, 212, 191, 0.08)',
                    border: '1px solid rgba(45, 212, 191, 0.2)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: 'var(--mint)',
                  }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Positive Weights</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                [{modelWeights.positive_weights.join(', ')}]
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Negative Weights</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                [{modelWeights.negative_weights.join(', ')}]
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
