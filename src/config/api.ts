// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://hindi-dub-ai.onrender.com/api',
  TIMEOUT: 30000, // 30 seconds
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  ME: '/auth/me',
  
  // Videos
  UPLOAD_VIDEO: '/videos/upload',
  GET_VIDEO: (id: string) => `/videos/${id}`,
  GET_VIDEOS: '/videos',
  DOWNLOAD_VIDEO: (id: string) => `/videos/${id}/download`,
  DELETE_VIDEO: (id: string) => `/videos/${id}`,
  
  // Plans
  GET_PLANS: '/plans',
  CREATE_PLAN: '/plans',
  
  // Payments
  PROCESS_PAYMENT: '/payments/process',
  PAYMENT_HISTORY: '/payments/history',
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper function to get JSON headers
export const getJsonHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  };
};
