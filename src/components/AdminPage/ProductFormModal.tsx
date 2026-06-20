import React, { useState, useEffect } from 'react';
import { Product } from '../../types';

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

  // Specifications local states
  const [specCpuLabel, setSpecCpuLabel] = useState('Vi xử lý');
  const [specCpuVal, setSpecCpuVal] = useState('Lumina Core S');
  const [specScreenLabel, setSpecScreenLabel] = useState('Màn hình');
  const [specScreenVal, setSpecScreenVal] = useState('6.1" Retina Liquid');
  const [specBatteryLabel, setSpecBatteryLabel] = useState('Dung lượng Pin');
  const [specBatteryVal, setSpecBatteryVal] = useState('4500 mAh');
  const [specExtraLabel, setSpecExtraLabel] = useState('Chống nước');
  const [specExtraVal, setSpecExtraVal] = useState('Chuẩn kháng nước IP68');

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

        setSpecCpuLabel(editingProduct.specs[0]?.label || 'Vi xử lý');
        setSpecCpuVal(editingProduct.specs[0]?.value || '');
        setSpecScreenLabel(editingProduct.specs[1]?.label || 'Màn hình');
        setSpecScreenVal(editingProduct.specs[1]?.value || '');
        setSpecBatteryLabel(editingProduct.specs[2]?.label || 'Dung lượng Pin');
        setSpecBatteryVal(editingProduct.specs[2]?.value || '');
        setSpecExtraLabel(editingProduct.specs[3]?.label || 'Chống nước');
        setSpecExtraVal(editingProduct.specs[3]?.value || '');
      } else {
        setProdName('');
        setProdPrice(9900000);
        setProdCategory('Điện thoại');
        setProdImage('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
        setProdDesc('Sản phẩm công nghệ tinh tế bứt phá hiệu năng, chế tác cao cấp từ Lumina Lab Thụy Sĩ.');

        setSpecCpuLabel('Hộp chip');
        setSpecCpuVal('Silicon Lumina Standard');
        setSpecScreenLabel('Màn hình');
        setSpecScreenVal('6.1" OLED Retina');
        setSpecBatteryLabel('Dung lượng Pin');
        setSpecBatteryVal('4000 mAh');
        setSpecExtraLabel('Chuẩn kháng nước');
        setSpecExtraVal('IP68 chuẩn hãng');
      }
    }
  }, [isOpen, editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const specsArray = [
      { label: specCpuLabel, value: specCpuVal },
      { label: specScreenLabel, value: specScreenVal },
      { label: specBatteryLabel, value: specBatteryVal },
      { label: specExtraLabel, value: specExtraVal },
    ];

    const productData = {
      id: editingProduct?.id,
      name: prodName,
      price: prodPrice,
      category: prodCategory,
      image: prodImage,
      description: prodDesc,
      specs: specsArray,
    };

    onSave(productData, imageFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] border border-gray-200 p-8 md:p-10 max-w-2xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl font-sans text-xs">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-gray-500 hover:text-black transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight mb-6">
          {editingProduct ? `Sửa thiết bị: ${editingProduct.name}` : 'Thêm thiết bị Lumina mới'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                Tên thiết bị *
              </label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="Ví dụ: Laptop Lumina Air S"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                Giá bán niêm yết (VND) *
              </label>
              <input
                type="number"
                required
                value={prodPrice}
                onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                placeholder="Ví dụ: 19500000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                Phân loại thiết bị
              </label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs font-semibold"
              >
                <option value="Điện thoại">Điện thoại</option>
                <option value="Laptop">Laptop</option>
                <option value="Đồng hồ">Đồng hồ</option>
                <option value="Âm thanh">Âm thanh</option>
                <option value="Bàn phím">Bàn phím</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                Tải ảnh từ máy tính (Cloudinary)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-black focus:bg-white text-xs"
              />
              <input
                type="text"
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
                placeholder="Hoặc nhập trực tiếp URL ảnh"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-black focus:bg-white text-[10px] mt-1.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
              Mô tả đặc tính cốt lõi
            </label>
            <textarea
              rows={3}
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              placeholder="Mô tả tóm tắt tính năng đột phá của dòng sản phẩm..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:bg-white text-xs"
            />
          </div>

          {/* Specs parameters sub table */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block pb-1 border-b border-gray-200">
              Phân định bảng thông số kỹ thuật (4 Đặc tả)
            </span>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Nhãn 1</label>
                <input
                  type="text"
                  value={specCpuLabel}
                  onChange={(e) => setSpecCpuLabel(e.target.value)}
                  className="w-[85%] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Giá trị 1</label>
                <input
                  type="text"
                  value={specCpuVal}
                  onChange={(e) => setSpecCpuVal(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Nhãn 2</label>
                <input
                  type="text"
                  value={specScreenLabel}
                  onChange={(e) => setSpecScreenLabel(e.target.value)}
                  className="w-[85%] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Giá trị 2</label>
                <input
                  type="text"
                  value={specScreenVal}
                  onChange={(e) => setSpecScreenVal(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Nhãn 3</label>
                <input
                  type="text"
                  value={specBatteryLabel}
                  onChange={(e) => setSpecBatteryLabel(e.target.value)}
                  className="w-[85%] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Giá trị 3</label>
                <input
                  type="text"
                  value={specBatteryVal}
                  onChange={(e) => setSpecBatteryVal(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Nhãn 4</label>
                <input
                  type="text"
                  value={specExtraLabel}
                  onChange={(e) => setSpecExtraLabel(e.target.value)}
                  className="w-[85%] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Giá trị 4</label>
                <input
                  type="text"
                  value={specExtraVal}
                  onChange={(e) => setSpecExtraVal(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all"
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-black hover:bg-gray-900 text-white font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow active:scale-98"
            >
              {editingProduct ? 'Cấu định thay đổi' : 'Đăng bán độc bản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
