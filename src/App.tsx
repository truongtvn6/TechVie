import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType, CartItem, Product } from './types';
import { ShieldAlert } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct, getProducts } from './services/api';
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
  const isDraggingRef = useRef(false);
  const appRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const [adminBtnPos, setAdminBtnPos] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_btn_pos');
      if (saved) {
        const pos = JSON.parse(saved);
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        
        const minX = -16;
        const maxX = Math.max(0, screenWidth - 260);
        const minY = -Math.max(0, screenHeight - 128);
        const maxY = 16;
        
        return {
          x: Math.min(Math.max(pos.x, minX), maxX),
          y: Math.min(Math.max(pos.y, minY), maxY),
        };
      }
      return { x: 0, y: 0 };
    } catch (e) {
      return { x: 0, y: 0 };
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      const saved = localStorage.getItem('active_tab');
      return saved ? (saved as TabType) : 'home';
    } catch {
      return 'home';
    }
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string>(localStorage.getItem('techvie_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('techvie_token'));
  const [userProfile, setUserProfile] = useState({
    name: localStorage.getItem('techvie_token') ? 'ADMINISTRATOR' : 'Nguyễn Minh Tiến',
    email: localStorage.getItem('techvie_token') ? 'admin@lumina.com' : 'mintzinfinity898@gmail.com',
    phone: '0912 345 678',
    address: '86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    memberSince: '17-06-2026',
    luminaId: 'LM-992-88X',
    shieldStatus: 'Đang Kích Hoạt (Premium)',
    role: localStorage.getItem('techvie_token') ? 'admin' : 'user',
  });

  useEffect(() => {
    getProducts().then(res => {
      if (res.success) {
        setProducts(res.products);
      }
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('active_tab', activeTab);
    } catch (e) {
      console.error(e);
    }
  }, [activeTab]);

  const handleSetIsLoggedIn = (val: boolean) => {
    setIsLoggedIn(val);
    if (!val) {
      setToken('');
      localStorage.removeItem('techvie_token');
      setUserProfile({
        name: 'Nguyễn Minh Tiến',
        email: 'mintzinfinity898@gmail.com',
        phone: '0912 345 678',
        address: '86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
        memberSince: '17-06-2026',
        luminaId: 'LM-992-88X',
        shieldStatus: 'Đang Kích Hoạt (Premium)',
        role: 'user',
      });
    }
  };

  const handleAddProduct = async (newProduct: any, imageFile: File | null) => {
    try {
      console.log('=== BẮT ĐẦU THÊM SẢN PHẨM MỚI ===');
      console.log('Dữ liệu thô:', newProduct);
      if (imageFile) {
        console.log('Tải kèm tệp ảnh:', imageFile.name, `(${imageFile.size} bytes)`);
      }

      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', String(newProduct.price));
      formData.append('category', newProduct.category);
      formData.append('description', newProduct.description || '');
      formData.append('specs', JSON.stringify(newProduct.specs || []));
      if (imageFile) {
        formData.append('imageFile', imageFile);
      } else if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      const res = await createProduct(formData, token);
      if (res.success && res.product) {
        const added = {
          id: res.product.id || (res.product as any)._id,
          name: res.product.name,
          price: res.product.price,
          category: res.product.category,
          image: res.product.image || newProduct.image,
          description: res.product.description,
          specs: res.product.specs || []
        };
        console.log('Thêm sản phẩm thành công vào state React! Sản phẩm:', added);
        setProducts(prev => [added, ...prev]);
        console.log('Đăng bán sản phẩm thành công!');
      } else {
        console.error('Lỗi phản hồi từ backend khi thêm sản phẩm:', res.message);
        console.error(`Lỗi khi thêm sản phẩm: ${res.message}`);
      }
    } catch (error: any) {
      console.error('Lỗi thêm sản phẩm:', error);
      console.error('Không thể thêm sản phẩm, vui lòng kiểm tra kết nối.');
    }
  };

  const handleEditProduct = async (editedProduct: any, imageFile: File | null) => {
    try {
      console.log(`=== BẮT ĐẦU CẬP NHẬT SẢN PHẨM #${editedProduct.id} ===`);
      console.log('Dữ liệu cập nhật mới:', editedProduct);
      if (imageFile) {
        console.log('Tải kèm tệp ảnh mới:', imageFile.name, `(${imageFile.size} bytes)`);
      }

      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('price', String(editedProduct.price));
      formData.append('category', editedProduct.category);
      formData.append('description', editedProduct.description || '');
      formData.append('specs', JSON.stringify(editedProduct.specs || []));
      if (imageFile) {
        formData.append('imageFile', imageFile);
      } else if (editedProduct.image) {
        formData.append('image', editedProduct.image);
      }

      const res = await updateProduct(editedProduct.id, formData, token);
      if (res.success && res.product) {
        const updated = {
          id: res.product.id || (res.product as any)._id,
          name: res.product.name,
          price: res.product.price,
          category: res.product.category,
          image: res.product.image || editedProduct.image,
          description: res.product.description,
          specs: res.product.specs || []
        };
        console.log('Cập nhật sản phẩm thành công trong state React! Sản phẩm:', updated);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        console.log('Cập nhật sản phẩm thành công!');
      } else {
        console.error('Lỗi phản hồi từ backend khi sửa sản phẩm:', res.message);
        console.error(`Lỗi khi cập nhật sản phẩm: ${res.message}`);
      }
    } catch (error: any) {
      console.error('Lỗi sửa sản phẩm:', error);
      console.error('Không thể cập nhật sản phẩm, vui lòng kiểm tra kết nối.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      console.log(`=== BẮT ĐẦU XÓA SẢN PHẨM #${productId} ===`);
      const res = await deleteProduct(productId, token);
      if (res.success) {
        console.log(`Xóa sản phẩm #${productId} thành công khỏi state React.`);
        setProducts(prev => prev.filter(p => p.id !== productId));
        console.log('Xóa sản phẩm thành công!');
      } else {
        console.error('Lỗi phản hồi từ backend khi xóa sản phẩm:', res.message);
        console.error(`Lỗi khi xóa sản phẩm: ${res.message}`);
      }
    } catch (error: any) {
      console.error('Lỗi xóa sản phẩm:', error);
      console.error('Không thể xóa sản phẩm, vui lòng kiểm tra kết nối.');
    }
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

  const showHeaderFooter = activeTab !== 'dang-nhap' && activeTab !== 'dang-ky' && activeTab !== 'admin';

  const navigationItems: { id: TabType; label: string }[] = [
    { id: 'home', label: 'TRANG CHỦ' },
    { id: 'products', label: 'SẢN PHẨM' },
    { id: 'brand', label: 'THƯƠNG HIỆU' }, // The requested brand page
    { id: 'news', label: 'TIN TỨC' },
    { id: 'contact', label: 'LIÊN HỆ' }
  ];

  return (
    <div ref={appRef} className="min-h-screen bg-[#f7f9fb] text-gray-900 font-sans flex flex-col justify-between selection:bg-black selection:text-white relative">

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
                onLoginSuccess={(email, userToken) => {
                  const isSystemAdmin = email === 'admin@lumina.com';
                  if (userToken) {
                    setToken(userToken);
                    localStorage.setItem('techvie_token', userToken);
                  }
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
                onLoginSuccess={(email, userToken) => {
                  const isSystemAdmin = email === 'admin@lumina.com';
                  if (userToken) {
                    setToken(userToken);
                    localStorage.setItem('techvie_token', userToken);
                  }
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
                setIsLoggedIn={handleSetIsLoggedIn}
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

      {/* Floating Back to Admin panel button for logged-in Administrators - Draggable - ONLY on account/profile page */}
      {isLoggedIn && userProfile.role === 'admin' && activeTab === 'account' && (
        <div 
          ref={constraintsRef} 
          className="fixed inset-8 border-2 border-dashed border-indigo-400/25 bg-indigo-500/[0.01] rounded-3xl pointer-events-none z-50 flex items-end justify-center pb-2 select-none"
        >
          {/* Subtle label showing drag limit zone boundaries */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/90 border border-indigo-150/80 backdrop-blur-md text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest pointer-events-none shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            VÙNG GIỚI HẠN DI CHUYỂN NÚT ADMIN
          </div>

          <motion.button
            drag
            dragConstraints={constraintsRef}
            dragMomentum={true}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            dragElastic={0.05}
            style={{ x: adminBtnPos.x, y: adminBtnPos.y }}
            whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
            onDragStart={() => {
              isDraggingRef.current = true;
            }}
            onDragEnd={(event, info) => {
              const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
              const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
              
              const minX = -16;
              const maxX = Math.max(0, screenWidth - 260);
              const minY = -Math.max(0, screenHeight - 128);
              const maxY = 16;

              const rawX = adminBtnPos.x + info.offset.x;
              const rawY = adminBtnPos.y + info.offset.y;

              const clampedX = Math.min(Math.max(rawX, minX), maxX);
              const clampedY = Math.min(Math.max(rawY, minY), maxY);

              setAdminBtnPos({ x: clampedX, y: clampedY });
              try {
                localStorage.setItem('admin_btn_pos', JSON.stringify({ x: clampedX, y: clampedY }));
              } catch (e) {
                console.error('Failed to save admin button position:', e);
              }
              // Tiny buffer to prevent click handler from firing right after letting go of drag
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 100);
            }}
            onClick={() => {
              if (isDraggingRef.current) return;
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group absolute bottom-4 left-4 pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/20 text-[11px] font-bold tracking-wider cursor-grab active:cursor-grabbing shadow-[0_8px_32px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_44px_rgba(99,102,241,0.4)] uppercase font-sans overflow-hidden select-none touch-none"
          >
            {/* Shimmer sweep glass effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:glass-shimmer-sweep pointer-events-none" />
            
            <ShieldAlert size={14} className="text-white group-hover:rotate-12 transition-transform duration-200 pointer-events-none" />
            <span className="relative z-10 text-white pointer-events-none">Quản trị Hệ thống</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
