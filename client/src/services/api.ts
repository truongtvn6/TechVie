import { Product } from '../types';

/**
 * TechVie E-Commerce API Service
 * Tập trung toàn bộ các yêu cầu HTTP/gửi nhận dữ liệu với Express Backend Server.
 * Thiết kế tinh giản, tối thiểu hoá độ trễ và hỗ trợ TypeScript chặt chẽ.
 */

// Helper to load token and headers for Admin APIs
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('techvie_token') : '';
  const cleanToken = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (cleanToken) {
    headers['Authorization'] = cleanToken;
  }
  return headers;
}

// Lấy thông tin người dùng hiện tại (dùng cho Google Login và Phiên đăng nhập Cookie/JWT)
export async function getCurrentUser(): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    return { success: false, message: error.message };
  }
}

// Cập nhật hồ sơ thông tin người dùng hiện tại (Họ tên, SĐT, Địa chỉ)
export async function updateUserProfile(profile: { name: string; phone: string; address: string }): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Không thể cập nhật hồ sơ.');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi khi cập nhật hồ sơ:', error);
    return { success: false, message: error.message };
  }
}

// Lấy danh sách đơn hàng của người dùng hiện tại theo Email
export async function getUserOrders(email: string): Promise<{ success: boolean; orders: any[] }> {
  try {
    const response = await fetch(`/api/my-orders?email=${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error('Không thể tải danh sách đơn hàng!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi lấy danh sách đơn hàng:', error);
    return { success: false, orders: [] };
  }
}

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

export async function getCurrentUser(token: string): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    return { success: false, message: error.message };
  }
}

export async function updateUserProfile(profile: { name: string; phone: string; address: string }): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Không thể cập nhật hồ sơ.');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi khi cập nhật hồ sơ:', error);
    return { success: false, message: error.message };
  }
}

// Tải danh sách thư góp ý khách hàng (Chỉ dành cho Administrator)
export async function getContactMessages(): Promise<{ success: boolean; contacts: any[] }> {
  try {
    const response = await fetch('/api/contacts', {
      headers: getAuthHeaders()
    });
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
    const response = await fetch('/api/orders', {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Không thể tải sổ đơn hàng!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi lấy sổ đơn hàng:', error);
    return { success: false, orders: [] };
  }
}

// Cập nhật trạng thái bưu kiện đơn hàng (Chỉ dành cho Administrator)
export async function updateOrderStatus(orderId: number | string, status: string, statusType: string): Promise<{ success: boolean; order?: any }> {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
export async function seedDummyOrder(payload: any): Promise<{ success: boolean; orderId?: number | string }> {
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
    const response = await fetch('/api/orders', {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
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
}): Promise<{ success: boolean; orderId?: number | string; message?: string }> {
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

// Tải danh sách phân loại sản phẩm (Categories) từ backend
export async function getCategories(includeDeleted: boolean = false): Promise<{ success: boolean; categories: string[] }> {
  try {
    const response = await fetch(`/api/categories${includeDeleted ? '?includeDeleted=true' : ''}`);
    if (!response.ok) throw new Error('Không thể tải danh mục sản phẩm!');
    const data = await response.json();
    if (data && data.success && Array.isArray(data.categories)) {
      const dbCategories = data.categories.map((cat: any) => cat.name);
      const categories = dbCategories.includes('Tất cả')
        ? dbCategories
        : ['Tất cả', ...dbCategories];
      return { success: true, categories };
    }
    throw new Error('Dữ liệu danh mục không đúng định dạng!');
  } catch (error) {
    console.error('Lỗi khi lấy danh mục sản phẩm:', error);
    // Trả về fallback tĩnh nếu Backend gặp sự cố hoặc ngoại tuyến
    return {
      success: true,
      categories: ['Tất cả', 'Điện thoại', 'Laptop', 'Đồng hồ', 'Âm thanh', 'Bàn phím']
    };
  }
}

// Tải danh sách sản phẩm (Products) từ backend (Hỗ trợ lọc theo từ khóa tìm kiếm)
export async function getProducts(search?: string, includeDeleted: boolean = false): Promise<{ success: boolean; products: Product[] }> {
  try {
    const queryParams = [];
    if (search) queryParams.push(`search=${encodeURIComponent(search.trim())}`);
    if (includeDeleted) queryParams.push(`includeDeleted=true`);
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const url = `/api/products${queryString}`;
    console.log(`[API getProducts] ➔ Bắt đầu gửi yêu cầu tải danh sách sản phẩm${search ? ` với từ khóa "${search}"` : ''} từ backend...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm!');
    const data = await response.json();
    
    let productList: any[] = [];
    if (Array.isArray(data)) {
      productList = data;
    } else if (data && Array.isArray(data.products)) {
      productList = data.products;
    } else if (data && Array.isArray(data.data)) {
      productList = data.data;
    }
    
    console.log(`[API getProducts] ✔ Tải thành công ${productList.length} sản phẩm từ backend.`);
    return { success: true, products: productList };
  } catch (error) {
    console.error('[API getProducts] ❌ Lỗi khi tải danh sách sản phẩm:', error);
    return { success: false, products: [] };
  }
}

// Thêm sản phẩm mới (chỉ dành cho Admin)
export async function createProduct(formData: FormData, token: string): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    console.log('[API createProduct] ➔ Bắt đầu gửi yêu cầu tạo sản phẩm mới:', formData.get('name'));
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Authorization': cleanToken,
      },
      body: formData,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Không thể tạo sản phẩm mới!');
    }
    const data = await response.json();
    console.log('[API createProduct] ✔ Phản hồi từ backend:', data);
    return { success: true, message: data.message || 'Thêm sản phẩm thành công!', product: data.product };
  } catch (error: any) {
    console.error('[API createProduct] ❌ Lỗi thêm sản phẩm:', error);
    return { success: false, message: error.message || 'Lỗi kết nối khi thêm sản phẩm.' };
  }
}

// Cập nhật sản phẩm (chỉ dành cho Admin)
export async function updateProduct(id: string, formData: FormData, token: string): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    console.log(`[API updateProduct] ➔ Bắt đầu gửi yêu cầu cập nhật sản phẩm #${id}:`, formData.get('name'));
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': cleanToken,
      },
      body: formData,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Không thể cập nhật sản phẩm!');
    }
    const data = await response.json();
    console.log(`[API updateProduct] ✔ Phản hồi cập nhật sản phẩm #${id}:`, data);
    return { success: true, message: data.message || 'Cập nhật sản phẩm thành công!', product: data.product };
  } catch (error: any) {
    console.error(`[API updateProduct] ❌ Lỗi cập nhật sản phẩm #${id}:`, error);
    return { success: false, message: error.message || 'Lỗi kết nối khi cập nhật sản phẩm.' };
  }
}

// Xóa sản phẩm (chỉ dành cho Admin)
export async function deleteProduct(id: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`[API deleteProduct] ➔ Bắt đầu gửi yêu cầu xóa sản phẩm #${id}...`);
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Không thể xóa sản phẩm!');
    }
    const data = await response.json();
    console.log(`[API deleteProduct] ✔ Phản hồi xóa sản phẩm #${id}:`, data);
    return { success: true, message: data.message || 'Xóa sản phẩm thành công!' };
  } catch (error: any) {
    console.error(`[API deleteProduct] ❌ Lỗi xóa sản phẩm #${id}:`, error);
    return { success: false, message: error.message || 'Lỗi kết nối khi xóa sản phẩm.' };
  }
}

// Tải danh sách thành viên hệ thống (Chỉ dành cho Admin)
export async function getSystemUsers(token: string, includeDeleted: boolean = false): Promise<{ success: boolean; users: any[] }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const url = `/api/users${includeDeleted ? '?includeDeleted=true' : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Không thể tải danh sách thành viên!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi lấy danh sách thành viên:', error);
    return { success: false, users: [] };
  }
}

// Cấp tài khoản thành viên mới (Chỉ dành cho Admin)
export async function adminCreateUser(userData: any, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Cấp tài khoản thất bại!');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi admin cấp tài khoản:', error);
    return { success: false, message: error.message || 'Lỗi kết nối khi cấp tài khoản.' };
  }
}

// Thay đổi phân quyền thành viên (Chỉ dành cho Admin)
export async function toggleUserRole(id: string, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch(`/api/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Không thể đổi phân quyền!');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi đổi phân quyền thành viên:', error);
    return { success: false, message: error.message || 'Lỗi kết nối.' };
  }
}

// Thay đổi trạng thái VIP thành viên (Chỉ dành cho Admin)
export async function toggleUserVip(id: string, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch(`/api/users/${id}/vip`, {
      method: 'PUT',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Không thể đổi trạng thái VIP!');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi thay đổi trạng thái VIP thành viên:', error);
    return { success: false, message: error.message || 'Lỗi kết nối.' };
  }
}

// Khóa / Mở khóa tài khoản thành viên (Chỉ dành cho Admin)
export async function toggleUserStatus(id: string, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch(`/api/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Không thể thay đổi trạng thái tài khoản!');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi đổi trạng thái tài khoản thành viên:', error);
    return { success: false, message: error.message || 'Lỗi kết nối.' };
  }
}

// Gỡ bỏ tài khoản thành viên khỏi database (Chỉ dành cho Admin)
export async function adminDeleteUser(id: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Không thể gỡ bỏ tài khoản thành viên!');
    }
    return await response.json();
  } catch (error: any) {
    console.error('Lỗi gỡ bỏ tài khoản thành viên:', error);
    return { success: false, message: error.message || 'Lỗi kết nối.' };
  }
}

// Khôi phục tài khoản thành viên đã xóa (Chỉ dành cho Admin)
export async function restoreUser(id: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch(`/api/users/${id}/restore`, {
      method: 'PUT',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Không thể khôi phục tài khoản thành viên!');
    return { success: true, message: data.message || 'Khôi phục tài khoản thành công!' };
  } catch (error: any) {
    console.error('Lỗi khôi phục tài khoản thành viên:', error);
    return { success: false, message: error.message || 'Lỗi kết nối.' };
  }
}

// Khôi phục sản phẩm đã xóa (Chỉ dành cho Admin)
export async function restoreProduct(id: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const response = await fetch(`/api/products/${id}/restore`, {
      method: 'PUT',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Không thể khôi phục sản phẩm!');
    return { success: true, message: data.message || 'Khôi phục sản phẩm thành công!' };
  } catch (error: any) {
    console.error('Lỗi khôi phục sản phẩm:', error);
    return { success: false, message: error.message || 'Lỗi kết nối.' };
  }
}

// Tải danh mục tìm kiếm phổ biến (Popular Searches) từ backend
export async function getPopularSearches(): Promise<{ success: boolean; popular: string[] }> {
  try {
    const response = await fetch('/api/search/popular');
    if (!response.ok) throw new Error('Không thể tải tìm kiếm phổ biến!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải danh sách tìm kiếm phổ biến:', error);
    return {
      success: true,
      popular: ['Giao diện Prism-1', 'Cảm biến Flux', 'Thủy tinh lỏng', 'Hệ thống v2.0']
    };
  }
}

// Tải lịch sử tìm kiếm gần đây (Search History) từ backend
export async function getSearchHistory(): Promise<{ success: boolean; history: string[] }> {
  try {
    const response = await fetch('/api/search/history', {
      headers: getAuthHeaders() // Tự động đính kèm token nếu đăng nhập để tải lịch sử cá nhân
    });
    if (!response.ok) throw new Error('Không thể tải lịch sử tìm kiếm!');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải lịch sử tìm kiếm:', error);
    return {
      success: true,
      history: ['Core v2', 'Lab Update']
    };
  }
}

// Đổi mật khẩu thành viên (Change Password)
export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return { success: data.success, message: data.message || 'Thao tác hoàn tất!' };
  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    return { success: false, message: 'Không thể kết nối đến máy chủ trực tuyến.' };
  }
}



