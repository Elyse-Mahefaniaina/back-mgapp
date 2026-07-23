const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Page = sequelize.define('Page', {
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
        allowNull: true,
        unique: true
    },
    main_controller: {
        type: DataTypes.STRING(255) 
    }
}, {
    timestamps: false,
    tableName: 'pages'
});

module.exports = Page;