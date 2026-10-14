import { formatPercent } from '../../utils/format'
import Card from '../ui/Card'

export default function ClusterDetail({ cluster, totalRecords }) {
  if (!cluster) {
    return (
      <Card title="Cluster details">
        <p className="text-sm text-slate-500">Select a cluster to view representative feedback.</p>
      </Card>
    )
  }

  return (
    <Card title="Cluster details">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Issue</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {cluster.issue || `Cluster ${cluster.cluster}`}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Records</p>
            <p className="mt-1 text-lg font-semibold">{cluster.count}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Share of total</p>
            <p className="mt-1 text-lg font-semibold">
              {formatPercent(cluster.count, totalRecords)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Cluster ID</p>
            <p className="mt-1 text-lg font-semibold">{cluster.cluster}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">Representative feedback</p>
          <ul className="mt-3 space-y-3">
            {cluster.comments.map((comment, index) => (
              <li
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
