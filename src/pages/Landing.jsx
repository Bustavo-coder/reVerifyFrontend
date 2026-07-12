import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const [activeTab, setActiveTab] = useState('success') // 'success' or 'failed' for interactive preview

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-accent selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-primary/20">
              V
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                re<span className="text-brand-primary">Verify</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Roadcheck terminal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20 active:scale-[0.98]"
            >
              Register 
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-28 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure Digital Roadside Compliance
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Instant Roadside Document Verification. <span className="text-emerald-400">Zero Friction.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Equip field officers, transport authorities, and fleet managers with high-speed document scanning, real-time registry checks, and cryptographically secure offline sync.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-center shadow-lg shadow-emerald-500/25 hover:shadow-xl active:scale-[0.98]"
              >
                Register
              </Link>
              <a
                href="#interactive-demo"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl transition-all text-center border border-slate-700/80 active:scale-[0.98]"
              >
                About Us
              </a>
            </div>
          </div>

          {/* HERO HERO VISUAL */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-[32px] bg-slate-950 border border-slate-800 p-3 shadow-2xl relative">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="rounded-[24px] bg-slate-900 border border-slate-800 overflow-hidden">
                {/* Mobile App Header */}
                <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Scan Window</span>
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                {/* Mock Viewfinder */}
                <div className="aspect-[4/3] bg-slate-950 flex items-center justify-center relative p-6 border-b border-slate-800">
                  <div className="absolute inset-6 border border-emerald-500/40 rounded-xl" />
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                  <div className="text-center space-y-2">
                    <span className="text-4xl block">🪪</span>
                    <span className="text-xs text-slate-400">Align Driver's License Here</span>
                  </div>
                </div>
                {/* Mock OCR extraction */}
                <div className="p-4 space-y-2 bg-slate-900">
                  <div className="h-2 w-2/3 bg-slate-800 rounded animate-pulse" />
                  <div className="h-2 w-1/2 bg-slate-800 rounded animate-pulse" />
                  <div className="pt-2 flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>NIN: ***-***-891</span>
                    <span className="text-emerald-400">OCR Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM & "HOW MIGHT WE" FRAMING */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Operational Bottlenecks</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
              The Reality of Legacy Roadside Inspections
            </h3>
            <p className="text-slate-600 text-lg mb-12">
              Paper checks are slow, forgery-prone, and fail completely in low-network regions. We redefine security protocols for field agents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-sm space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">HMW 1</div>
              <h4 className="text-lg font-bold text-slate-900">Roadside Inspection Latency</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>How Might We</strong> reduce roadside checking times from minutes to milliseconds, ensuring traffic flows smoothly without compromising security checks?
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-sm space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">HMW 2</div>
              <h4 className="text-lg font-bold text-slate-900">Low Connectivity Environments</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>How Might We</strong> empower verification officers to run database lookups and authenticate licenses in remote areas with zero network availability?
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-sm space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">HMW 3</div>
              <h4 className="text-lg font-bold text-slate-900">Credential Forgery & Compliance</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>How Might We</strong> eliminate fraudulent or altered registrations and ensure all verification logs are securely stored for tamper-proof auditing?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES & VALUE PROPS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Designed for the Field</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Enterprise & Agency Level Capabilities
            </h3>
          </div>

          <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Feature Name</th>
                    <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Technical Capability</th>
                    <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Field Benefit</th>
                    <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">Status Icon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-5 font-bold text-slate-900">Mobile OCR / Scanning</td>
                    <td className="p-5 text-slate-600">On-device edge computing extracts fields from ID cards & licenses.</td>
                    <td className="p-5 text-slate-600 font-medium">Officers do not manually type. Eliminates input errors under harsh sunlight.</td>
                    <td className="p-5 text-center text-lg">🪪</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-5 font-bold text-slate-900">Registry Cross-Referencing</td>
                    <td className="p-5 text-slate-600">Secure TLS 1.3 query to centralized FRSC & Prembly APIs.</td>
                    <td className="p-5 text-slate-600 font-medium">Detects forged or revoked plates and licenses within 1.5 seconds.</td>
                    <td className="p-5 text-center text-lg">🔄</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-5 font-bold text-slate-900">Offline-First Local Sync</td>
                    <td className="p-5 text-slate-600">Encrypted SQLite DB synchronizes on reconnection.</td>
                    <td className="p-5 text-slate-600 font-medium">Verification works perfectly deep in rural roads or highways.</td>
                    <td className="p-5 text-center text-lg">💾</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-5 font-bold text-slate-900">Secure Compliance Audit</td>
                    <td className="p-5 text-slate-600">Immutable audit trails logs scan events with GPS coordinates.</td>
                    <td className="p-5 text-slate-600 font-medium">Protects officers against misconduct claims and ensures strict audit logs.</td>
                    <td className="p-5 text-center text-lg">🛡️</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE & SECURITY */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Zero-Trust Network</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Cryptographically Secure Architecture
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Every request is signed, encrypted, and recorded. Data in transit is protected with AES-256 GCM encryption. The verification console routes queries safely to prevent unauthorized data exposure.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-900">TLS 1.3 Pinning</h4>
                  <p className="text-xs text-slate-500">Prevents man-in-the-middle attacks on mobile network links.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-900">Biometric Guard & MFA</h4>
                  <p className="text-xs text-slate-500">Only authorized badged officers can access registration indexes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mermaid / Flow Diagram representation */}
          <div className="bg-slate-900 p-8 rounded-2xl text-slate-300 font-mono text-xs space-y-4 border border-slate-800 shadow-xl shadow-slate-900/10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-500">
              <span>Secure Architecture Pipeline</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-emerald-400">[Mobile App]</span>
                <span className="text-slate-500">AES-256-GCM</span>
              </div>
              <div className="text-center text-slate-600">↓</div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">[API Gateway]</span>
                <span className="text-emerald-400">Rate Limited & Authenticated</span>
              </div>
              <div className="text-center text-slate-600">↓</div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">[Government Databases]</span>
                <span className="text-slate-500">SSL Pool Sync</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO WIREFRAME SCREEN PREVIEW */}
      <section id="interactive-demo" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Live Experience Preview</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Interactive Terminal Viewports
            </h3>
            <p className="text-slate-500 mt-2 text-sm">
              Toggle the response modes below to test how the interface displays road compliance statuses.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('success')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                activeTab === 'success'
                  ? 'bg-emerald-600 text-white shadow-emerald-600/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Verify Success State
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                activeTab === 'failed'
                  ? 'bg-red-600 text-white shadow-red-600/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Verify Warning State
            </button>
          </div>

          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-lg p-5">
            {activeTab === 'success' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950">Assessment: CLEARED</h4>
                    <p className="text-xs text-slate-400 font-mono">ID: AAA-451-FRSC</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">License Owner:</span>
                    <span className="font-bold text-slate-950">Adegoke Babatunde</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiry Date:</span>
                    <span className="font-bold text-emerald-600">12/04/2029 (Valid)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Insurance Status:</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] rounded-lg font-medium text-center">
                  All roadside compliance metrics have passed official validation guidelines.
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold">
                    ⚠
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950">Assessment: NON-COMPLIANT</h4>
                    <p className="text-xs text-slate-400 font-mono">ID: KJA-982-FRSC</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">License Owner:</span>
                    <span className="font-bold text-slate-950">Olumide Ezekiel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiry Date:</span>
                    <span className="font-bold text-red-600">08/11/2024 (EXPIRED)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Insurance Status:</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                </div>

                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-800 text-[11px] rounded-lg font-medium text-center">
                  Warning: Expired License detected. Flag driver and issue a citation.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-12 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-lg font-bold text-white">reVerify System</span>
          <p className="text-xs leading-relaxed max-w-md mx-auto">
            Authorized for use by state highway patrols, vehicle inspectors, and transport registry managers only.
          </p>
          <div className="text-[10px] font-mono text-slate-600">
            © 2026 reVerify Inc. All rights reserved. Secure Session Active.
          </div>
        </div>
      </footer>
    </div>
  )
}
