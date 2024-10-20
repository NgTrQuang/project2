const express = require('express');
const { capturePayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/paypal/capture/:token', capturePayment);


module.exports = router;
