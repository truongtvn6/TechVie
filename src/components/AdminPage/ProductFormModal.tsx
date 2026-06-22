import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Trash2, Plus, UploadCloud } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSave: (productData: any, imageFile: File | null) => void;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  onSave,
}: ProductFormModalProps) {
  // Input fields local states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodCategory, setProdCategory] = useState('Điện thoại');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Dynamic Specifications representation matching user's dynamic specs requirement
  const [formSpecs, setFormSpecs] = useState<{ label: string; value: string }[]>([]);

  // Initialize fields on open or change in editingProduct
  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
      if (editingProduct) {
        setProdName(editingProduct.name);
        setProdPrice(editingProduct.price);
        setProdCategory(editingProduct.category);
        setProdImage(editingProduct.image);
        setProdDesc(editingProduct.description || '');
        setFormSpecs(editingProduct.specs || []);
      } else {
        setProdName('');
        setProdPrice(9900000);
        setProdCategory('Điện thoại');
        setProdImage('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
        setProdDesc('Sản phẩm công nghệ tinh tế bứt phá hiệu năng, chế tác cao cấp từ Lumina Lab Thụy Sĩ.');
        setFormSpecs([
          { label: 'Hộp chip', value: 'Silicon Lumina Standard' },
          { label: 'Màn hình', value: '6.1" OLED Retina' },
          { label: 'Dung lượng Pin', value: '4000 mAh' },
          { label: 'Chuẩn kháng nước', value: 'IP68 chuẩn hãng' }
        ]);
      }
    }
  }, [isOpen, editingProduct]);

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
      <div className="bg-white border border-gray-200 rounded-[2.5rem] p-6 md:p-10 max-w-7xl w-full max-h-[92vh] overflow-y-auto relative text-gray-950 font-sans text-xs my-auto shadow-[0_24px_70px_rgba(0,0,0,0.12)] scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Top-Right Action Control Area next to close button */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-3.5 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-650 hover:bg-gray-50 hover:text-black transition-all font-sans text-xs font-black uppercase cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="product-form-modal-form"
            className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 font-sans text-xs uppercase tracking-widest font-black transition-all shadow active:scale-95 cursor-pointer"
          >
            {editingProduct ? 'Cấu định thay đổi' : 'Đăng bán độc bản'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer shrink-0"
            title="Đóng bảng chỉnh sửa"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight mb-6 text-left pr-60">
          {editingProduct ? 'Hiệu chỉnh đặc tả độc bản' : 'Chế tác nguyên mẫu'}
        </h2>

        <form id="product-form-modal-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Prominent Section 1: Thông tin chung */}
          <section className="bg-slate-50 border border-gray-150 rounded-3xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">01 / Thông tin chung</span>
              <div className="h-px flex-1 bg-gray-200/60"></div>
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
                  placeholder="Ví dụ: Lumina Ultra Book X"
                  className="w-full bg-white border border-gray-250 focus:border-black focus:outline-none focus:ring-1 focus:ring-black rounded-xl px-4 py-3 text-xs text-gray-900 transition-all placeholder-gray-400 font-semibold"
                />
              </div>

              {/* Pricing field */}
              <div className="lg:col-span-3 space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Giá bán niêm yết (VND) *</label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-white border border-gray-250 focus:border-black focus:outline-none focus:ring-1 focus:ring-black rounded-xl px-4 py-3 text-xs text-gray-900 transition-all font-mono font-bold placeholder-gray-400"
                />
              </div>

              {/* Category selector */}
              <div className="lg:col-span-3 space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Phân loại thiết bị</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full bg-white border border-gray-250 focus:border-black focus:outline-none focus:ring-1 focus:ring-black rounded-xl px-4 py-3 text-xs text-gray-900 dropdown-custom cursor-pointer transition-all font-bold pr-10"
                >
                  <option value="Điện thoại">Điện thoại</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Đồng hồ">Đồng hồ</option>
                  <option value="Âm thanh">Âm thanh</option>
                  <option value="Bàn phím">Bàn phím</option>
                </select>
              </div>

            </div>
          </section>

          {/* Grid Bottom: Description, Image and Technical specs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Column 1: Description */}
            <section className="bg-slate-50 border border-gray-150 rounded-3xl p-6 flex flex-col text-left">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">02 / Mô tả sản phẩm</span>
                <div className="h-px flex-1 bg-gray-200/60"></div>
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả đặc tính cốt lõi</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Nhập những đặc điểm nổi bật đặc biệt nhất của thiết bị..."
                  className="w-full flex-1 min-h-[220px] bg-white border border-gray-200 focus:border-black focus:outline-none focus:ring-1 focus:ring-black rounded-xl px-4 py-3 text-xs text-gray-900 transition-all resize-none leading-relaxed"
                />
              </div>
            </section>

            {/* Column 2: Media/Image upload preview */}
            <section className="bg-slate-50 border border-gray-150 rounded-3xl p-6 flex flex-col text-left">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">03 / Hình ảnh & Render</span>
                <div className="h-px flex-1 bg-gray-200/60"></div>
              </div>
              <div className="flex-1 flex flex-col space-y-4">
                <div className="relative group border border-dashed border-gray-200 rounded-2xl p-6 flex-1 flex flex-col items-center justify-center gap-3 bg-white hover:bg-slate-50 transition-all min-h-[160px]">
                  {imageFile || prodImage ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden min-h-[120px]">
                      <img 
                        referrerPolicy="no-referrer"
                        src={imageFile ? URL.createObjectURL(imageFile) : prodImage} 
                        alt="Mockup preview" 
                        className="max-h-[120px] object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[8px] font-mono tracking-widest text-emerald-700 font-bold uppercase flex items-center gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping inline-block" />
                        Preview OK
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                        <UploadCloud className="text-gray-500 w-5 h-5 stroke-[1.5]" />
                      </div>
                      <div className="text-center font-medium">
                        <p className="text-xs text-gray-950">Chưa có ảnh</p>
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
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">URL Đường dẫn ảnh</label>
                    <input
                      type="text"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="Dán liên kết hình ảnh độc bản..."
                      className="w-full bg-white border border-gray-200 focus:border-black focus:outline-none focus:ring-1 focus:ring-black rounded-xl px-3 py-2 text-xs text-gray-900 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Column 3: Technical specifications */}
            <section className="bg-slate-50 border border-gray-150 rounded-3xl p-6 flex flex-col text-left">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">04 / Thông số kỹ thuật</span>
                <div className="h-px flex-1 bg-gray-200/60"></div>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {formSpecs.map((spec, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-white border border-gray-150 rounded-2xl group hover:border-black/15 transition-all flex gap-3 items-center shadow-[0_2px_6px_rgba(0,0,0,0.01)]"
                  >
                    <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider block">Tên thông số</span>
                        <input
                          type="text"
                          required
                          value={spec.label}
                          onChange={(e) => {
                            const newSpecs = [...formSpecs];
                            newSpecs[index].label = e.target.value;
                            setFormSpecs(newSpecs);
                          }}
                          className="w-full bg-transparent border-0 p-0 text-xs font-black text-slate-800 placeholder-slate-350 focus:outline-none focus:ring-0"
                          placeholder="Nhãn..."
                        />
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider block">Giá trị</span>
                        <input
                          type="text"
                          required
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = [...formSpecs];
                            newSpecs[index].value = e.target.value;
                            setFormSpecs(newSpecs);
                          }}
                          className="w-full bg-transparent border-0 p-0 text-xs font-semibold text-slate-900 placeholder-slate-350 focus:outline-none focus:ring-0"
                          placeholder="Giá trị..."
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
                      className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-100 flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
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
                  className="w-full py-3.5 border border-dashed border-gray-250 hover:border-black/20 hover:bg-slate-100/30 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-black flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer mt-2"
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
