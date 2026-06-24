import React, { useState } from "react";
import { ShieldCheck, Truck, RefreshCw, Lock, ArrowRight, FileText } from "lucide-react";

interface PolicySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  summary: string;
  details: string[];
}

const policies: PolicySection[] = [
  {
    id: "warranty",
    title: "Chính sách Bảo hành Thụy Sĩ",
    icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
    summary: "Đặc quyền bảo hộ phần cứng tối cao với chế độ bảo hành 12 tháng tiêu chuẩn TechVie Lab.",
    details: [
      "Bảo hành 1 đổi 1 trong vòng 30 ngày đối với bất kỳ lỗi chế tác hoặc phần cứng từ nhà sản xuất.",
      "Hỗ trợ kỹ thuật trọn đời qua tổng đài mã hóa bảo mật TechVie ID.",
      "Đặc quyền VIP: Được cung cấp thiết bị thay thế tạm thời có cấu hình tương đương trong thời gian bảo trì.",
      "Miễn phí vệ sinh thiết bị, tra keo tản nhiệt kim loại lỏng định kỳ 6 tháng một lần tại các Trạm Trải Nghiệm."
    ]
  },
  {
    id: "shipping",
    title: "Vận chuyển An ninh Cao cấp",
    icon: <Truck className="w-8 h-8 text-indigo-600" />,
    summary: "Bàn giao nguyên seal bọc gỗ chống shock bảo vệ tuyệt đối hành trình thiết bị độc bản.",
    details: [
      "Giao hàng hỏa tốc trong 2 giờ nội thành TP. Hồ Chí Minh và Hà Nội bằng đội ngũ bưu tá riêng biệt.",
      "Mọi đơn hàng giá trị cao đều được vận chuyển trong thùng gỗ bảo hiểm chuyên dụng nguyên niêm phong.",
      "Cam kết bảo hiểm 100% giá trị thiết bị trong suốt quá trình trung chuyển vật lý.",
      "Hỗ trợ theo dõi lộ trình thời gian thực chính xác từng mét qua bản đồ định vị thông minh."
    ]
  },
  {
    id: "returns",
    title: "Đổi trả Tự do 15 Ngày",
    icon: <RefreshCw className="w-8 h-8 text-indigo-600" />,
    summary: "Đảm bảo sự hài lòng tuyệt đối của bạn với chính sách hoàn trả linh hoạt trong vòng 15 ngày.",
    details: [
      "Chấp nhận đổi trả không lý do trong vòng 15 ngày đối với sản phẩm còn nguyên seal, chưa kích hoạt hệ thống.",
      "Hoàn tiền 100% giá trị hóa đơn về tài khoản liên kết chỉ trong vòng 3 ngày làm việc.",
      "Hỗ trợ thu hồi sản phẩm tận nhà miễn phí, khách hàng không cần tự mang ra bưu cục.",
      "Quy trình kiểm định thu hồi tinh giản, tôn trọng tối đa thời gian và trải nghiệm của khách hàng."
    ]
  },
  {
    id: "privacy",
    title: "Bảo mật Dữ liệu Lượng tử",
    icon: <Lock className="w-8 h-8 text-indigo-600" />,
    summary: "Mã hóa toàn bộ thông tin cá nhân và giao dịch của thành viên bằng tiêu chuẩn an ninh cấp cao.",
    details: [
      "Thông tin tài khoản TechVie ID được bảo vệ bằng lớp mã hóa lượng tử, ngăn chặn tuyệt đối mọi hành vi rò rỉ.",
      "Chúng tôi cam kết không chia sẻ, mua bán hoặc tiết lộ thông tin khách hàng cho bất kỳ bên thứ ba nào.",
      "Lịch sử giao dịch và thông tin thẻ tín dụng được xử lý trực tiếp qua cổng thanh toán bảo mật quốc tế Stripe.",
      "Quyền được lãng quên: Khách hàng có thể yêu cầu xóa vĩnh viễn toàn bộ dữ liệu lịch sử tài khoản bất kỳ lúc nào."
    ]
  }
];

export default function PolicyPage() {
  const [activePolicy, setActivePolicy] = useState<string>("warranty");

  const currentPolicy = policies.find(p => p.id === activePolicy) || policies[0];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 font-sans text-left">
      {/* Page Header */}
      <div className="relative mb-16 text-center md:text-left">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100/60 inline-block mb-4">
          TECHVIE SERVICES
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight leading-none mb-6">
          Hiến chương Đảm bảo & Chính sách
        </h1>
        <p className="text-sm md:text-base text-gray-500 max-w-2xl leading-relaxed">
          Tại TechVie, chúng tôi tin rằng trải nghiệm sở hữu các tác phẩm công nghệ đỉnh cao phải đi kèm với những cam kết bảo hộ an toàn, minh bạch và xứng tầm đẳng cấp.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Column: Policy Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {policies.map((policy) => {
            const isActive = policy.id === activePolicy;
            return (
              <div
                key={policy.id}
                onClick={() => setActivePolicy(policy.id)}
                className={`group p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] relative overflow-hidden select-none
                  ${isActive 
                    ? "bg-black text-white border-black shadow-lg translate-y-[-4px]" 
                    : "bg-white text-gray-950 border-gray-200 hover:border-black/30 hover:bg-gray-50/50 hover:translate-y-[-2px] shadow-sm"
                  }
                `}
              >
                {/* Visual hover ambient glow inside active card */}
                {isActive && (
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                )}

                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${isActive ? "bg-white/10 text-white border border-white/10" : "bg-indigo-50 text-indigo-600 border border-indigo-100/40"}
                  `}>
                    {policy.icon}
                  </div>
                  <h3 className="font-extrabold text-sm uppercase tracking-tight">{policy.title}</h3>
                  <p className={`text-xs leading-relaxed
                    ${isActive ? "text-slate-300" : "text-gray-500"}
                  `}>
                    {policy.summary}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider mt-auto">
                  <span>Chi tiết hiến chương</span>
                  <ArrowRight size={10} className={`transition-transform duration-300 group-hover:translate-x-1 ${isActive ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Charter View (Glassmorphism card) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[2.5rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.02)] relative min-h-[460px] flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/40 flex items-center justify-center text-indigo-600">
                <FileText size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">CHARTER SPECIFICATION</span>
                <h4 className="font-extrabold text-sm uppercase tracking-tight text-gray-950">
                  {currentPolicy.title}
                </h4>
              </div>
            </div>

            <div className="space-y-5">
              {currentPolicy.details.map((item, index) => (
                <div key={index} className="flex gap-4 items-start text-xs font-sans">
                  <span className="w-5 h-5 rounded-full bg-slate-50 border border-gray-200 flex items-center justify-center text-[9px] font-bold font-mono text-gray-500 shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-gray-650 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-8 text-[10px] text-gray-450 font-sans leading-relaxed">
            Cam kết thuộc Điều khoản Sử dụng Hệ thống TECHVIE. Mọi quyền lợi được pháp luật bảo vệ.
          </div>
        </div>
      </div>
    </div>
  );
}
