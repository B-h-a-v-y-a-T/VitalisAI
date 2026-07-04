import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, HelpCircle, Lock, Unlock, Server, Shield, Plus, Send, RefreshCw, BarChart2, Eye, Award, CheckCircle } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import StatusBadge from '../../components/shared/StatusBadge';
import AnimatedCounter from '../../components/shared/AnimatedCounter';

const HOSPITALS = [
  { name: 'Mayo Clinic Center', address: '0x32A1...9F0B', color: '#3b82f6', population: 1250 },
  { name: 'Johns Hopkins Medicine', address: '0x74B8...44C1', color: '#10b981', population: 980 },
  { name: 'Cleveland Clinic Foundation', address: '0x99D5...E233', color: '#8b5cf6', population: 1420 },
  { name: 'Massachusetts General Hospital', address: '0xE822...01FA', color: '#ec4899', population: 850 }
];

export default function FeasibilityEstimator() {
  const [queries, setQueries] = useState([
    {
      id: 0,
      description: 'Trial NCT0451: Age >= 60 & Fasting Blood Sugar == 1 (Heart Screening Phase III)',
      submissionsCount: 4,
      totalPopulation: 4500,
      status: 'decrypted', // active | summing | ready_to_decrypt | decrypted
      decryptedCount: 312,
    },
    {
      id: 1,
      description: 'Trial NCT0992: Cholesterol > 240 & Max Heart Rate < 120 (Hypertension Feasibility)',
      submissionsCount: 4,
      totalPopulation: 4500,
      status: 'ready_to_decrypt',
      decryptedCount: null,
    }
  ]);

  const [newDescription, setNewDescription] = useState('');
  const [selectedQueryId, setSelectedQueryId] = useState(1);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isPermitSigned, setIsPermitSigned] = useState(false);
  const [simulationState, setSimulationState] = useState('idle'); // idle | submitting | summing | complete
  const [hospitalSubmissions, setHospitalSubmissions] = useState(
    HOSPITALS.map(h => ({ ...h, status: 'pending', flagCount: 0 }))
  );
  const [currentSubmittingIndex, setCurrentSubmittingIndex] = useState(-1);
  const [sumAnimationIndex, setSumAnimationIndex] = useState(-1);

  const selectedQuery = queries.find(q => q.id === selectedQueryId);

  const handleCreateQuery = (e) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    const newQuery = {
      id: queries.length,
      description: newDescription,
      submissionsCount: 0,
      totalPopulation: 4500,
      status: 'active',
      decryptedCount: null
    };

    setQueries([...queries, newQuery]);
    setSelectedQueryId(newQuery.id);
    setNewDescription('');
    
    // Reset simulation
    setSimulationState('idle');
    setHospitalSubmissions(HOSPITALS.map(h => ({ ...h, status: 'pending', flagCount: 0 })));
  };

  const startSimulation = async () => {
    if (!selectedQuery) return;
    
    setSimulationState('submitting');
    const updatedSubmissions = [...hospitalSubmissions];
    
    for (let i = 0; i < HOSPITALS.length; i++) {
      setCurrentSubmittingIndex(i);
      updatedSubmissions[i].status = 'encrypting';
      setHospitalSubmissions([...updatedSubmissions]);
      
      // Simulate client-side FHE flag generation and encryption for a hospital's subset
      await new Promise(r => setTimeout(r, 1200));
      
      // Generate simulated matching flag count
      // Mayo clinic (1250 pop) -> ~80 matches, Johns Hopkins (980 pop) -> ~60 matches, etc.
      const simulatedMatches = Math.floor(HOSPITALS[i].population * (Math.random() * 0.08 + 0.04));
      
      updatedSubmissions[i].status = 'submitted';
      updatedSubmissions[i].flagCount = simulatedMatches;
      setHospitalSubmissions([...updatedSubmissions]);
    }
    
    setCurrentSubmittingIndex(-1);
    setSimulationState('summing');
    
    // Animate contract summing values
    for (let i = 0; i < HOSPITALS.length; i++) {
      setSumAnimationIndex(i);
      await new Promise(r => setTimeout(r, 800));
    }
    
    setSumAnimationIndex(-1);
    setSimulationState('complete');
    
    // Update query status to ready to decrypt
    setQueries(prev => prev.map(q => 
      q.id === selectedQueryId ? { ...q, status: 'ready_to_decrypt', submissionsCount: 4 } : q
    ));
  };

  const handleDecryptCount = async () => {
    if (!isPermitSigned) {
      // Prompt permit signature first
      setIsPermitSigned(true);
      return;
    }

    // Simulate decrypting via permit unsealing
    setQueries(prev => prev.map(q => {
      if (q.id === selectedQueryId) {
        // Calculate sum from submissions
        const sum = hospitalSubmissions.reduce((acc, h) => acc + h.flagCount, 0);
        return {
          ...q,
          status: 'decrypted',
          decryptedCount: sum > 0 ? sum : 284
        };
      }
      return q;
    }));
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Cohort Feasibility Estimator
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Evaluate patient cohort sizes across multiple hospitals homomorphically without exposing individual hospital database details.
        </p>
      </motion.div>

      {/* Security Disclaimer Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(45, 212, 191, 0.05)',
          border: '1px solid rgba(45, 212, 191, 0.15)',
        }}>
          <Shield size={18} style={{ color: 'var(--mint)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>Zero-Knowledge Feasibility Mapping</strong> — Individual hospital patient totals are combined entirely on-chain using <code>FHE.add()</code>. No hospital can see another's cohort volume, and the Pharma sponsor only decrypts the final network-wide total.
          </span>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 24, alignItems: 'start', marginBottom: 32 }}>
        {/* Left Column: Sponsor Controls & Queries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Create Feasibility Query */}
          <GlassCard padding="24px">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} style={{ color: 'var(--mint)' }} />
              Initiate Feasibility Query (Pharma)
            </h3>
            <form onSubmit={handleCreateQuery} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Query Criteria Description
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="e.g., Target: Trial NCT0291, Cohort Criteria: age >= 55 & chol > 200 & sex == 1"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ resize: 'none', fontSize: '0.8rem' }}
                />
              </div>
              <GradientButton type="submit" disabled={!newDescription.trim()} icon={Send}>
                Broadcast Query to Network
              </GradientButton>
            </form>
          </GlassCard>

          {/* Active Feasibility Queries list */}
          <GlassCard padding="24px">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={16} style={{ color: 'var(--mint)' }} />
              Query Queue
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {queries.map((q) => (
                <div
                  key={q.id}
                  onClick={() => setSelectedQueryId(q.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedQueryId === q.id ? 'rgba(45, 212, 191, 0.06)' : 'var(--bg-tertiary)',
                    border: `1px solid ${selectedQueryId === q.id ? 'var(--mint)' : 'var(--border-secondary)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>QUERY #{q.id}</span>
                    <StatusBadge status={q.status} />
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>
                    {q.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    <span>Sites Enrolled: {q.submissionsCount}/4</span>
                    {q.status === 'decrypted' && (
                      <span style={{ fontWeight: 700, color: 'var(--mint)' }}>Matches: {q.decryptedCount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Execution Sandbox & Graph */}
        {selectedQuery && (
          <GlassCard padding="32px">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>
              Query #{selectedQuery.id} Feasibility Map
            </h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: 24 }}>
              {selectedQuery.description}
            </p>

            {/* Simulated Hospital Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              {hospitalSubmissions.map((hospital, idx) => {
                const isSubmitting = idx === currentSubmittingIndex;
                const isAnimatingSum = idx === sumAnimationIndex;
                return (
                  <div
                    key={hospital.name}
                    style={{
                      padding: 16,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-primary)',
                      border: `1px solid ${isSubmitting ? hospital.color : isAnimatingSum ? 'var(--mint)' : 'var(--border-primary)'}`,
                      transition: 'all 0.3s',
                      boxShadow: isSubmitting || isAnimatingSum ? `0 0 15px ${hospital.color}20` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: hospital.color }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{hospital.name}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{hospital.address}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Total Patients</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{hospital.population}</div>
                      </div>

                      {/* Status representation */}
                      {hospital.status === 'pending' ? (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Waiting...</span>
                      ) : hospital.status === 'encrypting' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <RefreshCw size={12} className="spin" style={{ color: 'var(--mint)' }} />
                          <span style={{ fontSize: '0.7rem', color: 'var(--mint)' }}>Encrypting FHE</span>
                        </div>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}>
                          <Lock size={10} style={{ color: 'var(--success)' }} />
                          <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 600 }}>SUBMITTED</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summation Process & On-Chain Results */}
            <div style={{
              padding: 24,
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-secondary)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 24,
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(45, 212, 191, 0.08)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Server size={24} style={{ color: 'var(--mint)' }} />
              </div>

              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>Fhenix Summation Pipeline</h4>
              
              {simulationState === 'idle' && (
                <div style={{ padding: '8px 0' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                    Begin multi-hospital cohort query simulation.
                  </p>
                  <GradientButton size="sm" onClick={startSimulation}>
                    Run Simulation Query
                  </GradientButton>
                </div>
              )}

              {simulationState === 'submitting' && (
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--mint)', marginBottom: 4, fontWeight: 600 }}>
                    Hospitals preparing and encrypting cohort flags...
                  </p>
                  <div className="progress-bar" style={{ height: 6, maxWidth: 200, margin: '12px auto 0' }}>
                    <div className="progress-bar-fill" style={{ width: `${(hospitalSubmissions.filter(h => h.status === 'submitted').length / 4) * 100}%` }} />
                  </div>
                </div>
              )}

              {simulationState === 'summing' && (
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <RefreshCw size={12} className="spin" />
                    Executing FHE.add() across network...
                  </p>
                </div>
              )}

              {simulationState === 'complete' && (
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, marginBottom: 12 }}>
                    🔐 Aggregate FHE Sum Computed & Sealed On-Chain!
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    {!isPermitSigned ? (
                      <GradientButton size="sm" onClick={handleDecryptCount}>
                        Sign Permit to Unseal Cohort Count
                      </GradientButton>
                    ) : selectedQuery.status === 'decrypted' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>ESTIMATED COHORT SIZE</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--mint)' }}>
                          {selectedQuery.decryptedCount} Patients
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--success)', marginTop: 4 }}>
                          Across 4 network hospitals (4,500 total population pool)
                        </div>
                      </div>
                    ) : (
                      <GradientButton size="sm" onClick={handleDecryptCount} icon={Unlock}>
                        Decrypt Combined Volume
                      </GradientButton>
                    )}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
