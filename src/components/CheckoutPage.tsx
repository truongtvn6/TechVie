import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { submitCheckoutOrder } from '../services/api';
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

interface CheckoutPageProps {
  cart: CartItem[];
  onQuantityChange: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (tab: any) => void;
}

type PaymentMethodType = 'bank' | 'card' | 'cod';
type DeliveryMethodType = 'standard' | 'express';

export default function CheckoutPage({
  cart,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
  onNavigate
}: CheckoutPageProps) {
  // Steps: 'form' | 'processing' | 'success'
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bank');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType>('standard');
  const [serverOrderId, setServerOrderId] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string>('');
  
  // Checkout Input States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Card data
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'express' ? 120000 : 0;
  const discountAmount = subtotal * appliedDiscount;
  const finalTotal = subtotal + deliveryFee - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    // Đọc mã giảm giá động từ localStorage để đồng bộ với trang Admin
    let localPromos = [];
    try {
      const saved = localStorage.getItem('lumina_promos');
      if (saved) {
        localPromos = JSON.parse(saved);
      }
    } catch (err) {
      console.error(err);
    }

    // Nếu localStorage trống, sử dụng các giá trị mặc định làm phương án dự phòng
    if (!Array.isArray(localPromos) || localPromos.length === 0) {
      localPromos = [
        { code: 'LUMINA2026', discount: 0.1, description: 'Giảm giá ra mắt sản phẩm 10%', isActive: true },
        { code: 'FUTURE', discount: 0.1, description: 'Đặc quyền tương lai 10%', isActive: true },
        { code: 'VIPLAB', discount: 0.25, description: 'Siêu đặc quyền từ Lumina Lab 25%', isActive: true, minOrderVal: 30000000 }
      ];
    }

    const foundPromo = localPromos.find((p: any) => p.code.toUpperCase() === code);

    if (foundPromo) {
      if (!foundPromo.isActive) {
        setPromoError('Mã ưu đãi này hiện đã tạm dừng hoạt động.');
        return;
      }
      if (foundPromo.minOrderVal && subtotal < foundPromo.minOrderVal) {
        setPromoError(`Mã giảm giá này yêu cầu đơn hàng tối thiểu từ ${foundPromo.minOrderVal.toLocaleString('vi-VN')}₫`);
        return;
      }
      setAppliedDiscount(foundPromo.discount);
      setPromoSuccess(`Áp dụng thành công: ${foundPromo.description || `Giảm ${(foundPromo.discount * 100).toFixed(0)}%`}`);
    } else {
      setPromoError('Mã ưu đãi không chính xác hoặc đã hết hạn.');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setStep('processing');
    setApiError('');
    
    try {
      const data = await submitCheckoutOrder({
        fullName,
        phone,
        email,
        address,
        notes,
        paymentMethod,
        deliveryMethod,
        cart,
        finalTotal: finalTotal.toString()
      });

      // Trì hoãn xử lý màn hình 1.5 giây để hiệu ứng load động mượt mà, chân thực
      setTimeout(() => {
        if (data.success && data.orderId) {
          setServerOrderId(data.orderId);
          setStep('success');
        } else {
          setApiError(data.message || 'Lỗi hệ thống khi khởi tạo bưu kiện đơn hàng.');
          setStep('form');
        }
      }, 1500);

    } catch (err: any) {
      setTimeout(() => {
        setApiError('Không thể kết nối đến máy chủ trực tuyến. Vui lòng kiểm tra lại đường truyền mạng.');
        setStep('form');
      }, 1500);
    }
  };

  const handleFinishSuccess = () => {
    onClearCart();
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                <p className="text-gray-500 leading-relaxed">
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
                  <span className="col-span-2 text-gray-900 font-bold">CÔNG TY LUMINA VIETNAM</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Số tiền:</span>
                  <span className="col-span-2 text-emerald-600 font-black font-mono">{finalTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Nội dung CK:</span>
                  <span className="col-span-2 text-gray-900 font-mono font-bold bg-gray-100 p-1 rounded-sm text-center">
                    LUMINA {phone || 'ORDER'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-indigo-500 bg-indigo-50 p-2.5 rounded-lg">
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
            <div className="w-full max-w-[320px] mx-auto h-[180px] bg-gradient-to-tr from-slate-900 to-indigo-950 rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl -mr-10 -mt-10" />
              <div className="flex justify-between items-start">
                <span className="font-extrabold tracking-widest text-[11px] text-indigo-400">LUMINA PREMIUM CARD</span>
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
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Số thẻ tín dụng</label>
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
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Tên trên thẻ</label>
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
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Hạn sử dụng</label>
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
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Mã bảo mật CVV</label>
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
              Bạn sẽ thanh toán trực tiếp số tiền <strong className="text-black font-semibold">{finalTotal.toLocaleString('vi-VN')}₫</strong> bằng tiền mặt hoặc chuyển khoản với bưu tá khi nhận sản phẩm tại nhà. Lumina khuyên bạn nên đồng kiểm hàng nguyên seal trước khi đồng thuận nhận hàng.
            </p>
          </motion.div>
        );
    }
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
            <Gift size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Giỏ hàng của bạn đang trống</h2>
          <p className="text-sm text-gray-500 font-sans leading-relaxed max-w-md mx-auto">
            Bạn chưa chọn mẫu laptop, điện thoại hay phụ kiện Lumina nào vào giỏ. Hãy tham khảo và mua sắm sản phẩm trước.
          </p>
          <button 
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black px-8 py-4 rounded-xl transition-all shadow-md active:scale-95"
          >
            Quay lại sảnh sản phẩm
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: FILL FORM & DETAILS */}
        {step === 'form' && (
          <motion.div 
            key="checkout-step-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          >
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
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                
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
                      II. Phương Thức Vận Chuyển Lumina
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
                        <p className="text-gray-500 mt-1 leading-relaxed">
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
                        <p className="text-gray-500 mt-1 leading-relaxed">
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
                      placeholder="LUMINA2026, VIPLAB..."
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
                <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl flex items-start gap-3 text-gray-500 font-sans text-[10px] leading-relaxed">
                  <ShieldCheck size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-800">Cam Kết Lumina Guard</h5>
                    <p>
                      Mọi sản phẩm thiết bị điện tử chính hãng mua trực tiếp tại website của Lumina được hưởng chế độ bảo hành vàng 1 đổi 1 trong 12 tháng bứt phá, hỗ trợ kỹ thuật và cài đặt cấu hình hoàn toàn miễn phí.
                    </p>
                  </div>
                </div>

                {/* Coupon helper for the user to try out! */}
                <div className="flex items-center gap-2 border border-indigo-100 bg-indigo-50/50 p-2.5 rounded-lg text-indigo-700 font-sans text-[10px]">
                  <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                  <span>Mẹo: Hãy nhập mã <strong className="font-extrabold font-mono text-indigo-900 shadow-none">LUMINA2026</strong> hoặc <strong className="font-extrabold font-mono text-indigo-900 shadow-none">VIPLAB</strong> để nhận chiết khấu!</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* STEP 2: NETWORK PROCESSING CONNECTIVITY SIMULATION */}
        {step === 'processing' && (
          <motion.div 
            key="checkout-step-processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto py-16 text-center space-y-6"
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              {/* Outer spinning ring representing mechanical frame setup */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-600/20 animate-spin" style={{ animationDuration: '8s' }} />
              {/* Inner fast spinning ring */}
              <div className="absolute inset-2 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              {/* Center icon */}
              <div className="absolute inset-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Sparkles size={20} className="text-indigo-600 animate-pulse" />
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
              ĐANG HIỆU CHUẨN KẾT NỐI ĐẶT HÀNG
            </h2>
            <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-sm mx-auto">
              Hệ thống xử lý trung tâm đang liên kết với cổng thanh toán và chuẩn bị đóng gói thiết bị bàn giao... Vui lòng không đóng tab này.
            </p>

            <div className="w-[180px] h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-indigo-600 rounded-full animate-pulse w-3/4" />
            </div>

            <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 animate-bounce">
              LUMINA SECURE SEC TRANSACTIONS RUNNING...
            </p>
          </motion.div>
        )}

        {/* STEP 3: ORDER ORDER SUCCESS & RECEIPT SUMMARY PAGE */}
        {step === 'success' && (
          <motion.div 
            key="checkout-step-success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto py-8 text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={40} className="animate-bounce" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
                XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG!
              </h1>
              <p className="text-xs text-gray-505 font-sans leading-relaxed max-w-md mx-auto">
                Yêu cầu đặt mua sản phẩm của bạn đã lưu trữ thành công vào cổng dữ liệu hành trình Lumina. Mã vận đơn cùng chính sách bảo hành điện tử sẽ được chuyển giao thẳng tới email của bạn: <strong className="text-black font-semibold shadow-none">{email || 'khachhang@lumina.com'}</strong>.
              </p>
            </div>

            {/* Printout physical-style ticket receipt */}
            <div className="bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 text-left shadow-lg relative overflow-hidden font-sans text-xs">
              {/* Ticket tooth cut decor layout */}
              <div className="absolute top-0 inset-x-0 h-1 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:14px_8px]" />

              <div className="flex justify-between items-start border-b border-gray-150 pb-5">
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">LUMINA CORP. RECEIPT</h4>
                  <p className="text-[9px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">ORDER #{serverOrderId || Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
                <div className="text-right">
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                    ĐÃ CHUẨN Y
                  </span>
                </div>
              </div>

              <div className="py-6 space-y-4 font-sans">
                {/* Customer summary */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block mb-1">Khách Hàng</span>
                    <strong className="text-gray-900 font-extrabold">{fullName || 'Nguyễn Văn A'}</strong>
                    <p className="text-gray-550 text-[11px] mt-0.5">{phone || '0912345678'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block mb-1">Địa Chỉ Nhận</span>
                    <p className="text-gray-900 font-semibold leading-normal truncate" title={address}>
                      {address || 'Quận 1, TP. Hồ Chí Minh'}
                    </p>
                    <p className="text-gray-400 text-[10px] mt-0.5">Giao hàng qua: {deliveryMethod === 'express' ? 'Hoả Tốc 24H' : 'Tiêu chuẩn'}</p>
                  </div>
                </div>

                {/* Items breakdown summary */}
                <div className="border-t border-b border-gray-100 py-4 space-y-3">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Danh sách sản phẩm</span>
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs">
                      <div className="min-w-0 flex-grow">
                        <span className="text-gray-900 font-bold">{item.product.name}</span>
                        <span className="text-gray-400 font-medium font-mono text-[10px] ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-gray-900">
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ))}
                </div>

                {/* Final receipt sums */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Tổng phụ</span>
                    <span className="font-mono">{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Mã giảm giá</span>
                      <span className="font-mono">-{discountAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 font-sans">
                    <span>Đóng gói & Vận chuyển Express</span>
                    <span className="font-mono">{deliveryFee === 0 ? 'Miễn phí' : `${deliveryFee.toLocaleString('vi-VN')}₫`}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-gray-150 font-sans text-sm font-black text-gray-900">
                    <span>TỔNG KHẤU TRỪ</span>
                    <span className="text-xl font-mono text-indigo-700 font-black">
                      {finalTotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="border-t border-gray-100 pt-5 flex flex-col items-center justify-center gap-2">
                <div className="h-10 w-full max-w-[280px] bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_6px)] opacity-85" />
                <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-gray-400">
                  *LUMINA-SECURE-HARDWARE-REGISTRATION-VERIFIED*
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleFinishSuccess}
                className="bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black px-10 py-5 rounded-xl transition-all shadow-md active:scale-95"
              >
                Hoàn tất & Quay về trang chủ
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
