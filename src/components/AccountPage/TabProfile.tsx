import React, { useState } from 'react';
import { MapPin, ArrowRight, Copy, Check } from 'lucide-react';

interface TabProfileProps {
  userProfile: any;
  setUserProfile: (profile: any) => void;
}

export default function TabProfile({ userProfile, setUserProfile }: TabProfileProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(userProfile.email || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-sm">
      {/* Top subtle glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/40 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Section Header */}
      <div className="mb-4 border-b border-white/60 pb-2">
        <h3 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest">HỒ SƠ THÀNH VIÊN</h3>
        <p className="text-[#4a5568] mt-1 text-[15px]">Các thông tin cá nhân của bạn phục vụ điền nhanh bưu kiện tại trang thanh toán Checkout.</p>
      </div>

      {/* Form Grid */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        {/* Input: Full Name */}
        <div className="space-y-1.5">
          <label className="font-tech-label text-tech-label text-xs text-[#4a5568]">HỌ VÀ TÊN</label>
          <div className="relative group">
            <input
              className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] text-[15px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-[#4a5568]/50 shadow-sm mt-1.5"
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
            />
            <div className="absolute inset-0 rounded-lg pointer-events-none border border-transparent group-hover:border-gray-300 transition-colors" />
          </div>
        </div>

        {/* Input: Phone */}
        <div className="space-y-1.5">
          <label className="font-tech-label text-tech-label text-xs text-[#4a5568]">SỐ ĐIỆN THOẠI LIÊN HỆ</label>
          <input
            className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] text-[15px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 shadow-sm mt-1.5"
            type="text"
            value={userProfile.phone}
            onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
          />
        </div>

        {/* Input: Email (Readonly) */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="font-tech-label text-tech-label text-xs text-[#4a5568]">EMAIL ĐĂNG BẠ</label>
          <div className="relative mt-1.5 flex items-center">
            <input
              className="w-full bg-gray-100/50 border border-gray-200/50 rounded-lg pl-3.5 pr-12 py-2.5 text-[#4a5568] text-[15px] cursor-not-allowed shadow-sm"
              readOnly
              type="email"
              value={userProfile.email}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3 p-1.5 text-gray-400 hover:text-black rounded-md transition-colors cursor-pointer flex items-center justify-center"
              title="Sao chép email"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Input: Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="font-tech-label text-tech-label text-xs text-[#4a5568]">ĐỊA CHỈ GIAO NHẬN BƯU KIỆN MẶC ĐỊNH</label>
          <textarea
            className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] text-[15px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 resize-none shadow-sm mt-1.5"
            rows={2}
            value={userProfile.address}
            onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
          />
        </div>

        {/* Submit Action */}
        <div className="md:col-span-2 pt-2">
          <button
            className="px-5 py-3 bg-black hover:bg-gray-800 text-white font-tech-label text-tech-label rounded-lg transition-all duration-300 flex items-center gap-2 group shadow-md cursor-pointer float-right !text-[12px]"
            type="button"
            onClick={() => console.log('Cập nhật dữ liệu thông tin tài khoản thành công!')}
          >
            <span>LƯU HỒ SƠ THÔNG TIN</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>

      {/* Supplementary Info / Shortcut */}
      {/* <div className="mt-4 pt-3 border-t border-white/60">
        <div className="bg-white/50 border border-white/60 rounded-xl p-3 flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-gray-105 border border-gray-200 flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-black" />
          </div>
          <div>
            <h4 className="font-tech-label text-tech-label text-[#2d3748] mb-0.5">DANH SÁCH ĐỊA CHỈ NHẬN HÀNG LIÊN KẾT</h4>
            <p className="text-[#4a5568] leading-relaxed">Đây là địa chỉ nhận bưu kiện mặc định của bạn. Bạn có thể thay đổi nhanh bất kỳ lúc nào khi thanh toán đơn hàng.</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
