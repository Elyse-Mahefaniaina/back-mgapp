const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Produits = require('../produit/Produits');

const MargeBeneficiaire = sequelize.define('MargeBeneficiaire', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  produit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: Produits,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  marge: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  timestamps: false,
  tableName: 'marge_beneficiaire',
});

module.exports = MargeBeneficiaire;
