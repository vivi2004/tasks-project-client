import api from './api';

import type { CreateTaskInput, PaginatedTasksResponse, Task, UpdateTaskInput } from '../types/task.types';

type GetTasksParams = {
  page?: number;
  limit?: number;
};

export const taskApi = {
  getTasks: async (projectId: string, params: GetTasksParams = {}): Promise<PaginatedTasksResponse> => {
    const response = await api.get(`/projects/${projectId}/tasks`, { params });
    return response.data;
  },

  createTask: async (projectId: string, data: CreateTaskInput): Promise<Task> => {
    const response = await api.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  updateTask: async (projectId: string, taskId: string, data: UpdateTaskInput): Promise<Task> => {
    const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (projectId: string, taskId: string): Promise<{ message: string; task: Task }> => {
    const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  uploadAttachment: async (projectId: string, taskId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/projects/${projectId}/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default taskApi;
