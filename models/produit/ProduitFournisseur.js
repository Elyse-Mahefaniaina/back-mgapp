const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Produit = require('./Produits');
const Fournisseur = require('../fournisseur/Fournisseur');

const ProduitFournisseur = sequelize.define("ProduitFournisseur", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    produit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produit,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    fournisseur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Fournisseur,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'produit_fournisseur',
    timestamps: false
});

module.exports = ProduitFournisseur;