import React, { useState, useEffect } from 'react';
import { Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { translationApi } from '../services/api';
import { Translation } from '../types';
import { useLanguages } from '../hooks/useLanguages';

interface TranslationHistoryProps {
  refreshTrigger?: number;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({ refreshTrigger }) => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  
  const { languages } = useLanguages();

  const fetchHistory = async (page: number = 1, language?: string) => {
    try {
      setLoading(true);
      const response = await translationApi.getTranslationHistory(page, 10, language);
      setTranslations(response.data.translations);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load translation history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1, selectedLanguage);
  }, [selectedLanguage, refreshTrigger]);

  const handlePageChange = (page: number) => {
    fetchHistory(page, selectedLanguage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && translations.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Clock size={24} />
          <span>Translation History</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="">All Languages</option>
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {translations.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No translations found</div>
          <div className="text-gray-500">Start translating words to see your history here!</div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {translations.map((translation) => (
              <div
                key={translation.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-gray-800">
                        {translation.englishWord}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span 
                        className={`font-semibold text-primary-600 ${
                          translation.targetLanguage === 'he' ? 'hebrew-text' : ''
                        }`}
                      >
                        {translation.translatedWord}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {languages[translation.targetLanguage] || translation.targetLanguage}
                      </span>
                      <span>Reviews: {translation.reviewCount}</span>
                      <span>Level: {translation.difficultyLevel}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {formatDate(translation.createdAt.toString())}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TranslationHistory;