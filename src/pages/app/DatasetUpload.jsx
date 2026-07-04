import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Lock, CheckCircle, AlertCircle, X, Shield, Columns, BarChart3 } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import StatusBadge from '../../components/shared/StatusBadge';
import { csvPreviewData } from '../../data/mockData';

export default function DatasetUpload() {
  const [stage, setStage] = useState('upload'); // upload, preview, mapping, encrypting, complete
  const [dragOver, setDragOver] = useState(false);
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [encryptedRows, setEncryptedRows] = useState(0);
  const [currentRow, setCurrentRow] = useState(-1);
  const totalRows = 303;

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    setStage('preview');
  }, []);

  const startEncryption = () => {
    setStage('encrypting');
    setEncryptionProgress(0);
    setEncryptedRows(0);
    setCurrentRow(0);
  };

  useEffect(() => {
    if (stage !== 'encrypting') return;
    const interval = setInterval(() => {
      setEncryptedRows(prev => {
        const next = prev + Math.floor(Math.random() * 3) + 1;
        if (next >= totalRows) {
          setStage('complete');
          clearInterval(interval);
          return totalRows;
        }
        setEncryptionProgress((next / totalRows) * 100);
        setCurrentRow(next % csvPreviewData.rows.length);
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: 4,
        }}>
          Dataset Upload
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Upload, preview, and encrypt patient datasets for secure matching.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ─── UPLOAD STAGE ─── */}
        {stage === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <GlassCard
              padding="0"
              hover={false}
              style={{ overflow: 'hidden' }}
            >
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => setStage('preview')}
                style={{
                  padding: 80,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: `2px dashed ${dragOver ? 'var(--mint)' : 'var(--border-primary)'}`,
                  borderRadius: 'var(--radius-xl)',
                  margin: 24,
                  background: dragOver ? 'rgba(45, 212, 191, 0.04)' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <motion.div
                  animate={{ y: dragOver ? -8 : 0 }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 'var(--radius-xl)',
                    background: 'rgba(45, 212, 191, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  <Upload size={32} style={{ color: 'var(--mint)' }} />
                </motion.div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
                  Drop your CSV file here
                </h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: 24 }}>
                  or click to browse. Supports CSV files up to 100MB.
                </p>
                <GradientButton size="md" icon={FileSpreadsheet}>
                  Select CSV File
                </GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ─── PREVIEW STAGE ─── */}
        {stage === 'preview' && (
          <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { icon: FileSpreadsheet, label: 'File', value: 'cardio_dataset.csv', color: 'var(--info)' },
                { icon: BarChart3, label: 'Rows', value: '303 records', color: 'var(--mint)' },
                { icon: Columns, label: 'Columns', value: '8 fields', color: 'var(--teal)' },
                { icon: Shield, label: 'Status', value: 'Ready to Encrypt', color: 'var(--success)' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <GlassCard key={i} padding="16px">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={18} style={{ color: stat.color }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{stat.label}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{stat.value}</div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {/* CSV Preview Table */}
            <GlassCard padding="0" hover={false} style={{ marginBottom: 24 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>CSV Preview</h3>
                <StatusBadge status="info" label="Plaintext" />
              </div>
              <div className="table-container" style={{ border: 'none' }}>
                <table className="table">
                  <thead>
                    <tr>
                      {csvPreviewData.headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreviewData.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Schema Validation */}
            <GlassCard padding="20px" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                Schema Validation Passed
              </h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {csvPreviewData.headers.map((h, i) => (
                  <span key={i} className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                    ✓ {h}
                  </span>
                ))}
              </div>
            </GlassCard>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <GradientButton variant="secondary" onClick={() => setStage('upload')}>Cancel</GradientButton>
              <GradientButton icon={Lock} onClick={startEncryption}>
                Encrypt Dataset
              </GradientButton>
            </div>
          </motion.div>
        )}

        {/* ─── ENCRYPTING STAGE ─── */}
        {stage === 'encrypting' && (
          <motion.div key="encrypting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <GlassCard padding="40px" glow style={{ textAlign: 'center', marginBottom: 32 }}>
              {/* Animated Lock */}
              <motion.div
                animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 'var(--radius-xl)',
                  background: 'rgba(45, 212, 191, 0.1)',
                  border: '2px solid rgba(45, 212, 191, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  animation: 'glow-pulse 2s ease infinite',
                }}
              >
                <Lock size={36} style={{ color: 'var(--mint)' }} />
              </motion.div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
                Encrypting Patient Records
              </h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: 32 }}>
                Each field is being encrypted using Fully Homomorphic Encryption
              </p>

              {/* Progress */}
              <div style={{ maxWidth: 500, margin: '0 auto', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {encryptedRows} / {totalRows}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--mint)', fontWeight: 600 }}>
                    {Math.round(encryptionProgress)}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 12, borderRadius: 'var(--radius-full)' }}>
                  <motion.div
                    className="progress-bar-fill"
                    style={{ width: `${encryptionProgress}%`, height: '100%' }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
                  Speed: ~142 rows/sec • ETA: {Math.max(0, Math.ceil((totalRows - encryptedRows) / 142))}s
                </p>
              </div>
            </GlassCard>

            {/* Live Encryption Preview */}
            <GlassCard padding="0" hover={false}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Live Encryption</h3>
                <StatusBadge status="encrypting" label="Encrypting" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', overflow: 'hidden' }}>
                {/* Plaintext side */}
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Plaintext
                  </div>
                  {csvPreviewData.rows.map((row, i) => (
                    <motion.div
                      key={i}
                      animate={i <= currentRow ? { opacity: 0.3, x: -10 } : { opacity: 1, x: 0 }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: i === currentRow ? 'var(--error-bg)' : 'transparent',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        marginBottom: 4,
                        transition: 'all 0.3s',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: i <= currentRow ? 'var(--text-tertiary)' : 'var(--text-primary)',
                        textDecoration: i < currentRow ? 'line-through' : 'none',
                      }}
                    >
                      {row.join(' | ')}
                    </motion.div>
                  ))}
                </div>

                {/* Arrow */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '1px solid var(--border-secondary)',
                  borderRight: '1px solid var(--border-secondary)',
                }}>
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                    <Lock size={16} style={{ color: 'var(--mint)' }} />
                  </motion.div>
                </div>

                {/* Encrypted side */}
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Encrypted (Ciphertext)
                  </div>
                  {csvPreviewData.encryptedRows.map((row, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={i <= currentRow ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 10 }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: i === currentRow ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: i <= currentRow ? 'var(--mint)' : 'var(--text-tertiary)',
                        marginBottom: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        animation: i === currentRow ? 'encrypt-flash 0.5s ease' : 'none',
                      }}
                    >
                      {row.join(' | ')}
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ─── COMPLETE STAGE ─── */}
        {stage === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard padding="60px" glow style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  border: '2px solid var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <CheckCircle size={36} style={{ color: 'var(--success)' }} />
              </motion.div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
                Dataset Encrypted Successfully
              </h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: 8 }}>
                All {totalRows} records have been encrypted using FHE.
              </p>
              <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 32 }}>
                Raw Records Viewed: 0
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <GradientButton onClick={() => setStage('upload')}>Upload Another</GradientButton>
                <GradientButton variant="secondary">View in Registry</GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
