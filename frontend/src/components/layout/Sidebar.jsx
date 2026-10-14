import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/analyze', label: 'Analyze CSV' },
  { to: '/results', label: 'Results' },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Feedback Insights
        </p>
        <h1 className="mt-1 text-lg font-semibold text-slate-900">Cluster Dashboard</h1>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
