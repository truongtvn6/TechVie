import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, Check, HelpCircle, ChevronDown, Users } from 'lucide-react';
import { teamMembers } from '../data';

export default function ContactPage() {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Accordion active index
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "LUMINA có cung cấp giải pháp gia công thiết kế thiết bị tùy chỉnh cho doanh nghiệp không?",
      a: "Có, chúng tôi chuyên thiết kế tinh chỉnh phần cứng tùy chọn, in khắc logo thương hiệu riêng và cấu hình bo mạch cá nhân hóa cho các đối tác doanh nghiệp quy mô toàn cầu. Quý khách hàng doanh nghiệp có thể liên hệ trực tiếp qua form đối tác để nhận báo giá chi tiết."
    },
    {
      q: "Tôi có thể trải nghiệm trực tiếp các sản phẩm Lumina ở đâu?",
      a: "Bạn có thể ghé thăm trực tiếp Phòng trưng bày và Trạm Trải Nghiệm Premium của chúng tôi tại trung tâm Hà Nội và TP. Hồ Chí Minh hoặc liên hệ tổng đài để đăng ký cuộc gọi tư vấn cấu hình trực quan cùng đội ngũ kỹ thuật viên."
    },
    {
      q: "Chính sách bảo hành dòng sản phẩm Lumina như thế nào?",
      a: "Tất cả các sản phẩm laptop, smartphone và phụ kiện hi-end của Lumina đều đi kèm bảo hành chính hãng một đổi một do lỗi nhà sản xuất trong vòng 12 tháng, bảo trì định kỳ và hỗ trợ phục hồi kỹ thuật trọn đời."
    },
    {
      q: "Các dòng phụ kiện của Lumina có tương tương thích tốt với nền tảng khác không?",
      a: "Các thiết bị ngoại vi của Lumina như tai nghe, bàn phím cơ và dock sạc thông minh được thiết kế theo chuẩn kết nối USB-C, Bluetooth 5.3 hiện đại nhất, bảo đảm tương thích hoàn toàn bứt phá trên iOS, Android, macOS và Windows."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim() === '' || formEmail.trim() === '') return;
    setIsSubmitted(true);
    setFormName('');
    setFormEmail('');
    setFormSubject('');
    setFormMessage('');
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 max-w-7xl mx-auto px-6"
    >
      {/* Header */}
      <div className="mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
          LUMINA REPRESENTATIVE CONTACT
        </span>
        <h1 className="text-4xl md:text-5xl font-sans tracking-tighter text-gray-950 font-extrabold">
          Liên Hệ Hợp Tác
        </h1>
        <p className="text-sm text-gray-400 font-sans mt-2">
          Kết nối với chúng tôi để thiết lập cầu nối đổi mới sáng tạo, nhận tư vấn về thiết bị công nghệ hi-end hoặc đăng ký phân phối sản phẩm chính hãng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Branch Info Columns */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Văn Phòng Đại Diện</h3>
            <p className="text-xs text-gray-500 font-sans">
              Chúng tôi hiện diện tại các điểm giao thoa khoa học và đầu tư bán dẫn lớn nhất toàn cầu.
            </p>

            <div className="space-y-4 pt-4 text-xs font-sans text-gray-650">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900">Lumina Lab Switzerland</h4>
                  <p>Lausanne Innovative Hub, 1015 Lausanne, Thụy Sĩ</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900">Lumina Seoul Lab & Factory</h4>
                  <p>Innovation Tower, Gangnam-daero, Seoul, Hàn Quốc</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-secondary" />
                <span>+41 (21) 500-LUMI (Thụy Sĩ)</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-secondary" />
                <span>contact@lumina-lab.com</span>
              </div>
            </div>
          </div>

          {/* Slogan card */}
          <div className="bg-black text-white p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_bottom,rgba(70,72,212,0.30),transparent_70%)] pointer-events-none" />
            <h4 className="text-xl font-bold tracking-tight mb-2">Trở Thành Trọng Tâm</h4>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              &ldquo;Khoảng cách giữa giấc mơ thiết bị tối tân và một sản phẩm công nghệ thực tiễn là khoảng thời gian Lumina tinh tế thiết lập chuẩn mực độ bền cơ học hi-end.&rdquo;
            </p>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-indigo-400 mt-4">— KỸ SƯ TRƯỞNG MINH TRÍ</span>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-950 tracking-tight mb-6">Gửi Thư Yêu Cầu</h3>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
               <motion.form 
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                      Họ và Tên <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nguyễn Văn A"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                      Địa chỉ Email <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="A@example.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                    Chủ đề hợp tác
                  </label>
                  <input 
                    type="text" 
                    placeholder="Bản kế hoạch đại lý bán hàng / Tư vấn cấu hình thiết bị"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">
                    Chi tiết thư yêu cầu
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Hãy mô tả chi tiết mong muốn hợp tác đại lý hoặc câu hỏi về dải sản phẩm điện tử của bạn..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none font-sans"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 py-4 rounded-xl font-sans text-xs uppercase tracking-widest font-black transition-transform flex items-center justify-center gap-2 shadow"
                >
                  Gửi thư yêu cầu hợp trợ
                  <Send size={14} />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-905 mb-2">Thư Yêu Cầu Đã Gửi!</h4>
                <p className="text-sm text-gray-600 font-sans leading-relaxed max-w-md mx-auto">
                  Cảm ơn tin nhắn của bạn. Yêu cầu hỗ trợ đã được gửi thành công đến bộ phận chăm sóc khách hàng của Lumina. Đội ngũ tư vấn viên sẽ liên hệ lại với bạn trong vòng 24 đến 48 giờ làm việc.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="border-t border-gray-200 pt-16 mb-20">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
            THE LEADERSHIP & INNOVATION TEAM
          </span>
          <h2 className="text-3xl font-sans tracking-tighter text-gray-950 font-extrabold flex items-center justify-center gap-2">
            <Users size={28} className="text-secondary animate-pulse" />
            Đội Ngũ Sáng Tạo Lumina
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-sans mt-2 max-w-2xl mx-auto leading-relaxed">
            Hội tụ những chuyên gia công nghệ, kỹ sư đầu ngành và nhà thiết kế xuất sắc cùng chung lý tưởng định hình tương lai các thiết bị cá nhân cao cấp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <h3 className="text-base font-bold text-gray-950 font-sans tracking-tight group-hover:text-secondary transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-secondary uppercase tracking-widest mt-1 mb-3">
                  {member.role}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQs Accordion Grid */}
      <div className="border-t border-gray-200 pt-16 mb-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 mb-8 justify-center">
          <HelpCircle size={24} className="text-secondary" />
          Câu hỏi phổ biến (FAQ)
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-950 font-sans text-sm md:text-base">{faq.q}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-black' : ''}`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <p className="px-6 py-5 text-xs md:text-sm text-gray-600 leading-relaxed font-sans bg-gray-50/50">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
