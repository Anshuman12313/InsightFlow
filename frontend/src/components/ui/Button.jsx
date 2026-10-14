export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:bg-slate-100',
    ghost: 'text-slate-600 hover:bg-slate-100',
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
