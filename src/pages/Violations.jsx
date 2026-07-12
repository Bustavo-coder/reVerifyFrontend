import { useEffect, useState } from 'react'
import { getViolations, payViolation } from './services/api'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function Violations() {
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    loadViolations()
  }, [])

  const loadViolations = async () => {
    try {
      const res = await getViolations()
      setViolations(res.data)
    } catch (err) {
      console.error(err)
      // Mock data for demo if backend fails
      setViolations([
        { id: 1, title: 'Speeding', amount: 5000, status: 'UNPAID', date: '2023-10-20' },
        { id: 2, title: 'Expired License', amount: 10000, status: 'PAID', date: '2023-09-15' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async (id) => {
    try {
      await payViolation(id)
      toast.success('Fine paid successfully')
      loadViolations()
    } catch (err) {
      toast.error('Payment failed')
    }
  }

  return (
    <Layout role={user?.role}>
      <div className="space-y-6 animate-fadeIn">
        
        {/* HEADER */}
        <header className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Violations
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Review and settle any outstanding road penalties.
          </p>
        </header>

        {/* VIOLATIONS TABLE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Offence</th>
                <th className="p-4">Date Issued</th>
                <th className="p-4">Fine Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {violations.length > 0 ? (
                violations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="text-slate-900 font-bold text-sm">{v.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">REF: #{v.id}00X</div>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">{new Date(v.date).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-900 font-black text-sm">₦{v.amount?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border ${
                        v.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {v.status === 'UNPAID' && (
                        <button
                          className="px-3 py-1.5 bg-brand-primary hover:bg-brand-medium text-white text-xs font-bold rounded-lg transition-all active:scale-[0.98] shadow-sm"
                          onClick={() => handlePay(v.id)}
                        >
                          Pay Fine
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400 font-semibold">
                    No violations found. Drive safe!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}