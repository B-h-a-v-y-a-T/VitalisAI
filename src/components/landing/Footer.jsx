import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-secondary)',
      padding: '60px 0 40px',
      background: 'var(--bg-secondary)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 48,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '24px' }}>
              <img src="/logo.jpeg" alt="Vitalis Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: '1.4rem',
                letterSpacing: '0.35em',
                background: 'linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                marginLeft: '4px'
              }}>
                Vitalis
              </span>
            </Link>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-tertiary)',
              lineHeight: 1.7,
              maxWidth: 300,
            }}>
              Privacy-preserving clinical trial matching powered by Fully Homomorphic Encryption.
              Your data is never exposed.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 20 }}>
              Product
            </h4>
            {['Features', 'How It Works', 'Architecture', 'Security', 'Pricing'].map(link => (
              <a key={link} href="#" style={{
                display: 'block',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--mint)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 20 }}>
              Company
            </h4>
            {['About', 'Blog', 'Careers', 'Contact', 'Partners'].map(link => (
              <a key={link} href="#" style={{
                display: 'block',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--mint)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 20 }}>
              Legal
            </h4>
            {['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'GDPR', 'Security Audit'].map(link => (
              <a key={link} href="#" style={{
                display: 'block',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--mint)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border-secondary)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            © 2025 Vitalis AI. All rights reserved.
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Built with Fhenix CoFHE • Zero Raw Data Exposure
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
