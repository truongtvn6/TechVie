import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  getContactMessages,
  getAdminOrders,
  updateOrderStatus,
  seedDummyOrder,
  clearAllOrdersFromServer
} from '../services/api';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Truck, 
  X, 
  User, 
  Layers, 
  BookOpen, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

interface AdminPageProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
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
  // Admin local active sub tab
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'orders' | 'messages'>('overview');

  // Real-time fetched datasets from backend
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Product Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // New/Edit product input fields
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodCategory, setProdCategory] = useState('Điện thoại');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  
  // Specifications fields
  const [specCpuLabel, setSpecCpuLabel] = useState('Vi xử lý');
  const [specCpuVal, setSpecCpuVal] = useState('Lumina Core S');
  const [specScreenLabel, setSpecScreenLabel] = useState('Màn hình');
  const [specScreenVal, setSpecScreenVal] = useState('6.1" Retina Liquid');
  const [specBatteryLabel, setSpecBatteryLabel] = useState('Dung lượng Pin');
  const [specBatteryVal, setSpecBatteryVal] = useState('4500 mAh');
  const [specExtraLabel, setSpecExtraLabel] = useState('Chống nước');
  const [specExtraVal, setSpecExtraVal] = useState('Chuẩn kháng nước IP68');

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

  // Total Revenue calculations based on express loaded orders
  const totalRevenue = orders.reduce((sum, ord) => {
    const numeric = parseInt(ord.finalTotal?.replace(/[^0-9]/g, '') || '0');
    return sum + (ord.status !== 'Hủy bỏ' ? numeric : 0);
  }, 0);

  // Handle open Form in creation mode
  const openCreateForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice(9900000);
    setProdCategory('Điện thoại');
    setProdImage('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
    setProdDesc('Sản phẩm công nghệ tinh tế bứt phá hiệu năng, chế tác cao cấp từ Lumina Lab Thụy Sĩ.');
    
    setSpecCpuLabel('Hộp chip');
    setSpecCpuVal('Silicon Lumina Standard');
    setSpecScreenLabel('Màn hình');
    setSpecScreenVal('6.1" OLED Retina');
    setSpecBatteryLabel('Dung lượng Pin');
    setSpecBatteryVal('4000 mAh');
    setSpecExtraLabel('Chuẩn kháng nước');
    setSpecExtraVal('IP68 chuẩn hãng');

    setIsFormOpen(true);
  };

  // Handle open Form in modification mode
  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdPrice(product.price);
    setProdCategory(product.category);
    setProdImage(product.image);
    setProdDesc(product.description || '');

    // Load spec fields safely
    setSpecCpuLabel(product.specs[0]?.label || 'Vi xử lý');
    setSpecCpuVal(product.specs[0]?.value || '');
    setSpecScreenLabel(product.specs[1]?.label || 'Màn hình');
    setSpecScreenVal(product.specs[1]?.value || '');
    setSpecBatteryLabel(product.specs[2]?.label || 'Dung lượng Pin');
    setSpecBatteryVal(product.specs[2]?.value || '');
    setSpecExtraLabel(product.specs[3]?.label || 'Chống nước');
    setSpecExtraVal(product.specs[3]?.value || '');

    setIsFormOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const specsArray = [
      { label: specCpuLabel, value: specCpuVal },
      { label: specScreenLabel, value: specScreenVal },
      { label: specBatteryLabel, value: specBatteryVal },
      { label: specExtraLabel, value: specExtraVal },
    ];

    if (editingProduct) {
      // Edit
      const updated: Product = {
        ...editingProduct,
        name: prodName,
        price: prodPrice,
        category: prodCategory,
        image: prodImage || editingProduct.image,
        description: prodDesc,
        specs: specsArray
      };
      onEditProduct(updated);
      addLog(`Cập nhật thành công thiết bị: ${prodName}`);
    } else {
      // Create
      const newId = `lumina-custom-${Date.now()}`;
      const created: Product = {
        id: newId,
        name: prodName,
        price: prodPrice,
        category: prodCategory,
        image: prodImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        description: prodDesc,
        specs: specsArray
      };
      onAddProduct(created);
      addLog(`Thêm mới thiết bị thành công: ${prodName}`);
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

  // Update order status on Express memory
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
      
      {/* Admin Title bar built with crisp high-contrast spacing */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#6366f1] font-extrabold mb-1 block">
            LUMINA SYSTEM ADMINISTRATOR
          </span>
          <h1 className="text-3xl font-black text-gray-950 uppercase tracking-tighter flex items-center gap-2.5">
            <BarChart3 className="text-black inline-block" size={26} />
            Bảng Quản Trị Hệ Thống
          </h1>
          <p className="text-xs text-gray-400 font-sans mt-1">
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

      {/* Sub-navigation Tabs: Single-tier, performance-themed, extremely simple to navigate */}
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
          
          {/* Bento Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat 1: Revenue */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-black/20 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">DOANH THU ƯỚC TÍNH</span>
                <strong className="text-2xl font-black text-gray-900 font-mono tracking-tight block">
                  {totalRevenue.toLocaleString('vi-VN')}₫
                </strong>
                <span className="text-[9px] text-emerald-500 uppercase font-bold tracking-wider font-mono">
                  ● Dữ liệu máy chủ thực
                </span>
              </div>
              <div className="w-12 h-12 bg-[#e0e7ff] text-[#4f46e5] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <DollarSign size={20} />
              </div>
            </div>

            {/* Stat 2: Orders Total */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-black/20 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">SỔ ĐƠN ĐÃ LỌC</span>
                <strong className="text-2xl font-black text-gray-900 font-mono tracking-tight block">
                  {orders.length} đơn hàng
                </strong>
                <span className="text-[9px] text-gray-400 block font-mono">
                  Gồm {orders.filter(o => o.statusType === 'processing').length} đơn đang xử lý
                </span>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShoppingBag size={20} />
              </div>
            </div>

            {/* Stat 3: Products Store */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-black/20 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">ACTIVE CATALOGUE</span>
                <strong className="text-2xl font-black text-gray-900 font-mono tracking-tight block">
                  {products.length} danh mục
                </strong>
                <span className="text-[9px] text-emerald-500 uppercase font-bold tracking-wider font-mono">
                  ● Sẵn sàng hiển thị
                </span>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package size={20} />
              </div>
            </div>

            {/* Stat 4: Contacts messages */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-black/20 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">THƯ LIÊN HỆ GÓP Ý</span>
                <strong className="text-2xl font-black text-gray-900 font-mono tracking-tight block">
                  {messages.length} thư phản hồi
                </strong>
                <span className="text-[9px] text-gray-400 block font-mono">
                  Khách hàng gửi qua Contact form
                </span>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare size={20} />
              </div>
            </div>

          </div>

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

              {/* Status information banner */}
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl text-[11px] text-gray-500 font-sans leading-relaxed">
                <strong className="text-gray-800 block mb-1">Ghi chú về bảo trợ:</strong>
                Cơ sở đặt hàng được tối ưu mượt mà dưới môi trường Full-stack in-memory của máy chủ Express container.
              </div>
            </div>

            {/* System Log terminal stream */}
            <div className="lg:col-span-8 bg-slate-950 text-slate-100 rounded-3xl p-6 shadow-md overflow-hidden relative border border-slate-900 flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={120} className="text-indigo-400" />
              </div>

              <div className="relative z-10 w-full">
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">Dòng Tín Hiệu Hệ Thống (LumiOS Console)</span>
                  </div>
                  <button 
                    onClick={() => setLogs(['[LOG] Bàn phân tích khôi phục hoàn chỉnh.'])}
                    className="text-[9px] font-mono hover:text-white text-slate-500 transition-colors uppercase underline"
                  >
                    Dọn sạch log
                  </button>
                </div>

                <div className="space-y-2 mt-2 font-mono text-[11px] text-slate-300 leading-relaxed max-h-[200px] overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="flex gap-2.5">
                      <span className="text-indigo-400 shrink-0 select-none">❯</span>
                      <p className="break-all">{log}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[9px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-start gap-2 mt-4 relative z-10">
                <span>PHÂN PHỐI QUA container CẤP THỰC THI (PORT 3000)</span>
                <span>HỆ MÃ HÓA SHA-256 SẴN SÀNG CHO NHÀ SÁNG LẬP</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. CATALOGUE PRODUCTS MANAGER */}
      {activeSubTab === 'products' && (
        <div className="space-y-6 animate-fade-in font-sans">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm">
            <div>
              <h3 className="font-extrabold text-gray-950 text-sm uppercase">Quản lý dải sản phẩm quầy hàng</h3>
              <p className="text-xs text-gray-400 font-sans">The manager can add products or update existing parameters directly. Changes will reflect instantly on the front store!</p>
            </div>
            
            <button
              onClick={openCreateForm}
              className="px-5 py-3 bg-black hover:bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus size={15} />
              Đăng sản phẩm mới
            </button>
          </div>

          {/* Table list of active products */}
          <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 uppercase font-black text-[9px] tracking-wider">
                    <th className="px-6 py-4.5">Định danh Ảnh / Tên</th>
                    <th className="px-6 py-4.5">Phân loại</th>
                    <th className="px-6 py-4.5">Giá bán</th>
                    <th className="px-6 py-4.5 col-span-2">Đặc tả / Thông số tiêu biểu</th>
                    <th className="px-6 py-4.5 text-right w-36">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-gray-700">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 flex gap-3.5 items-center">
                        <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0">
                          <img src={p.image} alt={p.name} className="max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-extrabold text-gray-900 text-sm truncate">{p.name}</span>
                          <span className="font-mono text-[9px] text-gray-400 block truncate">{p.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-full text-[9px] tracking-wider uppercase font-bold">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <strong className="text-gray-950 font-black text-sm font-mono">
                          {p.price.toLocaleString('vi-VN')}₫
                        </strong>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <span className="block text-gray-450 line-clamp-2 leading-relaxed text-[11px] mb-1">{p.description}</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {p.specs.slice(0, 2).map((s, idx) => (
                            <span key={idx} className="bg-indigo-50/50 text-indigo-700 px-1.5 py-0.5 rounded text-[8px] font-mono">
                              {s.label}: {s.value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditForm(p)}
                            className="w-8 h-8 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 flex items-center justify-center transition-colors"
                            title="Sửa thông tin"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                            title="Xóa thiết bị"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDER LOGS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6 animate-fade-in font-sans">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm">
            <div>
              <h3 className="font-extrabold text-gray-950 text-sm uppercase">Theo dõi Sổ bưu kiện đặt hàng</h3>
              <p className="text-xs text-gray-400 font-sans">Thực hiện phê duyệt lộ trình đơn hàng thực tế lưu trữ tại máy phản hồi của Express server.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="w-10 h-10 bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center rounded-xl transition-all"
                title="Tải lại sổ"
              >
                <RotateCcw size={15} />
              </button>
              
              <button
                onClick={handleSeedOrders}
                className="px-5 py-2.5 bg-black hover:bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                Tạo 1 đơn ngẫu nhiên
              </button>
            </div>
          </div>

          {/* Sổ đặt hàng Table list */}
          {isLoadingOrders ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl">
              <div className="w-8 h-8 border-3 border-black/15 border-t-black rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500">Đang đồng bộ sổ đơn hàng máy chủ...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-3xl p-6">
              <AlertCircle size={36} className="text-gray-400 mx-auto mb-3 animate-bounce" />
              <p className="text-sm text-gray-800 font-extrabold">Sổ Đơn Hàng Đang Trống</p>
              <p className="text-xs text-gray-400 max-w-[320px] mx-auto mt-1 leading-relaxed">
                Chưa có đơn hàng nào được kích hoạt. Hãy dùng chức năng "Tạo đơn ngẫu nhiên" hoặc thêm giỏ hàng thanh toán bên cửa hàng.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord: any) => (
                <div key={ord.orderId} className="bg-white border border-gray-200 rounded-[1.8rem] overflow-hidden shadow-sm text-xs font-sans">
                  
                  {/* Row 1 Header */}
                  <div className="bg-gray-50/70 border-b border-gray-150/80 p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">MÃ ĐƠN HÀNG</span>
                        <strong className="block text-gray-950 font-mono text-sm font-extrabold">#{ord.orderId}</strong>
                      </div>
                      <div className="h-6 w-px bg-gray-250 hidden sm:block" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Khách hàng</span>
                        <strong className="block text-gray-900 font-bold">{ord.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">Thời gian</span>
                        <span className="text-gray-650 shrink-0 font-mono">{new Date(ord.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-indigo-600 font-black font-mono text-[15px]">{ord.finalTotal}</span>
                      <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-full ${
                        ord.status === 'Hoàn tất bàn giao' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 
                        ord.status === 'Đang giao hàng' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' : 
                        ord.status === 'Hủy bỏ' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* Row 2 Details */}
                  <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-gray-150 pb-4 lg:pb-0 lg:pr-6">
                      <h4 className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">Thông tin liên hệ nhận hàng</h4>
                      <div className="space-y-1.5 text-[11px] text-gray-600">
                        <p><strong className="text-gray-800">SĐT:</strong> {ord.phone}</p>
                        <p><strong className="text-gray-800">Email:</strong> {ord.email}</p>
                        <p className="flex items-start gap-1"><strong className="text-gray-800 shrink-0"><MapPin size={12} className="inline text-gray-400" /> Địa chỉ:</strong> <span className="break-words">{ord.address}</span></p>
                        {ord.notes && <p className="text-[10px] bg-amber-50 text-amber-700/90 p-2 rounded-lg mt-1 border border-amber-200/20 italic">" {ord.notes} "</p>}
                      </div>
                    </div>

                    {/* Bought Items list */}
                    <div className="lg:col-span-5 space-y-3">
                      <h4 className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">Danh mục thiết bị bưu kiện</h4>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto">
                        {ord.cart?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50/50 border border-gray-150 p-2.5 rounded-xl">
                            <div className="flex gap-2.5 items-center min-w-0">
                              <div className="w-8 h-8 rounded bg-white p-0.5 border border-gray-150 shrink-0 flex items-center justify-center">
                                <img src={item.product?.image} alt={item.product?.name} className="max-h-full object-contain mix-blend-multiply" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-extrabold text-gray-900 truncate text-[11px]">{item.product?.name}</h5>
                                <span className="text-[9px] text-gray-400 block font-mono">{item.product?.price?.toLocaleString('vi-VN')}₫</span>
                              </div>
                            </div>
                            <span className="font-mono font-bold bg-white border border-gray-200 px-2.5 py-1 rounded text-gray-850 shrink-0 ml-2">Số lượng: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Update Status Actions */}
                    <div className="lg:col-span-3 flex flex-col justify-center gap-2 bg-gray-50/30 p-4 rounded-2xl border border-gray-150">
                      <h4 className="text-[9px] uppercase font-bold text-gray-400 tracking-wider text-center">Hệ luyên phê duyệt chuyển trạng thái</h4>
                      
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.orderId, 'Đang lắp ráp chuẩn bị gửi', 'processing')}
                        className="w-full py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Clock size={11} /> Lắp ráp bưu phẩm
                      </button>

                      <button
                        onClick={() => handleUpdateOrderStatus(ord.orderId, 'Đang bàn giao bưu tá Express', 'shipping')}
                        className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200/40 text-blue-700 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Truck size={11} /> Giao bưu tá
                      </button>

                      <button
                        onClick={() => handleUpdateOrderStatus(ord.orderId, 'Hoàn tất bàn giao', 'success')}
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/40 text-emerald-700 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle size={11} /> Đóng dấu Hoàn tất
                      </button>

                      <button
                        onClick={() => handleUpdateOrderStatus(ord.orderId, 'Hủy bỏ', 'cancelled')}
                        className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <X size={11} /> Hủy bỏ đơn
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. CUSTOMER CONTACT MESSAGES */}
      {activeSubTab === 'messages' && (
        <div className="space-y-6 animate-fade-in font-sans">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm">
            <div>
              <h3 className="font-extrabold text-gray-950 text-sm uppercase">Hòm thư góp ý khách hàng</h3>
              <p className="text-xs text-gray-400 font-sans">Cập nhật và đọc những bình bách của khách hàng tương tác qua biểu mẫu liên hệ.</p>
            </div>
            
            <button
              onClick={fetchMessages}
              className="w-10 h-10 bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center rounded-xl transition-all"
              title="Tải lại thư"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {isLoadingMessages ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl">
              <div className="w-8 h-8 border-3 border-black/15 border-t-black rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500">Đang đồng bộ hòm thư...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl p-6">
              <MessageSquare size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-800 font-extrabold">Hòm thư đang trống</p>
              <p className="text-xs text-gray-400">Khách hàng chưa để lại bức thư bưu tín nào trong tuần.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((msg: any) => (
                <div key={msg.id} className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:border-black/15 transition-all flex flex-col justify-between h-[230px]">
                  <div>
                    <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-3 mb-3 text-xs">
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-gray-900 truncate">{msg.name}</h4>
                        <span className="font-mono text-[10px] text-gray-400 block truncate">{msg.email}</span>
                      </div>
                      <span className="text-[9px] font-mono text-gray-405 text-gray-400 shrink-0">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
                      </span>
                    </div>

                    <p className="font-bold text-gray-900 text-xs mb-1">Chủ đề: <strong className="text-indigo-600 font-extrabold uppercase text-[9.5px] tracking-wide">{msg.subject}</strong></p>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-4 font-sans italic">
                      " {msg.message} "
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <a 
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="text-[10px] font-black uppercase tracking-wider text-black hover:underline"
                    >
                      Kết nối hòm thư liên hệ ❯
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DYNAMIC FORM DRAWER: FOR ADDING / EDITING PRODUCTS */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-gray-200 p-8 md:p-10 max-w-2xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl font-sans text-xs">
            
            <button 
              onClick={() => { setIsFormOpen(false); setEditingProduct(null); }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-gray-500 hover:text-black transition-colors"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight mb-6">
              {editingProduct ? `Sửa thiết bị: ${editingProduct.name}` : 'Thêm thiết bị Lumina mới'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Tên thiết bị *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Ví dụ: Laptop Lumina Air S"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Giá bán niêm yết (VND) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                    placeholder="Ví dụ: 19500000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Phân loại thiết bị</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs font-semibold"
                  >
                    <option value="Điện thoại">Điện thoại</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Đồng hồ">Đồng hồ</option>
                    <option value="Âm thanh">Âm thanh</option>
                    <option value="Bàn phím">Bàn phím</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Đường dẫn ảnh sản phẩm (Image URL)</label>
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="Nhập link ảnh hoặc để mặc định"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Mô tả đặc tính cốt lõi</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Mô tả tóm tắt tính năng đột phá của dòng sản phẩm..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs"
                />
              </div>

              {/* Specs parameters sub table */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block pb-1 border-b border-gray-200">
                  Phân định bảng thông số kỹ thuật (4 Đặc tả)
                </span>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Nhãn 1</label>
                    <input type="text" value={specCpuLabel} onChange={(e) => setSpecCpuLabel(e.target.value)} className="w-[85%] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Giá trị 1</label>
                    <input type="text" value={specCpuVal} onChange={(e) => setSpecCpuVal(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]" />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Nhãn 2</label>
                    <input type="text" value={specScreenLabel} onChange={(e) => setSpecScreenLabel(e.target.value)} className="w-[85%] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Giá trị 2</label>
                    <input type="text" value={specScreenVal} onChange={(e) => setSpecScreenVal(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]" />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Nhãn 3</label>
                    <input type="text" value={specBatteryLabel} onChange={(e) => setSpecBatteryLabel(e.target.value)} className="w-[85%] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Giá trị 3</label>
                    <input type="text" value={specBatteryVal} onChange={(e) => setSpecBatteryVal(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]" />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Nhãn 4</label>
                    <input type="text" value={specExtraLabel} onChange={(e) => setSpecExtraLabel(e.target.value)} className="w-[85%] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Giá trị 4</label>
                    <input type="text" value={specExtraVal} onChange={(e) => setSpecExtraVal(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]" />
                  </div>
                </div>
              </div>

              {/* Submit panel */}
              <div className="flex gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditingProduct(null); }}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow active:scale-98"
                >
                  {editingProduct ? 'Cấu định thay đổi' : 'Đăng bán độc bản'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
