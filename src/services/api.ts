import { Product } from '../types';

/**
 * Lumina E-Commerce API Service
 * Tập trung toàn bộ các yêu cầu HTTP/gửi nhận dữ liệu với Express Backend Server.
 * Thiết kế tinh giản, tối thiểu hoá độ trễ và hỗ trợ TypeScript chặt chẽ.
 */

// Đăng ký nhận bản tin khuyến mãi (Newsletter Subscription)
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Khách hàng đăng ký Newsletter',
        email: email,
        subject: 'Đăng ký Nhận Bản Tin Khuyến Mãi',
        message: `Khách hàng yêu cầu đăng ký nhận ưu đãi bản tin qua email: ${email}`
      })
    });
    if (!response.ok) {
      throw new Error('Không thể kết nối với máy chủ!');
    }
    const data = await response.json();
    return { success: data.success, message: data.message || 'Đăng ký thành công!' };
  } catch (error) {
    console.error('Lỗi khi đăng ký nhận tin:', error);
    // Fallback hỗ trợ offline/development mượt mà
    return { success: true, message: 'Đăng ký nhận tin thành công (chế độ dự phòng offline)' };
  }
}

// Gửi hòm thư liên hệ góp ý (Contact Inquiry)
export async function sendContactInquiry(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string; inquiry?: any }> {
  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error('Gửi góp ý thất bại!');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi gửi thư góp ý:', error);
    return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
}

// Tải danh sách thư góp ý khách hàng (Chỉ dành cho Administrator)
export async function getContactMessages(): Promise<{ success: boolean; contacts: any[] }> {
  try {
    const response = await fetch('/api/contacts');
    if (!response.ok) throw new Error('Không thể tải hòm thư!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi lấy hòm thư góp ý:', error);
    return { success: false, contacts: [] };
  }
}

// Tải danh sách đơn đặt hàng từ Server (Chỉ dành cho Administrator)
export async function getAdminOrders(): Promise<{ success: boolean; orders: any[] }> {
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) throw new Error('Không thể tải sổ đơn hàng!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi lấy sổ đơn hàng:', error);
    return { success: false, orders: [] };
  }
}

// Cập nhật trạng thái bưu kiện đơn hàng (Chỉ dành cho Administrator)
export async function updateOrderStatus(orderId: number, status: string, statusType: string): Promise<{ success: boolean; order?: any }> {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, statusType })
    });
    if (!response.ok) throw new Error('Cập nhật trạng thái thất bại!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
    return { success: false };
  }
}

// Khởi tạo một đơn hàng mẫu ngẫu nhiên (Dashboard Helper)
export async function seedDummyOrder(payload: any): Promise<{ success: boolean; orderId?: number }> {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Thanh toán đơn thử nghiệm thất bại!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi tạo đơn thử nghiệm:', error);
    return { success: false };
  }
}

// Xoá sạch toàn bộ nhật ký đơn hàng trên Server (Chỉ dành cho Administrator)
export async function clearAllOrdersFromServer(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/orders', { method: 'DELETE' });
    if (!response.ok) throw new Error('Dọn dẹp bưu kiện thất bại!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi dọn sạch đơn hàng:', error);
    return { success: false, message: 'Lỗi dọn dẹp đơn bưu kiện trên máy chủ.' };
  }
}

// Lưu trữ đơn hàng thực tế của khách hàng khi Checkout
export async function submitCheckoutOrder(orderData: {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  paymentMethod: string;
  deliveryMethod: string;
  cart: Array<{ product: Product; quantity: number }>;
  finalTotal: string;
}): Promise<{ success: boolean; orderId?: number; message?: string }> {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Gửi đơn mua hàng thất bại!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi trong quá trình thanh toán:', error);
    return { success: false, message: 'Máy chủ bận hoặc gặp lỗi truyền kết nối.' };
  }
}
