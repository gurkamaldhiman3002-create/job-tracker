"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // ✅ FIXED: safe user fetch (no error after logout)
  const refreshCurrentUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setCurrentUserEmail("");
      return;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error.message);
      setCurrentUserEmail("");
      return;
    }

    setCurrentUserEmail(user?.email || "");
  };

  useEffect(() => {
    refreshCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshCurrentUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await refreshCurrentUser();
    alert("Sign up successful. Check your email if confirmation is required.");
  };

  const handleSignIn = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await refreshCurrentUser();
    alert("Login successful");
  };

  const handleSignOut = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setCurrentUserEmail("");
    alert("Logged out successfully");
  };

  return (
    <main className="p-10 max-w-md mx-auto">
      <div className="mb-6 flex gap-4 flex-wrap">
        <Link href="/" className="text-blue-600 underline">
          Home
        </Link>
        <Link href="/add-job" className="text-blue-600 underline">
          Add Job
        </Link>
        <Link href="/jobs" className="text-blue-600 underline">
          All Jobs
        </Link>
        <Link href="/auth" className="text-blue-600 underline">
          Login
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Login / Sign Up</h1>

      {currentUserEmail ? (
        <p className="mb-4 text-green-700">
          Logged in as: <strong>{currentUserEmail}</strong>
        </p>
      ) : (
        <p className="mb-4 text-gray-600">No user is logged in.</p>
      )}

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Please wait..." : "Log In"}
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={loading}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Please wait..." : "Log Out"}
          </button>
        </div>
      </div>
    </main>
  );
}