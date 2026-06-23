import { Product } from '../../types';
import { Plus, Edit3, Trash2 } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onOpenCreateForm: () => void;
  onOpenEditForm: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
}

export default function ProductManager({
  products,
  onOpenCreateForm,
  onOpenEditForm,
  onDelete,
}: ProductManagerProps) {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm">
        <div>
          <h3 className="font-extrabold text-gray-955 text-sm uppercase">Quản lý dải sản phẩm quầy hàng</h3>
          <p className="text-xs text-gray-405 font-sans">
            Người quản lý có thể thêm sản phẩm mới hoặc cập nhật các đặc tả của sản phẩm trực tiếp.
          </p>
        </div>

        <button
          onClick={onOpenCreateForm}
          className="px-5 py-2.5 bg-black hover:bg-gray-900 text-white font-sans text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus size={15} />
          Đăng sản phẩm mới
        </button>
      </div>

      {/* Table list of active products */}
      <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 uppercase font-black text-[9px] tracking-wider">
                <th className="px-6 py-4.5">Định danh Ảnh / Tên</th>
                <th className="px-6 py-4.5">Phân loại</th>
                <th className="px-6 py-4.5">Giá bán</th>
                <th className="px-6 py-4.5 col-span-2">Đặc tả / Thông số tiêu biểu</th>
                <th className="px-6 py-4.5 text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-gray-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 flex gap-3.5 items-center">
                    <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="max-h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-extrabold text-gray-900 text-sm truncate">{p.name}</span>
                      <span className="font-mono text-[9px] text-gray-400 block truncate">{p.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-full text-[9px] tracking-wider uppercase font-bold">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <strong className="text-gray-955 font-black text-sm font-mono">
                      {p.price.toLocaleString('vi-VN')}₫
                    </strong>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <span className="block text-gray-450 line-clamp-2 leading-relaxed text-[11px] mb-1">
                      {p.description}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.specs.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50/50 text-indigo-700 px-1.5 py-0.5 rounded text-[8px] font-mono"
                        >
                          {s.label}: {s.value}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onOpenEditForm(p)}
                        className="w-8 h-8 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 flex items-center justify-center transition-colors"
                        title="Sửa thông tin"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(p.id, p.name)}
                        className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                        title="Xóa thiết bị"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
