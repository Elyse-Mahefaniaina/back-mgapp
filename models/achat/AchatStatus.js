const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Achat = require('../achat/Achat');
const User = require('../user/User');

const AchatStatus = sequelize.define('AchatStatus', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  achat_id: {
    type: DataTypes.INTEGER,
    references: {
        model: Achat,
        key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'CREER',
      'VALIDER',
      'RECEPTIONNE',
      'FERMER',
      'ANNULER',
      'PAYER'
    ),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key:'id'  
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull:false
  }

}, {
  timestamps: false,
  tableName: 'achat_status',
});


module.exports = AchatStatus;