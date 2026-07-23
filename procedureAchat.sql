DELIMITER $$
CREATE OR REPLACE TRIGGER before_insert_achat_produit
BEFORE INSERT ON achat_produit
FOR EACH ROW
BEGIN
    DECLARE last_status VARCHAR(50);

    SELECT status INTO last_status
    FROM achat_status
    WHERE achat_id = NEW.achat_id
    ORDER BY date DESC
    LIMIT 1;

    IF last_status IS NULL OR last_status <> 'CREER' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Action refusée : modifications autorisées uniquement en statut CREER';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE TRIGGER before_update_achat_produit
BEFORE UPDATE ON achat_produit
FOR EACH ROW
BEGIN
    DECLARE last_status VARCHAR(50);

    SELECT status INTO last_status
    FROM achat_status
    WHERE achat_id = NEW.achat_id
    ORDER BY date DESC
    LIMIT 1;

    IF last_status <> 'CREER' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Modification refusée : achat déjà validé ou traité';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE TRIGGER before_delete_achat_produit
BEFORE DELETE ON achat_produit
FOR EACH ROW
BEGIN
    DECLARE last_status VARCHAR(50);

    SELECT status INTO last_status
    FROM achat_status
    WHERE achat_id = OLD.achat_id
    ORDER BY date DESC
    LIMIT 1;

    IF last_status <> 'CREER' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Suppression refusée : achat déjà validé ou traité';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE TRIGGER before_delete_achat
BEFORE DELETE ON achat
FOR EACH ROW
BEGIN
    DECLARE last_status VARCHAR(50);

    SELECT status INTO last_status
    FROM achat_status
    WHERE achat_id = OLD.id
    ORDER BY date DESC
    LIMIT 1;

    IF last_status <> 'CREER' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Suppression refusée : seul un achat en statut CREER peut être supprimé';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE TRIGGER before_update_achat
BEFORE UPDATE ON achat
FOR EACH ROW
BEGIN
    DECLARE last_status VARCHAR(50);

    SELECT status INTO last_status
    FROM achat_status
    WHERE achat_id = NEW.id
    ORDER BY date DESC
    LIMIT 1;

    IF last_status <> 'CREER' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Modification refusée : seul un achat en statut CREER peut être modifié';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE TRIGGER before_insert_achat_status
BEFORE INSERT ON achat_status
FOR EACH ROW
BEGIN
    DECLARE last_status VARCHAR(50);

    -- récupérer dernier status
    SELECT status INTO last_status
    FROM achat_status
    WHERE achat_id = NEW.achat_id
    ORDER BY date DESC
    LIMIT 1;

    IF last_status IN ('ANNULER', 'FERMER') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Action impossible : cet achat est déjà terminé ou annulé';
    END IF;

    IF last_status IS NULL THEN
        IF NEW.status <> 'CREER' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erreur : le premier statut doit être "Créé"';
        END IF;
    END IF;

    IF last_status = 'CREER' THEN
        IF NEW.status NOT IN ('VALIDER', 'ANNULER') THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Action invalide : vous devez valider ou annuler cet achat';
        END IF;
    END IF;

    IF last_status = 'VALIDER' THEN
        IF NEW.status NOT IN ('RECEPTIONNE', 'ANNULER') THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Action invalide : vous devez réceptionner (total ou partiel) ou annuler';
        END IF;
    END IF;

    IF last_status = 'RECEPTIONNE' THEN
        IF NEW.status NOT IN ('PAYER') THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Action invalide : vous devez passer au paiement';
        END IF;
    END IF;

    IF last_status = 'PAYER' THEN
        IF NEW.status <> 'FERMER' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Action invalide : vous devez clôturer cet achat';
        END IF;
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE TRIGGER after_insert_achat_status_valider
AFTER INSERT ON achat_status
FOR EACH ROW
BEGIN
    IF NEW.status = 'VALIDER' THEN
        INSERT INTO achat_reception (quantite_arrive, achat_produit_id, date, user_id)
        SELECT 
            0,
            ap.id,
            NOW(),
            NEW.user_id
        FROM achat_produit ap
        WHERE ap.achat_id = NEW.achat_id;

    END IF;
END$$
DELIMITER ;