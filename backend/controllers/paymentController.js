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
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const signData = Object.keys(vnp_Params)
      .map(key => `${key}=${vnp_Params[key]}`)
      .join('&');
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      // Xác thực chữ ký hợp lệ
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      if (rspCode === '00') {
        // Thanh toán thành công, sẽ được IPN cập nhật, nhưng ta cũng cập nhật ở đây nếu IPN chưa kịp chạy
        const order = await Order.findById(orderId);
        if (order && order.payment_status !== 'paid') {
          order.payment_status = 'paid';
          order.transaction_id = vnp_Params['vnp_TransactionNo'];
          order.paid_at = new Date();
          order.status = "Đã xác nhận thanh toán";
          order.status_type = "processing";
          await order.save();
        }
        res.redirect(`${frontendUrl}/checkout?status=success&orderId=${orderId}`);
      } else {
        // Thanh toán thất bại
        const order = await Order.findById(orderId);
        if (order) {
          order.payment_status = "failed";
          order.status = "Thanh toán thất bại";
          await order.save();
        }
        res.redirect(`${frontendUrl}/checkout?status=failed&orderId=${orderId}`);
      }
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (err) {
    console.error("Lỗi VNPAY Return:", err);
    res.status(500).send("Server Error");
  }
};

exports.vnpayIpn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const signData = Object.keys(vnp_Params)
      .map(key => `${key}=${vnp_Params[key]}`)
      .join('&');
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }

      // Check amount
      const amountStr = order.final_total.replace(/[^\d]/g, "");
      const amount = parseInt(amountStr) * 100;
      if (amount.toString() !== vnp_Params['vnp_Amount'].toString()) {
        return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
      }

      if (order.payment_status === 'paid') {
        return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
      }

      if (rspCode === '00') {
        order.payment_status = 'paid';
        order.transaction_id = vnp_Params['vnp_TransactionNo'];
        order.paid_at = new Date();
        order.status = "Đã xác nhận thanh toán";
        order.status_type = "processing";
      } else {
        order.payment_status = 'failed';
        order.status = "Thanh toán thất bại";
      }

      await order.save();
      return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
    } else {
      return res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
    }
  } catch (err) {
    console.error("Lỗi VNPAY IPN:", err);
    return res.status(200).json({ RspCode: '99', Message: 'Unknow error' });
  }
};
