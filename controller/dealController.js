const DealModel = require('../models/dealModel');

const DealController = {
  async getAllDeals(req, res) {
    try {
      const deals = await DealModel.getAllDeals();
      res.json(deals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getDealById(req, res) {
    try {
      const dealId = req.params.id;
      const deal = await DealModel.getDealById(dealId);
      if (deal) {
        res.json(deal);
      } else {
        res.status(404).json({ error: 'Deal not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async createDeal(req, res) {
    try {
      const formData = req.body;
      const dealId = await DealModel.createDeal(formData);
      res.json({ id: dealId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateDeal(req, res) {
    try {
      const dealId = req.params.id;
      const formData = req.body;
      const success = await DealModel.updateDeal(dealId, formData);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async deleteDeal(req, res) {
  try {
    const dealId = req.params.id;
    const success = await DealModel.deleteDeal(dealId);
    res.json({ success });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

};

module.exports = DealController;
