const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Fournisseur = require('../fournisseur/Fournisseur');

const ContactFournisseur = sequelize.define('ContactFournisseur', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('email', 'phone'),
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(100),
        allowNull: false
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
    timestamps: false,
    tableName: 'contacts_fournisseur'
});

module.exports = ContactFournisseur;
