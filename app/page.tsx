export default function Home() {
  return (
    <main className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Job Tracker Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Track your job applications, interviews, and offers in one place.
      </p>

      <div className="flex justify-center gap-4">
        <a
          href="/add-job"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Add Job
        </a>

        <a
          href="/jobs"
          className="bg-gray-800 text-white px-6 py-3 rounded"
        >
          View Jobs
        </a>
      </div>
    </main>
  );
}