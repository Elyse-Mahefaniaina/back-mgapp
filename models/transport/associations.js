const User = require('../user/User');
const Vehicule = require('./Vehicule');
const SiteActivite = require('../core/SiteActivite');
const Transport = require('./Transport');
const TransportStatus = require('./TransportStatus');

const initAssociations = () => {

  // =======================
  // USER ↔ TRANSPORT
  // =======================
  User.hasMany(Transport, {
    foreignKey: 'user_id',
    as: 'transports'
  });

  Transport.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // =======================
  // VEHICULE ↔ TRANSPORT
  // =======================
  Vehicule.hasMany(Transport, {
    foreignKey: 'vehicule_id',
    as: 'transports'
  });

  Transport.belongsTo(Vehicule, {
    foreignKey: 'vehicule_id',
    as: 'vehicule'
  });

  // =======================
  // SITE ↔ TRANSPORT
  // =======================
  SiteActivite.hasMany(Transport, {
    foreignKey: 'site_id',
    as: 'transports'
  });

  Transport.belongsTo(SiteActivite, {
    foreignKey: 'site_id',
    as: 'site'
  });

  // =======================
  // TRANSPORT ↔ STATUS
  // ⚠️ IMPORTANT: alias = "statuts" (comme ton controller)
  // =======================
  Transport.hasMany(TransportStatus, {
    foreignKey: 'transport_id',
    as: 'statuts'
  });

  TransportStatus.belongsTo(Transport, {
    foreignKey: 'transport_id',
    as: 'transport'
  });

  // =======================
  // USER ↔ STATUS
  // =======================
  User.hasMany(TransportStatus, {
    foreignKey: 'user_id',
    as: 'transport_statuses'
  });

  TransportStatus.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = initAssociations;