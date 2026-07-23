-- =============================================================
-- Migration 006 - Domaine TRANSPORT
-- Transports (planification) et leurs statuts.
-- Dépend de : app_users, sites_activite, vehicules (migration 002).
-- Structure uniquement (aucune donnée).
-- NB : nom de table `TransportStatus` tel que défini dans le modèle.
-- =============================================================

CREATE TABLE IF NOT EXISTS `transports` (
    `id`                     INT NOT NULL AUTO_INCREMENT,
    `user_id`                INT NOT NULL,
    `site_id`                INT NOT NULL,
    `vehicule_id`            INT NULL,
    `date_db`                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_debut_plannifier`  DATETIME NOT NULL,
    `date_fin_plannifier`    DATETIME NOT NULL,
    `depart`                 VARCHAR(100) NOT NULL,
    `destination`            VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_transports_user_id` (`user_id`),
    KEY `idx_transports_site_id` (`site_id`),
    KEY `idx_transports_vehicule_id` (`vehicule_id`),
    CONSTRAINT `fk_transports_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`),
    CONSTRAINT `fk_transports_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`),
    CONSTRAINT `fk_transports_vehicule`
        FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `TransportStatus` (
    `id`           INT NOT NULL AUTO_INCREMENT,
    `user_id`      INT NOT NULL,
    `transport_id` INT NOT NULL,
    `status`       ENUM('VALIDER','REFUSER') NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_transport_status_user_id` (`user_id`),
    KEY `idx_transport_status_transport_id` (`transport_id`),
    CONSTRAINT `fk_transport_status_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`),
    CONSTRAINT `fk_transport_status_transport`
        FOREIGN KEY (`transport_id`) REFERENCES `transports` (`id`)
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
