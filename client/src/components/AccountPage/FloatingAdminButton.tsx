import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface FloatingAdminButtonProps {
  onNavigate: (tab: any) => void;
}

export default function FloatingAdminButton({ onNavigate }: FloatingAdminButtonProps) {
  const isDraggingRef = useRef(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const showDragLimits = false; // Set to true to show boundary guides and label during debugging

  return (
    <div 
      ref={constraintsRef} 
      className={`fixed inset-8 pointer-events-none z-50 flex items-end justify-center pb-2 select-none ${
        showDragLimits ? 'border-2 border-dashed border-indigo-400/25 bg-indigo-500/[0.01] rounded-3xl' : ''
      }`}
    >
      {/* Subtle label showing drag limit zone boundaries */}
      {showDragLimits && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/90 border border-indigo-150/80 backdrop-blur-md text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest pointer-events-none shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          VÙNG GIỚI HẠN DI CHUYỂN NÚT ADMIN
        </div>
      )}

      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        dragElastic={0.1}
        whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          // Tiny buffer to prevent click handler from firing right after letting go of drag
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 100);
        }}
        onClick={() => {
          if (isDraggingRef.current) return;
          onNavigate('admin');
        }}
        className="group absolute top-1/2 -mt-5 left-4 pointer-events-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/25 text-[11px] font-bold tracking-wider !cursor-pointer active:!cursor-grabbing shadow-[0_12px_40px_rgba(99,102,241,0.4),0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_18px_50px_rgba(99,102,241,0.6),0_0_30px_rgba(99,102,241,0.45)] uppercase font-sans overflow-hidden select-none touch-none transition-[background-color,border-color,box-shadow] duration-300"
      >
        {/* Shimmer sweep sweep glass effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:glass-shimmer-sweep pointer-events-none" />
        
        <ShieldAlert size={14} className="text-white shrink-0 group-hover:rotate-12 transition-transform duration-200 pointer-events-none" />
        <span className="relative z-10 text-white pointer-events-none leading-none">Quản trị Hệ thống</span>
      </motion.button>
    </div>
  );
}
