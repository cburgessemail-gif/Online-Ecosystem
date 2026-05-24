// ===== UPDATED OPENING SECTION FOR App.tsx =====
// Replace your current HERO / LANDING SCREEN section with this

<div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-10 min-h-screen">
  
  <div className="bg-black/45 backdrop-blur-md rounded-3xl p-8 max-w-6xl border border-white/10 shadow-2xl">
    
    <div className="mb-6">
      <h2 className="text-green-300 uppercase tracking-[0.35em] text-sm md:text-base font-semibold">
        Bronson Family Farm
      </h2>

      <h1 className="mt-4 text-4xl md:text-6xl font-black text-white leading-tight">
        Youth Workforce Program
      </h1>

      <h3 className="mt-3 text-xl md:text-2xl text-green-100 font-semibold">
        Summer 2026 Digital Training & Supervisor Management System
      </h3>

      <p className="mt-6 text-base md:text-lg text-gray-100 leading-relaxed max-w-4xl mx-auto">
        A guided digital training and supervisor management system for youth growers,
        daily farm tasks, attendance, assessments, marketplace harvest flow,
        parent connection, workforce development, and community food production.
      </p>
    </div>

    {/* PROGRAM INFO */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">

      <div className="bg-green-900/40 border border-green-400/20 rounded-2xl p-4">
        <div className="text-green-300 text-sm uppercase tracking-wider">
          Program Dates
        </div>
        <div className="text-white text-lg font-bold mt-1">
          June 8 – August 28, 2026
        </div>
      </div>

      <div className="bg-green-900/40 border border-green-400/20 rounded-2xl p-4">
        <div className="text-green-300 text-sm uppercase tracking-wider">
          Schedule
        </div>
        <div className="text-white text-lg font-bold mt-1">
          Mon–Fri • 8AM–2PM
        </div>
      </div>

      <div className="bg-green-900/40 border border-green-400/20 rounded-2xl p-4">
        <div className="text-green-300 text-sm uppercase tracking-wider">
          Orientation
        </div>
        <div className="text-white text-lg font-bold mt-1">
          June 5, 2026
        </div>
      </div>

      <div className="bg-green-900/40 border border-green-400/20 rounded-2xl p-4">
        <div className="text-green-300 text-sm uppercase tracking-wider">
          Youth Capacity
        </div>
        <div className="text-white text-lg font-bold mt-1">
          50 Participants
        </div>
      </div>

    </div>

    {/* ACTION BUTTONS */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">

      <button
        className="bg-green-500 hover:bg-green-400 transition-all duration-300 text-black font-bold py-4 px-6 rounded-2xl shadow-xl"
      >
        Start Youth Orientation
      </button>

      <button
        className="bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white font-semibold py-4 px-6 rounded-2xl"
      >
        Supervisor Dashboard
      </button>

      <button
        className="bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white font-semibold py-4 px-6 rounded-2xl"
      >
        Parent / Guardian Portal
      </button>

      <button
        className="bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white font-semibold py-4 px-6 rounded-2xl"
      >
        Daily Farm Tasks
      </button>

      <button
        className="bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white font-semibold py-4 px-6 rounded-2xl"
      >
        Youth Progress Tracker
      </button>

      <button
        className="bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white font-semibold py-4 px-6 rounded-2xl"
      >
        Marketplace Harvest Flow
      </button>

    </div>

  </div>
</div>
