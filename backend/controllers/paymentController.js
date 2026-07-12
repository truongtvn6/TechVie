const crypto = require("crypto");
const Order = require("../models/Order");

// Sort object utility for VNPay
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

exports.momoCallback = async (req, res) => {
  try {
    const {
      partnerCode, orderId, requestId, amount, orderInfo,
      orderType, transId, resultCode, message, payType, responseTime,
      extraData, signature
    } = req.body;

    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;

    // Verify signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (resultCode === 0) {
      // Payment success
      order.payment_status = "paid";
      order.transaction_id = transId.toString();
      order.paid_at = new Date();
      order.status = "Đã xác nhận thanh toán";
      order.status_type = "processing";
    } else {
      // Payment failed
      order.payment_status = "failed";
      order.transaction_id = transId.toString();
      order.status = "Thanh toán thất bại";
      order.status_type = "processing";
    }

    await order.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Lỗi callback MoMo:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.vnpayReturn = async (req, res) => {
  try {
    // Copy to avoid mutating read-only req.query
    const rawParams = { ...req.query };
    const secureHash = rawParams['vnp_SecureHash'];
    const orderId = rawParams['vnp_TxnRef'];
    const rspCode = rawParams['vnp_ResponseCode'];

    delete rawParams['vnp_SecureHash'];
    delete rawParams['vnp_SecureHashType'];

    // VNPay verifies hash based on URL-encoded values.
    // Express decodes req.query automatically, so we must re-encode it using sortObject.
    const sortedParams = sortObject(rawParams);
    const signData = Object.keys(sortedParams).map(key => `${key}=${sortedParams[key]}`).join('&');

    const secretKey = process.env.VNPAY_HASH_SECRET;
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (secureHash === signed) {
      if (rspCode === '00') {
        // Payment success
        const order = await Order.findById(orderId);
        if (order && order.payment_status !== 'paid') {
          order.payment_status = 'paid';
          order.transaction_id = rawParams['vnp_TransactionNo'];
          order.paid_at = new Date();
          order.status = "Đã xác nhận thanh toán";
          order.status_type = "processing";
          await order.save();
        }
        return res.redirect(`${frontendUrl}/checkout?status=success&orderId=${orderId}`);
      } else {
        // Payment failed/cancelled
        const order = await Order.findById(orderId);
        if (order && order.payment_status !== 'paid') {
          order.payment_status = "failed";
          order.status = "Thanh toán thất bại";
          await order.save();
        }
        return res.redirect(`${frontendUrl}/checkout?status=failed&orderId=${orderId}&code=${rspCode}`);
      }
    } else {
      console.error("VNPay Return – chữ ký không khớp", { received: secureHash, computed: signed });
      return res.redirect(`${frontendUrl}/checkout?status=failed&orderId=${orderId}&reason=invalid_signature`);
    }
  } catch (err) {
    console.error("Lỗi VNPAY Return:", err);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/checkout?status=failed&reason=server_error`);
  }
};

exports.vnpayIpn = async (req, res) => {
  try {
    const rawParams = { ...req.query };
    const secureHash = rawParams['vnp_SecureHash'];
    const orderId = rawParams['vnp_TxnRef'];
    const rspCode = rawParams['vnp_ResponseCode'];

    delete rawParams['vnp_SecureHash'];
    delete rawParams['vnp_SecureHashType'];

    const sortedParams = sortObject(rawParams);
    const signData = Object.keys(sortedParams).map(key => `${key}=${sortedParams[key]}`).join('&');

    const secretKey = process.env.VNPAY_HASH_SECRET;
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }

    // Check amount
    const amountStr = order.final_total.replace(/[^\d]/g, "");
    const amount = parseInt(amountStr) * 100;
    if (amount.toString() !== rawParams['vnp_Amount'].toString()) {
      return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
    }

    if (order.payment_status === 'paid') {
      return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
    }

    if (rspCode === '00') {
      order.payment_status = 'paid';
      order.transaction_id = rawParams['vnp_TransactionNo'];
      order.paid_at = new Date();
      order.status = "Đã xác nhận thanh toán";
      order.status_type = "processing";
    } else {
      order.payment_status = 'failed';
      order.status = "Thanh toán thất bại";
    }

    await order.save();
    return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
  } catch (err) {
    console.error("Lỗi VNPAY IPN:", err);
    return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};
