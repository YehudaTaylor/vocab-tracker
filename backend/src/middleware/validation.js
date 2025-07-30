const { body, param, query } = require('express-validator');

const validateTranslation = [
  body('word')
    .trim()
    .notEmpty()
    .withMessage('Word is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Word must be between 1 and 255 characters')
    .matches(/^[a-zA-Z\s-']+$/)
    .withMessage('Word can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('targetLanguage')
    .optional()
    .isIn(['he', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'ru'])
    .withMessage('Invalid target language')
];

const validateReview = [
  param('id')
    .isUUID()
    .withMessage('Invalid translation ID'),
  
  body('responseQuality')
    .isInt({ min: 1, max: 5 })
    .withMessage('Response quality must be between 1 and 5'),
  
  body('correct')
    .optional()
    .isBoolean()
    .withMessage('Correct must be a boolean value')
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('targetLanguage')
    .optional()
    .isIn(['he', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'ru'])
    .withMessage('Invalid target language')
];

module.exports = {
  validateTranslation,
  validateReview,
  validatePagination
};