import { useState } from 'react'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    nin: user?.nin || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      // Simulate profile updates in local storage
      const updatedUser = { ...user, ...form }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      toast.success('Profile updated successfully')
      setLoading(false)
    }, 1000)
  }

  return (
    <Layout role={user?.role}>
      <div className="space-y-6 animate-fadeIn max-w-xl">
        
        {/* HEADER */}
        <header className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Manage your personal information and identity credentials.
          </p>
        </header>

        {/* PROFILE CARD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">First Name</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                  value={form.firstName} 
                  onChange={(e) => setForm({...form, firstName: e.target.value})}
                  required
                />
              </div>
              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                  value={form.lastName} 
                  onChange={(e) => setForm({...form, lastName: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                type="email"
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
              <input 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                value={form.phoneNumber} 
                onChange={(e) => setForm({...form, phoneNumber: e.target.value})}
                required
              />
            </div>

            {/* NIN (Read Only) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">National Identity Number (NIN)</label>
              <input 
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-sm cursor-not-allowed opacity-75 outline-none"
                value={form.nin} 
                disabled
              />
              <p className="text-[10px] text-slate-400 font-semibold">NIN cannot be modified once verified against the National database.</p>
            </div>

            <button 
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-medium text-white font-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg active:scale-[0.98] text-sm pt-3"
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
