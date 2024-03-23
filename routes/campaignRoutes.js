const express = require('express');
const CampaignController = require('../controller/campaignController');

const router = express.Router();

router.get('/campaigns', CampaignController.getAllCampaigns);
router.get('/campaigns/:id', CampaignController.getCampaignById);
router.post('/campaigns', CampaignController.createCampaign);
router.put('/campaigns/:id', CampaignController.updateCampaign);
router.delete('/campaigns/:id', CampaignController.deleteCampaign);

module.exports = router;
