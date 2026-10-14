import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/results', label: 'Results' },
]

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white lg:hidden">
      <div className="px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Feedback Insights
        </p>
        <h1 className="text-lg font-semibold text-slate-900">Cluster Dashboard</h1>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
