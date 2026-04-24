"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

type Job = {
  id: string; company: string; role: string; status: string;
  location: string; job_link: string; date_applied: string;
  recruiter: string; source: string; notes: string; user_id: string;
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150 tracking-wide uppercase">
    {children}
  </Link>
);

const inputClass = "w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Applied:   { bg: "bg-blue-500/10",    text: "text-blue-400",    dot: "bg-blue-400" },
  Interview: { bg: "bg-amber-500/10",   text: "text-amber-400",   dot: "bg-amber-400" },
  Rejected:  { bg: "bg-red-500/10",     text: "text-red-400",     dot: "bg-red-400" },
  Offer:     { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
};

const CHART_COLORS: Record<string, string> = {
  Applied: "#60a5fa", Interview: "#fbbf24", Rejected: "#f87171", Offer: "#34d399",
};

const StatCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">{label}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </div>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-white font-bold">{payload[0].value}</p>
    </div>
  );
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editRecruiter, setEditRecruiter] = useState("");
  const [editDateApplied, setEditDateApplied] = useState("");
  const [editJobLink, setEditJobLink] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true); setErrorMessage("");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) { setJobs([]); setErrorMessage("You must be logged in to view your jobs."); setLoading(false); return; }
    const { data, error } = await supabase.from("jobs").select("*").eq("user_id", user.id).order("date_applied", { ascending: false });
    if (error) { console.error("Error fetching jobs:", error); setErrorMessage("Failed to load jobs."); setLoading(false); return; }
    setJobs(data || []); setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) { alert("Failed to delete job"); return; }
    fetchJobs();
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from("jobs").update({ status }).eq("id", id);
    if (error) { alert("Failed to update status"); return; }
    fetchJobs();
  };

  const handleSaveEdit = async (id: string) => {
    const { error } = await supabase.from("jobs").update({
      company: editCompany, role: editRole, location: editLocation,
      recruiter: editRecruiter, date_applied: editDateApplied, job_link: editJobLink, notes: editNotes,
    }).eq("id", id);
    if (error) { alert("Failed to save changes"); return; }
    setEditingJobId(null); fetchJobs();
  };

  const totalJobs = jobs.length;
  const interviewJobs = jobs.filter((j) => j.status === "Interview").length;
  const rejectedJobs = jobs.filter((j) => j.status === "Rejected").length;
  const offerJobs = jobs.filter((j) => j.status === "Offer").length;
  const interviewRate = totalJobs > 0 ? ((interviewJobs / totalJobs) * 100).toFixed(1) : "0";
  const rejectionRate = totalJobs > 0 ? ((rejectedJobs / totalJobs) * 100).toFixed(1) : "0";
  const offerRate = totalJobs > 0 ? ((offerJobs / totalJobs) * 100).toFixed(1) : "0";

  const chartData = ["Applied", "Interview", "Rejected", "Offer"].map((s) => ({
    name: s, value: jobs.filter((j) => j.status === s).length,
  }));

  const applicationsByDate: Record<string, number> = {};
  jobs.forEach((job) => {
    const date = job.date_applied || "No Date";
    applicationsByDate[date] = (applicationsByDate[date] || 0) + 1;
  });
  const timelineData = Object.entries(applicationsByDate).map(([date, count]) => ({ date, count }));

  const sourceCounts: Record<string, number> = {};
  jobs.forEach((job) => { const s = job.source || "Unknown"; sourceCounts[s] = (sourceCounts[s] || 0) + 1; });
  const sourceChartData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  const sourceInsights = Object.entries(sourceCounts).map(([source, total]) => {
    const jobsFromSource = jobs.filter((job) => (job.source || "Unknown") === source);
    const interviewsFromSource = jobsFromSource.filter((job) => job.status === "Interview").length;
    const offersFromSource = jobsFromSource.filter((job) => job.status === "Offer").length;
    const iRate = total > 0 ? ((interviewsFromSource / total) * 100).toFixed(1) : "0";
    return { source, total, interviews: interviewsFromSource, offers: offersFromSource, interviewRate: iRate };
  });

  const bestSource = sourceInsights.length > 0
    ? sourceInsights.reduce((best, cur) => parseFloat(cur.interviewRate) > parseFloat(best.interviewRate) ? cur : best)
    : { source: "None", interviewRate: "0" };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) || job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    const matchesSource = sourceFilter === "All" || job.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const statusCfg = (s: string) => STATUS_CONFIG[s] || { bg: "bg-slate-800", text: "text-slate-400", dot: "bg-slate-400" };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-8 py-4 sticky top-0 z-10 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-white">Job<span className="text-indigo-400">Track</span></span>
          <div className="flex gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/add-job">Add Job</NavLink>
            <NavLink href="/jobs">All Jobs</NavLink>
            <NavLink href="/auth">Login</NavLink>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 bg-indigo-500 rounded-full" />
              <h1 className="text-3xl font-bold tracking-tight">Your Pipeline</h1>
            </div>
            <p className="text-slate-400 text-sm ml-4">{totalJobs} application{totalJobs !== 1 ? "s" : ""} tracked</p>
          </div>
          <Link href="/add-job" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Job
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total" value={String(totalJobs)} sub="applications" />
          <StatCard label="Interview Rate" value={`${interviewRate}%`} sub={`${interviewJobs} interviews`} />
          <StatCard label="Rejection Rate" value={`${rejectionRate}%`} sub={`${rejectedJobs} rejections`} />
          <StatCard label="Offer Rate" value={`${offerRate}%`} sub={`${offerJobs} offers`} />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          {/* Status Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-5">Status Overview</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barCategoryGap="35%">
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={CHART_COLORS[entry.name] || "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Applications Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-5">Applications Timeline</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={timelineData}>
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Source Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-5">Applications by Source</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sourceChartData} barCategoryGap="35%">
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Best Source + Source Insights */}
          <div className="space-y-4">
            {/* Best source */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
                <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Top Source</h2>
              </div>
              <p className="text-lg font-bold text-white">{bestSource.source}</p>
              <p className="text-sm text-slate-400 mt-0.5">{bestSource.interviewRate}% interview rate</p>
            </div>

            {/* Source insights scroll list */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-h-[180px] overflow-y-auto">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Source Breakdown</h2>
              <div className="space-y-3">
                {sourceInsights.map((item) => (
                  <div key={item.source} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium">{item.source}</span>
                    <div className="flex gap-4 text-slate-500 text-xs">
                      <span>{item.total} apps</span>
                      <span className="text-amber-400">{item.interviews} interviews</span>
                      <span className="text-emerald-400">{item.offers} offers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Filter Jobs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="Search company or role…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} className={inputClass} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass + " cursor-pointer"}>
              <option>All</option><option>Applied</option><option>Interview</option><option>Rejected</option><option>Offer</option>
            </select>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={inputClass + " cursor-pointer"}>
              <option>All</option><option>LinkedIn</option><option>Indeed</option><option>Company Website</option>
              <option>Referral</option><option>Recruiter Outreach</option><option>Other</option><option>Unknown</option>
            </select>
          </div>
        </div>

        {/* Job cards */}
        {loading ? (
          <div className="flex items-center gap-3 text-slate-400 py-12 justify-center">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading jobs…</span>
          </div>
        ) : errorMessage ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">{errorMessage}</p>
            <Link href="/auth" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm underline">Go to Login</Link>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500 text-sm">No matching jobs found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const cfg = statusCfg(job.status);
              return (
                <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{job.company}</h2>
                      <p className="text-slate-400 text-sm mt-0.5">{job.role}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {job.status}
                    </span>
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Location", val: job.location },
                      { label: "Recruiter", val: job.recruiter },
                      { label: "Source", val: job.source },
                      { label: "Date Applied", val: job.date_applied },
                    ].filter(({ val }) => val).map(({ label, val }) => (
                      <div key={label} className="bg-slate-800/50 rounded-xl px-3 py-2">
                        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                        <p className="text-sm text-slate-200 font-medium truncate">{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Job link */}
                  {job.job_link && (
                    <a href={job.job_link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 mb-4 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Job Posting
                    </a>
                  )}

                  {/* Notes */}
                  {job.notes && (
                    <div className="bg-slate-800/40 rounded-xl px-4 py-3 mb-4">
                      <p className="text-xs text-slate-500 mb-1">Notes</p>
                      <p className="text-sm text-slate-300">{job.notes}</p>
                    </div>
                  )}

                  {/* Status change */}
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold flex-shrink-0">Status</label>
                    <select value={job.status} onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                      <option>Applied</option><option>Interview</option><option>Rejected</option><option>Offer</option>
                    </select>
                  </div>

                  {/* Edit form */}
                  {editingJobId === job.id && (
                    <div className="mt-4 pt-5 border-t border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { placeholder: "Company", value: editCompany, setter: setEditCompany },
                          { placeholder: "Role", value: editRole, setter: setEditRole },
                          { placeholder: "Location", value: editLocation, setter: setEditLocation },
                          { placeholder: "Recruiter", value: editRecruiter, setter: setEditRecruiter },
                        ].map(({ placeholder, value, setter }) => (
                          <input key={placeholder} type="text" value={value} placeholder={placeholder}
                            onChange={(e) => setter(e.target.value)} className={inputClass} />
                        ))}
                        <input type="date" value={editDateApplied} onChange={(e) => setEditDateApplied(e.target.value)}
                          className={inputClass + " [color-scheme:dark]"} />
                        <input type="url" value={editJobLink} placeholder="Job Link"
                          onChange={(e) => setEditJobLink(e.target.value)} className={inputClass} />
                      </div>
                      <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Notes" className={inputClass + " resize-none"} rows={3} />
                      <div className="flex gap-3">
                        <button onClick={() => handleSaveEdit(job.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors">
                          Save Changes
                        </button>
                        <button onClick={() => setEditingJobId(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-2 rounded-xl text-sm transition-colors border border-slate-700">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3">
                    <button onClick={() => {
                      setEditingJobId(job.id); setEditCompany(job.company); setEditRole(job.role);
                      setEditLocation(job.location || ""); setEditRecruiter(job.recruiter || "");
                      setEditDateApplied(job.date_applied || ""); setEditJobLink(job.job_link || ""); setEditNotes(job.notes || "");
                    }}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors border border-slate-700">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(job.id)}
                      className="flex items-center gap-1.5 text-sm text-red-400 hover:text-white hover:bg-red-600 bg-red-500/10 px-4 py-2 rounded-xl transition-colors border border-red-500/20 hover:border-transparent">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
