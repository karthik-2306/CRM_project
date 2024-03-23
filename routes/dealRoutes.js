const express = require('express');
const DealController = require('../controller/dealController');

const router = express.Router();

router.get('/deals', DealController.getAllDeals);
router.get('/deals/:id', DealController.getDealById);
router.post('/deals', DealController.createDeal);
router.put('/deals/:id', DealController.updateDeal);
router.delete('/deals/:id', DealController.deleteDeal);


module.exports = router;
