import { useState } from 'react'
import Layout from '../components/Layout'

const roadOffences = [
  { 
    code: 'SLV', 
    offence: 'Speed Limit Violation', 
    category: 'Speeding', 
    fine: 'N3,000 - N10,000', 
    penalty: '3 Points',
    description: 'Operating a motor vehicle above the specified speed limit for a given road or area. Speeding decreases reaction time and significantly increases the severity of road traffic crashes.',
    tips: 'Always pay attention to speed limit signs, especially when entering residential zones, school zones, or highway construction sectors.',
    section: 'Section 10(4), National Road Traffic Regulations, 2012'
  },
  { 
    code: 'DDV', 
    offence: 'Dangerous Driving', 
    category: 'Safety', 
    fine: 'N50,000', 
    penalty: '10 Points',
    description: 'Driving in a manner that constitutes a clear danger to other road users, including aggressive tailgating, sudden lane weaving, or disregard for road signals.',
    tips: 'Keep a safe 3-second distance from vehicles ahead, signal early before turning, and refrain from competitive or aggressive behaviors.',
    section: 'Section 21, Federal Road Safety Commission Act'
  },
  { 
    code: 'DLV', 
    offence: 'Driver’s Licence Violation', 
    category: 'Administrative', 
    fine: 'N10,000', 
    penalty: '7 Points',
    description: "Operating a motor vehicle without a valid driver's licence, using an expired licence, or driving with a licence category that does not match the vehicle class.",
    tips: "Set a calendar reminder 1 month before your licence expires to initiate renewal on the FRSC National Driver's Licence portal.",
    section: 'Section 10(3), National Road Traffic Regulations'
  },
  { 
    code: 'SBV', 
    offence: 'Seat Belt Violation', 
    category: 'Safety', 
    fine: 'N2,000', 
    penalty: '2 Points',
    description: 'Failure of the driver and front-seat passengers (or any passenger where required) to properly wear fitted seat belts while the vehicle is in motion.',
    tips: 'Make it a habit to buckle up before starting the ignition, and ensure all occupants are properly secured.',
    section: 'Section 126, National Road Traffic Regulations'
  },
  { 
    code: 'UPD', 
    offence: 'Use of Phone while Driving', 
    category: 'Safety', 
    fine: 'N4,000', 
    penalty: '4 Points',
    description: 'Using a handheld mobile device for voice calls, text messaging, browsing, or other interactive features while controlling a moving vehicle.',
    tips: 'Use hands-free Bluetooth devices or pull over to a safe area if you must take an urgent call or reply to text messages.',
    section: 'Section 144, National Road Traffic Regulations'
  },
  { 
    code: 'OVL', 
    offence: 'Overloading', 
    category: 'General', 
    fine: 'N10,000', 
    penalty: '3 Points',
    description: 'Carrying passengers or cargo exceeding the authorized payload capacity of the vehicle, which degrades braking capability and vehicle stability.',
    tips: "Never exceed the maximum weight ratings printed on the vehicle identification plate or owner's manual.",
    section: 'Section 13, National Road Traffic Regulations'
  },
  { 
    code: 'FEV', 
    offence: 'Fire Extinguisher Violation', 
    category: 'Safety', 
    fine: 'N3,000', 
    penalty: '2 Points',
    description: 'Operating a commercial or private vehicle without a functioning, unexpired fire extinguisher of the prescribed size and type.',
    tips: 'Keep a dry chemical powder fire extinguisher securely mounted in the vehicle passenger cabin where it is easily accessible.',
    section: 'Section 138, National Road Traffic Regulations'
  },
  { 
    code: 'LSV', 
    offence: 'Light/Sign Violation', 
    category: 'Traffic', 
    fine: 'N2,000', 
    penalty: '2 Points',
    description: 'Driving with defective headlights, brake lights, indicators, or refusing to obey road signs, traffic control lights, or law enforcement signals.',
    tips: 'Perform a quick walk-around inspection once a week to verify all external lighting and signalling systems are operating normally.',
    section: 'Section 85, National Road Traffic Regulations'
  },
  { 
    code: 'TIV', 
    offence: 'Tyre Violation', 
    category: 'Safety', 
    fine: 'N3,000', 
    penalty: '3 Points',
    description: 'Driving with bald, worn-out, structurally damaged, or expired tyres that pose an immediate risk of blowout or loss of traction.',
    tips: 'Regularly inspect tyre tread depth and inflation pressure, and replace tyres that are more than 4-5 years old regardless of tread wear.',
    section: 'Section 114, National Road Traffic Regulations'
  },
  { 
    code: 'WAV', 
    offence: 'Wiper Violation', 
    category: 'Safety', 
    fine: 'N2,000', 
    penalty: '1 Point',
    description: 'Operating a motor vehicle without functional windscreen wipers or with worn blades that fail to clear water or debris during precipitation.',
    tips: 'Replace wiper blades at least once a year, preferably before the rainy season starts.',
    section: 'Section 121, National Road Traffic Regulations'
  },
  { 
    code: 'RTV', 
    offence: 'Route Violation', 
    category: 'Traffic', 
    fine: 'N5,000', 
    penalty: '5 Points',
    description: 'Driving in the opposite direction of traffic flow (one-way), driving on unauthorized lanes, or blocking pathways designated for emergency services.',
    tips: 'Pay close attention to lane markings, arrows, and traffic direction signs. Never drive against traffic to take shortcuts.',
    section: 'Section 48, National Road Traffic Regulations'
  },
  { 
    code: 'DUI', 
    offence: 'Driving Under Alcohol/Drug Influence', 
    category: 'Safety', 
    fine: 'N5,000', 
    penalty: '10 Points',
    description: 'Operating a vehicle with blood alcohol levels above the statutory limit (0.05g/100ml) or while impaired by narcotics or prescription drugs.',
    tips: 'Always designate a sober driver, use ride-hailing services, or arrange alternative transport if you consume any intoxicating substances.',
    section: 'Section 20, Federal Road Safety Commission Act'
  }
]

export default function Laws() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLaw, setSelectedLaw] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'))
  
  const filteredOffences = roadOffences.filter(item => 
    item.offence.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout role={user?.role}>
      <div className="space-y-6 animate-fadeIn">
        
        {/* HEADER */}
        <header className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Road Safety Regulations
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Official index of traffic offences, legal authorities, and fine schedules.
          </p>
        </header>

        {/* SEARCH BAR */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <input
            type="text"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-semibold text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
            placeholder="Search by offence name, legal code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* OFFENCES TABLE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Code</th>
                <th className="p-4">Offence</th>
                <th className="p-4">Category</th>
                <th className="p-4">Statutory Fine</th>
                <th className="p-4">Demerit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {filteredOffences.length > 0 ? (
                filteredOffences.map((item, index) => (
                  <tr 
                    key={index} 
                    onClick={() => setSelectedLaw(item)} 
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-xs font-bold font-mono">
                        {item.code}
                      </span>
                    </td>
                    <td className="p-4 text-slate-900 font-bold">{item.offence}</td>
                    <td className="p-4 text-slate-400 text-xs uppercase">{item.category}</td>
                    <td className="p-4 text-slate-900 font-black">{item.fine}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-bold text-slate-500">
                        {item.penalty}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400 font-semibold">
                    No results matching "{searchTerm}" found in the registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* DETAILS MODAL */}
        {selectedLaw && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedLaw(null)}>
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp" onClick={(e) => e.stopPropagation()}>
              <div className="bg-slate-950 text-white p-5 flex justify-between items-center border-b border-slate-800">
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                  ⚖️ {selectedLaw.offence} ({selectedLaw.code})
                </h3>
                <button className="text-xl text-slate-400 hover:text-white transition-colors" onClick={() => setSelectedLaw(null)}>×</button>
              </div>
              
              <div className="p-6 space-y-4 text-sm">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legal Authority</span>
                  <p className="font-semibold italic text-slate-600">{selectedLaw.section}</p>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offence Description</span>
                  <p className="text-slate-700 leading-relaxed font-semibold text-xs">{selectedLaw.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 my-2">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statutory Fine</span>
                    <span className="text-lg font-black text-rose-600">{selectedLaw.fine}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demerit Points</span>
                    <span className="text-lg font-black text-amber-600">{selectedLaw.penalty}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safe Driving Guidelines</span>
                  <p className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-xl text-emerald-950 font-medium text-xs leading-relaxed">
                     {selectedLaw.tips}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTICE */}
        <div className="bg-amber-50/50 border border-amber-200/60 p-5 rounded-2xl space-y-2">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            ⚠️ Regulatory Notice
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            These statutory fines are calculated based on the FRSC (Establishment) Act and National Road Traffic Regulations. 
            Officers and drivers are advised to check official publications for revised schedules.
          </p>
        </div>
      </div>
    </Layout>
  )
}