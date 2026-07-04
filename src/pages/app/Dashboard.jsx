import { motion } from 'framer-motion';
import { Database, Users, FlaskConical, EyeOff, TrendingUp, Activity, Shield, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GlassCard from '../../components/shared/GlassCard';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import StatusBadge from '../../components/shared/StatusBadge';
import { dashboardStats, recentActivity, matchingJobs, systemHealth, chartData } from '../../data/mockData';

const iconMap = { database: Database, users: Users, flask: FlaskConical, 'eye-off': EyeOff };

export default function Dashboard() {
  return (
    <div>
      {/* Page Header */}
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
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Monitor encryption, matching operations, and system health.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {dashboardStats.map((stat, i) => {
          const Icon = iconMap[stat.icon];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard
                padding="24px"
                glow={stat.highlight}
                style={stat.highlight ? {
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.04)',
                } : {}}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: stat.highlight ? 'var(--success-bg)' : `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={22} style={{ color: stat.highlight ? 'var(--success)' : stat.color }} />
                  </div>
                  {stat.highlight && (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--success-bg)',
                      color: 'var(--success)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      animation: 'glow-pulse 3s ease infinite',
                    }}>
                      ZERO EXPOSURE
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: stat.highlight ? 'var(--success)' : 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: 4,
                }}>
                  <AnimatedCounter value={stat.value} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: stat.highlight ? 'var(--success)' : 'var(--mint)', marginTop: 4, fontWeight: 600 }}>
                  {stat.change}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Encryption Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard padding="24px">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} style={{ color: 'var(--mint)' }} />
              Encryption Activity
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData.encryptionOverTime}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                <XAxis dataKey="time" stroke="var(--text-tertiary)" fontSize={12} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 12,
                    fontSize: '0.8rem',
                  }}
                />
                <Area type="monotone" dataKey="patients" stroke="#2DD4BF" fillOpacity={1} fill="url(#colorPatients)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Match Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard padding="24px">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} style={{ color: 'var(--mint)' }} />
              Match Distribution
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={chartData.matchDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.matchDistribution.map((entry, index) => (
                    <Cell key={index} fill={['#10B981', '#F59E0B', '#EF4444'][index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              {chartData.matchDistribution.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ['#10B981', '#F59E0B', '#EF4444'][i] }} />
                  <span style={{ color: 'var(--text-tertiary)' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <GlassCard padding="24px">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} style={{ color: 'var(--mint)' }} />
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentActivity.slice(0, 5).map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: i < 4 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <StatusBadge status={item.status} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.action}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{item.dataset}</div>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{item.time}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Matching Jobs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <GlassCard padding="24px">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} style={{ color: 'var(--mint)' }} />
              Matching Jobs
            </h3>
            {matchingJobs.map((job, i) => (
              <div key={i} style={{
                padding: '10px 0',
                borderBottom: i < matchingJobs.length - 1 ? '1px solid var(--border-secondary)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{job.id}</span>
                  <StatusBadge status={job.status} />
                </div>
                <div className="progress-bar" style={{ height: 4 }}>
                  <div className="progress-bar-fill" style={{ width: `${job.progress}%` }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {job.dataset} • {job.matches > 0 ? `${job.matches} matches` : job.status}
                </div>
              </div>
            ))}
          </GlassCard>
        </motion.div>

        {/* System Health */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <GlassCard padding="24px">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} style={{ color: 'var(--mint)' }} />
              System Health
            </h3>
            {systemHealth.map((service, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < systemHealth.length - 1 ? '1px solid var(--border-secondary)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--success)',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
                  }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{service.service}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                    {service.latency}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 600 }}>
                    {service.uptime}
                  </span>
                </div>
              </div>
            ))}
          </GlassCard>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
