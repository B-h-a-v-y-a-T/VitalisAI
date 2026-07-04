import { motion } from 'framer-motion';

export default function GradientButton({
  children,
  onClick,
  size = 'md',
  variant = 'primary',
  icon: Icon,
  className = '',
  disabled = false,
  style = {},
  ...props
}) {
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '0.8rem' },
    md: { padding: '12px 24px', fontSize: '0.9rem' },
    lg: { padding: '16px 32px', fontSize: '1rem' },
    xl: { padding: '20px 40px', fontSize: '1.1rem' },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #0F6E6A 0%, #14B8A6 100%)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(45, 212, 191, 0.3)',
    },
    secondary: {
      background: 'var(--bg-glass)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-primary)',
      backdropFilter: 'blur(10px)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--mint)',
      border: '1px solid var(--mint)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
  };

  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        borderRadius: '14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: 'none',
        fontFamily: 'var(--font-primary)',
        letterSpacing: '-0.01em',
        transition: 'all 0.25s ease',
        whiteSpace: 'nowrap',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      whileHover={!disabled ? {
        y: -2,
        boxShadow: variant === 'primary'
          ? '0 8px 25px rgba(45, 212, 191, 0.4)'
          : '0 4px 15px rgba(0, 0, 0, 0.1)',
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </motion.button>
  );
}
