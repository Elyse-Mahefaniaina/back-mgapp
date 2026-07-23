const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../user/User');

const AchatReception = sequelize.define('AchatReception', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantite_arrive: { type: DataTypes.DOUBLE },
  achat_produit_id: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
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
  tableName: 'achat_reception',
});

module.exports = AchatReception;