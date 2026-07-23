const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PageContent = sequelize.define('PageContent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    page_path: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bind: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '*'
    },
    controller: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    element: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    authorizedAction: {
        type: DataTypes.STRING(3),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'page_content'
});

module.exports = PageContent;