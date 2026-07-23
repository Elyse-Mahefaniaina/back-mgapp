const { Op } = require('sequelize');
const sequelize = require('../config/db');
const Vehicule = require('../models/transport/Vehicule');
const Transport = require('../models/transport/Transport');
const TransportStatus = require('../models/transport/TransportStatus');

// ── helpers ────────────────────────────────────────────────────────────────

function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function fail(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

// ── TRANSPORT ──────────────────────────────────────────────────────────────

/**
 * GET /transports
 * Liste tous les transports avec leur statut et véhicule
 * Query params : status, site_id, date_debut, date_fin
 */
async function getAllTransports(req, res) {
  try {
    const { status, site_id, date_debut, date_fin } = req.query;

    const where = {};

    if (site_id)   where.site_id = site_id;

    if (date_debut || date_fin) {
      where.date_debut_plannifier = {};
      if (date_debut) where.date_debut_plannifier[Op.gte] = new Date(date_debut);
      if (date_fin)   where.date_debut_plannifier[Op.lte] = new Date(date_fin);
    }

    const transports = await Transport.findAll({
      where,
      include: [
        {
          model: Vehicule,
          as: 'vehicule',
          required: false,
          attributes: ['id', 'matricule', 'marque', 'modele', 'couleur'],
        },
        {
          model: TransportStatus,
          as: 'statuts',
          required: false,
          attributes: ['id', 'status', 'user_id'],
          // on prend uniquement le dernier statut
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
      order: [['date_debut_plannifier', 'ASC']],
    });

    // filtrer par status si demandé (sur le dernier statut)
    const result = status
      ? transports.filter(t => {
          const last = t.statuts?.[0];
          return last ? last.status === status : status === 'EN_ATTENTE';
        })
      : transports;

    return success(res, result);
  } catch (error) {
    console.error('[getAllTransports]', error);
    return fail(res, 'Erreur lors de la récupération des transports', 500);
  }
}

/**
 * GET /transports/:id
 * Détail d'un transport
 */
async function getTransportById(req, res) {
  try {
    const { id } = req.params;

    const transport = await Transport.findByPk(id, {
      include: [
        {
          model: Vehicule,
          as: 'vehicule',
          required: false,
          attributes: ['id', 'matricule', 'marque', 'modele', 'couleur'],
        },
        {
          model: TransportStatus,
          as: 'statuts',
          required: false,
          attributes: ['id', 'status', 'user_id'],
          order: [['id', 'DESC']],
        },
      ],
    });

    if (!transport) return fail(res, 'Transport introuvable', 404);

    return success(res, transport);
  } catch (error) {
    console.error('[getTransportById]', error);
    return fail(res, 'Erreur lors de la récupération du transport', 500);
  }
}

/**
 * POST /transports
 * Créer une nouvelle demande de transport
 * Body : depart, destination, date_debut_plannifier, date_fin_plannifier, site_id, vehicule_id?
 */
async function createTransport(req, res) {
  const t = await sequelize.transaction();
  try {
    const {
      depart,
      destination,
      date_debut_plannifier,
      date_fin_plannifier,
      site_id,
      vehicule_id,
    } = req.body;

    // validations
    if (!depart || !destination)             return fail(res, 'depart et destination sont requis');
    if (!date_debut_plannifier)              return fail(res, 'date_debut_plannifier est requis');
    if (!date_fin_plannifier)               return fail(res, 'date_fin_plannifier est requis');
    if (!site_id)                            return fail(res, 'site_id est requis');

    const debut = new Date(date_debut_plannifier);
    const fin   = new Date(date_fin_plannifier);

    if (isNaN(debut.getTime())) return fail(res, 'date_debut_plannifier invalide');
    if (isNaN(fin.getTime()))   return fail(res, 'date_fin_plannifier invalide');
    if (fin < debut)            return fail(res, 'date_fin_plannifier doit être après date_debut_plannifier');

    // vérifier que le véhicule existe si fourni
    if (vehicule_id) {
      const vehicule = await Vehicule.findByPk(vehicule_id, { transaction: t });
      if (!vehicule) {
        await t.rollback();
        return fail(res, 'Véhicule introuvable');
      }

      // vérifier dispo du véhicule sur la période
      const conflit = await Transport.findOne({
        where: {
          vehicule_id,
          id: { [Op.ne]: 0 }, // exclure rien (placeholder)
          [Op.or]: [
            {
              date_debut_plannifier: { [Op.between]: [debut, fin] },
            },
            {
              date_fin_plannifier: { [Op.between]: [debut, fin] },
            },
            {
              date_debut_plannifier: { [Op.lte]: debut },
              date_fin_plannifier:   { [Op.gte]: fin },
            },
          ],
        },
        include: [
          {
            model: TransportStatus,
            as: 'statuts',
            required: false,
            where: { status: 'VALIDER' },
          },
        ],
        transaction: t,
      });

      if (conflit) {
        await t.rollback();
        return fail(res, 'Ce véhicule est déjà assigné sur cette période');
      }
    }

    const transport = await Transport.create(
      {
        user_id:               req.user?.id ?? req.body.user_id,
        site_id,
        vehicule_id:           vehicule_id ?? null,
        depart:                depart.trim(),
        destination:           destination.trim(),
        date_debut_plannifier: debut,
        date_fin_plannifier:   fin,
        date_db:               new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    const created = await Transport.findByPk(transport.id, {
      include: [{ model: Vehicule, as: 'vehicule', required: false }],
    });

    return success(res, created, 201);
  } catch (error) {
    await t.rollback();
    console.error('[createTransport]', error);
    return fail(res, 'Erreur lors de la création du transport', 500);
  }
}

/**
 * PUT /transports/:id
 * Modifier une demande (seulement si encore EN_ATTENTE)
 * Body : depart?, destination?, date_debut_plannifier?, date_fin_plannifier?, vehicule_id?
 */
async function updateTransport(req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const transport = await Transport.findByPk(id, {
      include: [
        {
          model: TransportStatus,
          as: 'statuts',
          required: false,
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
      transaction: t,
    });

    if (!transport) {
      await t.rollback();
      return fail(res, 'Transport introuvable', 404);
    }

    const dernierStatut = transport.statuts?.[0]?.status;
    if (dernierStatut && dernierStatut !== 'EN_ATTENTE') {
      await t.rollback();
      return fail(res, 'Impossible de modifier un transport déjà traité', 403);
    }

    const {
      depart,
      destination,
      date_debut_plannifier,
      date_fin_plannifier,
      vehicule_id,
    } = req.body;

    const debut = date_debut_plannifier
      ? new Date(date_debut_plannifier)
      : transport.date_debut_plannifier;
    const fin = date_fin_plannifier
      ? new Date(date_fin_plannifier)
      : transport.date_fin_plannifier;

    if (fin < debut) {
      await t.rollback();
      return fail(res, 'date_fin_plannifier doit être après date_debut_plannifier');
    }

    await transport.update(
      {
        depart:                depart?.trim()         ?? transport.depart,
        destination:           destination?.trim()    ?? transport.destination,
        date_debut_plannifier: debut,
        date_fin_plannifier:   fin,
        vehicule_id:           vehicule_id !== undefined ? (vehicule_id || null) : transport.vehicule_id,
      },
      { transaction: t }
    );

    await t.commit();

    const updated = await Transport.findByPk(id, {
      include: [{ model: Vehicule, as: 'vehicule', required: false }],
    });

    return success(res, updated);
  } catch (error) {
    await t.rollback();
    console.error('[updateTransport]', error);
    return fail(res, 'Erreur lors de la modification du transport', 500);
  }
}

/**
 * DELETE /transports/:id
 * Supprimer une demande (seulement si EN_ATTENTE)
 */
async function deleteTransport(req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const transport = await Transport.findByPk(id, {
      include: [
        {
          model: TransportStatus,
          as: 'statuts',
          required: false,
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
      transaction: t,
    });

    if (!transport) {
      await t.rollback();
      return fail(res, 'Transport introuvable', 404);
    }

    const dernierStatut = transport.statuts?.[0]?.status;
    if (dernierStatut && dernierStatut !== 'EN_ATTENTE') {
      await t.rollback();
      return fail(res, 'Impossible de supprimer un transport déjà traité', 403);
    }

    await TransportStatus.destroy({ where: { transport_id: id }, transaction: t });
    await transport.destroy({ transaction: t });

    await t.commit();
    return success(res, { message: 'Transport supprimé' });
  } catch (error) {
    await t.rollback();
    console.error('[deleteTransport]', error);
    return fail(res, 'Erreur lors de la suppression du transport', 500);
  }
}

// ── VALIDATION ─────────────────────────────────────────────────────────────

/**
 * GET /transports/en-attente
 * Liste uniquement les transports sans statut ou avec dernier statut EN_ATTENTE
 */
async function getTransportsEnAttente(req, res) {
  try {
    // on récupère tous et on filtre côté JS pour éviter une sous-requête complexe
    const transports = await Transport.findAll({
      include: [
        {
          model: Vehicule,
          as: 'vehicule',
          required: false,
          attributes: ['id', 'matricule', 'marque', 'modele'],
        },
        {
          model: TransportStatus,
          as: 'statuts',
          required: false,
          attributes: ['id', 'status', 'user_id'],
          order: [['id', 'DESC']],
        },
      ],
      order: [['date_db', 'ASC']],
    });

    const enAttente = transports.filter(t => {
      const last = t.statuts?.[0];
      return !last || last.status === 'EN_ATTENTE';
    });

    return success(res, enAttente);
  } catch (error) {
    console.error('[getTransportsEnAttente]', error);
    return fail(res, 'Erreur lors de la récupération des transports en attente', 500);
  }
}

/**
 * POST /transports/:id/valider
 * Valider un transport — crée un TransportStatus VALIDER
 * Body : vehicule_id? (optionnel, assigner ou changer le véhicule)
 */
async function validerTransport(req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { vehicule_id } = req.body;

    const transport = await Transport.findByPk(id, {
      include: [
        {
          model: TransportStatus,
          as: 'statuts',
          required: false,
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
      transaction: t,
    });

    if (!transport) {
      await t.rollback();
      return fail(res, 'Transport introuvable', 404);
    }

    const dernierStatut = transport.statuts?.[0]?.status;
    if (dernierStatut === 'VALIDER') {
      await t.rollback();
      return fail(res, 'Ce transport est déjà validé', 409);
    }
    if (dernierStatut === 'REFUSER') {
      await t.rollback();
      return fail(res, 'Ce transport a été refusé, impossible de le valider', 409);
    }

    // vérifier dispo du véhicule si fourni
    if (vehicule_id) {
      const vehicule = await Vehicule.findByPk(vehicule_id, { transaction: t });
      if (!vehicule) {
        await t.rollback();
        return fail(res, 'Véhicule introuvable');
      }

      const debut = transport.date_debut_plannifier;
      const fin   = transport.date_fin_plannifier;

      const conflit = await Transport.findOne({
        where: {
          vehicule_id,
          id: { [Op.ne]: id },
          [Op.or]: [
            { date_debut_plannifier: { [Op.between]: [debut, fin] } },
            { date_fin_plannifier:   { [Op.between]: [debut, fin] } },
            {
              date_debut_plannifier: { [Op.lte]: debut },
              date_fin_plannifier:   { [Op.gte]: fin },
            },
          ],
        },
        include: [
          {
            model: TransportStatus,
            as: 'statuts',
            required: true,
            where: { status: 'VALIDER' },
          },
        ],
        transaction: t,
      });

      if (conflit) {
        await t.rollback();
        return fail(res, 'Ce véhicule est déjà assigné sur cette période');
      }

      // mettre à jour le véhicule du transport
      await transport.update({ vehicule_id }, { transaction: t });
    }

    // créer le statut VALIDER
    const statut = await TransportStatus.create(
      {
        transport_id: id,
        user_id:      req.user?.id ?? req.body.user_id,
        status:       'VALIDER',
      },
      { transaction: t }
    );

    await t.commit();

    const updated = await Transport.findByPk(id, {
      include: [
        { model: Vehicule,         as: 'vehicule', required: false },
        { model: TransportStatus,  as: 'statuts',  required: false, order: [['id', 'DESC']] },
      ],
    });

    return success(res, updated);
  } catch (error) {
    await t.rollback();
    console.error('[validerTransport]', error);
    return fail(res, 'Erreur lors de la validation du transport', 500);
  }
}

/**
 * POST /transports/:id/refuser
 * Refuser un transport — crée un TransportStatus REFUSER
 */
async function refuserTransport(req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const transport = await Transport.findByPk(id, {
      include: [
        {
          model: TransportStatus,
          as: 'statuts',
          required: false,
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
      transaction: t,
    });

    if (!transport) {
      await t.rollback();
      return fail(res, 'Transport introuvable', 404);
    }

    const dernierStatut = transport.statuts?.[0]?.status;
    if (dernierStatut === 'REFUSER') {
      await t.rollback();
      return fail(res, 'Ce transport est déjà refusé', 409);
    }
    if (dernierStatut === 'VALIDER') {
      await t.rollback();
      return fail(res, 'Ce transport est déjà validé, impossible de le refuser', 409);
    }

    await TransportStatus.create(
      {
        transport_id: id,
        user_id:      req.user?.id ?? req.body.user_id,
        status:       'REFUSER',
      },
      { transaction: t }
    );

    await t.commit();

    const updated = await Transport.findByPk(id, {
      include: [
        { model: Vehicule,        as: 'vehicule', required: false },
        { model: TransportStatus, as: 'statuts',  required: false, order: [['id', 'DESC']] },
      ],
    });

    return success(res, updated);
  } catch (error) {
    await t.rollback();
    console.error('[refuserTransport]', error);
    return fail(res, 'Erreur lors du refus du transport', 500);
  }
}

/**
 * GET /transports/vehicules-dispos
 * Retourne les véhicules disponibles sur une période donnée
 * Query params : date_debut (requis), date_fin (requis)
 */
async function getVehiculesDisponibles(req, res) {
  try {
    const { date_debut, date_fin } = req.query;

    if (!date_debut || !date_fin) {
      return fail(res, 'date_debut et date_fin sont requis');
    }

    const debut = new Date(date_debut);
    const fin   = new Date(date_fin);

    if (isNaN(debut.getTime())) return fail(res, 'date_debut invalide');
    if (isNaN(fin.getTime()))   return fail(res, 'date_fin invalide');
    if (fin < debut)            return fail(res, 'date_fin doit être après date_debut');

    // IDs des véhicules occupés sur la période (transports validés seulement)
    const transportsOccupes = await Transport.findAll({
      attributes: ['vehicule_id'],
      where: {
        vehicule_id: { [Op.ne]: null },
        [Op.or]: [
          { date_debut_plannifier: { [Op.between]: [debut, fin] } },
          { date_fin_plannifier:   { [Op.between]: [debut, fin] } },
          {
            date_debut_plannifier: { [Op.lte]: debut },
            date_fin_plannifier:   { [Op.gte]: fin },
          },
        ],
      },
      include: [
        {
          model: TransportStatus,
          as: 'statuts',
          required: true,
          where: { status: 'VALIDER' },
        },
      ],
    });

    const idsOccupes = transportsOccupes
      .map(t => t.vehicule_id)
      .filter(Boolean);

    const disponibles = await Vehicule.findAll({
      where: {
        id: { [Op.notIn]: idsOccupes.length ? idsOccupes : [0] },
      },
      order: [['marque', 'ASC']],
    });

    return success(res, disponibles);
  } catch (error) {
    console.error('[getVehiculesDisponibles]', error);
    return fail(res, 'Erreur lors de la récupération des véhicules disponibles', 500);
  }
}

// ── exports ────────────────────────────────────────────────────────────────
module.exports = {
  // Transport
  getAllTransports,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport,
  // Validation
  getTransportsEnAttente,
  validerTransport,
  refuserTransport,
  // Utilitaire
  getVehiculesDisponibles,
};