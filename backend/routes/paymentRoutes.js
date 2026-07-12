const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// MoMo IPN Callback
router.post("/momo/callback", paymentController.momoCallback);

// VNPay Return URL (Frontend redirect)
router.get("/vnpay/return", paymentController.vnpayReturn);

// VNPay IPN Webhook
router.get("/vnpay/ipn", paymentController.vnpayIpn);

module.exports = router;
