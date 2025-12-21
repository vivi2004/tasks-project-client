import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import jobApi from '../api/jobApi';

import type { Job, JobStatus } from '../types/job.types';

const statusLabel: Record<JobStatus, string> = {
  queued: 'Queued',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

const statusPillClass: Record<JobStatus, string> = {
  queued: 'bg-gray-100 text-gray-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-yellow-100 text-yellow-800',
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const canCancel = (jobStatus: JobStatus) => jobStatus !== 'completed' && jobStatus !== 'failed' && jobStatus !== 'cancelled';

  const fetchJobs = async () => {
    try {
      setError(null);
      const res = await jobApi.getJobs({ page: 1, limit: 20, status: status === 'all' ? undefined : status });
      setJobs(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const headerSubtitle = useMemo(() => {
    if (status === 'all') return 'Track background processing and AI jobs.';
    return `Showing ${statusLabel[status]} jobs.`;
  }, [status]);

  const onCancel = async (id: string) => {
    try {
      setIsRefreshing(true);
      await jobApi.cancelJob(id);
      await fetchJobs();
    } catch (err: any) {
      setIsRefreshing(false);
      setError(err?.response?.data?.message || 'Failed to cancel job');
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="mt-1 text-sm text-gray-600">{headerSubtitle}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/jobs/process"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Process File
          </Link>
          <div>
            <label htmlFor="status" className="sr-only">Filter by status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus | 'all')}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All</option>
              <option value="queued">Queued</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchJobs();
            }}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={loading || isRefreshing}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg bg-white p-10 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
            <BriefcaseIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No jobs found</h3>
          <p className="mt-2 text-sm text-gray-600">Jobs will appear here when you start processing files.</p>
          <div className="mt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{job.type}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusPillClass[job.status]}`}>
                        {statusLabel[job.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => onCancel(job._id)}
                          disabled={!canCancel(job.status) || isRefreshing}
                          className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
