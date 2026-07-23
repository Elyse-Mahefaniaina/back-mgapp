-- =============================================================
-- Migration 005 - Domaine VENTE & PRIX
-- Prix de vente (historique + état courant), ventes, lignes, paiements.
-- Dépend de : produits, sites_activite, client, app_users (migration 002).
-- Structure uniquement (aucune donnée).
-- NB : noms de tables tels que définis dans les modèles
--      (Vente_produit / Vente_paiement avec V majuscule).
-- =============================================================

CREATE TABLE IF NOT EXISTS `prix_vente` (
    `id`               INT NOT NULL AUTO_INCREMENT,
    `produit_id`       INT NOT NULL,
    `prix_achat_moyen` FLOAT NOT NULL,
    `prix_vente`       FLOAT NOT NULL,
    `date_calcul`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `site_id`          INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_prix_vente_produit_id` (`produit_id`),
    KEY `idx_prix_vente_site_id` (`site_id`),
    CONSTRAINT `fk_prix_vente_produit`
        FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_prix_vente_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `etat_prix_vente` (
    `id`               INT NOT NULL AUTO_INCREMENT,
    `produit_id`       INT NOT NULL,
    `prix_achat_moyen` FLOAT NOT NULL,
    `prix_vente`       FLOAT NOT NULL,
    `date_calcul`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `site_id`          INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_etat_prix_vente_produit_id` (`produit_id`),
    KEY `idx_etat_prix_vente_site_id` (`site_id`),
    CONSTRAINT `fk_etat_prix_vente_produit`
        FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_etat_prix_vente_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vente` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `identifiant` VARCHAR(255) NOT NULL,
    `date`        DATE NULL DEFAULT (CURDATE()),
    `client_id`   INT NOT NULL,
    `site_id`     INT NOT NULL,
    `user_id`     INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_vente_client_id` (`client_id`),
    KEY `idx_vente_site_id` (`site_id`),
    KEY `idx_vente_user_id` (`user_id`),
    CONSTRAINT `fk_vente_client`
        FOREIGN KEY (`client_id`) REFERENCES `client` (`id`),
    CONSTRAINT `fk_vente_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_vente_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Vente_produit` (
    `id`            INT NOT NULL AUTO_INCREMENT,
    `quantite`      DOUBLE NOT NULL DEFAULT 0,
    `prix_unitaire` FLOAT NOT NULL,
    `vente_id`      INT NULL,
    `produit_id`    INT NOT NULL,
    `date`          DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_vente_produit_vente_id` (`vente_id`),
    KEY `idx_vente_produit_produit_id` (`produit_id`),
    CONSTRAINT `fk_vente_produit_vente`
        FOREIGN KEY (`vente_id`) REFERENCES `vente` (`id`),
    CONSTRAINT `fk_vente_produit_produit`
        FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Vente_paiement` (
    `id`       INT NOT NULL AUTO_INCREMENT,
    `mode`     VARCHAR(255) NULL,
    `recu`     DOUBLE NULL,
    `rendu`    DOUBLE NULL,
    `vente_id` INT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_vente_paiement_vente_id` (`vente_id`),
    CONSTRAINT `fk_vente_paiement_vente`
        FOREIGN KEY (`vente_id`) REFERENCES `vente` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
