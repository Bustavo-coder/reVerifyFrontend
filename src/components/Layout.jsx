import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpg'

export default function Layout({ children, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  })
  
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleSidebarCollapse = () => {
    const nextState = !isSidebarCollapsed
    setIsSidebarCollapsed(nextState)
    localStorage.setItem('sidebar_collapsed', String(nextState))
  }

  const navItems = {
    DRIVER: [
      { path: '/driver', label: 'Dashboard', icon: '📊' },
      { path: '/my-vehicles', label: 'My Vehicles', icon: '🚗' },
      { path: '/add-document', label: 'Documents', icon: '📄' },
      { path: '/violations', label: 'Violations', icon: '⚖️' },
      { path: '/laws', label: 'Traffic Laws', icon: '📖' },
      { path: '/profile', label: 'My Profile', icon: '👤' },
    ],
    OFFICER: [
      { path: '/officer', label: 'Inspection', icon: '🔍' },
      { path: '/history', label: 'History', icon: '📜' },
      { path: '/laws', label: 'Regulations', icon: '📖' },
    ],
    ADMIN: [
      { path: '/admin', label: 'Console', icon: '⚙️' },
      { path: '/admin/users', label: 'Users', icon: '👥' },
      { path: '/admin/violations', label: 'All Violations', icon: '⚖️' },
      { path: '/laws', label: 'Manage Laws', icon: '📖' },
    ]
  }

  const currentNav = navItems[role] || []

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans selection:bg-brand-accent selection:text-white relative">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden w-full bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src={logo} alt="reVerify" className="w-8 h-8 rounded-lg shadow-sm" />
          <span className="text-lg font-black tracking-tight text-slate-900">
            re<span className="text-brand-primary">Verify</span>
          </span>
        </div>
        <button 
          className="p-2 text-slate-600 hover:text-slate-900 text-2xl outline-none"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* DESKTOP SIDEBAR COLLAPSED FLOATING TRIGGER */}
      {isSidebarCollapsed && (
        <button 
          className="hidden md:flex fixed top-4 left-4 z-40 bg-slate-900 hover:bg-emerald-800 text-white w-10 h-10 rounded-xl items-center justify-center shadow-lg transition-all hover:scale-105"
          onClick={toggleSidebarCollapse} 
          title="Expand sidebar"
        >
          ☰
        </button>
      )}

      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 md:relative bg-slate-900 text-slate-100 flex flex-col p-6 transition-all duration-300 ease-in-out border-r border-slate-800
          ${isSidebarCollapsed ? 'md:w-20 md:px-3' : 'md:w-64'} 
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* LOGO AREA */}
        <div className={`flex items-center justify-between mb-8 ${isSidebarCollapsed ? 'md:justify-center' : ''}`}>
          <div className="flex items-center gap-3">
            <img src={logo} alt="reVerify" className="w-9 h-9 rounded-xl shadow-md border border-slate-700/50" />
            {!isSidebarCollapsed && (
              <div>
                <span className="text-lg font-black tracking-tight text-white block">
                  re<span className="text-emerald-400">Verify</span>
                </span>
                <span className="block text-[8px] text-slate-400 font-mono tracking-widest uppercase">
                  ROADCHECK
                </span>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button 
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-all"
              onClick={toggleSidebarCollapse}
              title="Collapse sidebar"
            >
              ◀
            </button>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1.5 flex-1">
          {currentNav.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm group
                ${isActive 
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20' 
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                }
                ${isSidebarCollapsed ? 'md:justify-center md:px-0 md:h-12 md:w-12 md:mx-auto' : ''}
              `}
              onClick={() => setIsSidebarOpen(false)}
              title={isSidebarCollapsed ? item.label : ''}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className={isSidebarCollapsed ? 'md:hidden' : 'block'}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-slate-850 pt-4 mt-auto space-y-4">
          {!isSidebarCollapsed && (
            <div className="px-2">
              <div className="font-extrabold text-sm text-white truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                {role}
              </div>
            </div>
          )}
          <button 
            className={`w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-rose-950/15
              ${isSidebarCollapsed ? 'md:p-0 md:h-12 md:w-12 md:mx-auto' : ''}
            `}
            onClick={handleLogout}
            title="Sign Out"
          >
            <span>🚪</span> 
            <span className={isSidebarCollapsed ? 'md:hidden' : 'block'}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50 transition-all duration-300">
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
