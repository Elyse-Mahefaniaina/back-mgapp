const sequelize = require('../config/db');

const getReceiptData = async (req, res) => {
    try {
        const achatId = req.params.id
        const [results] = await sequelize.query(`
            WITH last_status AS (
                SELECT 
                    s.achat_id,
                    s.status,
                    ROW_NUMBER() OVER (PARTITION BY s.achat_id ORDER BY s.date DESC) AS rn
                FROM achat_status s
            ),
            cte_achat as (
                SELECT a.*
                FROM achat a
                JOIN last_status ls ON ls.achat_id = a.id
                WHERE ls.rn = 1
                AND ls.status = 'VALIDER'
                AND a.id = :achatId
            )
            SELECT 
                a.id achat_id,
                ap.id achat_produit_id,
                ar.id achat_reception_id,
                p.identifiant produit,
                ap.quantite,
                ar.quantite_arrive,
                ar.date
            FROM cte_achat a
            INNER JOIN achat_produit ap ON ap.achat_id = a.id
            INNER JOIN achat_reception ar on ar.achat_produit_id = ap.id
            INNER JOIN produits p on p.id = ap.produit_id
        `,{
            replacements: { achatId }
        });

        return res.json({ count: results.length, data: results });
    } catch (error) {
        res.status(500).json({
            message: "Erreur",
            error: error.message
        });
    }
};

module.exports = { getReceiptData };