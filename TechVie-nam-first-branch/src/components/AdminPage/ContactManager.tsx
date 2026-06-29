import { RotateCcw, MessageSquare } from 'lucide-react';

interface ContactManagerProps {
  messages: any[];
  isLoadingMessages: boolean;
  onRefreshMessages: () => void;
  isDarkMode?: boolean;
}

export default function ContactManager({
  messages,
  isLoadingMessages,
  onRefreshMessages,
  isDarkMode = false,
}: ContactManagerProps) {
  const d = isDarkMode;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 sm:p-8 rounded-3xl shadow-sm border transition-all duration-300 ${
        d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
      }`}>
        <div>
          <h3 className={`font-extrabold text-base uppercase tracking-wider transition-colors duration-300 ${d ? 'text-white' : 'text-gray-955'}`}>Hòm thư góp ý khách hàng</h3>
          <p className={`text-xs md:text-[13px] font-sans mt-1.5 leading-relaxed transition-colors duration-300 ${d ? 'text-gray-400' : 'text-gray-405'}`}>
            Cập nhật và đọc những bình bách của khách hàng tương tác qua biểu mẫu liên hệ.
          </p>
        </div>

        <button
          onClick={onRefreshMessages}
          className={`w-12 h-12 border flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
            d ? 'bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-white' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
          }`}
          title="Tải lại thư"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {isLoadingMessages ? (
        <div className={`text-center py-20 border rounded-3xl ${
          d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
        }`}>
          <div className={`w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-3 ${
            d ? 'border-white/15 border-t-white' : 'border-black/15 border-t-black'
          }`} />
          <p className={`text-xs ${d ? 'text-gray-400' : 'text-gray-500'}`}>Đang đồng bộ hòm thư...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className={`text-center py-20 border rounded-3xl p-6 ${
          d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
        }`}>
          <MessageSquare size={36} className="text-gray-400 mx-auto mb-3" />
          <p className={`text-sm font-extrabold ${d ? 'text-white' : 'text-gray-805'}`}>Hòm thư đang trống</p>
          <p className={`text-xs ${d ? 'text-gray-400' : 'text-gray-405'}`}>Khách hàng chưa để lại bức thư bưu tín nào trong tuần.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl shadow-sm transition-all flex flex-col justify-between h-[230px] border ${
                d 
                  ? 'bg-[#161b22] border-[#30363d] hover:border-indigo-500/40 hover:bg-[#161b22]/70' 
                  : 'bg-white border-gray-200 hover:border-black/15 hover:bg-gray-50/20'
              }`}
            >
              <div>
                <div className={`flex justify-between items-start gap-2 border-b pb-3 mb-3 text-xs ${
                  d ? 'border-[#30363d]' : 'border-gray-100'
                }`}>
                  <div className="min-w-0">
                    <h4 className={`font-extrabold truncate ${d ? 'text-white' : 'text-gray-900'}`}>{msg.name}</h4>
                    <span className="font-mono text-[10px] text-gray-400 block truncate">{msg.email}</span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 shrink-0">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
                  </span>
                </div>

                <p className={`font-bold text-xs mb-1 ${d ? 'text-gray-200' : 'text-gray-900'}`}>
                  Chủ đề:{' '}
                  <strong className={`font-extrabold uppercase text-[9.5px] tracking-wide ${
                    d ? 'text-indigo-400' : 'text-indigo-650'
                  }`}>
                    {msg.subject}
                  </strong>
                </p>
                <p className={`text-xs leading-relaxed line-clamp-4 font-sans italic ${
                  d ? 'text-gray-400' : 'text-gray-550'
                }`}>
                  " {msg.message} "
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                  className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-200 hover:underline ${
                    d ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-750'
                  }`}
                >
                  Kết nối hòm thư liên hệ ❯
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
