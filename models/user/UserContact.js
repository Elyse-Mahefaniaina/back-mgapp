const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./User');

const UserContact = sequelize.define('UserContact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    type: {
        type: DataTypes.ENUM('email', 'phone'),
        allowNull: false
    },
    valeur: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'user_contacts'
});

module.exports = UserContact;
