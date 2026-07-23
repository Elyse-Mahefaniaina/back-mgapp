const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Vehicule = sequelize.define('Vehicule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  matricule: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    set(value) {
      this.setDataValue('matricule', value.toUpperCase());
    }
  },
  marque: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  modele: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  couleur: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  numero_chassis: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
    defaultValue: "--"
  },
  puissance_fiscale: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: "--"
  },
  annee_circulation: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date_mise_circulation: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
}, {
  timestamps: false,
  tableName: 'vehicules',
});

module.exports = Vehicule;
