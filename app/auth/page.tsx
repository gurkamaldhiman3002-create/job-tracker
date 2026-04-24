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

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const refreshCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setCurrentUserEmail(""); return; }
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) { console.error("Error getting user:", error.message); setCurrentUserEmail(""); return; }
    setCurrentUserEmail(user?.email || "");
  };

  useEffect(() => {
    refreshCurrentUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { refreshCurrentUser(); });
    return () => { subscription.unsubscribe(); };
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { alert(error.message); return; }
    await refreshCurrentUser();
    alert("Sign up successful. Check your email if confirmation is required.");
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { alert(error.message); return; }
    await refreshCurrentUser();
    alert("Login successful");
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) { alert(error.message); return; }
    setCurrentUserEmail("");
    alert("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Nav */}
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

      {/* Main */}
      <main className="flex items-center justify-center min-h-[calc(100vh-65px)] px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-5">
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-slate-400 mt-2 text-sm">Sign in to your account or create a new one</p>
          </div>

          {/* Status badge */}
          {currentUserEmail ? (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
              <p className="text-sm text-emerald-300">
                Signed in as <span className="font-semibold text-emerald-200">{currentUserEmail}</span>
              </p>
            </div>
          ) : (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
              <p className="text-sm text-slate-400">No user is currently signed in</p>
            </div>
          )}

          {/* Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-150 text-sm"
              >
                {loading ? "Please wait…" : "Sign In"}
              </button>

              <button
                type="button"
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 font-semibold py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-150 text-sm"
              >
                {loading ? "Please wait…" : "Create Account"}
              </button>
            </div>

            {/* Divider + sign out */}
            {currentUserEmail && (
              <>
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-xs text-slate-600 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full bg-transparent hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 font-semibold py-3 px-4 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-colors duration-150 text-sm"
                >
                  {loading ? "Please wait…" : "Sign Out"}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
