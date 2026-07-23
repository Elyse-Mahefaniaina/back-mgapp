const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../user/User');
const Vehicule = require('./Vehicule');
const SiteActivite = require('../core/SiteActivite');

const Transport = sequelize.define('Transport', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key:'id'  
    }
  },
  site_id: {
    type:DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SiteActivite,
      key: 'id' 
    }
  },
  vehicule_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: Vehicule,
        key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  date_db: {
    type: DataTypes.DATE,
    allowNull:false,
    defaultValue: NOW
  },
  date_debut_plannifier: {
    type: DataTypes.DATE,
    allowNull:false
  },
  date_fin_plannifier: {
    type: DataTypes.DATE,
    allowNull:false
  },
  depart: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'transports',
});

module.exports = Transport;