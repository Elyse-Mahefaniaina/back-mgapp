const sequelize = require('../config/db');

function parseODataFilter(filterString) {
    if (!filterString) return { sql: "", replacements: {} };

    const conditions = [];
    const replacements = {};
    let index = 0;

    const parts = filterString.split(/ and | AND /i);

    parts.forEach(cond => {
        const match = cond.match(/(\w+)\s+(eq|ne|gt|lt|like)\s+'([^']+)'/i);

        if (match) {
            const [, field, op, value] = match;

            const param = `p${index++}`;

            const sqlOp = {
                eq: "=",
                ne: "!=",
                gt: ">",
                lt: "<",
                like: "LIKE"
            }[op.toLowerCase()];

            conditions.push(`a.${field} ${sqlOp} :${param}`);

            replacements[param] =
                op.toLowerCase() === "like"
                    ? `%${value}%`
                    : value;
        }
    });

    return {
        sql: conditions.length ? `AND ${conditions.join(" AND ")}` : "",
        replacements
    };
}

const getPurchaseCreate = async (req, res) => {
    try {
        const { $filter } = req.query;

        const { sql: filterSQL, replacements } = parseODataFilter($filter);

        const [results] = await sequelize.query(`
            SELECT a.*
            FROM achat a
            WHERE (
                SELECT s.status
                FROM achat_status s
                WHERE s.achat_id = a.id
                ORDER BY s.date DESC
                LIMIT 1
            ) = 'VALIDER'
            ${filterSQL}
        `, {
            replacements
        });

        return res.json({ count: results.length, data: results });
    } catch (error) {
        res.status(500).json({
            message: "Erreur",
            error: error.message
        });
    }
};

const getPurchaseData = async (req, res) => {
    try {
        const { $filter } = req.query;
        const { sql: filterSQL, replacements } = parseODataFilter($filter);

        const [achats] = await sequelize.query(`
            SELECT a.id, a.identifiant, a.date,
                   f.nom AS fournisseur,
                   s.nom AS site
            FROM achat a
            LEFT JOIN fournisseurs f ON f.id = a.fournisseur_id
            LEFT JOIN sites_activite s ON s.id = a.site_id
            WHERE 1=1
            ${filterSQL}
        `, { replacements });

        const data = [];

        for (const achat of achats) {

            const [[totalRow]] = await sequelize.query(`
                SELECT IFNULL(SUM(quantite * prix_unitaire),0) AS total
                FROM achat_produit
                WHERE achat_id = :achat_id
            `, { replacements: { achat_id: achat.id } });

            const [[payeRow]] = await sequelize.query(`
                SELECT IFNULL(SUM(montant),0) AS total
                FROM achat_paiement
                WHERE achat_id = :achat_id
            `, { replacements: { achat_id: achat.id } });

            const [events] = await sequelize.query(`

                SELECT * FROM (

                    SELECT 
                        'creation' COLLATE utf8mb4_unicode_ci AS type,
                        'Création de la commande' COLLATE utf8mb4_unicode_ci AS label,
                        a.date AS date,
                        CONVERT(u.matricule USING utf8mb4) COLLATE utf8mb4_unicode_ci AS user,
                        CONCAT(
                            'Commande créée · Fournisseur : ' COLLATE utf8mb4_unicode_ci,
                            CONVERT(f.nom USING utf8mb4) COLLATE utf8mb4_unicode_ci,
                            ' · Site : ' COLLATE utf8mb4_unicode_ci,
                            CONVERT(s.nom USING utf8mb4) COLLATE utf8mb4_unicode_ci
                        ) AS detail
                    FROM achat a
                    LEFT JOIN fournisseurs f ON f.id = a.fournisseur_id
                    LEFT JOIN sites_activite s ON s.id = a.site_id
                    JOIN achat_status acs ON acs.achat_id = a.id AND acs.status = 'CREER'
                    JOIN app_users u on u.id = acs.user_id
                    WHERE a.id = :achat_id

                    UNION ALL

                    SELECT 
                        'ligne' COLLATE utf8mb4_unicode_ci,
                        'Ajout de ligne' COLLATE utf8mb4_unicode_ci,
                        ap.date,
                        CONVERT(u.matricule USING utf8mb4) COLLATE utf8mb4_unicode_ci,
                        CONCAT(
                            CONVERT(p.identifiant USING utf8mb4) COLLATE utf8mb4_unicode_ci,
                            ' · ' COLLATE utf8mb4_unicode_ci,
                            ap.quantite,
                            ' × ' COLLATE utf8mb4_unicode_ci,
                            ap.prix_unitaire,
                            ' = ' COLLATE utf8mb4_unicode_ci,
                            (ap.quantite * ap.prix_unitaire)
                        )
                    FROM achat_produit ap
                    LEFT JOIN produits p ON p.id = ap.produit_id
                    JOIN achat_status acs ON acs.achat_id = ap.achat_id AND acs.status = 'CREER'
                    JOIN app_users u on u.id = acs.user_id
                    WHERE ap.achat_id = :achat_id

                    UNION ALL

                    SELECT 
                        CASE 
                            WHEN status = 'VALIDER'      THEN 'validation'
                            WHEN status = 'RECEPTIONNE'  THEN 'reception'
                            WHEN status = 'PAYER'        THEN 'paiement'
                            ELSE 'status'
                        END COLLATE utf8mb4_unicode_ci,
                        CONVERT(s.status USING utf8mb4) COLLATE utf8mb4_unicode_ci,
                        s.date,
                        CONVERT(u.matricule USING utf8mb4) COLLATE utf8mb4_unicode_ci,
                        CONCAT(
                            'Statut → ' COLLATE utf8mb4_unicode_ci,
                            CONVERT(s.status USING utf8mb4) COLLATE utf8mb4_unicode_ci
                        )
                    FROM achat_status s
                    JOIN app_users u ON u.id = s.user_id
                    WHERE s.achat_id = :achat_id

                    UNION ALL

                    SELECT 
                        'paiement' COLLATE utf8mb4_unicode_ci,
                        'Paiement enregistré' COLLATE utf8mb4_unicode_ci,
                        p.date,
                        CONVERT(u.matricule USING utf8mb4) COLLATE utf8mb4_unicode_ci,
                        CONCAT(
                            p.montant,
                            ' MGA · ' COLLATE utf8mb4_unicode_ci,
                            CONVERT(p.mode_paiement USING utf8mb4) COLLATE utf8mb4_unicode_ci,
                            ' · Réf : ' COLLATE utf8mb4_unicode_ci,
                            CONVERT(IFNULL(p.reference, '-') USING utf8mb4) COLLATE utf8mb4_unicode_ci
                        )
                    FROM achat_paiement p
                    JOIN app_users u ON u.id = p.user_id
                    WHERE p.achat_id = :achat_id

                    UNION ALL

                    SELECT 
                        'reception' COLLATE utf8mb4_unicode_ci,
                        'Réception' COLLATE utf8mb4_unicode_ci,
                        r.date,
                        CONVERT(u.matricule USING utf8mb4) COLLATE utf8mb4_unicode_ci,
                        CONCAT(
                            'Quantité reçue : ' COLLATE utf8mb4_unicode_ci,
                            r.quantite_arrive
                        )
                    FROM achat_reception r
                    LEFT JOIN achat_produit ap ON ap.id = r.achat_produit_id
                    JOIN app_users u ON u.id = r.user_id
                    WHERE ap.achat_id = :achat_id

                ) t
                ORDER BY date ASC

            `, { replacements: { achat_id: achat.id } });

            data.push({
                id: achat.id,
                identifiant: achat.identifiant,
                fournisseur: achat.fournisseur,
                site: achat.site,
                date: achat.date,
                total: totalRow.total,
                montant_paye: payeRow.total,
                events: events.map(e => ({
                    ...e,
                    user: { nom: e.user }
                }))
            });
        }

        return res.json({
            count: data.length,
            data
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur",
            error: error.message
        });
    }
};

module.exports = { getPurchaseCreate, getPurchaseData };