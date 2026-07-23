const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Vente = require('./Vente');
const Produits = require('../produit/Produits');

const VentePaiement = sequelize.define('VentePaiement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mode: {
    type: DataTypes.STRING
  },
  recu: {
    type: DataTypes.DOUBLE,
  },
  rendu: {
    type: DataTypes.DOUBLE,
  },
  vente_id: {
    type: DataTypes.INTEGER,
    references: {
        model: Vente,
        key: 'id'
    }
  },

}, {
  timestamps: false,
  tableName: 'Vente_paiement',
});

module.exports = VentePaiement;