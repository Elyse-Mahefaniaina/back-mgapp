const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Role = sequelize.define("Role", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING(25),
        unique: true,
        allowNull: false,
        set(value) {
            this.setDataValue('role', value.toUpperCase());
        }
    }
}, {
    tableName: 'roles',
    timestamps: false
});

module.exports = Role;