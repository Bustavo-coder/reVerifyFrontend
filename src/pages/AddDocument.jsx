import { useState } from 'react'
import { addDocument } from './services/api'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function AddDocument() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user'))
  const initialVehicleId = location.state?.vehicleId || ''

  const [form, setForm] = useState({
    vehicleId: initialVehicleId,
    documentType: '',
    documentReferenceNumber: '',
    issuingAuthority: '',
    issuedDate: '',
    expiryDate: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addDocument({
        ...form,
        issuedDate: new Date(form.issuedDate).toISOString(),
        expiryDate: new Date(form.expiryDate).toISOString()
      })

      toast.success('Document added successfully 📑')
      setTimeout(() => { navigate('/driver') }, 1500)

    } catch (err) {
      console.error(err)
      toast.error('Failed to upload document. Please verify your reference details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout role={user?.role}>
      <div className="space-y-6 animate-fadeIn max-w-2xl">
        
        {/* HEADER */}
        <header className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Upload Document
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Attach official road documents to your vehicle for digital verification.
          </p>
        </header>

        {/* UPLOAD FORM CARD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Vehicle ID Reference */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Vehicle ID / Plate Reference</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all uppercase"
                name="vehicleId"
                value={form.vehicleId}
                onChange={handleChange}
                placeholder="Enter vehicle reference"
                required
              />
            </div>

            {/* Document Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Document Type</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all cursor-pointer"
                name="documentType"
                value={form.documentType}
                onChange={handleChange}
                required
              >
                <option value="">Select document type...</option>
                <option value="VEHICLE_LICENSE">Vehicle License</option>
                <option value="ROAD_WORTHINESS">Road Worthiness</option>
                <option value="INSURANCE">Insurance</option>
                <option value="PROOF_OF_OWNERSHIP">Proof of Ownership</option>
                <option value="HACKNEY_PERMIT">Hackney Permit</option>
              </select>
            </div>

            {/* Reference Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Reference Number / Certificate ID</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                name="documentReferenceNumber"
                value={form.documentReferenceNumber}
                onChange={handleChange}
                placeholder="e.g. V-12345678"
                required
              />
            </div>

            {/* Issuing Authority */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Issuing Authority</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                name="issuingAuthority"
                value={form.issuingAuthority}
                onChange={handleChange}
                placeholder="e.g. FRSC / VIO"
                required
              />
            </div>

            {/* Issued & Expiry Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Issued Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all cursor-pointer"
                  name="issuedDate"
                  value={form.issuedDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all cursor-pointer"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Form actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button 
                className="flex-[2] py-3.5 bg-brand-primary hover:bg-brand-medium text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg active:scale-[0.98]"
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Upload Document'}
              </button>
              <button 
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold rounded-xl text-sm transition-all"
                type="button" 
                onClick={() => navigate('/driver')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
