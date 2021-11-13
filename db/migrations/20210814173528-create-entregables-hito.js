'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EntregablesHitos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idHito: {
        type: Sequelize.INTEGER,
      },
      numVersion: {
        type: Sequelize.INTEGER,
      },
      entrega: {
        type: Sequelize.STRING,
      },
      devolucion: {
        type: Sequelize.STRING,
      },
      documento: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EntregablesHitos');
  },
};
