const cron = require('node-cron');
const Order = require('../models/Order');

// Run every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('[CRON] Running expire orders job...');
    const now = new Date();
    
    // Find all pending orders that have expired
    const expiredOrders = await Order.find({
      payment_status: 'pending',
      expires_at: { $lte: now }
    });

    if (expiredOrders.length > 0) {
      console.log(`[CRON] Found ${expiredOrders.length} expired orders. Cancelling them...`);
      
      const bulkOps = expiredOrders.map(order => ({
        updateOne: {
          filter: { _id: order._id },
          update: {
            $set: {
              payment_status: 'cancelled',
              status: 'Hủy bỏ',
              status_type: 'cancelled'
            }
          }
        }
      }));

      await Order.bulkWrite(bulkOps);
      console.log('[CRON] Successfully cancelled expired orders.');
    } else {
      console.log('[CRON] No expired orders found.');
    }
  } catch (error) {
    console.error('[CRON] Error running expire orders job:', error);
  }
});

console.log('[CRON] Expire orders job scheduled.');
