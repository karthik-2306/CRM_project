const ContactModel = require('../models/contactModel');

const ContactController = {
  async getAllContacts(req, res) {
    try {
      const contacts = await ContactModel.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getContactById(req, res) {
    try {
      const contactId = req.params.id;
      const contact = await ContactModel.getContactById(contactId);
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).json({ error: 'Contact not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateContact(req, res) {
    try {
      const contactId = req.params.id;
      const formData = req.body;
      const success = await ContactModel.updateContact(contactId, formData);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteContact(req, res) {
    try {
      const contactId = req.params.id;
      const success = await ContactModel.deleteContact(contactId);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async createContact(req, res) {
    try {
      const formData = req.body;
      const contactId = await ContactModel.createContact(formData);
      res.json({ id: contactId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = ContactController;
