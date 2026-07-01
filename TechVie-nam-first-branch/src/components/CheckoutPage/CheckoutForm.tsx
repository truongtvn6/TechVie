import React from 'react';
import { motion } from 'motion/react';
import { CartItem } from '../../types';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Building, 
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
  
  paymentMethod: 'bank' | 'card' | 'cod';
  setPaymentMethod: (method: 'bank' | 'card' | 'cod') => void;
  deliveryMethod: 'standard' | 'express';
  setDeliveryMethod: (method: 'standard' | 'express') => void;
  
  // Card states
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardHolder: string;
  setCardHolder: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
  cardCvv: string;
  setCardCvv: (val: string) => void;
  
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
  cardNumber,
  setCardNumber,
  cardHolder,
  setCardHolder,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
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
                <h4 className="font-bold text-gray-900 mb-1">Mã QR Thanh Toán Tự Động</h4>
                <p className="text-gray-550 leading-relaxed">
                  Hệ thống tự động liên kết với ngân hàng nhận ủy thác. Vui lòng quét mã bên dưới hoặc chuyển khoản theo thông tin.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around p-4 bg-white border border-indigo-100 rounded-xl gap-4">
              <div className="relative p-2 border border-gray-200 rounded-xl bg-white shadow-sm flex-shrink-0">
                {/* Visual mock QR code matching premium standards */}
                <div className="grid grid-cols-4 gap-0.5 w-[110px] h-[110px] bg-black p-1 rounded-sm relative">
                  <div className="absolute inset-0 bg-white m-1.5 flex flex-col justify-between p-1">
                    <div className="flex justify-between">
                      <span className="w-5 h-5 bg-black rounded-[2px]" />
                      <span className="w-5 h-5 bg-black rounded-[2px]" />
                    </div>
                    <div className="flex justify-center items-center">
                      <span className="w-3 h-3 bg-indigo-600 rounded-full" />
                    </div>
                    <div className="flex justify-between">
                      <span className="w-5 h-5 bg-black rounded-[2px]" />
                      <span className="w-2 h-2 bg-indigo-900 rounded-xs" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-indigo-600 text-[8px] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  QUÉT QR
                </div>
              </div>

              <div className="space-y-2 text-left w-full md:w-auto">
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Ngân hàng:</span>
                  <span className="col-span-2 font-bold text-gray-900">Techcombank (TCB)</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Số Tài Khoản:</span>
                  <span className="col-span-2 font-mono font-bold text-indigo-700">1903 8888 9999 68</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Tên chủ TK:</span>
                  <span className="col-span-2 text-gray-900 font-bold">CÔNG TY TECHVIE VIETNAM</span>
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
              <span>Thanh toán sẽ được phê chuẩn ngay sau 1-2 phút thông qua cổng quét quang học tự động.</span>
            </div>
          </motion.div>
        );
      case 'card':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4"
          >
            {/* Visual credit card mockup */}
            <div className="w-full max-w-[320px] mx-auto h-[180px] bg-gradient-to-tr from-slate-900 to-indigo-955 rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl -mr-10 -mt-10" />
              <div className="flex justify-between items-start">
                <span className="font-extrabold tracking-widest text-[11px] text-indigo-400">TECHVIE PREMIUM CARD</span>
                <Building size={20} className="text-indigo-300" />
              </div>
              <div className="mt-4">
                <p className="font-mono text-base tracking-widest text-indigo-100">
                  {cardNumber || '•••• •••• •••• ••••'}
                </p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <p className="text-[7px] uppercase font-bold tracking-wider text-indigo-400 font-sans">CHỦ THẺ</p>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider h-4">
                    {cardHolder || 'NGUYEN VAN A'}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[7px] uppercase font-bold tracking-wider text-indigo-400 font-sans">HẠN DÙNG</p>
                    <p className="font-mono text-xs font-bold h-4">{cardExpiry || 'MM/YY'}</p>
                  </div>
                  <div>
                    <p className="text-[7px] uppercase font-bold tracking-wider text-indigo-400 font-sans">CVV</p>
                    <p className="font-mono text-xs font-bold h-4">{cardCvv ? '•••' : '000'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-1">Số thẻ tín dụng</label>
                <input 
                  type="text" 
                  maxLength={19}
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setCardNumber(val);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-455 tracking-wider mb-1">Tên trên thẻ</label>
                <input 
                  type="text" 
                  placeholder="NGUYEN VAN A"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-black uppercase text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-1">Hạn sử dụng</label>
                  <input 
                    type="text" 
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\//g, '');
                      if (val.length > 2) {
                        val = val.substring(0, 2) + '/' + val.substring(2);
                      }
                      setCardExpiry(val);
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-black text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-1">Mã bảo mật CVV</label>
                  <input 
                    type="password" 
                    maxLength={3}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-black text-center"
                  />
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

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`py-3.5 px-3 rounded-xl border text-[11px] font-sans font-black uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
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
                onClick={() => setPaymentMethod('card')}
                className={`py-3.5 px-3 rounded-xl border text-[11px] font-sans font-black uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === 'card' 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-200 text-gray-650 hover:bg-gray-50'
                }`}
              >
                <CreditCard size={16} />
                Thẻ Visa/MC
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-3.5 px-3 rounded-xl border text-[11px] font-sans font-black uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
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
            <button 
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white py-5 rounded-xl text-xs uppercase tracking-widest font-black font-sans transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.99]"
            >
              Xác nhận kết nối đặt hàng ({finalTotal.toLocaleString('vi-VN')}₫)
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
