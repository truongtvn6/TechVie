import { Product } from '../../types';
import { Plus, Edit3, Trash2 } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onOpenCreateForm: () => void;
  onOpenEditForm: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
  onRestore?: (id: string) => void;
  isDarkMode?: boolean;
}

export default function ProductManager({
  products,
  onOpenCreateForm,
  onOpenEditForm,
  onDelete,
  onRestore,
  isDarkMode = false,
}: ProductManagerProps) {
  const d = isDarkMode;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 border p-6 sm:p-8 rounded-3xl shadow-sm transition-all duration-300 ${
        d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
      }`}>
        <div>
          <h3 className={`font-extrabold text-base uppercase tracking-wider ${d ? 'text-white' : 'text-gray-955'}`}>
            Quản lý dải sản phẩm quầy hàng
          </h3>
          <p className={`text-xs md:text-[13px] font-sans mt-1.5 leading-relaxed ${d ? 'text-gray-400' : 'text-gray-405'}`}>
            Người quản lý có thể thêm sản phẩm mới hoặc cập nhật các đặc tả của sản phẩm trực tiếp.
          </p>
        </div>

        <button
          onClick={onOpenCreateForm}
          className={`h-12 px-6 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
            d ? ' bg-white! hover:bg-gray-100! text-black' : 'bg-black hover:bg-gray-900 text-white'
          }`}
        >
          <Plus size={16} />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Table list of active products */}
      <div className={`border rounded-[2rem] overflow-hidden shadow-sm transition-colors duration-300 ${
        d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b uppercase font-black text-[9px] tracking-wider transition-colors duration-300 ${
                d ? 'bg-[#0d1117]/60 border-[#30363d] text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-450'
              }`}>
                <th className="px-6 py-4.5">Định danh Ảnh / Tên</th>
                <th className="px-6 py-4.5">Phân loại</th>
                <th className="px-6 py-4.5">Giá bán</th>
                <th className="px-6 py-4.5 col-span-2">Đặc tả / Thông số tiêu biểu</th>
                <th className="px-6 py-4.5 text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${
              d ? 'divide-[#30363d] text-gray-300' : 'divide-gray-150 text-gray-700'
            }`}>
              {products.map((p) => (
                <tr key={p.id} className={`transition-colors duration-200 ${
                  d ? '' : 'hover:bg-gray-100'
                }`}>
                  <td className="px-6 py-4">
                    <div className="flex gap-3.5 items-center">
                      <div className={`w-11 h-11 border rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors duration-300 ${
                        d ? 'bg-[#21262d] border-[#30363d]' : 'bg-white border-gray-150'
                      }`}>
                        <img
                          src={p.image}
                          alt={p.name}
                          className={`w-full h-full object-cover ${d ? '' : 'mix-blend-multiply'}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className={`block font-extrabold text-sm truncate flex items-center gap-2 ${d ? 'text-white' : 'text-gray-900'}`}>
                          {p.name}
                          {((p as any).isDeleted || (p as any).status === 'DISCONTINUED') && (
                            <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider rounded font-black border ${
                              d ? 'bg-rose-950/40 text-rose-400 border-rose-900/40' : 'bg-rose-50 text-rose-600 border-rose-200'
                            }`}>
                              Đã xóa
                            </span>
                          )}
                        </span>
                        <span className={`font-mono text-[9px] block truncate ${d ? 'text-gray-500' : 'text-gray-400'}`}>{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] tracking-wider uppercase font-bold transition-colors duration-300 border-none`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <strong className={`font-black text-sm font-mono transition-colors duration-300 ${
                      d ? 'text-indigo-400' : 'text-gray-955'
                    }`}>
                      {p.price.toLocaleString('vi-VN')}₫
                    </strong>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <span className={`block line-clamp-2 leading-relaxed text-[11px] mb-1 ${
                      d ? 'text-gray-400' : 'text-gray-450'
                    }`}>
                      {p.description}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.specs.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors duration-300 ${
                            d ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30' : 'bg-indigo-50/50 text-indigo-700'
                          }`}
                        >
                          {s.label}: {s.value}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {((p as any).isDeleted || (p as any).status === 'DISCONTINUED') ? (
                        <button
                          onClick={() => onRestore && onRestore(p.id)}
                          className={`px-3 h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center transition-colors border ${
                            d 
                              ? 'border-emerald-900/30 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300' 
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                          title="Khôi phục thiết bị"
                        >
                          Khôi phục
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onOpenEditForm(p)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              d ? 'text-gray-400 hover:text-white hover:bg-[#30363d]' : 'text-gray-500 hover:text-black hover:bg-gray-100'
                            }`}
                            title="Sửa thông tin"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => onDelete(p.id, p.name)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              d ? 'text-rose-500 hover:bg-rose-950/30 text-rose-400' : 'text-rose-500 hover:bg-rose-50'
                            }`}
                            title="Xóa thiết bị"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
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
