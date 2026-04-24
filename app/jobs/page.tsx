"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Job = {
  id: string;
  company: string;
  role: string;
  status: string;
  location: string;
  job_link: string;
  date_applied: string;
  recruiter: string;
  source: string;
  notes: string;
  user_id: string;
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setJobs([]);
      setErrorMessage("You must be logged in to view your jobs.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user.id)
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmed) return;

    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
      return;
    }

    fetchJobs();
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status })
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

  const totalJobs = jobs.length;
  const interviewJobs = jobs.filter((j) => j.status === "Interview").length;
  const rejectedJobs = jobs.filter((j) => j.status === "Rejected").length;
  const offerJobs = jobs.filter((j) => j.status === "Offer").length;

  const interviewRate =
    totalJobs > 0 ? ((interviewJobs / totalJobs) * 100).toFixed(1) : "0";

  const rejectionRate =
    totalJobs > 0 ? ((rejectedJobs / totalJobs) * 100).toFixed(1) : "0";

  const offerRate =
    totalJobs > 0 ? ((offerJobs / totalJobs) * 100).toFixed(1) : "0";

  const chartData = [
    {
      name: "Applied",
      value: jobs.filter((j) => j.status === "Applied").length,
    },
    {
      name: "Interview",
      value: jobs.filter((j) => j.status === "Interview").length,
    },
    {
      name: "Rejected",
      value: jobs.filter((j) => j.status === "Rejected").length,
    },
    {
      name: "Offer",
      value: jobs.filter((j) => j.status === "Offer").length,
    },
  ];

  const applicationsByDate: Record<string, number> = {};

  jobs.forEach((job) => {
    const date = job.date_applied || "No Date";

    if (applicationsByDate[date]) {
      applicationsByDate[date] += 1;
    } else {
      applicationsByDate[date] = 1;
    }
  });

  const timelineData = Object.entries(applicationsByDate).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  const sourceCounts: Record<string, number> = {};

  jobs.forEach((job) => {
    const source = job.source || "Unknown";

    if (sourceCounts[source]) {
      sourceCounts[source] += 1;
    } else {
      sourceCounts[source] = 1;
    }
  });

  const sourceChartData = Object.entries(sourceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const sourceInsights = Object.entries(sourceCounts).map(([source, total]) => {
  const jobsFromSource = jobs.filter(
    (job) => (job.source || "Unknown") === source
  );

  const interviewsFromSource = jobsFromSource.filter(
    (job) => job.status === "Interview"
  ).length;

  const offersFromSource = jobsFromSource.filter(
    (job) => job.status === "Offer"
  ).length;

  const interviewRate =
    total > 0 ? ((interviewsFromSource / total) * 100).toFixed(1) : "0";

  return {
    source,
    total,
    interviews: interviewsFromSource,
    offers: offersFromSource,
    interviewRate,
  };
});

const bestSource =
  sourceInsights.length > 0
    ? sourceInsights.reduce((best, current) => {
        return parseFloat(current.interviewRate) >
          parseFloat(best.interviewRate)
          ? current
          : best;
      })
    : { source: "None", interviewRate: "0" };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || job.status === statusFilter;

    const matchesSource =
      sourceFilter === "All" || job.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4 flex-wrap">
        <Link href="/" className="text-blue-600 underline">
          Home
        </Link>
        <Link href="/add-job" className="text-blue-600 underline">
          Add Job
        </Link>
        <Link href="/auth" className="text-blue-600 underline">
          Login
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Your Jobs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-600">Interview Rate</p>
          <h2 className="text-2xl font-bold">{interviewRate}%</h2>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-600">Rejection Rate</p>
          <h2 className="text-2xl font-bold">{rejectionRate}%</h2>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-600">Offer Rate</p>
          <h2 className="text-2xl font-bold">{offerRate}%</h2>
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

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option>All</option>
          <option>LinkedIn</option>
          <option>Indeed</option>
          <option>Company Website</option>
          <option>Referral</option>
          <option>Recruiter Outreach</option>
          <option>Other</option>
          <option>Unknown</option>
        </select>
      </div>

      <div className="border p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Application Status Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Applications Timeline</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Applications by Source</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sourceChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    <div className="border p-4 rounded mb-6 bg-green-50">
      <h2 className="text-lg font-semibold mb-2">Top Performing Source</h2>

      <p className="text-sm">
        Your best source is <strong>{bestSource.source}</strong> with an interview
        rate of <strong>{bestSource.interviewRate}%</strong>
      </p>
    </div>

      <div className="border p-4 rounded mb-6">
  <h2 className="text-lg font-semibold mb-4">Source Success Insights</h2>

  <div className="space-y-3">
        {sourceInsights.map((item) => (
          <div key={item.source} className="border p-3 rounded">
            <h3 className="font-bold">{item.source}</h3>
            <p className="text-sm">Applications: {item.total}</p>
            <p className="text-sm">Interviews: {item.interviews}</p>
            <p className="text-sm">Offers: {item.offers}</p>
            <p className="text-sm">Interview Rate: {item.interviewRate}%</p>
          </div>
        ))}
      </div>
    </div>

      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : filteredJobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="border p-5 rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-2xl font-bold">{job.company}</h2>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                  job.status
                )}`}
              >
                {job.status}
              </span>

              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <strong>Role:</strong> {job.role}
                </p>
                <p>
                  <strong>Location:</strong> {job.location || "Not provided"}
                </p>
                <p>
                  <strong>Recruiter:</strong> {job.recruiter || "Not provided"}
                </p>
                <p>
                  <strong>Source:</strong> {job.source || "Not provided"}
                </p>
                <p>
                  <strong>Date Applied:</strong>{" "}
                  {job.date_applied || "Not provided"}
                </p>
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
                <p className="text-sm text-gray-700">
                  {job.notes || "Not provided"}
                </p>
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

              <div className="mt-4 flex gap-3 flex-wrap">
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
                  onClick={() => handleDelete(job.id)}
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