import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Upload, Database, Cpu, FlaskConical,
  ClipboardList, ScrollText, ShieldCheck, Settings,
  ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/app/upload', icon: Upload, label: 'Dataset Upload' },
  { path: '/app/registry', icon: Database, label: 'Dataset Registry' },
  { path: '/app/matching', icon: Cpu, label: 'Matching Engine' },
  { path: '/app/trials', icon: FlaskConical, label: 'Clinical Trials' },
  { path: '/app/results', icon: ClipboardList, label: 'Results' },
  { path: '/app/demo', icon: ShieldCheck, label: 'FHE Demo' },
  { path: '/app/audit', icon: ScrollText, label: 'Audit Logs' },
  { path: '/app/access', icon: ShieldCheck, label: 'Access Control' },
  { path: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        height: '100vh',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-secondary)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 'var(--z-sticky)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '1px solid var(--border-secondary)',
        minHeight: 64,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src="/logo.jpeg" alt="Vitalis Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          {!collapsed && (
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: '1.2rem',
              letterSpacing: '0.35em',
              background: 'linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              marginLeft: '4px'
            }}>
              Vitalis
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: collapsed ? '12px 8px' : '12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--mint)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                position: 'relative',
              })}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-end',
          color: 'var(--text-tertiary)',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--mint)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </motion.aside>
  );
}
