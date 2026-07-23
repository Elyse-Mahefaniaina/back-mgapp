const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Role = require('./Role');
const SiteActivite = require('../core/SiteActivite');

const RolePermissionSite = sequelize.define('RolePermissionSite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  siteActivite_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SiteActivite,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  controller_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  can_create: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  can_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  can_update: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  can_delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false,
  tableName: 'role_permission_sites'
});

module.exports = RolePermissionSite;
