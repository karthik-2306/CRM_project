const express = require('express');
const router = express.Router();
const AccountController = require('../controller/accountController');

router.get('/', AccountController.getAllAccounts);
router.get('/:id', AccountController.getAccountById);
router.post('/', AccountController.createAccount);
router.put('/:id', AccountController.updateAccount);
router.delete('/:id', AccountController.deleteAccount);

module.exports = router;
