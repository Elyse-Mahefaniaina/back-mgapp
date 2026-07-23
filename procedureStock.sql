DELIMITER $$
CREATE OR REPLACE TRIGGER trg_after_insert_achat_status
AFTER INSERT ON achat_status
FOR EACH ROW
BEGIN
    IF NEW.status = 'RECEPTIONNE' THEN

        INSERT INTO stock (
            produit_id,
            site_id,
            entre,
            sortie,
            is_inventory,
            date_mvmt,
            user_id
        )
        SELECT 
            ap.produit_id,
            a.site_id,
            ap.quantite,
            0,
            0,
            NOW(),
            NEW.user_id
        FROM achat_produit ap
        JOIN achat a ON a.id = ap.achat_id
        JOIN produits p ON p.id = ap.produit_id
        WHERE ap.achat_id = NEW.achat_id
            AND p.categorie = 'STOCKABLE';

    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_after_insert_stock
AFTER INSERT ON stock
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM etat_stock 
        WHERE produit_id = NEW.produit_id 
        AND site_id = NEW.site_id
    ) THEN

        UPDATE etat_stock
        SET quantite = quantite + (NEW.entre - NEW.sortie)
        WHERE produit_id = NEW.produit_id 
        AND site_id = NEW.site_id;

    ELSE
        -- Sinon INSERT
        INSERT INTO etat_stock (produit_id, site_id, quantite)
        VALUES (
            NEW.produit_id,
            NEW.site_id,
            (NEW.entre - NEW.sortie)
        );
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE TRIGGER trg_after_insert_inventaire
AFTER INSERT ON inventaire_stock
FOR EACH ROW
BEGIN
    DECLARE categories VARCHAR(50) DEFAULT 'STOCKABLE';
    DECLARE stock_actuel INT DEFAULT 0;
    DECLARE ecart INT DEFAULT 0;

    SELECT COALESCE(quantite, 0)
    INTO stock_actuel
    FROM etat_stock
    WHERE produit_id = NEW.produit_id
      AND site_id = NEW.site_id
    LIMIT 1;

        SET ecart = NEW.quantite_on_hand - stock_actuel;

        IF ecart <> 0 THEN

            INSERT INTO stock (
                produit_id,
                site_id,
                entre,
                sortie,
                is_inventory,
                date_mvmt,
                user_id
            )
            VALUES (
                NEW.produit_id,
                NEW.site_id,
                GREATEST(ecart, 0),
                GREATEST(-ecart, 0), 
                1,
                NOW(),
                NEW.user_id
            );
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE OR REPLACE TRIGGER trg_after_insert_vente_produit
AFTER INSERT ON vente_produit
FOR EACH ROW
BEGIN
    INSERT INTO stock (
        produit_id,
        site_id,
        entre,
        sortie,
        is_inventory,
        date_mvmt,
        user_id
    )
    SELECT 
        vp.produit_id,
        v.site_id,
        0,
        vp.quantite,
        0,
        NOW(),
        v.user_id
    FROM vente_produit vp
    JOIN vente v ON vp.vente_id = v.id
    WHERE vp.id = NEW.id;
END$$
DELIMITER ;