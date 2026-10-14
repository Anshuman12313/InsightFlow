export default function Alert({ type = 'error', message, onClose }) {
  const styles = {
    error: 'border-red-200 bg-red-50 text-red-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  }

  if (!message) {
    return null
  }

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      <div className="flex items-start justify-between gap-3">
        <p>{message}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="font-medium opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}
