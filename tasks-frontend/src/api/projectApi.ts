import api from './api';

import type { Project, ProjectInput } from '../types/project.types';

type ApiProject = Project & {
  owner?: string;
  attachments?: Array<{
    url: string;
    public_id: string;
    format: string;
    bytes: number;
  }>;
};

export const projectApi = {
  // Get all projects for the current user
  getProjects: async (): Promise<ApiProject[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get a single project by ID
  getProject: async (id: string): Promise<ApiProject> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create a new project
  createProject: async (data: ProjectInput): Promise<ApiProject> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Update an existing project
  updateProject: async (id: string, data: Partial<ProjectInput>): Promise<ApiProject> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete a project (soft delete)
  deleteProject: async (id: string): Promise<{ message: string; project: ApiProject }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Upload attachment to a project
  uploadAttachment: async (projectId: string, file: File): Promise<ApiProject> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/projects/${projectId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Remove an attachment from a project
  removeAttachment: async (projectId: string, attachmentId: string): Promise<ApiProject> => {
    const response = await api.delete(`/projects/${projectId}/attachments/${attachmentId}`);
    return response.data;
  },
};

export default projectApi;
