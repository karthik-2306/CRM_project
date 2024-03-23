const express = require('express');
const ContactController = require('../controller/contactController');

const router = express.Router();

router.get('/contacts', ContactController.getAllContacts);
router.get('/contacts/:id', ContactController.getContactById);
router.put('/contacts/:id', ContactController.updateContact);
router.delete('/contacts/:id', ContactController.deleteContact);
router.post('/contacts', ContactController.createContact);

module.exports = router;
