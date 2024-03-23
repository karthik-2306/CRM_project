// leadController.js
const pool = require('../config/database');


const LeadModel = require('../models/leadModel');

const LeadController = {
  async getAllLeads(req, res) {
    try {
      const leads = await LeadModel.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getLeadById(req, res) {
    try {
      const leadId = req.params.id;
      const lead = await LeadModel.getLeadById(leadId);
      if (lead) {
        res.json(lead);
      } else {
        res.status(404).json({ error: 'Lead not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateLead(req, res) {
    try {
      const leadId = req.params.id;
      const formData = req.body;
      const success = await LeadModel.updateLead(leadId, formData);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteLead(req, res) {
    try {
      const leadId = req.params.id;
      const success = await LeadModel.deleteLead(leadId);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async createLead(req, res) {
    try {
      const formData = req.body;
      console.log('Received form data:', formData);
      const leadId = await LeadModel.createLead(formData);
      res.json({ id: leadId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async convertLeadToContact(req, res) {
    try {
      const leadId = req.params.id;
      const contactId = req.params.contactId;
      const success = await LeadModel.convertLeadToContact(leadId, contactId);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async convertLeadToAccount(req, res) {
    try {
      const leadId = req.params.id;
      const accountId = req.params.accountId;
      const success = await LeadModel.convertLeadToAccount(leadId, accountId);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
   async convertLeadToContact(leadId, contactId) {
    // Implement conversion logic here
    // For example, update the lead's convertedToContactId field
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE leads SET convertedToContactId = ? WHERE id = ?',
      [contactId, leadId]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  async convertLeadToAccount(leadId, accountId) {
    // Implement conversion logic here
    // For example, update the lead's convertedToAccountId field
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE leads SET convertedToAccountId = ? WHERE id = ?',
      [accountId, leadId]
    );
    connection.release();
    return result.affectedRows > 0;
  },
};



module.exports = LeadController;
