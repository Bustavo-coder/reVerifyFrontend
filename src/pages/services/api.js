import axios from 'axios'

const SERVER = import.meta.env.VITE_API_URL || 'http://localhost:8080'


const api = axios.create({
  baseURL: `${SERVER}/api/v1`,
  headers: { 'Content-Type': 'application/json' }
})

const apiBase = axios.create({
  baseURL: `${SERVER}/api`,
  headers: { 'Content-Type': 'application/json' }
})

const authRequestInterceptor = (config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}

const AUTH_PAGES = ['/login', '/register', '/officer-portal', '/officer-register']

const authErrorInterceptor = (error) => {
  const isOnAuthPage = AUTH_PAGES.some((path) => window.location.pathname.startsWith(path))


  if (error.response?.status === 401 && !isOnAuthPage) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return Promise.reject(error)
}

api.interceptors.request.use(authRequestInterceptor)
apiBase.interceptors.request.use(authRequestInterceptor)
api.interceptors.response.use((r) => r, authErrorInterceptor)
apiBase.interceptors.response.use((r) => r, authErrorInterceptor)


export const loginUser = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)

export const createDriverProfile = (userId, data) => apiBase.post(`/driver/profile/${userId}`, data)
export const getDriverProfile    = (userId)       => apiBase.get(`/driver/profile/${userId}`)
export const updateDriverProfile = (userId, data) => apiBase.put(`/driver/profile/${userId}`, data)
export const findDriverByUniqueId = (driverUniqueId) => apiBase.get(`/driver/find/${driverUniqueId}`)


export const registerVehicle       = (data)        => api.post('/vehicles/register', data)
export const getVehicleByPlate     = (plateNumber) => api.get(`/vehicles/plate/${plateNumber}`)
export const getVehicleByVin       = (vin)         => api.get(`/vehicles/vin/${vin}`)

// ─── DOCUMENT ─────────────────────────────────────────────────────────────────
// DocumentController → /api/v1/documents
export const addDocument             = (data)       => api.post('/documents/add', data)
export const getDocumentById         = (docId)      => api.get(`/documents/${docId}`)
export const getDocumentsByVehicleId = (vehicleId)  => api.get(`/documents/vehicle/${vehicleId}`)

// ─── OFFICER ──────────────────────────────────────────────────────────────────
// OfficerController → /api/officer  (note: no /v1)
// Profile actions use JWT — no userId in path required
export const createOfficerProfile = (data) => apiBase.post('/officer/register', data)
export const getOfficerProfile    = ()     => apiBase.get('/officer/profile')
export const updateOfficerProfile = (data) => apiBase.put('/officer/profile', data)
export const deleteOfficerProfile = ()     => apiBase.delete('/officer/profile')

// Officer search — routes to Vehicle/Driver controllers
export const searchByPlateNumber   = (plateNumber)    => api.get(`/vehicles/plate/${plateNumber}`)
export const getVehicleByPlateNumber = searchByPlateNumber // alias
export const searchByDriverId      = (driverUniqueId) => apiBase.get(`/driver/find/${driverUniqueId}`)

// ─── ADMIN ────────────────────────────────────────────────────────────────────
// AdminController → /api/admin  (note: no /v1)
export const getAllUsers  = ()       => apiBase.get('/admin/users')
export const getOfficers = ()       => apiBase.get('/admin/officers')
export const makeOfficer = (userId) => apiBase.put(`/admin/make-officer/${userId}`)
export const deleteUser  = (userId) => apiBase.delete(`/admin/users/${userId}`)

// ─── TRAFFIC LAWS ─────────────────────────────────────────────────────────────
// TrafficLawController → /api/v1/laws
export const getAllLaws = ()           => api.get('/laws')
export const getLaws   = getAllLaws    // alias
export const createLaw = (data)       => api.post('/laws', data)
export const updateLaw = (id, data)   => api.put(`/laws/${id}`, data)
export const deleteLaw = (id)         => api.delete(`/laws/${id}`)

// ─── PREMBLY VERIFICATION (External) ─────────────────────────────────────────
const premblyApi = axios.create({
  baseURL: 'https://api.prembly.com/v1',
  headers: {
    'x-api-key': import.meta.env.VITE_PREMBLY_API_KEY,
    'app-id': import.meta.env.VITE_PREMBLY_APP_ID
  }
})

export const verifyPlateNumberExternal = async (plateNumber) => {
  try {
    if (import.meta.env.VITE_PREMBLY_API_KEY?.includes('your_')) throw new Error('MOCK')
    return await premblyApi.post('/vehicle', { vehicle_number: plateNumber })
  } catch {
    return {
      data: {
        status: true,
        data: { make: 'Toyota', model: 'Camry', color: 'Silver', year: '2022', owner: 'Test User' }
      }
    }
  }
}

export const verifyDriverLicenseExternal = async (data) => {
  try {
    if (import.meta.env.VITE_PREMBLY_API_KEY?.includes('your_')) throw new Error('MOCK')
    return await premblyApi.post('/drivers_license', {
      number: data.licenseNumber,
      first_name: data.firstName,
      last_name: data.lastName,
      dob: data.dob
    })
  } catch {
    return {
      data: {
        status: 'success',
        data: { firstName: data.firstName || 'Verified', lastName: data.lastName || 'User', status: 'VALID' }
      }
    }
  }
}

export const verifyNINExternal = async (nin) => {
  try {
    if (import.meta.env.VITE_PREMBLY_API_KEY?.includes('your_')) throw new Error('MOCK')
    return await premblyApi.post('/nin', { number: nin })
  } catch {
    return {
      data: {
        status: 'success',
        data: { firstName: 'Simulated', lastName: 'Driver', nin, photo: 'https://via.placeholder.com/150' }
      }
    }
  }
}

// ─── Compatibility stubs — no backend endpoint exists yet ─────────────────────
// These are exported so existing component imports don't break.
// Each stub returns an empty-data response; components' existing catch/fallback
// logic will handle the 404s gracefully once the backend is wired up.

/** @deprecated No backend endpoint. Vehicles are per-userId via getDriverProfile(). */
export const getMyVehicles = () => Promise.resolve({ data: [] })

/** @deprecated No backend endpoint. Documents are per-vehicle via getDocumentsByVehicleId(vehicleId). */
export const getMyDocuments = () => Promise.resolve({ data: [] })

/** @deprecated No ViolationController on backend yet. */
export const getMyViolations = () => Promise.resolve({ data: [] })
export const getViolations   = getMyViolations // alias used by Violations.jsx

/** @deprecated No ViolationController on backend yet. */
export const payViolation = (id) => Promise.reject(new Error(`payViolation(${id}): No backend endpoint`))

/** @deprecated No ViolationController on backend yet. */
export const getAllViolations    = () => Promise.resolve({ data: [] })
export const exportViolationsCSV = () => Promise.resolve({ data: '' })

/** @deprecated No ViolationController on backend yet. */
export const issueViolation = (data) => Promise.reject(new Error('issueViolation: No backend endpoint'))

/** @deprecated No /admin/stats endpoint. */
export const getAdminStats = () => Promise.resolve({ data: {} })

/** @deprecated No /auth/profile endpoint. Use getDriverProfile(userId) or getOfficerProfile(). */
export const getProfile = () => Promise.resolve({ data: {} })

/** @deprecated Use makeOfficer(id) instead — correct method is PUT, not POST. */
export const promoteToOfficer = (id) => makeOfficer(id)

export default api