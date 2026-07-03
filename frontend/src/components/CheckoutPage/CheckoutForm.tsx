import React from 'react';
import { motion } from 'motion/react';
import { CartItem } from '../../types';
import { 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Gift, 
  Smartphone, 
  Info,
  CircleDot
} from 'lucide-react';

interface CheckoutFormProps {
  cart: CartItem[];
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  
  paymentMethod: 'bank' | 'cod' | 'momo' | 'zalopay';
  setPaymentMethod: (method: 'bank' | 'cod' | 'momo' | 'zalopay') => void;
  deliveryMethod: 'standard' | 'express';
  setDeliveryMethod: (method: 'standard' | 'express') => void;
  
  // Promo states
  promoCode: string;
  setPromoCode: (val: string) => void;
  appliedDiscount: number;
  promoError: string;
  promoSuccess: string;
  handleApplyPromo: (e: React.FormEvent) => void;
  
  // Calculations
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  finalTotal: number;
  
  apiError: string;
  onSubmit: (e: React.FormEvent) => void;
  onNavigate: (tab: any) => void;
}

export default function CheckoutForm({
  cart,
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  address,
  setAddress,
  notes,
  setNotes,
  paymentMethod,
  setPaymentMethod,
  deliveryMethod,
  setDeliveryMethod,
  promoCode,
  setPromoCode,
  appliedDiscount,
  promoError,
  promoSuccess,
  handleApplyPromo,
  subtotal,
  deliveryFee,
  discountAmount,
  finalTotal,
  apiError,
  onSubmit,
  onNavigate
}: CheckoutFormProps) {

  // Render sub-sections based on payment selection
  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'bank':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-4 text-xs font-sans text-gray-700"
          >
            <div className="flex items-start gap-3">
              <QrCode className="text-indigo-600 flex-shrink-0 animate-pulse" size={32} />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Mã QR Chuyển Khoản Ngân Hàng</h4>
                <p className="text-gray-550 leading-relaxed">
                  Quét mã MB Bank bên dưới và chuyển đúng số tiền. Đơn hàng sẽ ở trạng thái chờ thanh toán cho đến khi người bán đối soát tiền về.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around p-4 bg-white border border-indigo-100 rounded-xl gap-4">
              <div className="relative p-2 border border-gray-200 rounded-xl bg-white shadow-sm flex-shrink-0">
                <img
                  src="/src/assets/images/nganhang.jpg"
                  alt="QR chuyển khoản MB Bank"
                  className="w-[150px] h-[190px] object-cover rounded-lg"
                />
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-indigo-600 text-[8px] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  QUÉT QR
                </div>
              </div>

              <div className="space-y-2 text-left w-full md:w-auto">
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Ngân hàng:</span>
                  <span className="col-span-2 font-bold text-gray-900">MB Bank</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Số Tài Khoản:</span>
                  <span className="col-span-2 font-mono font-bold text-indigo-700">25350879130818</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Tên chủ TK:</span>
                  <span className="col-span-2 text-gray-900 font-bold">TRUONG THANH DANH</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Số tiền:</span>
                  <span className="col-span-2 text-emerald-600 font-black font-mono">{finalTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Nội dung CK:</span>
                  <span className="col-span-2 text-gray-900 font-mono font-bold bg-gray-100 p-1 rounded-sm text-center">
                    TECHVIE {phone || 'ORDER'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-indigo-505 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100/50">
              <Info size={14} />
              <span>Sau khi đặt hàng, hệ thống lưu đơn ở trạng thái chờ thanh toán. Người bán kiểm tra biến động tài khoản rồi xác nhận trong trang quản trị.</span>
            </div>
          </motion.div>
        );
      case 'momo':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-[#fff0f8] border border-[#ffd1eb] rounded-2xl space-y-4 text-xs font-sans text-gray-700"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#a50064] text-white flex items-center justify-center font-black text-[10px] shrink-0">
                MoMo
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">QR Thanh Toán MoMo</h4>
                <p className="text-gray-550 leading-relaxed">
                  Quét mã MoMo bên dưới để chuyển tiền. Trạng thái chỉ chuyển sang đã thanh toán sau khi người bán kiểm chứng giao dịch.
                </p>
              </div>
            </div>
            <div className="bg-white border border-[#ffd1eb] rounded-xl p-4 grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
              <img
                src="/src/assets/images/momo.jpg"
                alt="QR thanh toán MoMo"
                className="w-[150px] h-[190px] object-cover rounded-xl border border-pink-100 mx-auto"
              />
              <div className="space-y-2">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Ví điện tử</span>
                  <span className="font-black text-[#a50064]">MoMo</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Chủ ví</span>
                  <span className="font-bold text-gray-900">TRƯƠNG THÀNH DANH</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Số tiền</span>
                  <span className="font-mono font-black text-emerald-600">{finalTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Trạng thái</span>
                  <span className="font-bold text-amber-700">Chờ đối soát</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'zalopay':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-blue-50/80 border border-blue-100 rounded-2xl space-y-4 text-xs font-sans text-gray-700"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0068ff] text-white flex items-center justify-center font-black text-[10px] shrink-0">
                Zalo
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">QR Thanh Toán ZaloPay</h4>
                <p className="text-gray-550 leading-relaxed">
                  Quét mã ZaloPay để chuyển tiền. Đơn hàng được lưu ở MongoDB và chờ người bán xác nhận giao dịch thực tế.
                </p>
              </div>
            </div>
            <div className="bg-white border border-blue-100 rounded-xl p-4 grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
              <img
                src="/src/assets/images/zalopay.jpg"
                alt="QR thanh toán ZaloPay"
                className="w-[150px] h-[190px] object-cover rounded-xl border border-blue-100 mx-auto"
              />
              <div className="space-y-2">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Ví điện tử</span>
                  <span className="font-black text-[#0068ff]">ZaloPay</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Chủ ví</span>
                  <span className="font-bold text-gray-900">TRƯƠNG THÀNH DANH</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Số tiền</span>
                  <span className="font-mono font-black text-emerald-600">{finalTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Trạng thái</span>
                  <span className="font-bold text-amber-700">Chờ đối soát</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'cod':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-sans text-gray-600 flex items-start gap-2.5"
          >
            <Truck className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="leading-relaxed">
              Bạn sẽ thanh toán trực tiếp số tiền <strong className="text-black font-semibold">{finalTotal.toLocaleString('vi-VN')}₫</strong> bằng tiền mặt hoặc chuyển khoản với bưu tá khi nhận sản phẩm tại nhà. TechVie khuyên bạn nên đồng kiểm hàng nguyên seal trước khi đồng thuận nhận hàng.
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7 space-y-8">
        {/* Top Navigation / Breadcrumb */}
        <div className="flex items-center justify-between border-b border-gray-150 pb-4">
          <button 
            onClick={() => onNavigate('products')}
            className="flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Trở Lại
          </button>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-505 font-bold">
            BƯỚC QUYẾT TOÁN 1/2
          </span>
        </div>

        {/* Title Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
            THANH TOÁN THIẾT BỊ
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-2">
            Xác thực địa chỉ giao hàng và lựa chọn phương thức ủy nhiệm thanh toán.
          </p>
        </div>

        {/* Major Billing/Shipping Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Section 1: Customer info */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <span className="w-1.5 h-3.5 bg-black rounded-full" />
              <h3 className="text-xs uppercase tracking-widest font-black text-gray-800">
                I. Thông Tin Khách Hàng Giao Nhận
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-black focus:bg-white outline-none font-sans transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                  Số điện thoại liên lạc <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-black focus:bg-white outline-none font-sans transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                Địa chỉ nhận email (nhận hóa đơn điện tử) <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-black focus:bg-white outline-none font-sans transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea 
                required
                rows={3}
                placeholder="Số nhà, Tên tòa nhà/Ngõ, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh thành..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-black focus:bg-white outline-none font-sans transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                Ghi chú đặc biệt cho nhân viên bưu tá giao nhận (Tùy chọn)
              </label>
              <textarea 
                rows={2}
                placeholder="Ví dụ: Lưu ý bọc xốp dày chống sốc, chỉ giao vào giờ hành chính..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-black focus:bg-white outline-none font-sans transition-all"
              />
            </div>
          </div>

          {/* Section 2: Shipping speeds / Delivery method */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <span className="w-1.5 h-3.5 bg-black rounded-full" />
              <h3 className="text-xs uppercase tracking-widest font-black text-gray-800">
                II. Phương Thức Vận Chuyển TechVie
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Method 1: Standard */}
              <div 
                onClick={() => setDeliveryMethod('standard')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 font-sans ${
                  deliveryMethod === 'standard' 
                    ? 'border-black bg-black/[0.01] shadow-[0_0_12px_rgba(0,0,0,0.02)]' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="mt-1">
                  {deliveryMethod === 'standard' ? (
                    <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-full text-[10px]"><CircleDot size={10} /></div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                  )}
                </div>
                <div className="text-xs">
                  <div className="font-extrabold text-gray-900 flex justify-between items-center">
                    <span>Vận Chuyển Tiêu Chuẩn</span>
                    <span className="text-emerald-600 font-mono font-bold uppercase text-[10px]">Miễn phí</span>
                  </div>
                  <p className="text-gray-550 mt-1 leading-relaxed">
                    Nhận sau 2-4 ngày làm việc. Đóng gói bọc xốp và chống va đập toàn điện.
                  </p>
                </div>
              </div>

              {/* Method 2: Express */}
              <div 
                onClick={() => setDeliveryMethod('express')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 font-sans ${
                  deliveryMethod === 'express' 
                    ? 'border-black bg-black/[0.01] shadow-[0_0_12px_rgba(0,0,0,0.02)]' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="mt-1">
                  {deliveryMethod === 'express' ? (
                    <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-full text-[10px]"><CircleDot size={10} /></div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                  )}
                </div>
                <div className="text-xs">
                  <div className="font-extrabold text-gray-900 flex justify-between items-center gap-1">
                    <span>Ship Hoả Tốc Toàn Quốc</span>
                    <span className="text-gray-900 font-mono font-extrabold">120.000₫</span>
                  </div>
                  <p className="text-gray-555 mt-1 leading-relaxed">
                    Cam kết giao trong 24H. Vận chuyển siêu tốc đóng bọc chống va đập theo tiêu chuẩn cao cấp nghiêm ngặt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment method picker */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <span className="w-1.5 h-3.5 bg-black rounded-full" />
              <h3 className="text-xs uppercase tracking-widest font-black text-gray-800">
                III. Trực Quan Phương Thức Thanh Toán
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`py-3.5 px-3 rounded-xl border text-[10px] font-sans font-black uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === 'bank' 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-200 text-gray-650 hover:bg-gray-50'
                }`}
              >
                <QrCode size={16} />
                Chuyển Khoản
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('momo')}
                className={`py-3.5 px-3 rounded-xl border text-[10px] font-sans font-black uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === 'momo'
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-200 text-gray-650 hover:bg-gray-50'
                }`}
              >
                <Smartphone size={16} />
                MoMo
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('zalopay')}
                className={`py-3.5 px-3 rounded-xl border text-[10px] font-sans font-black uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === 'zalopay'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 text-gray-650 hover:bg-gray-50'
                }`}
              >
                <QrCode size={16} />
                ZaloPay
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-3.5 px-3 rounded-xl border text-[10px] font-sans font-black uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === 'cod' 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-200 text-gray-650 hover:bg-gray-50'
                }`}
              >
                <Smartphone size={16} />
                COD (Nhận thanh toán)
              </button>
            </div>

            {/* Dynamic Render Details for Payment Method */}
            <div className="mt-4">
              {renderPaymentFields()}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 space-y-3">
            {apiError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl text-xs font-semibold"
              >
                {apiError}
              </motion.div>
            )}
            <p className="text-[12px] text-gray-500 italic pb-2">
              * Khách hàng đảm bảo các thông tin cung cấp là đúng sự thật. TechVie không chịu trách nhiệm cho các sai sót phát sinh từ thông tin do khách hàng nhập.
            </p>
            <button 
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white py-5 rounded-xl text-xs uppercase tracking-widest font-black font-sans transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.99]"
            >
              Tạo đơn & chờ xác nhận thanh toán ({finalTotal.toLocaleString('vi-VN')}₫)
              <CheckCircle2 size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Right column: Sticky Checkout cart summaries */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Box: Order items check-up */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-5 sticky top-28 shadow-sm">
          <h3 className="text-xs uppercase tracking-[0.2em] font-black text-gray-400 border-b border-gray-100 pb-3 mb-4">
            ĐƠN ĐẶT HÀNG CỦA BẠN
          </h3>

          {/* Item checklist loop */}
          <div className="max-h-[300px] overflow-y-auto pr-2 divide-y divide-gray-100 space-y-4">
            {cart.map((item, idx) => (
              <div key={item.product.id} className={`flex gap-4 pt-3 ${idx === 0 ? 'pt-0' : ''}`}>
                <div className="w-14 h-14 bg-gray-50 rounded-lg p-1 flex-shrink-0 border border-gray-100 flex items-center justify-center">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-12 h-12 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow min-w-0 font-sans text-xs">
                  <h4 className="font-extrabold text-gray-900 truncate">{item.product.name}</h4>
                  <p className="text-gray-400 mt-0.5 uppercase tracking-widest text-[9px]">{item.product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-500 font-mono font-medium">Qty: {item.quantity}</span>
                    <span className="font-bold font-mono text-gray-900">
                      {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Input Field panel */}
          <form onSubmit={handleApplyPromo} className="pt-4 border-t border-gray-100 font-sans">
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Mã ưu đãi / Phiếu quà tặng</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="TECHVIE2026, VIPLAB..."
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white outline-none focus:border-black uppercase font-mono font-bold"
              />
              <button 
                type="submit"
                className="bg-white border border-black hover:bg-black hover:text-white px-4 rounded-lg font-sans text-[10px] uppercase tracking-wider font-extrabold transition-colors"
              >
                ÁP DỤNG
              </button>
            </div>
            {promoError && <p className="text-rose-500 text-[10px] font-medium mt-1">{promoError}</p>}
            {promoSuccess && <p className="text-emerald-600 text-[10px] font-extrabold mt-1">{promoSuccess}</p>}
          </form>

          {/* Financial tallies breakdown */}
          <div className="pt-5 border-t border-gray-100 space-y-3 font-sans text-xs text-gray-650">
            <div className="flex justify-between items-center">
              <span>Tổng phụ sản phẩm</span>
              <span className="font-mono font-semibold text-gray-900">{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            
            {appliedDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-600">
                <span className="flex items-center gap-1"><Gift size={12} /> Ưu đãi giảm giá </span>
                <span className="font-mono font-bold">-{discountAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span>Đóng gói & Chuyên chở quang học</span>
              <span className="font-mono text-gray-900">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-extrabold uppercase text-[10px]">Miễn Phí</span>
                ) : (
                  `${deliveryFee.toLocaleString('vi-VN')}₫`
                )}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-4 border-t border-gray-150">
              <span className="text-sm font-bold text-gray-800">Cần thanh toán</span>
              <span className="text-2xl font-black font-mono text-black">
                {finalTotal.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          {/* Protection badges */}
          <div className="p-4 bg-gray-55/80 border border-gray-100 rounded-2xl flex items-start gap-3 text-gray-500 font-sans text-[10px] leading-relaxed">
            <ShieldCheck size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-gray-800">Cam Kết TechVie Guard</h5>
              <p>
                Mọi sản phẩm thiết bị điện tử chính hãng mua trực tiếp tại website của TechVie được hưởng chế độ bảo hành vàng 1 đổi 1 trong 12 tháng bứt phá, hỗ trợ kỹ thuật và cài đặt cấu hình hoàn toàn miễn phí.
              </p>
            </div>
          </div>

          {/* Coupon helper for the user to try out! */}
          <div className="flex items-center gap-2 border border-indigo-100 bg-indigo-50/50 p-2.5 rounded-lg text-indigo-700 font-sans text-[10px]">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>Mẹo: Hãy nhập mã <strong className="font-extrabold font-mono text-indigo-900 shadow-none">TECHVIE2026</strong> hoặc <strong className="font-extrabold font-mono text-indigo-900 shadow-none">VIPLAB</strong> để nhận chiết khấu!</span>
          </div>
        </div>

      </div>
    </div>
  );
}
