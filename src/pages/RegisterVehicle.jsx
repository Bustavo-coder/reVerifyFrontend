import { useState } from 'react'
import { registerVehicle, verifyPlateNumberExternal } from './services/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function RegisterVehicle() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [form, setForm] = useState({
    plateNumber: '',
    vin: '',
    manufacturer: '',
    model: '',
    year: '',
    color: '',
    vehicleType: ''
  })

  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleVerifyFRSC = async () => {
    if (!form.plateNumber) {
      toast.error('Please enter a plate number first')
      return
    }

    setVerifying(true)
    try {
      const res = await verifyPlateNumberExternal(form.plateNumber.toUpperCase())
      if (res.data?.status) {
        const externalData = res.data.data
        setForm(prev => ({
          ...prev,
          manufacturer: externalData.make || prev.manufacturer,
          model: externalData.model || prev.model,
          color: externalData.color || prev.color,
        }))
        toast.success('Official FRSC data retrieved!')
      } else {
        toast.error('Official record not found')
      }
    } catch (err) {
      toast.error('Official verification failed.')
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await registerVehicle({
        ...form,
        plateNumber: form.plateNumber.trim().toUpperCase(),
        vin: form.vin.trim().toUpperCase(),
        manufacturer: form.manufacturer.trim(),
        model: form.model.trim(),
        color: form.color.trim(),
        year: Number(form.year)
      })

      // Persist vehicle to localStorage so DriverDashboard can list it
      // (backend has no "get my vehicles" endpoint yet)
      const storageKey = `my_vehicles_${user?.id}`
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const newVehicle = res.data
      const alreadyExists = existing.some(v => v.id === newVehicle.id)
      if (!alreadyExists) {
        localStorage.setItem(storageKey, JSON.stringify([...existing, newVehicle]))
      }

      toast.success('Vehicle registered successfully 🚗')
      setTimeout(() => { navigate('/driver') }, 1500)

    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Registration failed')
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
            Register New Vehicle
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Provide accurate details or use FRSC Verify to auto-fill your record.
          </p>
        </header>

        {/* REGISTRATION FORM CARD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Plate Number & Verify button */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Plate Number</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-bold font-mono text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all uppercase"
                  name="plateNumber"
                  placeholder="e.g. ABC-123-XY"
                  value={form.plateNumber}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                  onClick={handleVerifyFRSC}
                  disabled={verifying}
                >
                  {verifying ? 'Verifying...' : 'Verify with FRSC'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VIN / Chassis Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">VIN / Chassis Number</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all uppercase"
                  name="vin" 
                  placeholder="17-digit VIN" 
                  value={form.vin} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              {/* Manufacturer */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Manufacturer</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                  name="manufacturer" 
                  placeholder="e.g. Toyota" 
                  value={form.manufacturer} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Model</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                  name="model" 
                  placeholder="e.g. Camry" 
                  value={form.model} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Year</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                  type="number" 
                  name="year" 
                  placeholder="YYYY" 
                  value={form.year} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Color</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                  name="color" 
                  placeholder="e.g. Silver" 
                  value={form.color} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              {/* Vehicle Type */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Vehicle Type</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all cursor-pointer"
                  name="vehicleType" 
                  value={form.vehicleType} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select vehicle type...</option>
                  <option value="CAR">Private Car</option>
                  <option value="BUS">Commercial Bus</option>
                  <option value="TRUCK">Heavy Duty Truck</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button 
                className="flex-1 py-3.5 bg-brand-primary hover:bg-brand-medium text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg active:scale-[0.98]"
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Complete Registration'}
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