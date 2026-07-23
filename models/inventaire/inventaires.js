const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Produits = require('../produit/Produits');
const User = require('../user/User');
const SiteActivite = require('../core/SiteActivite');

const InventaireStock = sequelize.define('InventaireStock', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        set(value) {
            this.setDataValue('code', String(value).toUpperCase().slice(0, 6));
        }
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
    quantite_on_hand: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_inventaire: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id'
        }
    },
    commentaire: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false,
    tableName: 'inventaire_stock'
});

module.exports = InventaireStock;
