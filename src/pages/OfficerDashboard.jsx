import { useState } from 'react'
import { getVehicleByPlateNumber, getDocumentsByVehicleId, issueViolation } from './services/api'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

const documentTypes = [
  { type: 'VEHICLE_LICENSE', label: 'Vehicle License', icon: '🪪' },
  { type: 'ROAD_WORTHINESS', label: 'Road Worthiness', icon: '🔧' },
  { type: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { type: 'PROOF_OF_OWNERSHIP', label: 'Proof of Ownership', icon: '📄' },
  { type: 'HACKNEY_PERMIT', label: 'Hackney Permit', icon: '🚕' },
]

export default function OfficerDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('plate') // 'plate' or 'driverId'
  const [vehicle, setVehicle] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showViolationModal, setShowViolationModal] = useState(false)
  const [violationForm, setViolationForm] = useState({ title: '', amount: '' })

  const user = JSON.parse(localStorage.getItem('user'))

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setVehicle(null)
    setDocuments([])
    setSearched(false)

    try {
      let vehicleData;
      if (searchType === 'plate') {
        const vehicleRes = await getVehicleByPlateNumber(searchQuery.toUpperCase())
        vehicleData = vehicleRes.data
      } else {
        toast.error('Search by Driver ID coming soon. Using fallback.')
        return;
      }
      
      setVehicle(vehicleData)
      const docsRes = await getDocumentsByVehicleId(vehicleData.id)
      setDocuments(docsRes.data || [])
      setSearched(true)
    } catch (err) {
      toast.error('Record not found')
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handleIssueViolation = async (e) => {
    e.preventDefault()
    try {
      await issueViolation({ ...violationForm, vehicleId: vehicle.id })
      toast.success('Violation issued successfully')
      setShowViolationModal(false)
      setViolationForm({ title: '', amount: '' })
    } catch (err) {
      toast.error('Failed to issue violation')
    }
  }

  const getDocStatus = (type) => {
    const doc = documents.find(d => d.documentType === type)
    if (!doc) return { status: 'pending', label: 'Not submitted', style: 'bg-slate-100 text-slate-600 border-slate-200' }
    if (doc.status === 'VERIFIED') return { status: 'verified', label: 'Verified', style: 'bg-emerald-50 text-emerald-800 border-emerald-250' }
    if (doc.status === 'EXPIRED') return { status: 'expired', label: 'Expired', style: 'bg-rose-50 text-rose-800 border-rose-250' }
    return { status: 'pending', label: 'Pending review', style: 'bg-amber-50 text-amber-800 border-amber-250' }
  }

  const verifiedCount = documentTypes.filter(d => getDocStatus(d.type).status === 'verified').length
  const isCleared = vehicle && verifiedCount === documentTypes.length

  return (
    <Layout role="OFFICER">
      <div className="space-y-8 animate-fadeIn">
        
        {/* HEADER */}
        <header className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Verification Terminal
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Officer {user?.lastName} • Active Road Patrol Session
          </p>
        </header>

        {/* SEARCH PANEL */}
        <section className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Vehicle Registry Query</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Input driver NIN or vehicle license plates for live verification.</p>
            </div>
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer self-start"
            >
              <option value="plate">Plate Number</option>
              <option value="driverId">Driver ID / NIN</option>
            </select>
          </div>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSearch}>
            <input
              className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all uppercase"
              placeholder={searchType === 'plate' ? "e.g. KJA-231-AA" : "Enter NIN or User ID"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button 
              className="px-6 py-3.5 bg-brand-primary hover:bg-brand-medium text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] text-sm flex items-center justify-center gap-2"
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Querying...' : 'Verify Status'}
            </button>
          </form>
        </section>

        {searched && vehicle ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{vehicle.plateNumber}</h2>
                <p className="text-sm text-slate-400 font-semibold">{vehicle.make} {vehicle.model} • {vehicle.color}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                  isCleared 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {isCleared ? '✓ COMPLIANCE OK' : '⚠ WARNING: DEFICIT'}
                </span>
                {!isCleared && (
                  <button 
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
                    onClick={() => setShowViolationModal(true)}
                  >
                    Flag Violation
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {documentTypes.map((doc) => {
                const status = getDocStatus(doc.type)
                return (
                  <div key={doc.type} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 hover:border-brand-primary/20 transition-all flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{doc.icon}</span>
                      <span className="font-bold text-slate-900 text-sm">{doc.label}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold border self-start ${status.style}`}>
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className={`p-5 rounded-2xl border ${
              isCleared 
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50/50 border-rose-200 text-rose-900'
            }`}>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Official terminal Assessment</h3>
              <p className="text-xs leading-relaxed font-medium">
                {isCleared 
                  ? 'All core documents are active and verified. The vehicle and driver are fully cleared for road operations.' 
                  : 'Important: One or more required registry documents are expired or missing. Please issue a warning or violation ticket.'
                }
              </p>
            </div>
          </div>
        ) : searched && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
            <span className="text-4xl block">🔎</span>
            <h3 className="font-bold text-slate-850">Record Not Found</h3>
            <p className="text-xs text-slate-400 font-semibold">No digital records matching "{searchQuery}" exist in the system database.</p>
          </div>
        )}

        {/* VIOLATION MODAL */}
        {showViolationModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Issue Traffic Violation</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Assign a penalty charge to license {vehicle?.plateNumber}.</p>
              </div>
              <form onSubmit={handleIssueViolation} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Violation Offence</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                    placeholder="e.g. Expired Vehicle License" 
                    value={violationForm.title}
                    onChange={(e) => setViolationForm({...violationForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Fine Amount (₦)</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                    type="number" 
                    placeholder="10000" 
                    value={violationForm.amount}
                    onChange={(e) => setViolationForm({...violationForm, amount: e.target.value})}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold rounded-xl text-sm transition-all" 
                    onClick={() => setShowViolationModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-rose-950/15"
                  >
                    Issue Citation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}