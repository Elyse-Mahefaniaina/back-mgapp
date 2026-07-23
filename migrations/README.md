# Migrations — schéma de la base

Migrations SQL qui créent **la structure** de toutes les tables (aucune donnée).
Elles reflètent les modèles Sequelize de `models/` et remplacent la dépendance
à `sequelize.sync` (dont l'option `{update: true}` dans `index.js` est invalide).

## Ordre d'exécution

Les fichiers sont numérotés et **doivent être appliqués dans l'ordre** (dépendances de clés étrangères) :

| # | Fichier | Contenu |
|---|---------|---------|
| 001 | `001_create_core_cms_tables.sql` | CMS générique : `menu_items`, `pages`, `page_content`, `page_content_action` |
| 002 | `002_create_reference_tables.sql` | Référentiels : `app_users`, `roles`, `sites_activite`, `fournisseurs`, `produits`, `client`, `vehicules`, `journal_comptable`, `plan_comptable`, `photo`, + contacts/liaisons |
| 003 | `003_create_achat_tables.sql` | Achats : `achat`, `achat_produit`, `achat_status`, `achat_reception`, `achat_paiement` |
| 004 | `004_create_stock_inventaire_tables.sql` | Stock : `stock`, `etat_stock`, `inventaire_stock` |
| 005 | `005_create_vente_prix_tables.sql` | Ventes/prix : `prix_vente`, `etat_prix_vente`, `vente`, `Vente_produit`, `Vente_paiement` |
| 006 | `006_create_transport_tables.sql` | Transport : `transports`, `TransportStatus` |
| 007 | `007_create_comptabilite_tables.sql` | Comptabilité : `ecriture_comptable` |

## Application

```bash
# Depuis back-magasin/, en remplaçant <user> et <base>
mysql -u <user> -p <base> < migrations/001_create_core_cms_tables.sql
mysql -u <user> -p <base> < migrations/002_create_reference_tables.sql
mysql -u <user> -p <base> < migrations/003_create_achat_tables.sql
mysql -u <user> -p <base> < migrations/004_create_stock_inventaire_tables.sql
mysql -u <user> -p <base> < migrations/005_create_vente_prix_tables.sql
mysql -u <user> -p <base> < migrations/006_create_transport_tables.sql
mysql -u <user> -p <base> < migrations/007_create_comptabilite_tables.sql
```

## Ensuite : triggers puis données

1. **Triggers métier** (à la racine du projet) : `procedureAchat.sql`, `procedureReception.sql`,
   `procedureStock.sql`, `procedurePrixVente.sql`, `procedurePaiement.sql` — à appliquer **après** les tables.
2. **Données de seed** : `data.sql` (menus, pages, référentiels…) — à appliquer **en dernier**.

## Notes de conformité aux modèles

- Toutes les migrations sont **idempotentes** (`CREATE TABLE IF NOT EXISTS`) et en `utf8mb4_unicode_ci`.
- Les clés étrangères ne sont posées **que là où le modèle Sequelize déclare `references`**. Colonnes
  volontairement **sans FK** (conformes aux modèles, laissées en simple index) :
  `achat.fournisseur_id`, `achat_produit.achat_id`, `achat_produit.produit_id`,
  `achat_reception.achat_produit_id`, `photo.produit_id`, `compte_tiers.plan_comptable_id`,
  `ecriture_comptable.plan_comptable_id` / `journal_id` / `compte_tiers_id`.
- Ces FK manquantes reflètent la dette du schéma actuel ; on peut les ajouter plus tard via une
  migration `008_add_missing_fks.sql` si on veut renforcer l'intégrité référentielle.
