const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const PlanComptable = require('./PlanComptable');
const JournalComptable = require('./JournalComptable');
const CompteTiers = require('./CompteTiers');
const SiteActivite = require('../core/SiteActivite');

const EcritureComptable = sequelize.define('ecriture_comptable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: SiteActivite,  
        key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  debit: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  credit: { 
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  plan_comptable_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  journal_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  compte_tiers_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'ecriture_comptable'
});

module.exports = EcritureComptable;
