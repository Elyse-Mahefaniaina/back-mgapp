const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Photo = require('./Photo');

const Produits = sequelize.define('Produits', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    identifiant: {
        type: DataTypes.STRING(25),
        unique: true,
        allowNull: false,
        set(value) {
            this.setDataValue('identifiant', value.toUpperCase());
        }
    },
    categorie: {
        type: DataTypes.ENUM('STOCKABLE', 'NON_STOCKABLE'),
        allowNull: false
    },
    etat: {
        type: DataTypes.ENUM('PERISSABLE', 'NON_PERISSABLE'),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'produits'
});

module.exports = Produits;
