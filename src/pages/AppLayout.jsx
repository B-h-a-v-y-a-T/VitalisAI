import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/app/Sidebar';
import TopBar from '../components/app/TopBar';
import TwoFactorPrompt from '../components/app/TwoFactorPrompt';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const { isAuthenticated, is2FAEnabled, is2FAVerified } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show 2FA prompt if 2FA is enabled but not yet verified
  if (is2FAEnabled && !is2FAVerified) {
    return <TwoFactorPrompt />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <TopBar />

        <main style={{
          flex: 1,
          padding: 32,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}
