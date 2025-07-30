const axios = require('axios');

class TranslationService {
  constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  }

  async translateText(text, targetLanguage = 'he', sourceLanguage = 'en') {
    if (!this.apiKey) {
      return this.mockTranslate(text, targetLanguage);
    }

    try {
      const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text'
      });

      const translation = response.data.data.translations[0];
      
      return {
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage || sourceLanguage,
        confidence: 0.95 // Google Translate doesn't provide confidence scores
      };
    } catch (error) {
      console.error('Translation API error:', error.message);
      return this.mockTranslate(text, targetLanguage);
    }
  }

  mockTranslate(text, targetLanguage) {
    const mockTranslations = {
      'he': {
        'hello': 'שלום',
        'world': 'עולם',
        'house': 'בית',
        'water': 'מים',
        'food': 'אוכל',
        'book': 'ספר',
        'tree': 'עץ',
        'car': 'מכונית',
        'dog': 'כלב',
        'cat': 'חתול',
        'love': 'אהבה',
        'peace': 'שלום',
        'friend': 'חבר',
        'family': 'משפחה',
        'home': 'בית'
      }
    };

    const translations = mockTranslations[targetLanguage] || {};
    const translatedText = translations[text.toLowerCase()] || `${text}_${targetLanguage}`;

    return {
      translatedText,
      detectedSourceLanguage: 'en',
      confidence: 0.8
    };
  }

  getSupportedLanguages() {
    return {
      'he': 'Hebrew',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'ru': 'Russian'
    };
  }
}

module.exports = new TranslationService();