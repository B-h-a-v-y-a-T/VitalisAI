import { motion } from 'framer-motion';
import { ClipboardList, EyeOff, Download, Filter } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import { matchResults } from '../../data/mockData';

export default function Results() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Results Dashboard
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Encrypted eligibility scoring results. No patient information visible.
        </p>
      </motion.div>

      {/* Top Metric - Raw Records Viewed: 0 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <GlassCard
          padding="32px"
          glow
          style={{
            textAlign: 'center',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.03)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--success-bg)',
              border: '2px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'glow-pulse 3s ease infinite',
            }}>
              <EyeOff size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--success)', letterSpacing: '-0.02em' }}>
                <AnimatedCounter value={0} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)' }}>
                Raw Records Viewed
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                Zero exposure guarantee — always maintained
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Matches', value: matchResults.length, color: 'var(--mint)' },
          { label: 'Eligible', value: matchResults.filter(r => r.status === 'eligible').length, color: 'var(--success)' },
          { label: 'Avg Score', value: '0.80', color: 'var(--info)' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <GlassCard padding="20px">
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: stat.color }}>
                {stat.value}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Results Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard padding="0" hover={false}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={16} style={{ color: 'var(--mint)' }} />
              Match Results
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Filter size={12} /> Filter
              </button>
              <button className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Download size={12} /> Export
              </button>
            </div>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Eligibility Score</th>
                  <th>Match Status</th>
                  <th>Trial</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {matchResults.map((result, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                  >
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem' }}>
                      {result.patientId}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 4, borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)' }}>
                          <div style={{
                            height: '100%',
                            width: `${result.score * 100}%`,
                            borderRadius: 'var(--radius-full)',
                            background: result.score >= 0.9 ? 'var(--success)' : result.score >= 0.7 ? 'var(--warning)' : 'var(--error)',
                          }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: result.score >= 0.9 ? 'var(--success)' : result.score >= 0.7 ? 'var(--warning)' : 'var(--error)' }}>
                          {result.score.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td><StatusBadge status={result.status} /></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{result.trial}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{result.timestamp}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
