'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Usuarios', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nombre: {
                type: Sequelize.STRING,
            },
            apellido: {
                type: Sequelize.STRING,
            },
            dni: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            pass: {
                type: Sequelize.STRING,
            },
            idRol: {
                type: Sequelize.INTEGER,
            },
            idCarrera: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('Usuarios');
    },
};