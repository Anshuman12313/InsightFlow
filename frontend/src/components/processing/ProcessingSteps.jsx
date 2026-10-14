import Spinner from '../ui/Spinner'

const processingSteps = [
  'Cleaning text and removing empty rows',
  'Generating sentence embeddings',
  'Reducing dimensions with UMAP',
  'Clustering feedback with HDBSCAN',
  'Generating issue labels with LLM',
]

export default function ProcessingSteps({ activeStep = 0 }) {
  return (
    <div className="space-y-6">
      <Spinner label="Processing your feedback data. This may take a few minutes..." />

      <ol className="space-y-3">
        {processingSteps.map((step, index) => {
          const isActive = index === activeStep
          const isComplete = index < activeStep

          return (
            <li
              key={step}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                isActive
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-900'
                  : isComplete
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : isComplete
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isComplete ? '✓' : index + 1}
              </span>
              <span>{step}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
