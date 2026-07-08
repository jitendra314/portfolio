import { AlertTriangle } from 'lucide-react'

/**
 * Generic confirm dialog.
 * Props: open, title, message, confirmLabel, variant (danger|warning), onConfirm, onCancel, loading
 */
export default function ConfirmDialog({
  open, title = 'Are you sure?', message,
  confirmLabel = 'Confirm', variant = 'danger',
  onConfirm, onCancel, loading,
}) {
  if (!open) return null

  const btnClass = variant === 'danger' ? 'btn-danger' : 'btn btn-primary'

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={18} color={variant === 'danger' ? 'var(--red)' : 'var(--amber)'} />
            <h2>{title}</h2>
          </div>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-2)', lineHeight: 1.65 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-outline">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`btn ${btnClass}`}>
            {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Working…</> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
