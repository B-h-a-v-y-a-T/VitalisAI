import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  padding = 'var(--space-6)',
  style = {},
  onClick,
  ...props
}) {
  return (
    <motion.div
      className={`glass ${className}`}
      style={{
        padding,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      whileHover={hover ? {
        y: -4,
        boxShadow: glow
          ? '0 20px 40px rgba(0,0,0,0.1), 0 0 30px rgba(45, 212, 191, 0.15)'
          : '0 20px 40px rgba(0,0,0,0.1)',
        borderColor: 'rgba(45, 212, 191, 0.3)',
      } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
