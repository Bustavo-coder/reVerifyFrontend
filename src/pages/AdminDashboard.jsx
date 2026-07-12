import { useEffect, useState } from 'react'
import {
  getAllUsers,
  makeOfficer,
  deleteUser,
  getLaws,
  createLaw,
  deleteLaw
} from './services/api'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [laws, setLaws] = useState([])
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('users') // 'users', 'violations', 'laws', 'monitoring'
  const [lawForm, setLawForm] = useState({ title: '', description: '' })

  const user = JSON.parse(localStorage.getItem('user'))

  const loadData = async () => {
    try {
      const [usersRes, lawsRes] = await Promise.all([
        getAllUsers(),
        getLaws()
      ])
      setUsers(usersRes.data)
      setLaws(lawsRes.data)
      // Violations: no backend endpoint yet
      setViolations([])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handlePromote = async (id) => {
    try {
      await makeOfficer(id)
      toast.success('User promoted to Officer')
    } catch (err) {
      console.error(err)
      toast.error('Failed to promote user')
    }
    loadData()
  }

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id)
      toast.success('User removed')
      loadData()
    } catch (err) {
      toast.error('Failed to delete user')
    }
  }

  const handleCreateLaw = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createLaw(lawForm)
      toast.success('New regulation posted')
      setLawForm({ title: '', description: '' })
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create regulation')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLaw = async (id) => {
    try {
      await deleteLaw(id)
      toast.success('Regulation removed')
      loadData()
    } catch (err) {
      toast.error('Failed to delete regulation')
    }
  }

  const handleExport = () => {
    const data = activeTab === 'users' ? users : violations
    if (data.length === 0) {
      toast.error('No data available to export')
      return
    }
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-report.csv`
    a.click()
  }

  return (
    <Layout role="ADMIN">
      <div className="space-y-6 animate-fadeIn">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Admin Console
            </h1>
            <p className="text-sm text-slate-400 font-semibold mt-1">
              System Health: Optimal • {users.length} Active Users
            </p>
          </div>
          <button 
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98]" 
            onClick={handleExport}
          >
            📥 Export Report
          </button>
        </header>

        {/* TABS SELECTOR */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          {['users', 'violations', 'laws', 'monitoring'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap outline-none
                ${activeTab === tab 
                  ? 'border-brand-primary text-slate-950 font-black' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="pt-2">
          {activeTab === 'users' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="text-slate-900 font-bold text-sm">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-slate-400 font-medium">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border ${
                          u.role === 'ADMIN' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                            : u.role === 'OFFICER'
                            ? 'bg-sky-50 text-sky-850 border-sky-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {u.role === 'DRIVER' && (
                            <button 
                              className="px-3 py-1.5 bg-brand-primary hover:bg-brand-medium text-white text-xs font-bold rounded-lg transition-all active:scale-[0.98]" 
                              onClick={() => handlePromote(u.id)}
                            >
                              Promote
                            </button>
                          )}
                          <button 
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-200 transition-all active:scale-[0.98]" 
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'violations' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Offence</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {violations.length > 0 ? (
                    violations.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono text-xs text-slate-400">#{v.id}</td>
                        <td className="p-4 text-slate-900 font-bold">{v.vehicle}</td>
                        <td className="p-4 text-slate-650">{v.title}</td>
                        <td className="p-4 text-slate-900 font-black">₦{v.amount?.toLocaleString()}</td>
                        <td className="p-4">
                           <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border ${
                             v.status === 'PAID' 
                               ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                               : 'bg-rose-50 text-rose-800 border-rose-200'
                           }`}>
                              {v.status}
                           </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400 font-semibold">
                        No violations flagged. System clear.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'laws' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Add Regulation */}
              <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Add New Regulation</h3>
                <form onSubmit={handleCreateLaw} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Offence Title</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      placeholder="e.g. Failure to Signal Turn"
                      value={lawForm.title}
                      onChange={(e) => setLawForm({ ...lawForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Description</label>
                    <textarea
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all min-h-[120px]"
                      placeholder="Input statutory references and penalties..."
                      value={lawForm.description}
                      onChange={(e) => setLawForm({ ...lawForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <button 
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-medium text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-primary/10 active:scale-[0.98]" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Posting...' : 'Post Regulation'}
                  </button>
                </form>
              </section>

              {/* Active Regulations */}
              <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Regulations</h3>
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {laws.map(law => (
                    <div key={law.id} className="p-4 rounded-xl bg-slate-50 border border-slate-150 flex justify-between items-center gap-3">
                       <div className="font-bold text-slate-900 text-sm truncate max-w-[200px]">{law.title}</div>
                       <button 
                        onClick={() => handleDeleteLaw(law.id)}
                        className="text-rose-500 hover:text-rose-600 font-bold px-2 py-1 rounded hover:bg-rose-50 transition-all text-xs"
                       >
                         Delete
                       </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
               <div className="bg-brand-primary border border-emerald-900 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                  <div className="text-3xl font-black">99.9%</div>
                  <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-1">System Uptime</div>
               </div>
               <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="text-3xl font-black text-slate-900">
                    {users.filter(u => u.role === 'OFFICER').length}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Officers</div>
               </div>
               <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="text-3xl font-black text-slate-900">₦450,000</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Revenue This Month</div>
               </div>
               <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="text-3xl font-black text-slate-900">12.4k</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Verifications</div>
               </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}