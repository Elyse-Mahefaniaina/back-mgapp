const { DataTypes , Sequelize } = require('sequelize');
const sequelize = require('../../config/db');
const Client = require('../client/Client');
const SiteActivite = require('../core/SiteActivite');
const User = require('../user/User');

const Vente = sequelize.define('Vente', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  identifiant: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: Sequelize.NOW,
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id'
    }
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
  tableName: 'vente',
});

module.exports = Vente;