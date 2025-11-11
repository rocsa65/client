const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
};

export { API_BASE_URL };