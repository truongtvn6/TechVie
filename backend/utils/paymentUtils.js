const crypto = require("crypto");

// VNPay Utils
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

exports.generateVNPayPaymentUrl = (req, order) => {
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "127.0.0.1";

  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  let vnpUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = process.env.VNPAY_RETURN_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/vnpay/return`;

  const date = new Date();
  
  // Format for VNPay: YYYYMMDDHHmmss
  const pad = (n) => (n < 10 ? '0' + n : n);
  const createDate = 
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds());
  
  // Create expire date (24h later)
  const expireDateObj = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const expireDate = 
    expireDateObj.getFullYear().toString() +
    pad(expireDateObj.getMonth() + 1) +
    pad(expireDateObj.getDate()) +
    pad(expireDateObj.getHours()) +
    pad(expireDateObj.getMinutes()) +
    pad(expireDateObj.getSeconds());

  const orderId = order._id.toString();
  
  // final_total format is "28.500.000₫", we need to convert to number
  const amountStr = order.final_total.replace(/[^\d]/g, "");
  const amount = parseInt(amountStr) * 100;

  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan don hang TECHVIE-" + orderId.slice(-6).toUpperCase();
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  vnp_Params["vnp_ExpireDate"] = expireDate;

  vnp_Params = sortObject(vnp_Params);

  const signData = Object.keys(vnp_Params)
    .map(key => `${key}=${vnp_Params[key]}`)
    .join('&');
    
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const paymentUrlQuery = Object.keys(vnp_Params)
    .map(key => `${key}=${vnp_Params[key]}`)
    .join('&');
    
  vnpUrl += "?" + paymentUrlQuery;
  
  return vnpUrl;
};

// MoMo Utils
exports.generateMomoPaymentUrl = async (order) => {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const endpoint = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
  
  const orderId = order._id.toString();
  const requestId = partnerCode + new Date().getTime();
  
  const amountStr = order.final_total.replace(/[^\d]/g, "");
  const amount = parseInt(amountStr);

  const orderInfo = "Thanh toan don hang TECHVIE-" + orderId.slice(-6).toUpperCase();
  const redirectUrl = process.env.MOMO_REDIRECT_URL || `${process.env.FRONTEND_URL}/checkout`;
  const ipnUrl = process.env.MOMO_IPN_URL || `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payment/momo/callback`;
  const requestType = "captureWallet";
  const extraData = "";
  
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
  
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: 'vi'
  });

  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      body: requestBody
    });
    
    const body = await res.json();
    if (body.resultCode === 0) {
      return body.payUrl;
    } else {
      console.error("MoMo payment generation error:", body);
      return "";
    }
  } catch (err) {
    console.error("Lỗi khi gọi API MoMo:", err);
    return "";
  }
};
