import api from './api';

export type UploadFileResponse = {
  message: string;
  fileUrl: string;
  publicId?: string;
  format?: string;
  bytes?: number;
};

export const uploadApi = {
  uploadFile: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default uploadApi;
