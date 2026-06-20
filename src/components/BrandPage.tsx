import { motion } from 'motion/react';
import { Sparkles, Compass, Eye } from 'lucide-react';

export default function BrandPage() {

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <span className="text-xs uppercase tracking-[0.4em] text-secondary font-bold mb-4 block">
          CÂU CHUYỆN SÁNG LẬP & TẦM NHÌN
        </span>
        <h1 className="text-5xl md:text-7xl font-sans tracking-tighter text-gray-950 font-extrabold mb-6 leading-none">
          Chế Tác Vượt Giới Hạn
        </h1>
        <p className="text-lg text-gray-650 max-w-2xl mx-auto leading-relaxed">
          Chúng tôi không chỉ lắp ráp phần cứng kỹ thuật; chúng tôi kiến tạo các dòng sản phẩm tối tân, hoàn mỹ bứt phá, kết nối đời sống người dùng với thế giới thông minh. Chào mừng tới LUMINA.
        </p>
      </div>

      {/* Brand Values Grid */}
      <div className="max-w-7xl mx-auto px-6 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-10 rounded-3xl transition-transform duration-500 hover:-translate-y-2 border border-gray-200">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
            <Compass size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 tracking-tight text-gray-900">Triết lý Thiết Kế</h3>
          <p className="text-gray-650 leading-relaxed font-sans text-sm">
            Mọi sản phẩm của LUMINA đều tôn trọng trải nghiệm nguyên bản. Chúng tôi cắt giảm sự rườm rà để tập trung hoàn toàn vào tính năng tối ưu, dải màu hiển thị chân thực và thiết kế công thái học.
          </p>
        </div>

        <div className="glass-card p-10 rounded-3xl transition-transform duration-500 hover:-translate-y-2 border border-gray-200">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
            <Sparkles size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 tracking-tight text-gray-900">Sự Tinh Tế Hi-End</h3>
          <p className="text-gray-650 leading-relaxed font-sans text-sm">
            Vật liệu nhôm CNC nguyên khối, mặt kính cường lực chịu lực kết hợp các giải pháp silicon tiên phong là thành tựu bền bỉ của chúng tôi, tạo ra sản phẩm điện tử chắc chắn và tinh tế vượt thời gian.
          </p>
        </div>

        <div className="glass-card p-10 rounded-3xl transition-transform duration-500 hover:-translate-y-2 border border-gray-200">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
            <Eye size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 tracking-tight text-gray-900">Hệ Sinh Thái Đồng Bộ</h3>
          <p className="text-gray-650 leading-relaxed font-sans text-sm">
            Hệ điều hành tích hợp LuminaOS v2 tối ưu hóa việc truyền phát tín hiệu, đồng bộ hóa tai nghe hi-fi, bàn phím và điện thoại mượt mà chỉ trong một nút chạm thân thiện và tự nhiên.
          </p>
        </div>
      </div>

      {/* Strategic Partners & Ecosystem Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-gray-50 border border-gray-150 rounded-[2.5rem] py-12 px-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">
            HỆ SINH THÁI TỐI ƯU & ĐỐI TÁC TƯƠNG THÍCH TOÀN CẦU
          </p>
          
          <div className="flex flex-wrap gap-4 items-center justify-center max-w-4xl mx-auto">
            {/* Apple */}
            <button className="flex items-center justify-center p-3 h-12 w-12 hover:w-auto hover:pr-5 bg-white border border-gray-150 rounded-full shadow-sm hover:border-black/30 hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden whitespace-nowrap">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors duration-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71,19.5 C17.88,20.74 17,21.95 15.66,21.97 C14.32,22 13.89,21.18 12.37,21.18 C10.84,21.18 10.37,21.95 9.1,22 C7.79,22.05 6.8,20.68 5.96,19.47 C4.25,17 2.94,12.45 4.7,9.39 C5.57,7.87 7.13,6.91 8.82,6.88 C10.1,6.86 11.32,7.75 12.11,7.75 C12.89,7.75 14.37,6.68 15.92,6.84 C16.57,6.87 18.39,7.1 19.56,8.82 C19.47,8.88 17.39,10.1 17.41,12.63 C17.44,15.65 20.06,16.66 20.1,16.67 C20.08,16.74 19.67,18.11 18.71,19.5 M15.97,4.17 C16.63,3.37 17.07,2.28 16.95,1 C16,1.04 14.9,1.6 14.24,2.38 C13.68,3.04 13.19,4.14 13.34,5.39 C14.39,5.47 15.4,4.88 15.97,4.17 Z" />
              </svg>
              <span className="font-sans font-extrabold text-[10px] text-gray-400 group-hover:text-black tracking-widest transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 overflow-hidden shrink-0">
                APPLE
              </span>
            </button>

            {/* Samsung */}
            <button className="flex items-center justify-center p-3 h-12 w-12 hover:w-auto hover:pr-5 bg-white border border-gray-150 rounded-full shadow-sm hover:border-black/30 hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden whitespace-nowrap">
              <svg className="w-8 h-6 text-gray-400 group-hover:text-blue-600 transition-colors duration-300 shrink-0" viewBox="0 0 53 17" fill="currentColor">
                <path d="M4.3,9.5c0,2,1.3,3,3.8,3c2,0,3.3-0.8,3.3-2.3c0-3.3-6.8-1.7-6.8-6c0-2.3,1.9-3.8,4.9-3.8c2.8,0,4.7,1.2,4.7,3.3h-2.3c0-1.2-1.1-1.8-2.4-1.8c-1.8,0-2.6,0.8-2.6,1.8c0,2.9,6.8,1.6,6.8,5.9c0,2.7-2,3.9-5.6,3.9c-3,0-5.6-1.3-5.6-3.9H4.3z M17.2,14.1l-1.3-10l-1.3,10h-2.4l2.4-13.6H17l1.1,9l1.1-9H21l2.4,13.6H21l-1.3-10l-1.3,10H17.2z M27.8,14.1l-4.5-13.6h2.4L29,11.2l3.3-10.7h2.4l-4.5,13.6H27.8z M35.3,10.6h4.3v1.8h-4.3V10.6z M44.6,9.5c0,2,1.3,3,3.8,3c2,0,3.3-0.8,3.3-2.3c0-3.3-6.8-1.7-6.8-6c0-2.3,1.9-3.8,4.9-3.8c2.8,0,4.7,1.2,4.7,3.3H52c0-1.2-1.1-1.8-2.4-1.8c-1.8,0-2.6,0.8-2.6,1.8c0,2.9,6.8,1.6,6.8,5.9c0,2.7-2,3.9-5.6,3.9c-3,0-5.6-1.3-5.6-3.9H44.6z"/>
              </svg>
              <span className="font-sans font-extrabold text-[10px] text-gray-400 group-hover:text-blue-600 tracking-widest transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 overflow-hidden shrink-0">
                SAMSUNG
              </span>
            </button>

            {/* SanDisk */}
            <button className="flex items-center justify-center p-3 h-12 w-12 hover:w-auto hover:pr-5 bg-white border border-gray-150 rounded-full shadow-sm hover:border-black/30 hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden whitespace-nowrap">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-red-600 transition-colors duration-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12" y2="18.01"/>
                <path d="M12 6v6"/>
                <path d="M9 9h6"/>
              </svg>
              <span className="font-sans font-extrabold text-[10px] text-gray-400 group-hover:text-red-600 tracking-widest transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 overflow-hidden shrink-0">
                SANDISK
              </span>
            </button>

            {/* Baseus */}
            <button className="flex items-center justify-center p-3 h-12 w-12 hover:w-auto hover:pr-5 bg-white border border-gray-150 rounded-full shadow-sm hover:border-black/30 hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden whitespace-nowrap">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-amber-500 transition-colors duration-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2a10,10,0,1,0,10,10A10,10,0,0,0,12,2Zm2,12H10v-3h4Zm0-4H10V7h4Z" />
              </svg>
              <span className="font-sans font-extrabold text-[10px] text-gray-400 group-hover:text-amber-500 tracking-widest transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 overflow-hidden shrink-0">
                BASEUS
              </span>
            </button>
          </div>
          
          <p className="text-gray-400 font-sans text-xs mt-8 max-w-2xl mx-auto leading-relaxed">
            Các dòng thiết bị LuminaBook Silicon, sạc nhanh không dây Lumina Dock và tai nghe cao cấp đạt tiêu chuẩn chứng nhận tương thích nghiêm ngặt, bảo đảm truyền tải mượt mà bứt phá cùng các thương hiệu công nghệ đỉnh phong toàn cầu.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
