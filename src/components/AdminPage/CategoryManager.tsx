import React, { useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, RotateCcw, Check, X } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  created_at?: string;
  isDeleted: boolean;
}

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (name: string) => Promise<void>;
  onUpdateCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onRestoreCategory: (id: string) => Promise<void>;
  showDeletedItems: boolean;
  isDarkMode?: boolean;
}

export default function CategoryManager({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onRestoreCategory,
  showDeletedItems,
  isDarkMode = false,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onCreateCategory(newCategoryName.trim());
      setNewCategoryName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onUpdateCategory(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const d = isDarkMode;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form to create Category (4 cols) */}
        <div className={`lg:col-span-4 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4 border transition-all duration-300 ${
          d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
        }`}>
          <div>
            <h3 className={`font-extrabold text-base uppercase tracking-wider text-left transition-colors duration-300 ${d ? 'text-white' : 'text-gray-955'}`}>
              Thêm Danh mục mới
            </h3>
            <p className={`text-xs md:text-[13px] font-sans mt-1.5 leading-relaxed text-left transition-colors duration-300 ${d ? 'text-gray-400' : 'text-gray-405'}`}>
              Tạo danh mục sản phẩm mới để dễ phân loại quầy hàng công nghệ của bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 flex flex-col text-left">
              <label className="text-[10px] uppercase font-bold text-gray-400">Tên danh mục *</label>
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ví dụ: Laptop Gaming"
                className={`w-full rounded-xl px-4 py-3 outline-none text-xs font-semibold transition-all duration-300 border ${
                  d
                    ? 'bg-[#0d1117]/60 border-[#30363d] text-white focus:bg-[#161b22] focus:border-indigo-500 placeholder-gray-500'
                    : 'bg-slate-50 border-slate-200 focus:border-black focus:bg-white text-gray-905 placeholder-gray-400'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 px-6 text-white font-sans text-xs uppercase tracking-widest font-black rounded-xl transition-all duration-300 shadow active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                d ? 'bg-white! hover:bg-gray-100! text-black' : 'bg-black hover:bg-slate-900 text-white'
              }`}
            >
              <Plus size={14} />
              Thêm danh mục
            </button>
          </form>
        </div>

        {/* List of categories (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`p-6 sm:p-8 rounded-3xl shadow-sm flex justify-between items-center border transition-all duration-300 ${
            d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
          }`}>
            <div className="text-left">
              <h3 className={`font-extrabold text-base uppercase tracking-wider transition-colors duration-300 ${d ? 'text-white' : 'text-gray-955'}`}>
                {showDeletedItems ? 'Dữ liệu danh mục lưu trữ' : 'Danh mục đang hoạt động'}
              </h3>
              <p className={`text-xs md:text-[13px] font-sans mt-1.5 leading-relaxed transition-colors duration-300 ${d ? 'text-gray-400' : 'text-gray-405'}`}>
                Danh sách các danh mục hàng hóa trong cơ sở dữ liệu hệ thống.
              </p>
            </div>
            <span className={`text-xs font-mono font-bold px-4 py-2 rounded-full border transition-all duration-300 ${
              d ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/40' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
            }`}>
              {categories.length} Danh mục
            </span>
          </div>

          {categories.length === 0 ? (
            <div className={`text-center py-20 rounded-[2rem] p-6 border transition-all duration-300 ${
              d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
            }`}>
              <FolderTree size={40} className="text-gray-300 mx-auto mb-3" />
              <p className={`text-sm font-extrabold transition-colors duration-300 ${d ? 'text-white' : 'text-gray-808'}`}>
                Chưa có danh mục nào
              </p>
              <p className={`text-xs transition-colors duration-300 ${d ? 'text-gray-400' : 'text-gray-400'}`}>
                {showDeletedItems 
                  ? 'Không tìm thấy danh mục nào bị xóa trong hệ thống.' 
                  : 'Hãy khởi tạo danh mục đầu tiên từ bảng bên trái.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((c) => (
                <div 
                  key={c._id} 
                  className={`p-5 rounded-3xl shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[140px] border ${
                    d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
                  } ${c.isDeleted ? 'opacity-65' : 'hover:border-black/15'}`}
                >
                  <div className="text-left w-full">
                    {/* Header item info */}
                    <div className={`flex justify-between items-center border-b pb-2 mb-3 transition-all duration-300 ${
                      d ? 'border-[#30363d]' : 'border-gray-100'
                    }`}>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : 'Mặc định'}
                      </span>
                      {c.isDeleted && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-extrabold">
                          Đã xóa mềm
                        </span>
                      )}
                    </div>

                    {editingId === c._id ? (
                      <div className="flex gap-2 items-center mb-3">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className={`flex-1 rounded-lg px-2.5 py-1.5 outline-none text-xs font-bold transition-all duration-300 border ${
                            d
                              ? 'bg-[#0d1117] border-[#30363d] text-white focus:border-indigo-500'
                              : 'bg-slate-50 border-slate-200 focus:border-black focus:bg-white text-gray-905'
                          }`}
                        />
                        <button
                          onClick={() => handleUpdate(c._id)}
                          className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <h4 className={`font-black text-sm tracking-tight transition-colors duration-300 ${
                        d ? 'text-white' : 'text-gray-955'
                      }`}>
                        {c.name}
                      </h4>
                    )}
                  </div>

                  {/* Actions bar inside card */}
                  <div className={`flex items-center justify-end gap-3 pt-3 border-t text-xs transition-all duration-300 ${
                    d ? 'border-[#30363d]' : 'border-gray-50'
                  }`}>
                    {c.isDeleted ? (
                      <button
                        type="button"
                        onClick={() => onRestoreCategory(c._id)}
                        className="text-indigo-500 hover:text-indigo-700 font-black uppercase tracking-wider text-[10px] cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw size={11} />
                        Khôi phục
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEditing(c)}
                          className="text-amber-600 hover:text-amber-800 font-black uppercase tracking-wider text-[10px] cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 size={11} />
                          Đổi tên
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCategory(c._id)}
                          className="text-rose-500 hover:text-rose-700 font-black uppercase tracking-wider text-[10px] cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 size={11} />
                          Xóa mềm
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
