import React from 'react';
import { motion } from 'motion/react';
import { CartItem } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface CheckoutSuccessProps {
  email: string;
  serverOrderId: number | null;
  fullName: string;
  phone: string;
  address: string;
  deliveryMethod: 'standard' | 'express';
  cart: CartItem[];
  subtotal: number;
  appliedDiscount: number;
  discountAmount: number;
  deliveryFee: number;
  finalTotal: number;
  onFinish: () => void;
}

export default function CheckoutSuccess({
  email,
  serverOrderId,
  fullName,
  phone,
  address,
  deliveryMethod,
  cart,
  subtotal,
  appliedDiscount,
  discountAmount,
  deliveryFee,
  finalTotal,
  onFinish
}: CheckoutSuccessProps) {
  return (
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
          Yêu cầu đặt mua sản phẩm của bạn đã lưu trữ thành công vào cổng dữ liệu hành trình TechVie. Mã vận đơn cùng chính sách bảo hành điện tử sẽ được chuyển giao thẳng tới email của bạn: <strong className="text-black font-semibold shadow-none">{email || 'khachhang@techvie.com'}</strong>.
        </p>
      </div>

      {/* Printout physical-style ticket receipt */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 text-left shadow-lg relative overflow-hidden font-sans text-xs">
        {/* Ticket tooth cut decor layout */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:14px_8px]" />

        <div className="flex justify-between items-start border-b border-gray-150 pb-5">
          <div>
            <h4 className="font-extrabold text-base text-gray-900">TECHVIE CORP. RECEIPT</h4>
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
            *TECHVIE-SECURE-HARDWARE-REGISTRATION-VERIFIED*
          </span>
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={onFinish}
          className="bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black px-10 py-5 rounded-xl transition-all shadow-md active:scale-95"
        >
          Hoàn tất & Quay về trang chủ
        </button>
      </div>
    </motion.div>
  );
}
