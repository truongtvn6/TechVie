import React from "react";
import { TabType } from "../types";
import { Globe, Layers, Brush, ArrowUpRight, Copyright } from "lucide-react";

interface FooterProps {
  navigationItems: Array<{ id: TabType; label: string }>;
  setActiveTab: (tab: TabType) => void;
}

export default function Footer({ navigationItems, setActiveTab }: FooterProps) {
  return (
    <footer className="w-full bg-white/40 border-t border-gray-200 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Description summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            TECHVIE
          </h3>
          <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-[260px]">
            Cung cấp các thiết bị điện tử đỉnh cao, laptop hiệu năng khủng,
            smartphone đột phá và các món phụ kiện hi-end chế tác tỉ mỉ dành cho
            tương lai.
          </p>
        </div>

        {/* Nav columns 1 */}
        <div>
          <h5 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6 font-sans">
            ĐIỀU HƯỚNG
          </h5>
          <ul className="space-y-3">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs text-gray-600 hover:text-black transition-colors font-sans text-left uppercase tracking-wider font-semibold"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Nav columns 2 */}
        <div>
          <h5 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6 font-sans">
            DỊCH VỤ & LAB
          </h5>
          <ul className="space-y-3 text-xs text-gray-600 font-sans">
            <li>
              <button
                onClick={() => {
                  setActiveTab("brand");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:underline text-left"
              >
                TechVie Book Silicon specs
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("brand");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:underline text-left"
              >
                Hệ Sinh Thái Thông Minh 2026
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:underline text-left"
              >
                Trạm Trải Nghiệm Premium
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:underline text-left"
              >
                Hỗ trợ kỹ thuật & Bảo hành
              </button>
            </li>
          </ul>
        </div>

        {/* Social Links columns */}
        <div>
          <h5 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">
            MẠNG XÃ HỘI
          </h5>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
              title="TechVie Global Network"
            >
              <Globe size={16} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
              title="TechVie Micro-Animations"
            >
              <Layers size={16} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
              title="TechVie Crafts"
            >
              <Brush size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Rights bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-150 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-400 gap-4 text-center md:text-left">
        <span className="flex items-center gap-1">
          <Copyright  size={11} /> 2026 TECHVIE ELECTRONICS. ĐƯỢC CHẾ TÁC VÌ SỰ
          RÕ NÉT.
        </span>
        <span className="flex items-center gap-1">
          THIẾT KẾ BỞI TECHVIE LAB, GEMINI, AISTUDIO.GOOGLE & STITCH.WITHGOOGLE.
          <ArrowUpRight size={11} />
        </span>
      </div>
    </footer>
  );
}
