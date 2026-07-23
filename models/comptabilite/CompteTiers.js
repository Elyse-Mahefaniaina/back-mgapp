const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CompteTiers = sequelize.define('compte_tiers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  identifiant: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  plan_comptable_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'compte_tiers'
});

module.exports = CompteTiers;
