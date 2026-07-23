DELIMITER $$
CREATE TRIGGER after_update_achat_reception
AFTER UPDATE ON achat_reception
FOR EACH ROW
BEGIN
    DECLARE qte_demande DOUBLE;
    DECLARE qte_recue DOUBLE;
    DECLARE achatId INT;

    SELECT ap.achat_id
    INTO achatId
    FROM achat_produit ap
    WHERE ap.id = NEW.achat_produit_id;

    SELECT ap.quantite
    INTO qte_demande
    FROM achat_produit ap
    WHERE ap.id = NEW.achat_produit_id;

    SELECT COALESCE(SUM(ar.quantite_arrive), 0)
    INTO qte_recue
    FROM achat_reception ar
    WHERE ar.achat_produit_id = NEW.achat_produit_id;

    IF qte_recue >= qte_demande THEN

        IF NOT EXISTS (
            SELECT 1
            FROM achat_produit ap
            LEFT JOIN (
                SELECT ar.achat_produit_id, SUM(ar.quantite_arrive) AS total_recu
                FROM achat_reception ar
                GROUP BY ar.achat_produit_id
            ) r ON r.achat_produit_id = ap.id
            WHERE ap.achat_id = achatId
              AND COALESCE(r.total_recu, 0) < ap.quantite
        ) THEN

            INSERT INTO achat_status (achat_id, status, user_id, date)
            VALUES (achatId, 'RECEPTIONNE', NEW.user_id, NOW());

        END IF;
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER before_insert_achat_status_receptionne
BEFORE INSERT ON achat_status
FOR EACH ROW
BEGIN
    DECLARE total_demande DOUBLE;
    DECLARE total_recu DOUBLE;
    IF NEW.status = 'RECEPTIONNE' THEN
        IF EXISTS (
            SELECT 1
            FROM achat_produit ap
            LEFT JOIN (
                SELECT 
                    ar.achat_produit_id,
                    SUM(ar.quantite_arrive) AS qte_recue
                FROM achat_reception ar
                GROUP BY ar.achat_produit_id
            ) r ON r.achat_produit_id = ap.id
            WHERE COALESCE(r.qte_recue, 0) < ap.quantite
              AND ap.achat_id = NEW.achat_id
        ) THEN

            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Réception impossible : toutes les quantités ne sont pas encore reçues';

        END IF;

    END IF;
END$$
DELIMITER ;