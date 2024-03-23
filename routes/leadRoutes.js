const express = require('express');
const LeadController = require('../controller/leadController');


const router = express.Router();

router.get('/leads', LeadController.getAllLeads);
router.get('/leads/:id', LeadController.getLeadById);
router.put('/leads/:id', LeadController.updateLead);
router.delete('/leads/:id', LeadController.deleteLead);
router.post('/leads', LeadController.createLead);
router.post('/leads/:id/convert/contact/:contactId', LeadController.convertLeadToContact);
router.post('/leads/:id/convert/account/:accountId', LeadController.convertLeadToAccount);


module.exports = router;
