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
  Trash2
} from 'lucide-react';

// Sub-components imports
import DashboardStats from './DashboardStats';
import SystemConsole from './SystemConsole';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import ContactManager from './ContactManager';
import ProductFormModal from './ProductFormModal';

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
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'orders' | 'messages'>('overview');

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
      alert('Không có sản phẩm để tạo đơn mẫu. Hãy khôi phục danh mục.');
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Admin Title bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#6366f1] font-extrabold mb-1 block">
            LUMINA SYSTEM ADMINISTRATOR
          </span>
          <h1 className="text-3xl font-black text-gray-950 uppercase tracking-tighter flex items-center gap-2.5">
            <BarChart3 className="text-black inline-block" size={26} />
            Bảng Quản Trị Hệ Thống
          </h1>
          <p className="text-xs text-gray-405 font-sans mt-1">
            Giao diện tinh gọn, tập trung cao vào tốc độ xử lý dữ liệu đơn hàng, kho sản phẩm và phản hồi khách hàng thực tế.
          </p>
        </div>

        {/* Back to Client Store Link */}
        <button 
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 bg-gray-50 border border-gray-200 hover:bg-black hover:text-white hover:border-black rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          Trở lại gian hàng
          <Sparkles size={13} />
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white border border-gray-150 p-2 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] max-w-2xl">
        <button
          onClick={() => { setActiveSubTab('overview'); fetchOrders(); fetchMessages(); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
            activeSubTab === 'overview' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
        >
          Tổng quan
        </button>
        <button
          onClick={() => setActiveSubTab('products')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
            activeSubTab === 'products' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
        >
          Quầy Sản phẩm ({products.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('orders'); fetchOrders(); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
            activeSubTab === 'orders' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
        >
          Sổ Đơn hàng ({orders.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('messages'); fetchMessages(); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
            activeSubTab === 'messages' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
        >
          Khách hàng ({messages.length})
        </button>
      </div>

      {/* DYNAMIC SUBTAB VIEWS */}

      {/* 1. OVERVIEW HUB */}
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
                <p className="text-[11px] text-gray-400 mt-1 font-sans">Các thao tác khẩn cấp, cập nhật cơ sở dữ liệu in-memory của sảnh.</p>
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
                  Xoá sọc lịch sử đơn hàng
                </button>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl text-[11px] text-gray-505 font-sans leading-relaxed">
                <strong className="text-gray-800 block mb-1">Ghi chú về bảo trợ:</strong>
                Cơ sở đặt hàng được tối ưu mượt mà dưới môi trường Full-stack in-memory của máy chủ Express container.
              </div>
            </div>

            {/* System Log terminal stream */}
            <SystemConsole logs={logs} onClearLogs={() => setLogs(['[LOG] Bàn phân tích khôi phục hoàn chỉnh.'])} />
          </div>
        </div>
      )}

      {/* 2. CATALOGUE PRODUCTS MANAGER */}
      {activeSubTab === 'products' && (
        <ProductManager
          products={products}
          onOpenCreateForm={openCreateForm}
          onOpenEditForm={openEditForm}
          onDelete={handleDelete}
        />
      )}

      {/* 3. ORDER LOGS */}
      {activeSubTab === 'orders' && (
        <OrderManager
          orders={orders}
          isLoadingOrders={isLoadingOrders}
          onRefreshOrders={fetchOrders}
          onSeedOrder={handleSeedOrders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {/* 4. CUSTOMER CONTACT MESSAGES */}
      {activeSubTab === 'messages' && (
        <ContactManager
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          onRefreshMessages={fetchMessages}
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
  );
}
