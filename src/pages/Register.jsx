import { useState, useEffect, useCallback } from 'react'
import { registerUser, verifyNINExternal } from './services/api'
import { useNavigate, Link } from 'react-router-dom'

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
      className={`fixed top-5 right-5 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl border shadow-2xl text-white text-sm font-semibold max-w-sm animate-slideInRight ${styles[type]}`}
      style={{ animation: 'slideInRight 0.3s ease-out' }}
    >
      <span className="text-base shrink-0 mt-0.5 font-black">{icons[type]}</span>
      <div className="flex-1 leading-snug">{message}</div>
      <button
        onClick={onDismiss}
        className="shrink-0 opacity-70 hover:opacity-100 text-white text-lg leading-none transition-opacity"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

// ─── Password Strength ─────────────────────────────────────────────────────────
function getPasswordStrength(pass) {
  if (!pass) return { score: 0, label: '', color: 'bg-slate-200' }
  let score = 0
  if (pass.length >= 8) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' }
  if (score === 2) return { score: 2, label: 'Moderate', color: 'bg-amber-500' }
  if (score === 3) return { score: 3, label: 'Strong', color: 'bg-emerald-500' }
  return { score: 4, label: 'Very Secure', color: 'bg-teal-500' }
}

// ─── Input Field ───────────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[9px] text-slate-400 font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 font-medium text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all'

// ─── Main Register Component ──────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '',
    email: '', phoneNumber: '', nin: '', password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [verifyingNIN, setVerifyingNIN] = useState(false)
  const [ninVerified, setNinVerified] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const strength = getPasswordStrength(form.password)

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  const handleVerifyNIN = async () => {
    if (!/^\d{11}$/.test(form.nin)) {
      showToast('NIN must be exactly 11 numeric digits.', 'warning')
      return
    }
    setVerifyingNIN(true)
    try {
      const res = await verifyNINExternal(form.nin)
      if (res.data?.status === 'success' || res.data?.data) {
        const data = res.data.data
        setForm(prev => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
        }))
        setNinVerified(true)
        showToast('Identity verified against National Database.', 'success')
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || 'NIN verification failed. Check the 11-digit NIN and retry.',
        'error'
      )
    } finally {
      setVerifyingNIN(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!ninVerified) {
      showToast('You must verify your NIN identity before registering.', 'warning')
      return
    }
    if (form.password !== confirmPassword) {
      showToast('Passwords do not match.', 'warning')
      return
    }
    if (strength.score < 2) {
      showToast('Password is too weak. Use at least 8 characters with numbers and uppercase.', 'warning')
      return
    }

    setLoading(true)
    try {
      const response = await registerUser(form)
      const { access_token, user } = response.data ?? {}

      if (access_token && user) {
        // Backend returned a session immediately — store it and route by role
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(user))
        showToast('Account created! Redirecting to your dashboard…', 'success')
        setTimeout(() => {
          if (user.role === 'ADMIN') navigate('/admin')
          else if (user.role === 'OFFICER') navigate('/officer')
          else navigate('/driver')
        }, 1000)
      } else {
        // Backend returned success but no session token — send to login
        showToast('Account created! Please sign in to continue.', 'success')
        setTimeout(() => navigate('/login'), 1500)
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      showToast(serverMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const passwordMatch = confirmPassword && form.password === confirmPassword
  const passwordMismatch = confirmPassword && form.password !== confirmPassword

  return (
    <>
      {/* ── Toast Notification ── */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}

      {/* ── Full-viewport, zero-scroll container ── */}
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden relative px-4">

        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 z-0" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-accent/5 blur-3xl pointer-events-none" />

        {/* ── Register Card ── */}
        <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">

          {/* Card grid: Left branding panel + Right form panel */}
          <div className="flex min-h-0">

            {/* ── Left Panel: Brand / Identity ── */}
            <div className="hidden lg:flex flex-col justify-between w-72 shrink-0 bg-gradient-to-b from-brand-primary to-brand-dark p-8 text-white">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold font-mono mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                  SECURE LINK ACTIVE
                </div>
                <h1 className="text-3xl font-black tracking-tight leading-tight mb-2">
                  re<span className="text-brand-accent">Verify</span>
                </h1>
                <p className="text-xs text-white/60 font-mono tracking-widest uppercase mb-6">
                  Driver Portal
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  Register your driver credentials for Roadside Vehicle & Document Verification access.
                </p>
              </div>

              {/* Steps guide */}
              <div className="space-y-3">
                {[
                  { step: '01', label: 'Verify NIN Identity' },
                  { step: '02', label: 'Complete Profile' },
                  { step: '03', label: 'Set Secure Password' },
                ].map(({ step, label }) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-black font-mono text-brand-accent shrink-0">
                      {step}
                    </span>
                    <span className="text-xs text-white/70 font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Officer portal cross-link */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-2">
                  Enforcement Personnel?
                </p>
                <a
                  href="/officer-portal"
                  className="text-xs text-brand-accent hover:text-white font-semibold flex items-center gap-1.5 transition-colors group"
                >
                  <span className="w-4 h-4 rounded border border-brand-accent/40 group-hover:border-white/40 flex items-center justify-center text-[8px] transition-colors">🛡</span>
                  Officer Official Portal →
                </a>
              </div>
            </div>

            {/* ── Right Panel: Registration Form ── */}
            <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: '100vh' }}>

              {/* Mobile header (only visible on small screens) */}
              <div className="lg:hidden flex justify-between items-center mb-4">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  re<span className="text-brand-primary">Verify</span>
                </h1>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SECURE
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-black text-slate-900">Create Driver Account</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  All fields are required. NIN verification is mandatory.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* ── Row 1: NIN Verification (full width) ── */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      NIN Identity Verification
                    </label>
                    <span className="text-[9px] text-slate-400 font-mono">11-digit National ID</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 font-mono text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all disabled:opacity-60"
                      name="nin"
                      placeholder="Enter 11-digit NIN"
                      value={form.nin}
                      onChange={handleChange}
                      maxLength="11"
                      required
                      disabled={ninVerified}
                    />
                    <button
                      type="button"
                      id="btn-verify-nin"
                      onClick={handleVerifyNIN}
                      disabled={verifyingNIN || ninVerified || form.nin.length !== 11}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-brand-primary hover:bg-brand-medium disabled:opacity-40 transition-all min-w-[80px] shrink-0"
                    >
                      {verifyingNIN ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                          Checking
                        </span>
                      ) : ninVerified ? '✓ Done' : 'Verify'}
                    </button>
                  </div>
                  {ninVerified && (
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                      ✓ Identity matched against National Database
                    </p>
                  )}
                </div>

                {/* ── Row 2: Name grid (2-col) ── */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="First Name">
                    <input className={inputCls} name="firstName" placeholder="First name"
                      value={form.firstName} onChange={handleChange} required />
                  </Field>
                  <Field label="Last Name">
                    <input className={inputCls} name="lastName" placeholder="Last name"
                      value={form.lastName} onChange={handleChange} required />
                  </Field>
                </div>

                {/* ── Row 3: Username + Phone (2-col) ── */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Username">
                    <input className={inputCls} name="username" placeholder="e.g. john_driver"
                      value={form.username} onChange={handleChange} required />
                  </Field>
                  <Field label="Phone Number">
                    <input className={inputCls} name="phoneNumber" placeholder="+2348012345678"
                      value={form.phoneNumber} onChange={handleChange} required />
                  </Field>
                </div>

                {/* ── Row 4: Email (full width) ── */}
                <div className="mb-3">
                  <Field label="Email Address">
                    <input className={inputCls} name="email" type="email" placeholder="you@example.com"
                      value={form.email} onChange={handleChange} required />
                  </Field>
                </div>

                {/* ── Row 5: Password + Confirm (2-col) ── */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Password">
                    <input className={inputCls} name="password" type="password" placeholder="••••••••••"
                      value={form.password} onChange={handleChange} required />
                  </Field>
                  <Field label="Confirm Password">
                    <div className="relative">
                      <input
                        className={`${inputCls} pr-8 ${passwordMismatch ? 'border-rose-400 focus:border-rose-400' : ''} ${passwordMatch ? 'border-emerald-400 focus:border-emerald-400' : ''}`}
                        type="password" placeholder="••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      {passwordMatch && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-xs font-black">✓</span>
                      )}
                      {passwordMismatch && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500 text-xs font-black">✗</span>
                      )}
                    </div>
                  </Field>
                </div>

                {/* ── Password strength bar ── */}
                {form.password && (
                  <div className="mb-4 space-y-1">
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${strength.color}`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Strength: <span className="font-bold text-slate-600">{strength.label}</span>
                    </p>
                  </div>
                )}

                {/* ── Submit Button ── */}
                <button
                  id="btn-register-submit"
                  type="submit"
                  disabled={loading || !ninVerified || passwordMismatch}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-medium disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg active:scale-[0.98] text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account…
                    </span>
                  ) : 'Register Driver Account'}
                </button>

                {/* ── Footer links ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Already registered?{' '}
                    <Link to="/login" className="text-brand-primary hover:text-brand-medium font-bold underline">
                      Sign In
                    </Link>
                  </p>
                  <a
                    href="/officer-portal"
                    className="text-[10px] text-slate-400 hover:text-brand-primary font-semibold transition-colors flex items-center gap-1"
                  >
                    🛡️ Officer Sign-In Portal →
                  </a>
                </div>
              </form>
            </div>
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