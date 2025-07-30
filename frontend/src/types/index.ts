export interface Translation {
  id: string;
  englishWord: string;
  translatedWord: string;
  targetLanguage: string;
  reviewCount: number;
  lastReviewed?: Date;
  nextReview?: Date;
  difficultyLevel: number;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TranslationResponse {
  success: boolean;
  data: {
    id: string;
    englishWord: string;
    translatedWord: string;
    targetLanguage: string;
    reviewCount: number;
    isExisting: boolean;
  };
}

export interface TranslationHistoryResponse {
  success: boolean;
  data: {
    translations: Translation[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface ReviewWordsResponse {
  success: boolean;
  data: {
    words: Translation[];
    count: number;
  };
}

export interface LanguagesResponse {
  success: boolean;
  data: { [key: string]: string };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}