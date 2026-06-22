import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  vipStatus: 'Normal' | 'Premium';
  status: 'active' | 'blocked';
  joinedDate: string;
}

interface UserManagerProps {
  systemUsers: User[];
  onAddUser: (user: User) => void;
  onToggleUserRole: (id: string) => void;
  onToggleUserVip: (id: string) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManager({
  systemUsers,
  onAddUser,
  onToggleUserRole,
  onToggleUserVip,
  onToggleUserStatus,
  onDeleteUser
}: UserManagerProps) {
  const [userQuery, setUserQuery] = useState('');
  const [isNewUsrFormOpen, setIsNewUsrFormOpen] = useState(false);

  // Form states for creating a new user
  const [newUsrName, setNewUsrName] = useState('');
  const [newUsrEmail, setNewUsrEmail] = useState('');
  const [newUsrPhone, setNewUsrPhone] = useState('');
  const [newUsrRole, setNewUsrRole] = useState<'user' | 'admin'>('user');
  const [newUsrVip, setNewUsrVip] = useState<'Normal' | 'Premium'>('Normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsrName.trim() || !newUsrEmail.trim()) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newUsrName.trim(),
      email: newUsrEmail.trim().toLowerCase(),
      phone: newUsrPhone.trim() || 'Chưa cung cấp',
      role: newUsrRole,
      vipStatus: newUsrVip,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('vi-VN')
    };

    onAddUser(newUser);
    setIsNewUsrFormOpen(false);
    setNewUsrName('');
    setNewUsrEmail('');
    setNewUsrPhone('');
    setNewUsrRole('user');
    setNewUsrVip('Normal');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-gray-200 p-5 rounded-[2rem] shadow-sm">
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-extrabold text-gray-950 text-sm uppercase">Sổ thành viên Lumina ID</h3>
          <p className="text-xs text-gray-400">Quản trị phân quyền cán bộ nhân viên, theo dõi trạng thái VIP tài khoản hoặc chặn truy cập.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          {/* Search user */}
          <input
            type="text"
            placeholder="Tìm tên, email thành viên..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:bg-slate-100/50 focus:bg-white rounded-xl px-4 py-2 text-xs outline-none focus:border-black font-semibold shadow-sm w-full sm:w-60 text-left"
          />

          <button
            type="button"
            onClick={() => setIsNewUsrFormOpen(true)}
            className="px-4 py-2.5 bg-black hover:bg-slate-900 text-white font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={14} />
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto font-sans">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
                <th className="py-4.5 px-6 whitespace-nowrap font-extrabold text-left">Thành viên</th>
                <th className="py-4.5 px-6 whitespace-nowrap font-extrabold text-left">Liên hệ</th>
                <th className="py-4.5 px-6 whitespace-nowrap font-extrabold text-left">Phân quyền</th>
                <th className="py-4.5 px-6 whitespace-nowrap font-extrabold text-left">Thành viên vip</th>
                <th className="py-4.5 px-6 whitespace-nowrap font-extrabold text-left">Ngày tham gia</th>
                <th className="py-4.5 px-6 whitespace-nowrap font-extrabold text-left">Trạng thái</th>
                <th className="py-4.5 px-6 whitespace-nowrap font-extrabold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {systemUsers
                .filter(u => 
                  u.name.toLowerCase().includes(userQuery.toLowerCase()) || 
                  u.email.toLowerCase().includes(userQuery.toLowerCase())
                )
                .map((usr) => (
                  <tr 
                    key={usr.id} 
                    className={`hover:bg-slate-50/40 transition-colors ${
                      usr.status === 'blocked' ? 'bg-rose-50/10' : ''
                    }`}
                  >
                    {/* Member identity */}
                    <td className="py-5 px-6 text-left">
                      <div className="flex items-center gap-3 justify-start">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0 ${
                          usr.role === 'admin' 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {usr.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <span className="font-extrabold text-slate-900 text-sm block tracking-tight">{usr.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{usr.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contacts phone */}
                    <td className="py-5 px-6 text-left">
                      <span className="font-mono text-slate-600 font-medium">{usr.phone}</span>
                    </td>

                    {/* Role selection toggle */}
                    <td className="py-5 px-6 text-left">
                      <button
                        type="button"
                        onClick={() => onToggleUserRole(usr.id)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200 hover:scale-95 active:scale-90 cursor-pointer ${
                          usr.role === 'admin'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/60 font-black shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                        }`}
                      >
                        {usr.role === 'admin' ? 'Administrator' : 'Standard User'}
                      </button>
                    </td>

                    {/* Vip premium level */}
                    <td className="py-5 px-6 text-left">
                      <button
                        type="button"
                        onClick={() => onToggleUserVip(usr.id)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-200 hover:scale-95 active:scale-90 cursor-pointer ${
                          usr.vipStatus === 'Premium'
                            ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 border border-amber-500/15 font-black shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                        }`}
                      >
                        {usr.vipStatus === 'Premium' && <Sparkles size={11} className="text-amber-500 animate-pulse" />}
                        {usr.vipStatus}
                      </button>
                    </td>

                    {/* Join date */}
                    <td className="py-5 px-6 text-left">
                      <span className="font-mono text-slate-500 font-medium">{usr.joinedDate}</span>
                    </td>

                    {/* Status tag */}
                    <td className="py-5 px-6 text-left">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold ${
                        usr.status === 'active' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg' : 'text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${usr.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                        {usr.status === 'active' ? 'Hoạt động' : 'Đã Khóa'}
                      </span>
                    </td>

                    {/* Options button */}
                    <td className="py-5 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onToggleUserStatus(usr.id)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 hover:scale-95 active:scale-90 cursor-pointer ${
                          usr.status === 'active' 
                            ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {usr.status === 'active' ? 'Khóa' : 'Mở khóa'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteUser(usr.id)}
                        disabled={usr.email === 'admin@lumina.com'}
                        className="px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 disabled:opacity-40 rounded-lg text-[9px] font-bold uppercase hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 hover:scale-95 active:scale-90 cursor-pointer"
                      >
                        Gỡ bỏ
                      </button>
                    </td>

                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New account registration Modal overlay */}
      {isNewUsrFormOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[6px] z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-gray-200 p-8 max-w-md w-full relative shadow-2xl font-sans text-left">
            
            <button
              type="button"
              onClick={() => setIsNewUsrFormOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-gray-500 hover:text-black transition-colors"
            >
              <X size={14} />
            </button>

            <h3 className="text-lg font-black text-gray-950 uppercase tracking-tight mb-4">
              Cấp tài khoản Lumina ID mới
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  value={newUsrName}
                  onChange={(e) => setNewUsrName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-slate-50 border border-gray-200 focus:border-black focus:bg-white rounded-xl px-4 py-2.5 outline-none text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Địa chỉ Email *</label>
                <input
                  type="email"
                  required
                  value={newUsrEmail}
                  onChange={(e) => setNewUsrEmail(e.target.value)}
                  placeholder="mail@lumina.com"
                  className="w-full bg-slate-50 border border-gray-200 focus:border-black focus:bg-white rounded-xl px-4 py-2.5 outline-none text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Số điện thoại</label>
                <input
                  type="text"
                  value={newUsrPhone}
                  onChange={(e) => setNewUsrPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full bg-slate-50 border border-gray-200 focus:border-black focus:bg-white rounded-xl px-4 py-2.5 outline-none text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Phân quyền</label>
                  <select
                    value={newUsrRole}
                    onChange={(e) => setNewUsrRole(e.target.value as 'user' | 'admin')}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-black focus:bg-white rounded-xl px-3 py-2 outline-none text-xs font-semibold"
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Hạng Thành viên</label>
                  <select
                    value={newUsrVip}
                    onChange={(e) => setNewUsrVip(e.target.value as 'Normal' | 'Premium')}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-black focus:bg-white rounded-xl px-3 py-2 outline-none text-xs font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Premium">Premium VIP</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 bg-black hover:bg-slate-900 text-white font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow active:scale-95 cursor-pointer text-center"
              >
                Cấp tài khoản
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
