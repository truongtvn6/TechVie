import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { products } from '../data';
import { Product, TabType } from '../types';
import { ArrowLeftRight, Activity, Cpu, Compass, ArrowRight, Check, Send } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: TabType) => void;
  onAddToCart: (product: Product) => void;
}

export default function HomePage({ onNavigate, onAddToCart }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);

  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'
  ]);

  // Fetch slider images dynamically from backend express API
  useEffect(() => {
    fetch('/api/hero-images')
      .then((res) => {
        if (!res.ok) throw new Error('API server unreachable');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        }
      })
      .catch((error) => {
        console.warn('Fallback to local slide images used safely. Detal:', error);
      });
  }, []);

  // Rotating slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() === '') return;
    setShowSubscriptionSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => {
      setShowSubscriptionSuccess(false);
    }, 4000);
  };

  return (
    <div className="w-full">
      {/* Hero Slideshow Section */}
      <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden bg-gray-150">
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentSlide}
              src={images[currentSlide]} 
              alt={`Lumina Slideshow ${currentSlide + 1}`}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* Ambient Overlay & Radial highlight, matching Vietnamese Lumina presentation card */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-black/10 backdrop-brightness-95 flex items-center justify-start px-6 md:px-margin-desktop z-10">
          <div className="max-w-7xl mx-auto w-full flex">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl bg-white/45 backdrop-blur-[35px] p-8 md:p-14 rounded-3xl border border-white/60 shadow-[0_30px_70px_rgba(0,0,0,0.1)] relative"
            >
              <div className="absolute top-0 right-0 p-6 flex flex-col items-end opacity-35 text-[9px] font-mono tracking-widest text-gray-800">
                <span>MÃ LƯỚI: 48.85 / 2.35</span>
                <div className="w-12 h-px bg-gray-800 mt-1"></div>
              </div>
              
              <div className="absolute -left-px top-1/4 h-24 w-1 bg-gradient-to-b from-transparent via-secondary/40 to-transparent"></div>
              
              <span className="text-xs uppercase tracking-[0.4em] text-secondary font-bold mb-6 block flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                Hệ Sinh Thái Độc Bản v2.0
              </span>

              <h1 className="text-5xl md:text-6xl font-sans font-black tracking-tighter text-gray-900 mb-6 leading-[1.05]">
                Công Nghệ <br />Hiện Đại.
              </h1>

              <p className="font-sans text-gray-650 text-sm leading-relaxed mb-8 max-w-sm">
                Kiến tạo phong cách số tối giản, nâng tầm hiệu suất làm việc và giải trí hàng ngày với hệ sinh thái thiết bị điện tử đỉnh cao từ Lumina.
              </p>

              {/* Specification stats box in vietnamese template */}
              <div className="grid grid-cols-2 gap-8 mb-8 border-y border-black/5 py-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                    CHIP XỬ LÝ M1
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-baseline gap-1">
                    3.6
                    <span className="text-xs font-normal text-gray-600 font-mono">GHz</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                    MÀN HÌNH ĐỘ NÉT
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-baseline gap-1">
                    4K
                    <span className="text-xs font-normal text-gray-600 font-mono">UHD</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onNavigate('brand')}
                  className="bg-black text-white hover:bg-gray-800 px-10 py-4 rounded-full font-sans font-black uppercase tracking-widest text-[13px] hover:scale-102 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Khám Phá Thương Hiệu
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => onNavigate('products')}
                  className="bg-white/80 hover:bg-white text-gray-900 border border-gray-300 px-8 py-4 rounded-full font-sans font-extrabold uppercase tracking-wider text-[13px] transition-all flex items-center justify-center"
                >
                  Bộ Sưu Tập
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Circular progress indicators underneath matching vietnamese design dot indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx 
                  ? 'bg-black w-6 scale-110' 
                  : 'bg-black/25 hover:bg-black/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Electronics Collection */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
              SẢN PHẨM NỔI BẬT
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tighter text-gray-950 font-extrabold">
              Thiết Bị Lumina Premium
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('products')}
            className="mt-4 md:mt-0 text-[13px] uppercase tracking-[0.3em] font-black border-b-2 border-primary pb-1.5 hover:opacity-75 transition-opacity"
          >
            Đến Cửa Hàng
          </button>
        </div>

        {/* 3 Core Products matching Vietnamese template cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => (
            <div 
              key={product.id}
              className="group bg-white/40 border border-gray-200 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:-translate-y-2 h-[520px] relative overflow-hidden"
            >
              {/* Product Category tag & Specs summary */}
              <div className="absolute top-6 left-8 flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-[9px] font-mono text-gray-400">
                  {product.specs[0].label}: {product.specs[0].value}
                </span>
              </div>

              {/* Large Product image centered and scaled on hover */}
              <div className="h-60 mt-4 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-52 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Title & Price & Purchase Controls */}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-secondary transition-colors truncate">
                  {product.name}
                </h3>
                <p className="text-lg font-black text-gray-800 mt-1 mb-6">
                  {product.price.toLocaleString('vi-VN')}₫
                </p>

                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-black text-white hover:bg-gray-900 font-sans text-xs uppercase tracking-widest font-black py-4 rounded-full flex items-center justify-center gap-2 shadow transition-all duration-300"
                >
                  Thêm Vào Giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exquisite Brand Promo Card Banner */}
      <section className="px-6 max-w-7xl mx-auto mb-20">
        <div className="bg-gray-100 rounded-[3rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
              CHẾ TÁC PHẦN CỨNG TIÊN PHONG
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tighter text-gray-950 font-black leading-tight">
              Bật Sáng Hiệu Năng Cùng Lumina Lab.
            </h2>
            <p className="text-gray-650 font-sans text-sm leading-relaxed mt-6 mb-8">
              Mỗi bảng mạch vi xử lý, mỗi góc bo góc nẹp hợp kim trên các dòng Laptop, điện thoại và phụ kiện của Lumina đều tuân thủ các quy tắc thiết kế công thái học khắt khe nhất. Đảm bảo độ bền cơ học ấn tượng và hiệu năng xử lý vi mạch hoàn hảo.
            </p>
            <div className="flex flex-wrap gap-8 mb-8 border-t border-gray-200 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-secondary">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Chuẩn Âu Thụy Sĩ</h4>
                  <p className="text-xs text-gray-500">Gia công sắc sảo đến từng góc cạnh</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-secondary">
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Hệ Sinh Thái Silicon</h4>
                  <p className="text-xs text-gray-500">Vi mạch đồng bộ, tối ưu năng lượng</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('brand')}
              className="bg-black text-white hover:bg-gray-800 font-sans text-xs uppercase tracking-widest font-black px-8 py-3.5 rounded-full flex items-center gap-2"
            >
              Xem Qui Trình Chế Tác Lab
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="aspect-video lg:aspect-square overflow-hidden rounded-[2rem] bg-gray-200 border border-gray-300 shadow relative">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
              alt="Lumina Laboratory equipment" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Luxurious Newsletter subscription matching modern grid template details */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-sans tracking-tighter text-gray-950 font-black leading-none uppercase mb-6">
              Đón Đầu <br />Công Nghệ.
            </h2>
            <p className="text-gray-650 font-sans text-sm leading-relaxed max-w-sm">
              Đăng ký để nhận quyền truy cập sớm vào các đợt phát hành sản phẩm mới, chương trình ưu đãi đặc quyền và cập nhật phần mềm sớm nhất.
            </p>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {!showSubscriptionSuccess ? (
                <motion.form 
                  key="subscribe-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-4 max-w-md w-full"
                >
                  <label htmlFor="newsletter-email" className="sr-only">Địa chỉ Email</label>
                  <input 
                    id="newsletter-email"
                    type="email" 
                    placeholder="email@lumina.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="bg-white/50 backdrop-blur-md border border-gray-300 focus:border-black rounded-2xl px-6 py-4 outline-none font-sans text-base placeholder:text-gray-400 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="bg-black text-white hover:bg-gray-900 px-8 py-4 rounded-2xl font-sans text-xs uppercase tracking-[0.3em] font-black w-full flex items-center justify-center gap-2 transition-transform h-14"
                  >
                    Tham Gia Đặc Quyền
                    <Send size={14} />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="subscribe-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-8 text-center max-w-md"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                    <Check size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Đăng Ký Thành Công!</h4>
                  <p className="text-xs text-gray-600 font-sans leading-relaxed">
                    Chào mừng bạn đến với hệ sinh thái Lumina. Thư mời đặc quyền dành cho thành viên VIP và các thông số ưu đãi sẽ sớm gửi tới hòm thư của bạn.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
