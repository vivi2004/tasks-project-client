// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const clearAuth = (): void => {
  localStorage.removeItem('accessToken');
};

// User data management
export const getUser = (): any | null => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Logout helper
export const logout = (): void => {
  clearAuth();
  clearUser();
  // Redirect to login page
  window.location.href = '/login';
};

// Format error message from API response
export const getErrorMessage = (error: any): string => {
  if (error.response) {
    // Server responded with an error status code
    if (error.response.data?.message) {
      return error.response.data.message;
    }
    if (error.response.data?.errors) {
      // Handle validation errors
      return Object.values(error.response.data.errors)
        .flat()
        .join(' ');
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request
    return error.message || 'An error occurred';
  }
  return 'An unknown error occurred';
};
