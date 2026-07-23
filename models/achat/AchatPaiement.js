const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Achat = require('./Achat');
const User = require('../user/User');

const AchatPaiement = sequelize.define('AchatPaiement', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },

  achat_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Achat,
      key: 'id'
    }
  },

  montant: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },

  mode_paiement: {
    type: DataTypes.ENUM('ESPECES','VIREMENT','CHEQUE','MOBILE_MONEY'),
    allowNull: false
  },

  reference: { 
    type: DataTypes.STRING,
    allowNull: true
  },

  date: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: DataTypes.NOW
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
  tableName: 'achat_paiement',
  timestamps: false
});

module.exports = AchatPaiement;