const { Translation } = require('../models');
const translationService = require('../utils/translationService');
const SpacedRepetitionSystem = require('../utils/spacedRepetition');
const { validationResult } = require('express-validator');

const translateWord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { word, targetLanguage = 'he' } = req.body;
    const userId = req.user ? req.user.id : 'anonymous';

    // Check if translation already exists for this user
    const existingTranslation = await Translation.findOne({
      where: {
        englishWord: word.toLowerCase(),
        targetLanguage,
        userId
      }
    });

    if (existingTranslation) {
      return res.status(200).json({
        success: true,
        data: {
          id: existingTranslation.id,
          englishWord: existingTranslation.englishWord,
          translatedWord: existingTranslation.translatedWord,
          targetLanguage: existingTranslation.targetLanguage,
          reviewCount: existingTranslation.reviewCount,
          isExisting: true
        }
      });
    }

    // Get translation from service
    const translation = await translationService.translateText(word, targetLanguage);

    // Calculate next review date
    const nextReview = SpacedRepetitionSystem.calculateNextReview(0, 1);

    // Save to database
    const newTranslation = await Translation.create({
      englishWord: word.toLowerCase(),
      translatedWord: translation.translatedText,
      targetLanguage,
      confidence: translation.confidence,
      nextReview,
      userId
    });

    res.status(201).json({
      success: true,
      data: {
        id: newTranslation.id,
        englishWord: newTranslation.englishWord,
        translatedWord: newTranslation.translatedWord,
        targetLanguage: newTranslation.targetLanguage,
        reviewCount: newTranslation.reviewCount,
        isExisting: false
      }
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getTranslationHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, targetLanguage } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user ? req.user.id : 'anonymous';

    const whereClause = { userId };
    if (targetLanguage) {
      whereClause.targetLanguage = targetLanguage;
    }

    const { count, rows } = await Translation.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: {
        translations: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getWordsForReview = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user ? req.user.id : 'anonymous';
    
    const reviewQuery = SpacedRepetitionSystem.getWordsForReview();
    reviewQuery.where.userId = userId;
    reviewQuery.limit = parseInt(limit);

    const wordsForReview = await Translation.findAll(reviewQuery);

    res.status(200).json({
      success: true,
      data: {
        words: wordsForReview,
        count: wordsForReview.length
      }
    });

  } catch (error) {
    console.error('Get review words error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const reviewWord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { responseQuality, correct = true } = req.body;

    const translation = await Translation.findByPk(id);
    if (!translation) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found'
      });
    }

    // Update review statistics
    const newReviewCount = translation.reviewCount + 1;
    const newDifficultyLevel = SpacedRepetitionSystem.updateDifficultyLevel(
      translation.difficultyLevel,
      responseQuality
    );
    const nextReview = SpacedRepetitionSystem.calculateNextReview(
      newReviewCount,
      newDifficultyLevel,
      correct
    );

    await translation.update({
      reviewCount: newReviewCount,
      lastReviewed: new Date(),
      nextReview,
      difficultyLevel: newDifficultyLevel
    });

    res.status(200).json({
      success: true,
      data: {
        id: translation.id,
        reviewCount: newReviewCount,
        nextReview,
        difficultyLevel: newDifficultyLevel
      }
    });

  } catch (error) {
    console.error('Review word error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getSupportedLanguages = async (req, res) => {
  try {
    const languages = translationService.getSupportedLanguages();
    
    res.status(200).json({
      success: true,
      data: languages
    });

  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  translateWord,
  getTranslationHistory,
  getWordsForReview,
  reviewWord,
  getSupportedLanguages
};