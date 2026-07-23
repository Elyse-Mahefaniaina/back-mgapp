const { DataTypes , Sequelize } = require('sequelize');
const sequelize = require('../../config/db');
const Fournisseur = require('../fournisseur/Fournisseur');
const SiteActivite = require('../core/SiteActivite');

const Achat = sequelize.define('Achat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  identifiant: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  fournisseur_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: 'achat',
});

module.exports = Achat;