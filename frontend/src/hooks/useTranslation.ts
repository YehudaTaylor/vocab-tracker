import { useState, useCallback } from 'react';
import { useApiClient } from '../services/apiClient';
import { TranslationResponse, ApiError } from '../types';

interface UseTranslationResult {
  translation: TranslationResponse | null;
  loading: boolean;
  error: string | null;
  translateWord: (word: string, targetLanguage?: string) => Promise<void>;
  clearError: () => void;
  clearTranslation: () => void;
}

export const useTranslation = (): UseTranslationResult => {
  const [translation, setTranslation] = useState<TranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();

  const translateWord = useCallback(async (word: string, targetLanguage: string = 'he') => {
    if (!word.trim()) {
      setError('Please enter a word to translate');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/translations/translate', {
        word: word.trim(),
        targetLanguage
      });
      setTranslation(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to translate word');
      setTranslation(null);
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearTranslation = useCallback(() => {
    setTranslation(null);
    setError(null);
  }, []);

  return {
    translation,
    loading,
    error,
    translateWord,
    clearError,
    clearTranslation
  };
};