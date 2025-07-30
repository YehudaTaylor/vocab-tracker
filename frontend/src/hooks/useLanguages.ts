import { useState, useEffect } from 'react';
import { translationApi } from '../services/api';

interface UseLanguagesResult {
  languages: { [key: string]: string };
  loading: boolean;
  error: string | null;
}

export const useLanguages = (): UseLanguagesResult => {
  const [languages, setLanguages] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await translationApi.getSupportedLanguages();
        setLanguages(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, loading, error };
};