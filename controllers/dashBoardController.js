const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

function success(res, data) {
  return res.status(200).json({ success: true, data });
}

function fail(res, message, status = 500) {
  return res.status(status).json({ success: false, message });
}

/**
 * GET /api/dashboard
 * Toutes les métriques en un seul appel
 */
async function getDashboard(req, res) {
  try {
    const [
      ventesKpi,
      achatsKpi,
      stockKpi,
      transportKpi,
      caParJour,
      achatParJour,
      topProduits,
      paiementModes,
      transportStatuts,
    ] = await Promise.all([

      // ── VENTES ─────────────────────────────
      sequelize.query(`
        SELECT
          COUNT(DISTINCT v.id) AS nb_ventes,
          COALESCE(SUM(vp.quantite * vp.prix_unitaire), 0) AS ca_mois,
          COUNT(DISTINCT CASE WHEN v.date = CURDATE() THEN v.id END) AS nb_ventes_today,
          COALESCE(SUM(CASE WHEN v.date = CURDATE() THEN vp.quantite * vp.prix_unitaire ELSE 0 END), 0) AS ca_today
        FROM vente v
        LEFT JOIN vente_produit vp ON vp.vente_id = v.id
        WHERE MONTH(v.date) = MONTH(CURDATE())
          AND YEAR(v.date)  = YEAR(CURDATE())
      `, { type: QueryTypes.SELECT }),

      // ── ACHATS ─────────────────────────────
      sequelize.query(`
        SELECT
          COUNT(DISTINCT a.id) AS nb_achats,
          COALESCE(SUM(ap.quantite * ap.prix_unitaire), 0) AS total_achats_mois,
          COALESCE(SUM(apm.montant), 0) AS total_paye_mois
        FROM achat a
        LEFT JOIN achat_produit ap ON ap.achat_id = a.id
        LEFT JOIN achat_paiement apm ON apm.achat_id = a.id
          AND MONTH(apm.date) = MONTH(CURDATE())
          AND YEAR(apm.date)  = YEAR(CURDATE())
        WHERE MONTH(a.date) = MONTH(CURDATE())
          AND YEAR(a.date)  = YEAR(CURDATE())
      `, { type: QueryTypes.SELECT }),

      // ── STOCK ──────────────────────────────
      sequelize.query(`
        SELECT
          COUNT(*) AS total_references,
          SUM(CASE WHEN quantite = 0 THEN 1 ELSE 0 END) AS ruptures,
          SUM(CASE WHEN quantite > 0 AND quantite < 5 THEN 1 ELSE 0 END) AS stock_faible,
          COALESCE(SUM(quantite), 0) AS total_quantite
        FROM etat_stock
      `, { type: QueryTypes.SELECT }),

      // ── TRANSPORT KPI (FIX IMPORTANT) ──────
      sequelize.query(`
        SELECT
          COUNT(DISTINCT t.id) AS total_mois,
          SUM(CASE WHEN ts_last.status = 'VALIDER' THEN 1 ELSE 0 END) AS valides,
          SUM(CASE WHEN ts_last.status = 'REFUSER' THEN 1 ELSE 0 END) AS refuses,
          SUM(CASE WHEN ts_last.status IS NULL THEN 1 ELSE 0 END) AS en_attente
        FROM transports t
        LEFT JOIN (
          SELECT ts1.transport_id, ts1.status
          FROM transportstatus ts1
          INNER JOIN (
            SELECT transport_id, MAX(id) AS max_id
            FROM transportstatus
            GROUP BY transport_id
          ) tmax ON tmax.max_id = ts1.id
        ) ts_last ON ts_last.transport_id = t.id
        WHERE MONTH(t.date_debut_plannifier) = MONTH(CURDATE())
          AND YEAR(t.date_debut_plannifier)  = YEAR(CURDATE())
      `, { type: QueryTypes.SELECT }),

      // ── CA PAR JOUR ────────────────────────
      sequelize.query(`
        SELECT
          v.date,
          COALESCE(SUM(vp.quantite * vp.prix_unitaire), 0) AS ca
        FROM vente v
        LEFT JOIN vente_produit vp ON vp.vente_id = v.id
        WHERE v.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY v.date
        ORDER BY v.date ASC
      `, { type: QueryTypes.SELECT }),

      // ── ACHATS PAR JOUR ────────────────────
      sequelize.query(`
        SELECT
          a.date,
          COALESCE(SUM(ap.quantite * ap.prix_unitaire), 0) AS total
        FROM achat a
        LEFT JOIN achat_produit ap ON ap.achat_id = a.id
        WHERE a.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY a.date
        ORDER BY a.date ASC
      `, { type: QueryTypes.SELECT }),

      // ── TOP PRODUITS ───────────────────────
      sequelize.query(`
        SELECT
          p.id,
          p.description,
          SUM(vp.quantite) AS quantite_vendue,
          SUM(vp.quantite * vp.prix_unitaire) AS ca
        FROM vente_produit vp
        JOIN vente v ON v.id = vp.vente_id
        JOIN produits p ON p.id = vp.produit_id
        WHERE MONTH(v.date) = MONTH(CURDATE())
          AND YEAR(v.date)  = YEAR(CURDATE())
        GROUP BY p.id, p.description
        ORDER BY ca DESC
        LIMIT 5
      `, { type: QueryTypes.SELECT }),

      // ── MODE PAIEMENT ──────────────────────
      sequelize.query(`
        SELECT
          vpm.mode,
          COUNT(*) AS nb,
          SUM(vpm.recu) AS total
        FROM vente_paiement vpm
        JOIN vente v ON v.id = vpm.vente_id
        WHERE MONTH(v.date) = MONTH(CURDATE())
          AND YEAR(v.date)  = YEAR(CURDATE())
        GROUP BY vpm.mode
      `, { type: QueryTypes.SELECT }),

      // ── STATUT TRANSPORT ───────────────────
      sequelize.query(`
        SELECT
          COALESCE(ts_last.status, 'EN_ATTENTE') AS status,
          COUNT(*) AS nb
        FROM transports t
        LEFT JOIN (
          SELECT ts1.transport_id, ts1.status
          FROM transportstatus ts1
          INNER JOIN (
            SELECT transport_id, MAX(id) AS max_id
            FROM transportstatus
            GROUP BY transport_id
          ) tmax ON tmax.max_id = ts1.id
        ) ts_last ON ts_last.transport_id = t.id
        WHERE MONTH(t.date_debut_plannifier) = MONTH(CURDATE())
          AND YEAR(t.date_debut_plannifier)  = YEAR(CURDATE())
        GROUP BY COALESCE(ts_last.status, 'EN_ATTENTE')
      `, { type: QueryTypes.SELECT }),

    ]);

    return success(res, {
      ventes: {
        ...ventesKpi[0],
        ca_mois: parseFloat(ventesKpi[0].ca_mois),
        ca_today: parseFloat(ventesKpi[0].ca_today),
        nb_ventes: parseInt(ventesKpi[0].nb_ventes),
        nb_ventes_today: parseInt(ventesKpi[0].nb_ventes_today),
      },

      achats: {
        ...achatsKpi[0],
        total_achats_mois: parseFloat(achatsKpi[0].total_achats_mois),
        total_paye_mois: parseFloat(achatsKpi[0].total_paye_mois),
        nb_achats: parseInt(achatsKpi[0].nb_achats),
      },

      stock: {
        ...stockKpi[0],
        total_references: parseInt(stockKpi[0].total_references),
        ruptures: parseInt(stockKpi[0].ruptures),
        stock_faible: parseInt(stockKpi[0].stock_faible),
        total_quantite: parseInt(stockKpi[0].total_quantite),
      },

      transport: {
        ...transportKpi[0],
        total_mois: parseInt(transportKpi[0].total_mois),
        valides: parseInt(transportKpi[0].valides),
        refuses: parseInt(transportKpi[0].refuses),
        en_attente: parseInt(transportKpi[0].en_attente),
      },

      graphiques: {
        ca_par_jour: caParJour,
        achats_par_jour: achatParJour,
        top_produits: topProduits,
        paiement_modes: paiementModes,
        transport_statuts: transportStatuts,
      },
    });

  } catch (error) {
    console.error('[getDashboard]', error);
    return fail(res, 'Erreur lors de la récupération du dashboard');
  }
}

/**
 * GET /api/dashboard/ventes
 * Détail ventes uniquement (CA par mois sur 12 mois)
 */
async function getDashboardVentes(req, res) {
  try {
    const [caParMois, ventesParSite] = await Promise.all([

      sequelize.query(`
        SELECT
          YEAR(v.date)  AS annee,
          MONTH(v.date) AS mois,
          COUNT(DISTINCT v.id)                             AS nb_ventes,
          COALESCE(SUM(vp.quantite * vp.prix_unitaire), 0) AS ca
        FROM vente v
        LEFT JOIN vente_produit vp ON vp.vente_id = v.id
        WHERE v.date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY YEAR(v.date), MONTH(v.date)
        ORDER BY annee ASC, mois ASC
      `, { type: QueryTypes.SELECT }),

      sequelize.query(`
        SELECT
          s.nom AS site,
          COUNT(DISTINCT v.id)                             AS nb_ventes,
          COALESCE(SUM(vp.quantite * vp.prix_unitaire), 0) AS ca
        FROM vente v
        LEFT JOIN vente_produit vp ON vp.vente_id = v.id
        LEFT JOIN sites_activite s ON s.id = v.site_id
        WHERE MONTH(v.date) = MONTH(CURDATE())
          AND YEAR(v.date)  = YEAR(CURDATE())
        GROUP BY s.id, s.nom
        ORDER BY ca DESC
      `, { type: QueryTypes.SELECT }),

    ]);

    return success(res, { ca_par_mois: caParMois, ventes_par_site: ventesParSite });
  } catch (error) {
    console.error('[getDashboardVentes]', error);
    return fail(res, 'Erreur lors de la récupération des ventes');
  }
}

/**
 * GET /api/dashboard/stock
 * Détail stock — produits en rupture ou stock faible
 */
async function getDashboardStock(req, res) {
  try {
    const [ruptures, stockFaible, mouvements] = await Promise.all([

      sequelize.query(`
        SELECT
          p.id,
          p.description,
          s.nom AS site,
          es.quantite
        FROM etat_stock es
        JOIN produits       p ON p.id = es.produit_id
        JOIN sites_activite s ON s.id = es.site_id
        WHERE es.quantite = 0
        ORDER BY p.description ASC
      `, { type: QueryTypes.SELECT }),

      sequelize.query(`
        SELECT
          p.id,
          p.description,
          s.nom AS site,
          es.quantite
        FROM etat_stock es
        JOIN produits       p ON p.id = es.produit_id
        JOIN sites_activite s ON s.id = es.site_id
        WHERE es.quantite > 0 AND es.quantite < 5
        ORDER BY es.quantite ASC
      `, { type: QueryTypes.SELECT }),

      sequelize.query(`
        SELECT
          DATE(sk.date_mvmt) AS date,
          SUM(sk.entre)      AS entrees,
          SUM(sk.sortie)     AS sorties
        FROM stock sk
        WHERE sk.date_mvmt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(sk.date_mvmt)
        ORDER BY date ASC
      `, { type: QueryTypes.SELECT }),

    ]);

    return success(res, { ruptures, stock_faible: stockFaible, mouvements_30j: mouvements });
  } catch (error) {
    console.error('[getDashboardStock]', error);
    return fail(res, 'Erreur lors de la récupération du stock');
  }
}

module.exports = {
  getDashboard,
  getDashboardVentes,
  getDashboardStock,
};