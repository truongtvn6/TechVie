import React from 'react';
import { motion } from 'motion/react';
import { CartItem } from '../../types';
import { CheckCircle2, Clock3, RefreshCw } from 'lucide-react';

interface CheckoutSuccessProps {
  email: string;
  serverOrderId: number | string | null;
  paymentDetails?: any;
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
  onRefreshPaymentStatus: () => void;
  isCheckingPayment: boolean;
  paymentStatusMessage: string;
}

export default function CheckoutSuccess({
  email,
  serverOrderId,
  paymentDetails,
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
  onFinish,
  onRefreshPaymentStatus,
  isCheckingPayment,
  paymentStatusMessage
}: CheckoutSuccessProps) {
  const provider = paymentDetails?.provider || paymentDetails?.paymentProvider || '';
  const paymentStatus = paymentDetails?.status || paymentDetails?.paymentStatus || 'pending';
  const paymentReference = paymentDetails?.reference || paymentDetails?.paymentReference || '';
  const paymentNote = paymentDetails?.note || paymentDetails?.paymentNote || '';
  const paymentStatusLabel = paymentDetails?.statusLabel || paymentDetails?.paymentStatusLabel || (paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán');
  const paymentMethodLabel = provider === 'bank_transfer'
    ? 'Chuyển khoản ngân hàng'
    : provider === 'momo'
      ? 'Ví điện tử MoMo'
      : provider === 'zalopay'
        ? 'Ví điện tử ZaloPay'
        : provider === 'cod'
          ? 'Thanh toán khi nhận hàng'
          : 'Phương thức thanh toán';
  const paymentQrSrc = provider === 'bank_transfer'
    ? '/src/assets/images/nganhang.jpg'
    : provider === 'momo'
      ? '/src/assets/images/momo.jpg'
      : provider === 'zalopay'
        ? '/src/assets/images/zalopay.jpg'
        : '';
  const isWaitingPayment = paymentStatus !== 'paid' && provider !== 'cod';

  return (
    <motion.div 
      key="checkout-step-success"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8 text-center space-y-8"
    >
      <div className={`w-20 h-20 rounded-full border flex items-center justify-center mx-auto shadow-md ${
        isWaitingPayment
          ? 'bg-amber-50 text-amber-600 border-amber-100'
          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
      }`}>
        {isWaitingPayment ? <Clock3 size={40} /> : <CheckCircle2 size={40} className="animate-bounce" />}
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
          {isWaitingPayment ? 'ĐÃ GHI NHẬN ĐƠN HÀNG!' : 'XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG!'}
        </h1>
        <p className="text-xs text-gray-505 font-sans leading-relaxed max-w-md mx-auto">
          {isWaitingPayment ? (
            <>
              Đơn hàng đã được lưu vào MongoDB và đang chờ người bán đối soát giao dịch. Thông tin xác nhận sẽ được gửi tới email: <strong className="text-black font-semibold shadow-none">{email || 'khachhang@techvie.com'}</strong>.
            </>
          ) : (
            <>
              Yêu cầu đặt mua sản phẩm của bạn đã lưu trữ thành công vào cổng dữ liệu hành trình TechVie. Mã vận đơn cùng chính sách bảo hành điện tử sẽ được chuyển giao thẳng tới email của bạn: <strong className="text-black font-semibold shadow-none">{email || 'khachhang@techvie.com'}</strong>.
            </>
          )}
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
            <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${
              paymentStatus === 'paid'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
              {paymentStatusLabel}
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

          {/* Payment tracking summary */}
          {paymentDetails && (
            <div className={`rounded-2xl border p-4 space-y-2 ${
              paymentStatus === 'paid'
                ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                : 'bg-amber-50/70 border-amber-100 text-amber-900'
            }`}>
              <div className="flex justify-between text-[11px] gap-3">
                <span className="font-black uppercase tracking-wider">Phương thức</span>
                <span className="font-bold text-right">{paymentMethodLabel}</span>
              </div>
              <div className="flex justify-between text-[11px] gap-3">
                <span className="font-black uppercase tracking-wider">Mã đối soát</span>
                <span className="font-mono font-bold text-right">{paymentReference || `TECHVIE-${serverOrderId}`}</span>
              </div>
              {paymentNote && (
                <div className="flex justify-between text-[11px] gap-3">
                  <span className="font-black uppercase tracking-wider">Nội dung CK</span>
                  <span className="font-mono font-bold text-right">{paymentNote}</span>
                </div>
              )}
              {provider === 'bank_transfer' && paymentStatus !== 'paid' && (
                <p className="text-[10px] leading-relaxed pt-2 border-t border-amber-200/60">
                  Vui lòng chuyển khoản đúng nội dung trên. Admin sẽ đối soát và chuyển trạng thái sang "Đã thanh toán" trong trang quản trị.
                </p>
              )}
            </div>
          )}

          {paymentQrSrc && isWaitingPayment && (
            <div className="rounded-2xl border border-gray-150 bg-gray-50/70 p-4 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 items-center">
              <img
                src={paymentQrSrc}
                alt={`QR ${paymentMethodLabel}`}
                className="w-[140px] h-[178px] object-cover rounded-xl border border-gray-200 mx-auto bg-white"
              />
              <div className="space-y-2">
                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Quét mã để thanh toán</span>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Sau khi bạn chuyển tiền, người bán sẽ kiểm tra giao dịch thực tế trên tài khoản/ví nhận tiền. Trang này chỉ đổi sang <strong>Đã thanh toán</strong> khi admin xác nhận trong hệ thống quản trị.
                </p>
                <p className="text-[10px] font-mono text-gray-900 bg-white border border-gray-100 rounded-lg p-2 break-all">
                  Nội dung: {paymentNote || paymentReference || `TECHVIE-${serverOrderId}`}
                </p>
              </div>
            </div>
          )}

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
        {paymentStatusMessage && (
          <p className={`text-xs font-sans font-bold mb-4 ${
            paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-700'
          }`}>
            {paymentStatusMessage}
          </p>
        )}

        {isWaitingPayment ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onRefreshPaymentStatus}
              disabled={isCheckingPayment}
              className="bg-black hover:bg-gray-900 disabled:opacity-60 text-white font-sans text-xs uppercase tracking-widest font-black px-8 py-5 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <RefreshCw size={15} className={isCheckingPayment ? 'animate-spin' : ''} />
              {isCheckingPayment ? 'Đang kiểm tra' : 'Kiểm tra trạng thái thanh toán'}
            </button>
            <button
              type="button"
              onClick={onFinish}
              className="bg-white hover:bg-gray-50 text-gray-650 border border-gray-200 font-sans text-xs uppercase tracking-widest font-black px-8 py-5 rounded-xl transition-all active:scale-95"
            >
              Về trang chủ
            </button>
          </div>
        ) : (
          <button 
            onClick={onFinish}
            className="bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black px-10 py-5 rounded-xl transition-all shadow-md active:scale-95"
          >
            Hoàn tất & Quay về trang chủ
          </button>
        )}
      </div>
    </motion.div>
  );
}
