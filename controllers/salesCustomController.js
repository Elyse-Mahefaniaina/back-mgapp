const sequelize = require('../config/db');
const Vente = require('../models/vente/Vente');
const VenteProduit = require('../models/vente/VenteProduits');
const VentePaiement = require('../models/vente/VentePaiement');

exports.createSalesCompleted = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      identifiant,
      date,
      client_id,
      site_id,
      user_id,
      produits,
      paiements
    } = req.body;

    if (!produits || !Array.isArray(produits) || produits.length === 0) {
      throw new Error("Aucun produit fourni");
    }

    const vente = await Vente.create({
      identifiant,
      date,
      client_id,
      site_id,
      user_id
    }, { transaction: t });

    const venteProduitsData = produits.map(p => ({
      vente_id: vente.id,
      produit_id: p.produit_id,
      quantite: p.quantite || 0,
      prix_unitaire: p.prix_unitaire,
      date: date
    }));

    await VenteProduit.bulkCreate(venteProduitsData, { transaction: t });

    if (paiements && Array.isArray(paiements) && paiements.length > 0) {
      const paiementsData = paiements.map(p => ({
        vente_id: vente.id,
        mode: p.mode,
        recu: p.recu || 0,
        rendu: p.rendu || 0,
      }));

      await VentePaiement.bulkCreate(paiementsData, { transaction: t });
    }

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Vente créée avec succès",
      data: vente
    });

  } catch (error) {
    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};