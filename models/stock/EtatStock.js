const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Produits = require('../produit/Produits');
const SiteActivite = require('../core/SiteActivite');
const { now } = require('sequelize/lib/utils');
const User = require('../user/User');

const EtatStock = sequelize.define('EtatStock', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    produit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produits,  
            key: 'id'
        }
    },
    site_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SiteActivite,  
            key: 'id'
        }
    },
    quantite: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: false,
    tableName: 'etat_stock'
});

module.exports = EtatStock;
