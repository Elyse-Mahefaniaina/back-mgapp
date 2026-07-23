const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Produits = require('../produit/Produits');
const SiteActivite = require('../core/SiteActivite');

const PrixVente = sequelize.define('PrixVente', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  produit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Produits,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  prix_achat_moyen: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  prix_vente: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date_calcul: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SiteActivite,
      key: 'id'
    },
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
  }
}, {
  timestamps: false,
  tableName: 'prix_vente',
});

module.exports = PrixVente;
