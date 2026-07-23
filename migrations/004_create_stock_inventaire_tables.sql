-- =============================================================
-- Migration 004 - Domaine STOCK & INVENTAIRE
-- Mouvements de stock, état de stock courant, inventaires.
-- Dépend de : produits, sites_activite, app_users (migration 002).
-- Structure uniquement (aucune donnée).
-- =============================================================

CREATE TABLE IF NOT EXISTS `stock` (
    `id`           INT NOT NULL AUTO_INCREMENT,
    `produit_id`   INT NOT NULL,
    `site_id`      INT NOT NULL,
    `entre`        INT NULL DEFAULT 0,
    `sortie`       INT NULL DEFAULT 0,
    `is_inventory` TINYINT(1) NULL DEFAULT 0,
    `date_mvmt`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id`      INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_stock_produit_id` (`produit_id`),
    KEY `idx_stock_site_id` (`site_id`),
    KEY `idx_stock_user_id` (`user_id`),
    CONSTRAINT `fk_stock_produit`
        FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`),
    CONSTRAINT `fk_stock_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`),
    CONSTRAINT `fk_stock_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `etat_stock` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `produit_id` INT NOT NULL,
    `site_id`    INT NOT NULL,
    `quantite`   INT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_etat_stock_produit_id` (`produit_id`),
    KEY `idx_etat_stock_site_id` (`site_id`),
    CONSTRAINT `fk_etat_stock_produit`
        FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`),
    CONSTRAINT `fk_etat_stock_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inventaire_stock` (
    `id`               INT NOT NULL AUTO_INCREMENT,
    `code`             VARCHAR(6) NOT NULL,
    `produit_id`       INT NOT NULL,
    `site_id`          INT NOT NULL,
    `quantite_on_hand` INT NOT NULL,
    `date_inventaire`  DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id`          INT NOT NULL,
    `commentaire`      TEXT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_inventaire_produit_id` (`produit_id`),
    KEY `idx_inventaire_site_id` (`site_id`),
    KEY `idx_inventaire_user_id` (`user_id`),
    CONSTRAINT `fk_inventaire_produit`
        FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`),
    CONSTRAINT `fk_inventaire_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`),
    CONSTRAINT `fk_inventaire_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
