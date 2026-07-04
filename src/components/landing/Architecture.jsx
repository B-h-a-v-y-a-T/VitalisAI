import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Monitor, Server, Shield, FileCode, Building2 } from 'lucide-react';
import GlassCard from '../shared/GlassCard';

const nodes = [
  { id: 'browser', icon: Monitor, label: 'Hospital Browser', desc: 'Client-side encryption, dataset upload, key management', x: '50%', y: '8%' },
  { id: 'api', icon: Server, label: 'Matching API', desc: 'Receives encrypted datasets, orchestrates matching jobs', x: '50%', y: '30%' },
  { id: 'cofhe', icon: Shield, label: 'Fhenix CoFHE', desc: 'Fully homomorphic encryption engine, computation on ciphertext', x: '25%', y: '55%' },
  { id: 'contract', icon: FileCode, label: 'Smart Contract', desc: 'On-chain audit trail, immutable verification records', x: '75%', y: '55%' },
  { id: 'sponsor', icon: Building2, label: 'Sponsor', desc: 'Receives encrypted match results, no access to raw data', x: '50%', y: '80%' },
];

const connections = [
  { from: 'browser', to: 'api' },
  { from: 'api', to: 'cofhe' },
  { from: 'api', to: 'contract' },
  { from: 'cofhe', to: 'sponsor' },
  { from: 'contract', to: 'sponsor' },
];

export default function Architecture() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <section id="architecture" ref={ref} className="section-spacing-lg">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <span style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--mint)',
            marginBottom: 12,
          }}>
            Architecture
          </span>
          <h2 className="heading-2" style={{ marginBottom: 16 }}>
            Privacy-First{' '}
            <span className="text-gradient">System Architecture</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto',
          }}>
            Every component designed to ensure zero raw data exposure throughout the pipeline.
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            position: 'relative',
            maxWidth: 800,
            height: 520,
            margin: '0 auto',
          }}
        >
          {/* SVG Connections */}
          <svg style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}>
            {connections.map((conn, i) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              return (
                <motion.line
                  key={i}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="var(--mint)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.3 } : {}}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(45, 212, 191, 0.3))' }}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node, i) => {
            const Icon = node.icon;
            const isHovered = hoveredNode === node.id;
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.15 }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                }}
              >
                <GlassCard
                  padding="16px 20px"
                  glow={isHovered}
                  hover
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    minWidth: 140,
                    transition: 'all 0.3s ease',
                    borderColor: isHovered ? 'var(--mint)' : undefined,
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(45, 212, 191, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                    <Icon size={22} style={{ color: 'var(--mint)' }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>
                    {node.label}
                  </span>
                  <motion.p
                    animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-tertiary)',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      maxWidth: 160,
                    }}
                  >
                    {node.desc}
                  </motion.p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
