import React, { useState } from 'react';
import { Ticket, Plus } from 'lucide-react';

interface Promo {
  code: string;
  discount: number;
  description: string;
  usedCount: number;
  minOrderVal: number;
  isActive: boolean;
}

interface PromoManagerProps {
  promos: Promo[];
  onAddPromo: (promo: Promo) => void;
  onTogglePromoStatus: (code: string) => void;
  onDeletePromo: (code: string) => void;
  isDarkMode?: boolean;
}

export default function PromoManager({
  promos,
  onAddPromo,
  onTogglePromoStatus,
  onDeletePromo,
  isDarkMode = false,
}: PromoManagerProps) {
  // Local states for Promo Creation form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(10); // in percent
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoMinOrder, setNewPromoMinOrder] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const upperCode = newPromoCode.trim().toUpperCase();

    const newPromo = {
      code: upperCode,
      discount: newPromoDiscount / 100, // convert percentage to fraction
      description: newPromoDesc.trim() || `Giảm giá toàn sàn ${newPromoDiscount}%`,
      usedCount: 0,
      minOrderVal: newPromoMinOrder,
      isActive: true
    };

    onAddPromo(newPromo);
    setNewPromoCode('');
    setNewPromoDesc('');
    setNewPromoMinOrder(0);

    
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form to create coupon (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 p-6 rounded-[2rem] shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 text-sm uppercase text-left">Ban hành Voucher mới</h3>
            <p className="text-xs text-gray-400 text-left">Thiết lập các tham số giảm đặt chuẩn cho toàn sành giao quy đổi.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 flex flex-col text-left">
              <label className="text-[10px] uppercase font-bold text-gray-400">Mã Coupon (In hoa) *</label>
              <input
                type="text"
                required
                value={newPromoCode}
                onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                placeholder="Ví dụ: SUMMEROOF"
                className="w-full bg-slate-50 border border-slate-200 focus:border-black focus:bg-white rounded-xl px-4 py-3 outline-none text-xs font-mono font-bold uppercase transition-all"
              />
            </div>

            <div className="space-y-1.5 flex flex-col text-left">
              <label className="text-[10px] uppercase font-bold text-gray-400">Mức chiết khấu (%)</label>
              <select
                value={newPromoDiscount}
                onChange={(e) => setNewPromoDiscount(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 focus:border-black focus:bg-white rounded-xl px-4 py-3 outline-none text-xs font-semibold"
              >
                <option value={5}>Giảm 5%</option>
                <option value={10}>Giảm 10%</option>
                <option value={15}>Giảm 15%</option>
                <option value={20}>Giảm 20%</option>
                <option value={25}>Giảm 25%</option>
                <option value={30}>Giảm 30%</option>
                <option value={50}>Giảm cực hạn 50%</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col text-left">
              <label className="text-[10px] uppercase font-bold text-gray-400">Hạn định đơn tối thiểu (VND)</label>
              <input
                type="number"
                value={newPromoMinOrder}
                onChange={(e) => setNewPromoMinOrder(parseInt(e.target.value) || 0)}
                placeholder="Ví dụ: 10000000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-black focus:bg-white rounded-xl px-4 py-3 outline-none text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5 flex flex-col text-left">
              <label className="text-[10px] uppercase font-bold text-gray-400">Mô tả đặc quyền</label>
              <textarea
                rows={2}
                value={newPromoDesc}
                onChange={(e) => setNewPromoDesc(e.target.value)}
                placeholder="Viết lời mô tả ngắn cho ưu đãi này..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-black focus:bg-white rounded-xl px-4 py-2.5 outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow active:scale-95 cursor-pointer text-center ${
                isDarkMode ? 'bg-white! hover:bg-gray-100! text-black' 
                  : 'bg-black hover:bg-slate-900 text-white'
              }`}
            >
              Công định Voucher
            </button>
          </form>
        </div>

        {/* List with all created coupons (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-gray-200 p-5 rounded-[2rem] shadow-sm flex justify-between items-center">
            <div className="text-left">
              <h3 className="font-extrabold text-gray-950 text-sm uppercase">Danh sách chiến dịch hoạt động</h3>
              <p className="text-xs text-gray-400">Tổng hợp mã đang nằm trong danh sách kiểm duyệt toàn diện.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
              {promos.length} Chiến dịch
            </span>
          </div>

          {promos.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-[2rem] p-6">
              <Ticket size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-800 font-extrabold">Chưa có mã khuyến mãi nào</p>
              <p className="text-xs text-gray-400">Hãy chế tác mã đầu tiên ở bảng bên trái.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promos.map((p) => (
                <div 
                  key={p.code} 
                  className={`border p-5 rounded-3xl shadow-sm transition-all duration-300 flex flex-col justify-between h-[180px] bg-white ${
                    p.isActive ? 'border-gray-200 hover:border-black/15' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-left">
                    {/* Header card info */}
                    <div className={`flex justify-between items-center border-b pb-2 mb-2.5 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <code className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs tracking-wider ${isDarkMode ? 'bg-[#21262d] text-cyan-400' : 'bg-gray-100 text-cyan-600'}`}>
                        {p.code}
                      </code>
                      <span className={`text-xs font-mono font-extrabold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        Giảm {p.discount * 100}%
                      </span>
                    </div>
                    <p className={`font-bold text-xs mb-1 truncate ${isDarkMode ? '!text-white' : 'text-gray-800'}`}>{p.description}</p>
                    
                    {p.minOrderVal > 0 && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        Đơn tối thiểu: {p.minOrderVal.toLocaleString('vi-VN')}₫
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Đã sử dụng: <strong className={`font-mono font-black ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{p.usedCount || 0} lượt</strong>
                    </p>
                  </div>

                  {/* Bottom action bar inside card */}
                  <div className={`flex items-center justify-between pt-3 border-t text-xs ${isDarkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                    <button
                      type="button"
                      onClick={() => onTogglePromoStatus(p.code)}
                      className={`font-black uppercase tracking-wider text-[10px] cursor-pointer ${
                        p.isActive ? 'text-amber-600 hover:text-amber-800' : 'text-emerald-600 hover:text-emerald-800'
                      }`}
                    >
                      {p.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePromo(p.code)}
                      className="text-rose-500 hover:text-rose-700 font-black uppercase tracking-wider text-[10px] cursor-pointer"
                    >
                      Gỡ bỏ
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
