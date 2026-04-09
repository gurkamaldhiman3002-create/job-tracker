import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Job Tracker App</h1>
      <p className="mb-6">Manage your job applications step by step.</p>

      <div className="space-y-3">
        <div>
          <Link href="/add-job" className="text-blue-600 underline">
            Go to Add Job
          </Link>
        </div>

        <div>
          <Link href="/jobs" className="text-blue-600 underline">
            Go to All Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}