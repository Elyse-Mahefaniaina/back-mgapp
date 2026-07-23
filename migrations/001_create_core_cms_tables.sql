-- =============================================================
-- Migration 001 - Tables du CMS générique (menu / pages)
-- Crée uniquement la STRUCTURE (aucune donnée).
-- Les données de seed restent dans data.sql.
-- Ordre respectant les dépendances de clés étrangères.
-- =============================================================

-- 1. menu_items (auto-référencée via parentId)
CREATE TABLE IF NOT EXISTS `menu_items` (
    `id`        INT NOT NULL AUTO_INCREMENT,
    `title`     VARCHAR(100) NOT NULL,
    `path`      VARCHAR(255) NULL,
    `parentId`  INT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_menu_items_parentId` (`parentId`),
    CONSTRAINT `fk_menu_items_parent`
        FOREIGN KEY (`parentId`) REFERENCES `menu_items` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. pages
CREATE TABLE IF NOT EXISTS `pages` (
    `id`               INT NOT NULL AUTO_INCREMENT,
    `title`            VARCHAR(100) NOT NULL,
    `path`             VARCHAR(255) NULL,
    `main_controller`  VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_pages_path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. page_content (page_path pointe logiquement vers pages.path)
CREATE TABLE IF NOT EXISTS `page_content` (
    `id`                INT NOT NULL AUTO_INCREMENT,
    `order`             INT NOT NULL,
    `page_path`         VARCHAR(255) NOT NULL,
    `title`             VARCHAR(255) NOT NULL,
    `bind`              VARCHAR(255) NULL DEFAULT '*',
    `controller`        VARCHAR(255) NOT NULL,
    `element`           VARCHAR(25) NOT NULL,
    `authorizedAction`  VARCHAR(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_page_content_page_path` (`page_path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. page_content_action (FK vers page_content)
CREATE TABLE IF NOT EXISTS `page_content_action` (
    `id`               INT NOT NULL AUTO_INCREMENT,
    `order`            INT NOT NULL,
    `page_content_id`  INT NOT NULL,
    `type`             VARCHAR(255) NOT NULL,
    `controller`       VARCHAR(255) NULL,
    `bind`             VARCHAR(255) NULL,
    `fetch_value`      VARCHAR(255) NULL,
    `value_field`      VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pca_page_content_id` (`page_content_id`),
    CONSTRAINT `fk_pca_page_content`
        FOREIGN KEY (`page_content_id`) REFERENCES `page_content` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- ROLLBACK (à exécuter manuellement pour annuler) :
--   DROP TABLE IF EXISTS `page_content_action`;
--   DROP TABLE IF EXISTS `page_content`;
--   DROP TABLE IF EXISTS `pages`;
--   DROP TABLE IF EXISTS `menu_items`;
-- =============================================================
