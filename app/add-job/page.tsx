"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);
      setCheckingAuth(false);
    };

    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You must be logged in to add a job.");
      return;
    }

    const { error } = await supabase.from("jobs").insert([
      {
        company,
        role,
        status,
        location,
        job_link: jobLink,
        date_applied: dateApplied,
        recruiter,
        source,
        notes,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job");
      return;
    }

    setCompany("");
    setRole("");
    setStatus("Applied");
    setLocation("");
    setJobLink("");
    setDateApplied("");
    setRecruiter("");
    setSource("LinkedIn");
    setNotes("");

    alert("Job added successfully");
  };

  if (checkingAuth) {
    return <main className="p-10">Checking login...</main>;
  }

  if (!isLoggedIn) {
    return (
      <main className="p-10 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Add Job</h1>
        <p className="mb-4">You must be logged in to add a job.</p>
        <a href="/auth" className="text-blue-600 underline">
          Go to Login
        </a>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-xl mx-auto">
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

      <h1 className="text-3xl font-bold mb-6">Add Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Job Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Offer</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Recruiter Name"
          value={recruiter}
          onChange={(e) => setRecruiter(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option>LinkedIn</option>
          <option>Indeed</option>
          <option>Company Website</option>
          <option>Referral</option>
          <option>Recruiter Outreach</option>
          <option>Other</option>
        </select>

        <input
          type="url"
          placeholder="Job Link"
          value={jobLink}
          onChange={(e) => setJobLink(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-3 rounded"
          rows={4}
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-3 rounded"
        >
          Add Job
        </button>
      </form>
    </main>
  );
}