const CampaignModel = require('../models/campaignModel');

const CampaignController = {
  async getAllCampaigns(req, res) {
    try {
      const campaigns = await CampaignModel.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getCampaignById(req, res) {
    try {
      const campaignId = req.params.id;
      const campaign = await CampaignModel.getCampaignById(campaignId);
      if (campaign) {
        res.json(campaign);
      } else {
        res.status(404).json({ error: 'Campaign not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async createCampaign(req, res) {
    try {
      const formData = req.body;
      const campaignId = await CampaignModel.createCampaign(formData);
      res.json({ id: campaignId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateCampaign(req, res) {
    try {
      const campaignId = req.params.id;
      const formData = req.body;
      const success = await CampaignModel.updateCampaign(campaignId, formData);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteCampaign(req, res) {
    try {
      const campaignId = req.params.id;
      const success = await CampaignModel.deleteCampaign(campaignId);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = CampaignController;
