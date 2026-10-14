import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import { checkHealth } from '../services/api'
import { loadResults } from '../utils/storage'

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState('checking')
  const [savedResults, setSavedResults] = useState(null)

  useEffect(() => {
    async function fetchStatus() {
      try {
        await checkHealth()
        setApiStatus('online')
      } catch {
        setApiStatus('offline')
      }
    }

    fetchStatus()
    setSavedResults(loadResults())
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Feedback Clustering
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          Turn customer feedback into actionable issue groups
        </h2>
        <p className="mt-4 max-w-3xl text-base text-slate-600">
          Upload a CSV of complaints or comments, choose the feedback column, and let the
          backend clean the text, generate embeddings, cluster similar feedback with HDBSCAN,
          and summarize each cluster into a common issue.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/analyze">
            <Button>Upload CSV and Analyze</Button>
          </Link>
          {savedResults && (
            <Link to="/results">
              <Button variant="secondary">View Last Results</Button>
            </Link>
          )}
        </div>
      </section>

      {apiStatus === 'offline' && (
        <Alert
          type="error"
          message="Backend is offline. Start FastAPI with: uvicorn main:app --reload"
        />
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="1. Upload CSV">
          <p className="text-sm text-slate-600">
            Drag and drop a CSV file or pick one from your computer. The backend reads column names
            and validates the file.
          </p>
        </Card>

        <Card title="2. Select columns">
          <p className="text-sm text-slate-600">
            Choose the feedback text column and optional metadata columns such as product, region,
            or sentiment.
          </p>
        </Card>

        <Card title="3. Explore clusters">
          <p className="text-sm text-slate-600">
            Review cluster sizes, generated issue labels, charts, and searchable feedback records.
          </p>
        </Card>
      </div>

      {savedResults && (
        <Card title="Latest session">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">File</p>
              <p className="mt-1 font-medium text-slate-900">{savedResults.filename}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Records analyzed</p>
              <p className="mt-1 font-medium text-slate-900">{savedResults.total_records}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Clusters found</p>
              <p className="mt-1 font-medium text-slate-900">{savedResults.total_clusters}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Top issue</p>
              <p className="mt-1 font-medium text-slate-900">
                {savedResults.clusters[0]?.issue || '—'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
