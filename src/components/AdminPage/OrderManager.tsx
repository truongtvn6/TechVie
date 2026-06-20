import { RotateCcw, Plus, AlertCircle, MapPin, Clock, Truck, CheckCircle, X } from 'lucide-react';

interface OrderManagerProps {
  orders: any[];
  isLoadingOrders: boolean;
  onRefreshOrders: () => void;
  onSeedOrder: () => void;
  onUpdateOrderStatus: (orderId: number, status: string, statusType: string) => void;
}

export default function OrderManager({
  orders,
  isLoadingOrders,
  onRefreshOrders,
  onSeedOrder,
  onUpdateOrderStatus,
}: OrderManagerProps) {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm">
        <div>
          <h3 className="font-extrabold text-gray-955 text-sm uppercase">Theo dõi Sổ bưu kiện đặt hàng</h3>
          <p className="text-xs text-gray-405 font-sans">
            Thực hiện phê duyệt lộ trình đơn hàng thực tế lưu trữ tại máy phản hồi của Express server.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshOrders}
            className="w-10 h-10 bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center rounded-xl transition-all"
            title="Tải lại sổ"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={onSeedOrder}
            className="px-5 py-2.5 bg-black hover:bg-gray-905 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
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
          <p className="text-sm text-gray-805 font-extrabold">Sổ Đơn Hàng Đang Trống</p>
          <p className="text-xs text-gray-405 max-w-[320px] mx-auto mt-1 leading-relaxed">
            Chưa có đơn hàng nào được kích hoạt. Hãy dùng chức năng "Tạo đơn ngẫu nhiên" hoặc thêm giỏ hàng thanh toán bên cửa hàng.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord: any) => (
            <div
              key={ord.orderId}
              className="bg-white border border-gray-200 rounded-[1.8rem] overflow-hidden shadow-sm text-xs font-sans"
            >
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
                    <span className="text-gray-650 shrink-0 font-mono">
                      {new Date(ord.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-indigo-650 font-black font-mono text-[15px]">{ord.finalTotal}</span>
                  <span
                    className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-full ${
                      ord.status === 'Hoàn tất bàn giao'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                        : ord.status === 'Đang giao hàng'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                        : ord.status === 'Hủy bỏ'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>

              {/* Row 2 Details */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-gray-150 pb-4 lg:pb-0 lg:pr-6">
                  <h4 className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">
                    Thông tin liên hệ nhận hàng
                  </h4>
                  <div className="space-y-1.5 text-[11px] text-gray-600">
                    <p>
                      <strong className="text-gray-800">SĐT:</strong> {ord.phone}
                    </p>
                    <p>
                      <strong className="text-gray-800">Email:</strong> {ord.email}
                    </p>
                    <p className="flex items-start gap-1">
                      <strong className="text-gray-800 shrink-0">
                        <MapPin size={12} className="inline text-gray-400" /> Địa chỉ:
                      </strong>{' '}
                      <span className="break-words">{ord.address}</span>
                    </p>
                    {ord.notes && (
                      <p className="text-[10px] bg-amber-50 text-amber-700/90 p-2 rounded-lg mt-1 border border-amber-200/20 italic">
                        " {ord.notes} "
                      </p>
                    )}
                  </div>
                </div>

                {/* Bought Items list */}
                <div className="lg:col-span-5 space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">
                    Danh mục thiết bị bưu kiện
                  </h4>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto">
                    {ord.cart?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50/50 border border-gray-150 p-2.5 rounded-xl"
                      >
                        <div className="flex gap-2.5 items-center min-w-0">
                          <div className="w-8 h-8 rounded bg-white p-0.5 border border-gray-150 shrink-0 flex items-center justify-center">
                            <img
                              src={item.product?.image}
                              alt={item.product?.name}
                              className="max-h-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-gray-900 truncate text-[11px]">
                              {item.product?.name}
                            </h5>
                            <span className="text-[9px] text-gray-400 block font-mono">
                              {item.product?.price?.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold bg-white border border-gray-200 px-2.5 py-1 rounded text-gray-850 shrink-0 ml-2">
                          Số lượng: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Update Status Actions */}
                <div className="lg:col-span-3 flex flex-col justify-center gap-2 bg-gray-50/30 p-4 rounded-2xl border border-gray-150">
                  <h4 className="text-[9px] uppercase font-bold text-gray-400 tracking-wider text-center">
                    Hệ luyên phê duyệt chuyển trạng thái
                  </h4>

                  <button
                    onClick={() => onUpdateOrderStatus(ord.orderId, 'Đang lắp ráp chuẩn bị gửi', 'processing')}
                    className="w-full py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Clock size={11} /> Lắp ráp bưu phẩm
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(ord.orderId, 'Đang bàn giao bưu tá Express', 'shipping')}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200/40 text-blue-700 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Truck size={11} /> Giao bưu tá
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(ord.orderId, 'Hoàn tất bàn giao', 'success')}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/40 text-emerald-700 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle size={11} /> Đóng dấu Hoàn tất
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(ord.orderId, 'Hủy bỏ', 'cancelled')}
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
  );
}
