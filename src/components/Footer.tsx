import React from "react";
import { TabType } from "../types";
import { Globe, Layers, Brush, ArrowUpRight, Copyright } from "lucide-react";

interface FooterProps {
  navigationItems: Array<{ id: TabType; label: string }>;
  setActiveTab: (tab: TabType) => void;
}

export default function Footer({ navigationItems, setActiveTab }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-16 pb-6 mt-20 relative z-10 select-none">
      <div className="max-w-none mx-auto px-4 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Description summary */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            TECHVIE
          </h3>
          <p className="text-sm text-gray-500 font-sans leading-relaxed md:max-w-[260px] max-w-xl text-justify">
            Cung cấp các giải pháp phụ kiện tiện ích và đồ setup không gian làm việc. Chúng tôi giúp bạn kiến tạo góc học tập tối giản, bảo vệ sức khỏe và mang đậm cá tính riêng.
          </p>
        </div>

        {/* Nav columns 1 */}
        <div>
          <h5 className="text-[12px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6 font-sans">
            CÁC KHÔNG GIAN
          </h5>
          <ul className="space-y-3">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-sm text-gray-600 hover:text-black transition-colors font-sans text-left uppercase tracking-wider font-semibold cursor-pointer"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h5 className="text-[12px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6 font-sans">
            LIÊN HỆ
          </h5>
          <ul className="space-y-3 text-sm text-gray-600 font-sans">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-gray-800">Điện thoại:</span>
              <a href="tel:19006868" className="hover:text-black hover:underline transition-colors">1900 6868</a>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-gray-800">Email:</span>
              <a href="mailto:hello@techvie.vn" className="hover:text-black hover:underline transition-colors">hello@techvie.vn</a>
            </li>
            <li className="flex flex-col gap-1 mt-2">
              <span className="font-semibold text-gray-800">Địa chỉ:</span>
              <span className="leading-relaxed">Tầng 3, Tech Building, Quận 1, TP. HCM</span>
              <span className="leading-relaxed italic">(Xem bản đồ tại trang Liên hệ)</span>
            </li>
          </ul>
        </div>

        {/* Social Links columns */}
        <div>
          <h5 className="text-[12px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">
            MẠNG XÃ HỘI
          </h5>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
              title="TechVie Global Network"
            >
              <Globe size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
              title="TechVie Micro-Animations"
            >
              <Layers size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
              title="TechVie Crafts"
            >
              <Brush size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Rights bar */}
      <div className="max-w-none mx-auto px-4 md:px-10 lg:px-16 mt-16 pt-6 border-t border-gray-150 flex flex-col md:flex-row justify-between items-center text-[11px] font-mono uppercase tracking-widest text-gray-500 gap-4 text-center md:text-left">
        <span className="flex items-center gap-1">
          <Copyright size={13} /> 2026 TechVie. Kiến tạo góc học tập đậm chất riêng.
        </span>
        {/* <span className="flex items-center gap-1">
          THIẾT KẾ BỞI TECHVIE LAB, GEMINI, AISTUDIO.GOOGLE & STITCH.WITHGOOGLE.
          <ArrowUpRight size={11} />
        </span> */}
      </div>
    </footer>
  );
}
