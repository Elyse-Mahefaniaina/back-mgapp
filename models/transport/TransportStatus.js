const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../../config/db');
const Transport = require('./Transport');
const User = require('../user/User');

const TransportStatus = sequelize.define('TransportStatus', {
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
  transport_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Transport,
        key: 'id'
    },
    onUpdate: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM(
      'VALIDER',
      'REFUSER'
    ),
    allowNull: false
  },
}, {
  timestamps: false,
  tableName: 'TransportStatus',
});

module.exports = TransportStatus;