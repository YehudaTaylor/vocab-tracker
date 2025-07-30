const axios = require('axios');

class TranslationService {
  constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  }

  async translateText(text, targetLanguage = 'he', sourceLanguage = 'en') {
    // Try Google Translate first if API key is available
    if (this.apiKey) {
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
          confidence: 0.95
        };
      } catch (error) {
        console.error('Google Translate API error:', error.message);
      }
    }

    // Fallback to free MyMemory API
    try {
      return await this.myMemoryTranslate(text, targetLanguage, sourceLanguage);
    } catch (error) {
      console.error('MyMemory API error:', error.message);
    }

    // Final fallback to mock translations
    return this.mockTranslate(text, targetLanguage);
  }

  async myMemoryTranslate(text, targetLanguage, sourceLanguage = 'en') {
    const langPair = `${sourceLanguage}|${targetLanguage}`;
    const url = 'https://api.mymemory.translated.net/get';
    
    try {
      const response = await axios.get(url, {
        params: {
          q: text,
          langpair: langPair
        },
        timeout: 5000
      });

      if (response.data.responseStatus === 200) {
        return {
          translatedText: response.data.responseData.translatedText,
          detectedSourceLanguage: sourceLanguage,
          confidence: parseFloat(response.data.responseData.match) || 0.7
        };
      } else {
        throw new Error('MyMemory API returned error status');
      }
    } catch (error) {
      console.error('MyMemory translation failed:', error.message);
      throw error;
    }
  }

  mockTranslate(text, targetLanguage) {
    const mockTranslations = {
      'he': {
        'hello': 'שלום', 'world': 'עולם', 'house': 'בית', 'water': 'מים',
        'food': 'אוכל', 'book': 'ספר', 'tree': 'עץ', 'car': 'מכונית',
        'dog': 'כלב', 'cat': 'חתול', 'love': 'אהבה', 'peace': 'שלום',
        'friend': 'חבר', 'family': 'משפחה', 'home': 'בית', 'school': 'בית ספר',
        'work': 'עבודה', 'time': 'זמן', 'money': 'כסף', 'good': 'טוב',
        'bad': 'רע', 'big': 'גדול', 'small': 'קטן', 'new': 'חדש',
        'old': 'ישן', 'beautiful': 'יפה', 'happy': 'שמח', 'sad': 'עצוב'
      },
      'es': {
        'hello': 'hola', 'world': 'mundo', 'house': 'casa', 'water': 'agua',
        'food': 'comida', 'book': 'libro', 'tree': 'árbol', 'car': 'coche',
        'dog': 'perro', 'cat': 'gato', 'love': 'amor', 'peace': 'paz',
        'friend': 'amigo', 'family': 'familia', 'home': 'hogar', 'school': 'escuela',
        'work': 'trabajo', 'time': 'tiempo', 'money': 'dinero', 'good': 'bueno',
        'bad': 'malo', 'big': 'grande', 'small': 'pequeño', 'new': 'nuevo'
      },
      'fr': {
        'hello': 'bonjour', 'world': 'monde', 'house': 'maison', 'water': 'eau',
        'food': 'nourriture', 'book': 'livre', 'tree': 'arbre', 'car': 'voiture',
        'dog': 'chien', 'cat': 'chat', 'love': 'amour', 'peace': 'paix',
        'friend': 'ami', 'family': 'famille', 'home': 'maison', 'school': 'école',
        'work': 'travail', 'time': 'temps', 'money': 'argent', 'good': 'bon'
      }
    };

    const translations = mockTranslations[targetLanguage] || {};
    const translatedText = translations[text.toLowerCase()];
    
    if (!translatedText) {
      // If not in mock dictionary, indicate it needs real API
      return {
        translatedText: `[Translation needed: ${text}]`,
        detectedSourceLanguage: 'en',
        confidence: 0.0
      };
    }

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