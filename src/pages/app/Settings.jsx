import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Wallet, Bell, Building2, Key, Shield, Check } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GradientButton from '../../components/shared/GradientButton';
import { useTheme } from '../../context/ThemeContext';

const tabs = [
  { id: 'theme', icon: Palette, label: 'Theme' },
  { id: 'wallet', icon: Wallet, label: 'Wallet' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'organization', icon: Building2, label: 'Organization' },
  { id: 'api', icon: Key, label: 'API Keys' },
  { id: 'security', icon: Shield, label: 'Security' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('theme');
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Configure your platform preferences, wallet, and security settings.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Tab Navigation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard padding="8px" hover={false}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--mint)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </GlassCard>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {activeTab === 'theme' && (
            <GlassCard padding="32px">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>Appearance</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {['light', 'dark'].map(t => (
                  <button
                    key={t}
                    onClick={theme !== t ? toggleTheme : undefined}
                    style={{
                      width: 160,
                      padding: 20,
                      borderRadius: 'var(--radius-lg)',
                      border: `2px solid ${theme === t ? 'var(--mint)' : 'var(--border-primary)'}`,
                      background: t === 'dark' ? '#0A1A20' : '#F8FAFB',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.3s',
                    }}
                  >
                    {theme === t && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'var(--mint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check size={12} color="#fff" />
                      </div>
                    )}
                    <div style={{
                      width: '100%',
                      height: 60,
                      borderRadius: 'var(--radius-sm)',
                      background: t === 'dark'
                        ? 'linear-gradient(135deg, #0E252D, #0A1A20)'
                        : 'linear-gradient(135deg, #fff, #F1F5F7)',
                      border: `1px solid ${t === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      marginBottom: 12,
                    }} />
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: t === 'dark' ? '#F1F5F7' : '#0A2E36',
                      textTransform: 'capitalize',
                    }}>
                      {t} Mode
                    </span>
                  </button>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === 'wallet' && (
            <GlassCard padding="32px">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>Wallet Connection</h3>
              <div style={{
                padding: 20,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                marginBottom: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Connected Wallet</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>
                      0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68
                    </div>
                  </div>
                  <span className="badge badge-success">Connected</span>
                </div>
              </div>
              <GradientButton variant="secondary" icon={Wallet}>Change Wallet</GradientButton>
            </GlassCard>
          )}

          {activeTab === 'notifications' && (
            <GlassCard padding="32px">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>Notification Preferences</h3>
              {[
                { label: 'Encryption Complete', desc: 'When a dataset finishes encryption', enabled: true },
                { label: 'Matching Complete', desc: 'When a matching job finishes', enabled: true },
                { label: 'Access Requests', desc: 'When a new access request is made', enabled: true },
                { label: 'Audit Alerts', desc: 'When an unusual audit event occurs', enabled: false },
              ].map((pref, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: i < 3 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{pref.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{pref.desc}</div>
                  </div>
                  <div style={{
                    width: 44,
                    height: 24,
                    borderRadius: 'var(--radius-full)',
                    background: pref.enabled ? 'var(--mint)' : 'var(--bg-tertiary)',
                    padding: 2,
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                  }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      transform: pref.enabled ? 'translateX(20px)' : 'translateX(0)',
                      transition: 'transform 0.3s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                </div>
              ))}
            </GlassCard>
          )}

          {activeTab === 'organization' && (
            <GlassCard padding="32px">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>Organization</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Organization Name', value: 'Metro General Hospital' },
                  { label: 'Type', value: 'Hospital / Healthcare Provider' },
                  { label: 'Region', value: 'North America' },
                  { label: 'HIPAA Status', value: 'Compliant' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <input className="input" defaultValue={field.value} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <GradientButton>Save Changes</GradientButton>
              </div>
            </GlassCard>
          )}

          {activeTab === 'api' && (
            <GlassCard padding="32px">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>API Keys</h3>
              <div style={{
                padding: 16,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Production Key</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>sk_live_•••••••••••••••••••••••••</div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <GradientButton variant="secondary" icon={Key}>Generate New Key</GradientButton>
            </GlassCard>
          )}

          {activeTab === 'security' && (
            <GlassCard padding="32px">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>Security Settings</h3>
              {[
                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', status: 'Enabled' },
                { label: 'Session Timeout', desc: 'Auto-logout after inactivity', status: '30 minutes' },
                { label: 'IP Whitelisting', desc: 'Restrict access to specific IPs', status: 'Configured' },
                { label: 'Audit Log Retention', desc: 'How long audit logs are kept', status: '365 days' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: i < 3 ? '1px solid var(--border-secondary)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mint)' }}>{item.status}</span>
                </div>
              ))}
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}
