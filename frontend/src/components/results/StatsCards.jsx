import Card from '../ui/Card'

export default function StatsCards({ results }) {
  const stats = [
    { label: 'Total Records', value: results.total_records },
    { label: 'Clusters Found', value: results.total_clusters },
    { label: 'Noise / Outliers', value: results.noise_count },
    {
      label: 'Largest Cluster',
      value: results.clusters[0]?.count ?? 0,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
        </Card>
      ))}
    </div>
  )
}
