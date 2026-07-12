import { useState, useEffect, useCallback } from 'react'
import { loginUser } from './services/api'
import { useNavigate, Link } from 'react-router-dom'
import bgVideo from '../assets/Driver_showing_phone.mp4'

// ─── Toast Component ───────────────────────────────────────────────────────────
function Toast({ message, type = 'error', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const styles = {
    error: 'bg-rose-600 border-rose-500',
    success: 'bg-emerald-600 border-emerald-500',
    warning: 'bg-amber-500 border-amber-400',
  }

  const icons = { error: '⚠', success: '✓', warning: '!' }

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl border shadow-2xl text-white text-sm font-semibold max-w-sm ${styles[type]}`}
      style={{ animation: 'slideInRight 0.3s ease-out' }}
    >
      <span className="text-base shrink-0 mt-0.5 font-black">{icons[type]}</span>
      <div className="flex-1 leading-snug">{message}</div>
      <button
        onClick={onDismiss}
        className="shrink-0 opacity-70 hover:opacity-100 text-white text-lg leading-none transition-opacity"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

const inputCls =
  'w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 font-semibold text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all'

// ─── Main Login Component ─────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await loginUser(form)
      const user = response.data.user

      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(user))

      showToast('Authentication successful. Redirecting…', 'success')

      setTimeout(() => {
        if (user.role === 'ADMIN') navigate('/admin')
        else if (user.role === 'OFFICER') navigate('/officer')
        else navigate('/driver')
      }, 800)

    } catch (err) {
      const status = err.response?.status
      const serverMsg = err.response?.data?.message || err.response?.data?.error

      if (status === 401) {
        showToast(serverMsg || 'Invalid credentials. Please check your email and password.', 'error')
      } else if (status === 403) {
        showToast(serverMsg || 'Access denied. Your account may be suspended.', 'error')
      } else if (status >= 500) {
        showToast(serverMsg || 'Server error. Please try again in a few moments.', 'error')
      } else {
        showToast(serverMsg || 'Authentication failed. Please verify your credentials.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Toast Notification ── */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}

      {/* ── Full-viewport, zero-scroll container ── */}
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden relative px-4">

        {/* Background Video */}
        <video
          autoPlay muted loop playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ opacity: 0.25, filter: 'brightness(0.4) contrast(1.2) scale(1.02)' }}
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* Ambient gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-emerald-950/20 z-0" />

        {/* ── Login Card ── */}
        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-10">

          {/* Top bar: secure badge + SSL label */}
          <div className="flex justify-between items-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SECURE LINK ACTIVE
            </div>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              🛡️ SSL (AES-256)
            </span>
          </div>

          {/* Brand logo */}
          <div className="text-center mb-8 space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              re<span className="text-brand-primary">Verify</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Driver Access Portal
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Email Address
              </label>
              <input
                id="login-email"
                className={inputCls}
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="text-[10px] text-brand-primary hover:text-brand-medium font-bold transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="login-password"
                className={inputCls}
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={loading || !form.email || !form.password}
              className="w-full py-4 bg-brand-primary hover:bg-brand-medium disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg active:scale-[0.98] text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <span className="relative bg-white px-3 text-[9px] text-slate-400 font-mono uppercase tracking-widest">
              authorized system only
            </span>
          </div>

          {/* Footer links */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-primary hover:text-brand-medium font-bold underline">
                Register as Driver
              </Link>
            </p>
            <a
              href="/officer-portal"
              className="text-[10px] text-slate-400 hover:text-brand-primary font-semibold transition-colors flex items-center gap-1 group"
            >
              🛡️ Are you an Officer?{' '}
              <span className="underline underline-offset-2 group-hover:no-underline">
                Sign in via Official Portal →
              </span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </>
  )
}