import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  templateHeaders: string[]; // e.g. ["name", "price", "category", "image", "description", "specs"]
  templateRows: string[][]; // Sample rows to download/view
  onImport: (parsedData: any[]) => void;
  isDarkMode?: boolean;
}

export default function CsvImportModal({
  isOpen,
  onClose,
  title = "Nhập dữ liệu từ tệp CSV",
  templateHeaders,
  templateRows,
  onImport,
  isDarkMode = false
}: CsvImportModalProps) {
  const d = isDarkMode;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Simple CSV Parser supporting quotes and comma separation
  const parseCSV = (text: string) => {
    const lines: string[] = [];
    let currentLine = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === '\n' && !inQuotes) {
        lines.push(currentLine.trim());
        currentLine = '';
      } else if (char === '\r') {
        // Skip return carriage character
      } else {
        currentLine += char;
      }
    }
    if (currentLine) {
      lines.push(currentLine.trim());
    }

    if (lines.length === 0) {
      setErrors(["Tệp CSV rỗng."]);
      return;
    }

    // Header parse
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
    
    // Check if required headers exist
    const missingHeaders = templateHeaders.filter(
      h => !headers.includes(h.toLowerCase())
    );

    if (missingHeaders.length > 0) {
      setErrors([`Tệp CSV thiếu các cột bắt buộc: ${missingHeaders.join(', ')}`]);
      return;
    }

    const data: any[] = [];
    const parseErrors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      
      const values: string[] = [];
      let currentValue = '';
      let valueInQuotes = false;

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          valueInQuotes = !valueInQuotes;
        } else if (char === ',' && !valueInQuotes) {
          values.push(currentValue.replace(/^"|"$/g, '').trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.replace(/^"|"$/g, '').trim());

      const rowObj: any = {};
      headers.forEach((header, index) => {
        rowObj[header] = values[index] || '';
      });

      // Simple validation for product creation
      if (templateHeaders.includes('name') && !rowObj.name) {
        parseErrors.push(`Dòng ${i + 1}: Thiếu tên sản phẩm ("name").`);
      }
      if (templateHeaders.includes('price') && isNaN(Number(rowObj.price))) {
        parseErrors.push(`Dòng ${i + 1}: Cột giá bán ("price") phải là một số hợp lệ.`);
      }

      data.push(rowObj);
    }

    if (parseErrors.length > 0) {
      setErrors(parseErrors.slice(0, 5)); // Show first 5 errors
    } else {
      setParsedData(data);
      setErrors([]);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setErrors([]);
    setParsedData([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrors(["Không thể đọc tập tin CSV."]);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Generate template CSV for download
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + templateHeaders.join(",") + "\n"
      + templateRows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "techvie_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      onClose();
      // Reset state
      setSelectedFile(null);
      setParsedData([]);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[101] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`rounded-[2.5rem] p-8 max-w-lg w-full relative shadow-2xl font-sans text-left border transition-all duration-300 ${
        d 
          ? 'bg-[#161b22] border border-[#30363d] text-white' 
          : 'bg-white border border-gray-200 text-gray-955'
      }`}>
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-6 right-6 w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            d 
              ? 'border-[#30363d] text-gray-400 hover:bg-[#21262d] hover:text-white' 
              : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
        >
          <X size={14} />
        </button>

        <h3 className={`text-sm font-extrabold uppercase tracking-wider mb-5 pb-3 border-b border-gray-200/10 ${d ? 'text-white' : 'text-gray-955'}`}>
          {title}
        </h3>

        <div className="space-y-5">
          {/* File Template Download */}
          <div className={`p-4 rounded-2xl flex items-center justify-between border ${
            d ? 'bg-[#0d1117]/60 border-[#30363d]' : 'bg-slate-50 border-gray-100'
          }`}>
            <div className="flex items-center gap-3">
              <FileText className={`w-5 h-5 ${d ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <div className="text-left">
                <span className="text-[11px] font-black uppercase tracking-wider block">Tập tin CSV mẫu</span>
                <span className={`text-[10px] block mt-0.5 ${d ? 'text-gray-400' : 'text-gray-500'}`}>Tải về cấu trúc bảng mẫu chuẩn</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all active:scale-95 cursor-pointer ${
                d 
                  ? 'border-indigo-900/30 bg-indigo-950/20 text-indigo-400 hover:bg-indigo-900/35' 
                  : 'border-indigo-150 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Tải File Mẫu
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-500/5' 
                : d 
                  ? 'border-[#30363d] bg-[#0d1117]/30 hover:bg-[#161b22]' 
                  : 'border-gray-250 bg-slate-50/50 hover:bg-slate-100/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${d ? 'bg-[#21262d]' : 'bg-white'} shadow-sm border ${d ? 'border-[#30363d]' : 'border-gray-150'}`}>
              <Upload className={`w-5 h-5 ${d ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider">Kéo thả file vào đây hoặc bấm để chọn</p>
              <p className={`text-[9px] mt-1 ${d ? 'text-gray-500' : 'text-gray-400'}`}>Hỗ trợ định dạng file .csv</p>
            </div>
          </div>

          {/* File selection status */}
          {selectedFile && (
            <div className={`p-4 rounded-2xl flex items-center justify-between border ${
              errors.length > 0 
                ? d ? 'bg-rose-950/20 border-rose-900/30 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-700'
                : d ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
            }`}>
              <div className="flex items-center gap-3">
                {errors.length > 0 ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                <div className="text-left">
                  <span className="text-[11px] font-black uppercase tracking-wider block truncate max-w-xs">{selectedFile.name}</span>
                  <span className="text-[10px] block mt-0.5">
                    {isProcessing 
                      ? 'Đang xử lý...' 
                      : errors.length > 0 
                        ? 'Lỗi định dạng tệp tin' 
                        : `Đã đọc thành công ${parsedData.length} dòng dữ liệu.`}
                  </span>
                </div>
              </div>
              {isProcessing && <RefreshCw className="w-4 h-4 animate-spin" />}
            </div>
          )}

          {/* Errors list */}
          {errors.length > 0 && (
            <div className="space-y-1.5 text-left">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">Chi tiết lỗi phát hiện:</span>
              <ul className="text-[10px] list-disc list-inside space-y-0.5 text-rose-400">
                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl border transition-all text-xs font-black uppercase cursor-pointer text-center ${
                d 
                  ? 'border-[#30363d] text-gray-300 hover:bg-[#21262d]' 
                  : 'border-gray-200 text-gray-555 hover:bg-gray-50'
              }`}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={parsedData.length === 0 || errors.length > 0}
              onClick={handleImportClick}
              className={`flex-1 py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-black transition-all shadow active:scale-95 cursor-pointer text-center disabled:opacity-40 disabled:pointer-events-none ${
                d 
                  ? 'bg-white! hover:bg-gray-100! text-black' 
                  : 'bg-black hover:bg-gray-900 text-white'
              }`}
            >
              Bắt đầu Nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
