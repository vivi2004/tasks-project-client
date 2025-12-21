import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, clearAuth } from '../utils/auth';

// Extend the AxiosRequestConfig to include the _retry property
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with base URL and headers
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with requests
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        const { accessToken } = response.data;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          
          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect to login
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorData: ErrorResponse = error.response.data || {};
      const errorMessage = errorData.message || error.response.statusText || 'An error occurred';
      
      // Handle validation errors (422 Unprocessable Entity)
      if (error.response.status === 422 && (errorData.errors || errorData.data?.errors)) {
        const errors = errorData.errors || errorData.data?.errors || {};
        // Format validation errors into a single string
        const validationErrors = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        return Promise.reject(new Error(validationErrors || 'Validation failed'));
      }
      
      // Handle other error responses
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error);
    }
  }
);

export default api;
