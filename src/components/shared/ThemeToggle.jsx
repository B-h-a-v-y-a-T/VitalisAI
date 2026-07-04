import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ size = 20 }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-primary)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
      }}
      whileHover={{ scale: 1.05, borderColor: 'rgba(45, 212, 191, 0.3)' }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180, scale: theme === 'dark' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute' }}
      >
        <Moon size={size} style={{ color: 'var(--mint)' }} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : -180, scale: theme === 'light' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute' }}
      >
        <Sun size={size} style={{ color: 'var(--warning)' }} />
      </motion.div>
    </motion.button>
  );
}
