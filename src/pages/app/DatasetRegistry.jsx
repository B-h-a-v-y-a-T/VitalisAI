import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Filter, MoreHorizontal, Download, Trash2, Play } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import { useDatasets } from '../../context/DatasetContext';

export default function DatasetRegistry() {
  const { datasets } = useDatasets();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = datasets.filter(ds =>
    ds.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadReport = (ds) => {
    let rowsStr = '';
    
    if (ds.encryptedData && ds.headers) {
      // Use real encrypted data from uploaded CSV
      const headersStr = ds.headers.join(',');
      const rows = ds.encryptedData.map(row => row.join(','));
      rowsStr = [headersStr, ...rows].join('\n');
    } else {
      // Generate a simulated encrypted CSV report for mock datasets
      const headers = ['id', 'age_encrypted', 'blood_pressure_encrypted', 'cholesterol_encrypted', 'condition_hash'];
      const mockRows = [headers.join(',')];
      for (let i = 0; i < 50; i++) {
        mockRows.push([
          i,
          '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')
        ].join(','));
      }
      rowsStr = mockRows.join('\n');
    }

    const blob = new Blob([rowsStr], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ds.name.toLowerCase().replace(/ /g, '_')}_encrypted_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Dataset Registry
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Manage and monitor all encrypted datasets.
        </p>
      </motion.div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          flex: 1,
          maxWidth: 400,
        }}>
          <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
          <input
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)' }}
          />
        </div>
        <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard padding="0" hover={false}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Dataset</th>
                  <th>Patients</th>
                  <th>Upload Time</th>
                  <th>Encryption</th>
                  <th>Matching</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ds, i) => (
                  <motion.tr
                    key={ds.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(45, 212, 191, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Database size={14} style={{ color: 'var(--mint)' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{ds.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{ds.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{ds.patients.toLocaleString()}</td>
                    <td style={{ fontSize: '0.8rem' }}>{ds.uploadTime}</td>
                    <td><StatusBadge status={ds.encryptionStatus} /></td>
                    <td><StatusBadge status={ds.matchingStatus} /></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{ds.size}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" title="Download Encrypted Report" onClick={() => downloadReport(ds)}>
                          <Download size={14} />
                        </button>
                        <button className="btn-icon" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Showing {filtered.length} of {datasets.length} datasets
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: page === currentPage ? 'rgba(45, 212, 191, 0.1)' : 'transparent',
                    color: page === currentPage ? 'var(--mint)' : 'var(--text-tertiary)',
                    border: page === currentPage ? '1px solid rgba(45, 212, 191, 0.3)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
