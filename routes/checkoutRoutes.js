const express = require('express');
const checkoutRouter = express.Router();
const auth = require('../middleware/Authorization');
const { createCheckoutSession } = require('../controllers/checkoutController');



checkoutRouter.get('/', createCheckoutSession); //http://localhost:8000/api/checkout

module.exports = checkoutRouter;