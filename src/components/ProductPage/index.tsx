import { useState, MouseEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, TabType } from '../../types';
import { Plus, Check, SlidersHorizontal, Eye, Cpu, Search, ArrowUpDown, X, Laptop, Smartphone, Watch, Headphones, Keyboard, LayoutGrid } from 'lucide-react';
import { getCategories, getProducts } from '../../services/api';
import ProductDetail from './ProductDetail';
import ProductCard from './ProductCard';

const normalizeProduct = (p: any): Product => {
  let safeSpecs: { label: string; value: string }[] = [];
  if (Array.isArray(p.specs)) {
    safeSpecs = p.specs.map((s: any) => ({
      label: s && typeof s.label === 'string' ? s.label : 'Thông số',
      value: s && typeof s.value === 'string' ? s.value : (typeof s === 'string' ? s : 'Đang cập nhật')
    }));
  } else if (p.specs && typeof p.specs === 'object') {
    safeSpecs = Object.entries(p.specs).map(([key, val]) => ({
      label: key,
      value: String(val)
    }));
  }
  
  while (safeSpecs.length < 2) {
    safeSpecs.push({ label: 'Thông số', value: 'Đang cập nhật' });
  }

  return {
    id: p.id || p._id || String(Math.random()),
    name: p.name || 'Sản phẩm TechVie',
    price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
    image: p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    category: p.category || 'Thiết bị',
    description: p.description || 'Mô tả đang được cập nhật.',
    specs: safeSpecs
  };
};

interface ProductPageProps {
  products?: Product[];
  onAddToCart: (product: Product) => void;
  onNavigate: (tab: TabType) => void;
}

export default function ProductPage({ products, onAddToCart, onNavigate }: ProductPageProps) {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const allProducts = dbProducts.length > 0 ? dbProducts : (products || []).map(normalizeProduct);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("techvie_token");

  // Magnetic Ripple and Attraction state managers
  const [ripples, setRipples] = useState<{ id: number; productId: string; x: number; y: number }[]>([]);
  const [flyingParticles, setFlyingParticles] = useState<{ id: number; startX: number; startY: number; image: string }[]>([]);
  const [magneticRefId, setMagneticRefId] = useState<string | null>(null);

  const sortOptions = [
    { value: 'default', label: 'Sắp xếp: Mặc định' },
    { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
    { value: 'price-desc', label: 'Giá: Cao đến Thấp' }
  ];

  const currentSortOption = sortOptions.find(o => o.value === sortBy) || sortOptions[0];
  const [categories, setCategories] = useState<string[]>(['Tất cả', 'Điện thoại', 'Laptop', 'Đồng hồ', 'Âm thanh', 'Bàn phím']);

  useEffect(() => {
    let isMounted = true;
    
    getCategories().then(data => {
      if (isMounted && data.success && data.categories) {
        setCategories(data.categories);
      }
    });

    getProducts().then(res => {
      if (isMounted && res.success && res.products && res.products.length > 0) {
        setDbProducts(res.products.map(normalizeProduct));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Điện thoại': return <Smartphone size={14} />;
      case 'Laptop': return <Laptop size={14} />;
      case 'Đồng hồ': return <Watch size={14} />;
      case 'Âm thanh': return <Headphones size={14} />;
      case 'Bàn phím': return <Keyboard size={14} />;
      default: return <LayoutGrid size={14} />;
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === 'Tất cả') return allProducts.length;
    return allProducts.filter(p => p.category === category).length;
  };

  const handleAddToCartWithSuccess = (product: Product, e?: MouseEvent<HTMLButtonElement>) => {
    let rippleX = 50;
    let rippleY = 20;
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (e) {
      const buttonRect = e.currentTarget.getBoundingClientRect();
      rippleX = e.clientX - buttonRect.left;
      rippleY = e.clientY - buttonRect.top;
      startX = buttonRect.left + buttonRect.width / 2;
      startY = buttonRect.top + buttonRect.height / 2;
    }

    const rippleId = Date.now() + Math.random();
    setRipples(prev => [...prev, { id: rippleId, productId: product.id, x: rippleX, y: rippleY }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 800);

    const particleId = Date.now() + Math.random();
    setFlyingParticles(prev => [
      ...prev,
      {
        id: particleId,
        startX: startX,
        startY: startY,
        image: product.image
      }
    ]);

    setTimeout(() => {
      setFlyingParticles(prev => prev.filter(p => p.id !== particleId));
    }, 950);

    setMagneticRefId(product.id);
    setTimeout(() => {
      setMagneticRefId(null);
    }, 600);

    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 2000);
  };

  let filteredProducts = allProducts;
  if (selectedCategory !== 'Tất cả') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.specs.some(s => s.value.toLowerCase().includes(query))
    );
  }
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 max-w-7xl mx-auto px-6"
    >
      {/* Page Header */}
      <div className="mb-14 text-left">
        <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
          DANH MỤC SẢN PHẨM
        </span>
        <h1 className="text-4xl md:text-5xl font-sans tracking-tighter text-gray-950 font-extrabold">
          Phụ Kiện & Đồ Setup
        </h1>
        <p className="text-md text-justify text-gray-500 font-sans mt-2 max-w-2xl">
          Khám phá bộ sưu tập phụ kiện công nghệ tiện ích và các sản phẩm ốp lưng custom độc bản. Nâng tầm không gian làm việc của bạn với thiết kế tối giản, bảo vệ sức khỏe và mang đậm dấu ấn cá nhân.
        </p>
      </div>

      {/* Categories filter tabs */}
      <div className="space-y-6 pb-8 mb-12 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                  }}
                  className={`px-5 py-3 rounded-2xl font-sans text-xs uppercase tracking-wider font-extrabold transition-all duration-300 flex items-center gap-2 relative cursor-pointer group ${
                    isActive
                      ? 'bg-black text-white shadow-lg shadow-black/10 scale-102'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black transition-colors'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black transition-colors duration-300'}`}>
                    {getCategoryIcon(cat)}
                  </span>
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200/60 text-gray-550'
                  }`}>
                    {getCategoryCount(cat)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-150 rounded-full px-4 py-2">
            <SlidersHorizontal size={13} className="text-gray-500" />
            <span>Hiển thị: <strong>{filteredProducts.length}</strong> / {allProducts.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm phụ kiện, ốp lưng, đồ setup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm font-sans pl-12 pr-10 bg-gray-50 rounded-full px-6 py-3 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black placeholder-gray-400 transition-all text-gray-800 font-medium border border-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="md:col-span-3 relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full text-sm font-sans pl-12 pr-10 py-3 bg-gray-50 rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-black text-gray-700 font-bold flex items-center justify-between cursor-pointer transition-all hover:bg-gray-100 text-left relative border border-gray-400"
            >
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ArrowUpDown size={14} />
              </div>
              <span className="truncate">{currentSortOption.label}</span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300" style={{ transform: isSortOpen ? 'translateY(0%) rotate(180deg)' : 'translateY(0%)' }}>
                <svg className="w-3 h-3 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>
            
            <AnimatePresence>
              {isSortOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsSortOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 left-0 mt-2 bg-white border border-gray-400 rounded-2xl shadow-xl z-40 overflow-hidden"
                  >
                    <div className="py-1.5">
                      {sortOptions.map((option) => {
                        const isSelected = sortBy === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSortBy(option.value as any);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3 text-xs font-sans font-extrabold flex items-center justify-between transition-colors hover:bg-gray-50 ${
                              isSelected ? 'text-black bg-gray-50/70' : 'text-gray-500'
                            }`}
                          >
                            <span>{option.label}</span>
                            {isSelected && <Check size={14} className="text-black shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-2">
            <button
              disabled={selectedCategory === 'Tất cả' && searchQuery === '' && sortBy === 'default'}
              onClick={() => {
                setSelectedCategory('Tất cả');
                setSearchQuery('');
                setSortBy('default');
              }}
              className="w-full py-3 px-4 bg-transparent text-gray-900 hover:text-black disabled:opacity-40 disabled:hover:text-gray-400 text-sm font-sans  font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed border border-gray-400 rounded-full"
            >
              <X size={13} />
              Đặt Lại
            </button>
          </div>
        </div>

        {(selectedCategory !== 'Tất cả' || searchQuery !== '' || sortBy !== 'default') && (
          <div className="flex flex-wrap items-center gap-2 mt-4 text-md text-gray-500 font-sans">
            <span>Đang lọc theo:</span>
            {selectedCategory !== 'Tất cả' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full font-sans font-bold text-[12px] uppercase tracking-wider">
                {selectedCategory}
                <X size={10} className="cursor-pointer" onClick={() => setSelectedCategory('Tất cả')} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full font-sans font-bold text-[12px] uppercase tracking-wider">
                Tìm: "{searchQuery}"
                <X size={10} className="cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {sortBy !== 'default' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full font-sans font-bold text-[12px] uppercase tracking-wider">
                {sortBy === 'price-asc' ? 'Giá tăng dần' : 'Giá giảm dần'}
                <X size={10} className="cursor-pointer" onClick={() => setSortBy('default')} />
              </span>
            )}
            <span className="text-gray-400 ml-auto font-mono text-[11px]">Tìm thấy {filteredProducts.length} kết quả</span>
          </div>
        )}
      </div>

      {/* Hardware Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              onAddToCart={handleAddToCartWithSuccess}
              isJustAdded={justAddedId === product.id}
              isMagnetized={magneticRefId === product.id}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Product Detail Specs Modal */}
      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCartWithSuccess}
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      {/* Flying Particles for Cart Magnet */}
      <div className="fixed inset-0 pointer-events-none z-[101]">
        {flyingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              left: particle.startX - 24, 
              top: particle.startY - 24, 
              scale: 0.8, 
              opacity: 1,
              rotate: 0,
              position: 'fixed'
            }}
            animate={{ 
              left: [particle.startX - 24, particle.startX - 80, window.innerWidth - 80],
              top: [particle.startY - 24, particle.startY - 180, 24], 
              scale: [0.8, 1.2, 0.12],
              opacity: [1, 1, 0],
              rotate: [0, -30, 360]
            }}
            transition={{ 
              duration: 0.9, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-2xl border border-gray-250 flex items-center justify-center p-1"
          >
            <img 
              src={particle.image} 
              alt="glowing-hardware" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply" 
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
