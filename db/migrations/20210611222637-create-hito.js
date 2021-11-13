'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Hitos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            idProyecto: {
                type: Sequelize.INTEGER,
            },
            idTipo: {
                type: Sequelize.INTEGER,
            },
            descripcion: {
                type: Sequelize.STRING,
            },
            fechaEntrega: {
                type: Sequelize.DATE,
            },
            entregado: {
                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable('Hitos');
    },
};
