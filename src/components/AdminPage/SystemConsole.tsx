import { Sparkles } from 'lucide-react';

interface SystemConsoleProps {
  logs: string[];
  onClearLogs: () => void;
}

export default function SystemConsole({ logs, onClearLogs }: SystemConsoleProps) {
  return (
    <div className="lg:col-span-12 bg-slate-950 text-slate-100 rounded-3xl p-6 shadow-md overflow-hidden relative border border-slate-900 flex flex-col justify-between min-h-[300px]">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} className="text-indigo-400" />
      </div>

      <div className="relative z-10 w-full">
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
              Dòng Tín Hiệu Hệ Thống (LumiOS Console)
            </span>
          </div>
          <button
            onClick={onClearLogs}
            className="text-[9px] font-mono hover:text-white text-slate-500 transition-colors uppercase underline"
          >
            Dọn sạch log
          </button>
        </div>

        <div className="space-y-2 mt-2 font-mono text-[11px] text-slate-300 leading-relaxed max-h-[200px] overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2.5">
              <span className="text-indigo-400 shrink-0 select-none">❯</span>
              <p className="break-all">{log}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 text-[9px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-start gap-2 mt-4 relative z-10">
        <span>PHÂN PHỐI QUA container CẤP THỰC THI (PORT 3000)</span>
        <span>HỆ MÃ HÓA SHA-256 SẴN SÀNG CHO NHÀ SÁNG LẬP</span>
      </div>
    </div>
  );
}
