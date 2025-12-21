import api from './api';

import type { Job, JobProgressResponse, JobStatus, PaginatedJobsResponse } from '../types/job.types';

type GetJobsParams = {
  page?: number;
  limit?: number;
  status?: JobStatus;
};

export const jobApi = {
  getJobs: async (params: GetJobsParams = {}): Promise<PaginatedJobsResponse> => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getJob: async (id: string): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  getJobProgress: async (id: string): Promise<JobProgressResponse> => {
    const response = await api.get(`/jobs/${id}/progress`);
    return response.data;
  },

  cancelJob: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/jobs/${id}/cancel`);
    return response.data;
  },
};

export default jobApi;
