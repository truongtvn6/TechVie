import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { Trash2, Plus, UploadCloud, Smartphone, Laptop, Watch, Volume2, Keyboard } from 'lucide-react';

const categoriesList = [
  {
    name: "Điện thoại",
    icon: <Smartphone className="w-4 h-4" strokeWidth={1.5} />
  },
  {
    name: "Laptop",
    icon: <Laptop className="w-4 h-4" strokeWidth={1.5} />
  },
  {
    name: "Đồng hồ",
    icon: <Watch className="w-4 h-4" strokeWidth={1.5} />
  },
  {
    name: "Âm thanh",
    icon: <Volume2 className="w-4 h-4" strokeWidth={1.5} />
  },
  {
    name: "Bàn phím",
    icon: <Keyboard className="w-4 h-4" strokeWidth={1.5} />
  }
];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSave: (productData: any, imageFile: File | null) => void;
  isDarkMode?: boolean;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  onSave,
  isDarkMode = false,
}: ProductFormModalProps) {
  // Input fields local states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodCategory, setProdCategory] = useState('Điện thoại');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const d = isDarkMode;

  // Helper functions for formatting price with dots (thousands separator) without cursor jumping
  const formatPriceWithDots = (num: number): string => {
    if (num === 0) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const selectionStart = input.selectionStart || 0;
    const valueBeforeCursor = input.value.slice(0, selectionStart);
    const digitsBefore = valueBeforeCursor.replace(/\D/g, '').length;
    
    const rawValue = input.value.replace(/\D/g, '');
    const parsedValue = parseInt(rawValue, 10) || 0;
    
    setProdPrice(parsedValue);
    
    const formatted = formatPriceWithDots(parsedValue);
    
    setTimeout(() => {
      let newCursorPos = 0;
      let digitCount = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (formatted[i] !== '.') {
          digitCount++;
        }
        newCursorPos = i + 1;
        if (digitCount === digitsBefore) {
          break;
        }
      }
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Dynamic Specifications representation matching user's dynamic specs requirement
  const [formSpecs, setFormSpecs] = useState<{ label: string; value: string }[]>([]);

  // Custom Dropdown State & Ref
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý sự kiện click ra ngoài để tự động đóng menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize fields on open or change in editingProduct
  // useEffect(() => {
  //   if (isOpen) {
  //     setImageFile(null);
  //     if (editingProduct) {
  //       setProdName(editingProduct.name);
  //       setProdPrice(editingProduct.price);
  //       setProdCategory(editingProduct.category);
  //       setProdImage(editingProduct.image);
  //       setProdDesc(editingProduct.description || '');
  //       setFormSpecs(editingProduct.specs || []);
  //     } else {
  //       setProdName('');
  //       setProdPrice(9900000);
  //       setProdCategory('Điện thoại');
  //       setProdImage('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
  //       setProdDesc('Sản phẩm công nghệ tinh tế bứt phá hiệu năng, chế tác cao cấp từ TechVie Lab Thụy Sĩ.');
  //       setFormSpecs([
  //         { label: 'Hộp chip', value: 'Silicon TechVie Standard' },
  //         { label: 'Màn hình', value: '6.1" OLED Retina' },
  //         { label: 'Dung lượng Pin', value: '4000 mAh' },
  //         { label: 'Chuẩn kháng nước', value: 'IP68 chuẩn hãng' }
  //       ]);
  //     }
  //   }
  // }, [isOpen, editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const productData = {
      id: editingProduct?.id,
      name: prodName,
      price: prodPrice,
      category: prodCategory,
      image: prodImage,
      description: prodDesc,
      specs: formSpecs,
    };

    onSave(productData, imageFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4 overflow-y-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className={`rounded-[2.5rem] p-6 md:p-10 max-w-7xl w-full max-h-[92vh] overflow-y-auto relative font-sans text-xs my-auto scrollbar-none transition-all duration-300 ${
        d 
          ? 'bg-[#161b22] border border-[#30363d] text-white shadow-[0_24px_70px_rgba(0,0,0,0.4)]' 
          : 'bg-white border border-gray-200 text-gray-955 shadow-[0_24px_70px_rgba(0,0,0,0.12)]'
      }`}>
        
        {/* Top-Right Action Control Area next to close button */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-3.5 z-10">
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl border transition-all font-sans text-xs font-black uppercase cursor-pointer ${
              d 
                ? 'border-[#30363d] text-gray-100 hover:bg-[#21262d] hover:text-white' 
                : 'border-gray-200 text-gray-655 hover:bg-gray-50 hover:text-black'
            }`}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="product-form-modal-form"
            className={`px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-widest font-black transition-all shadow active:scale-95 cursor-pointer ${
              d 
                ? 'bg-white! hover:bg-gray-100! text-black' 
                : 'bg-black hover:bg-gray-900 text-white'
            }`}
          >
            {editingProduct ? 'thay đổi sản phẩm' : 'đăng bán sản phẩm'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              d 
                ? 'border-[#30363d] hover:border-white text-gray-400 hover:text-white' 
                : 'border-gray-200 hover:border-black text-gray-500 hover:text-black'
            }`}
            title="Đóng bảng chỉnh sửa"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <h2 className={`text-2xl font-black uppercase tracking-tight mb-6 text-left pr-60 ${d ? 'text-white' : 'text-gray-900'}`}>
          {editingProduct ? 'Hiệu chỉnh đặc tả độc bản' : 'Chế tác nguyên mẫu'}
        </h2>

        <form id="product-form-modal-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Prominent Section 1: Thông tin chung */}
          <section className={`border rounded-3xl p-6 text-left transition-all duration-300 ${
            d ? 'bg-[#0d1117]/60 border-black' : 'bg-slate-50 border-gray-100'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">01 / Thông tin chung</span>
              <div className={`h-px flex-1 ${d ? 'bg-[#30363d]/60' : 'bg-gray-200/60'}`}></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Name field */}
              <div className="lg:col-span-6 space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tên thiết bị *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ví dụ: TechVie Ultra Book X"
                  className={`w-full focus:outline-none focus:ring-1 rounded-xl px-4 py-3 text-xs transition-all font-semibold ${
                    d 
                      ? 'bg-[#161b22] border border-[#30363d] focus:!border-white focus:!ring-white !text-white placeholder-gray-500' 
                      : 'bg-white border border-gray-200 focus:border-black focus:ring-black text-gray-905 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Pricing field */}
              <div className="lg:col-span-3 space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Giá bán niêm yết (VND) *</label>
                <input
                  type="text"
                  required
                  value={formatPriceWithDots(prodPrice)}
                  onChange={handlePriceChange}
                  placeholder="0"
                  className={`w-full focus:outline-none focus:ring-1 rounded-xl px-4 py-3 text-xs transition-all font-mono font-bold ${
                    d 
                      ? 'bg-[#161b22] border border-[#30363d] focus:!border-white focus:!ring-white !text-white placeholder-gray-500' 
                      : 'bg-white border border-gray-200 focus:border-black focus:ring-black text-gray-905 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Category selector */}
              <div className="lg:col-span-3 relative" ref={dropdownRef}>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Phân loại thiết bị</label>
                
                {/* Custom Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-xl border text-left transition-all duration-200 cursor-pointer
                    ${d
                      ? isDropdownOpen
                        ? 'bg-[#161b22] border-white ring-1 ring-white text-white shadow-sm'
                        : 'bg-[#161b22] border-[#30363d] text-white hover:border-gray-700 hover:bg-[#21262d]/50'
                      : isDropdownOpen
                        ? 'bg-white border-black ring-1 ring-black text-gray-905 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-905 hover:border-gray-300 hover:bg-gray-50/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-1 rounded-lg transition-colors ${
                      isDropdownOpen 
                        ? d ? 'bg-[#21262d] text-white' : 'bg-slate-100 text-black' 
                        : d ? 'bg-[#0d1117] text-gray-400' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {(categoriesList.find(c => c.name === prodCategory) || categoriesList[0]).icon}
                    </span>
                    <span className={`font-bold text-xs ${d ? 'text-white' : 'text-gray-900'}`}>
                      {prodCategory}
                    </span>
                  </div>
                  
                  {/* Chevron Arrow */}
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-black' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className={`absolute top-full left-0 z-50 w-full mt-2 rounded-2xl shadow-xl py-2 animate-fade-in text-xs transition-all duration-350 border ${
                    d 
                      ? 'bg-[#161b22] border-[#30363d] text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)]' 
                      : 'bg-white border-gray-200 text-gray-900 shadow-xl'
                  }`}>
                    <ul className="max-h-60 overflow-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {categoriesList.map((category) => (
                        <li
                          key={category.name}
                          onClick={() => {
                            setProdCategory(category.name);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors mx-2 rounded-xl group
                            ${prodCategory === category.name 
                              ? d
                                ? 'bg-[#21262d] text-white font-black hover:bg-white/10 hover:text-white'
                                : 'bg-slate-100 text-black font-black hover:bg-black hover:text-white' 
                              : d
                                ? 'text-gray-350 hover:bg-[#21262d] hover:text-white font-bold'
                                : 'text-gray-600 hover:bg-black hover:text-white font-bold'
                            }
                          `}
                        >
                          <span className={`${prodCategory === category.name ? (d ? 'text-white' : 'text-black') : 'text-slate-400'} group-hover:text-white transition-colors`}>
                            {category.icon}
                          </span>
                          <span className="flex-1 text-xs">{category.name}</span>
                          
                          {/* Checkmark indicator */}
                          {prodCategory === category.name && (
                            <svg className={`w-4 h-4 group-hover:text-white transition-colors ${d ? 'text-white' : 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Grid Bottom: Description, Image and Technical specs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Column 1: Description */}
            <section className={`border rounded-3xl p-6 flex flex-col text-left transition-all duration-300 ${
              d ? 'bg-[#0d1117]/60 border-[#30363d]' : 'bg-slate-50 border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">02 / Mô tả sản phẩm</span>
                <div className={`h-px flex-1 ${d ? 'bg-[#30363d]/60' : 'bg-gray-200/60'}`}></div>
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả đặc tính cốt lõi</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Nhập những đặc điểm nổi bật đặc biệt nhất của thiết bị..."
                  className={`w-full flex-1 min-h-[220px] focus:outline-none focus:ring-1 rounded-xl px-4 py-3 text-xs transition-all resize-none leading-relaxed ${
                    d 
                      ? 'bg-[#161b22] border border-[#30363d] focus:!border-white focus:!ring-white !text-white placeholder-gray-500' 
                      : 'bg-white border border-gray-200 focus:border-black focus:ring-black text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </section>

            {/* Column 2: Media/Image upload preview */}
            <section className={`border rounded-3xl p-6 flex flex-col text-left transition-all duration-300 ${
              d ? 'bg-[#0d1117]/60 border-[#30363d]' : 'bg-slate-50 border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">03 / Hình ảnh & Render</span>
                <div className={`h-px flex-1 ${d ? 'bg-[#30363d]/60' : 'bg-gray-200/60'}`}></div>
              </div>
              <div className="flex-1 flex flex-col space-y-4">
                <div className={`relative group border border-dashed rounded-2xl p-6 flex-1 flex flex-col items-center justify-center gap-3 transition-all min-h-[160px] ${
                  d 
                    ? 'border-[#30363d] bg-[#161b22] hover:bg-[#21262d]/45' 
                    : 'border-gray-200 bg-white hover:bg-slate-50'
                }`}>
                  {imageFile || prodImage ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden min-h-[120px]">
                      <img 
                        referrerPolicy="no-referrer"
                        src={imageFile ? URL.createObjectURL(imageFile) : prodImage} 
                        alt="Mockup preview" 
                        className={`max-h-[120px] object-contain p-2 group-hover:scale-105 transition-transform duration-300 ${d ? '' : 'mix-blend-multiply'}`}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded border text-[8px] font-mono tracking-widest font-bold uppercase flex items-center gap-0.5 ${
                        d 
                          ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-400' 
                          : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      }`}>
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping inline-block" />
                        Preview OK
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm ${
                        d ? 'bg-[#21262d] border-[#30363d]' : 'bg-slate-100 border-gray-200'
                      }`}>
                        <UploadCloud className={`${d ? 'text-gray-400' : 'text-gray-500'} w-5 h-5 stroke-[1.5]`} />
                      </div>
                      <div className="text-center font-medium">
                        <p className={`text-xs ${d ? 'text-white' : 'text-gray-955'}`}>Chưa có ảnh</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Tải ảnh mới từ máy tính</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                      className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 cursor-pointer ${
                        d 
                          ? 'bg-[#161b22] border-[#30363d] focus:!border-white focus:!ring-white text-gray-300' 
                          : 'bg-white border-gray-200 focus:border-black focus:ring-black text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">URL Đường dẫn ảnh</label>
                    <input
                      type="text"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="Dán liên kết hình ảnh độc bản..."
                      className={`w-full focus:outline-none focus:ring-1 rounded-xl px-3 py-2 text-xs transition-all font-mono ${
                        d 
                          ? 'bg-[#161b22] border border-[#30363d] focus:!border-white focus:!ring-white !text-white placeholder-gray-500' 
                          : 'bg-white border border-gray-200 focus:border-black focus:ring-black text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Column 3: Technical specifications */}
            <section className={`border rounded-3xl p-6 flex flex-col text-left transition-all duration-300 ${
              d ? 'bg-[#0d1117]/60 border-[#30363d]' : 'bg-slate-50 border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">04 / Thông số kỹ thuật</span>
                <div className={`h-px flex-1 ${d ? 'bg-[#30363d]/60' : 'bg-gray-200/60'}`}></div>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {formSpecs.map((spec, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-2xl group transition-all flex gap-3 items-center shadow-[0_2px_6px_rgba(0,0,0,0.01)] border ${
                      d 
                        ? 'bg-[#161b22] border-[#30363d] hover:border-white/20' 
                        : 'bg-white border-gray-200 hover:border-black/15'
                    }`}
                  >
                    <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider block">Tên thông số</span>
                        <textarea
                          required
                          rows={2}
                          value={spec.label}
                          onChange={(e) => {
                            const newSpecs = [...formSpecs];
                            newSpecs[index].label = e.target.value;
                            setFormSpecs(newSpecs);
                          }}
                          className={`w-full bg-transparent border-0 p-0 text-xs font-black focus:outline-none focus:ring-0 resize-none leading-normal whitespace-pre-wrap break-words scrollbar-none ${
                            d ? 'text-slate-200 placeholder-slate-600' : 'text-slate-800 placeholder-slate-350'
                          }`}
                          placeholder="Nhập vào đây..."
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        />
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider block">Giá trị</span>
                        <textarea
                          required
                          rows={2}
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = [...formSpecs];
                            newSpecs[index].value = e.target.value;
                            setFormSpecs(newSpecs);
                          }}
                          className={`w-full bg-transparent border-0 p-0 text-xs font-semibold focus:outline-none focus:ring-0 resize-none leading-normal whitespace-pre-wrap break-words scrollbar-none ${
                            d ? 'text-white placeholder-slate-600' : 'text-slate-900 placeholder-slate-350'
                          }`}
                          placeholder="Giá trị..."
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => {
                        const newSpecs = formSpecs.filter((_, i) => i !== index);
                        setFormSpecs(newSpecs);
                      }}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
                        d 
                          ? 'bg-[#21262d] text-gray-400 hover:bg-rose-950/40 hover:text-rose-400 border-[#30363d]' 
                          : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border-slate-100'
                      }`}
                      title="Gỡ bỏ thông số"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {/* Add new spec dynamic button */}
                <button
                  type="button"
                  onClick={() => setFormSpecs([...formSpecs, { label: '', value: '' }])}
                  className={`w-full py-3.5 border border-dashed rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer mt-2 ${
                    d 
                      ? 'border-transparent bg-white! text-black hover:bg-gray-100!' 
                      : 'border-gray-250 text-slate-500 hover:border-black/20 hover:bg-slate-100/30 hover:text-black'
                  }`}
                >
                  <Plus size={12} />
                  <span>Thêm thông số mới</span>
                </button>
              </div>
            </section>

          </div>

        </form>
      </div>
    </div>
  );
}
