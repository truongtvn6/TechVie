import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface FloatingAdminButtonProps {
  onNavigate: (tab: any) => void;
}

export default function FloatingAdminButton({ onNavigate }: FloatingAdminButtonProps) {
  const isDraggingRef = useRef(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const [adminBtnPos, setAdminBtnPos] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_btn_pos');
      if (saved) {
        const pos = JSON.parse(saved);
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        
        const minX = -16;
        const maxX = Math.max(0, screenWidth - 260);
        const minY = -Math.max(0, screenHeight - 128);
        const maxY = 16;
        
        return {
          x: Math.min(Math.max(pos.x, minX), maxX),
          y: Math.min(Math.max(pos.y, minY), maxY),
        };
      }
      return { x: 0, y: 0 };
    } catch (e) {
      return { x: 0, y: 0 };
    }
  });

  return (
    <div 
      ref={constraintsRef} 
      className="fixed inset-8 border-2 border-dashed border-indigo-400/25 bg-indigo-500/[0.01] rounded-3xl pointer-events-none z-50 flex items-end justify-center pb-2 select-none"
    >
      {/* Subtle label showing drag limit zone boundaries */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/90 border border-indigo-150/80 backdrop-blur-md text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest pointer-events-none shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex items-center gap-1.5 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        VÙNG GIỚI HẠN DI CHUYỂN NÚT ADMIN
      </div>

      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        dragElastic={0.05}
        style={{ x: adminBtnPos.x, y: adminBtnPos.y }}
        whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={(event, info) => {
          const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
          const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          
          const minX = -16;
          const maxX = Math.max(0, screenWidth - 260);
          const minY = -Math.max(0, screenHeight - 128);
          const maxY = 16;

          const rawX = adminBtnPos.x + info.offset.x;
          const rawY = adminBtnPos.y + info.offset.y;

          const clampedX = Math.min(Math.max(rawX, minX), maxX);
          const clampedY = Math.min(Math.max(rawY, minY), maxY);

          setAdminBtnPos({ x: clampedX, y: clampedY });
          try {
            localStorage.setItem('admin_btn_pos', JSON.stringify({ x: clampedX, y: clampedY }));
          } catch (e) {
            console.error('Failed to save admin button position:', e);
          }
          // Tiny buffer to prevent click handler from firing right after letting go of drag
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 100);
        }}
        onClick={() => {
          if (isDraggingRef.current) return;
          onNavigate('admin');
        }}
        className="group absolute bottom-4 left-4 pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/20 text-[11px] font-bold tracking-wider cursor-grab active:cursor-grabbing shadow-[0_8px_32px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_44px_rgba(99,102,241,0.4)] uppercase font-sans overflow-hidden select-none touch-none"
      >
        {/* Shimmer sweep sweep glass effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:glass-shimmer-sweep pointer-events-none" />
        
        <ShieldAlert size={14} className="text-white group-hover:rotate-12 transition-transform duration-200 pointer-events-none" />
        <span className="relative z-10 text-white pointer-events-none">Quản trị Hệ thống</span>
      </motion.button>
    </div>
  );
}
