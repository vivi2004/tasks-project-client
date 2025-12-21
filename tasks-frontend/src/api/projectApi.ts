import api from './api';

interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  attachments?: Array<{
    url: string;
    public_id: string;
    format: string;
    bytes: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateProjectData {
  name: string;
  description?: string;
}

export const projectApi = {
  // Get all projects for the current user
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get a single project by ID
  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create a new project
  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Update an existing project
  updateProject: async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  // Delete a project (soft delete)
  deleteProject: async (id: string): Promise<{ message: string; project: Project }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Upload attachment to a project
  uploadAttachment: async (projectId: string, file: File): Promise<Project> => {
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
  removeAttachment: async (projectId: string, attachmentId: string): Promise<Project> => {
    const response = await api.delete(`/projects/${projectId}/attachments/${attachmentId}`);
    return response.data;
  },
};

export default projectApi;
