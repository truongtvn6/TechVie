import React, { useState, useRef, useEffect } from 'react';
import { Key, ChevronRight, RefreshCw, Layers, ShoppingBag, Trash2 } from 'lucide-react';
import { createProduct, clearAllOrdersFromServer, API_BASE_URL } from '../services/api';

interface AdminDemoPanelProps {
  token: string;
  onSwitchAccount: (email: string) => void;
  onRefreshProducts: () => void;
  onRefreshOrders: () => void;
}

export default function AdminDemoPanel({
  token,
  onSwitchAccount,
  onRefreshProducts,
  onRefreshOrders,
}: AdminDemoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isClearingOrders, setIsClearingOrders] = useState(false);

  const handleClearOrders = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa sạch toàn bộ lịch sử đơn hàng trên hệ thống?")) return;
    setIsClearingOrders(true);
    try {
      const res = await clearAllOrdersFromServer();
      if (res.success) {
        console.log("Đã xóa sạch tất cả đơn hàng thành công!");
        onRefreshOrders();
      } else {
        console.log("Xóa đơn hàng thất bại: " + res.message);
      }
    } catch (err) {
      console.error(err);
      console.log("Lỗi kết nối khi dọn sạch đơn hàng!");
    } finally {
      setIsClearingOrders(false);
    }
  };

  const handleCreateMockOrder = async () => {
    setIsCreatingOrder(true);
    try {
      const mockOrderPayload = {
        fullName: "ĐỘ XUM XUÊ (Khách Demo)",
        phone: "0987654321",
        email: "mintzinfinity898@gmail.com",
        address: "180 Cao Lỗ, Quận 8, TP.HCM",
        notes: "Đơn hàng thử nghiệm tạo nhanh từ Admin Panel",
        paymentMethod: "cod",
        deliveryMethod: "standard",
        cart: [
          {
            product: {
              id: "keyboard-custom-demo",
              name: "Bàn phím cơ Custom TechVie premium edition",
              price: 3500000,
              image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
              category: "Keyboard",
              description: "Bàn phím custom chất lượng hi-end gõ cực kỳ êm ái.",
              specs: [
                { label: "Switches", value: "Linear Gateron Oil King" },
                { label: "Layout", value: "75% compact" }
              ]
            },
            quantity: 1
          }
        ],
        finalTotal: "3500000"
      };

      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockOrderPayload)
      });
      
      const data = await response.json();
      if (data.success) {
        console.log("Đơn hàng thử nghiệm đã được tạo thành công cho mintzinfinity898@gmail.com!");
        onRefreshOrders();
      } else {
        console.log("Tạo đơn hàng thất bại: " + (data.message || "Lỗi chưa rõ"));
      }
    } catch (err) {
      console.error(err);
      console.log("Lỗi kết nối khi tạo đơn hàng thử nghiệm!");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCreateMockProduct = async () => {
    setIsCreatingProduct(true);
    try {
      const MOCK_PRODUCTS_POOL = [
        {
          name: "iPhone 16 Pro Max Titanium",
          price: "34990000",
          category: "Điện thoại",
          description: "Điện thoại cao cấp nhất từ Apple với khung titan siêu bền, chip A18 Pro mạnh mẽ và cụm camera zoom quang học 5x sắc nét.",
          image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
          specs: [
            { label: "Màn hình", value: "6.9 inch Super Retina XDR OLED, 120Hz" },
            { label: "Vi xử lý", value: "Apple A18 Pro (3nm)" },
            { label: "Bộ nhớ trong", value: "256GB / 512GB / 1TB" }
          ]
        },
        {
          name: "Samsung Galaxy S25 Ultra",
          price: "31990000",
          category: "Điện thoại",
          description: "Siêu phẩm cao cấp của Samsung tích hợp bút S Pen, màn hình độ sáng cao chống chói mắt và cụm camera AI 200MP.",
          image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
          specs: [
            { label: "Màn hình", value: "6.8 inch Dynamic AMOLED 2X, QHD+" },
            { label: "Vi xử lý", value: "Snapdragon 8 Gen 4 for Galaxy" },
            { label: "Camera chính", value: "200MP + 50MP + 12MP + 10MP" }
          ]
        },
        {
          name: "MacBook Pro M4 Max Space Black",
          price: "79990000",
          category: "Laptop",
          description: "Laptop chuyên nghiệp cho thiết kế đồ họa và lập trình với sức mạnh đỉnh cao từ vi xử lý M4 Max thế hệ mới nhất.",
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
          specs: [
            { label: "CPU / GPU", value: "Apple M4 Max (16-core CPU, 40-core GPU)" },
            { label: "Bộ nhớ RAM", value: "36GB Unified Memory" },
            { label: "Màn hình", value: "16.2 inch Liquid Retina XDR, ProMotion 120Hz" }
          ]
        },
        {
          name: "ASUS ROG Zephyrus G16 OLED",
          price: "64990000",
          category: "Laptop",
          description: "Laptop gaming kiêm đồ họa mỏng nhẹ đẳng cấp, trang bị màn hình OLED tuyệt sắc cùng card đồ họa NVIDIA RTX 4080 cực mạnh.",
          image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
          specs: [
            { label: "Bộ xử lý", value: "Intel Core Ultra 9 185H" },
            { label: "Card đồ họa", value: "NVIDIA GeForce RTX 4080 12GB" },
            { label: "Màn hình", value: "16 inch ROG Nebula OLED 2.5K, 240Hz" }
          ]
        },
        {
          name: "Apple Watch Ultra 2 Titanium",
          price: "21990000",
          category: "Đồng hồ",
          description: "Đồng hồ thể thao chuyên nghiệp với thiết kế hầm hố từ chất liệu titan hàng không, thời lượng pin tối ưu và GPS tần số kép siêu chính xác.",
          image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
          specs: [
            { label: "Chất liệu vỏ", value: "Titanium hàng không cấp độ 5" },
            { label: "Độ sáng màn hình", value: "Tối đa 3000 nits" },
            { label: "Chống nước", value: "WR100 (độ sâu lên đến 100m)" }
          ]
        },
        {
          name: "Sony WH-1000XM5 Wireless",
          price: "8490000",
          category: "Âm thanh",
          description: "Tai nghe chụp tai chống ồn chủ động đỉnh cao số 1 thế giới với chất âm Hi-Res Audio chân thực và thời lượng pin sử dụng lên đến 30 giờ liên tục.",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
          specs: [
            { label: "Driver", value: "30mm đặc chế" },
            { label: "Chống ồn", value: "Dual Processor V1 & HD Noise Cancelling QN1" },
            { label: "Kết nối", value: "Bluetooth 5.2, hỗ trợ LDAC" }
          ]
        },
        {
          name: "Bàn phím cơ Keychron Q1 Pro",
          price: "4650000",
          category: "Bàn phím",
          description: "Bàn phím cơ Custom cao cấp vỏ nhôm CNC nguyên khối, thiết kế double-gasket giảm chấn và hỗ trợ kết nối Bluetooth / Type-C đa thiết bị.",
          image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
          specs: [
            { label: "Layout", value: "75% compact" },
            { label: "Switch", value: "Keychron K Pro Red / Brown (Pre-lubed)" },
            { label: "Chất liệu vỏ", value: "Nhôm CNC toàn phần" }
          ]
        }
      ];

      const randomProduct = MOCK_PRODUCTS_POOL[Math.floor(Math.random() * MOCK_PRODUCTS_POOL.length)];
      
      const formData = new FormData();
      formData.append('name', `${randomProduct.name} #${Math.floor(Math.random() * 1000)}`);
      formData.append('price', randomProduct.price);
      formData.append('category', randomProduct.category);
      formData.append('description', randomProduct.description);
      formData.append('image', randomProduct.image);
      formData.append('specs', JSON.stringify(randomProduct.specs));

      const res = await createProduct(formData, token);
      if (res.success) {
        console.log(`Sản phẩm mẫu (${randomProduct.name}) đã được tạo thành công!`);
        onRefreshProducts();
      } else {
        console.log("Tạo sản phẩm thất bại: " + res.message);
      }
    } catch (err) {
      console.error(err);
      console.log("Lỗi kết nối khi tạo sản phẩm mẫu!");
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleSwitchToClient = async () => {
    setIsSwitching(true);
    onSwitchAccount("mintzinfinity898@gmail.com");
  };

  return (
    <div
      ref={panelRef}
      className={`fixed right-0 top-[25%] z-[9999] flex items-center transition-transform duration-500 ease-out select-none ${
        isOpen
          ? "translate-x-0"
          : "translate-x-[calc(100%-24px)] md:translate-x-[calc(100%-28px)]"
      }`}
    >
      {/* Tab Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-7.5 h-14 bg-black/70 hover:bg-black/90 text-white/80 hover:text-white border-y border-l border-white/10 rounded-l-xl flex items-center justify-center shadow-lg cursor-pointer transition-colors backdrop-blur-md"
        title={isOpen ? "Thu gọn bảng demo" : "Mở rộng bảng demo"}
      >
        {isOpen ? (
          <ChevronRight size={16} />
        ) : (
          <Key size={14} className="animate-pulse text-indigo-400" />
        )}
      </button>

      {/* Main Glass Panel */}
      <div className="w-[240px] p-4 bg-black/70 backdrop-blur-2xl border border-white/10 rounded-l-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col gap-4 text-white relative">
        <div className="absolute inset-0 rounded-l-2xl border border-white/5 pointer-events-none" />

        <div className="text-center pb-2 border-b border-white/10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-0.5 font-jakarta">
            BẢNG THỬ NGHIỆM ĐỒNG BỘ
          </span>
          <span className="text-[11px] text-indigo-300 font-bold block font-jakarta">
            ADMIN DEMO CONTROL
          </span>
        </div>

        {/* Action 1: Create Mock Order */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/50 block font-jakarta">
            Dữ liệu Đơn hàng
          </span>
          <button
            type="button"
            onClick={handleCreateMockOrder}
            disabled={isCreatingOrder}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600/35 hover:bg-indigo-600/50 disabled:bg-gray-700/50 text-indigo-100 border border-indigo-500/20 py-2.5 rounded-xl text-[10.5px] font-bold tracking-wider transition-all active:scale-95 cursor-pointer font-jakarta"
          >
            {isCreatingOrder ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <ShoppingBag size={12} />
            )}
            TẠO ĐƠN HÀNG MẪU (KHÁCH)
          </button>
          
          <button
            type="button"
            onClick={handleClearOrders}
            disabled={isClearingOrders}
            className="w-full flex items-center justify-center gap-2 bg-rose-600/30 hover:bg-rose-600/45 disabled:bg-gray-700/50 text-rose-200 border border-rose-500/20 py-2.5 rounded-xl text-[10.5px] font-bold tracking-wider transition-all active:scale-95 cursor-pointer font-jakarta mt-1.5"
          >
            {isClearingOrders ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            XÓA SẠCH ĐƠN HÀNG
          </button>
        </div>

        {/* Action 2: Create Mock Product */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/50 block font-jakarta">
            Dữ liệu Kho hàng
          </span>
          <button
            type="button"
            onClick={handleCreateMockProduct}
            disabled={isCreatingProduct}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600/30 hover:bg-emerald-600/45 disabled:bg-gray-700/50 text-emerald-200 border border-emerald-500/20 py-2.5 rounded-xl text-[10.5px] font-bold tracking-wider transition-all active:scale-95 cursor-pointer font-jakarta"
          >
            {isCreatingProduct ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Layers size={12} />
            )}
            TẠO SẢN PHẨM MẪU
          </button>
        </div>

        {/* Action 3: Switch Account */}
        <div className="space-y-1 pt-1 border-t border-white/10">
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/50 block font-jakarta">
            Thay Đổi Phân Quyền
          </span>
          <button
            type="button"
            onClick={handleSwitchToClient}
            disabled={isSwitching}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 disabled:bg-gray-700/50 text-white border border-white/10 py-2.5 rounded-xl text-[10.5px] font-bold tracking-wider transition-all active:scale-95 cursor-pointer font-jakarta"
          >
            {isSwitching ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Key size={12} />
            )}
            VỀ TÀI KHOẢN KHÁCH
          </button>
        </div>
      </div>

    </div>
  );
}
