const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PlanComptable = sequelize.define('plan_comptable', {
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
    classe: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        validate: { min: 1, max: 7 }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    } 
}, {
    timestamps: false,
    tableName: 'plan_comptable'
});

module.exports = PlanComptable;
