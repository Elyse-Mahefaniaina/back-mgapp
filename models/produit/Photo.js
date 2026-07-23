const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Photo = sequelize.define('photo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    lien: {
        type: DataTypes.STRING,
        allowNull: false
    },

    produit_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'photo'
});

module.exports = Photo;
