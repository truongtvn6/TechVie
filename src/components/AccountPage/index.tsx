import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  History, 
  Package, 
  CheckCircle2, 
  LogOut, 
  Laptop, 
  MapPin, 
  Cpu, 
  Clock,
  QrCode,
  BadgeCheck,
  ArrowRight
} from 'lucide-react';
import FloatingAdminButton from './FloatingAdminButton';

// @ts-ignore
import backgroundImage from '/image/huum-8fSitumSVw8-unsplash.jpg';

interface AccountPageProps {
  onNavigate: (tab: any) => void;
  isLoggedIn?: boolean;
  setIsLoggedIn?: (val: boolean) => void;
  userProfile?: any;
  setUserProfile?: (profile: any) => void;
}

export default function AccountPage({ 
  onNavigate,
  isLoggedIn: externalIsLoggedIn,
  setIsLoggedIn: externalSetIsLoggedIn,
  userProfile: externalUserProfile,
  setUserProfile: externalSetUserProfile
}: AccountPageProps) {
  const [localIsLoggedIn, localSetIsLoggedIn] = useState(false);
  const isLoggedIn = externalIsLoggedIn !== undefined ? externalIsLoggedIn : localIsLoggedIn;
  const setIsLoggedIn = externalSetIsLoggedIn !== undefined ? externalSetIsLoggedIn : localSetIsLoggedIn;
  
  // Login input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active sub-tab inside dashboard
  const [accountTab, setAccountTab] = useState<'profile' | 'orders' | 'devices' | 'security'>('profile');

  // Interactive user data state matching Premium TechVie standards
  const [localUserProfile, localSetUserProfile] = useState({
    name: 'Nguyễn Minh Tiến',
    email: 'mintzinfinity898@gmail.com',
    phone: '0912 345 678',
    address: '86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    memberSince: '17-06-2026',
    techvieId: 'TV-992-88X',
    shieldStatus: 'Đang Kích Hoạt (Premium)',
  });
  const userProfile = externalUserProfile !== undefined ? externalUserProfile : localUserProfile;
  const setUserProfile = externalSetUserProfile !== undefined ? externalSetUserProfile : localSetUserProfile;

  // Mock Orders with vivid real-time phase updates
  const [orders] = useState([
    {
      id: 'TV-938294',
      date: '17-06-2026',
      total: '49.800.000₫',
      status: 'Đang lắp ráp chuẩn bị gửi',
      statusType: 'processing',
      items: [
        { name: 'Kính thực tế tăng cường TechVie One', qty: 1, type: 'Kính AR cao cấp' }
      ]
    },
    {
      id: 'TV-728103',
      date: '02-05-2026',
      total: '8.500.000₫',
      status: 'Giao hàng thành công',
      statusType: 'success',
      items: [
        { name: 'Bản sạc không dây 3-in-1 TechVie Dock', qty: 1, type: 'Phụ kiện cao cấp' }
      ]
    }
  ]);

  // Handle simulated login
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!email || !password) {
      setAuthError('Vui lòng điền đầy đủ thông tin đăng nhập.');
      return;
    }

    if (authMode === 'login') {
      if (password.length < 6) {
        setAuthError('Mật khẩu của hệ thống TechVie ID tối thiểu phải dài 6 ký tự.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setUserProfile((prev: any) => ({
          ...prev,
          email: email,
          name: email.split('@')[0].toUpperCase(),
        }));
        setIsLoggedIn(true);
        setIsSubmitting(false);
      }, 1500);
    } else {
      // Register logic
      setIsSubmitting(true);
      setTimeout(() => {
        setUserProfile((prev: any) => ({
          ...prev,
          email: email,
          name: email.split('@')[0].toUpperCase(),
        }));
        setIsLoggedIn(true);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
  };

  return (
    <div className="relative min-h-screen w-full font-body-sm text-body-sm overflow-x-hidden selection:bg-black selection:text-white pb-12">
      {/* Local Liquid Glass Style Definitions */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;700;800;900&family=JetBrains+Mono:wght@700&display=swap');
        
        .font-tech-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0.15em;
          font-weight: 700;
        }
        .text-tech-label {
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0.15em;
          font-weight: 700;
        }
        .font-headline-md {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 18px;
          line-height: 1.3;
          letter-spacing: 0.05em;
          font-weight: 800;
        }
        .text-headline-md {
          font-size: 18px;
          line-height: 1.3;
          letter-spacing: 0.05em;
          font-weight: 800;
        }
        .font-display-hero {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 48px;
          line-height: 1.1;
          letter-spacing: -0.04em;
          font-weight: 900;
        }
        .text-display-hero {
          font-size: 48px;
          line-height: 1.1;
          letter-spacing: -0.04em;
          font-weight: 900;
        }
        .font-body-lg {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
        }
        .text-body-lg {
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
        }
        .font-headline-lg {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 24px;
          line-height: 1.2;
          letter-spacing: 0.1em;
          font-weight: 900;
        }
        .text-headline-lg {
          font-size: 24px;
          line-height: 1.2;
          letter-spacing: 0.1em;
          font-weight: 900;
        }
        .font-body-sm {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 400;
        }
        .text-body-sm {
          font-size: 13px;
          line-height: 1.5;
          font-weight: 400;
        }
        .font-caption-tiny {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 9px;
          line-height: 1;
          letter-spacing: 0.05em;
          font-weight: 900;
        }
        .text-caption-tiny {
          font-size: 9px;
          line-height: 1;
          letter-spacing: 0.05em;
          font-weight: 900;
        }
        .px-container-margin {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }
        .p-card-padding {
          padding: 2rem;
        }
        .gap-grid-gutter {
          gap: 1.5rem;
        }
        .gap-stack-gap {
          gap: 1.5rem;
        }
        .text-glow-indigo {
          text-shadow: 0 0 10px rgba(45, 55, 72, 0.2);
        }
        .custom-glass-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-glass-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.3);
        }
        .custom-glass-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(45, 55, 72, 0.2);
          border-radius: 9999px;
        }
      `}</style>

      {/* Fixed Background Layer */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {/* Atmospheric Blur Overlay for Text Legibility */}
      <div className="fixed inset-0 z-0 bg-white/40 backdrop-blur-[10px]" />

      {/* Main Content Layout Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-container-margin py-12 md:py-20 flex items-center justify-center min-h-[85vh]">
        <AnimatePresence mode="wait">
          
          {/* CASE 1: USER NOT SIGNED IN (Premium Glass Auth Card) */}
          {!isLoggedIn ? (
            <motion.div 
              key="auth-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md mx-auto relative"
            >
              <div className="bg-white/85 backdrop-blur-[40px] border border-white/60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden p-8 space-y-6">
                {/* Specular Highlight Top Edge */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-white/80 via-white/50 to-transparent" />

                <div className="w-16 h-16 bg-[#2d3748] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md transition-transform hover:rotate-12 duration-300">
                  <Cpu size={28} className="animate-pulse" />
                </div>

                <div className="space-y-2 text-center">
                  <h2 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest uppercase">
                    YÊU CẦU ĐĂNG NHẬP
                  </h2>
                  <p className="text-xs text-[#4a5568] max-w-[280px] mx-auto leading-relaxed">
                    Để xem chi tiết hồ sơ cá nhân, bản kê vận chuyển và lịch sử đơn đặt hàng thiết bị cao cấp của bạn.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 pt-2">
                  <a
                    href="#dang-nhap"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('dang-nhap');
                    }}
                    className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-lg font-tech-label text-tech-label text-center transition-all shadow-md active:scale-95 cursor-pointer block"
                  >
                    ĐĂNG NHẬP LIQUID GLASS
                  </a>
                  <a
                    href="#dang-ky"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('dang-ky');
                    }}
                    className="w-full py-4 bg-white/70 hover:bg-white text-[#2d3748] border border-gray-200/50 rounded-lg font-tech-label text-tech-label text-center transition-all active:scale-95 cursor-pointer block"
                  >
                    ĐĂNG KÝ TÀI KHOẢN MỚI
                  </a>
                </div>

                {/* Fast automatic mock login for standard testing */}
                <div className="pt-4 border-t border-white/60 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#4a5568]/70">Đăng nhập tài khoản mẫu nhanh:</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsLoggedIn(true);
                    }}
                    className="mt-2 bg-black text-white hover:bg-gray-800 border border-transparent px-4 py-2 rounded-lg text-[9px] font-tech-label text-tech-label tracking-wider transition-all"
                  >
                    Bỏ qua & Đăng nhập nhanh
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {/* Liquid Glass Master Container */}
              <div className="w-full relative bg-white/85 backdrop-blur-[40px] border border-white/60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                {/* Specular Highlight Top Edge */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter p-card-padding">
                  
                  {/* LEFT SIDEBAR: User ID & Navigation */}
                  <div className="lg:col-span-4 flex flex-col gap-stack-gap">
                    
                    {/* User Master Visual ID Card */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-xl p-5 relative overflow-hidden group shadow-sm">
                      {/* Decorative top line */}
                      <div className="absolute top-0 inset-x-0 h-[2px] bg-gray-300" />
                      
                      <div className="flex flex-col items-center text-center space-y-3">
                        {/* Avatar */}
                        <div className="relative mt-1">
                          <div className="w-16 h-16 bg-white/80 border border-white/60 rounded-full flex items-center justify-center overflow-hidden shadow-inner group-hover:border-gray-400 transition-colors duration-500">
                            <User size={32} className="text-[#4a5568]" />
                          </div>
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#2d3748] border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                            <BadgeCheck size={11} className="text-white" />
                          </div>
                        </div>
                        
                        {/* Name & Details */}
                        <div className="space-y-0.5">
                          <h2 className="font-headline-md text-headline-md text-[#2d3748] uppercase tracking-wider flex items-center justify-center gap-2">
                            {userProfile.name}
                          </h2>
                          <p className="font-tech-label text-tech-label text-[#4a5568]">MÃ SỐ: {userProfile.techvieId}</p>
                        </div>
                        
                        {/* Visual QR Code Area */}
                        <div className="w-full mt-2.5 p-3 bg-white/50 border border-white/60 rounded-xl flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#2d3748] rounded flex items-center justify-center flex-shrink-0">
                            <QrCode size={20} className="text-white" />
                          </div>
                          <div className="text-left flex-grow">
                            <span className="block font-tech-label text-tech-label text-[#2d3748]">SHOWROOM ID</span>
                            <span className="block font-caption-tiny text-caption-tiny text-[#4a5568] mt-0.5">Quét mã nhận diện thành viên</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Metadata */}
                      <div className="mt-4 pt-3 border-t border-white/60 flex flex-col gap-1.5 font-sans text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[#4a5568]">Thành viên từ:</span>
                          <span className="font-tech-label text-tech-label">{userProfile.memberSince}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#4a5568]">Đặc quyền:</span>
                          <span className="font-tech-label text-tech-label text-black px-2 py-1 bg-gray-150 border border-gray-200 rounded">
                            PREMIUM
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Sidebar */}
                    <nav className="bg-white/60 backdrop-blur-md border border-white/60 rounded-xl p-2 flex flex-col shadow-sm gap-1">
                      <button
                        type="button"
                        onClick={() => setAccountTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          accountTab === 'profile'
                            ? 'bg-white/80 border border-white/60 shadow-md text-black'
                            : 'text-[#4a5568] hover:text-black hover:bg-white/40 hover:shadow-sm'
                        }`}
                      >
                        <User size={18} />
                        <span className="font-headline-sm font-bold uppercase tracking-widest text-[11px]">Hồ sơ cá nhân</span>
                        {accountTab === 'profile' && <div className="ml-auto w-[3px] h-5 bg-black rounded-full" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setAccountTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          accountTab === 'orders'
                            ? 'bg-white/80 border border-white/60 shadow-md text-black'
                            : 'text-[#4a5568] hover:text-black hover:bg-white/40 hover:shadow-sm'
                        }`}
                      >
                        <History size={18} />
                        <span className="font-headline-sm font-bold uppercase tracking-widest text-[11px]">Lịch sử đặt hàng</span>
                        {orders.length > 0 && (
                          <span className={`font-tech-label text-tech-label bg-gray-150 px-2 py-0.5 rounded text-black ${accountTab === 'orders' ? 'ml-2' : 'ml-auto'}`}>
                            {orders.length}
                          </span>
                        )}
                        {accountTab === 'orders' && <div className="ml-auto w-[3px] h-5 bg-black rounded-full" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setAccountTab('devices')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          accountTab === 'devices'
                            ? 'bg-white/80 border border-white/60 shadow-md text-black'
                            : 'text-[#4a5568] hover:text-black hover:bg-white/40 hover:shadow-sm'
                        }`}
                      >
                        <Laptop size={18} />
                        <span className="font-headline-sm font-bold uppercase tracking-widest text-[11px]">Thiết bị & sản phẩm</span>
                        {accountTab === 'devices' && <div className="ml-auto w-[3px] h-5 bg-black rounded-full" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setAccountTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          accountTab === 'security'
                            ? 'bg-white/80 border border-white/60 shadow-md text-black'
                            : 'text-[#4a5568] hover:text-black hover:bg-white/40 hover:shadow-sm'
                        }`}
                      >
                        <Settings size={18} />
                        <span className="font-headline-sm font-bold uppercase tracking-widest text-[11px]">Cấu hình mật mã</span>
                        {accountTab === 'security' && <div className="ml-auto w-[3px] h-5 bg-black rounded-full" />}
                      </button>

                      <div className="h-px w-full bg-white/60 my-2" />
                      
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-300"
                      >
                        <LogOut size={18} />
                        <span className="font-headline-sm font-bold uppercase tracking-widest text-[11px]">Đăng xuất ID</span>
                      </button>
                    </nav>
                  </div>

                  {/* RIGHT MAIN PANEL: Dynamic Content Section */}
                  <div className="lg:col-span-8 mt-8 lg:mt-0">
                    <AnimatePresence mode="wait">
                      
                      {/* TAB 1: PROFILE FORM */}
                      {accountTab === 'profile' && (
                        <motion.div
                          key="profile-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-sm"
                        >
                          {/* Top subtle glow */}
                          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/40 rounded-full blur-[80px] pointer-events-none" />
                          
                          {/* Section Header */}
                          <div className="mb-4 border-b border-white/60 pb-2">
                            <h3 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest">HỒ SƠ THÀNH VIÊN PREMIUM</h3>
                            <p className="text-[#4a5568] mt-1 max-w-lg">Các thông tin cá nhân của bạn phục vụ điền nhanh bưu kiện tại trang thanh toán Checkout.</p>
                          </div>

                          {/* Form Grid */}
                          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                            {/* Input: Full Name */}
                            <div className="space-y-1.5">
                              <label className="font-tech-label text-tech-label text-[#4a5568]">HỌ VÀ TÊN</label>
                              <div className="relative group">
                                <input
                                  className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-[#4a5568]/50 shadow-sm"
                                  type="text"
                                  value={userProfile.name}
                                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                                />
                                <div className="absolute inset-0 rounded-lg pointer-events-none border border-transparent group-hover:border-gray-300 transition-colors" />
                              </div>
                            </div>

                            {/* Input: Phone */}
                            <div className="space-y-1.5">
                              <label className="font-tech-label text-tech-label text-[#4a5568]">SỐ ĐIỆN THOẠI LIÊN HỆ</label>
                              <input
                                  className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 shadow-sm"
                                  type="text"
                                  value={userProfile.phone}
                                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                                />
                            </div>

                            {/* Input: Email (Readonly) */}
                            <div className="space-y-1.5 md:col-span-2">
                              <label className="font-tech-label text-tech-label text-[#4a5568]">EMAIL ĐĂNG BẠ</label>
                              <input
                                className="w-full bg-gray-100/50 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#4a5568] cursor-not-allowed shadow-sm"
                                readonly
                                type="email"
                                value={userProfile.email}
                              />
                            </div>

                            {/* Input: Address */}
                            <div className="space-y-1.5 md:col-span-2">
                              <label className="font-tech-label text-tech-label text-[#4a5568]">ĐỊA CHỈ GIAO NHẬN BƯU KIỆN MẶC ĐỊNH</label>
                              <textarea
                                className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 resize-none shadow-sm"
                                rows={2}
                                value={userProfile.address}
                                onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                              />
                            </div>

                            {/* Submit Action */}
                            <div className="md:col-span-2 pt-2">
                              <button
                                className="px-5 py-3 bg-black hover:bg-gray-800 text-white font-tech-label text-tech-label rounded-lg transition-all duration-300 flex items-center gap-2 group shadow-md"
                                type="button"
                                onClick={() => alert('Cập nhật dữ liệu thông tin tài khoản thành công!')}
                              >
                                <span>LƯU HỒ SƠ THÔNG TIN</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </form>

                          {/* Supplementary Info / Shortcut */}
                          <div className="mt-4 pt-3 border-t border-white/60">
                            <div className="bg-white/50 border border-white/60 rounded-xl p-3 flex items-start gap-3 shadow-sm">
                              <div className="w-8 h-8 rounded-lg bg-gray-105 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <MapPin size={16} className="text-black" />
                              </div>
                              <div>
                                <h4 className="font-tech-label text-tech-label text-[#2d3748] mb-0.5">DANH SÁCH ĐỊA CHỈ NHẬN HÀNG LIÊN KẾT</h4>
                                <p className="text-[#4a5568] leading-relaxed">Đây là địa chỉ nhận bưu kiện mặc định của bạn. Bạn có thể thay đổi nhanh bất kỳ lúc nào khi thanh toán đơn hàng.</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* TAB 2: ORDERS LIST */}
                      {accountTab === 'orders' && (
                        <motion.div
                          key="orders-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-sm custom-glass-scrollbar overflow-y-auto max-h-[75vh]"
                        >
                          <div className="mb-4 border-b border-white/60 pb-2">
                            <h3 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest">TIẾN TRÌNH VẬN CHUYỂN ĐƠN HÀNG</h3>
                            <p className="text-[#4a5568] mt-1 max-w-lg">Theo dõi thực tế hành trình đơn sản phẩm cao cấp và trạng thái bàn giao của bạn.</p>
                          </div>

                          <div className="space-y-6 flex-grow">
                            {orders.map((ord) => (
                              <div key={ord.id} className="bg-white/60 backdrop-blur-md border border-white/60 rounded-xl overflow-hidden shadow-sm font-sans text-xs">
                                {/* Top row */}
                                <div className="bg-white/40 border-b border-white/60 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-[#4a5568] tracking-wider block">Đơn hàng</span>
                                    <strong className="block text-[#2d3748] font-extrabold text-sm font-mono">{ord.id}</strong>
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-[#4a5568] tracking-wider block sm:text-right">Ngày đặt</span>
                                    <span className="font-semibold text-[#2d3748]">{ord.date}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-[#4a5568] tracking-wider block sm:text-right">Tổng thanh toán</span>
                                    <strong className="text-black font-black font-mono text-sm block sm:text-right">{ord.total}</strong>
                                  </div>
                                </div>

                                {/* Middle row */}
                                <div className="p-6 space-y-4">
                                  {ord.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                      <div className="w-10 h-10 bg-[#2d3748] rounded-lg flex items-center justify-center border border-gray-200/20 text-white">
                                        <Package size={18} />
                                      </div>
                                      <div>
                                        <h4 className="font-extrabold text-[#2d3748]">{item.name}</h4>
                                        <p className="text-[10px] uppercase tracking-wider text-[#4a5568] mt-0.5">{item.type} • Số lượng: {item.qty}</p>
                                      </div>
                                    </div>
                                  ))}

                                  {/* Progress Status trackline */}
                                  <div className="pt-4 border-t border-white/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2.5 text-xs text-[#2d3748]">
                                      {ord.statusType === 'processing' ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                                      ) : (
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                      )}
                                      <span className="font-extrabold text-[#2d3748]">
                                        Trạng thái: <strong className="text-black font-black uppercase text-[10px]">{ord.status}</strong>
                                      </span>
                                    </div>

                                    <button 
                                      type="button"
                                      onClick={() => alert(`Sản phẩm mã ${ord.id} đang nằm trong lộ trình bưu tá giao hàng tận nơi nguyên seal.`)}
                                      className="text-[10px] font-tech-label text-tech-label text-black bg-white/80 border border-white/60 hover:bg-white px-4 py-2 rounded-lg transition-all shadow-sm"
                                    >
                                      Xem Vị Trí Vận Chuyển
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* TAB 3: DEVICES & PRODUCTS */}
                      {accountTab === 'devices' && (
                        <motion.div
                          key="devices-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full"
                        >
                          <div className="bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-sm">
                            <div className="mb-4 border-b border-white/60 pb-2">
                              <h3 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest">THIẾT BỊ HOẠT ĐỘNG & CHỈ SỐ</h3>
                              <p className="text-[#4a5568] mt-1 max-w-lg">Theo dõi bảo hành phần cứng, trạng thái nâng cấp và cấu hình thiết bị của bạn.</p>
                            </div>

                            <div className="border border-white/20 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start bg-slate-950 text-white relative overflow-hidden shadow-lg">
                              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                              
                              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 flex-shrink-0 animate-pulse">
                                <Cpu size={22} />
                              </div>
                              
                              <div className="space-y-3 flex-grow min-w-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-[8px] uppercase font-bold tracking-widest text-indigo-400 font-mono">BẢO HÀNH CHỦ CHỐT</span>
                                    <h4 className="font-sans font-black text-base text-white uppercase tracking-tight mt-0.5">TECHVIE INTEGRAL CHIP v1.2</h4>
                                  </div>
                                  <span className="bg-emerald-600 text-white text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-500">
                                    CHẤT LƯỢCO CAO
                                  </span>
                                </div>
                                
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                  Có chứa tấm nền OLED siêu sáng cực đại dải màu vô hạn kết hợp chip xử lý thế hệ mới Core v2. Chân thực sắc nét đến từng điểm pixel cảm thị.
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-[10px] text-slate-300 font-mono">
                                  <div>
                                    <span className="block text-slate-500 uppercase font-bold text-[8px] mb-1">Tần số quét màn</span>
                                    <strong className="text-white">120 Hz</strong>
                                  </div>
                                  <div>
                                    <span className="block text-slate-500 uppercase font-bold text-[8px] mb-1">Chuẩn truyền dẫn</span>
                                    <strong className="text-white">UWB v2.0</strong>
                                  </div>
                                  <div>
                                    <span className="block text-slate-500 uppercase font-bold text-[8px] mb-1 font-sans">Hạn bảo hành</span>
                                    <strong className="text-white font-sans font-normal">16 - 06 - 2027</strong>
                                  </div>
                                  <div>
                                    <span className="block text-slate-500 uppercase font-bold text-[8px] mb-1">Độ phân giải</span>
                                    <strong className="text-white">4K UltraHD</strong>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-white/50 border border-white/60 rounded-xl flex items-start gap-3 text-[#2d3748] text-[11px] leading-relaxed shadow-sm">
                              <Clock size={16} className="text-black flex-shrink-0 mt-0.5" />
                              <div>
                                <strong>Bạn cần đặt mua thêm loại phụ kiện nào?</strong>
                                <p className="text-[#4a5568] mt-0.5">Mọi bộ phụ kiện cao cấp và củ sạc hi-end của TechVie đều đảm bảo truyền dẫn sạc mượt mà đồng bộ. Hãy duyệt sảnh để bổ sung mục giỏ hàng.</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* TAB 4: SECURITY CONFIG */}
                      {accountTab === 'security' && (
                        <motion.div
                          key="security-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full"
                        >
                          <div className="bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-sm">
                            <div className="mb-4 border-b border-white/60 pb-2">
                              <h3 className="font-headline-lg text-headline-lg text-[#2d3748] tracking-widest">BẢO MẬT & MÃ HÓA QUANTUM</h3>
                              <p className="text-[#4a5568] mt-1 max-w-lg">Cập nhật mật khẩu kết nối hoặc thiết lập đặc cách xác thực hai cổng vân quang học.</p>
                            </div>

                            <div className="space-y-4 flex-grow">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="font-tech-label text-tech-label text-[#4a5568]">MẬT KHẨU HIỆN TẠI</label>
                                  <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-[#4a5568]/30 shadow-sm"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="font-tech-label text-tech-label text-[#4a5568]">MẬT KHẨU MỚI BẢO VỆ</label>
                                  <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/70 border border-gray-200/50 rounded-lg px-3.5 py-2.5 text-[#2d3748] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-[#4a5568]/30 shadow-sm"
                                  />
                                </div>
                              </div>

                              <div className="p-3 bg-white/50 border border-white/60 rounded-xl flex items-start gap-3 shadow-sm">
                                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-[#4a5568] leading-relaxed">
                                  Xác thực thành viên TechVie ID vĩnh viễn được tự động áp dụng ưu đãi giảm giá lên tới 10% tại tất cả các hệ thống showroom và trạm trải nghiệm TechVie chính hãng trên toàn cầu.
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-white/60">
                              <button
                                type="button"
                                onClick={() => alert('Mật khẩu của bạn đã được cấu định an toàn!')}
                                className="px-5 py-3 bg-black hover:bg-gray-800 text-white font-tech-label text-tech-label rounded-lg transition-all duration-300 flex items-center gap-2 group shadow-md"
                              >
                                <span>CẤU ĐỊNH MẬT KHẨU</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Back to Admin panel button for logged-in Administrators - Draggable - ONLY on account/profile page */}
      {isLoggedIn && userProfile?.role === 'admin' && (
        <FloatingAdminButton onNavigate={onNavigate} />
      )}
    </div>
  );
}
