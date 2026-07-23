const sequelize = require('../config/db');

exports.getAchatsReceptionnes = async (req, res) => {
  try {

    const rows = await sequelize.query(`
      SELECT 
        a.id,
        a.identifiant,
        a.date,
        f.nom AS fournisseur,
        site.numero as site,

        ap.id AS ligne_id,
        p.identifiant AS produit,
        ap.quantite,
        ap.prix_unitaire,

        COALESCE(paiement.total_paye, 0) AS montant_paye

      FROM achat a
      JOIN fournisseurs f ON f.id = a.fournisseur_id
      JOIN achat_produit ap ON ap.achat_id = a.id
      JOIN produits p ON p.id = ap.produit_id
      JOIN sites_activite site on site.id = a.site_id

      JOIN achat_status s ON s.achat_id = a.id
      AND s.date = (
        SELECT MAX(s2.date)
        FROM achat_status s2
        WHERE s2.achat_id = a.id
      )
      AND s.status = 'RECEPTIONNE'

      LEFT JOIN (
        SELECT achat_id, SUM(montant) AS total_paye
        FROM achat_paiement
        GROUP BY achat_id
      ) paiement ON paiement.achat_id = a.id

      ORDER BY a.id DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    const achatsMap = {};

    rows.forEach(row => {

      if (!achatsMap[row.id]) {
        achatsMap[row.id] = {
          id: row.id,
          identifiant: row.identifiant,
          date: row.date,
          fournisseur: row.fournisseur,
          site: row.site,
          lignes: [],
          montant_paye: row.montant_paye
        };
      }

      achatsMap[row.id].lignes.push({
        produit: row.produit,
        qte: row.quantite,
        pu: row.prix_unitaire
      });
    });

    const result = Object.values(achatsMap);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};