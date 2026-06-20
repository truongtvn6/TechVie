import { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { products } from '../data';
import { Product } from '../types';
import { Plus, Minus, Check, SlidersHorizontal, Eye, ShieldCheck, Cpu, Search, ArrowUpDown, X, Laptop, Smartphone, Watch, Headphones, Keyboard, LayoutGrid } from 'lucide-react';

interface ProductPageProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductPage({ onAddToCart }: ProductPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);

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

  const categories = ['Tất cả', 'Điện thoại', 'Laptop', 'Đồng hồ', 'Âm thanh', 'Bàn phím'];

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
    if (category === 'Tất cả') return products.length;
    return products.filter(p => p.category === category).length;
  };

  const handleAddToCartWithSuccess = (product: Product, e?: MouseEvent<HTMLButtonElement>) => {
    // 1. Calculate dynamic cursor-relative shockwave coordinates inside button bounds
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

    // Dismiss ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 800);

    // 2. Spawn a physical miniature component that gets drawn up magnetically to the cart
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

    // Clean up particles
    setTimeout(() => {
      setFlyingParticles(prev => prev.filter(p => p.id !== particleId));
    }, 950);

    // 3. Trigger slight structural compression layout feedback
    setMagneticRefId(product.id);
    setTimeout(() => {
      setMagneticRefId(null);
    }, 600);

    // Actuate cart state
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 2000);
  };

  // Improved reactive filtering pipeline
  let filteredProducts = products;
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
      <div className="mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
          LUMINA HARDWARE CATALOG
        </span>
        <h1 className="text-4xl md:text-5xl font-sans tracking-tighter text-gray-950 font-extrabold">
          Hệ Sinh Thái Thiết Bị
        </h1>
        <p className="text-sm text-gray-500 font-sans mt-2 max-w-xl">
          Tinh tuyển các thiết bị laptop, smartphone flagship, tai nghe cao cấp và phụ kiện sạc truyền dẫn bậc nhất được thiết kế và sản xuất theo chuẩn mực hi-end.
        </p>
      </div>

      {/* Categories filter tabs */}
      <div className="space-y-6 pb-8 mb-12 border-b border-gray-200">
        {/* Row 1: Categories scrolling tabs */}
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
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-150/65'
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
            <span>Hiển thị: <strong>{filteredProducts.length}</strong> / {products.length} thiết bị</span>
          </div>
        </div>

        {/* Row 2: Search & Utility filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50/50 border border-gray-150/80 p-4 rounded-3xl">
          {/* Search bar inside filter dashboard */}
          <div className="md:col-span-7 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm thiết bị Lumina, thông số hoặc hiệu năng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-sans pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/10 placeholder-gray-400 transition-all text-gray-800 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                title="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Custom interactive dropdown */}
          <div className="md:col-span-3 relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full text-xs font-sans pl-10 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/10 text-gray-700 font-extrabold flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50 text-left h-12 relative"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ArrowUpDown size={14} />
              </div>
              <span className="truncate">{currentSortOption.label}</span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300" style={{ transform: isSortOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)' }}>
                <svg className="w-3 h-3 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>
            
            <AnimatePresence>
              {isSortOpen && (
                <>
                  {/* Click outside backdrop */}
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsSortOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 left-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl z-40 overflow-hidden"
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

          {/* Reset button under specific filters state */}
          <div className="md:col-span-2">
            <button
              disabled={selectedCategory === 'Tất cả' && searchQuery === '' && sortBy === 'default'}
              onClick={() => {
                setSelectedCategory('Tất cả');
                setSearchQuery('');
                setSortBy('default');
              }}
              className="w-full py-3.5 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white text-xs font-sans uppercase tracking-widest font-black text-gray-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <X size={13} />
              Đặt lại
            </button>
          </div>
        </div>

        {/* Small results summary on search or filter updates */}
        {(selectedCategory !== 'Tất cả' || searchQuery !== '' || sortBy !== 'default') && (
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-gray-500 font-sans">
            <span>Đang lọc theo:</span>
            {selectedCategory !== 'Tất cả' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full font-sans font-bold text-[10px] uppercase tracking-wider">
                {selectedCategory}
                <X size={10} className="cursor-pointer" onClick={() => setSelectedCategory('Tất cả')} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full font-sans font-bold text-[10px] uppercase tracking-wider">
                Tìm: "{searchQuery}"
                <X size={10} className="cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {sortBy !== 'default' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full font-sans font-bold text-[10px] uppercase tracking-wider">
                {sortBy === 'price-asc' ? 'Giá tăng dần' : 'Giá giảm dần'}
                <X size={10} className="cursor-pointer" onClick={() => setSortBy('default')} />
              </span>
            )}
            <span className="text-gray-400 ml-auto font-mono text-[11px]">Tìm thấy {filteredProducts.length} kết quả</span>
          </div>
        )}
      </div>

      {/* Hardware Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: magneticRefId === product.id ? 0.96 : 1,
                y: magneticRefId === product.id ? -4 : 0
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={product.id}
              className="group bg-white border border-gray-200 hover:border-black/25 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 h-[560px] shadow-sm relative overflow-hidden"
            >
              {/* Image & Detail Peek Button */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider bg-gray-50 border border-gray-150 text-gray-500 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="w-8 h-8 rounded-full border border-gray-200 hover:border-black hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                    title="Chi tiết kỹ thuật"
                  >
                    <Eye size={14} />
                  </button>
                </div>

                <div 
                  className="h-44 flex items-center justify-center py-6 cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50/50 to-gray-100/30 group-hover:from-gray-100/40 group-hover:to-gray-200/20 transition-all duration-300 border border-transparent group-hover:border-gray-100" 
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Subtle inner reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="max-h-36 object-contain mix-blend-multiply transition-all duration-750 ease-out transform group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-lg"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 tracking-tight mt-6 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-500 font-sans text-xs leading-relaxed mt-2 line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Hardware Specifications Grid Highlight on Hover */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>{product.specs[0].label}: <strong>{product.specs[0].value}</strong></span>
                <span>{product.specs[1].label}: <strong>{product.specs[1].value}</strong></span>
              </div>

              {/* Pricing & Add to cart button */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-450 uppercase font-bold tracking-widest block font-sans">GIÁ NIÊM YẾT</span>
                  <span className="text-xl font-black text-gray-950">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <button 
                  onClick={(e) => handleAddToCartWithSuccess(product, e)}
                  className={`group/btn h-12 rounded-full font-sans text-xs uppercase tracking-widest font-black transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer relative shrink-0 hover:scale-105 active:scale-95 z-10 ${
                    justAddedId === product.id
                      ? 'bg-emerald-600 text-white w-12 xl:w-32 px-0 xl:px-4'
                      : 'bg-black text-white hover:bg-gray-800 w-12 xl:hover:w-40 px-0 xl:hover:px-4 shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10'
                  }`}
                >
                  {/* Dynamic Click Ripples */}
                  {ripples.filter(r => r.productId === product.id).map((ripple) => (
                    <motion.span
                      key={ripple.id}
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 4.5, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute bg-white/40 rounded-full pointer-events-none"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '24px',
                        height: '24px',
                        marginLeft: '-12px',
                        marginTop: '-12px',
                      }}
                    />
                  ))}
                  {justAddedId === product.id ? (
                    <>
                      <Check size={14} className="shrink-0 transition-transform duration-300 group-hover/btn:scale-120" />
                      <span className="hidden xl:inline-block ml-2 whitespace-nowrap text-[10px] font-black tracking-wider transition-all duration-350">
                        Đã Thêm
                      </span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="shrink-0 transition-transform duration-500 group-hover/btn:rotate-90" />
                      <span className="hidden xl:inline-block w-0 opacity-0 xl:group-hover/btn:w-24 xl:group-hover/btn:opacity-100 xl:group-hover/btn:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ease-out text-center text-[10px] tracking-wider font-extrabold">
                        Thêm Vào Giỏ
                      </span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Technical Sheet Specification Dialog/Modal Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-[2.5rem] border border-gray-200 p-8 md:p-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-gray-500 hover:text-black transition-colors"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Image side */}
                <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center aspect-square">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="max-h-60 object-contain mix-blend-multiply"
                  />
                </div>

                {/* Info side */}
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold block mb-1">
                    {selectedProduct.category} • LUMINA REFINERY
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950 mb-3">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm font-black text-secondary-container mb-6 text-indigo-600">
                    {selectedProduct.price.toLocaleString('vi-VN')}₫
                  </p>

                  <p className="text-sm text-gray-600 leading-relaxed font-sans mb-6">
                    {selectedProduct.description}
                  </p>

                  {/* Complete detailed tech specs table */}
                  <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1.5 border-b border-gray-200 pb-2 mb-2">
                      <Cpu size={12} />
                      Bảng thông số kỹ thuật (Tech Sheet)
                    </h4>
                    {selectedProduct.specs.map((spec) => (
                      <div key={spec.label} className="flex justify-between text-xs py-1">
                        <span className="text-gray-500 font-sans">{spec.label}</span>
                        <span className="font-mono text-gray-950 font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        handleAddToCartWithSuccess(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-grow bg-black text-white hover:bg-gray-800 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-black transition-colors"
                    >
                      Thành lập liên kết & Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Portaled / Fixed Flying Particles for Cart Magnetic Suction Attraction */}
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
