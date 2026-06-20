import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from '../types';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  navigationItems: Array<{ id: TabType; label: string }>;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalCartCount: number;
  isLoggedIn: boolean;
  userProfile: { name: string };
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  navigationItems,
  setIsSearchOpen,
  setIsCartOpen,
  totalCartCount,
  isLoggedIn,
  userProfile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: HeaderProps) {
  return (
    <header className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center h-24 px-6 md:px-[60px] max-w-7xl mx-auto relative w-full">
        {/* Brand Logo text */}
        <button 
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl md:text-3xl font-sans tracking-tighter text-black font-black hover:opacity-80 transition-opacity"
        >
          LUMINA
        </button>

        {/* Desktop Nav menu items */}
        <nav className="hidden md:flex items-center space-x-10">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-[13px] font-sans tracking-widest font-extrabold hover:text-black transition-colors ${
                activeTab === item.id 
                  ? 'text-black border-b-2 border-black pb-1' 
                  : 'text-gray-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Header controls */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="relative w-12 h-12 flex items-center justify-center bg-white/40 border border-black/5 rounded hover:bg-white/80 transition-all duration-300 active:scale-95"
            title="Tìm kiếm thiết bị"
          >
            <Search size={18} className="text-gray-900" />
            <div className="absolute top-[-2px] right-[-2px] w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(70,72,212,0.6)]" />
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/70 hover:backdrop-blur-sm transition-all duration-300 relative"
            title="Giỏ hàng Lumina"
          >
            <ShoppingBag size={20} className="text-gray-900" />
            {totalCartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {totalCartCount}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-2">
            {isLoggedIn && (
              <span className="hidden lg:inline-block text-[10px] tracking-widest uppercase font-mono bg-indigo-50 border border-indigo-150 text-indigo-700 py-1.5 px-3 rounded-full font-black">
                Chào, {userProfile.name.split(' ').pop()?.toUpperCase()}
              </span>
            )}

            <a 
              href={!isLoggedIn ? '#dang-nhap' : '#account'}
              onClick={(e) => {
                e.preventDefault();
                if (!isLoggedIn) {
                  setActiveTab('dang-nhap');
                } else {
                  setActiveTab('account');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                activeTab === 'account' || activeTab === 'dang-nhap' || activeTab === 'dang-ky'
                  ? 'bg-black text-white shadow-md' 
                  : 'hover:bg-white/70 hover:backdrop-blur-sm text-gray-950 border border-transparent/0'
              }`}
              title="Tài khoản Lumina ID"
            >
              <User size={18} />
            </a>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/70 hover:backdrop-blur-sm transition-all duration-300"
            title="Danh mục menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-150 py-6"
          >
            <div className="flex flex-col px-6 space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-left text-sm uppercase tracking-widest font-black py-2.5 ${
                    activeTab === item.id ? 'text-indigo-600 font-extrabold' : 'text-gray-600 shadow-none'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {!isLoggedIn ? (
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <a
                    href="#dang-nhap"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('dang-nhap');
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left text-sm uppercase tracking-widest font-black py-2.5 flex items-center gap-2 ${
                      activeTab === 'dang-nhap' ? 'text-indigo-600 font-extrabold' : 'text-gray-600'
                    }`}
                  >
                    <User size={16} /> ĐĂNG NHẬP
                  </a>
                  <a
                    href="#dang-ky"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('dang-ky');
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left text-sm uppercase tracking-widest font-black py-2.5 flex items-center gap-2 ${
                      activeTab === 'dang-ky' ? 'text-indigo-600 font-extrabold' : 'text-gray-600'
                    }`}
                  >
                    ĐĂNG KÝ
                  </a>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <a
                    href="#account"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('account');
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left text-sm uppercase tracking-widest font-black py-2.5 flex items-center gap-2 ${
                      activeTab === 'account' ? 'text-indigo-600 font-extrabold' : 'text-gray-600'
                    }`}
                  >
                    <User size={16} /> TÀI KHOẢN ({userProfile.name.split(' ').pop()?.toUpperCase()})
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
