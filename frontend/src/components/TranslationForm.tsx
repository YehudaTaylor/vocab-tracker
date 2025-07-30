import React, { useState } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguages } from '../hooks/useLanguages';

interface TranslationFormProps {
  onTranslationComplete?: (translation: any) => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({ onTranslationComplete }) => {
  const [word, setWord] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('he');
  
  const { translation, loading, error, translateWord, clearError } = useTranslation();
  const { languages, loading: languagesLoading } = useLanguages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await translateWord(word, selectedLanguage);
  };

  React.useEffect(() => {
    if (translation && onTranslationComplete) {
      onTranslationComplete(translation);
    }
  }, [translation, onTranslationComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-2">
              English Word
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onFocus={clearError}
              placeholder="Enter a word to translate..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
              disabled={loading || languagesLoading}
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !word.trim()}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Translating...</span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>Translate</span>
            </>
          )}
        </button>
      </form>

      {translation && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Translation Result</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-gray-600 font-medium">English:</span>
              <span className="text-lg font-semibold">{translation.data.englishWord}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-gray-600 font-medium">
                {languages[translation.data.targetLanguage] || 'Translation'}:
              </span>
              <span 
                className={`text-lg font-semibold ${
                  translation.data.targetLanguage === 'he' ? 'hebrew-text' : ''
                }`}
              >
                {translation.data.translatedWord}
              </span>
            </div>

            {translation.data.isExisting && (
              <div className="text-sm text-green-600 bg-green-100 p-2 rounded">
                📚 This word is already in your vocabulary list! (Review count: {translation.data.reviewCount})
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationForm;