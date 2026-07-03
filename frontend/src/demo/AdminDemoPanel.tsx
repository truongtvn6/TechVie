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
      const formData = new FormData();
      formData.append('name', `Bàn phím cơ TechVie Pro ${Math.floor(Math.random() * 1000)}`);
      formData.append('price', '2450000');
      formData.append('category', 'Keyboard');
      formData.append('description', 'Bàn phím cơ chuyên nghiệp thiết kế công thái học và đèn LED RGB rực rỡ.');
      formData.append('image', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80');
      formData.append('specs', JSON.stringify([
        { label: "Switch", value: "Blue Clicky Switch" },
        { label: "Keycaps", value: "Double-shot PBT" }
      ]));

      const res = await createProduct(formData, token);
      if (res.success) {
        console.log("Sản phẩm mẫu đã được tạo thành công!");
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
