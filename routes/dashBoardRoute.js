const express = require('express');
const router = express.Router();
const dashBoardController = require('../controllers/dashBoardController');

router.get('/',       dashBoardController.getDashboard);
router.get('/ventes', dashBoardController.getDashboardVentes);
router.get('/stock',  dashBoardController.getDashboardStock);

module.exports = router;