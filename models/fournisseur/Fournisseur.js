const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Fournisseur = sequelize.define('Fournisseur', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    identifiant: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('identifiant', value.toUpperCase());
        }
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    siege: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'fournisseurs'
});

module.exports = Fournisseur;
