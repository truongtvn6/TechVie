import { Product } from '../types';

function getStoredToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('techvie_token') || '' : '';
}

function normalizeToken(token?: string) {
  const raw = token || getStoredToken();
  return raw ? (raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`) : '';
}

function getAuthHeaders(token?: string) {
  const cleanToken = normalizeToken(token);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (cleanToken) headers.Authorization = cleanToken;
  return headers;
}

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Yeu cau API that bai.');
  }
  return data;
}

export async function getCurrentUser(token?: string): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi lay thong tin nguoi dung:', error);
    return { success: false, message: error.message };
  }
}

export async function updateUserProfile(profile: { name: string; phone: string; address: string }): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi cap nhat ho so:', error);
    return { success: false, message: error.message };
  }
}

export async function checkEmailExists(email: string): Promise<{ success: boolean; exists: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi kiem tra email:', error);
    return { success: false, exists: false, message: error.message };
  }
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await readJson(response);
    return { success: !!data.success, message: data.message || 'Thao tac hoan tat.' };
  } catch (error: any) {
    console.error('Loi doi mat khau:', error);
    return { success: false, message: error.message || 'Khong the ket noi may chu.' };
  }
}

export async function getUserOrders(email?: string): Promise<{ success: boolean; orders: any[]; message?: string }> {
  try {
    const url = email ? `/api/my-orders?email=${encodeURIComponent(email)}` : '/api/orders/user';
    const response = await fetch(url, email ? undefined : { headers: getAuthHeaders() });
    const data = await readJson(response);
    return { success: !!data.success, orders: data.orders || [], message: data.message };
  } catch (error: any) {
    console.error('Loi lay don hang nguoi dung:', error);
    return { success: false, orders: [], message: error.message };
  }
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Khach hang dang ky Newsletter',
        email,
        subject: 'Dang ky nhan ban tin khuyen mai',
        message: `Khach hang yeu cau dang ky nhan uu dai qua email: ${email}`,
      }),
    });
    const data = await readJson(response);
    return { success: !!data.success, message: data.message || 'Dang ky thanh cong.' };
  } catch (error: any) {
    console.error('Loi dang ky newsletter:', error);
    return { success: false, message: error.message || 'Khong the dang ky nhan tin.' };
  }
}

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
      body: JSON.stringify(payload),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi gui lien he:', error);
    return { success: false, message: error.message || 'Co loi xay ra, vui long thu lai sau.' };
  }
}

export async function getContactMessages(): Promise<{ success: boolean; contacts: any[] }> {
  try {
    const response = await fetch('/api/contacts', { headers: getAuthHeaders() });
    const data = await readJson(response);
    return { success: !!data.success, contacts: data.contacts || [] };
  } catch (error) {
    console.error('Loi lay hom thu gop y:', error);
    return { success: false, contacts: [] };
  }
}

export async function deleteContactMessage(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi xoa lien he:', error);
    return { success: false, message: error.message };
  }
}

export async function replyContactMessage(id: string, replySubject: string, replyContent: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/contacts/${id}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ replySubject, replyContent }),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi tra loi lien he:', error);
    return { success: false, message: error.message };
  }
}

export async function getAdminOrders(): Promise<{ success: boolean; orders: any[] }> {
  try {
    const response = await fetch('/api/orders', { headers: getAuthHeaders() });
    const data = await readJson(response);
    return { success: !!data.success, orders: data.orders || [] };
  } catch (error) {
    console.error('Loi lay so don hang:', error);
    return { success: false, orders: [] };
  }
}

export async function updateOrderStatus(orderId: number | string, status: string, statusType: string): Promise<{ success: boolean; order?: any; message?: string }> {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, statusType }),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi cap nhat trang thai don hang:', error);
    return { success: false, message: error.message };
  }
}

export async function updateOrderPaymentStatus(orderId: number | string, paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled'): Promise<{ success: boolean; order?: any; message?: string }> {
  try {
    const response = await fetch(`/api/orders/${orderId}/payment-status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentStatus }),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi cap nhat thanh toan:', error);
    return { success: false, message: error.message };
  }
}

export async function seedDummyOrder(payload: any): Promise<{ success: boolean; orderId?: number | string; message?: string }> {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi tao don thu nghiem:', error);
    return { success: false, message: error.message };
  }
}

export async function clearAllOrdersFromServer(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/orders', {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi don sach don hang:', error);
    return { success: false, message: error.message || 'Loi don dep don hang tren may chu.' };
  }
}

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
}): Promise<{ success: boolean; orderId?: number | string; message?: string; order?: any; payment?: any }> {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi checkout:', error);
    return { success: false, message: error.message || 'May chu ban hoac gap loi ket noi.' };
  }
}

export async function getCheckoutPaymentStatus(orderId: number | string): Promise<{ success: boolean; message?: string; order?: any; payment?: any }> {
  try {
    const response = await fetch(`/api/checkout/payment/status/${orderId}`);
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi kiem tra thanh toan:', error);
    return { success: false, message: error.message || 'Khong the kiem tra trang thai thanh toan.' };
  }
}

export async function getCategories(includeDeleted: boolean = false): Promise<{ success: boolean; categories: string[] }> {
  try {
    const response = await fetch(`/api/categories${includeDeleted ? '?includeDeleted=true' : ''}`);
    const data = await readJson(response);
    if (Array.isArray(data.categories)) {
      const names = data.categories.map((cat: any) => typeof cat === 'string' ? cat : cat.name).filter(Boolean);
      return { success: true, categories: names.includes('Tất cả') ? names : ['Tất cả', ...names] };
    }
    return { success: true, categories: ['Tất cả'] };
  } catch (error) {
    console.error('Loi lay danh muc:', error);
    return { success: true, categories: ['Tất cả', 'Điện thoại', 'Laptop', 'Đồng hồ', 'Âm thanh', 'Bàn phím'] };
  }
}

export async function getProducts(search?: string, includeDeleted: boolean = false): Promise<{ success: boolean; products: Product[] }> {
  try {
    const queryParams = [];
    if (search) queryParams.push(`search=${encodeURIComponent(search.trim())}`);
    if (includeDeleted) queryParams.push('includeDeleted=true');
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const response = await fetch(`/api/products${queryString}`);
    const data = await readJson(response);
    const products = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : Array.isArray(data.data) ? data.data : [];
    return { success: true, products };
  } catch (error) {
    console.error('Loi lay san pham:', error);
    return { success: false, products: [] };
  }
}

export async function createProduct(formData: FormData, token: string): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { Authorization: normalizeToken(token) },
      body: formData,
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi them san pham:', error);
    return { success: false, message: error.message || 'Loi ket noi khi them san pham.' };
  }
}

export async function updateProduct(id: string, formData: FormData, token: string): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: normalizeToken(token) },
      body: formData,
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi cap nhat san pham:', error);
    return { success: false, message: error.message || 'Loi ket noi khi cap nhat san pham.' };
  }
}

export async function deleteProduct(id: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi xoa san pham:', error);
    return { success: false, message: error.message || 'Loi ket noi khi xoa san pham.' };
  }
}

export async function restoreProduct(id: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/products/${id}/restore`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi khoi phuc san pham:', error);
    return { success: false, message: error.message || 'Loi ket noi.' };
  }
}

export async function getSystemUsers(token: string, includeDeleted: boolean = false): Promise<{ success: boolean; users: any[] }> {
  try {
    const response = await fetch(`/api/users${includeDeleted ? '?includeDeleted=true' : ''}`, {
      headers: getAuthHeaders(token),
    });
    const data = await readJson(response);
    return { success: !!data.success, users: data.users || [] };
  } catch (error) {
    console.error('Loi lay thanh vien:', error);
    return { success: false, users: [] };
  }
}

export async function adminCreateUser(userData: any, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi admin tao user:', error);
    return { success: false, message: error.message || 'Loi ket noi.' };
  }
}

export async function toggleUserRole(id: string, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  return updateUserAction(`/api/users/${id}/role`, token);
}

export async function toggleUserVip(id: string, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  return updateUserAction(`/api/users/${id}/vip`, token);
}

export async function toggleUserStatus(id: string, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  return updateUserAction(`/api/users/${id}/status`, token);
}

async function updateUserAction(url: string, token: string): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(token),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi cap nhat user:', error);
    return { success: false, message: error.message || 'Loi ket noi.' };
  }
}

export async function adminDeleteUser(id: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi xoa user:', error);
    return { success: false, message: error.message || 'Loi ket noi.' };
  }
}

export async function restoreUser(id: string, token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/users/${id}/restore`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
    });
    return await readJson(response);
  } catch (error: any) {
    console.error('Loi khoi phuc user:', error);
    return { success: false, message: error.message || 'Loi ket noi.' };
  }
}

export async function getPopularSearches(): Promise<{ success: boolean; popular: string[] }> {
  try {
    const response = await fetch('/api/search/popular');
    const data = await readJson(response);
    return { success: !!data.success, popular: data.popular || [] };
  } catch (error) {
    console.error('Loi lay popular search:', error);
    return { success: true, popular: ['Core v2', 'Lab Update'] };
  }
}

export async function getSearchHistory(): Promise<{ success: boolean; history: string[] }> {
  try {
    const response = await fetch('/api/search/history', {
      headers: getAuthHeaders(),
    });
    const data = await readJson(response);
    return { success: !!data.success, history: data.history || [] };
  } catch (error) {
    console.error('Loi lay search history:', error);
    return { success: true, history: ['Core v2', 'Lab Update'] };
  }
}
