import { DollarSign, ShoppingBag, Package, MessageSquare } from 'lucide-react';

interface DashboardStatsProps {
  totalRevenue: number;
  ordersCount: number;
  processingOrdersCount: number;
  productsCount: number;
  messagesCount: number;
  isDarkMode?: boolean;
}

export default function DashboardStats({
  totalRevenue,
  ordersCount,
  processingOrdersCount,
  productsCount,
  messagesCount,
  isDarkMode = false,
}: DashboardStatsProps) {
  const d = isDarkMode;

  const formatRevenue = (value: number) => {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ ₫';
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' triệu ₫';
    }
    return value.toLocaleString('vi-VN') + '₫';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stat 1: Revenue */}
      <div className={`border rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all duration-300 min-w-0 ${
        d ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="space-y-1 min-w-0 flex-grow">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans block">DOANH THU ƯỚC TÍNH</span>
          <strong className={`text-xl sm:text-2xl font-black font-mono tracking-tight block truncate ${d ? 'text-white' : 'text-gray-900'}`} title={totalRevenue.toLocaleString('vi-VN') + '₫'}>
            {formatRevenue(totalRevenue)}
          </strong>
          <span className="text-[9px] text-[#4f46e5] block font-mono">
            T.bình {ordersCount > 0 ? Math.round(totalRevenue / ordersCount).toLocaleString('vi-VN') : 0}₫ / đơn hàng
          </span>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform ${d ? 'bg-indigo-950/40 text-indigo-400' : 'bg-[#e0e7ff] text-[#4f46e5]'}`}>
          <DollarSign size={20} />
        </div>
      </div>

      {/* Stat 2: Orders Total */}
      <div className={`border rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all duration-300 ${
        d ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">SỔ ĐƠN ĐÃ LỌC</span>
          <strong className={`text-2xl font-black font-mono tracking-tight block ${d ? 'text-white' : 'text-gray-900'}`}>
            {ordersCount} đơn hàng
          </strong>
          <span className="text-[9px] text-gray-400 block font-mono">
            Gồm {processingOrdersCount} đơn đang xử lý
          </span>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${d ? 'bg-indigo-950/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
          <ShoppingBag size={20} />
        </div>
      </div>

      {/* Stat 3: Products Store */}
      <div className={`border rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all duration-300 ${
        d ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">ACTIVE CATALOGUE</span>
          <strong className={`text-2xl font-black font-mono tracking-tight block ${d ? 'text-white' : 'text-gray-900'}`}>
            {productsCount} danh mục
          </strong>
          <span className="text-[9px] text-emerald-600 block font-mono">
            Gồm {productsCount} sản phẩm sẵn có
          </span>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${d ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
          <Package size={20} />
        </div>
      </div>

      {/* Stat 4: Contacts messages */}
      <div className={`border rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all duration-300 ${
        d ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider font-sans block">THƯ LIÊN HỆ GÓP Ý</span>
          <strong className={`text-2xl font-black font-mono tracking-tight block ${d ? 'text-white' : 'text-gray-900'}`}>
            {messagesCount} thư phản hồi
          </strong>
          <span className="text-[9px] text-amber-600 block font-mono">
            Nhận và phản hồi SMTP trực tiếp
          </span>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${d ? 'bg-amber-950/40 text-amber-500' : 'bg-amber-50 text-amber-500'}`}>
          <MessageSquare size={20} />
        </div>
      </div>
    </div>
  );
}
