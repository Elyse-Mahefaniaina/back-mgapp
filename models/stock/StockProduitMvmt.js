const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Produits = require('../produit/Produits');
const SiteActivite = require('../core/SiteActivite');
const { now } = require('sequelize/lib/utils');
const User = require('../user/User');

const Stock = sequelize.define('Stock', {
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
    entre: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    sortie: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }    
    },
    is_inventory: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    date_mvmt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
        allowNull: false    
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'stock'
});

module.exports = Stock;
