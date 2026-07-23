const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PageContentAction = sequelize.define('PageContentAction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    page_content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'page_content',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    controller: {
        type: DataTypes.STRING(255)
    },
    bind: {
        type: DataTypes. STRING(255)  
    },
    fetch_value: {
        type: DataTypes.STRING(255)    
    },
    value_field: {
        type: DataTypes.STRING(255)
    }
}, {
    timestamps: false,
    tableName: 'page_content_action'
});

module.exports = PageContentAction;