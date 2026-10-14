import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../ui/Card'

const COLORS = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#db2777', '#7c3aed', '#2563eb']

export default function ClusterCharts({ clusters, noiseCount }) {
  const barData = clusters.slice(0, 10).map((cluster) => ({
    name: cluster.issue || `Cluster ${cluster.cluster}`,
    count: cluster.count,
  }))

  const pieData = [
    ...clusters.slice(0, 6).map((cluster) => ({
      name: cluster.issue || `Cluster ${cluster.cluster}`,
      value: cluster.count,
    })),
    ...(noiseCount > 0 ? [{ name: 'Noise / Outliers', value: noiseCount }] : []),
  ]

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title="Top cluster sizes" description="Bar chart of the largest identified issues.">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Cluster distribution" description="Share of records across major clusters.">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
