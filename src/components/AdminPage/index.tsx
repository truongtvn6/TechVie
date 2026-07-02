import { useState, useEffect } from 'react';
import { Product } from '../../types';
import { 
  getContactMessages,
  deleteContactMessage,
  replyContactMessage,
  getAdminOrders,
  updateOrderStatus,
  getProducts,
  getSystemUsers,
  getBackendCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  toggleCategory,
  hardDeleteCategory
} from '../../services/api';
import AdminSidebar from './AdminSidebar';

// Sub-components imports
import DashboardStats from './DashboardStats';
import SystemConsole from './SystemConsole';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import ContactManager from './ContactManager';
import ProductFormModal from './ProductFormModal';
import PromoManager from './PromoManager';
import UserManager from './UserManager';
import CategoryManager from './CategoryManager';
import AdminDemoPanel from '../../demo/AdminDemoPanel';
import { IS_DEMO_ENABLED } from '../../demo/demoConfig';

interface AdminPageProps {
  products: Product[];
  onAddProduct: (product: any, imageFile: File | null) => void;
  onEditProduct: (product: any, imageFile: File | null) => void;
  onDeleteProduct: (id: string) => void;
  onNavigate: (tab: any) => void;
  systemUsers: any[];
  onAddUser: (user: any) => Promise<{ success: boolean; message: string; user?: any }>;
  onToggleUserRole: (id: string) => Promise<{ success: boolean; message: string; user?: any }>;
  onToggleUserVip: (id: string) => Promise<{ success: boolean; message: string; user?: any }>;
  onToggleUserStatus: (id: string) => Promise<{ success: boolean; message: string; user?: any }>;
  onDeleteUser: (id: string) => Promise<{ success: boolean; message: string }>;
  token: string;
  onRestoreProduct: (id: string) => Promise<{ success: boolean; message: string }>;
  onRestoreUser: (id: string) => Promise<{ success: boolean; message: string }>;
  onSwitchAccount: (email: string) => void;
  onRefreshProducts: () => void;
}

export default function AdminPage({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  onNavigate,
  systemUsers,
  onAddUser,
  onToggleUserRole,
  onToggleUserVip,
  onToggleUserStatus,
  onDeleteUser,
  token,
  onRestoreProduct,
  onRestoreUser,
  onSwitchAccount,
  onRefreshProducts
}: AdminPageProps) {
  // Persistent Dark Mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('techvie_admin_dark_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('techvie_admin_dark_mode', String(isDarkMode));
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  // Soft Delete Toggle & State
  const [showDeletedItems, setShowDeletedItems] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminProducts, setAdminProducts] = useState<Product[]>(products);
  const [adminUsers, setAdminUsers] = useState<any[]>(systemUsers);

  // Sync initial props
  useEffect(() => {
    if (!showDeletedItems) {
      setAdminProducts(products);
    }
  }, [products, showDeletedItems]);

  useEffect(() => {
    if (!showDeletedItems) {
      setAdminUsers(systemUsers);
    }
  }, [systemUsers, showDeletedItems]);

  // Fetch data when toggle changes
  useEffect(() => {
    if (showDeletedItems) {
      getProducts("", true).then(res => {
        if (res.success) setAdminProducts(res.products);
      });
      getSystemUsers(token, true).then(res => {
        if (res.success && res.users) {
          const mapped = res.users.map((u: any) => ({
            id: u.id || u._id,
            name: u.username,
            email: u.email,
            phone: u.phone,
            role: u.role,
            vipStatus: u.vipStatus,
            status: u.status,
            joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
            isDeleted: u.isDeleted
          }));
          setAdminUsers(mapped);
        }
      });
    }
  }, [showDeletedItems, token]);

  // Restore handlers with logging
  const handleRestoreProductWrapper = async (id: string) => {
    const res = await onRestoreProduct(id);
    if (res.success) {
      addLog(`Khôi phục sản phẩm thành công: ${id}`);
      // Refresh list if toggle is on
      if (showDeletedItems) {
        getProducts("", true).then(res => {
          if (res.success) setAdminProducts(res.products);
        });
      }
    } else {
      addLog(`Lỗi khôi phục sản phẩm: ${res.message}`);
    }
  };

  const handleRestoreUserWrapper = async (id: string) => {
    const res = await onRestoreUser(id);
    if (res.success) {
      addLog(`Khôi phục tài khoản thành công: ${id}`);
      // Refresh list if toggle is on
      if (showDeletedItems) {
        getSystemUsers(token, true).then(data => {
          if (data.success && data.users) {
            const mapped = data.users.map((u: any) => ({
              id: u.id || u._id,
              name: u.username,
              email: u.email,
              phone: u.phone,
              role: u.role,
              vipStatus: u.vipStatus,
              status: u.status,
              joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
              isDeleted: u.isDeleted
            }));
            setAdminUsers(mapped);
          }
        });
      }
    } else {
      addLog(`Lỗi khôi phục tài khoản: ${res.message}`);
    }
  };

  // Admin active sub tab
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'categories' | 'products' | 'orders' | 'messages' | 'promos' | 'users'>('overview');

  // Product categories state (always fetch all, including soft-deleted)
  const [allCategories, setAllCategories] = useState<any[]>([]);

  const fetchCategories = () => {
    // Always fetch all categories (including deleted) so the UI can show both states
    getBackendCategories(true).then(res => {
      if (res.success && res.categories) {
        setAllCategories(res.categories);
      }
    });
  };

  // Filter categories based on showDeletedItems toggle
  const categories = showDeletedItems
    ? allCategories  // Show all (including deleted)
    : allCategories.filter(c => !c.isDeleted);  // Only show active

  const handleCreateCategory = async (name: string) => {
    const res = await createCategory(name);
    if (res.success) {
      addLog(`Thêm danh mục mới thành công: "${name}"`);
      fetchCategories();
    } else {
      addLog(`Lỗi khi tạo danh mục: ${res.message}`);
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    const res = await updateCategory(id, name);
    if (res.success) {
      addLog(`Cập nhật tên danh mục thành công: "${name}"`);
      fetchCategories();
    } else {
      addLog(`Lỗi khi cập nhật danh mục: ${res.message}`);
    }
  };

  // Toggle bật/tắt danh mục
  const handleToggleCategory = async (id: string) => {
    const target = allCategories.find(c => c._id === id);
    const name = target ? target.name : id;
    const wasDeleted = target?.isDeleted;
    try {
      const res = await toggleCategory(id);
      if (res.success) {
        addLog(wasDeleted ? `Đã bật lại danh mục: "${name}"` : `Đã tắt danh mục: "${name}"`);
        fetchCategories();
      } else {
        addLog(`Lỗi khi thay đổi trạng thái danh mục: ${res.message}`);
      }
    } catch (err) {
      console.error('[CategoryManager] Toggle error:', err);
      addLog(`Lỗi toggle danh mục: ${err}`);
    }
  };

  // Xóa hẳn danh mục khỏi cơ sở dữ liệu
  const handleHardDeleteCategory = async (id: string) => {
    const target = allCategories.find(c => c._id === id);
    const name = target ? target.name : id;
    const confirmed = window.confirm(`⚠️ Hành động này không thể hoàn tác!\n\nBạn chắc chắn muốn XÓA HẲNG danh mục "${name}" khỏi cơ sở dữ liệu?`);
    if (confirmed) {
      try {
        const res = await hardDeleteCategory(id);
        if (res.success) {
          addLog(`Đã xóa hẳn danh mục: "${name}" khỏi CSDL`);
          fetchCategories();
        } else {
          addLog(`Lỗi khi xóa hẳn danh mục: ${res.message}`);
        }
      } catch (err) {
        console.error('[CategoryManager] Hard delete error:', err);
        addLog(`Lỗi xóa hẳn danh mục: ${err}`);
      }
    }
  };

  // Dynamic Promo Campaigns local state with localStorage persistence
  const [promos, setPromos] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('techvie_promos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { code: 'TECHVIE2026', discount: 0.1, description: 'Giảm giá ra mắt sản phẩm 10%', usedCount: 34, isActive: true },
      { code: 'FUTURE', discount: 0.1, description: 'Đặc quyền tương lai 10%', usedCount: 12, isActive: true },
      { code: 'VIPLAB', discount: 0.25, description: 'Siêu đặc quyền từ TechVie Lab 25%', usedCount: 7, isActive: true, minOrderVal: 30000000 }
    ];
  });



  // Sync promos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('techvie_promos', JSON.stringify(promos));
    } catch (e) {
      console.error(e);
    }
  }, [promos]);



  // Real-time fetched datasets from backend
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Product Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // System logs feedback messages
  const [logs, setLogs] = useState<string[]>(['Chào mừng Người quản lý. Hệ quản trị TECHVIE ADMIN đã sẵn sàng.']);

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

  // User Handlers (Calling parent API callbacks with dynamic logging)
  const handleAddUser = (newUser: any) => {
    if (systemUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      addLog(`Lỗi: Email ${newUser.email} đã được đăng ký tài khoản!`);
      console.warn(`Email ${newUser.email} đã được đăng ký tài khoản!`);
      return;
    }
    onAddUser(newUser).then(res => {
      if (res.success && res.user) {
        addLog(`Khai sinh tài khoản thành viên mới thành công: ${res.user.email}`);
      } else {
        addLog(`Lỗi cấp tài khoản: ${res.message}`);
      }
    });
  };

  const handleToggleUserRole = (id: string) => {
    onToggleUserRole(id).then(res => {
      if (res.success && res.user) {
        addLog(`Đã chuyển đổi quyền hạn tài khoản ${res.user.email} thành: ${res.user.role.toUpperCase()}`);
      } else {
        addLog(`Lỗi chuyển đổi quyền hạn: ${res.message}`);
      }
    });
  };

  const handleToggleUserVip = (id: string) => {
    onToggleUserVip(id).then(res => {
      if (res.success && res.user) {
        addLog(`Đồng bộ hạn VIP cho ${res.user.email}: thành viên ${res.user.vipStatus}`);
      } else {
        addLog(`Lỗi đồng bộ hạn VIP: ${res.message}`);
      }
    });
  };

  const handleToggleUserStatus = (id: string) => {
    onToggleUserStatus(id).then(res => {
      if (res.success && res.user) {
        addLog(`Cập nhật trạng thái ${res.user.email}: ${res.user.status === 'blocked' ? 'KHOÁ BANNED' : 'HOẠT ĐỘNG'}`);
      } else {
        addLog(`Lỗi cập nhật trạng thái: ${res.message}`);
      }
    });
  };

  const handleDeleteUser = (id: string) => {
    const usr = systemUsers.find(u => u.id === id);
    if (usr) {
      if (usr.email === 'admin@techvie.com') {
        addLog('Lỗi nghiêm trọng: Không thể xoá tài khoản sáng lập Gốc của hệ thống.');
        return;
      }
      onDeleteUser(id).then(res => {
        if (res.success) {
          addLog(`Đã gỡ bỏ tài khoản ${usr.email} vĩnh viễn khỏi sổ đăng ký`);
        } else {
          addLog(`Lỗi gỡ bỏ tài khoản: ${res.message}`);
        }
      });
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

  const handleDeleteContactMessage = (id: string) => {
    deleteContactMessage(id)
      .then(data => {
        if (data.success) {
          addLog(`Đã xóa thư phản hồi khách hàng thành công.`);
          fetchMessages();
        }
      })
      .catch(err => {
        console.error('Error deleting contact message:', err);
      });
  };

  const handleReplyContactMessage = (id: string, subject: string, content: string) => {
    return replyContactMessage(id, subject, content)
      .then(data => {
        if (data.success) {
          addLog(`Đã gửi email phản hồi SMTP cho khách hàng.`);
        }
        return data;
      });
  };

  useEffect(() => {
    fetchOrders();
    fetchMessages();
    fetchCategories();
  }, []);


  // No need to refetch categories on showDeletedItems change — filtering is done client-side

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



  return (
    <div className={`admin-dashboard-root min-h-screen bg-[#f7f9fb] text-gray-900 w-full flex flex-col md:flex-row ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile Sticky Navbar */}
      <div className={`md:hidden w-full flex items-center justify-between p-4 border-b ${isDarkMode ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-gray-200 text-gray-900'} sticky top-0 z-30 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-200/20 rounded-lg cursor-pointer"
            title="Mở menu quản trị"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <strong className="text-sm font-black uppercase tracking-tighter">TechVie Admin</strong>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold">Live</span>
      </div>

      {/* Sidebar Responsive Container */}
      <div className={`fixed inset-0 z-50 md:relative md:inset-auto md:z-auto flex ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none md:pointer-events-auto'}`}>
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
          />
        )}
        
        {/* Sidebar Drawer container */}
        <div className={`w-64 lg:w-72 xl:w-80 h-full md:h-screen fixed md:sticky left-0 top-0 bottom-0 transform md:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out z-50 md:z-auto bg-transparent`}>
          <AdminSidebar
            activeSubTab={activeSubTab}
            setActiveSubTab={(tab) => {
              setActiveSubTab(tab);
              setIsSidebarOpen(false); // Đóng menu mobile khi chọn tab
              if (tab === 'overview' || tab === 'orders') fetchOrders();
              if (tab === 'overview' || tab === 'messages') fetchMessages();
              if (tab === 'overview' || tab === 'categories') fetchCategories();
            }}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            categoriesCount={categories.length}
            productsCount={products.length}
            ordersCount={orders.length}
            messagesCount={messages.length}
            promosCount={promos.length}
            usersCount={systemUsers.length}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-6 md:p-10 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header area in main text describing the active view */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-gray-200 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-extrabold mb-1 block">
                {activeSubTab === 'overview' ? 'DASHBOARD OVERVIEW' : activeSubTab === 'categories' ? 'PRODUCT CATEGORIES' : activeSubTab === 'products' ? 'PRODUCT MANAGER' : activeSubTab === 'orders' ? 'LIVE ORDERS REGISTRY' : activeSubTab === 'messages' ? 'CUSTOMER INQUIRIES' : activeSubTab === 'promos' ? 'PROMO CAMPAIGNS' : 'USER ROLES & ACCOUNTS'}
              </span>
              <h1 className="text-3xl font-black text-gray-950 uppercase tracking-tighter flex items-center gap-2.5">
                {activeSubTab === 'overview' && 'Bảng Tổng Quan Hệ Thống'}
                {activeSubTab === 'categories' && 'Quản Lý Danh Mục'}
                {activeSubTab === 'products' && 'Quản Lý Quầy Sản Phẩm'}
                {activeSubTab === 'orders' && 'Sổ Ghi Đơn Hàng Thực'}
                {activeSubTab === 'messages' && 'Thư Phản Hồi Khách Hàng'}
                {activeSubTab === 'promos' && 'Hệ Thống Voucher & Khuyến Mãi'}
                {activeSubTab === 'users' && 'Sổ Nhân Sự & Thành Viên'}
              </h1>
              <p className="text-xs text-gray-400 font-sans mt-1">
                {activeSubTab === 'overview' && 'Giao diện tổng quan trạng thái, cập nhật dữ liệu máy chủ thực tế tức thời.'}
                {activeSubTab === 'categories' && 'Thêm mới danh mục sản phẩm, đổi tên, xóa mềm và khôi phục danh mục hàng hóa.'}
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
                isDarkMode={isDarkMode}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* System Log terminal stream */}
                <SystemConsole logs={logs} onClearLogs={() => setLogs(['[LOG] Bàn phân tích khôi phục hoàn chỉnh.'])} />
              </div>
            </div>
          )}

          {activeSubTab === 'categories' && (
            <CategoryManager
              categories={allCategories}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onToggleCategory={handleToggleCategory}
              onHardDeleteCategory={handleHardDeleteCategory}
              isDarkMode={isDarkMode}
            />
          )}

          {activeSubTab === 'products' && (
            <ProductManager
              products={adminProducts}
              onOpenCreateForm={openCreateForm}
              onOpenEditForm={openEditForm}
              onDelete={handleDelete}
              onRestore={handleRestoreProductWrapper}
              onImportProducts={async (data) => {
                addLog(`Bắt đầu nhập ${data.length} sản phẩm từ file CSV...`);
                for (const item of data) {
                  await onAddProduct(item, null);
                }
                addLog(`Đã nhập thành công ${data.length} sản phẩm mới.`);
                onRefreshProducts();
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {activeSubTab === 'orders' && (
            <OrderManager
              orders={orders}
              isLoadingOrders={isLoadingOrders}
              onRefreshOrders={fetchOrders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              isDarkMode={isDarkMode}
              products={products}
            />
          )}

          {activeSubTab === 'messages' && (
            <ContactManager
              messages={messages}
              isLoadingMessages={isLoadingMessages}
              onRefreshMessages={fetchMessages}
              onDeleteMessage={handleDeleteContactMessage}
              onReplyMessage={handleReplyContactMessage}
              isDarkMode={isDarkMode}
            />
          )}

          {activeSubTab === 'promos' && (
            <PromoManager
              promos={promos}
              onAddPromo={handleAddPromo}
              onTogglePromoStatus={handleTogglePromoStatus}
              onDeletePromo={handleDeletePromo}
              isDarkMode={isDarkMode}
            />
          )}

          {activeSubTab === 'users' && (
            <UserManager
              systemUsers={adminUsers}
              onAddUser={handleAddUser}
              onToggleUserRole={handleToggleUserRole}
              onToggleUserVip={handleToggleUserVip}
              onToggleUserStatus={handleToggleUserStatus}
              onDeleteUser={handleDeleteUser}
              onRestoreUser={handleRestoreUserWrapper}
              isDarkMode={isDarkMode}
            />
          )}

          <ProductFormModal
            isOpen={isFormOpen}
            onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
            editingProduct={editingProduct}
            onSave={handleSaveProduct}
            isDarkMode={isDarkMode}
          />
        </div>
      </main>

      {/* Floating Demo Control Panel for Admin */}
      {IS_DEMO_ENABLED && (
        <AdminDemoPanel
          token={token}
          onSwitchAccount={onSwitchAccount}
          onRefreshProducts={onRefreshProducts}
          onRefreshOrders={fetchOrders}
        />
      )}
    </div>
  );
}
