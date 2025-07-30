'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Translations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      englishWord: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'englishWord'
      },
      translatedWord: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'translatedWord'
      },
      targetLanguage: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'he',
        field: 'targetLanguage'
      },
      confidence: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      reviewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: 'reviewCount'
      },
      lastReviewed: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'lastReviewed'
      },
      nextReview: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'nextReview'
      },
      difficultyLevel: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
        field: 'difficultyLevel'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'createdAt'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updatedAt'
      }
    });

    // Add indexes for performance
    await queryInterface.addIndex('Translations', ['englishWord']);
    await queryInterface.addIndex('Translations', ['targetLanguage']);
    await queryInterface.addIndex('Translations', ['nextReview']);

    // Add constraints
    await queryInterface.addConstraint('Translations', {
      fields: ['difficultyLevel'],
      type: 'check',
      where: {
        difficultyLevel: {
          [Sequelize.Op.between]: [1, 5]
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Translations');
  }
};
