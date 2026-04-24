"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150 tracking-wide uppercase"
  >
    {children}
  </Link>
);

const inputClass =
  "w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2";

export default function AddJobPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [location, setLocation] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [recruiter, setRecruiter] = useState("");
  const [source, setSource] = useState("LinkedIn");
  const [notes, setNotes] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setCheckingAuth(false);
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) { alert("You must be logged in to add a job."); return; }

    const { error } = await supabase.from("jobs").insert([{
      company, role, status, location, job_link: jobLink,
      date_applied: dateApplied, recruiter, source, notes, user_id: user.id,
    }]);

    if (error) { console.error("Error adding job:", error); alert("Failed to add job"); return; }

    setCompany(""); setRole(""); setStatus("Applied"); setLocation("");
    setJobLink(""); setDateApplied(""); setRecruiter(""); setSource("LinkedIn"); setNotes("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Checking authentication…</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">Access Restricted</h1>
          <p className="text-slate-400 text-sm mb-6">You must be signed in to add a job to your tracker.</p>
          <Link href="/auth" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-white">
            Job<span className="text-indigo-400">Track</span>
          </span>
          <div className="flex gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/add-job">Add Job</NavLink>
            <NavLink href="/jobs">All Jobs</NavLink>
            <NavLink href="/auth">Login</NavLink>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-7 bg-indigo-500 rounded-full" />
            <h1 className="text-3xl font-bold tracking-tight">Add New Job</h1>
          </div>
          <p className="text-slate-400 text-sm ml-4">Track a new application in your pipeline</p>
        </div>

        {/* Success toast */}
        {submitted && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-300 font-medium">Job added successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Company Name *</label>
              <input type="text" placeholder="e.g. Google" value={company}
                onChange={(e) => setCompany(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Job Role *</label>
              <input type="text" placeholder="e.g. Software Engineer" value={role}
                onChange={(e) => setRole(e.target.value)} className={inputClass} required />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className={inputClass + " cursor-pointer"}>
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" placeholder="e.g. New York, NY" value={location}
                onChange={(e) => setLocation(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)}
                className={inputClass + " cursor-pointer"}>
                <option>LinkedIn</option>
                <option>Indeed</option>
                <option>Company Website</option>
                <option>Referral</option>
                <option>Recruiter Outreach</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Recruiter Name</label>
              <input type="text" placeholder="e.g. Jane Smith" value={recruiter}
                onChange={(e) => setRecruiter(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Job Link</label>
              <input type="url" placeholder="https://..." value={jobLink}
                onChange={(e) => setJobLink(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date Applied</label>
              <input type="date" value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className={inputClass + " [color-scheme:dark]"} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea placeholder="Interview prep, recruiter details, next steps…" value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass + " resize-none"} rows={4} />
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-800" />

          {/* Submit */}
          <button type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-150 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Job
          </button>
        </form>
      </main>
    </div>
  );
}
