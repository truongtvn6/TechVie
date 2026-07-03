import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
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
  const [scrolled, setScrolled] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(totalCartCount);
  const [cartBadgePop, setCartBadgePop] = useState(false);

  // Scroll shrink effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cart badge pop animation when count increases
  useEffect(() => {
    if (totalCartCount > prevCartCount) {
      setCartBadgePop(true);
      const t = setTimeout(() => setCartBadgePop(false), 500);
      setPrevCartCount(totalCartCount);
      return () => clearTimeout(t);
    }
    setPrevCartCount(totalCartCount);
  }, [totalCartCount]);

  return (
    <header
      className={`sticky top-0 w-full z-50 select-none transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]'
          : 'bg-white/70 backdrop-blur-md border-b border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]'
      }`}
    >
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

        /* Cart badge pop keyframe */
        @keyframes badge-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.45); }
          70% { transform: scale(0.88); }
          100% { transform: scale(1); }
        }
        .badge-pop { animation: badge-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      <div
        className={`flex justify-between items-center px-4 md:px-8 lg:px-10 max-w-none mx-auto relative w-full transition-all duration-300 ${
          scrolled ? 'h-14' : 'h-18'
        }`}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl md:text-3xl font-sans tracking-tighter text-black font-black hover:opacity-80 transition-opacity"
        >
          <img
            src={Logo}
            alt="TechVie Logo"
            className={`w-auto object-contain cursor-pointer transition-all duration-300 ${
              scrolled ? 'h-10 md:h-11' : 'h-12 md:h-14 lg:h-16'
            }`}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-8 xl:space-x-10">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.id === 'home' ? '/' : `/${item.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`nav-btn px-4 py-2 text-[11px] lg:text-[13px] font-sans tracking-widest font-extrabold transition-all duration-300 rounded-sm cursor-pointer inline-block ${
                activeTab === item.id
                  ? 'nav-btn-active'
                  : 'text-gray-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`relative flex items-center justify-center rounded-full hover:bg-gray-200 transition-all duration-300 active:scale-95 cursor-pointer ${
              scrolled ? 'w-10 h-10' : 'w-12 h-12'
            }`}
            title="Tìm kiếm thiết bị"
          >
            <Search size={scrolled ? 17 : 20} className="text-gray-900 transition-all duration-300" />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className={`rounded-full flex items-center justify-center hover:bg-gray-200 hover:backdrop-blur-sm transition-all duration-300 relative cursor-pointer ${
              scrolled ? 'w-10 h-10' : 'w-12 h-12'
            }`}
            title="Giỏ hàng TechVie"
          >
            <ShoppingBag size={scrolled ? 17 : 20} className="text-gray-900 transition-all duration-300" />
            <AnimatePresence>
              {totalCartCount > 0 && (
                <motion.span
                  key={totalCartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className={`absolute top-1.5 right-1.5 bg-indigo-600 text-white font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white ${cartBadgePop ? 'badge-pop' : ''}`}
                >
                  {totalCartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="flex items-center space-x-2">
            {isLoggedIn && (
              <span className="hidden lg:inline-block text-[10px] tracking-widest uppercase font-mono bg-indigo-50 border border-indigo-150 text-black py-1.5 px-3 rounded-full font-black">
                Chào, {userProfile.name.split(' ').pop()?.toUpperCase()}
              </span>
            )}

            <Link
              to={!isLoggedIn ? '/login' : '/account'}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
                scrolled ? 'w-10 h-10' : 'w-12 h-12'
              } ${
                activeTab === 'account' || activeTab === 'login' || activeTab === 'register'
                  ? 'bg-black text-white shadow-md'
                  : 'hover:bg-gray-200 hover:backdrop-blur-sm text-gray-950 border border-transparent/0'
              }`}
              title="Tài khoản TechVie ID"
            >
              <User size={scrolled ? 17 : 20} className="transition-all duration-300" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden rounded-full flex items-center justify-center hover:bg-gray-200 hover:backdrop-blur-sm transition-all duration-300 cursor-pointer ${
              scrolled ? 'w-10 h-10' : 'w-12 h-12'
            }`}
            title="Danh mục menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu — stagger items */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-5 space-y-1">
              {navigationItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.045, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={item.id === 'home' ? '/' : `/${item.id}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left flex items-center gap-3 text-sm uppercase tracking-widest font-black py-3 px-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      activeTab === item.id
                        ? 'text-black bg-gray-100'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {activeTab === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    )}
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigationItems.length * 0.045, duration: 0.25 }}
                className="pt-3 border-t border-gray-100 flex flex-col gap-1 mt-2"
              >
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`text-left text-sm uppercase tracking-widest font-black py-3 px-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                        activeTab === 'login' ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      ĐĂNG NHẬP
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`text-left text-sm uppercase tracking-widest font-black py-3 px-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                        activeTab === 'register' ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      ĐĂNG KÝ
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/account"
                    onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`text-left text-sm uppercase tracking-widest font-black py-3 px-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                      activeTab === 'account' ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <User size={16} />
                    TÀI KHOẢN ({userProfile.name.split(' ').pop()?.toUpperCase()})
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
