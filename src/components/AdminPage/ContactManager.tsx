import { RotateCcw, MessageSquare } from 'lucide-react';

interface ContactManagerProps {
  messages: any[];
  isLoadingMessages: boolean;
  onRefreshMessages: () => void;
}

export default function ContactManager({
  messages,
  isLoadingMessages,
  onRefreshMessages,
}: ContactManagerProps) {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm">
        <div>
          <h3 className="font-extrabold text-gray-955 text-sm uppercase">Hòm thư góp ý khách hàng</h3>
          <p className="text-xs text-gray-405 font-sans">
            Cập nhật và đọc những bình bách của khách hàng tương tác qua biểu mẫu liên hệ.
          </p>
        </div>

        <button
          onClick={onRefreshMessages}
          className="w-10 h-10 bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center rounded-xl transition-all"
          title="Tải lại thư"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {isLoadingMessages ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl">
          <div className="w-8 h-8 border-3 border-black/15 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Đang đồng bộ hòm thư...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl p-6">
          <MessageSquare size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-805 font-extrabold">Hòm thư đang trống</p>
          <p className="text-xs text-gray-405">Khách hàng chưa để lại bức thư bưu tín nào trong tuần.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg: any) => (
            <div
              key={msg.id}
              className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:border-black/15 transition-all flex flex-col justify-between h-[230px]"
            >
              <div>
                <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-3 mb-3 text-xs">
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-gray-900 truncate">{msg.name}</h4>
                    <span className="font-mono text-[10px] text-gray-400 block truncate">{msg.email}</span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 shrink-0">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
                  </span>
                </div>

                <p className="font-bold text-gray-900 text-xs mb-1">
                  Chủ đề:{' '}
                  <strong className="text-indigo-650 font-extrabold uppercase text-[9.5px] tracking-wide">
                    {msg.subject}
                  </strong>
                </p>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-4 font-sans italic">
                  " {msg.message} "
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                  className="text-[10px] font-black uppercase tracking-wider text-black hover:underline"
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
