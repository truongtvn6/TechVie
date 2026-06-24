import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../../types';
import { submitCheckoutOrder } from '../../services/api';
import { Gift, Info } from 'lucide-react';

import CheckoutForm from './CheckoutForm';
import CheckoutProcessing from './CheckoutProcessing';
import CheckoutSuccess from './CheckoutSuccess';

interface CheckoutPageProps {
  cart: CartItem[];
  onQuantityChange: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (tab: any) => void;
  isLoggedIn?: boolean;
}

type PaymentMethodType = 'bank' | 'card' | 'cod';
type DeliveryMethodType = 'standard' | 'express';

export default function CheckoutPage({
  cart,
  onClearCart,
  onNavigate,
  isLoggedIn = false
}: CheckoutPageProps) {
  const [showGuestNotice, setShowGuestNotice] = useState(!isLoggedIn);
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
      const saved = localStorage.getItem('techvie_promos');
      if (saved) {
        localPromos = JSON.parse(saved);
      }
    } catch (err) {
      console.error(err);
    }

    // Nếu localStorage trống, sử dụng các giá trị mặc định làm phương án dự phòng
    if (!Array.isArray(localPromos) || localPromos.length === 0) {
      localPromos = [
        { code: 'TECHVIE2026', discount: 0.1, description: 'Giảm giá ra mắt sản phẩm 10%', isActive: true },
        { code: 'FUTURE', discount: 0.1, description: 'Đặc quyền tương lai 10%', isActive: true },
        { code: 'VIPLAB', discount: 0.25, description: 'Siêu đặc quyền từ TechVie Lab 25%', isActive: true, minOrderVal: 30000000 }
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
            Bạn chưa chọn mẫu laptop, điện thoại hay phụ kiện TechVie nào vào giỏ. Hãy tham khảo và mua sắm sản phẩm trước.
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
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 relative">
      <AnimatePresence>
        {showGuestNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white/90 backdrop-blur-[30px] border border-white/60 rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden text-center animate-in"
            >
              {/* Specular Highlight Top Edge */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
              
              <div className="w-16 h-16 bg-[#2d3748] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md mb-6">
                <Info size={32} className="animate-pulse" />
              </div>

              <h3 className="font-sans font-black text-xl text-gray-955 uppercase tracking-wide mb-3">
                THÔNG BÁO KHÁCH VÃNG LAI
              </h3>
              <p className="text-xs text-gray-655 font-sans leading-relaxed mb-6">
                Bạn đang chuẩn bị đặt mua các thiết bị cao cấp của TechVie dưới tư cách <strong>Khách vãng lai</strong>. 
                Hãy đăng nhập hoặc đăng ký tài khoản TechVie ID để hưởng đặc quyền thành viên Premium, tự động điền thông tin giao nhận và nhận bảo hộ bảo hành tối đa.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('account');
                  }}
                  className="w-full bg-black text-white hover:bg-gray-800 py-3.5 rounded-xl font-sans text-xs uppercase tracking-widest font-black transition-all active:scale-95 cursor-pointer block text-center"
                >
                  ĐĂNG NHẬP HOẶC ĐĂNG KÝ
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuestNotice(false)}
                  className="w-full bg-white/50 hover:bg-white text-[#2d3748] border border-gray-200/50 py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-black transition-all active:scale-95 cursor-pointer block text-center"
                >
                  TIẾP TỤC VỚI TƯ CÁCH KHÁCH
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="checkout-step-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CheckoutForm
              cart={cart}
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
              address={address}
              setAddress={setAddress}
              notes={notes}
              setNotes={setNotes}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardHolder={cardHolder}
              setCardHolder={setCardHolder}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvv={cardCvv}
              setCardCvv={setCardCvv}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              appliedDiscount={appliedDiscount}
              promoError={promoError}
              promoSuccess={promoSuccess}
              handleApplyPromo={handleApplyPromo}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              apiError={apiError}
              onSubmit={handleCheckoutSubmit}
              onNavigate={onNavigate}
            />
          </motion.div>
        )}

        {step === 'processing' && (
          <CheckoutProcessing />
        )}

        {step === 'success' && (
          <CheckoutSuccess
            email={email}
            serverOrderId={serverOrderId}
            fullName={fullName}
            phone={phone}
            address={address}
            deliveryMethod={deliveryMethod}
            cart={cart}
            subtotal={subtotal}
            appliedDiscount={appliedDiscount}
            discountAmount={discountAmount}
            deliveryFee={deliveryFee}
            finalTotal={finalTotal}
            onFinish={handleFinishSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
