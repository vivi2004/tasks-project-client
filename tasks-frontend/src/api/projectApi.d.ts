import { AxiosInstance } from 'axios';

declare module '../api/projectApi' {
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

  const projectApi: {
    getProjects: () => Promise<Project[]>;
    getProject: (id: string) => Promise<Project>;
    createProject: (data: CreateProjectData) => Promise<Project>;
    updateProject: (id: string, data: Partial<CreateProjectData>) => Promise<Project>;
    deleteProject: (id: string) => Promise<{ message: string; project: Project }>;
    uploadAttachment: (projectId: string, file: File) => Promise<Project>;
    removeAttachment: (projectId: string, attachmentId: string) => Promise<Project>;
  };

  export default projectApi;
}
