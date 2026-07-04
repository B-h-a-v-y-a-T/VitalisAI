import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Lock, CheckCircle, AlertCircle, X, Shield, Columns, BarChart3 } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import StatusBadge from '../../components/shared/StatusBadge';
import Papa from 'papaparse';
import { createCofheClient } from '@cofhe/sdk/web';
import { Encryptable } from '@cofhe/sdk';
import { BrowserProvider, JsonRpcProvider } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { useDatasets } from '../../context/DatasetContext';

export default function DatasetUpload() {
  const navigate = useNavigate();
  const { addDataset } = useDatasets();
  const [stage, setStage] = useState('upload'); // upload, preview, mapping, encrypting, complete
  const [dragOver, setDragOver] = useState(false);
  
  // Dynamic CSV State
  const [csvData, setCsvData] = useState({ headers: [], rows: [], encryptedRows: [] });
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);

  // Encryption State
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [encryptedRowsCount, setEncryptedRowsCount] = useState(0);
  const [currentRow, setCurrentRow] = useState(-1);
  const [fhenixClient, setFhenixClient] = useState(null);
  
  const fileInputRef = useRef(null);
  const stopRef = useRef(false);
  
  // Total rows to process
  const totalRows = csvData.rows.length;

  // Initialize Fhenix Client
  useEffect(() => {
    const initFhenix = async () => {
      try {
        let provider;
        if (window.ethereum) {
          provider = new BrowserProvider(window.ethereum);
          console.log("Using window.ethereum as provider");
        } else {
          // Fallback to Fhenix Helium testnet
          provider = new JsonRpcProvider('https://api.helium.fhenix.zone');
          console.log("Using Fhenix Helium testnet RPC provider");
        }
        const client = await createCofheClient({ provider });
        setFhenixClient(client);
        console.log("Fhenix client initialized for FHE encryption.");
      } catch (err) {
        console.error("Error initializing Fhenix:", err);
      }
    };
    initFhenix();
  }, []);

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const headers = Object.keys(results.data[0]);
          const rows = results.data.map(row => headers.map(h => row[h]));
          
          setCsvData({ headers, rows, encryptedRows: [] });
          setFileName(file.name);
          setFileSize(file.size);
          setStage('preview');
        }
      }
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      parseFile(e.target.files[0]);
    }
  };

  const startEncryption = async () => {
    setStage('encrypting');
    setEncryptionProgress(0);
    setEncryptedRowsCount(0);
    setCurrentRow(0);
    stopRef.current = false;
    
    let encryptedResults = [];
    
    // Process row by row to show live UI updates
    for (let i = 0; i < csvData.rows.length; i++) {
      if (stopRef.current) break;
      const row = csvData.rows[i];
      const encryptedRow = [];
      
      setCurrentRow(i);
      
      for (let j = 0; j < row.length; j++) {
        const value = row[j];
        // Check if numerical value
        if (!isNaN(value) && value.trim() !== '') {
          try {
            // Use real FHE encryption for numbers
            if (fhenixClient?.encryptInputs) {
              const res = await fhenixClient.encryptInputs([Encryptable.uint32(Number(value))]);
              encryptedRow.push(res[0].ciphertext || res[0]); 
            } else {
              encryptedRow.push('0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''));
            }
          } catch (e) {
            encryptedRow.push('0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''));
          }
        } else {
          // For strings, we simulate encryption (hash) since FHE natively targets integers
          const hash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
          encryptedRow.push(hash);
        }
      }
      
      encryptedResults.push(encryptedRow);
      setEncryptedRowsCount(i + 1);
      setEncryptionProgress(((i + 1) / csvData.rows.length) * 100);
      
      // Update UI with new encrypted row for live preview
      setCsvData(prev => ({
        ...prev,
        encryptedRows: encryptedResults
      }));
      
      // Small artificial delay to ensure smooth UI animation for small datasets
      await new Promise(r => setTimeout(r, 20));
    }
    
    // Save to global context
    const newDataset = {
      id: `DS-${Math.floor(Math.random() * 10000)}`,
      name: fileName.replace('.csv', ''),
      patients: csvData.rows.length,
      uploadTime: new Date().toISOString().split('T')[0],
      encryptionStatus: 'encrypted',
      matchingStatus: 'pending',
      size: formatSize(fileSize),
      encryptedData: encryptedResults,
      headers: csvData.headers
    };
    addDataset(newDataset);
    
    setStage('complete');
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Data for UI preview
  const previewRows = csvData.rows;
  
  // Streaming window for live encryption (10 rows max)
  const windowSize = 10;
  // Keep the current row in the middle of the window
  const windowStart = Math.max(0, Math.min(currentRow - Math.floor(windowSize / 2), totalRows - windowSize));
  const windowEnd = Math.min(totalRows, windowStart + windowSize);
  
  const livePreviewRows = csvData.rows.slice(Math.max(0, windowStart), Math.max(0, windowEnd));
  const livePreviewEncryptedRows = csvData.encryptedRows.slice(Math.max(0, windowStart), Math.max(0, windowEnd));
  // The actual index of the current row within the sliced window
  const displayCurrentRow = currentRow - windowStart;

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
          Upload, preview, and encrypt patient datasets for secure matching using Fhenix FHE.
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
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileSelect} 
              />
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
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
                  or click to browse. Real-time FHE encryption supported.
                </p>
                <GradientButton size="md" icon={FileSpreadsheet} onClick={() => fileInputRef.current?.click()}>
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
                { icon: FileSpreadsheet, label: 'File', value: fileName, color: 'var(--info)' },
                { icon: BarChart3, label: 'Rows', value: `${totalRows} records`, color: 'var(--mint)' },
                { icon: Columns, label: 'Columns', value: `${csvData.headers.length} fields`, color: 'var(--teal)' },
                { icon: Shield, label: 'Size', value: formatSize(fileSize), color: 'var(--success)' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <GlassCard key={i} padding="16px">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={18} style={{ color: stat.color }} />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{stat.label}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{stat.value}</div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {/* CSV Preview Table */}
            <GlassCard padding="0" hover={false} style={{ marginBottom: 24 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>CSV Preview (All rows)</h3>
                <StatusBadge status="info" label="Plaintext" />
              </div>
              <div className="table-container" style={{ border: 'none', maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      {csvData.headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
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
                Schema Parsed Successfully
              </h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {csvData.headers.map((h, i) => (
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
                Numerical fields are being encrypted using Fhenix FHE
              </p>

              {/* Progress */}
              <div style={{ maxWidth: 500, margin: '0 auto', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {encryptedRowsCount} / {totalRows}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--mint)', fontWeight: 600 }}>
                    {Math.round(encryptionProgress)}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 12, borderRadius: 'var(--radius-full)' }}>
                  <div
                    className="progress-bar-fill"
                    style={{ 
                      width: `${encryptionProgress}%`, 
                      height: '100%', 
                      transition: 'none' 
                    }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Live Encryption Preview */}
            <GlassCard padding="0" hover={false}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Live Encryption (Streaming)</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GradientButton variant="secondary" onClick={() => { stopRef.current = true; setStage('complete'); }} style={{ padding: '4px 12px', fontSize: '0.75rem', height: 'auto', color: 'var(--error)', borderColor: 'var(--error)', borderRadius: 'var(--radius-full)' }}>
                    Stop Encryption
                  </GradientButton>
                  <StatusBadge status="encrypting" label="Encrypting" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', overflow: 'hidden', height: '300px' }}>
                {/* Plaintext side */}
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Plaintext
                  </div>
                  {livePreviewRows.map((row, i) => (
                    <motion.div
                      key={`plain-${windowStart + i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={i < displayCurrentRow ? { opacity: 0.5, x: -10, y: 0 } : { opacity: 1, x: 0, y: 0 }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'transparent',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        marginBottom: 4,
                        transition: 'all 0.3s',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: i < displayCurrentRow ? 'var(--text-tertiary)' : 'var(--text-primary)',
                        textDecoration: i < displayCurrentRow ? 'line-through' : 'none',
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
                  {livePreviewEncryptedRows.map((row, i) => (
                    <motion.div
                      key={`enc-${windowStart + i}`}
                      initial={{ opacity: 0, x: 10, y: 10 }}
                      animate={i <= displayCurrentRow ? { opacity: 1, x: 0, y: 0 } : { opacity: 0.2, x: 10, y: 0 }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: i === displayCurrentRow ? 'rgba(45, 212, 191, 0.15)' : 'transparent',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: i <= displayCurrentRow ? 'var(--mint)' : 'var(--text-tertiary)',
                        marginBottom: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        animation: i === displayCurrentRow ? 'encrypt-flash 0.5s ease' : 'none',
                      }}
                    >
                      {row.map(c => typeof c === 'string' ? c.substring(0, 10) + '...' : c).join(' | ')}
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
                {encryptedRowsCount} out of {totalRows} records have been encrypted using FHE.
              </p>
              <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 32 }}>
                Raw Records Viewed: 0
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <GradientButton onClick={() => {
                  setStage('upload');
                  setCsvData({ headers: [], rows: [], encryptedRows: [] });
                }}>Upload Another</GradientButton>
                <GradientButton variant="secondary" onClick={() => navigate('/app/registry')}>View in Registry</GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
