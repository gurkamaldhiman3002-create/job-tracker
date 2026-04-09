"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Job = {
  id: string;
  company: string;
  role: string;
  status: string;
  location: string;
  job_link: string;
  date_applied: string;
  recruiter: string;
  notes: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editRecruiter, setEditRecruiter] = useState("");
  const [editDateApplied, setEditDateApplied] = useState("");
  const [editJobLink, setEditJobLink] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("date_applied", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      setErrorMessage("Failed to load jobs.");
      setLoading(false);
      return;
    }

    setJobs(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
      return;
    }

    fetchJobs();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
      return;
    }

    fetchJobs();
  };

  const handleSaveEdit = async (id: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({
        company: editCompany,
        role: editRole,
        location: editLocation,
        recruiter: editRecruiter,
        date_applied: editDateApplied,
        job_link: editJobLink,
        notes: editNotes,
      })
      .eq("id", id);

    if (error) {
      console.error("Error saving edits:", error);
      alert("Failed to save changes");
      return;
    }

    setEditingJobId(null);
    fetchJobs();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Interview":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Offer":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter((job) => job.status === "Applied").length;
  const interviewJobs = jobs.filter((job) => job.status === "Interview").length;
  const rejectedJobs = jobs.filter((job) => job.status === "Rejected").length;
  const offerJobs = jobs.filter((job) => job.status === "Offer").length;

  return (
    <main className="p-10 max-w-3xl mx-auto">
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

      <h1 className="text-3xl font-bold mb-6">All Jobs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-600">Total Jobs</p>
          <h2 className="text-2xl font-bold">{totalJobs}</h2>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-600">Applied</p>
          <h2 className="text-2xl font-bold">{appliedJobs}</h2>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-600">Interview</p>
          <h2 className="text-2xl font-bold">{interviewJobs}</h2>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-600">Rejected</p>
          <h2 className="text-2xl font-bold">{rejectedJobs}</h2>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-600">Offer</p>
          <h2 className="text-2xl font-bold">{offerJobs}</h2>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search by company or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Offer</option>
        </select>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : filteredJobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="border p-5 rounded-lg shadow-sm bg-white">
              <h2 className="text-2xl font-bold">{job.company}</h2>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                  job.status
                )}`}
              >
                {job.status}
              </span>

              <div className="mt-3 space-y-1 text-sm">
                <p><strong>Role:</strong> {job.role}</p>
                <p><strong>Location:</strong> {job.location || "Not provided"}</p>
                <p><strong>Recruiter:</strong> {job.recruiter || "Not provided"}</p>
                <p><strong>Date Applied:</strong> {job.date_applied || "Not provided"}</p>
              </div>

              <div className="mt-3">
                <p className="font-semibold">Job Link:</p>
                <p className="text-sm">
                  {job.job_link ? (
                    <a
                      href={job.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Open Job Post
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>

              <div className="mt-3">
                <p className="font-semibold">Notes:</p>
                <p className="text-sm text-gray-700">{job.notes || "Not provided"}</p>
              </div>

              <div className="mt-3">
                <label className="block mb-1 font-medium">Status</label>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Rejected</option>
                  <option>Offer</option>
                </select>
              </div>

              {editingJobId === job.id && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Company"
                  />

                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Role"
                  />

                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Location"
                  />

                  <input
                    type="text"
                    value={editRecruiter}
                    onChange={(e) => setEditRecruiter(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Recruiter"
                  />

                  <input
                    type="date"
                    value={editDateApplied}
                    onChange={(e) => setEditDateApplied(e.target.value)}
                    className="w-full border p-2 rounded"
                  />

                  <input
                    type="url"
                    value={editJobLink}
                    onChange={(e) => setEditJobLink(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Job Link"
                  />

                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Notes"
                    rows={3}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSaveEdit(job.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => setEditingJobId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setEditingJobId(job.id);
                    setEditCompany(job.company);
                    setEditRole(job.role);
                    setEditLocation(job.location || "");
                    setEditRecruiter(job.recruiter || "");
                    setEditDateApplied(job.date_applied || "");
                    setEditJobLink(job.job_link || "");
                    setEditNotes(job.notes || "");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this job?"
                    );
                    if (confirmed) {
                      handleDelete(job.id);
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}