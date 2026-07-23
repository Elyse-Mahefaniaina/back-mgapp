const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const AchatProduit = sequelize.define('AchatProduit', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantite: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  prix_unitaire: { type: DataTypes.FLOAT, allowNull: false },
  achat_id: { type: DataTypes.INTEGER },
  produit_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  unite: { type: DataTypes.STRING(20) },
}, {
  timestamps: false,
  tableName: 'achat_produit',
});

module.exports = AchatProduit;