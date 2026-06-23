import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, TabType } from '../types';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Check } from 'lucide-react';

interface CartSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onQuantityChange: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (tab: TabType) => void;
}

export default function CartSidePanel({
  isOpen,
  onClose,
  cart,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
  onNavigate
}: CartSidePanelProps) {
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'shipping' | 'success'>('idle');
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
    setTimeout(() => {
      onClearCart();
      setCheckoutStep('idle');
      onClose();
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-[80]"
          />

          {/* Cart sliding aside panel */}
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-[90] w-[85vw] md:w-[450px] bg-white border-l border-gray-250 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-150 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-secondary">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-950 tracking-tight">Giỏ hàng</h2>
                  <span className="text-xs text-gray-500 font-mono">
                    ({cart.reduce((sum, item) => sum + item.quantity, 0)} thiết bị quang phổ)
                  </span>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-gray-400 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Switcher */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8">
              {checkoutStep === 'idle' && (
                <>
                  {cart.length > 0 ? (
                    <div className="space-y-6">
                      {cart.map((item) => (
                        <div 
                          key={item.product.id}
                          className="flex gap-4 p-4 rounded-2xl border border-gray-150 hover:border-black/10 transition-colors"
                        >
                          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-2 shrink-0">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              referrerPolicy="no-referrer"
                              className="max-h-full object-contain mix-blend-multiply"
                            />
                          </div>

                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-sm text-gray-950 truncate">{item.product.name}</h4>
                              <button 
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                title="Xoá khỏi giỏ"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-1">
                              {item.product.price.toLocaleString('vi-VN')}₫
                            </p>

                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => onQuantityChange(item.product.id, -1)}
                                  className="p-1 px-2.5 hover:bg-gray-100 text-gray-500 cursor-pointer"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="px-3 text-xs font-bold font-mono text-gray-800 bg-gray-50">{item.quantity}</span>
                                <button 
                                  onClick={() => onQuantityChange(item.product.id, 1)}
                                  className="p-1 px-2.5 hover:bg-gray-100 text-gray-500 cursor-pointer"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                              <span className="font-black text-xs text-gray-900 font-mono">
                                {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag size={28} />
                      </div>
                      <h3 className="text-base font-bold text-gray-900">Giỏ hàng rỗng</h3>
                      <p className="text-xs text-gray-550 mt-1 max-w-[240px] mx-auto">
                        Hãy thêm các thiết bị smartphone, laptop hay phụ kiện công nghệ hi-end tối tân vào giỏ hàng.
                      </p>
                      <button 
                        onClick={onClose}
                        className="text-xs text-indigo-650 font-bold uppercase tracking-widest mt-4 hover:underline"
                      >
                        Bắt đầu mua sắm
                      </button>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'shipping' && (
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6">
                  <h3 className="text-sm uppercase font-bold tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-4">
                    Thông tin giao hàng
                  </h3>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                      Họ và Tên Người Nhận <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nguyễn Văn A"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-black outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                      Số Điện Thoại <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="0912345678"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-black outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                      Địa Chỉ Nhận Thiết Bị <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-xs focus:border-black outline-none font-sans"
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-[11px] text-gray-500 font-sans">
                    * Đơn hàng thiết bị sẽ được TechVie đóng gói chống sốc an toàn nghiêm ngặt và bàn giao nguyên seal bưu tá.
                  </div>
                </form>
              )}

              {checkoutStep === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Check size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Đặt hàng thành công!</h3>
                  <p className="text-xs text-gray-600 font-sans mt-3 leading-relaxed max-w-[280px] mx-auto">
                    Kính chúc mừng! Đơn đặt mua thiết bị điện tử cao cấp của bạn đã được ghi nhận trên hệ thống TechVie. Đội ngũ CSKH sẽ sớm gọi điện liên hệ xác nhận đơn giao hàng.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer Summary & checkout trigger */}
            {cart.length > 0 && (
              <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200 space-y-4">
                <div className="flex justify-between text-xs text-gray-500 font-sans">
                  <span>Vận chuyển (TechVie Express)</span>
                  <span className="font-mono text-emerald-600 font-bold">Miễn phí</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-black text-black font-mono">
                    {totalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <button 
                  onClick={() => {
                    onNavigate('checkout');
                    onClose();
                  }}
                  className="w-full bg-black text-white hover:bg-gray-900 py-4 rounded-xl font-sans text-xs uppercase tracking-widest font-black transition-colors flex items-center justify-center gap-2"
                >
                  Tiến hành kết nối đặt hàng
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
