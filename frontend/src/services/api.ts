import axios, { AxiosResponse } from 'axios';
import {
  TranslationResponse,
  TranslationHistoryResponse,
  ReviewWordsResponse,
  LanguagesResponse,
  ApiError
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data as ApiError);
    }
    return Promise.reject({
      success: false,
      message: error.message || 'Network error occurred'
    } as ApiError);
  }
);

export const translationApi = {
  translateWord: async (
    word: string, 
    targetLanguage: string = 'he'
  ): Promise<TranslationResponse> => {
    const response: AxiosResponse<TranslationResponse> = await api.post('/translations/translate', {
      word: word.trim(),
      targetLanguage
    });
    return response.data;
  },

  getTranslationHistory: async (
    page: number = 1,
    limit: number = 20,
    targetLanguage?: string
  ): Promise<TranslationHistoryResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (targetLanguage) {
      params.append('targetLanguage', targetLanguage);
    }

    const response: AxiosResponse<TranslationHistoryResponse> = await api.get(
      `/translations/history?${params}`
    );
    return response.data;
  },

  getWordsForReview: async (limit: number = 10): Promise<ReviewWordsResponse> => {
    const response: AxiosResponse<ReviewWordsResponse> = await api.get(
      `/translations/review?limit=${limit}`
    );
    return response.data;
  },

  reviewWord: async (
    id: string,
    responseQuality: number,
    correct: boolean = true
  ): Promise<{ success: boolean; data: any }> => {
    const response = await api.put(`/translations/review/${id}`, {
      responseQuality,
      correct
    });
    return response.data;
  },

  getSupportedLanguages: async (): Promise<LanguagesResponse> => {
    const response: AxiosResponse<LanguagesResponse> = await api.get('/translations/languages');
    return response.data;
  }
};

export default api;