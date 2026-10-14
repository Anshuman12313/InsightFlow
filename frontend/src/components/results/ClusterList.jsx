import { formatPercent } from '../../utils/format'
import Card from '../ui/Card'

export default function ClusterList({ clusters, totalRecords, selectedClusterId, onSelectCluster }) {
  return (
    <Card title="Clusters" description="Sorted by size. Click a cluster to inspect details.">
      <div className="space-y-3">
        {clusters.map((cluster) => {
          const isSelected = selectedClusterId === cluster.cluster

          return (
            <button
              key={cluster.cluster}
              type="button"
              onClick={() => onSelectCluster(cluster.cluster)}
              className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                isSelected
                  ? 'border-indigo-300 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">
                    {cluster.issue || `Cluster ${cluster.cluster}`}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Cluster ID: {cluster.cluster}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-900">{cluster.count}</p>
                  <p className="text-xs text-slate-500">
                    {formatPercent(cluster.count, totalRecords)}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
