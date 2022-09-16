'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('minions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      apiId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      obtained: {
        type: Sequelize.BOOLEAN
      },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('minions');
  }
};