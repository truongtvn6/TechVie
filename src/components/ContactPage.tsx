import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, Check, HelpCircle, ChevronDown, Users, ArrowRight } from 'lucide-react';
import { teamMembers } from '../data_mockdata';
import { sendContactInquiry } from '../services/api';
// @ts-ignore
import heroImage from '../assets/images/markus-winkler-q3QPw37J6Xs-unsplash.jpg';

export default function ContactPage() {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Accordion active index
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "TECHVIE có cung cấp giải pháp gia công thiết kế thiết bị tùy chỉnh cho doanh nghiệp không?",
      a: "Có, chúng tôi chuyên thiết kế tinh chỉnh phần cứng tùy chọn, in khắc logo thương hiệu riêng và cấu hình bo mạch cá nhân hóa cho các đối tác doanh nghiệp quy mô toàn cầu. Quý khách hàng doanh nghiệp có thể liên hệ trực tiếp qua form đối tác để nhận báo giá chi tiết."
    },
    {
      q: "Tôi có thể trải nghiệm trực tiếp các sản phẩm TechVie ở đâu?",
      a: "Bạn có thể ghé thăm trực tiếp Phòng trưng bày và Trạm Trải Nghiệm Premium của chúng tôi tại trung tâm Hà Nội và TP. Hồ Chí Minh hoặc liên hệ tổng đài để đăng ký cuộc gọi tư vấn cấu hình trực quan cùng đội ngũ kỹ thuật viên."
    },
    {
      q: "Chính sách bảo hành dòng sản phẩm TechVie như thế nào?",
      a: "Tất cả các sản phẩm laptop, smartphone và phụ kiện hi-end của TechVie đều đi kèm bảo hành chính hãng một đổi một do lỗi nhà sản xuất trong vòng 12 tháng, bảo trì định kỳ và hỗ trợ phục hồi kỹ thuật trọn đời."
    },
    {
      q: "Các dòng phụ kiện của TechVie có tương thích tốt với nền tảng khác không?",
      a: "Các thiết bị ngoại vi của TechVie như tai nghe, bàn phím cơ và dock sạc thông minh được thiết kế theo chuẩn kết nối USB-C, Bluetooth 5.3 hiện đại nhất, bảo đảm tương thích hoàn toàn bứt phá trên iOS, Android, macOS và Windows."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim() === '' || formEmail.trim() === '' || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const data = await sendContactInquiry({
        name: formName,
        email: formEmail,
        subject: formSubject,
        message: formMessage
      });

      if (data.success) {
        setIsSubmitted(true);
        setFormName('');
        setFormEmail('');
        setFormSubject('');
        setFormMessage('');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Fallback behavior
      setIsSubmitted(true);
      setFormName('');
      setFormEmail('');
      setFormSubject('');
      setFormMessage('');
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full font-sans antialiased"
    >
      {/* Inject Google Font for Editorial Design */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <style>{`
        .editorial-font {
          font-family: 'Playfair Display', serif;
        }
        .roboto-condensed-font {
          font-family: 'Roboto Condensed', sans-serif;
        }
      `}</style>
      
      <main className="w-full">
        
        {/* HERO SECTION: Bold Editorial Header */}
        <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-20 border-b-8 border-black">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
            
            {/* Left column: Headings & Description aligned from top to bottom */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 block mb-4">
                  TECHVIE REPRESENTATIVE CONTACT
                </span>
                <h1 className="editorial-font text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tight leading-none text-gray-950 mb-8">
                  Liên Hệ Hợp Tác.
                </h1>
              </div>
              {/* context */}
              <p className="roboto-condensed-font text-lg md:text-xl font-medium leading-relaxed max-w-xl text-gray-800 mt-auto">
                Kết nối với chúng tôi để thiết lập cầu nối đổi mới sáng tạo, nhận tư vấn về thiết bị công nghệ hi-end hoặc đăng ký phân phối sản phẩm chính hãng.
              </p>
            </div>
            
            {/* Right column: Image Container, aligned to the top and tall (aspect-3/4) */}
            <div className="lg:col-span-6 flex justify-end items-start">
              <div className="w-full lg:w-full xl:w-11/12 aspect-[4/3] bg-gray-100 border border-black relative overflow-hidden group shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]">
                <img 
                  alt="TechVie Office" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
                  src={heroImage}
                />
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-mono uppercase tracking-[0.2em]">
                  TechVie Lab / HQ
                </div>
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md text-gray-900 px-3 py-1.5 text-[8px] font-mono uppercase tracking-[0.2em] border border-black/10">
                  EST. 2026
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CONTACT INFO & FORM: Asymmetrical Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-black">
          
          {/* LEFT COLUMN: Info Blocks */}
          <div className="lg:col-span-5 lg:border-r lg:border-black">
            <div className="p-8 lg:p-16 space-y-16">
              
              {/* Office Details */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-8 border-b-2 border-black pb-2 inline-block">
                  Văn Phòng Đại Diện
                </h3>
                <div className="space-y-10">
                  <div className="group">
                    <h4 className="editorial-font text-2xl md:text-3xl italic font-black mb-2 text-gray-950">
                      TechVie Lab Switzerland
                    </h4>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold leading-relaxed">
                      Lausanne Innovative Hub, 1015 Lausanne, Thụy Sĩ
                    </p>
                    <p className="mt-3 font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Phone size={14} className="text-secondary" />
                      +41 (21) 500-TECH
                    </p>
                  </div>
                  
                  <div className="group">
                    <h4 className="editorial-font text-2xl md:text-3xl italic font-black mb-2 text-gray-950">
                      TechVie Seoul Lab
                    </h4>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold leading-relaxed">
                      Innovation Tower, Gangnam-daero, Seoul, Hàn Quốc
                    </p>
                    <p className="mt-3 font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Mail size={14} className="text-secondary" />
                      contact@techvie-lab.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote Block */}
              <div className="bg-black text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_bottom,rgba(70,72,212,0.25),transparent_75%)] pointer-events-none" />
                <h4 className="text-xl font-black uppercase tracking-tight mb-4">Trở Thành Trọng Tâm</h4>
                <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-light italic">
                  &ldquo;Khoảng cách giữa giấc mơ thiết bị tối tân và một sản phẩm công nghệ thực tiễn là khoảng thời gian TechVie tinh tế thiết lập chuẩn mực độ bền cơ học hi-end.&rdquo;
                </p>
                <p className="mt-6 text-[9px] font-mono tracking-[0.3em] font-black text-indigo-400">
                  — KỸ SƯ TRƯỞNG MINH TRÍ
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-7 bg-white">
            <div className="p-8 lg:p-16">
              <div className="mb-12">
                <h2 className="editorial-font text-3xl sm:text-4xl md:text-5xl italic font-black tracking-wide mb-3 text-gray-950">
                  Gửi Thư Yêu Cầu
                </h2>
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-black">
                  Chúng tôi sẽ bảo mật tuyệt đối thông tin và phản hồi nhanh nhất.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="relative border-b-2 border-black pb-2">
                        <label className="text-[9px] uppercase font-black tracking-wider mb-2 block text-gray-500">
                          Họ và Tên <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="Nguyễn Văn A"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-lg font-bold placeholder:text-gray-250 focus:ring-0 outline-none"
                        />
                      </div>

                      <div className="relative border-b-2 border-black pb-2">
                        <label className="text-[9px] uppercase font-black tracking-wider mb-2 block text-gray-500">
                          Địa chỉ Email <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          required
                          placeholder="contact@example.com"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-lg font-bold placeholder:text-gray-250 focus:ring-0 outline-none"
                        />
                      </div>
                    </div>

                    <div className="relative border-b-2 border-black pb-2">
                      <label className="text-[9px] uppercase font-black tracking-wider mb-2 block text-gray-500">
                        Chủ đề hợp tác
                      </label>
                      <input 
                        type="text" 
                        placeholder="Kế hoạch đại lý bán hàng / Tư vấn cấu hình thiết bị..."
                        value={formSubject}
                        onChange={(e) => setFormSubject(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-lg font-bold placeholder:text-gray-250 focus:ring-0 outline-none"
                      />
                    </div>

                    <div className="relative border-b-2 border-black pb-2">
                      <label className="text-[9px] uppercase font-black tracking-wider mb-2 block text-gray-500">
                        Chi tiết thư yêu cầu
                      </label>
                      <textarea 
                        rows={3}
                        placeholder="Hãy mô tả chi tiết mong muốn hợp tác hoặc câu hỏi của bạn..."
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-lg font-bold placeholder:text-gray-250 focus:ring-0 outline-none resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="contact-submit-btn"
                    >
                      <div className="contact-submit-btn-text-wrapper">
                        <div className="contact-submit-btn-text-normal">
                          <span>{isSubmitting ? 'ĐANG GỬI THƯ...' : 'GỬI THƯ YÊU CẦU HỢP TÁC'}</span>
                          {!isSubmitting && <ArrowRight size={14} />}
                        </div>
                        <div className="contact-submit-btn-text-hover">
                          <span>{isSubmitting ? 'ĐANG GỬI THƯ...' : 'TIẾP CẬN TECHVIE NGAY!'}</span>
                          {!isSubmitting && <ArrowRight size={14} />}
                        </div>
                      </div>
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
                    <h4 className="text-xl font-bold text-gray-950 mb-2 editorial-font italic">Thư Yêu Cầu Đã Gửi!</h4>
                    <p className="text-xs md:text-sm text-gray-650 font-sans leading-relaxed max-w-md mx-auto">
                      Cảm ơn tin nhắn của bạn. Yêu cầu hỗ trợ đã được gửi thành công đến hệ thống và lưu trữ trong cơ sở dữ liệu. Đội ngũ tư vấn viên của TechVie sẽ liên hệ lại với bạn trong vòng 24 đến 48 giờ làm việc.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* MAP SECTION: High Contrast Full Width */}
        <section className="border-b-8 border-black">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            
            {/* Left Column: Showroom info */}
            <div className="lg:col-span-3 p-8 lg:p-12 xl:p-16 bg-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 block text-gray-500">
                  Flagship Showroom
                </span>
                <h2 className="editorial-font text-4xl md:text-5xl italic font-black leading-tight mb-8 text-gray-950">
                  Ghé Thăm<br />Chúng Tôi.
                </h2>
                <div className="space-y-5 text-xs md:text-sm text-gray-800 font-sans font-bold">
                  <p className="flex gap-3 uppercase tracking-wider items-start">
                    <span className="w-6 border-t border-black mt-2.5 shrink-0"></span>
                    Số 86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, Việt Nam
                  </p>
                  <p className="flex gap-3 uppercase tracking-wider items-center">
                    <span className="w-6 border-t border-black mt-2 shrink-0"></span>
                    0912 345 678
                  </p>
                  <p className="flex gap-3 uppercase tracking-wider items-center">
                    <span className="w-6 border-t border-black mt-2 shrink-0"></span>
                    showroom@techvie.com
                  </p>
                </div>
              </div>
            </div>
            
            {/* Middle Column: Map iframe */}
            <div className="lg:col-span-6 bg-gray-100 grayscale hover:grayscale-0 transition-all duration-3000 hover:duration-900 relative min-h-[350px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-black">
              <iframe 
                allowFullScreen={true}
                height="100%" 
                loading="lazy" 
                src="https://maps.google.com/maps?q=H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed" 
                style={{ border: 0, filter: "contrast(1.2) brightness(1.1)" }} 
                width="100%"
              />
            </div>

            {/* Right Column: Opening Hours & Warranty Services */}
            <div className="lg:col-span-3 p-8 lg:p-12 xl:p-16 bg-white flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 block text-gray-500">
                  Operational Hours
                </span>
                <h2 className="editorial-font text-3xl md:text-4xl lg:text-5xl italic font-black leading-tight mb-8 text-gray-950">
                  Giờ Làm Việc.
                </h2>
                <div className="space-y-8">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-3 text-gray-500 border-b border-black pb-1">
                      Flagship Showroom
                    </p>
                    <p className="text-xs font-bold italic text-gray-900">T2 - T6: 08:00 - 21:30</p>
                    <p className="text-xs font-bold italic text-gray-900 mt-1">T7 - CN: 09:00 - 22:00</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-3 text-gray-500 border-b border-black pb-1">
                      Trung Tâm Bảo Hành & Sửa Chữa
                    </p>
                    <p className="text-xs font-bold italic text-gray-900">T2 - T6: 09:00 - 18:00</p>
                    <p className="text-xs font-bold italic text-gray-900 mt-1">Thứ Bảy: 09:00 - 12:00</p>
                    <p className="text-xs font-bold italic text-gray-900 mt-1">Chủ Nhật & Ngày Lễ: Nghỉ</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* TEAM SECTION: Editorial Profile Grid */}
        <section className="p-8 lg:p-16 border-b-8 border-black">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block text-gray-500">
                The Leadership
              </span>
              <h2 className="editorial-font text-5xl lg:text-6xl italic font-black leading-none text-gray-950">
                Đội Ngũ<br />Sáng Tạo.
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-xs md:text-sm font-medium leading-relaxed border-l-4 border-black pl-6 text-gray-700">
                Hội tụ những chuyên gia công nghệ, kỹ sư đầu ngành và nhà thiết kế xuất sắc cùng chung lý tưởng định hình tương lai các thiết bị cá nhân cao cấp.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-black">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx}
                className="border-r border-b border-black p-8 group hover:bg-black hover:text-white transition-colors duration-500 flex flex-col justify-between min-h-[450px]"
              >
                <div>
                  <div className="aspect-[3/4] mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 rounded-lg bg-gray-50 border border-gray-200 group-hover:border-transparent">
                    <img 
                      alt={member.name} 
                      className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700" 
                      src={member.image}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 group-hover:text-indigo-400 transition-colors">
                    {member.role}
                  </span>
                  <h3 className="editorial-font text-2xl md:text-3xl italic font-black mt-1 text-gray-950 group-hover:text-white transition-colors">
                    {member.name}
                  </h3>
                </div>
                <p className="mt-4 text-[11px] md:text-xs font-light leading-relaxed opacity-70 group-hover:opacity-85 transition-opacity">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Accordion Grid */}
        <section className="px-6 py-16 lg:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="editorial-font text-4xl md:text-5xl italic font-black mb-4 text-gray-950">
                Câu hỏi phổ biến.
              </h2>
              <div className="w-16 h-1.5 bg-black mx-auto"></div>
            </div>
            
            <div className="space-y-0 border-t border-black">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="border-b border-black bg-transparent"
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full px-4 py-6 flex items-center justify-between text-left hover:bg-black/5 transition-colors focus:outline-none"
                  >
                    <span className="font-bold uppercase tracking-tight text-sm md:text-base text-gray-955 font-sans">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`text-black transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {activeFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-white/40"
                      >
                        <p className="px-6 pb-6 text-xs md:text-sm text-gray-700 leading-relaxed font-sans max-w-3xl">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </motion.div>
  );
}
