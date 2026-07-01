import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from '../types';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import Logo from '../assets/logopage/logo-b-w-techvie.png'

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
      <style>{`
        .nav-btn {
          position: relative;
          transition: 0.5s ease;
          cursor: pointer;
          background: transparent;
          border: none;
          z-index: 1;
        }

        .nav-btn::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0;
          background-color: #000000;
          transition: 0.5s ease;
        }

        .nav-btn::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 0;
          width: 100%;
          background-color: #000000;
          transition: 0.4s ease;
          z-index: -1;
        }

        /* Hover states */
        .nav-btn:hover {
          color: #ffffff !important;
          transition-delay: 0.5s;
        }

        .nav-btn:hover::before {
          width: 100%;
        }

        .nav-btn:hover::after {
          height: 100%;
          transition-delay: 0.4s;
        }

        /* Active state */
        .nav-btn-active {
          color: #000000;
        }

        .nav-btn-active::before {
          width: 100%;
        }
      `}</style>
      <div className="flex justify-between items-center h-18 px-4 md:px-8 lg:px-10 max-w-none mx-auto relative w-full">
        {/* Brand Logo text */}
        <button 
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl md:text-3xl font-sans tracking-tighter text-black font-black hover:opacity-80 transition-opacity"
        >
          <img src={Logo} alt="TechVie Logo" className="h-12 md:h-14 lg:h-16 w-auto object-contain cursor-pointer" />
        </button>

        {/* Desktop Nav menu items */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-8 xl:space-x-10">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`nav-btn px-4 py-2 text-[11px] lg:text-[13px] font-sans tracking-widest font-extrabold transition-all duration-300 rounded-sm cursor-pointer ${
                activeTab === item.id 
                  ? 'nav-btn-active' 
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
            className="relative w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all duration-300 active:scale-95 cursor-pointer"
            title="Tìm kiếm thiết bị"
          >
            <Search size={20} className="text-gray-900" />
            {/* <div className="absolute top-[-2px] right-[-2px] w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(70,72,212,0.6)]" /> */}
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-200 hover:backdrop-blur-sm transition-all duration-300 relative cursor-pointer"
            title="Giỏ hàng TechVie"
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
              <span className="hidden lg:inline-block text-[10px] tracking-widest uppercase font-mono bg-indigo-50 border border-indigo-150 text-black py-1.5 px-3 rounded-full font-black">
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
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
                activeTab === 'account' || activeTab === 'dang-nhap' || activeTab === 'dang-ky'
                  ? 'bg-black text-white shadow-md' 
                  : 'hover:bg-gray-200 hover:backdrop-blur-sm text-gray-950 border border-transparent/0'
              }`}
              title="Tài khoản TechVie ID"
            >
              <User size={20} />
            </a>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-200 hover:backdrop-blur-sm transition-all duration-300 cursor-pointer"
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
            className="md:hidden bg-white border-t border-gray-150 py-6 h"
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
                  className={`text-left text-sm uppercase tracking-widest font-black py-2.5 cursor-pointer font-bold ${
                    activeTab === item.id ? 'text-indigo-600 font-extrabold' : 'text-gray-600 shadow-none'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {!isLoggedIn ? (
                <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
                  <a
                    href="#dang-nhap"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('dang-nhap');
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left text-sm uppercase tracking-widest font-black py-2.5 flex items-center gap-2 font-bold ${
                      activeTab === 'dang-nhap' ? 'text-indigo-600 font-extrabold' : 'text-gray-600'
                    }`}
                  >
                    {/* <User size={16} />  */}
                    ĐĂNG NHẬP
                  </a>
                  <a
                    href="#dang-ky"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('dang-ky');
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left text-sm uppercase tracking-widest font-black py-2.5 flex items-center gap-2 font-bold ${
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
