INSERT INTO menu_items (id, title, path, parentId) VALUES
-- Racine (ordre d'affichage)
(1, 'Home', '/', NULL),
(20, 'Clients', NULL, NULL),
(30, 'Inventaires', NULL, NULL),
(40, 'Comptabilité', NULL, NULL),
(2, 'Paramètre de base', NULL, NULL),
(50, 'Transport', NULL, NULL);

-- Clients
(11, 'Client', '/client', 20),
(12, 'Clients', '/clientList', 20),

-- Inventaires
(13, 'Inventaires', '/inventList', 30),

-- Comptabilité
(14, 'Plan comptable', '/pcgList', 40),

-- Paramètre de base (admin)
(3, 'Rôles', '/rolesList', 2),
(4, 'Utilisateurs', '/userList', 2),
(5, 'Utilisateur', '/user', 2),
(6, 'Sites', '/contractList', 2),
(7, 'Produits', '/productList', 2),
(8, 'Produit', '/product', 2),
(9, 'Fournisseurs', '/supplierList', 2),
(10, 'Fournisseur', '/supplier', 2);

(51, 'Véhicules', '/vehiculeList', 50);

INSERT INTO pages(title, path, main_controller) 
VALUES
('Roles', '/rolesList', '/api/roles'),
('Utilisateur', '/user', '/api/users'),
('Listes Utilisateurs', '/userList', '/api/users'),
('Listes Sites', '/contractList', '/api/site'),
('Listes Fournisseurs', '/supplierList', '/api/fournisseurs'),
('Listes Produits', '/productList', '/api/produits'),
('Produits', '/product', '/api/produits'),
('Plan Comptables', '/pcgList', '/api/plan-comptables'),
('Client', '/client', '/api/clients'),
('Fournisseur', '/supplier', '/api/fournisseurs'),
('Inventaires', '/inventList', '/api/inventaires'),
('Véhicules', '/vehiculeList', '/api/vehicules');

INSERT INTO pages(title, path, main_controller) 
VALUES
('Listes Clients', '/clientList', '/api/clients');


INSERT INTO page_content (`order`, page_path, title, bind, controller, element)
VALUES
(1, '/contractList', NULL, NULL, '/api/site', 'list'),
(1, '/userList', NULL, NULL, '/api/users', 'list'),
(1, '/rolesList', NULL, NULL, '/api/roles', 'list'),
(1, '/user', 'Info', 'id', '/api/users', 'group'),
(2, '/user', 'Contacts', 'user_id', '/api/user-contacts', 'list'),
(3, '/user', 'Roles', 'user_id', '/api/user-roles', 'list'),
(1, '/supplierList', NULL, NULL, '/api/fournisseurs', 'list'),
(1, '/productList', NULL, NULL, '/api/produits', 'list'),
(1, '/product', 'Info', 'id', '/api/produits', 'group'),
(2, '/product', 'Fournisseurs', 'produit_id', '/api/produit-fournisseurs', 'list'),
(1, '/pcgList', NULL, NULL, '/api/plan-comptables', 'list'),
(1, '/clientList', NULL, NULL, '/api/clients', 'list'),
(1, '/client', 'Info', 'id', '/api/clients', 'group'),
(2, '/client', 'Contact', 'client_id', '/api/client-contacts', 'list'),
(1, '/supplier', 'Info', 'id', '/api/fournisseurs', 'group'),
(2, '/supplier', 'Contact', 'fournisseur_id', '/api/fournisseur-contacts', 'list'),
(1, '/inventList', 'Info', 'id', '/api/inventaires', 'list'),
(1, '/vehiculeList', NULL, NULL, '/api/vehicules', 'list');



INSERT INTO menu_items (id, title, path, parentId)
VALUES (60, 'Achats', NULL, NULL);

INSERT INTO menu_items (id, title, path, parentId)
VALUES (61, 'Achats', '/achatList', 60);

INSERT INTO pages (title, path, main_controller)
VALUES ('Listes Achats', '/achatList', '/api/achats');

INSERT INTO page_content (`order`, page_path, title, bind, controller, element)
VALUES (1, '/achatList', NULL, NULL, '/api/achats', 'list');


INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(62, 'Achat', '/achat', 60);

INSERT INTO pages (title, path, main_controller)
VALUES 
('Achat Détail', '/achat', '/api/achats');

INSERT INTO page_content (`order`, page_path, title, bind, controller, element)
VALUES
(1, '/achat', 'Infos Achat', 'id', '/api/achats', 'group'),
(2, '/achat', 'Produits', 'achat_id', '/api/achat-produits', 'list');

INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(63, 'Récéption', '/receipt', 60);

INSERT INTO pages (title, path, main_controller)
VALUES 
('Récéption', '/receipt', '/api/achats');

INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(64, 'Paiement', '/paiement', 60);

INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(65, 'Paiement', '/suivi-achat', 60);

INSERT INTO pages (title, path, main_controller)
VALUES 
('Paiement', '/paiement', '/api/achats');

INSERT INTO menu_items (id, title, path, parentId) VALUES
-- Racine (ordre d'affichage)
(70, 'Vente', NULL, NULL);

INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(71, 'Marge Bénéficiaire', '/margebenefList', 70);

INSERT INTO pages (title, path, main_controller)
VALUES 
('Marge bénéficiaire', '/margebenefList', '/api/marge');

INSERT INTO page_content (`order`, page_path, title, bind, controller, element)
VALUES
(1, '/margebenefList', NULL, NULL, '/api/marge', 'list');

INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(72, 'Prix de vente', '/salesCoastStateList', 70);

INSERT INTO pages (title, path, main_controller)
VALUES 
('Prix de vente', '/salesCoastStateList', '/api/sale-coast-states');

INSERT INTO page_content (`order`, page_path, title, bind, controller, element, authorizedAction)
VALUES
(1, '/salesCoastStateList', NULL, NULL, '/api/sale-coast-states', 'list', '---');

INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(73, 'Historique prix de vente', '/salesCoastList', 70);

INSERT INTO pages (title, path, main_controller)
VALUES 
('Historique de prix de vente', '/salesCoastList', '/api/sale-coasts');

INSERT INTO page_content (`order`, page_path, title, bind, controller, element)
VALUES
(1, '/salesCoastList', NULL, NULL, '/api/sale-coasts', 'list');


INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(75, 'Caisse', '/vente', 70);


INSERT INTO menu_items (id, title, path, parentId) VALUES
-- Racine (ordre d'affichage)
(80, 'Stock', NULL, NULL);

INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(82, 'Mouvement de stock', '/stockList', 80);

INSERT INTO pages (title, path, main_controller)
VALUES 
('Mouvement de stock', '/stockList', '/api/stocks');

INSERT INTO page_content (`order`, page_path, title, bind, controller, element)
VALUES
(1, '/stockList', NULL, NULL, '/api/stocks', 'list');



INSERT INTO menu_items (id, title, path, parentId)
VALUES 
(81, 'Etat de stock', '/stocStatekList', 80);

INSERT INTO pages (title, path, main_controller)
VALUES 
('Etat de stock', '/stocStatekList', '/api/etat-stocks');

INSERT INTO page_content (`order`, page_path, title, bind, controller, element, authorizedAction)
VALUES
(1, '/stocStatekList', NULL, NULL, '/api/etat-stocks', 'list', '---');

-- page content action
INSERT INTO page_content_action(`order`, page_content_id, type, controller, bind, fetch_value, value_field)
VALUES
(1, 123, 'status', '/api/achat-status', 'achat_id', '$order=date DESC', 'status');


INSERT INTO menu_items (id, title, path, parentId) VALUES

(52, 'Suivi', '/suivi', 50);

INSERT INTO menu_items (id, title, path, parentId) VALUES

(53, 'Validation demande', '/validation', 50);