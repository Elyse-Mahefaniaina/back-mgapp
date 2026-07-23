DELIMITER //
CREATE TRIGGER trg_after_insert_paiement
AFTER INSERT ON achat_paiement
FOR EACH ROW
BEGIN
    DECLARE total_achat DECIMAL(12,2);
    DECLARE total_paye DECIMAL(12,2);

    -- total achat
    SELECT IFNULL(SUM(quantite * prix_unitaire),0)
    INTO total_achat
    FROM achat_produit
    WHERE achat_id = NEW.achat_id;

    -- total payé
    SELECT IFNULL(SUM(montant),0)
    INTO total_paye
    FROM achat_paiement
    WHERE achat_id = NEW.achat_id;

    IF total_paye >= total_achat THEN
        
        -- éviter doublon PAYER
        IF NOT EXISTS (
            SELECT 1 FROM achat_status 
            WHERE achat_id = NEW.achat_id AND status = 'PAYER'
        ) THEN
            INSERT INTO achat_status (achat_id, status, user_id, date)
            VALUES (NEW.achat_id, 'PAYER', NEW.user_id, NOW());
        END IF;

        -- éviter doublon FERMER
        IF NOT EXISTS (
            SELECT 1 FROM achat_status 
            WHERE achat_id = NEW.achat_id AND status = 'FERMER'
        ) THEN
            INSERT INTO achat_status (achat_id, status, user_id, date)
            VALUES (NEW.achat_id, 'FERMER', NEW.user_id, NOW());
        END IF;

    END IF;

END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER trg_before_insert_status
BEFORE INSERT ON achat_status
FOR EACH ROW
BEGIN
    DECLARE total_achat DECIMAL(12,2);
    DECLARE total_paye DECIMAL(12,2);

    IF NEW.status IN ('PAYER', 'FERMER') THEN

        SELECT IFNULL(SUM(quantite * prix_unitaire),0)
        INTO total_achat
        FROM achat_produit
        WHERE achat_id = NEW.achat_id;

        SELECT IFNULL(SUM(montant),0)
        INTO total_paye
        FROM achat_paiement
        WHERE achat_id = NEW.achat_id;

        IF total_paye < total_achat THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Paiement non complet';
        END IF;

    END IF;

END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_before_insert_paiement
BEFORE INSERT ON achat_paiement
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM achat_status 
        WHERE achat_id = NEW.achat_id 
        AND status = 'PAYER'
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Paiement interdit : achat deja PAYER';
    END IF;
END;
//
DELIMITER ;