const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./User');
const Role = require('./Role');

const UserRole = sequelize.define('UserRole', {
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
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Role,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    timestamps: false,
    tableName: 'user_roles'
});


module.exports = UserRole;
