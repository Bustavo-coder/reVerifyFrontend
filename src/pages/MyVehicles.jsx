import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function MyVehicles() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // Read vehicles from localStorage (saved on registration)
    // Backend has no "get my vehicles" endpoint yet
    const storageKey = `my_vehicles_${user?.id}`
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')
    setVehicles(stored)
    setLoading(false)
  }, [navigate])

  return (
    <Layout role={user?.role}>
      <div className="space-y-6 animate-fadeIn">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              My Vehicles
            </h1>
            <p className="text-sm text-slate-400 font-semibold mt-1">
              Manage all the vehicles registered to your profile.
            </p>
          </div>
          <button 
            className="px-4 py-2.5 bg-brand-primary hover:bg-brand-medium text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
            onClick={() => navigate('/register-vehicle')}
          >
            + Register New Vehicle
          </button>
        </header>

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-400 font-semibold">
            Loading vehicles...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-5 shadow-sm">
            <div className="text-5xl">🚗</div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">No Vehicles Found</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                You have not registered any vehicles yet in this session.
              </p>
            </div>
            <button 
              className="px-5 py-3 bg-brand-primary hover:bg-brand-medium text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98] inline-block"
              onClick={() => navigate('/register-vehicle')}
            >
              Register Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 hover:border-brand-primary/20 transition-all flex flex-col justify-between">
                
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">{v.plateNumber}</h2>
                    <div className="text-xs text-slate-400 font-semibold mt-0.5">
                      {v.make} {v.model} • {v.year}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-[10px] font-bold">
                    {v.color}
                  </span>
                </div>

                <div className="w-full text-xs text-slate-500 space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-150">
                  <div className="flex justify-between">
                    <span className="text-slate-400">VIN:</span>
                    <span className="font-semibold text-slate-800 font-mono truncate max-w-[150px]">{v.vin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="font-semibold text-slate-800">{v.vehicleType || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold rounded-xl text-xs transition-all"
                    onClick={() => navigate('/driver')}
                  >
                    View Dashboard
                  </button>
                  <button 
                    className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-medium text-white font-bold rounded-xl text-xs transition-all shadow-sm shadow-brand-primary/10"
                    onClick={() => navigate('/add-document', { state: { vehicleId: v.id } })}
                  >
                    Add Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
