const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Client = require('./Client');

const ContactClient = sequelize.define('ContactClient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('email', 'phone'),
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    timestamps: false,
    tableName: 'contacts_client'
});

module.exports = ContactClient;
