import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import jobApi from '../api/jobApi';

import type { JobProgressResponse, JobStatus } from '../types/job.types';

const statusLabel: Record<JobStatus, string> = {
  queued: 'Queued',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export default function JobDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<JobProgressResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProgress = async () => {
    if (!id) return;
    try {
      setError(null);
      const res = await jobApi.getJobProgress(id);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load job progress');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (!data) return;

    const done = data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled';
    if (done) return;

    const interval = window.setInterval(() => {
      fetchProgress();
    }, 2000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, data?.status]);

  const progressText = useMemo(() => {
    if (!data) return '';
    const base = `${statusLabel[data.status]} • ${data.progress}%`;
    if (data.etaSeconds == null) return base;
    return `${base} • ETA ~${data.etaSeconds}s`;
  }, [data]);

  if (!id) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-700">Job ID is missing.</p>
          <div className="mt-4">
            <Link to="/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Back to Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Progress</h1>
          <p className="mt-1 text-sm text-gray-600">Job ID: <span className="font-mono">{id}</span></p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back to Jobs
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchProgress();
            }}
            disabled={loading || isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
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
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">Loading...</div>
      ) : !data ? (
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">No data.</div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{progressText}</p>
              <p className="mt-1 text-xs text-gray-500">Auto-refreshes while processing.</p>
            </div>
            <span className="text-xs text-gray-500">Updated just now</span>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, data.progress))}%` }}
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900">Timeline</h2>
            <div className="mt-3 space-y-2">
              {(data.timelineFormatted || []).length === 0 ? (
                <p className="text-sm text-gray-600">No timeline events yet.</p>
              ) : (
                (data.timelineFormatted || []).map((entry: any, idx: number) => (
                  <div key={idx} className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    <span className="font-mono text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                    <div className="mt-1">{entry.event}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
