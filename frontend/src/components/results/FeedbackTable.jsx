import { useMemo, useState } from 'react'
import { truncateText } from '../../utils/format'
import Card from '../ui/Card'

export default function FeedbackTable({ records, clusters }) {
  const [search, setSearch] = useState('')
  const [clusterFilter, setClusterFilter] = useState('all')
  const [sortBy, setSortBy] = useState('cluster-desc')

  const clusterMap = useMemo(
    () =>
      clusters.reduce((map, cluster) => {
        map[cluster.cluster] = cluster.issue
        return map
      }, {}),
    [clusters],
  )

  const filteredRecords = useMemo(() => {
    let nextRecords = [...records]

    if (search.trim()) {
      const query = search.trim().toLowerCase()
      nextRecords = nextRecords.filter((record) => record.text.toLowerCase().includes(query))
    }

    if (clusterFilter !== 'all') {
      nextRecords = nextRecords.filter((record) => String(record.cluster) === clusterFilter)
    }

    nextRecords.sort((left, right) => {
      if (sortBy === 'text-asc') {
        return left.text.localeCompare(right.text)
      }

      if (sortBy === 'cluster-desc') {
        return right.cluster - left.cluster
      }

      return left.cluster - right.cluster
    })

    return nextRecords.slice(0, 100)
  }, [records, search, clusterFilter, sortBy])

  return (
    <Card
      title="Search and filter feedback"
      description="Inspect individual records. Showing up to 100 matching entries."
    >
      <div className="mb-4 grid gap-3 lg:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search feedback text..."
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
        />

        <select
          value={clusterFilter}
          onChange={(event) => setClusterFilter(event.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">All clusters</option>
          <option value="-1">Noise / outliers</option>
          {clusters.map((cluster) => (
            <option key={cluster.cluster} value={String(cluster.cluster)}>
              {cluster.issue || `Cluster ${cluster.cluster}`}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="cluster-desc">Sort by cluster (high to low)</option>
          <option value="cluster-asc">Sort by cluster (low to high)</option>
          <option value="text-asc">Sort by text (A-Z)</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-2 font-medium">Feedback</th>
              <th className="px-3 py-2 font-medium">Cluster</th>
              <th className="px-3 py-2 font-medium">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={`${record.text}-${index}`} className="border-b border-slate-100 align-top">
                <td className="max-w-xl px-3 py-3 text-slate-700">{truncateText(record.text, 180)}</td>
                <td className="px-3 py-3 text-slate-700">
                  {record.cluster === -1
                    ? 'Noise'
                    : clusterMap[record.cluster] || `Cluster ${record.cluster}`}
                </td>
                <td className="px-3 py-3 text-slate-500">
                  {record.metadata
                    ? Object.entries(record.metadata)
                        .map(([key, value]) => `${key}: ${value ?? '—'}`)
                        .join(' | ')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
