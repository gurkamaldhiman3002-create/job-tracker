import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* ── Nav ── */}
      <nav className="border-b border-slate-800 px-8 py-4 relative z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            Job<span className="text-indigo-400">Track</span>
          </span>
          <div className="flex gap-8">
            {[["Home", "/"], ["Add Job", "/add-job"], ["All Jobs", "/jobs"], ["Login", "/auth"]].map(([label, href]) => (
              <Link key={href} href={href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150 tracking-wide uppercase">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">

        {/* 3-D perspective grid floor */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", inset: 0 }}>
            <defs>
              <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(99,102,241,0.07)" strokeWidth="1" />
              </pattern>
              <radialGradient id="fade" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#fade)" />
          </svg>
        </div>

        {/* Glowing orbs — 3D depth illusion */}
        <div className="absolute z-0 pointer-events-none" aria-hidden
          style={{ top: "10%", left: "15%", width: 480, height: 480,
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            filter: "blur(40px)", borderRadius: "50%" }} />
        <div className="absolute z-0 pointer-events-none" aria-hidden
          style={{ bottom: "15%", right: "10%", width: 360, height: 360,
            background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
            filter: "blur(40px)", borderRadius: "50%" }} />
        <div className="absolute z-0 pointer-events-none" aria-hidden
          style={{ top: "40%", right: "20%", width: 240, height: 240,
            background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
            filter: "blur(30px)", borderRadius: "50%" }} />

        {/* 3-D floating card — perspective tilt */}
        <div className="absolute right-[6%] top-[18%] z-10 hidden lg:block pointer-events-none" aria-hidden
          style={{ perspective: "800px" }}>
          <div style={{
            transform: "rotateY(-18deg) rotateX(8deg)",
            transformStyle: "preserve-3d",
            width: 220,
            animation: "floatCard 6s ease-in-out infinite",
          }}
            className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">Offer</span>
            </div>
            <p className="text-sm font-bold text-white">Stripe</p>
            <p className="text-xs text-slate-400 mt-0.5">Software Engineer</p>
            <div className="mt-3 h-px bg-slate-700" />
            <p className="text-xs text-slate-500 mt-2">San Francisco, CA</p>
          </div>
        </div>

        <div className="absolute left-[5%] top-[30%] z-10 hidden lg:block pointer-events-none" aria-hidden
          style={{ perspective: "800px" }}>
          <div style={{
            transform: "rotateY(15deg) rotateX(6deg)",
            transformStyle: "preserve-3d",
            width: 200,
            animation: "floatCard 7s ease-in-out infinite 1s",
          }}
            className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Interview</span>
            </div>
            <p className="text-sm font-bold text-white">Vercel</p>
            <p className="text-xs text-slate-400 mt-0.5">Frontend Lead</p>
            <div className="mt-3 h-px bg-slate-700" />
            <p className="text-xs text-slate-500 mt-2">Remote</p>
          </div>
        </div>

        <div className="absolute left-[8%] bottom-[20%] z-10 hidden lg:block pointer-events-none" aria-hidden
          style={{ perspective: "800px" }}>
          <div style={{
            transform: "rotateY(12deg) rotateX(-5deg)",
            transformStyle: "preserve-3d",
            width: 190,
            animation: "floatCard 8s ease-in-out infinite 0.5s",
          }}
            className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Applied</span>
            </div>
            <p className="text-sm font-bold text-white">Linear</p>
            <p className="text-xs text-slate-400 mt-0.5">Product Designer</p>
            <div className="mt-3 h-px bg-slate-700" />
            <p className="text-xs text-slate-500 mt-2">New York, NY</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-widest">Your career command center</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter leading-none mb-6"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.04em" }}>
            Land your<br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #34d399 100%)" }}>
                dream job.
              </span>
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Stop losing track of applications in spreadsheets. JobTrack gives you a
            real-time pipeline — every application, interview, and offer in one
            focused dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/add-job"
              className="group relative inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Job
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link href="/jobs"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 px-8 rounded-2xl transition-all duration-200 text-sm border border-slate-700 hover:border-slate-600 hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature strip ── */}
      <section className="border-t border-slate-800 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-14">
            Everything you need to manage your job search
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                color: "text-indigo-400",
                bg: "bg-indigo-500/10 border-indigo-500/20",
                title: "Track Every Application",
                desc: "Log company, role, source, recruiter, date applied and notes — all in one place. Never lose track of where you applied.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
                title: "Analytics & Charts",
                desc: "See your interview rate, offer rate, and rejection rate at a glance. Visualise your pipeline with live bar and line charts.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
                title: "Source Intelligence",
                desc: "Discover which platforms — LinkedIn, Referral, Indeed — actually land you interviews. Double down on what works.",
              },
            ].map(({ icon, color, bg, title, desc }) => (
              <div key={title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${bg} ${color} mb-5`}>
                  {icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Status pills row ── */}
      <section className="border-t border-slate-800 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8">
            Track every stage of your pipeline
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Applied", dot: "bg-blue-400", pill: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
              { label: "Interview Scheduled", dot: "bg-amber-400", pill: "bg-amber-500/10 border-amber-500/20 text-amber-300" },
              { label: "Offer Received", dot: "bg-emerald-400", pill: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" },
              { label: "Rejected", dot: "bg-red-400", pill: "bg-red-500/10 border-red-500/20 text-red-300" },
            ].map(({ label, dot, pill }) => (
              <span key={label} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold ${pill}`}>
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-slate-800 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black tracking-tight mb-4"
            style={{ fontFamily: "'Georgia', serif" }}>
            Ready to take control?
          </h2>
          <p className="text-slate-400 text-base mb-8">
            Sign in and start tracking your applications in under a minute.
          </p>
          <Link href="/auth"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-200 text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
            Get Started — It&apos;s Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-slate-600 text-xs">
          <span>Job<span className="text-indigo-500">Track</span> — your career command center</span>
          <div className="flex gap-6">
            <Link href="/add-job" className="hover:text-slate-400 transition-colors">Add Job</Link>
            <Link href="/jobs" className="hover:text-slate-400 transition-colors">Dashboard</Link>
            <Link href="/auth" className="hover:text-slate-400 transition-colors">Login</Link>
          </div>
        </div>
      </footer>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: rotateY(-18deg) rotateX(8deg) translateY(0px); }
          50%       { transform: rotateY(-18deg) rotateX(8deg) translateY(-12px); }
        }
      `}</style>

    </div>
  );
}
