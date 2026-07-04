import { motion } from 'framer-motion';
import { ScrollText, ExternalLink, CheckCircle, Shield, Hash, Clock, Database } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import { auditLogs } from '../../data/mockData';

const actionColors = {
  MATCH_COMPLETE: 'var(--success)',
  MATCH_START: 'var(--info)',
  ENCRYPT_START: 'var(--mint)',
  ENCRYPT_COMPLETE: 'var(--success)',
  ACCESS_GRANT: 'var(--warning)',
  UPLOAD: 'var(--info)',
};

export default function AuditLogs() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Audit Logs
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Immutable blockchain-verified audit trail. Every operation is on-chain.
        </p>
      </motion.div>

      {/* Timeline + Table Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Timeline */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard padding="24px" glow>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} style={{ color: 'var(--mint)' }} />
              Timeline
            </h3>
            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                left: 11,
                top: 0,
                bottom: 0,
                width: 2,
                background: 'var(--border-primary)',
              }} />

              {auditLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex',
                    gap: 12,
                    marginBottom: 20,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: `${actionColors[log.action]}20`,
                    border: `2px solid ${actionColors[log.action]}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                  }}>
                    <CheckCircle size={10} style={{ color: actionColors[log.action] }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                      {log.action.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {log.dataset}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {log.timestamp.split(' ')[1]}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Blockchain Explorer Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard padding="0" hover={false}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <ScrollText size={16} style={{ color: 'var(--mint)' }} />
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Blockchain Explorer</h3>
            </div>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Transaction Hash</th>
                    <th>Block</th>
                    <th>Timestamp</th>
                    <th>Dataset</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Verify</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Hash size={12} style={{ color: 'var(--mint)' }} />
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--mint)',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {log.hash}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                        {log.block.toLocaleString()}
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>{log.timestamp}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Database size={12} style={{ color: 'var(--text-tertiary)' }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{log.dataset}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          background: `${actionColors[log.action]}15`,
                          color: actionColors[log.action],
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}>
                          {log.action}
                        </span>
                      </td>
                      <td><StatusBadge status={log.status} /></td>
                      <td>
                        <button className="btn-icon" title="View on Explorer">
                          <ExternalLink size={14} style={{ color: 'var(--mint)' }} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
