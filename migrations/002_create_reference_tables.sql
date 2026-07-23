-- =============================================================
-- Migration 002 - Tables de référence (base, sans dépendances lourdes)
-- Utilisateurs, rôles, sites, fournisseurs, produits, clients,
-- véhicules, plan comptable + tables de liaison/contacts.
-- Structure uniquement (aucune donnée).
-- =============================================================

-- ---------- Tables racines (aucune FK) ----------

CREATE TABLE IF NOT EXISTS `app_users` (
    `id`             INT NOT NULL AUTO_INCREMENT,
    `matricule`      VARCHAR(25) NOT NULL,
    `nom`            VARCHAR(50) NOT NULL,
    `password`       VARCHAR(100) NOT NULL,
    `isPasswordTemp` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_app_users_matricule` (`matricule`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `roles` (
    `id`   INT NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_roles_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sites_activite` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `numero`      VARCHAR(20) NOT NULL,
    `nom`         VARCHAR(100) NOT NULL,
    `emplacement` VARCHAR(255) NULL,
    `contact`     VARCHAR(100) NULL,
    `responsable` VARCHAR(100) NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_sites_activite_numero` (`numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fournisseurs` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `identifiant` VARCHAR(25) NOT NULL,
    `nom`         VARCHAR(100) NULL,
    `siege`       VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_fournisseurs_identifiant` (`identifiant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `produits` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `identifiant` VARCHAR(25) NOT NULL,
    `categorie`   ENUM('STOCKABLE','NON_STOCKABLE') NOT NULL,
    `etat`        ENUM('PERISSABLE','NON_PERISSABLE') NOT NULL,
    `name`        VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_produits_identifiant` (`identifiant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `client` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `identifiant` VARCHAR(255) NOT NULL,
    `name`        VARCHAR(255) NOT NULL,
    `cin`         VARCHAR(255) NOT NULL,
    `adresse`     VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_client_identifiant` (`identifiant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vehicules` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `matricule`             VARCHAR(20) NOT NULL,
    `marque`                VARCHAR(50) NOT NULL,
    `modele`                VARCHAR(50) NOT NULL,
    `couleur`               VARCHAR(30) NOT NULL,
    `numero_chassis`        VARCHAR(50) NULL DEFAULT '--',
    `puissance_fiscale`     VARCHAR(10) NOT NULL DEFAULT '--',
    `annee_circulation`     INT NULL,
    `date_mise_circulation` DATE NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_vehicules_matricule` (`matricule`),
    UNIQUE KEY `uq_vehicules_numero_chassis` (`numero_chassis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `journal_comptable` (
    `id`      INT NOT NULL AUTO_INCREMENT,
    `code`    VARCHAR(255) NOT NULL,
    `libelle` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_journal_comptable_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `plan_comptable` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `code`        VARCHAR(255) NOT NULL,
    `classe`      INT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_plan_comptable_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- photo.produit_id : pas de FK déclarée côté modèle -> index simple
CREATE TABLE IF NOT EXISTS `photo` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `lien`       VARCHAR(255) NOT NULL,
    `produit_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_photo_produit_id` (`produit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Tables dépendantes (contacts / liaisons) ----------

CREATE TABLE IF NOT EXISTS `user_contacts` (
    `id`      INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `type`    ENUM('email','phone') NOT NULL,
    `valeur`  VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_contacts_user_id` (`user_id`),
    CONSTRAINT `fk_user_contacts_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_roles` (
    `id`      INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `role_id` INT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_roles_user_id` (`user_id`),
    KEY `idx_user_roles_role_id` (`role_id`),
    CONSTRAINT `fk_user_roles_user`
        FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_user_roles_role`
        FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `role_permission_sites` (
    `id`               INT NOT NULL AUTO_INCREMENT,
    `role_id`          INT NOT NULL,
    `siteActivite_id`  INT NOT NULL,
    `controller_name`  VARCHAR(100) NOT NULL,
    `can_create`       TINYINT(1) NOT NULL DEFAULT 0,
    `can_read`         TINYINT(1) NOT NULL DEFAULT 0,
    `can_update`       TINYINT(1) NOT NULL DEFAULT 0,
    `can_delete`       TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_rps_role_id` (`role_id`),
    KEY `idx_rps_site_id` (`siteActivite_id`),
    CONSTRAINT `fk_rps_role`
        FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_rps_site`
        FOREIGN KEY (`siteActivite_id`) REFERENCES `sites_activite` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contacts_client` (
    `id`        INT NOT NULL AUTO_INCREMENT,
    `type`      ENUM('email','phone') NOT NULL,
    `value`     VARCHAR(100) NOT NULL,
    `client_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_contacts_client_client_id` (`client_id`),
    CONSTRAINT `fk_contacts_client_client`
        FOREIGN KEY (`client_id`) REFERENCES `client` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contacts_fournisseur` (
    `id`             INT NOT NULL AUTO_INCREMENT,
    `type`           ENUM('email','phone') NOT NULL,
    `value`          VARCHAR(100) NOT NULL,
    `fournisseur_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_contacts_fournisseur_fid` (`fournisseur_id`),
    CONSTRAINT `fk_contacts_fournisseur_fournisseur`
        FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `produit_fournisseur` (
    `id`             INT NOT NULL AUTO_INCREMENT,
    `produit_id`     INT NOT NULL,
    `fournisseur_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pf_produit_id` (`produit_id`),
    KEY `idx_pf_fournisseur_id` (`fournisseur_id`),
    CONSTRAINT `fk_pf_produit`
        FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_pf_fournisseur`
        FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `marge_beneficiaire` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `produit_id` INT NOT NULL,
    `marge`      INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_marge_produit_id` (`produit_id`),
    CONSTRAINT `fk_marge_produit`
        FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- compte_tiers.plan_comptable_id : pas de FK déclarée côté modèle
CREATE TABLE IF NOT EXISTS `compte_tiers` (
    `id`                INT NOT NULL AUTO_INCREMENT,
    `identifiant`       VARCHAR(255) NOT NULL,
    `type`              VARCHAR(255) NOT NULL,
    `plan_comptable_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_compte_tiers_plan_id` (`plan_comptable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
