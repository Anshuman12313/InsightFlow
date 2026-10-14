const steps = ['Upload CSV', 'Select Columns', 'Process Data', 'View Results']

export default function StepIndicator({ currentStep }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isActive = currentStep === stepNumber
        const isComplete = currentStep > stepNumber

        return (
          <li
            key={label}
            className={`rounded-xl border px-4 py-3 ${
              isActive
                ? 'border-indigo-300 bg-indigo-50'
                : isComplete
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-slate-200 bg-white'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Step {stepNumber}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">{label}</p>
          </li>
        )
      })}
    </ol>
  )
}
