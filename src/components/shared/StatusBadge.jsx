import { CheckCircle, Clock, AlertTriangle, XCircle, Lock, Loader, Shield, Zap } from 'lucide-react';

const statusConfig = {
  encrypted: { label: 'Encrypted', className: 'badge-success', icon: Lock },
  encrypting: { label: 'Encrypting', className: 'badge-info', icon: Loader },
  pending: { label: 'Pending', className: 'badge-neutral', icon: Clock },
  completed: { label: 'Completed', className: 'badge-success', icon: CheckCircle },
  processing: { label: 'Processing', className: 'badge-info', icon: Loader },
  queued: { label: 'Queued', className: 'badge-neutral', icon: Clock },
  eligible: { label: 'Eligible', className: 'badge-success', icon: CheckCircle },
  ineligible: { label: 'Ineligible', className: 'badge-error', icon: XCircle },
  review: { label: 'Review', className: 'badge-warning', icon: AlertTriangle },
  verified: { label: 'Verified', className: 'badge-success', icon: Shield },
  active: { label: 'Active', className: 'badge-success', icon: Zap },
  operational: { label: 'Operational', className: 'badge-success', icon: CheckCircle },
  degraded: { label: 'Degraded', className: 'badge-warning', icon: AlertTriangle },
  down: { label: 'Down', className: 'badge-error', icon: XCircle },
  success: { label: 'Success', className: 'badge-success', icon: CheckCircle },
  info: { label: 'Info', className: 'badge-info', icon: Zap },
  warning: { label: 'Warning', className: 'badge-warning', icon: AlertTriangle },
  error: { label: 'Error', className: 'badge-error', icon: XCircle },
  ready_to_decrypt: { label: 'Sealed', className: 'badge-warning', icon: Lock },
  decrypted: { label: 'Decrypted', className: 'badge-success', icon: CheckCircle },
};

export default function StatusBadge({ status, label, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`badge ${config.className}`}
      style={{
        fontSize: size === 'sm' ? '0.7rem' : '0.8rem',
        padding: size === 'sm' ? '2px 10px' : '4px 14px',
      }}
    >
      <Icon
        size={size === 'sm' ? 10 : 12}
        style={status === 'encrypting' || status === 'processing' ? { animation: 'rotate-slow 2s linear infinite' } : {}}
      />
      {label || config.label}
    </span>
  );
}
