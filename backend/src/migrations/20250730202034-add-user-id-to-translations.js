'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Translations', 'userId', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'anonymous',
      field: 'userId'
    });

    // Add index for better query performance
    await queryInterface.addIndex('Translations', ['userId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Translations', ['userId']);
    await queryInterface.removeColumn('Translations', 'userId');
  }
};
