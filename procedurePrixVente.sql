DELIMITER $$
CREATE OR REPLACE TRIGGER trg_after_reception_price
AFTER INSERT ON achat_status
FOR EACH ROW
BEGIN

    IF NEW.status = 'RECEPTIONNE' THEN

        INSERT INTO prix_vente (
            produit_id,
            site_id,
            prix_achat_moyen,
            prix_vente,
            date_calcul
        )
        SELECT
            ap.produit_id,
            a.site_id,

            CASE 
                WHEN COALESCE(es.quantite, 0) = 0 THEN ap.prix_unitaire

                ELSE (
                    (
                        es.quantite * COALESCE(pv.last_price, ap.prix_unitaire)
                    )
                    +
                    (ap.quantite * ap.prix_unitaire)
                )
                /
                NULLIF((es.quantite + ap.quantite), 0)
            END,

            (
                CASE 
                    WHEN COALESCE(es.quantite, 0) = 0 THEN ap.prix_unitaire
                    ELSE (
                        (
                            es.quantite * COALESCE(pv.last_price, ap.prix_unitaire)
                        )
                        +
                        (ap.quantite * ap.prix_unitaire)
                    )
                    /
                    NULLIF((es.quantite + ap.quantite), 0)
                END
            )
            * (1 + COALESCE(m.marge, 0) / 100),

            NOW()

        FROM achat_produit ap
        JOIN achat a
            ON a.id = ap.achat_id

        LEFT JOIN etat_stock es
            ON es.produit_id = ap.produit_id
            AND es.site_id = a.site_id

        LEFT JOIN (
            SELECT produit_id, site_id, prix_achat_moyen AS last_price
            FROM prix_vente p1
            WHERE id = (
                SELECT MAX(id)
                FROM prix_vente p2
                WHERE p1.produit_id = p2.produit_id
                AND p1.site_id = p2.site_id
            )
        ) pv
            ON pv.produit_id = ap.produit_id
            AND pv.site_id = a.site_id

        LEFT JOIN marge_beneficiaire m
            ON m.produit_id = ap.produit_id
        
        JOIN produits p ON p.id = ap.produit_id 

        WHERE ap.achat_id = NEW.achat_id
            AND p.categorie = 'STOCKABLE';

    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE TRIGGER trg_sync_etat_prix
AFTER INSERT ON prix_vente
FOR EACH ROW
BEGIN

    IF EXISTS (
        SELECT 1
        FROM etat_prix_vente
        WHERE produit_id = NEW.produit_id
          AND site_id = NEW.site_id
    ) THEN

        -- UPDATE si existe déjà
        UPDATE etat_prix_vente
        SET 
            prix_achat_moyen = NEW.prix_achat_moyen,
            prix_vente = NEW.prix_vente,
            date_calcul = NEW.date_calcul
        WHERE produit_id = NEW.produit_id
          AND site_id = NEW.site_id;

    ELSE

        -- INSERT sinon
        INSERT INTO etat_prix_vente (
            produit_id,
            site_id,
            prix_achat_moyen,
            prix_vente,
            date_calcul
        )
        VALUES (
            NEW.produit_id,
            NEW.site_id,
            NEW.prix_achat_moyen,
            NEW.prix_vente,
            NEW.date_calcul
        );

    END IF;

END$$
DELIMITER ;