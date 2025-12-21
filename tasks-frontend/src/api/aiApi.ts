import api from './api';

export const aiApi = {
  extractText: async (fileUrl: string): Promise<{ message: string; jobId: string }> => {
    const response = await api.post('/ai/extract-text', { fileUrl });
    return response.data;
  },
};

export default aiApi;
