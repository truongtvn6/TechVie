import { DollarSign, ShoppingBag, Package, MessageSquare } from 'lucide-react';

interface DashboardStatsProps {
  totalRevenue: number;
  ordersCount: number;
  processingOrdersCount: number;
  productsCount: number;
  messagesCount: number;
}

export default function DashboardStats({
  totalRevenue,
  ordersCount,
  processingOrdersCount,
  productsCount,
  messagesCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stat 1: Revenue */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-black/20 transition-all duration-300">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">DOANH THU ƯỚC TÍNH</span>
          <strong className="text-2xl font-black text-gray-900 font-mono tracking-tight block">
            {totalRevenue.toLocaleString('vi-VN')}₫
          </strong>
          <span className="text-[9px] text-emerald-500 uppercase font-bold tracking-wider font-mono">
            ● Dữ liệu máy chủ thực
          </span>
        </div>
        <div className="w-12 h-12 bg-[#e0e7ff] text-[#4f46e5] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <DollarSign size={20} />
        </div>
      </div>

      {/* Stat 2: Orders Total */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-black/20 transition-all duration-300">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">SỔ ĐƠN ĐÃ LỌC</span>
          <strong className="text-2xl font-black text-gray-900 font-mono tracking-tight block">
            {ordersCount} đơn hàng
          </strong>
          <span className="text-[9px] text-gray-400 block font-mono">
            Gồm {processingOrdersCount} đơn đang xử lý
          </span>
        </div>
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <ShoppingBag size={20} />
        </div>
      </div>

      {/* Stat 3: Products Store */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-black/20 transition-all duration-300">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">ACTIVE CATALOGUE</span>
          <strong className="text-2xl font-black text-gray-900 font-mono tracking-tight block">
            {productsCount} danh mục
          </strong>
          <span className="text-[9px] text-emerald-500 uppercase font-bold tracking-wider font-mono">
            ● Sẵn sàng hiển thị
          </span>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <Package size={20} />
        </div>
      </div>

      {/* Stat 4: Contacts messages */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-black/20 transition-all duration-300">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">THƯ LIÊN HỆ GÓP Ý</span>
          <strong className="text-2xl font-black text-gray-900 font-mono tracking-tight block">
            {messagesCount} thư phản hồi
          </strong>
          <span className="text-[9px] text-gray-400 block font-mono">
            Khách hàng gửi qua Contact form
          </span>
        </div>
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <MessageSquare size={20} />
        </div>
      </div>
    </div>
  );
}
