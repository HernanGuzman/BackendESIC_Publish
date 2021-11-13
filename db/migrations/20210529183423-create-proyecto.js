'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Proyectos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nombre: {
                type: Sequelize.STRING,
            },
            descripcion: {
                type: Sequelize.STRING,
            },
            idMateria: {
                type: Sequelize.INTEGER,
            },
            idTutor: {
                type: Sequelize.INTEGER,
            },
            fechaInicio: {
                type: Sequelize.DATE,
            },
            fechaFin: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('Proyectos');
    },
};