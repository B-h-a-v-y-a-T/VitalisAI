import { motion } from 'framer-motion';
import { ShieldCheck, Wallet, UserCheck, Building2, Database, Key, Plus, MoreHorizontal } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import GradientButton from '../../components/shared/GradientButton';
import { accessControlUsers } from '../../data/mockData';

const roleColors = {
  'Hospital Admin': 'var(--info)',
  'Sponsor': 'var(--mint)',
  'CRO Analyst': 'var(--warning)',
  'Auditor': 'var(--teal)',
};

export default function AccessControl() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Access Control
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
            Manage wallet authorization, roles, and dataset permissions.
          </p>
        </div>
        <GradientButton icon={Plus} size="sm">Add User</GradientButton>
      </motion.div>

      {/* Permission Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { icon: UserCheck, label: 'Active Users', value: 3, color: 'var(--success)' },
          { icon: Key, label: 'Pending', value: 1, color: 'var(--warning)' },
          { icon: Database, label: 'Datasets Shared', value: 4, color: 'var(--info)' },
          { icon: ShieldCheck, label: 'Roles Defined', value: 4, color: 'var(--mint)' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard padding="20px">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{stat.label}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard padding="0" hover={false} style={{ marginBottom: 32 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wallet size={16} style={{ color: 'var(--mint)' }} />
              Wallet Authorization
            </h3>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Wallet Address</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>Datasets</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessControlUsers.map((user, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-tertiary)',
                      }}>
                        {user.address.slice(0, 8)}...{user.address.slice(-4)}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: `${roleColors[user.role]}15`,
                        color: roleColors[user.role],
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: `1px solid ${roleColors[user.role]}30`,
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={12} style={{ color: 'var(--text-tertiary)' }} />
                        <span style={{ fontSize: '0.82rem' }}>{user.org}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {user.datasets.length > 0 ? user.datasets.map((ds, j) => (
                          <span key={j} style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-tertiary)',
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono)',
                          }}>
                            {ds}
                          </span>
                        )) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>None</span>
                        )}
                      </div>
                    </td>
                    <td><StatusBadge status={user.status} /></td>
                    <td>
                      <button className="btn-icon"><MoreHorizontal size={14} /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* Permission Matrix */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard padding="24px">
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={16} style={{ color: 'var(--mint)' }} />
            Permission Matrix
          </h3>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Permission</th>
                  <th>Hospital Admin</th>
                  <th>Sponsor</th>
                  <th>CRO Analyst</th>
                  <th>Auditor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { perm: 'Upload Datasets', values: [true, false, false, false] },
                  { perm: 'Encrypt Data', values: [true, false, false, false] },
                  { perm: 'Run Matching', values: [true, true, true, false] },
                  { perm: 'View Results', values: [true, true, true, true] },
                  { perm: 'Decrypt Patient IDs', values: [true, false, false, false] },
                  { perm: 'View Audit Logs', values: [true, true, true, true] },
                  { perm: 'Manage Access', values: [true, false, false, false] },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{row.perm}</td>
                    {row.values.map((v, j) => (
                      <td key={j} style={{ textAlign: 'center' }}>
                        <span style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: v ? 'var(--success-bg)' : 'var(--error-bg)',
                          color: v ? 'var(--success)' : 'var(--error)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}>
                          {v ? '✓' : '✕'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
