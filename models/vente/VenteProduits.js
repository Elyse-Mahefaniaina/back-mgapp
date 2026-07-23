const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Vente = require('./Vente');
const Produits = require('../produit/Produits');

const VenteProduit = sequelize.define('VenteProduit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantite: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.
  },
  prix_unitaire: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  vente_id: {
    type: DataTypes.INTEGER,
    references: {
        model: Vente,
        key: 'id'
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
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  }

}, {
  timestamps: false,
  tableName: 'Vente_produit',
});

module.exports = VenteProduit;