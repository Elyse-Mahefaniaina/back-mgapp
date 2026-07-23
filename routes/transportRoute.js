const express = require('express');
const router = express.Router();
const TransportController = require('../controllers/TransportController');

// ── Utilitaire ─────────────────────────────────────────────────────────────
router.get('/vehicules-dispos', TransportController.getVehiculesDisponibles);

// ── Validation ─────────────────────────────────────────────────────────────
router.get('/en-attente', TransportController.getTransportsEnAttente);
router.post('/:id/valider', TransportController.validerTransport);
router.post('/:id/refuser', TransportController.refuserTransport);

// ── Transport CRUD ─────────────────────────────────────────────────────────
router.get('/', TransportController.getAllTransports);
router.get('/:id', TransportController.getTransportById);
router.post('/', TransportController.createTransport);
router.put('/:id', TransportController.updateTransport);
router.delete('/:id', TransportController.deleteTransport);

module.exports = router;