const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  translateWord,
  getTranslationHistory,
  getWordsForReview,
  reviewWord,
  getSupportedLanguages
} = require('../controllers/translationController');
const {
  validateTranslation,
  validateReview,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// Rate limiting for translation requests
const translationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: 'Too many translation requests, please try again later'
  }
});

// Rate limiting for review requests
const reviewLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 reviews per minute
  message: {
    success: false,
    message: 'Too many review requests, please try again later'
  }
});

// Routes
router.post('/translate', translationLimiter, validateTranslation, translateWord);
router.get('/history', validatePagination, getTranslationHistory);
router.get('/review', getWordsForReview);
router.put('/review/:id', reviewLimiter, validateReview, reviewWord);
router.get('/languages', getSupportedLanguages);

module.exports = router;