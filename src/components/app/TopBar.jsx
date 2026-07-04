import { useState } from 'react';
import { Search, Bell, User, Command } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';

export default function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header style={{
      height: 64,
      borderBottom: '1px solid var(--border-secondary)',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
    }}>
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 'var(--radius-md)',
        background: searchFocused ? 'var(--bg-elevated)' : 'var(--input-bg)',
        border: `1px solid ${searchFocused ? 'var(--mint)' : 'var(--input-border)'}`,
        transition: 'all 0.2s ease',
        width: 360,
        maxWidth: '40%',
        boxShadow: searchFocused ? '0 0 0 3px rgba(45, 212, 191, 0.1)' : 'none',
      }}>
        <Search size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <input
          placeholder="Search datasets, trials, results..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            flex: 1,
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
          }}
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '2px 6px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-tertiary)',
          fontSize: '0.65rem',
          color: 'var(--text-tertiary)',
          fontWeight: 600,
        }}>
          <Command size={10} /> K
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ThemeToggle size={16} />

        {/* Notifications */}
        <button style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.2s',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(45, 212, 191, 0.08)';
          e.currentTarget.style.color = 'var(--mint)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--mint)',
            border: '2px solid var(--bg-primary)',
          }} />
        </button>

        {/* Profile */}
        <button style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--teal), var(--mint))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          marginLeft: 4,
        }}>
          <User size={16} color="#fff" />
        </button>
      </div>
    </header>
  );
}
