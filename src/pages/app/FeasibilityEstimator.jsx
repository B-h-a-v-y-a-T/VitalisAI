import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, HelpCircle, Lock, Unlock, Server, Shield, Plus, Send, RefreshCw, Code2, Database } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import StatusBadge from '../../components/shared/StatusBadge';

// The user-provided API Key (GitHub blocks hardcoded keys, so use environment variable)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

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
      description: 'Patients 60 years or older with fasting blood sugar equal to 1',
      parsedCriteria: { age: { operator: '>=', value: 60 }, fbs: { operator: '==', value: 1 } },
      submissionsCount: 4,
      totalPopulation: 4500,
      status: 'decrypted',
      decryptedCount: 312,
    },
    {
      id: 1,
      description: 'Patients with cholesterol above 240 and maximum heart rate below 120',
      parsedCriteria: { chol: { operator: '>', value: 240 }, thalach: { operator: '<', value: 120 } },
      submissionsCount: 4,
      totalPopulation: 4500,
      status: 'ready_to_decrypt',
      decryptedCount: null,
    }
  ]);

  const [newDescription, setNewDescription] = useState('');
  const [selectedQueryId, setSelectedQueryId] = useState(1);
  const [isParsing, setIsParsing] = useState(false);
  const [isPermitSigned, setIsPermitSigned] = useState(false);
  const [simulationState, setSimulationState] = useState('idle'); // idle | submitting | summing | complete
  const [hospitalSubmissions, setHospitalSubmissions] = useState(
    HOSPITALS.map(h => ({ ...h, status: 'pending', flagCount: 0 }))
  );
  const [currentSubmittingIndex, setCurrentSubmittingIndex] = useState(-1);
  const [sumAnimationIndex, setSumAnimationIndex] = useState(-1);

  const selectedQuery = queries.find(q => q.id === selectedQueryId);

  // Calls Gemini API to parse natural language into structured JSON criteria
  const parseQueryWithGemini = async (text) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical NLP parser. Convert this natural language query into a strict JSON object mapping feature names ('age', 'sex', 'trestbps', 'chol', 'fbs', 'thalach') to an operator ('<', '>', '<=', '>=', '==') and a numeric value. 
Example query: "Patients older than 50 with cholesterol over 200"
Example output: {"age": {"operator": ">", "value": 50}, "chol": {"operator": ">", "value": 200}}
Output ONLY valid JSON without any markdown formatting or backticks. Omit unmentioned features.
Query: "${text}"`
            }]
          }]
        })
      });
      const data = await response.json();
      let rawText = data.candidates[0].content.parts[0].text.trim();
      // Clean markdown if Gemini accidentally included it
      if (rawText.startsWith('```json')) rawText = rawText.substring(7);
      if (rawText.startsWith('```')) rawText = rawText.substring(3);
      if (rawText.endsWith('```')) rawText = rawText.substring(0, rawText.length - 3);
      
      return JSON.parse(rawText.trim());
    } catch (e) {
      console.error("Gemini Parsing Error", e);
      // Fallback if parsing fails
      return { age: { operator: ">", value: 0 } };
    }
  };

  const handleCreateQuery = async (e) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    setIsParsing(true);
    const parsedJson = await parseQueryWithGemini(newDescription);
    setIsParsing(false);

    const newQuery = {
      id: queries.length,
      description: newDescription,
      parsedCriteria: parsedJson,
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

  // Helper to generate a realistic mock hospital patient
  const generateRandomPatient = () => ({
    age: 30 + Math.floor(Math.random() * 50),
    sex: Math.random() > 0.5 ? 1 : 0,
    trestbps: 90 + Math.floor(Math.random() * 90),
    chol: 150 + Math.floor(Math.random() * 200),
    fbs: Math.random() > 0.85 ? 1 : 0,
    thalach: 80 + Math.floor(Math.random() * 120),
  });

  // Helper to evaluate a patient against the structured JSON criteria
  const evaluatePatient = (patient, criteria) => {
    if (!criteria || Object.keys(criteria).length === 0) return true;
    for (const [key, cond] of Object.entries(criteria)) {
      if (patient[key] === undefined) continue;
      const { operator, value } = cond;
      const pVal = Number(patient[key]);
      const cVal = Number(value);
      if (operator === '>' && !(pVal > cVal)) return false;
      if (operator === '<' && !(pVal < cVal)) return false;
      if (operator === '>=' && !(pVal >= cVal)) return false;
      if (operator === '<=' && !(pVal <= cVal)) return false;
      if (operator === '==' && !(pVal === cVal)) return false;
    }
    return true;
  };

  const startSimulation = async () => {
    if (!selectedQuery) return;
    
    setSimulationState('submitting');
    const updatedSubmissions = [...hospitalSubmissions];
    
    for (let i = 0; i < HOSPITALS.length; i++) {
      setCurrentSubmittingIndex(i);
      updatedSubmissions[i].status = 'encrypting';
      setHospitalSubmissions([...updatedSubmissions]);
      
      // Artificial delay for UI
      await new Promise(r => setTimeout(r, 1000));
      
      // Mathematically simulate realistic matching against the generated population
      let matches = 0;
      for (let p = 0; p < HOSPITALS[i].population; p++) {
        const patient = generateRandomPatient();
        if (evaluatePatient(patient, selectedQuery.parsedCriteria)) {
          matches++;
        }
      }
      
      updatedSubmissions[i].status = 'submitted';
      updatedSubmissions[i].flagCount = matches;
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
    
    // Update query status
    setQueries(prev => prev.map(q => 
      q.id === selectedQueryId ? { ...q, status: 'ready_to_decrypt', submissionsCount: 4 } : q
    ));
  };

  const handleDecryptCount = async () => {
    if (!isPermitSigned) {
      setIsPermitSigned(true);
      return;
    }

    setQueries(prev => prev.map(q => {
      if (q.id === selectedQueryId) {
        const sum = hospitalSubmissions.reduce((acc, h) => acc + h.flagCount, 0);
        return {
          ...q,
          status: 'decrypted',
          decryptedCount: sum
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
          Evaluate patient cohort sizes across multiple hospitals homomorphically using Gemini NLP-to-Structured Query translation.
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
                  Natural Language Query
                </label>
                <textarea
                  className="input"
                  rows={3}
                  disabled={isParsing}
                  placeholder="e.g., 'Find patients over 50 with cholesterol above 220'"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ resize: 'none', fontSize: '0.8rem' }}
                />
              </div>
              <GradientButton type="submit" disabled={!newDescription.trim() || isParsing} icon={isParsing ? RefreshCw : Send}>
                {isParsing ? 'Gemini is Parsing...' : 'Broadcast Query to Network'}
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
                  onClick={() => {
                    setSelectedQueryId(q.id);
                    setSimulationState('idle');
                    setHospitalSubmissions(HOSPITALS.map(h => ({ ...h, status: 'pending', flagCount: 0 })));
                    setIsPermitSigned(false);
                  }}
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
                    "{q.description}"
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
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: 16 }}>
              "{selectedQuery.description}"
            </p>

            {/* Structured JSON Display */}
            <div style={{ 
              marginBottom: 24, 
              padding: 16, 
              background: '#040b0e', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Code2 size={14} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Gemini Parsed Structure</span>
              </div>
              <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--mint)', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(selectedQuery.parsedCriteria, null, 2)}
              </pre>
            </div>

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
                    Begin multi-hospital cohort query simulation based on parsed logic.
                  </p>
                  <GradientButton size="sm" onClick={startSimulation} icon={Database}>
                    Run Simulation Query
                  </GradientButton>
                </div>
              )}

              {simulationState === 'submitting' && (
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--mint)', marginBottom: 4, fontWeight: 600 }}>
                    Hospitals filtering local records and encrypting flags...
                  </p>
                  <div className="progress-bar" style={{ height: 6, maxWidth: 200, margin: '12px auto 0' }}>
                    <div className="progress-bar-fill" style={{ width: `${(hospitalSubmissions.filter(h => h.status === 'submitted').length / 4) * 100}%`, transition: 'width 0.3s ease' }} />
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
