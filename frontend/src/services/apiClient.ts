import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create a hook that returns an authenticated axios instance
export const useApiClient = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include auth token
  apiClient.interceptors.request.use(
    async (config) => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            },
          });
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.warn('Could not get access token:', error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.data) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject({
        success: false,
        message: error.message || 'Network error occurred'
      });
    }
  );

  return apiClient;
};