import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lock, Shield, Database, ArrowRight, Zap, Activity, Server, CheckCircle, Play, Download } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import StatusBadge from '../../components/shared/StatusBadge';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import modelWeights from '../../../ml/model_weights.json';
import { useDatasets } from '../../context/DatasetContext';

export default function MatchingEngine() {
  const { datasets, matchingJobs, addMatchingJob, updateMatchingJob } = useDatasets();
  const [activePhase, setActivePhase] = useState(-1);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const downloadMatches = (job) => {
    if (job.matches === 0) return;
    const rows = [['Matched_Patient_ID', 'Job_ID', 'Trial', 'Timestamp']];
    const timestamp = new Date().toISOString();
    for (let i = 0; i < job.matches; i++) {
      // Simulate patient IDs
      const pid = `PID-${(Math.floor(Math.random() * 900000) + 100000)}`;
      rows.push([pid, job.id, job.trial, timestamp]);
    }
    const csvStr = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitalis_matches_${job.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let interval;
    if (isMatching) {
      interval = setInterval(() => {
        setActivePhase(prev => (prev + 1) % 4);
      }, 1500);
    } else {
      setActivePhase(-1);
    }
    return () => clearInterval(interval);
  }, [isMatching]);

  const startMatch = async () => {
    if (!selectedDataset) return;
    setIsMatching(true);
    
    const ds = datasets.find(d => d.id === selectedDataset);
    
    const jobId = `JOB-${Math.floor(Math.random() * 10000)}`;
    addMatchingJob({
      id: jobId,
      dataset: ds.name,
      trial: `${modelWeights.model} (${modelWeights.num_features} features)`,
      progress: 0,
      matches: 0,
      time: '-',
      status: 'encrypting'
    });
    
    // Process dataset rows iteratively to simulate real processing
    let processedRows = 0;
    const totalRows = ds.patients;
    const batchSize = Math.max(1, Math.floor(totalRows / 15)); // Process in ~15 steps for visual effect
    
    const interval = setInterval(() => {
      processedRows += batchSize;
      
      if (processedRows >= totalRows) {
        processedRows = totalRows;
        clearInterval(interval);
        updateMatchingJob(jobId, {
          progress: 100,
          status: 'success',
          matches: Math.floor(ds.patients * modelWeights.accuracy * (Math.random() * 0.3 + 0.2)),
          time: new Date().toLocaleTimeString()
        });
        setIsMatching(false);
      } else {
        const progress = Math.floor((processedRows / totalRows) * 100);
        updateMatchingJob(jobId, {
          progress,
          status: 'mapping'
        });
      }
    }, 600);
  };

  const phases = [
    { icon: Database, label: 'Encrypted\nDataset', color: '#3B82F6' },
    { icon: Lock, label: 'CoFHE\nEngine', color: '#2DD4BF' },
    { icon: Cpu, label: 'Encrypted\nProcessing', color: '#0F6E6A' },
    { icon: CheckCircle, label: 'Eligibility\nResults', color: '#10B981' },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Matching Engine
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          AI-powered eligibility scoring on fully encrypted data.
        </p>
      </motion.div>

      {/* Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { icon: Zap, label: 'Processing Speed', value: 142, suffix: ' rows/s', color: 'var(--mint)' },
          { icon: Activity, label: 'Active Jobs', value: 2, color: 'var(--info)' },
          { icon: Server, label: 'Engine Latency', value: 45, suffix: 'ms', color: 'var(--teal)' },
          { icon: Shield, label: 'Privacy Score', value: 100, suffix: '%', color: 'var(--success)' },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard padding="20px">
                <Icon size={20} style={{ color: metric.color, marginBottom: 12 }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{metric.label}</div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* New Match Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard padding="24px" style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16 }}>Run New Match</h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, display: 'block' }}>
                Select Encrypted Dataset
              </label>
              <select 
                className="input" 
                value={selectedDataset} 
                onChange={(e) => setSelectedDataset(e.target.value)}
                disabled={isMatching}
              >
                <option value="">-- Choose Dataset --</option>
                {datasets.map(ds => (
                  <option key={ds.id} value={ds.id}>{ds.name} ({ds.patients} patients)</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, display: 'block' }}>
                ML Model Criteria
              </label>
              <select className="input" disabled>
                <option>{modelWeights.model} ({modelWeights.num_features} features, {(modelWeights.accuracy * 100).toFixed(1)}% accuracy)</option>
              </select>
            </div>
            <GradientButton 
              icon={Play} 
              onClick={startMatch} 
              disabled={!selectedDataset || isMatching}
            >
              Start Matching
            </GradientButton>
          </div>
        </GlassCard>
      </motion.div>

      {/* Central Pipeline Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard padding="40px" glow style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>
            FHE Matching Pipeline
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {phases.map((phase, i) => {
              const Icon = phase.icon;
              const isActive = i === activePhase;
              const isPast = i < activePhase;

              return (
                <motion.div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      boxShadow: isActive ? `0 0 30px ${phase.color}40` : '0 4px 15px rgba(0,0,0,0.05)',
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: 'var(--radius-xl)',
                      background: 'var(--bg-primary)',
                      border: isActive ? `2px solid ${phase.color}` : '1px solid var(--border-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.4s ease',
                      boxShadow: isActive ? `0 0 20px ${phase.color}20` : 'none',
                    }}>
                      <Icon size={28} style={{ color: isActive ? phase.color : 'var(--text-tertiary)' }} />
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.3,
                    }}>
                      {phase.label}
                    </span>
                  </motion.div>

                  {i < phases.length - 1 && (
                    <motion.div
                      animate={{
                        opacity: isPast ? [0.3, 1, 0.3] : 0.3,
                      }}
                      transition={{ duration: 1.5, repeat: isPast ? Infinity : 0 }}
                    >
                      <ArrowRight size={20} style={{ color: isPast ? phases[i].color : 'var(--text-tertiary)' }} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Animated data packets */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 32,
          }}>
            {isMatching && ['Ciphertext A', 'Ciphertext B', 'Ciphertext C'].map((label, i) => (
              <motion.div
                key={i}
                animate={{ x: [0, 40, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(45, 212, 191, 0.05)',
                  border: '1px solid rgba(45, 212, 191, 0.2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--mint)',
                  boxShadow: '0 0 10px rgba(45, 212, 191, 0.1)',
                }}
              >
                <Lock size={10} style={{ color: 'var(--mint)' }} />
                <span>{label}</span>
              </motion.div>
            ))}
            {!isMatching && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Select a dataset and start matching to view pipeline activity.
              </span>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Jobs Table */}
      <GlassCard padding="0" hover={false}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Processing Queue</h3>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Dataset</th>
                <th>Trial</th>
                <th>Progress</th>
                <th>Matches</th>
                <th>Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matchingJobs.map((job, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.8rem' }}>{job.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{job.dataset}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{job.trial}</td>
                  <td style={{ width: 120 }}>
                    <div className="progress-bar" style={{ height: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${job.progress}%` }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{job.progress}%</span>
                  </td>
                  <td style={{ fontWeight: 700, color: job.matches > 0 ? 'var(--success)' : 'var(--text-tertiary)' }}>
                    {job.matches > 0 ? job.matches.toLocaleString() : '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{job.time}</td>
                  <td><StatusBadge status={job.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    {job.status === 'success' && job.matches > 0 && (
                      <button
                        onClick={() => downloadMatches(job)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--mint)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(45, 212, 191, 0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Download size={14} /> Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
