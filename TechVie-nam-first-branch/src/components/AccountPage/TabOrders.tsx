import { Package, CheckCircle2 } from 'lucide-react';

interface TabOrdersProps {
  orders: any[];
}

export default function TabOrders({ orders }: TabOrdersProps) {
  return (
    <div className="h-full bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-sm custom-glass-scrollbar overflow-y-auto max-h-[75vh]">
      <div className="mb-4 border-b border-white/60 pb-2">
        <h3 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest">TIẾN TRÌNH VẬN CHUYỂN ĐƠN HÀNG</h3>
        <p className="text-[#4a5568] mt-1 max-w-lg">Theo dõi thực tế hành trình đơn sản phẩm cao cấp và trạng thái bàn giao của bạn.</p>
      </div>

      <div className="space-y-6 flex-grow">
        {orders.map((ord) => (
          <div key={ord.id} className="bg-white/60 backdrop-blur-md border border-white/60 rounded-xl overflow-hidden shadow-sm font-sans text-xs">
            {/* Top row */}
            <div className="bg-white/40 border-b border-white/60 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#4a5568] tracking-wider block">Đơn hàng</span>
                <strong className="block text-[#2d3748] font-extrabold text-sm font-mono">{ord.id}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#4a5568] tracking-wider block sm:text-right">Ngày đặt</span>
                <span className="font-semibold text-[#2d3748]">{ord.date}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#4a5568] tracking-wider block sm:text-right">Tổng thanh toán</span>
                <strong className="text-black font-black font-mono text-sm block sm:text-right">{ord.total}</strong>
              </div>
            </div>

            {/* Middle row */}
            <div className="p-6 space-y-4">
              {ord.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-[#2d3748] rounded-lg flex items-center justify-center border border-gray-200/20 text-white">
                    <Package size={18} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#2d3748]">{item.name}</h4>
                    <p className="text-[10px] uppercase tracking-wider text-[#4a5568] mt-0.5">{item.type} • Số lượng: {item.qty}</p>
                  </div>
                </div>
              ))}

              {/* Progress Status trackline */}
              <div className="pt-4 border-t border-white/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs text-[#2d3748]">
                  {ord.statusType === 'processing' ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                  ) : (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  )}
                  <span className="font-extrabold text-[#2d3748]">
                    Trạng thái: <strong className="text-black font-black uppercase text-[10px]">{ord.status}</strong>
                  </span>
                </div>

                <button 
                  type="button"
                  onClick={() => console.log(`Sản phẩm mã ${ord.id} đang nằm trong lộ trình bưu tá giao hàng tận nơi nguyên seal.`)}
                  className="text-[10px] font-tech-label text-tech-label text-black bg-white/80 border border-white/60 hover:bg-white px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                  Xem Vị Trí Vận Chuyển
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
