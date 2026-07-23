const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    identifiant: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'client'
});

module.exports = Client;
