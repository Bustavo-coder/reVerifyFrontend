import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDriverProfile, getDocumentsByVehicleId } from './services/api'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

const documentTypes = [
  { type: 'VEHICLE_LICENSE', label: 'Vehicle License', icon: '🪪' },
  { type: 'ROAD_WORTHINESS', label: 'Road Worthiness', icon: '🔧' },
  { type: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { type: 'PROOF_OF_OWNERSHIP', label: 'Proof of Ownership', icon: '📄' },
  { type: 'HACKNEY_PERMIT', label: 'Hackney Permit', icon: '🚕' },
]

export default function DriverDashboard() {
  const navigate = useNavigate()
  const [myVehicles, setMyVehicles] = useState([])
  const [myViolations, setMyViolations] = useState([])
  const [myDocuments, setMyDocuments] = useState([])
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [vehicle, setVehicle] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const storageKey = `my_vehicles_${user?.id}`
        const storedVehicles = JSON.parse(localStorage.getItem(storageKey) || '[]')
        setMyVehicles(storedVehicles)

        if (user?.id) {
          await getDriverProfile(user.id)
          if (storedVehicles.length > 0) {
            const allDocsResults = await Promise.allSettled(
              storedVehicles.map(v => getDocumentsByVehicleId(v.id))
            )
            const allDocs = allDocsResults
              .filter(r => r.status === 'fulfilled')
              .flatMap(r => r.value.data || [])
            setMyDocuments(allDocs)
          }
        }
        setMyViolations([])
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      }
    }

    fetchDashboardData()
  }, [navigate])

  const handleSelectVehicle = async (vId) => {
    setSelectedVehicleId(vId)
    if (!vId) {
      setVehicle(null)
      setDocuments([])
      setSearched(false)
      return
    }

    const selected = myVehicles.find(v => v.id === vId || v.id === parseInt(vId))
    setVehicle(selected)
    setSearched(true)
    setLoading(true)

    try {
      const docsRes = await getDocumentsByVehicleId(selected.id)
      setDocuments(docsRes.data || [])
    } catch (err) {
      setDocuments([])
      toast.error('Failed to load documents for this vehicle')
    } finally {
      setLoading(false)
    }
  }

  const getDocStatus = (type) => {
    const doc = documents.find(d => d.documentType === type)
    if (!doc) return { status: 'pending', label: 'Not submitted', style: 'bg-slate-100 text-slate-600 border-slate-200', data: null }
    if (doc.status === 'VERIFIED') return { status: 'verified', label: 'Verified', style: 'bg-emerald-50 text-emerald-800 border-emerald-250', data: doc }
    if (doc.status === 'EXPIRED') return { status: 'expired', label: 'Expired', style: 'bg-rose-50 text-rose-800 border-rose-250', data: doc }
    return { status: 'pending', label: 'Pending review', style: 'bg-amber-50 text-amber-800 border-amber-250', data: doc }
  }

  const totalVerified = myDocuments.filter(d => d.status === 'VERIFIED').length
  const totalVehicles = myVehicles.length
  const activeViolationsCount = myViolations.filter(v => v.status === 'UNPAID').length

  return (
    <Layout role="DRIVER">
      <div className="space-y-8 animate-fadeIn">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.firstName}
            </h1>
            <p className="text-sm text-slate-400 font-semibold mt-1">
              RoadCheck Nigeria • Secure Document Hub
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/register-vehicle')}
              className="px-4 py-2.5 bg-brand-primary hover:bg-brand-medium text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              + Register Vehicle
            </button>
          </div>
        </header>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:border-emerald-500/30 transition-all">
            <div className="text-3xl font-black text-slate-900">{totalVerified}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Documents</div>
          </div>
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:border-emerald-500/30 transition-all">
            <div className="text-3xl font-black text-slate-900">{totalVehicles}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registered Vehicles</div>
          </div>
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:border-emerald-500/30 transition-all">
            <div className="text-3xl font-black text-slate-900">{activeViolationsCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Violations</div>
          </div>
        </div>

        {/* VEHICLE SELECTOR PANEL */}
        <section className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Active Vehicle</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Select a registered vehicle to audit its compliance credentials.</p>
          </div>
          <div className="relative">
            <select
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all cursor-pointer"
              value={selectedVehicleId}
              onChange={(e) => handleSelectVehicle(e.target.value)}
              disabled={myVehicles.length === 0}
            >
              <option value="">-- {myVehicles.length === 0 ? 'No vehicles registered' : 'Select a vehicle'} --</option>
              {myVehicles.map(v => (
                <option key={v.id} value={v.id}>{v.plateNumber} ({v.make} {v.model})</option>
              ))}
            </select>
          </div>
        </section>

        {searched && vehicle ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{vehicle.plateNumber}</h2>
                <p className="text-sm text-slate-400 font-semibold">{vehicle.make} {vehicle.model} • {vehicle.color}</p>
              </div>
              <button 
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all self-start sm:self-center"
                onClick={() => navigate('/add-document', { state: { vehicleId: vehicle.id } })}
              >
                + Add Document
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {documentTypes.map((doc) => {
                const status = getDocStatus(doc.type)
                return (
                  <div key={doc.type} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{doc.icon}</span>
                        <span className="font-bold text-slate-950 text-sm">{doc.label}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-bold border ${status.style}`}>
                        {status.label}
                      </span>
                    </div>
                    
                    {status.data ? (
                      <div className="w-full text-[11px] text-slate-500 space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-150">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Ref No:</span> 
                          <span className="font-semibold text-slate-800 truncate max-w-[150px]">{status.data.documentReferenceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Authority:</span> 
                          <span className="font-semibold text-slate-800">{status.data.issuingAuthority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Issued:</span> 
                          <span className="font-semibold text-slate-800">{new Date(status.data.issuedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Expires:</span> 
                          <span className={`font-semibold ${status.status === 'expired' ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                            {new Date(status.data.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-semibold">
                        No document uploaded yet.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : searched && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
            <span className="text-4xl block">🔎</span>
            <h3 className="font-bold text-slate-850">Vehicle Not Found</h3>
            <p className="text-xs text-slate-400 font-semibold">Please select a valid registered vehicle.</p>
          </div>
        )}

        {!searched && (
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Road Safety tips</h3>
              <ul className="space-y-3 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Keep your digital document database synchronized in this terminal.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Set reminders for vehicle insurance and roadworthiness renewals.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Flag safety concerns and highway failures directly to officers.
                </li>
              </ul>
            </div>
            <div className="bg-emerald-900 border border-emerald-850 rounded-2xl p-6 shadow-sm text-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">Latest Regulatory Notice</h3>
                <p className="text-xs text-emerald-100 leading-relaxed mt-2.5 font-medium">
                  The Federal Ministry of Transport has revised the Proof of Ownership certificates guidelines. All vehicles must renew credentials accordingly.
                </p>
              </div>
              <button 
                className="px-4 py-2.5 bg-white text-emerald-950 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all self-start mt-4 shadow-sm"
                onClick={() => navigate('/laws')}
              >
                Read Regulations
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
