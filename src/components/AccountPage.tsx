import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  History, 
  Package, 
  ShieldAlert, 
  CheckCircle2, 
  LogOut, 
  Lock, 
  Mail, 
  KeyRound, 
  BadgeCheck, 
  MapPin, 
  Laptop, 
  Camera, 
  ArrowRight, 
  QrCode, 
  Cpu, 
  Phone,
  HelpCircle,
  Clock
} from 'lucide-react';

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

  // Interactive user data state matching Premium Lumina standards
  const [localUserProfile, localSetUserProfile] = useState({
    name: 'Nguyễn Minh Tiến',
    email: 'mintzinfinity898@gmail.com',
    phone: '0912 345 678',
    address: '86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    memberSince: '17-06-2026',
    luminaId: 'LM-992-88X',
    shieldStatus: 'Đang Kích Hoạt (Premium)',
  });
  const userProfile = externalUserProfile !== undefined ? externalUserProfile : localUserProfile;
  const setUserProfile = externalSetUserProfile !== undefined ? externalSetUserProfile : localSetUserProfile;

  // Mock Orders with vivid real-time phase updates
  const [orders] = useState([
    {
      id: 'LMN-938294',
      date: '17-06-2026',
      total: '49.800.000₫',
      status: 'Đang lắp ráp chuẩn bị gửi',
      statusType: 'processing',
      items: [
        { name: 'Kính thực tế tăng cường Lumina One', qty: 1, type: 'Kính AR cao cấp' }
      ]
    },
    {
      id: 'LMN-728103',
      date: '02-05-2026',
      total: '8.500.000₫',
      status: 'Giao hàng thành công',
      statusType: 'success',
      items: [
        { name: 'Bản sạc không dây 3-in-1 Lumina Dock', qty: 1, type: 'Phụ kiện cao cấp' }
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
        setAuthError('Mật khẩu của hệ thống Lumina ID tối thiểu phải dài 6 ký tự.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setUserProfile(prev => ({
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
        setUserProfile(prev => ({
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
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
      <AnimatePresence mode="wait">
        
        {/* CASE 1: USER NOT SIGNED IN AND INVITED TO NEW LIQUID GLASS AUTH */}
        {!isLoggedIn ? (
          <motion.div 
            key="auth-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto text-center font-sans"
          >
            <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-[0_12px_45px_rgba(0,0,0,0.03)] space-y-6">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-md transition-transform hover:rotate-12 duration-300">
                <Cpu size={28} className="animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                  YÊU CẦU ĐĂNG NHẬP
                </h2>
                <p className="text-xs text-gray-500 max-w-[280px] mx-auto leading-relaxed">
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
                  className="w-full py-4 bg-black hover:bg-black/90 text-white rounded-xl text-xs uppercase tracking-widest font-black transition-all shadow-md active:scale-95 cursor-pointer block"
                >
                  ĐĂNG NHẬP LIQUID GLASS
                </a>
                <a
                  href="#dang-ky"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('dang-ky');
                  }}
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-150 rounded-xl text-xs uppercase tracking-widest font-black transition-all active:scale-95 cursor-pointer block"
                >
                  ĐĂNG KÝ TÀI KHOẢN MỚI
                </a>
              </div>

              {/* Fast automatic mock login for standard testing */}
              <div className="pt-2 border-t border-gray-100 flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Đăng nhập tài khoản mẫu nhanh:</span>
                <button 
                  onClick={() => {
                    setIsLoggedIn(true);
                  }}
                  className="mt-2 bg-indigo-50 border border-indigo-100/60 hover:bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all"
                >
                  Bỏ qua & Đăng nhập nhanh
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          
          /* CASE 2: LOGGED IN USER INTERFACE PORTAL */
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          >
            {/* Left side: Profile sidebar & navigation list */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: User master visual ID card */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm overflow-hidden relative">
                
                {/* Visual decorative lines like tech passport ID */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500" />
                
                <div className="flex flex-col items-center text-center space-y-4 pt-2">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {/* Generative high-craft visual representation */}
                      <User size={38} className="text-gray-400" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold" title="Lumina System Verified">
                      ✓
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <h3 className="font-extrabold text-gray-900 font-sans tracking-tight text-lg">{userProfile.name}</h3>
                      <BadgeCheck size={16} className="text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-[#9d9ea5] uppercase">
                      ID: {userProfile.luminaId}
                    </span>
                  </div>

                  {/* Visual QR scan code for showroom or checkups */}
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3 w-full text-left">
                    <QrCode size={36} className="text-gray-800 flex-shrink-0" />
                    <div className="min-w-0 flex-grow font-sans text-[10px]">
                      <span className="block font-bold text-gray-800">Mã Số Showroom Lumina</span>
                      <p className="text-gray-400 truncate mt-0.5">Quét mã nhận diện thành viên ưu đãi tại showroom mua sắm</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 font-sans text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Thành viên từ:</span>
                    <strong className="text-gray-900 font-semibold">{userProfile.memberSince}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Đặc quyền bảo hộ:</span>
                    <span className="text-emerald-600 font-extrabold">{userProfile.shieldStatus}</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Action Buttons */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-3 space-y-1 shadow-sm font-sans">
                <button
                  onClick={() => setAccountTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-left transition-all ${
                    accountTab === 'profile' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <User size={15} />
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={() => setAccountTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-left transition-all ${
                    accountTab === 'orders' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <History size={15} />
                  Lịch sử đặt hàng
                  {orders.length > 0 && (
                    <span className="ml-auto bg-indigo-50 text-indigo-700 hover:bg-black font-semibold text-[9px] px-2 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setAccountTab('devices')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-left transition-all ${
                    accountTab === 'devices' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <Laptop size={15} />
                  Thiết bị & sản phẩm
                </button>
                <button
                  onClick={() => setAccountTab('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-left transition-all ${
                    accountTab === 'security' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <Settings size={15} />
                  Cấu hình mật mã
                </button>
                
                <div className="pt-3 border-t border-gray-100 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-left text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Đăng xuất ID
                  </button>
                </div>
              </div>

            </div>

            {/* Right side: Dynamic Sub-Tab Page Content representation */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                
                {/* SUBTAB PROFILE: INFO DISPLAY AND CONTACT INFO EDIT */}
                {accountTab === 'profile' && (
                  <motion.div
                    key="tab-profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-black text-gray-900 uppercase">HỒ SƠ THÀNH VIÊN PREMIUM</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Các thông tin cá nhân của bạn phục vụ điền nhanh bưu kiện tại trang thanh toán Checkout.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans text-xs">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-2">Họ và tên</label>
                          <input 
                            type="text" 
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-2">Số điện thoại liên hệ</label>
                          <input 
                            type="text" 
                            value={userProfile.phone}
                            onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-2">Email đăng bạ</label>
                          <input 
                            type="email" 
                            readOnly
                            value={userProfile.email}
                            className="w-full bg-gray-100 border border-gray-200/80 rounded-xl px-4 py-3 outline-none text-gray-400 cursor-not-allowed"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-2">Địa chỉ giao nhận bưu kiện mặc định</label>
                          <textarea 
                            rows={3}
                            value={userProfile.address}
                            onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button 
                          onClick={() => console.log('Cập nhật dữ liệu thông tin tài khoản thành công!')}
                          className="px-6 py-3 bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all"
                        >
                          Lưu hồ sơ thông tin
                        </button>
                      </div>
                    </div>

                    {/* Address quick shortcuts */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm group">
                      <h4 className="text-xs uppercase tracking-widest font-black text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        Danh Sách Địa Chỉ Nhận Hàng Liên Kết
                      </h4>
                      <p className="text-xs text-gray-500 font-sans leading-relaxed">
                        Địa chỉ hiện tại của bạn là địa chỉ phòng bưu kiện mặc định. Bạn có thể thay đổi bất cứ lúc nào trong quá trình chuyển giao hàng bưu phẩm.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB ORDERS: HISTORY OF COMMITTED ORDERS */}
                {accountTab === 'orders' && (
                  <motion.div
                    key="tab-orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
                      <div className="border-b border-gray-100 pb-4 mb-6">
                        <h3 className="text-base font-black text-gray-900 uppercase">TIẾN TRÌNH VẬN CHUYỂN ĐƠN HÀNG</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Theo dõi thực tế hành trình đơn sản phẩm cao cấp và trạng thái bàn giao của bạn.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {orders.map((ord) => (
                          <div key={ord.id} className="border border-gray-150 rounded-2xl overflow-hidden font-sans text-xs">
                            {/* Top row */}
                            <div className="bg-gray-50/80 border-b border-gray-150 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Đơn hàng</span>
                                <strong className="block text-gray-900 font-extrabold text-sm font-mono">{ord.id}</strong>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block sm:text-right">Ngày đặt</span>
                                <span className="font-semibold text-gray-700">{ord.date}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block sm:text-right">Tổng thanh toán</span>
                                <strong className="text-indigo-600 font-black font-mono text-sm block sm:text-right">{ord.total}</strong>
                              </div>
                            </div>

                            {/* Middle row */}
                            <div className="p-5 space-y-4">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100/40 text-indigo-500">
                                    <Package size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-gray-900">{item.name}</h4>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">{item.type} • Số lượng: {item.qty}</p>
                                  </div>
                                </div>
                              ))}

                              {/* Progress Status trackline */}
                              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                                  {ord.statusType === 'processing' ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                                  ) : (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                  )}
                                  <span className="font-extrabold text-gray-800">Trạng thái: <strong className="text-indigo-600 font-black uppercase text-[10px]">{ord.status}</strong></span>
                                </div>

                                <button 
                                  onClick={() => console.log(`Sản phẩm mã ${ord.id} đang nằm trong lộ trình bưu tá giao hàng tận nơi nguyên seal.`)}
                                  className="text-[10px] font-sans font-black uppercase tracking-wider text-black bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all"
                                >
                                  Xem Vị Trí Vận Chuyển
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB DEVICES: REGISTERED HARDWARE & SPECTRAL CONFIGS */}
                {accountTab === 'devices' && (
                  <motion.div
                    key="tab-devices"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 font-sans text-xs"
                  >
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-black text-gray-900 uppercase">THIẾT BỊ HOẠT ĐỘNG VÀ CHỈ SỐ</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Theo dõi bảo hành phần cứng, trạng thái nâng cấp và cài đặt ứng dụng thiết bị của bạn.
                        </p>
                      </div>

                      {/* Mock Hardware specifications card */}
                      <div className="border border-gray-150 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start bg-slate-950 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
                        
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400 border border-white/5 flex-shrink-0 animate-pulse">
                          <Cpu size={22} />
                        </div>
                        <div className="space-y-2 flex-grow min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8px] uppercase font-bold tracking-widest text-indigo-400 font-mono">BẢO HÀNH CHỦ CHỐT</span>
                              <h4 className="font-sans font-black text-normal text-white uppercase tracking-tight mt-0.5">LUMINA INTEGRAL CHIP v1.2</h4>
                            </div>
                            <span className="bg-emerald-600 text-white text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-500">
                              CHẤT LƯỢNG CAO
                            </span>
                          </div>
                          
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            Có chứa tấm nền OLED siêu sáng cực đại dải màu vô hạn kết hợp chip xử lý thế hệ mới Core v2. Chân thực sắc nét đến từng điểm pixel cảm thị.
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-white/10 text-[10px] text-slate-350">
                            <div>
                              <span className="block text-slate-500 uppercase font-bold text-[8px]">Tần số quét màn</span>
                              <strong className="text-white font-mono">120 Hz</strong>
                            </div>
                            <div>
                              <span className="block text-slate-500 uppercase font-bold text-[8px]">Chuẩn truyền dẫn</span>
                              <strong className="text-white font-mono">UWB v2.0</strong>
                            </div>
                            <div>
                              <span className="block text-slate-500 uppercase font-bold text-[8px]">Hạn bảo hành</span>
                              <strong className="text-white">16 - 06 - 2027</strong>
                            </div>
                            <div>
                              <span className="block text-slate-500 uppercase font-bold text-[8px]">Độ phân giải</span>
                              <strong className="text-white font-mono">4K UltraHD</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-indigo-50/50 border border-indigo-100/60 rounded-xl flex items-start gap-3 text-indigo-800 text-[11px] leading-relaxed">
                        <Clock size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Bạn cần đặt mua thêm loại phụ kiện nào?</strong>
                          <p className="text-indigo-600/90 mt-0.5">Mọi bộ phụ kiện cao cấp và củ sạc hi-end của Lumina đều đảm bảo truyền dẫn sạc mượt mà đồng bộ. Hãy duyệt sảnh để bổ sung mục giỏ hàng.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB SECURITY: ENCRYPTION & DATA SETTINGS */}
                {accountTab === 'security' && (
                  <motion.div
                    key="tab-security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6 font-sans text-xs">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-black text-gray-900 uppercase">BẢO MẬT & MÃ HOÁ QUANTUM THIẾT BI</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Cập nhật mật khẩu kết nối hoặc thiếp lập đặc cách xác thực hai cổng vân quang học.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-2">Mật khẩu hiện tại</label>
                            <input 
                              type="password" 
                              placeholder="••••••••"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-450 tracking-wider mb-2">Mật khẩu mới bảo vệ</label>
                            <input 
                              type="password" 
                              placeholder="••••••••"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 border border-gray-250/60 rounded-xl flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-[11px] text-gray-650 leading-relaxed">
                            Xác thực thành viên Lumina ID vĩnh viễn được tự động áp dụng ưu đãi giảm giá lên tới 10% tại tất cả các hệ thống showroom và trạm trải nghiệm Lumina chính hãng trên toàn cầu.
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button 
                          onClick={() => console.log('Mật khẩu của bạn đã được cấu định an toàn!')}
                          className="px-6 py-3 bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all"
                        >
                          Cấu Định Mật Khẩu
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
