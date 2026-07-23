const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    matricule: {
        type: DataTypes.STRING(25),
        unique: true,
        allowNull: false,
        set(value) {
            this.setDataValue('matricule', value.toUpperCase());
        }
    },
    nom: {
        type: DataTypes.STRING(50),
        allowNull: false        
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false    
    },
    isPasswordTemp: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false,
    tableName: "app_users",
    hooks: {
        beforeCreate: async (user) => {
            const rawPassword = user.password;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(rawPassword, salt);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const rawPassword = user.password;
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(rawPassword, salt);
            }
        }
    }
});

User.prototype.verifyPassword = async function (plainPassword) {
    const rawPassword = plainPassword;
    return await bcrypt.compare(rawPassword, this.password);
};

module.exports = User;