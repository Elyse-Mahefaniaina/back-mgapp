const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteActivite = sequelize.define('SiteActivite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('numero', value.toUpperCase());
        }
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    emplacement: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    contact: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    responsable: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'sites_activite'
});

module.exports = SiteActivite;
