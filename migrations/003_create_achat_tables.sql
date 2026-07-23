-- =============================================================
-- Migration 003 - Domaine ACHAT
-- Commandes fournisseur, lignes, statuts, réceptions, paiements.
-- Dépend de : sites_activite, app_users (migration 002).
-- Structure uniquement (aucune donnée).
-- NB : conforme aux modèles Sequelize -> FK uniquement là où
--      le modèle déclare `references`. achat.fournisseur_id,
--      achat_produit.achat_id/produit_id et
--      achat_reception.achat_produit_id n'ont pas de FK côté modèle.
-- =============================================================

CREATE TABLE IF NOT EXISTS `achat` (
    `id`             INT NOT NULL AUTO_INCREMENT,
    `identifiant`    VARCHAR(255) NOT NULL,
    `date`           DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `fournisseur_id` INT NOT NULL,
    `site_id`        INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_achat_identifiant` (`identifiant`),
    KEY `idx_achat_fournisseur_id` (`fournisseur_id`),
    KEY `idx_achat_site_id` (`site_id`),
    CONSTRAINT `fk_achat_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `achat_produit` (
    `id`            INT NOT NULL AUTO_INCREMENT,
    `quantite`      INT NOT NULL DEFAULT 0,
    `prix_unitaire` FLOAT NOT NULL,
    `achat_id`      INT NULL,
    `produit_id`    INT NOT NULL,
    `date`          DATETIME NOT NULL,
    `unite`         VARCHAR(20) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_achat_produit_achat_id` (`achat_id`),
    KEY `idx_achat_produit_produit_id` (`produit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `achat_status` (
    `id`       INT NOT NULL AUTO_INCREMENT,
    `achat_id` INT NULL,
    `status`   ENUM('CREER','VALIDER','RECEPTIONNE','FERMER','ANNULER','PAYER') NOT NULL,
    `user_id`  INT NOT NULL,
    `date`     DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_achat_status_achat_id` (`achat_id`),
    KEY `idx_achat_status_user_id` (`user_id`),
    CONSTRAINT `fk_achat_status_achat`
        FOREIGN KEY (`achat_id`) REFERENCES `achat` (`id`),
    CONSTRAINT `fk_achat_status_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `achat_reception` (
    `id`               INT NOT NULL AUTO_INCREMENT,
    `quantite_arrive`  DOUBLE NULL,
    `achat_produit_id` INT NULL,
    `date`             DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id`          INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_achat_reception_ap_id` (`achat_produit_id`),
    KEY `idx_achat_reception_user_id` (`user_id`),
    CONSTRAINT `fk_achat_reception_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `achat_paiement` (
    `id`            INT NOT NULL AUTO_INCREMENT,
    `achat_id`      INT NOT NULL,
    `montant`       DECIMAL(12,2) NOT NULL DEFAULT 0,
    `mode_paiement` ENUM('ESPECES','VIREMENT','CHEQUE','MOBILE_MONEY') NOT NULL,
    `reference`     VARCHAR(255) NULL,
    `date`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id`       INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_achat_paiement_achat_id` (`achat_id`),
    KEY `idx_achat_paiement_user_id` (`user_id`),
    CONSTRAINT `fk_achat_paiement_achat`
        FOREIGN KEY (`achat_id`) REFERENCES `achat` (`id`),
    CONSTRAINT `fk_achat_paiement_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
