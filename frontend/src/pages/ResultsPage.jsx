import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ClusterCharts from '../components/results/ClusterCharts'
import ClusterDetail from '../components/results/ClusterDetail'
import ClusterList from '../components/results/ClusterList'
import FeedbackTable from '../components/results/FeedbackTable'
import StatsCards from '../components/results/StatsCards'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { loadResults } from '../utils/storage'

export default function ResultsPage() {
  const [results, setResults] = useState(null)
  const [selectedClusterId, setSelectedClusterId] = useState(null)

  useEffect(() => {
    const saved = loadResults()
    setResults(saved)
    if (saved?.clusters?.length) {
      setSelectedClusterId(saved.clusters[0].cluster)
    }
  }, [])

  const selectedCluster = useMemo(
    () => results?.clusters.find((cluster) => cluster.cluster === selectedClusterId) || null,
    [results, selectedClusterId],
  )

  if (!results) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Alert
          type="info"
          message="No analysis results found yet. Upload a CSV and run the pipeline first."
        />
        <Link to="/analyze">
          <Button>Go to Analyze</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Results dashboard</h2>
          <p className="mt-2 text-sm text-slate-600">
            Analysis for <span className="font-medium">{results.filename}</span> using column{' '}
            <span className="font-medium">{results.feedback_column}</span>
          </p>
        </div>
        <Link to="/analyze">
          <Button variant="secondary">Analyze another file</Button>
        </Link>
      </div>

      <StatsCards results={results} />
      <ClusterCharts clusters={results.clusters} noiseCount={results.noise_count} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ClusterList
          clusters={results.clusters}
          totalRecords={results.total_records}
          selectedClusterId={selectedClusterId}
          onSelectCluster={setSelectedClusterId}
        />
        <ClusterDetail cluster={selectedCluster} totalRecords={results.total_records} />
      </div>

      <FeedbackTable records={results.records || []} clusters={results.clusters} />

      <Card title="Common issues">
        <div className="grid gap-3 md:grid-cols-2">
          {results.clusters.map((cluster) => (
            <div
              key={cluster.cluster}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="font-medium text-slate-900">{cluster.issue}</p>
              <p className="mt-1 text-sm text-slate-500">{cluster.count} related records</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
