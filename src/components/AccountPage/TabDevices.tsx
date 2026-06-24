import { Cpu, Clock } from 'lucide-react';

export default function TabDevices() {
  return (
    <div className="bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-sm">
      <div className="mb-4 border-b border-white/60 pb-2">
        <h3 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest">THIẾT BỊ HOẠT ĐỘNG & CHỈ SỐ</h3>
        <p className="text-[#4a5568] mt-1 max-w-lg">Theo dõi bảo hành phần cứng, trạng thái nâng cấp và cấu hình thiết bị của bạn.</p>
      </div>

      <div className="border border-white/20 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start bg-slate-950 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 flex-shrink-0 animate-pulse">
          <Cpu size={22} />
        </div>
        
        <div className="space-y-3 flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[8px] uppercase font-bold tracking-widest text-indigo-400 font-mono">BẢO HÀNH CHỦ CHỐT</span>
              <h4 className="font-sans font-black text-base text-white uppercase tracking-tight mt-0.5">TECHVIE INTEGRAL CHIP v1.2</h4>
            </div>
            <span className="bg-emerald-600 text-white text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-500">
              CHẤT LƯỢNG CAO
            </span>
          </div>
          
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Có chứa tấm nền OLED siêu sáng cực đại dải màu vô hạn kết hợp chip xử lý thế hệ mới Core v2. Chân thực sắc nét đến từng điểm pixel cảm thị.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-[10px] text-slate-300 font-mono">
            <div>
              <span className="block text-slate-500 uppercase font-bold text-[8px] mb-1">Tần số quét màn</span>
              <strong className="text-white">120 Hz</strong>
            </div>
            <div>
              <span className="block text-slate-500 uppercase font-bold text-[8px] mb-1">Chuẩn truyền dẫn</span>
              <strong className="text-white">UWB v2.0</strong>
            </div>
            <div>
              <span className="block text-slate-500 uppercase font-bold text-[8px] mb-1 font-sans">Hạn bảo hành</span>
              <strong className="text-white font-sans font-normal">16 - 06 - 2027</strong>
            </div>
            <div>
              <span className="block text-slate-500 uppercase font-bold text-[8px] mb-1">Độ phân giải</span>
              <strong className="text-white">4K UltraHD</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/50 border border-white/60 rounded-xl flex items-start gap-3 text-[#2d3748] text-[11px] leading-relaxed shadow-sm">
        <Clock size={16} className="text-black flex-shrink-0 mt-0.5" />
        <div>
          <strong>Bạn cần đặt mua thêm loại phụ kiện nào?</strong>
          <p className="text-[#4a5568] mt-0.5">Mọi bộ phụ kiện cao cấp và củ sạc hi-end của TechVie đều đảm bảo truyền dẫn sạc mượt mà đồng bộ. Hãy duyệt sảnh để bổ sung mục giỏ hàng.</p>
        </div>
      </div>
    </div>
  );
}
