var express = require('express');
var router = express.Router();

var contactController = require('../controllers/contactController');

router.post('/submit', contactController.submitContact);

module.exports = router;