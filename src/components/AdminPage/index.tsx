import { useState, useEffect } from 'react';
import { Product } from '../../types';
import { 
  getContactMessages,
  getAdminOrders,
  updateOrderStatus,
  seedDummyOrder,
  clearAllOrdersFromServer
} from '../../services/api';
import { 
  BarChart3, 
  Sparkles,
  Plus,
  Package,
  Trash2,
  ShoppingBag,
  MessageSquare,
  ArrowLeft,
  Ticket,
  Users
} from 'lucide-react';

// Sub-components imports
import DashboardStats from './DashboardStats';
import SystemConsole from './SystemConsole';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import ContactManager from './ContactManager';
import ProductFormModal from './ProductFormModal';
import PromoManager from './PromoManager';
import UserManager from './UserManager';

interface AdminPageProps {
  products: Product[];
  onAddProduct: (product: any, imageFile: File | null) => void;
  onEditProduct: (product: any, imageFile: File | null) => void;
  onDeleteProduct: (id: string) => void;
  onNavigate: (tab: any) => void;
}

export default function AdminPage({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  onNavigate 
}: AdminPageProps) {
  // Admin active sub tab
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'orders' | 'messages' | 'promos' | 'users'>('overview');

  // Dynamic Promo Campaigns local state with localStorage persistence
  const [promos, setPromos] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_promos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { code: 'LUMINA2026', discount: 0.1, description: 'Giảm giá ra mắt sản phẩm 10%', usedCount: 34, isActive: true },
      { code: 'FUTURE', discount: 0.1, description: 'Đặc quyền tương lai 10%', usedCount: 12, isActive: true },
      { code: 'VIPLAB', discount: 0.25, description: 'Siêu đặc quyền từ Lumina Lab 25%', usedCount: 7, isActive: true, minOrderVal: 30000000 }
    ];
  });

  // Dynamic system Users local state with localStorage persistence
  const [systemUsers, setSystemUsers] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_system_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'usr-1', name: 'Nguyễn Minh Tiến', email: 'mintzinfinity898@gmail.com', role: 'admin', phone: '0912 345 678', vipStatus: 'Premium', status: 'active', joinedDate: '17-06-2026' },
      { id: 'usr-2', name: 'Trần Thế Hoàng', email: 'hoang.tran99@gmail.com', role: 'user', phone: '0981 222 333', vipStatus: 'Premium', status: 'active', joinedDate: '18-06-2026' },
      { id: 'usr-3', name: 'Admin Lab Lumina', email: 'admin@lumina.com', role: 'admin', phone: '0901 000 999', vipStatus: 'Premium', status: 'active', joinedDate: '15-06-2026' },
      { id: 'usr-4', name: 'Lê Thuỳ Trang', email: 'trangle98@gmail.com', role: 'user', phone: '0934 555 666', vipStatus: 'Normal', status: 'active', joinedDate: '20-06-2026' },
      { id: 'usr-5', name: 'Phạm Minh Đức', email: 'ducminh@sales.lumina.vn', role: 'user', phone: '0914 888 777', vipStatus: 'Normal', status: 'blocked', joinedDate: '21-06-2026' }
    ];
  });

  // Sync promos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumina_promos', JSON.stringify(promos));
    } catch (e) {
      console.error(e);
    }
  }, [promos]);

  // Sync systemUsers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumina_system_users', JSON.stringify(systemUsers));
    } catch (e) {
      console.error(e);
    }
  }, [systemUsers]);

  // Real-time fetched datasets from backend
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Product Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // System logs feedback messages
  const [logs, setLogs] = useState<string[]>(['Chào mừng Người quản lý. Hệ quản trị LUMINA ID đã sẵn sàng.']);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 7)]);
  };

  // Promo Handlers
  const handleAddPromo = (newPromo: any) => {
    if (promos.some(p => p.code.toUpperCase() === newPromo.code.toUpperCase())) {
      addLog(`Lỗi: Mã bưu khuyến mãi ${newPromo.code} đã tồn tại!`);
      console.warn(`Mã coupon ${newPromo.code} đã tồn tại!`);
      return;
    }
    setPromos(prev => [newPromo, ...prev]);
    addLog(`Đã ban hành mã khuyến mãi mới thành công: ${newPromo.code}`);
  };

  const handleTogglePromoStatus = (code: string) => {
    setPromos(prev => prev.map(p => p.code === code ? { ...p, isActive: !p.isActive } : p));
    const findP = promos.find(p => p.code === code);
    if (findP) {
      addLog(`Trạng thái mã ${code}: ${!findP.isActive ? 'Đang kích hoạt' : 'Đã tạm dừng'}`);
    }
  };

  const handleDeletePromo = (code: string) => {
    setPromos(prev => prev.filter(p => p.code !== code));
    addLog(`Đã gỡ bỏ mã khuyến mãi khỏi hệ thống: ${code}`);
  };

  // User Handlers
  const handleAddUser = (newUser: any) => {
    if (systemUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      addLog(`Lỗi: Email ${newUser.email} đã được đăng ký tài khoản!`);
      console.warn(`Email ${newUser.email} đã được đăng ký tài khoản!`);
      return;
    }
    setSystemUsers(prev => [newUser, ...prev]);
    addLog(`Khai sinh tài khoản thành viên mới: ${newUser.email}`);
  };

  const handleToggleUserRole = (id: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextRole = u.role === 'admin' ? 'user' : 'admin';
        addLog(`Đã chuyển đổi quyền hạn tài khoản ${u.email} thành: ${nextRole.toUpperCase()}`);
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const handleToggleUserVip = (id: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextVip = u.vipStatus === 'Premium' ? 'Normal' : 'Premium';
        addLog(`Đồng bộ hạn VIP cho ${u.email}: thành viên ${nextVip}`);
        return { ...u, vipStatus: nextVip };
      }
      return u;
    }));
  };

  const handleToggleUserStatus = (id: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'blocked' ? 'active' : 'blocked';
        addLog(`Cập nhật trạng thái ${u.email}: ${nextStatus === 'blocked' ? 'KHOÁ BANNED' : 'HOẠT ĐỘNG'}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id: string) => {
    const usr = systemUsers.find(u => u.id === id);
    if (usr) {
      if (usr.email === 'admin@lumina.com') {
        addLog('Lỗi nghiêm trọng: Không thể xoá tài khoản sáng lập Gốc của hệ thống.');
        return;
      }
      setSystemUsers(prev => prev.filter(u => u.id !== id));
      addLog(`Đã gỡ bỏ tài khoản ${usr.email} vĩnh viễn khỏi sổ đăng ký`);
    }
  };

  // Fetch orders from Express Server
  const fetchOrders = () => {
    setIsLoadingOrders(true);
    getAdminOrders()
      .then(data => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
        setIsLoadingOrders(false);
      })
      .catch(err => {
        console.error('Error fetching admin orders:', err);
        setIsLoadingOrders(false);
      });
  };

  // Fetch messages from Express Server
  const fetchMessages = () => {
    setIsLoadingMessages(true);
    getContactMessages()
      .then(data => {
        if (data.success && Array.isArray(data.contacts)) {
          setMessages(data.contacts);
        }
        setIsLoadingMessages(false);
      })
      .catch(err => {
        console.error('Error fetching admin contacts:', err);
        setIsLoadingMessages(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    fetchMessages();
  }, []);

  // Total Revenue calculations based on orders
  const totalRevenue = orders.reduce((sum, ord) => {
    const numeric = parseInt(ord.finalTotal?.replace(/[^0-9]/g, '') || '0');
    return sum + (ord.status !== 'Hủy bỏ' ? numeric : 0);
  }, 0);

  // Handle open Form in creation mode
  const openCreateForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Handle open Form in modification mode
  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (productData: any, selectedImageFile: File | null) => {
    if (editingProduct) {
      // Edit
      const updated = {
        id: editingProduct.id,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        image: productData.image || editingProduct.image,
        description: productData.description,
        specs: productData.specs
      };
      onEditProduct(updated, selectedImageFile);
      addLog(`Cập nhật thành công thiết bị: ${productData.name}`);
    } else {
      // Create
      const created = {
        name: productData.name,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        description: productData.description,
        specs: productData.specs
      };
      onAddProduct(created, selectedImageFile);
      addLog(`Thêm mới thiết bị thành công: ${productData.name}`);
    }

    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Delete product
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn chắn chắn muốn gỡ bỏ thiết bị "${name}" khỏi quầy trưng bày?`)) {
      onDeleteProduct(id);
      addLog(`Đã xóa thiết bị: ${name}`);
    }
  };

  // Update order status on Express
  const handleUpdateOrderStatus = (orderId: number, status: string, statusType: string) => {
    updateOrderStatus(orderId, status, statusType)
      .then(data => {
        if (data.success) {
          addLog(`Đơn hàng #${orderId} thay đổi trạng thái sang "${status}"`);
          fetchOrders(); // Refresh table
        }
      })
      .catch(err => {
        console.error('Error changing order status:', err);
      });
  };

  // Clean all orders on Express
  const handleClearAllOrders = () => {
    if (confirm('Bạn muốn xoá sạch toàn bộ nhật ký đặt hàng của khách hàng trên máy chủ?')) {
      clearAllOrdersFromServer()
        .then(data => {
          if (data.success) {
            addLog('Đã dọn dẹp sạch toàn bộ sổ gọi đơn bưu kiện.');
            fetchOrders();
          }
        });
    }
  };

  // Seed sample orders for immediate demonstration of management features
  const handleSeedOrders = () => {
    const names = ['Nguyễn Kim Thư', 'Đỗ Nam Khánh', 'Phạm Quỳnh Anh', 'Bùi Xuân Huấn'];
    const phones = ['0915 222 333', '0388 999 777', '0905 444 666', '0922 411 999'];
    const addresses = [
      '246 Phố Huế, Quận Hai Bà Trưng, Hà Nội',
      '15 Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng',
      '45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      'Đại Lộ Hùng Vương, Việt Trì, Phú Thọ'
    ];
    const preselectedProducts = products.length > 0 ? products : [];
    
    if (preselectedProducts.length === 0) {
      console.warn('Không có sản phẩm để tạo đơn mẫu. Hãy khôi phục danh mục.');
      return;
    }

    // Pick random values
    const idx = Math.floor(Math.random() * names.length);
    const prodIdx = Math.floor(Math.random() * preselectedProducts.length);
    const item = preselectedProducts[prodIdx];
    const qty = Math.floor(Math.random() * 2) + 1;
    const finalTotalNum = item.price * qty;

    const dummyOrder = {
      fullName: names[idx],
      phone: phones[idx],
      email: `${names[idx].toLowerCase().replace(/\s/g, '')}@gmail.com`,
      address: addresses[idx],
      notes: "Yêu cầu giao hàng nguyên seal, hỗ trợ kỹ thuật tận nơi.",
      paymentMethod: "cod",
      deliveryMethod: "express",
      cart: [{ product: item, quantity: qty }],
      finalTotal: `${finalTotalNum.toLocaleString('vi-VN')}₫`
    };

    seedDummyOrder(dummyOrder)
      .then(data => {
        if (data.success) {
          addLog(`Tạo thành công đơn hàng thử nghiệm mới #${data.orderId} cho: ${names[idx]}`);
          fetchOrders();
        }
      })
      .catch(err => {
        console.error('Error seeding orders:', err);
      });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-gray-900 w-full flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 xl:w-80 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between md:sticky md:top-0 md:h-screen p-6 md:p-8 shrink-0 z-40">
        <div className="space-y-8">
          {/* Brand/Lumina admin identity */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6366f1] font-extrabold mb-1.5 block">
              SYSTEM CONSOLE
            </span>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-black shrink-0" size={24} />
              <h1 className="text-xl font-black text-gray-950 uppercase tracking-tighter">
                LUMINA ADMIN
              </h1>
            </div>
            <div className="mt-3 flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-indigo-700 font-extrabold uppercase tracking-wider font-mono">
                Quản trị viên
              </span>
            </div>
          </div>

          {/* Subtabs Menu */}
          <div className="space-y-1.5">
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest font-sans mb-3">
              DANH MỤC QUẢN LÝ
            </span>
            
            <button
              onClick={() => { setActiveSubTab('overview'); fetchOrders(); fetchMessages(); }}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'overview' 
                  ? 'bg-black text-white shadow-md shadow-black/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 size={15} />
                <span>Tổng quan</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('products')}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'products' 
                  ? 'bg-black text-white shadow-md shadow-black/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package size={15} />
                <span>Sản phẩm</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeSubTab === 'products' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveSubTab('orders'); fetchOrders(); }}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'orders' 
                  ? 'bg-black text-white shadow-md shadow-black/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={15} />
                <span>Đơn hàng</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeSubTab === 'orders' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveSubTab('messages'); fetchMessages(); }}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'messages' 
                  ? 'bg-black text-white shadow-md shadow-black/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare size={15} />
                <span>Khách hàng</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeSubTab === 'messages' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveSubTab('promos'); }}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'promos' 
                  ? 'bg-black text-white shadow-md shadow-black/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Ticket size={15} />
                <span>Khuyến mãi</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeSubTab === 'promos' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {promos.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveSubTab('users'); }}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'users' 
                  ? 'bg-black text-white shadow-md shadow-black/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={15} />
                <span>Thành viên</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeSubTab === 'users' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {systemUsers.length}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom actions block inside sidebar */}
        <div className="pt-6 border-t border-gray-100 mt-6 md:mt-0 space-y-3">
          <button
            onClick={() => onNavigate('home')}
            className="group w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-black/5 hover:bg-black text-gray-900 hover:text-white border border-black/10 hover:border-black transition-all text-[11px] font-black uppercase tracking-wider active:scale-95 cursor-pointer shadow-sm font-sans"
          >
            <ArrowLeft size={13} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Trang chủ Lumina</span>
          </button>

          <div className="text-[10px] text-center text-gray-400 font-mono">
            v1.0.0 ● Live Production
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-6 md:p-10 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header area in main text describing the active view */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-gray-200 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-extrabold mb-1 block">
                {activeSubTab === 'overview' ? 'DASHBOARD OVERVIEW' : activeSubTab === 'products' ? 'PRODUCT MANAGER' : activeSubTab === 'orders' ? 'LIVE ORDERS REGISTRY' : activeSubTab === 'messages' ? 'CUSTOMER INQUIRIES' : activeSubTab === 'promos' ? 'PROMO CAMPAIGNS' : 'USER ROLES & ACCOUNTS'}
              </span>
              <h1 className="text-3xl font-black text-gray-950 uppercase tracking-tighter flex items-center gap-2.5">
                {activeSubTab === 'overview' && 'Bảng Tổng Quan Hệ Thống'}
                {activeSubTab === 'products' && 'Quản Lý Quầy Sản Phẩm'}
                {activeSubTab === 'orders' && 'Sổ Ghi Đơn Hàng Thực'}
                {activeSubTab === 'messages' && 'Thư Phản Hồi Khách Hàng'}
                {activeSubTab === 'promos' && 'Hệ Thống Voucher & Khuyến Mãi'}
                {activeSubTab === 'users' && 'Sổ Nhân Sự & Thành Viên'}
              </h1>
              <p className="text-xs text-gray-400 font-sans mt-1">
                {activeSubTab === 'overview' && 'Giao diện tổng quan trạng thái, cập nhật dữ liệu máy chủ thực tế tức thời.'}
                {activeSubTab === 'products' && 'Đăng bán sản phẩm mới, cập nhật giá cả, thương hiệu và thông số cấu hình cụ thể.'}
                {activeSubTab === 'orders' && 'Xem thông tin giao nhận, cập nhật trạng thái đơn hàng (đang xử lý, hoàn thành, hủy đơn).'}
                {activeSubTab === 'messages' && 'Phản hồi ý kiến đóng góp, đề đạt yêu cầu làm đại lý hoặc câu hỏi hỗ trợ khách hàng.'}
                {activeSubTab === 'promos' && 'Cấu hình mã giảm giá toàn sàn, lưu trực tiếp máy chủ và hiển thị cho người dùng tức thời khi checkout.'}
                {activeSubTab === 'users' && 'Điều chỉnh phân quyền cán bộ nhân viên, xem thông tin số điện thoại email và trạng thái khoá tài khoản.'}
              </p>
            </div>
          </div>

          {/* DYNAMIC SUBTAB VIEWS */}
          {activeSubTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <DashboardStats
                totalRevenue={totalRevenue}
                ordersCount={orders.length}
                processingOrdersCount={orders.filter(o => o.statusType === 'processing').length}
                productsCount={products.length}
                messagesCount={messages.length}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Quick Actions Panel */}
                <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">Hành động nhanh cho Manager</h3>
                    <p className="text-[11px] text-gray-400 mt-1 font-sans">Các thao tác khẩn cấp, cập nhật cơ sở dữ liệu của hệ thống.</p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={handleSeedOrders}
                      className="w-full py-4.5 bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus size={15} />
                      Tạo đơn thử nghiệm (random)
                    </button>

                    <button
                      onClick={openCreateForm}
                      className="w-full py-4.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Package size={15} />
                      Đăng Thêm Thiết bị mới
                    </button>

                    <button
                      onClick={handleClearAllOrders}
                      disabled={orders.length === 0}
                      className="w-full py-4.5 bg-rose-50 border border-rose-100/60 hover:bg-rose-100 disabled:opacity-40 text-rose-600 font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={15} />
                      Xoá sạch lịch sử đơn hàng
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl text-[11px] text-gray-500 font-sans leading-relaxed">
                    <strong className="text-gray-800 block mb-1">Ghi chú về bảo trợ:</strong>
                    Cơ sở đặt hàng được tối ưu mượt mà dưới môi trường Full-stack in-memory của máy chủ Express.
                  </div>
                </div>

                {/* System Log terminal stream */}
                <SystemConsole logs={logs} onClearLogs={() => setLogs(['[LOG] Bàn phân tích khôi phục hoàn chỉnh.'])} />
              </div>
            </div>
          )}

          {activeSubTab === 'products' && (
            <ProductManager
              products={products}
              onOpenCreateForm={openCreateForm}
              onOpenEditForm={openEditForm}
              onDelete={handleDelete}
            />
          )}

          {activeSubTab === 'orders' && (
            <OrderManager
              orders={orders}
              isLoadingOrders={isLoadingOrders}
              onRefreshOrders={fetchOrders}
              onSeedOrder={handleSeedOrders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeSubTab === 'messages' && (
            <ContactManager
              messages={messages}
              isLoadingMessages={isLoadingMessages}
              onRefreshMessages={fetchMessages}
            />
          )}

          {activeSubTab === 'promos' && (
            <PromoManager
              promos={promos}
              onAddPromo={handleAddPromo}
              onTogglePromoStatus={handleTogglePromoStatus}
              onDeletePromo={handleDeletePromo}
            />
          )}

          {activeSubTab === 'users' && (
            <UserManager
              systemUsers={systemUsers}
              onAddUser={handleAddUser}
              onToggleUserRole={handleToggleUserRole}
              onToggleUserVip={handleToggleUserVip}
              onToggleUserStatus={handleToggleUserStatus}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {/* DYNAMIC FORM DRAWER: FOR ADDING / EDITING PRODUCTS */}
          <ProductFormModal
            isOpen={isFormOpen}
            onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
            editingProduct={editingProduct}
            onSave={handleSaveProduct}
          />
        </div>
      </main>
    </div>
  );
}
