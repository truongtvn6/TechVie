import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType, CartItem, Product } from './types';
import { products as initialProducts } from './data';
import HomePage from './components/HomePage';
import BrandPage from './components/BrandPage';
import ProductPage from './components/ProductPage';
import NewsPage from './components/NewsPage';
import ContactPage from './components/ContactPage';
import CheckoutPage from './components/CheckoutPage';
import AccountPage from './components/AccountPage';
import AuthPage from './components/AuthPage';
import AdminPage from './components/AdminPage';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchSidePanel from './components/SearchSidePanel';
import CartSidePanel from './components/CartSidePanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Nguyễn Minh Tiến',
    email: 'mintzinfinity898@gmail.com',
    phone: '0912 345 678',
    address: '86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    memberSince: '17-06-2026',
    luminaId: 'LM-992-88X',
    shieldStatus: 'Đang Kích Hoạt (Premium)',
    role: 'user',
  });

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleEditProduct = (editedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === editedProduct.id ? editedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
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
    { id: 'contact', label: 'LIÊN HỆ' },
    ...(userProfile.role === 'admin' ? [{ id: 'admin' as TabType, label: 'QUẢN TRỊ ID' }] : [])
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
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigationItems={navigationItems}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          totalCartCount={totalCartCount}
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
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
                products={products}
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
              <ProductPage products={products} onAddToCart={handleAddToCart} />
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
                  const isSystemAdmin = email === 'admin@lumina.com';
                  setUserProfile(prev => ({
                    ...prev,
                    email: email,
                    name: isSystemAdmin ? 'ADMINISTRATOR' : email.split('@')[0].toUpperCase(),
                    role: isSystemAdmin ? 'admin' : 'user',
                  }));
                  setIsLoggedIn(true);
                  if (isSystemAdmin) {
                    setActiveTab('admin');
                  } else {
                    setActiveTab('account');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onRegisterSuccess={(email, name) => {
                  setUserProfile(prev => ({
                    ...prev,
                    email: email,
                    name: name,
                    role: 'user',
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
                  const isSystemAdmin = email === 'admin@lumina.com';
                  setUserProfile(prev => ({
                    ...prev,
                    email: email,
                    name: isSystemAdmin ? 'ADMINISTRATOR' : email.split('@')[0].toUpperCase(),
                    role: isSystemAdmin ? 'admin' : 'user',
                  }));
                  setIsLoggedIn(true);
                  if (isSystemAdmin) {
                    setActiveTab('admin');
                  } else {
                    setActiveTab('account');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onRegisterSuccess={(email, name) => {
                  setUserProfile(prev => ({
                    ...prev,
                    email: email,
                    name: name,
                    role: 'user',
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

          {activeTab === 'admin' && userProfile.role === 'admin' && (
            <motion.div
              key="admin-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AdminPage 
                products={products}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Master Website Footer conforming to branding mock directions */}
      {showHeaderFooter && (
        <Footer
          navigationItems={navigationItems}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Left 70%-width Slide out Search panel drawer */}
      <SearchSidePanel 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
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
