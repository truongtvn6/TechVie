import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { changePassword } from '../../services/api';

export default function TabSecurity() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage({ text: 'Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        setMessage({ text: 'Cập nhật mật khẩu thành công.', isError: false });
        setCurrentPassword('');
        setNewPassword('');
        console.log('Mật khẩu của bạn đã được cấu định an toàn!');
      } else {
        setMessage({ text: res.message || 'Cập nhật mật khẩu thất bại.', isError: true });
      }
    } catch (err) {
      setMessage({ text: 'Lỗi kết nối đến máy chủ.', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-sm">
      <div className="mb-4 border-b border-white/60 pb-2">
        <h3 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest">BẢO MẬT & MÃ HÓA QUANTUM</h3>
        <p className="text-[#4a5568] mt-1 max-w-lg">Cập nhật mật khẩu kết nối hoặc thiết lập đặc cách xác thực hai cổng vân quang học.</p>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-tech-label text-tech-label text-[#4a5568]">MẬT KHẨU HIỆN TẠI</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-[#4a5568]/30 shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-tech-label text-tech-label text-[#4a5568]">MẬT KHẨU MỚI BẢO VỆ</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-[#4a5568]/30 shadow-sm"
            />
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg border text-xs font-sans ${
            message.isError 
              ? 'bg-rose-50/50 border-rose-200 text-rose-600' 
              : 'bg-emerald-50/50 border-emerald-200 text-emerald-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="p-3 bg-white/50 border border-white/60 rounded-xl flex items-start gap-3 shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-[#4a5568] leading-relaxed">
            Xác thực thành viên TechVie ID vĩnh viễn được tự động áp dụng ưu đãi giảm giá lên tới 10% tại tất cả các hệ thống showroom và trạm trải nghiệm TechVie chính hãng trên toàn cầu.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/60">
        <button
          type="button"
          onClick={handleSavePassword}
          disabled={isSubmitting}
          className="px-5 py-3 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-tech-label text-tech-label rounded-lg transition-all duration-300 flex items-center gap-2 group shadow-md cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span>ĐANG XỬ LÝ...</span>
              <Loader2 size={16} className="animate-spin" />
            </>
          ) : (
            <>
              <span>CẤU ĐỊNH MẬT KHẨU</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
