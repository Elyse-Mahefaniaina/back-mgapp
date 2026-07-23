const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getProduitsBySite = async (req, res) => {
    try {
        const site_id = parseInt(req.params.site_id, 10);

        const results = await sequelize.query(
            `
            SELECT 
                p.id,
                p.identifiant,
                p.name,
                pv.prix_vente,
                pv.site_id,
                es.quantite
            FROM produits p
            JOIN etat_prix_vente pv ON p.id = pv.produit_id
            JOIN etat_stock es ON p.id = es.produit_id AND es.site_id = pv.site_id
            WHERE p.categorie = 'STOCKABLE'
                AND es.quantite > 0
                AND pv.site_id = :site_id
            `,
            {
                replacements: { site_id },
                type: QueryTypes.SELECT
            }
        );

        // transformation format PRODUITS_MOCK
        const produits = results.map(p => ({
            id: p.id,
            nom: `${p.identifiant} - ${p.name}`,
            prix: p.prix_vente,
            stock: p.quantite,
            site_id: p.site_id
        }));

        res.json({
            success: true,
            data: produits
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};