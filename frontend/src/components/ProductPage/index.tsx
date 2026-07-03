import { useState, MouseEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, TabType } from '../../types';
import { Plus, Check, SlidersHorizontal, Eye, Cpu, Search, ArrowUpDown, X, Laptop, Smartphone, Watch, Headphones, Keyboard, LayoutGrid, Filter } from 'lucide-react';
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
    specs: safeSpecs,
    colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? p.colors.split(',').map((c: string) => c.trim()) : []),
    averageRating: typeof p.averageRating === 'number' ? p.averageRating : 0,
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : 0,
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

  // Advanced Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

  const availableColors = Array.from(new Set(allProducts.flatMap(p => p.colors || []))).filter(Boolean);
  const maxProductPrice = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 100000000;
  
  useEffect(() => {
    if (allProducts.length > 0) {
      const maxPrice = Math.max(...allProducts.map(p => p.price));
      setPriceRange(prev => [prev[0], prev[1] === 100000000 ? maxPrice : prev[1]]);
    }
  }, [allProducts.length]);

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

  // Apply advanced filters
  filteredProducts = filteredProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter(p => p.colors?.some(c => selectedColors.includes(c)));
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
      <div className="space-y-6 pb-8 mb-12">
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

        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-9 relative">
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
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`w-full text-sm font-sans py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black text-gray-700 font-bold flex items-center justify-center cursor-pointer transition-all border border-gray-400 ${isFilterOpen ? 'bg-black text-white hover:bg-gray-800 border-black' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <Filter size={16} className="mr-2" />
              {isFilterOpen ? 'Đóng bộ lọc' : 'Bộ lọc nâng cao'}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Khoảng Giá</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-mono">Từ</span>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                          className="w-full bg-white border border-gray-300 rounded-lg pl-8 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <span className="text-gray-400 text-xs">-</span>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-mono">Đến</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || maxProductPrice])}
                          className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min={0} 
                      max={maxProductPrice} 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-black h-1.5"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Màu sắc</h3>
                  {availableColors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            if (selectedColors.includes(color)) {
                              setSelectedColors(selectedColors.filter(c => c !== color));
                            } else {
                              setSelectedColors([...selectedColors, color]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                            selectedColors.includes(color)
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Không có lựa chọn màu sắc.</p>
                  )}
                </div>

                {/* Sắp xếp & Actions */}
                <div className="flex flex-col h-full">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Sắp xếp</h3>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full text-xs font-sans px-3 py-2.5 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-gray-700 font-bold border border-gray-300 appearance-none cursor-pointer"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ArrowUpDown size={12} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 ml-auto">
                    {/* <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <SlidersHorizontal size={12} /> Hiển thị {filteredProducts.length} / {allProducts.length}
                    </span> */}
                    <button
                      disabled={selectedCategory === 'Tất cả' && searchQuery === '' && sortBy === 'default' && selectedColors.length === 0 && priceRange[0] === 0 && priceRange[1] === maxProductPrice}
                      onClick={() => {
                        setSelectedCategory('Tất cả');
                        setSearchQuery('');
                        setSortBy('default');
                        setSelectedColors([]);
                        setPriceRange([0, maxProductPrice]);
                      }}
                      className="text-[12px] font-bold text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-lg uppercase tracking-wider disabled:opacity-40 disabled:hover:bg-black transition-colors flex items-center gap-1.5"
                    >
                      <X size={14} />
                      Đặt lại
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(selectedCategory !== 'Tất cả' || searchQuery !== '' || sortBy !== 'default' || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < maxProductPrice) && (
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
            {selectedColors.map(c => (
              <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full font-sans font-bold text-[12px] uppercase tracking-wider">
                Màu: {c}
                <X size={10} className="cursor-pointer" onClick={() => setSelectedColors(selectedColors.filter(color => color !== c))} />
              </span>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < maxProductPrice) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full font-sans font-bold text-[12px] uppercase tracking-wider">
                Giá: {priceRange[0].toLocaleString()}đ - {priceRange[1].toLocaleString()}đ
                <X size={10} className="cursor-pointer" onClick={() => setPriceRange([0, maxProductPrice])} />
              </span>
            )}
            <span className="text-[13px] font-mono text-gray-900 uppercase tracking-wide flex items-center gap-1.5 ml-auto">
              <SlidersHorizontal size={12} /> Hiển thị: {filteredProducts.length}/{allProducts.length} sản phẩm
            </span>
            {/* <span className="text-gray-400 ml-auto font-mono text-[11px]">Hiển thị {filteredProducts.length} / {allProducts.length}</span> */}
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
