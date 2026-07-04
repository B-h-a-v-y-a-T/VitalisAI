import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Upload, Database, Cpu, FlaskConical,
  ClipboardList, ScrollText, ShieldCheck, Settings,
  ChevronLeft, ChevronRight, Shield, UserCheck, Compass,
} from 'lucide-react';
import ScrambleText from '../shared/ScrambleText';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/app/upload', icon: Upload, label: 'Dataset Upload' },
  { path: '/app/registry', icon: Database, label: 'Dataset Registry' },
  { path: '/app/matching', icon: Cpu, label: 'Matching Engine' },
  { path: '/app/trials', icon: FlaskConical, label: 'Clinical Trials' },
  { path: '/app/demo', icon: ShieldCheck, label: 'FHE Demo' },
  { path: '/app/feasibility', icon: Compass, label: 'Feasibility Estimator' },
  { path: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = !collapsed || isHovered;

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isExpanded ? 280 : 72 }}
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
        zIndex: 9999,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: !isExpanded ? '20px 16px' : '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '1px solid var(--border-secondary)',
        minHeight: 64,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="Vitalis Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          {isExpanded && (
            <ScrambleText 
              text="Vitalis AI"
              delay={300}
              duration={1300}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: '1.2rem',
                letterSpacing: '0.35em',
                background: 'linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                marginLeft: '4px'
              }}
            />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: !isExpanded ? '12px 8px' : '12px 12px',
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
                padding: !isExpanded ? '10px 0' : '10px 14px',
                justifyContent: !isExpanded ? 'center' : 'flex-start',
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
                {isExpanded && (
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
          justifyContent: !isExpanded ? 'center' : 'flex-end',
          color: 'var(--text-tertiary)',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--mint)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
      >
        {!isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </motion.aside>
  );
}
