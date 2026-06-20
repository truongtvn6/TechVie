import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType, CartItem, Product } from './types';
import HomePage from './components/HomePage';
import BrandPage from './components/BrandPage';
import ProductPage from './components/ProductPage';
import NewsPage from './components/NewsPage';
import ContactPage from './components/ContactPage';
import CheckoutPage from './components/CheckoutPage';
import AccountPage from './components/AccountPage';
import AuthPage from './components/AuthPage';
import SearchSidePanel from './components/SearchSidePanel';
import CartSidePanel from './components/CartSidePanel';
import { Search, ShoppingBag, Menu, X, ArrowUpRight, Globe, Layers, Brush, User } from 'lucide-react';

// Logo
import Logo from "./assets/images/logo-new-no-bg.png"

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Nguyễn Minh Tiến',
    email: 'mintzinfinity898@gmail.com',
    phone: '0912 345 678',
    address: '86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    memberSince: '17-06-2026',
    luminaId: 'LM-992-88X',
    shieldStatus: 'Đang Kích Hoạt (Premium)',
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Open cart drawer so customer enjoys the feedback
    setIsCartOpen(true);
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showHeaderFooter = activeTab !== 'dang-nhap' && activeTab !== 'dang-ky';

  const navigationItems: { id: TabType; label: string }[] = [
    { id: 'home', label: 'TRANG CHỦ' },
    { id: 'products', label: 'SẢN PHẨM' },
    { id: 'brand', label: 'THƯƠNG HIỆU' }, // The requested brand page
    { id: 'news', label: 'TIN TỨC' },
    { id: 'contact', label: 'LIÊN HỆ' }
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-gray-900 font-sans flex flex-col justify-between selection:bg-black selection:text-white">

      {/* Aurora Ambient Backgrounds */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] animate-drift-slow" />
        <div className="absolute bottom-[-100px] right-[-50px] w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[120px] animate-drift-medium" />
      </div>

      {/* Primary Global Navigation */}
      {showHeaderFooter && (
        <header className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center h-24 px-6 md:px-margin-desktop max-w-7xl mx-auto relative w-full">
          {/* Brand Logo text with modern tracking, matches vietnamese template design perfectly */}
          <button 
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl md:text-3xl font-sans tracking-tighter text-black font-black hover:opacity-80 transition-opacity"
          >
            <img src={Logo} alt="logo" width={150}/>
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
            {/* Elegant Search Button matching viet mockup precision design with little aura dots */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="relative w-12 h-12 flex items-center justify-center bg-white/40 border border-black/5 rounded hover:bg-white/80 transition-all duration-300 active:scale-95"
              title="Tìm kiếm thiết bị"
            >
              <Search size={18} className="text-gray-900" />
              <div className="absolute top-[-2px] right-[-2px] w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(70,72,212,0.6)]" />
            </button>

            {/* Shopping Bag icon with state count metrics */}
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

            {/* Elegant User/Account Profile Button with active state highlights */}
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

            {/* Hamburger helper toggles for mobile viewports */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/70 hover:backdrop-blur-sm transition-all duration-300"
              title="Danh mục menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile burger menu slide container */}
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
                      activeTab === item.id ? 'text-indigo-605 text-indigo-600 font-extrabold' : 'text-gray-600 shadow-none'
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
                        activeTab === 'dang-nhap' ? 'text-pink-600 font-extrabold' : 'text-gray-600'
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
                        activeTab === 'dang-ky' ? 'text-pink-600 font-extrabold' : 'text-gray-600'
                      }`}
                    >
                      <User size={16} /> ĐĂNG KÝ
                    </a>
                  </div>
                ) : (
                  <a
                    href="#account"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('account');
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left text-sm uppercase tracking-widest font-black py-2.5 flex items-center gap-2 border-t border-gray-100 pt-4 ${
                      activeTab === 'account' ? 'text-indigo-600 font-extrabold' : 'text-gray-600 shadow-none'
                    }`}
                  >
                    <User size={16} /> TÀI KHOẢN ({userProfile.name.split(' ').pop()?.toUpperCase()})
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      )}

      {/* Interactive Main Body Swap Grid */}
      <main className={showHeaderFooter ? "flex-grow" : "min-h-screen flex items-center justify-center p-0 w-full"}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <HomePage 
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onAddToCart={handleAddToCart} 
              />
            </motion.div>
          )}

          {activeTab === 'brand' && (
            <motion.div
              key="brand-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <BrandPage />
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <ProductPage onAddToCart={handleAddToCart} />
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              key="news-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <NewsPage />
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <ContactPage />
            </motion.div>
          )}

          {activeTab === 'checkout' && (
            <motion.div
              key="checkout-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <CheckoutPage 
                cart={cart}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeTab === 'dang-nhap' && (
            <motion.div
              key="dang-nhap-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AuthPage 
                initialMode="login"
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLoginSuccess={(email) => {
                  setUserProfile(prev => ({
                    ...prev,
                    email: email,
                    name: email.split('@')[0].toUpperCase(),
                  }));
                  setIsLoggedIn(true);
                  setActiveTab('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onRegisterSuccess={(email, name) => {
                  setUserProfile(prev => ({
                    ...prev,
                    email: email,
                    name: name,
                  }));
                  setIsLoggedIn(true);
                  setActiveTab('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeTab === 'dang-ky' && (
            <motion.div
              key="dang-ky-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AuthPage 
                initialMode="register"
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLoginSuccess={(email) => {
                  setUserProfile(prev => ({
                    ...prev,
                    email: email,
                    name: email.split('@')[0].toUpperCase(),
                  }));
                  setIsLoggedIn(true);
                  setActiveTab('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onRegisterSuccess={(email, name) => {
                  setUserProfile(prev => ({
                    ...prev,
                    email: email,
                    name: name,
                  }));
                  setIsLoggedIn(true);
                  setActiveTab('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AccountPage 
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Master Website Footer conforming to branding mock directions */}
      {showHeaderFooter && (
        <footer className="w-full bg-white/40 border-t border-gray-200 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Description summary */}
          <div className="space-y-4">
            {/* <h3 className="text-xl font-black text-gray-900 tracking-tight">LUMINA</h3> */}
            <img src={Logo} alt="logo" width={220}/>
            <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-[260px]">
              Cung cấp các thiết bị điện tử đỉnh cao, laptop hiệu năng khủng, smartphone đột phá và các món phụ kiện hi-end chế tác tỉ mỉ dành cho tương lai.
            </p>
          </div>

          {/* Nav columns 1 */}
          <div>
            <h5 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6 font-sans">ĐIỀU HƯỚNG</h5>
            <ul className="space-y-3">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs text-gray-600 hover:text-black transition-colors font-sans text-left uppercase tracking-wider font-semibold"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav columns 2 */}
          <div>
            <h5 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6 font-sans">DỊCH VỤ & LAB</h5>
            <ul className="space-y-3 text-xs text-gray-650 font-sans">
              <li><button onClick={() => setActiveTab('brand')} className="hover:underline">Lumina Book Silicon specs</button></li>
              <li><button onClick={() => setActiveTab('brand')} className="hover:underline">Hệ Sinh Thái Thông Minh 2026</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:underline">Trạm Trải Nghiệm Premium</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:underline">Hỗ trợ kỹ thuật & Bảo hành</button></li>
            </ul>
          </div>

          {/* Social Links columns */}
          <div>
            <h5 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">MẠNG XÃ HỘI</h5>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-250 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
                title="Lumina Global Network"
              >
                <Globe size={16} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-250 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
                title="Lumina Micro-Animations"
              >
                <Layers size={16} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-250 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
                title="Lumina Crafts"
              >
                <Brush size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Rights bar */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-150 flex flex-col md:flex-row justify-between items-center text-[13px] font-mono uppercase tracking-widest text-gray-400 gap-4 text-center md:text-left">
          <span>© 2026 TECHVIE STORE</span>
          {/* <span className="flex items-center gap-1">
            THẮP SÁNG BỞI LUMINA LAB SWITZERLAND & SEOUL CORP.
            <ArrowUpRight size={10} />
          </span> */}
        </div>
      </footer>
      )}

      {/* Left 70%-width Slide out Search panel drawer */}
      <SearchSidePanel 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Right Slide-out Cart panel drawer */}
      <CartSidePanel 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
