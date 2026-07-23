const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MenuItem = sequelize.define('MenuItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    path: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'menu_items',
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'menu_items'
});
module.exports = MenuItem;