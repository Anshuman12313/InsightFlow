import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, LockKeyhole, UserRound, Layers3 } from 'lucide-react'
import { loginUser, getErrorMessage } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginUser(username.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-10 text-white md:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-2.5">
              <Layers3 size={25} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Commently
            </span>
          </div>

          <div className="py-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Feedback intelligence
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              Less noise.
              <br />
              More insight.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-blue-100">
              Turn thousands of customer comments into meaningful
              groups and discover the issues that matter most.
            </p>

            <div className="mt-8 space-y-4 text-sm text-blue-100">
              <p>✓ Discover similar feedback automatically</p>
              <p>✓ Identify recurring customer issues</p>
              <p>✓ Make better data-driven decisions</p>
            </div>
          </div>

          <p className="text-sm text-blue-200">
            Your feedback, organized into insights.
          </p>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 md:hidden">
              <div className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <div className="rounded-xl bg-blue-600 p-2 text-white">
                  <Layers3 size={22} />
                </div>
                Commently
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-5 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
                <LockKeyhole size={25} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue to your feedback workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-16 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <LogIn size={17} />}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Create account
              </Link>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              Secure access to your feedback workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}