import { 
  User, 
  BadgeCheck, 
  QrCode, 
  History, 
  Laptop, 
  Settings, 
  LogOut,
  ShieldAlert
} from 'lucide-react';

interface AccountSidebarProps {
  userProfile: any;
  accountTab: 'profile' | 'orders' | 'devices' | 'security';
  setAccountTab: (tab: 'profile' | 'orders' | 'devices' | 'security') => void;
  ordersCount: number;
  handleLogout: () => void;
  onNavigate?: (tab: string) => void;
}

export default function AccountSidebar({
  userProfile,
  accountTab,
  setAccountTab,
  ordersCount,
  handleLogout,
  onNavigate,
}: AccountSidebarProps) {
  return (
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
          {/* <div className="w-full mt-2.5 p-3 bg-white/50 border border-white/60 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2d3748] rounded flex items-center justify-center flex-shrink-0">
              <QrCode size={20} className="text-white" />
            </div>
            <div className="text-left flex-grow">
              <span className="block font-tech-label text-tech-label text-[#2d3748]">SHOWROOM ID</span>
              <span className="block font-caption-tiny text-caption-tiny text-[#4a5568] mt-0.5">Quét mã nhận diện thành viên</span>
            </div>
          </div> */}
        </div>
        
        {/* Metadata */}
        <div className="mt-4 pt-3 border-t border-white/60 flex flex-col gap-1.5 font-sans text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#4a5568]">Thành viên từ:</span>
            <span className="font-tech-label text-tech-label !text-sm !tracking-normal">{userProfile.memberSince}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4a5568]">Đặc quyền:</span>
            <span className={`font-tech-label text-tech-label !text-sm !tracking-normal border-none ${
              userProfile.shieldStatus === 'Standard' 
                ? 'text-blue-700' 
                : 'text-emerald-700'
            }`}>
              {userProfile.shieldStatus || 'Standard'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Navigation Sidebar */}
      <nav className="bg-white/60 backdrop-blur-md border border-white/60 rounded-xl p-2 flex flex-col shadow-sm gap-1">
        <button
          type="button"
          onClick={() => setAccountTab('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            accountTab === 'profile'
              ? 'bg-white/80 border border-white/60 shadow-md text-black'
              : 'text-[#4a5568] hover:text-black hover:bg-white/40 hover:shadow-sm'
          }`}
        >
          <User size={18} />
          <span className="font-headline-sm font-bold uppercase tracking-widest text-[13px]">Hồ sơ cá nhân</span>
          {accountTab === 'profile' && <div className="ml-auto w-[3px] h-5 bg-black rounded-full" />}
        </button>

        <button
          type="button"
          onClick={() => setAccountTab('orders')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            accountTab === 'orders'
              ? 'bg-white/80 border border-white/60 shadow-md text-black'
              : 'text-[#4a5568] hover:text-black hover:bg-white/40 hover:shadow-sm'
          }`}
        >
          <History size={18} />
          <span className="font-headline-sm font-bold uppercase tracking-widest text-[13px]">Lịch sử đặt hàng</span>
          {ordersCount > 0 && (
            <span className={`font-tech-label text-tech-label bg-gray-150 px-2 py-0.5 rounded text-black ${accountTab === 'orders' ? 'ml-2' : 'ml-auto'}`}>
              {ordersCount}
            </span>
          )}
          {accountTab === 'orders' && <div className="ml-auto w-[3px] h-5 bg-black rounded-full" />}
        </button>

        <button
          type="button"
          onClick={() => setAccountTab('devices')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            accountTab === 'devices'
              ? 'bg-white/80 border border-white/60 shadow-md text-black'
              : 'text-[#4a5568] hover:text-black hover:bg-white/40 hover:shadow-sm'
          }`}
        >
          <Laptop size={18} />
          <span className="font-headline-sm font-bold uppercase tracking-widest text-[13px]">Bảo hành sản phẩm</span>
          {accountTab === 'devices' && <div className="ml-auto w-[3px] h-5 bg-black rounded-full" />}
        </button>

        <button
          type="button"
          onClick={() => setAccountTab('security')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            accountTab === 'security'
              ? 'bg-white/80 border border-white/60 shadow-md text-black'
              : 'text-[#4a5568] hover:text-black hover:bg-white/40 hover:shadow-sm'
          }`}
        >
          <Settings size={18} />
          <span className="font-headline-sm font-bold uppercase tracking-widest text-[13px]">cập nhật mật khẩu</span>
          {accountTab === 'security' && <div className="ml-auto w-[3px] h-5 bg-black rounded-full" />}
        </button>

        <div className="h-px w-full bg-white/60 my-2" />
        
        {userProfile?.role === 'admin' && onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 bg-indigo-500 hover:bg-indigo-700 hover:shadow-sm transition-all duration-300 cursor-pointer"
          >
            <ShieldAlert size={18} />
            <span className="font-headline-sm font-extrabold uppercase tracking-widest text-[13px]">Quản trị hệ thống</span>
          </button>
        )}
        
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-300 cursor-pointer"
        >
          <LogOut size={18} />
          <span className="font-headline-sm font-bold uppercase tracking-widest text-[13px]">Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
}
