const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Translation = sequelize.define('Translation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  englishWord: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  translatedWord: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  targetLanguage: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'he',
    validate: {
      notEmpty: true,
      isIn: [['he', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'ru']]
    }
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 1
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lastReviewed: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextReview: {
    type: DataTypes.DATE,
    allowNull: true
  },
  difficultyLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 5
    }
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['englishWord']
    },
    {
      fields: ['targetLanguage']
    },
    {
      fields: ['nextReview']
    }
  ]
});

module.exports = Translation;