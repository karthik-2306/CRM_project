const AccountModel = require('../models/accountModel');

const AccountController = {
  async getAllAccounts(req, res) {
    try {
      const accounts = await AccountModel.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getAccountById(req, res) {
    try {
      const accountId = req.params.id;
      const account = await AccountModel.getAccountById(accountId);
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateAccount(req, res) {
    try {
      const accountId = req.params.id;
      const formData = req.body;
      const success = await AccountModel.updateAccount(accountId, formData);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteAccount(req, res) {
    try {
      const accountId = req.params.id;
      const success = await AccountModel.deleteAccount(accountId);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async createAccount(req, res) {
    try {
      const formData = req.body;
      const accountId = await AccountModel.createAccount(formData);
      res.json({ id: accountId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = AccountController;
