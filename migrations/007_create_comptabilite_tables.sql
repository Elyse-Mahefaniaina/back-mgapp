-- =============================================================
-- Migration 007 - Domaine COMPTABILITE
-- Écritures comptables.
-- Dépend de : sites_activite (migration 002).
-- (plan_comptable, journal_comptable, compte_tiers sont créés en 002)
-- Structure uniquement (aucune donnée).
-- NB : conforme au modèle -> FK uniquement sur site_id.
--      plan_comptable_id / journal_id / compte_tiers_id n'ont pas
--      de FK déclarée côté modèle -> simples index.
-- =============================================================

CREATE TABLE IF NOT EXISTS `ecriture_comptable` (
    `id`                INT NOT NULL AUTO_INCREMENT,
    `site_id`           INT NOT NULL,
    `date`              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `libelle`           VARCHAR(255) NOT NULL,
    `debit`             DOUBLE NOT NULL,
    `credit`            DOUBLE NOT NULL,
    `plan_comptable_id` INT NOT NULL,
    `journal_id`        INT NOT NULL,
    `compte_tiers_id`   INT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_ecriture_site_id` (`site_id`),
    KEY `idx_ecriture_plan_id` (`plan_comptable_id`),
    KEY `idx_ecriture_journal_id` (`journal_id`),
    KEY `idx_ecriture_compte_tiers_id` (`compte_tiers_id`),
    CONSTRAINT `fk_ecriture_site`
        FOREIGN KEY (`site_id`) REFERENCES `sites_activite` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
