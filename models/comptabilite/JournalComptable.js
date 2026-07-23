const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const JournalComptable = sequelize.define('journal_comptable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'journal_comptable'
});

module.exports = JournalComptable;
