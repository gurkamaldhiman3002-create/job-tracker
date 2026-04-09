"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Job = {
  company: string;
  role: string;
  status: string;
  location: string;
  jobLink: string;
  dateApplied: string;
  notes: string;
};

export default function AddJobPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [location, setLocation] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [recruiter, setRecruiter] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

const { error } = await supabase.from("jobs").insert([
  {
    company,
    role,
    status,
    location,
    job_link: jobLink,
    date_applied: dateApplied,
    recruiter,
    notes,
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
    setNotes("");

    alert("Job added successfully");
  };

  return (
    <main className="p-10 max-w-xl mx-auto">

          <div className="mb-6 flex gap-4">
      <Link href="/" className="text-blue-600 underline">
        Home
      </Link>
      <Link href="/add-job" className="text-blue-600 underline">
        Add Job
      </Link>
      <Link href="/jobs" className="text-blue-600 underline">
        All Jobs
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