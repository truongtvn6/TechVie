import { useState } from "react";
import {
  RotateCcw,
  AlertCircle,
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  X,
  Package,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Keyboard,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { Product } from "../../types";
import * as XLSX from "xlsx";

interface OrderManagerProps {
  orders: any[];
  isLoadingOrders: boolean;
  onRefreshOrders: () => void;
  onUpdateOrderStatus: (
    orderId: number,
    status: string,
    statusType: string,
  ) => void;
  isDarkMode?: boolean;
  products?: Product[];
}

// Sub-component for product image rendering with elegant fallbacks
interface OrderProductImageProps {
  item: any;
  products?: Product[];
  isDarkMode: boolean;
}

function OrderProductImage({
  item,
  products,
  isDarkMode,
}: OrderProductImageProps) {
  const [imgError, setImgError] = useState(false);

  // Find product dynamically by ID to resolve the image URL
  const resolvedProduct = products?.find(
    (p) => p.id === item.product?.id || p.id === item.product?._id,
  );
  const imageUrl = resolvedProduct?.image || item.product?.image;
  const productName = item.product?.name || "Sản phẩm";

  // Determine fallback icon based on category or name
  const category = (resolvedProduct?.category || "").toLowerCase();
  const name = productName.toLowerCase();

  let IconComponent = Package;
  if (
    category.includes("laptop") ||
    name.includes("laptop") ||
    name.includes("book")
  ) {
    IconComponent = Laptop;
  } else if (
    category.includes("điện thoại") ||
    category.includes("phone") ||
    name.includes("phone") ||
    name.includes("ultra")
  ) {
    IconComponent = Smartphone;
  } else if (
    category.includes("đồng hồ") ||
    category.includes("watch") ||
    name.includes("watch")
  ) {
    IconComponent = Watch;
  } else if (
    category.includes("âm thanh") ||
    category.includes("tai nghe") ||
    name.includes("buds") ||
    name.includes("sound") ||
    name.includes("headphone")
  ) {
    IconComponent = Headphones;
  } else if (
    category.includes("bàn phím") ||
    category.includes("keyboard") ||
    name.includes("keyboard") ||
    name.includes("zenboard")
  ) {
    IconComponent = Keyboard;
  }

  const d = isDarkMode;

  if (!imageUrl || imgError) {
    return (
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
          d
            ? "bg-gradient-to-br from-[#21262d]/80 to-[#161b22]/80 border-[#30363d] text-gray-400"
            : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-450"
        }`}
        title={productName}
      >
        <IconComponent size={18} className="opacity-80" />
      </div>
    );
  }

  return (
    <div
      className={`w-11 h-11 rounded-xl border shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300 ${
        d ? "bg-[#21262d] border-[#30363d]" : "bg-white border-gray-150"
      }`}
    >
      <img
        src={imageUrl}
        alt={productName}
        onError={() => setImgError(true)}
        className={`w-full h-full object-cover ${d ? "" : "mix-blend-multiply"}`}
      />
    </div>
  );
}

export default function OrderManager({
  orders,
  isLoadingOrders,
  onRefreshOrders,
  onUpdateOrderStatus,
  isDarkMode = false,
  products = [],
}: OrderManagerProps) {
  const d = isDarkMode;
  const [confirmAction, setConfirmAction] = useState<{ [orderId: number]: 'success' | 'cancelled' | null }>({});

  const handleExportExcel = () => {
    if (!orders || orders.length === 0) {
      console.log('Không có dữ liệu đơn hàng để xuất Excel.');
      return;
    }

    // Map dữ liệu đơn hàng sang format bảng biểu đẹp mắt
    const excelRows = orders.map((ord: any) => {
      // Nối danh sách sản phẩm thành một chuỗi text duy nhất
      const productsText = ord.items
        ?.map((item: any) => {
          const name = item.product?.name || "Sản phẩm không rõ";
          return `${name} (SL: ${item.quantity})`;
        })
        .join("\n") || "";

      // Định dạng trạng thái tiếng Việt
      let statusVi = ord.status;
      if (ord.statusType === 'pending') statusVi = 'Chờ xử lý';
      else if (ord.statusType === 'processing') statusVi = 'Đang chuẩn bị gửi';
      else if (ord.statusType === 'shipping') statusVi = 'Đang giao bưu tá';
      else if (ord.statusType === 'success') statusVi = 'Hoàn tất bàn giao';
      else if (ord.statusType === 'cancelled') statusVi = 'Đã hủy đơn';

      return {
        "Mã Đơn Hàng": `#${ord.orderId}`,
        "Họ Tên Khách Hàng": ord.fullName,
        "Số Điện Thoại": ord.phone,
        "Địa Chỉ Giao Hàng": ord.address,
        "Chi Tiết Sản Phẩm": productsText,
        "Tổng Tiền (VNĐ)": ord.totalPrice || ord.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0,
        "Trạng Thái Đơn Hàng": statusVi,
        "Phương Thức Thanh Toán": ord.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản Banking',
        "Thời Gian Đặt Hàng": new Date(ord.createdAt).toLocaleString("vi-VN")
      };
    });

    // Tạo worksheet và workbook từ mảng đối tượng
    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sổ Đơn Hàng");

    // Tự động căn rộng cột tương ứng với độ dài dữ liệu
    const maxColsWidth = [
      { wch: 15 }, // Mã Đơn Hàng
      { wch: 25 }, // Họ Tên Khách Hàng
      { wch: 15 }, // Số Điện Thoại
      { wch: 45 }, // Địa Chỉ Giao Hàng
      { wch: 40 }, // Chi Tiết Sản Phẩm
      { wch: 18 }, // Tổng Tiền (VNĐ)
      { wch: 20 }, // Trạng Thái Đơn Hàng
      { wch: 25 }, // Phương Thức Thanh Toán
      { wch: 22 }  // Thời Gian Đặt Hàng
    ];
    worksheet["!cols"] = maxColsWidth;

    // Kích hoạt trình tải xuống file Excel
    const fileName = `Bao_cao_don_hang_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    console.log(`Xuất thành công file Excel báo cáo đơn hàng: ${fileName}`);
  };

  const handleExportCsv = () => {
    if (!orders || orders.length === 0) {
      console.log('Không có dữ liệu đơn hàng để xuất CSV.');
      return;
    }

    const headers = [
      "Mã Đơn Hàng",
      "Họ Tên Khách Hàng",
      "Số Điện Thoại",
      "Địa Chỉ Giao Hàng",
      "Chi Tiết Sản Phẩm",
      "Tổng Tiền (VNĐ)",
      "Trạng Thái Đơn Hàng",
      "Phương Thức Thanh Toán",
      "Thời Gian Đặt Hàng"
    ];

    const csvRows = orders.map((ord: any) => {
      const productsText = ord.items
        ?.map((item: any) => {
          const name = item.product?.name || "Sản phẩm không rõ";
          return `${name} (SL: ${item.quantity})`;
        })
        .join("; ") || "";

      let statusVi = ord.status;
      if (ord.statusType === 'pending') statusVi = 'Chờ xử lý';
      else if (ord.statusType === 'processing') statusVi = 'Đang chuẩn bị gửi';
      else if (ord.statusType === 'shipping') statusVi = 'Đang giao bưu tá';
      else if (ord.statusType === 'success') statusVi = 'Hoàn tất bàn giao';
      else if (ord.statusType === 'cancelled') statusVi = 'Đã hủy đơn';

      const totalPrice = ord.totalPrice || ord.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;

      // Escape quotes and wrap with double quotes to support CSV structure
      return [
        `"${ord.orderId}"`,
        `"${ord.fullName.replace(/"/g, '""')}"`,
        `"${ord.phone}"`,
        `"${ord.address.replace(/"/g, '""')}"`,
        `"${productsText.replace(/"/g, '""')}"`,
        totalPrice,
        `"${statusVi}"`,
        `"${ord.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản Banking'}"`,
        `"${new Date(ord.createdAt).toLocaleString("vi-VN")}"`
      ].join(",");
    });

    // Merge headers and rows with UTF-8 BOM to prevent Vietnamese font corruption in Excel
    const csvContent = "\uFEFF" + headers.join(",") + "\n" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const fileName = `Bao_cao_don_hang_${new Date().toISOString().slice(0,10)}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`Xuất thành công file CSV báo cáo đơn hàng: ${fileName}`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div
        className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 border p-6 sm:p-8 rounded-3xl shadow-sm transition-all duration-300 ${
          d ? "bg-[#161b22] border-[#30363d]" : "bg-white border-gray-200"
        }`}
      >
        <div>
          <h3
            className={`font-extrabold text-base uppercase tracking-wider ${d ? "text-white" : "text-gray-955"}`}
          >
            Theo dõi Sổ bưu kiện đặt hàng
          </h3>
          <p
            className={`text-xs md:text-[13px] font-sans mt-1.5 leading-relaxed ${d ? "text-gray-400" : "text-gray-405"}`}
          >
            Thực hiện phê duyệt lộ trình đơn hàng thực tế lưu trữ tại máy phản
            hồi của Express server.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className={`h-12 px-5 border flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer text-xs font-bold uppercase tracking-wider ${
              d
                ? "bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-emerald-400"
                : "bg-white border-gray-200 hover:bg-gray-50 text-emerald-600 shadow-xs"
            }`}
            title="Xuất báo cáo định dạng Excel (.xlsx)"
          >
            <FileSpreadsheet size={16} />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handleExportCsv}
            className={`h-12 px-5 border flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer text-xs font-bold uppercase tracking-wider ${
              d
                ? "bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-indigo-400"
                : "bg-white border-gray-200 hover:bg-gray-50 text-indigo-600 shadow-xs"
            }`}
            title="Xuất báo cáo định dạng CSV (.csv)"
          >
            <FileText size={16} />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={onRefreshOrders}
            className={`w-12 h-12 border flex items-center justify-center rounded-xl transition-all cursor-pointer ${
              d
                ? "bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-white"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
            title="Tải lại sổ"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Sổ đặt hàng Table list */}
      {isLoadingOrders ? (
        <div
          className={`text-center py-20 border rounded-3xl ${
            d ? "bg-[#161b22] border-[#30363d]" : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-3 ${
              d
                ? "border-white/15 border-t-white"
                : "border-black/15 border-t-black"
            }`}
          />
          <p className={`text-xs ${d ? "text-gray-400" : "text-gray-500"}`}>
            Đang đồng bộ sổ đơn hàng máy chủ...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div
          className={`text-center py-16 border rounded-3xl p-6 ${
            d ? "bg-[#161b22] border-[#30363d]" : "bg-white border-gray-200"
          }`}
        >
          <AlertCircle
            size={36}
            className="text-gray-400 mx-auto mb-3 animate-bounce"
          />
          <p
            className={`text-sm font-extrabold ${d ? "text-white" : "text-gray-805"}`}
          >
            Sổ Đơn Hàng Đang Trống
          </p>
          <p
            className={`text-xs max-w-[320px] mx-auto mt-1 leading-relaxed ${d ? "text-gray-400" : "text-gray-405"}`}
          >
            Chưa có đơn hàng nào được kích hoạt. Hãy dùng chức năng "Tạo đơn
            ngẫu nhiên" hoặc thêm giỏ hàng thanh toán bên cửa hàng.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord: any) => (
            <div
              key={ord.orderId}
              className={`rounded-[1.8rem] overflow-hidden shadow-sm text-xs font-sans border ${
                d ? "bg-[#161b22] border-[#30363d]" : "bg-white border-gray-200"
              }`}
            >
              {/* Row 1 Header */}
              <div
                className={`p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b ${
                  d
                    ? "bg-[#0d1117]/60 border-[#30363d]"
                    : "bg-gray-50/70 border-gray-150/80"
                }`}
              >
                {/* Grid layout chia 4 cột: 1. Mã đơn, 2. Khách hàng, 3. Thời gian, 4. Thành tiền */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 items-center w-full max-w-4xl">
                  {/* Cột 1: Mã đơn hàng */}
                  <div className="flex flex-col">
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider block mb-1.5 ${d ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Mã đơn hàng
                    </span>
                    <strong
                      className={`block font-mono text-sm font-extrabold truncate ${d ? "text-white" : "text-gray-955"}`}
                      title={ord.orderId}
                    >
                      #{ord.orderId}
                    </strong>
                  </div>
                  
                  {/* Cột 2: Khách hàng */}
                  <div className="flex flex-col">
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider block mb-1.5 ${d ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Khách hàng
                    </span>
                    <strong
                      className={`block font-bold text-sm truncate ${d ? "text-white" : "text-gray-900"}`}
                      title={ord.fullName}
                    >
                      {ord.fullName}
                    </strong>
                  </div>

                  {/* Cột 3: Thời gian */}
                  <div className="flex flex-col">
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider block mb-1.5 ${d ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Thời gian
                    </span>
                    <strong
                      className={`block font-mono text-sm font-bold ${d ? "text-gray-300" : "text-gray-900"}`}
                    >
                      {new Date(ord.createdAt).toLocaleString("vi-VN")}
                    </strong>
                  </div>
                  
                  {/* Cột 4: Thành tiền */}
                  <div className="flex flex-col">
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider block mb-1.5 ${d ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Thành tiền
                    </span>
                    <strong
                      className={`block font-mono font-black text-sm text-indigo-500 ${d ? "text-indigo-400" : "text-indigo-600"}`}
                    >
                      {typeof ord.finalTotal === 'number' 
                        ? ord.finalTotal.toLocaleString("vi-VN") + "₫" 
                        : parseInt(String(ord.finalTotal || '0').replace(/[^0-9]/g, '')).toLocaleString("vi-VN") + "₫"}
                    </strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-full ${
                      ord.status === "Hoàn tất bàn giao"
                        ? d
                          ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/40"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                        : ord.status === "Đang giao hàng"
                          ? d
                            ? "bg-blue-950/30 text-blue-400 border border-blue-900/40"
                            : "bg-blue-50 text-blue-700 border border-blue-200/50"
                          : ord.status === "Hủy bỏ"
                            ? d
                              ? "bg-rose-950/30 text-rose-400 border border-rose-900/40"
                              : "bg-rose-50 text-rose-700"
                            : d
                              ? "bg-amber-950/30 text-amber-400 border border-amber-900/40"
                              : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>

              {/* Row 2 Details */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div
                  className={`lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-6 ${
                    d ? "border-[#30363d]" : "border-gray-150"
                  }`}
                >
                  <h4
                    className={`text-[10px] uppercase font-bold tracking-wider ${d ? "text-gray-400" : "text-gray-450"}`}
                  >
                    Thông tin liên hệ nhận hàng
                  </h4>
                  <div
                    className={`space-y-1.5 text-[11px] ${d ? "text-gray-300" : "text-gray-600"}`}
                  >
                    <p>
                      <strong className={d ? "text-gray-200" : "text-gray-800"}>
                        SĐT:
                      </strong>{" "}
                      {ord.phone}
                    </p>
                    <p>
                      <strong className={d ? "text-gray-200" : "text-gray-800"}>
                        Email:
                      </strong>{" "}
                      {ord.email}
                    </p>
                    <p className="flex items-start gap-1">
                      <strong
                        className={`shrink-0 ${d ? "text-gray-200" : "text-gray-800"}`}
                      >
                        <MapPin
                          size={12}
                          className={`inline ${d ? "text-gray-500" : "text-gray-400"}`}
                        />{" "}
                        Địa chỉ:
                      </strong>{" "}
                      <span className="break-words">{ord.address}</span>
                    </p>
                    {ord.notes && (
                      <p
                        className={`text-[10px] p-2 rounded-lg mt-1 border italic ${
                          d
                            ? "bg-amber-950/20 text-amber-300 border-amber-900/20"
                            : "bg-amber-50 text-amber-700/90 border-amber-200/20"
                        }`}
                      >
                        " {ord.notes} "
                      </p>
                    )}
                  </div>
                </div>

                {/* Bought Items list */}
                <div className="lg:col-span-5 space-y-3">
                  <h4
                    className={`text-[10px] uppercase font-bold tracking-wider ${d ? "text-gray-400" : "text-gray-450"}`}
                  >
                    Danh mục thiết bị bưu kiện
                  </h4>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto">
                    {ord.cart?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-2.5 rounded-xl border transition-all duration-300 ${
                          d
                            ? "bg-[#0d1117]/40 border-[#30363d] hover:border-indigo-500/40 hover:bg-[#161b22]/40"
                            : "bg-gray-50/50 border-gray-150 hover:border-indigo-500/30 hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        <div className="flex gap-2.5 items-center min-w-0">
                          <OrderProductImage
                            item={item}
                            products={products}
                            isDarkMode={d}
                          />
                          <div className="min-w-0">
                            <h5
                              className={`font-extrabold truncate text-[11px] ${d ? "text-white" : "text-gray-900"}`}
                            >
                              {item.product?.name}
                            </h5>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] text-gray-400 font-mono">
                                Đơn giá: {item.product?.price?.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <span
                          className={`font-mono font-bold px-2.5 py-1 rounded shrink-0 ml-2 border ${
                            d
                              ? "bg-[#21262d] border-[#30363d] text-gray-200"
                              : "bg-white border-gray-200 text-gray-850"
                          }`}
                        >
                          SL: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Update Status Actions */}
                <div
                  className={`lg:col-span-3 flex flex-col justify-center gap-2 p-4 rounded-2xl border ${
                    d
                      ? "bg-[#0d1117]/30 border-[#30363d]"
                      : "bg-gray-50/30 border-gray-150"
                  }`}
                >
                  <h4
                    className={`text-[9px] uppercase font-bold tracking-wider text-center ${d ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Hệ luyên phê duyệt chuyển trạng thái
                  </h4>

                  <button
                    onClick={() =>
                      onUpdateOrderStatus(
                        ord.orderId,
                        "Đang lắp ráp chuẩn bị gửi",
                        "processing",
                      )
                    }
                    className={`w-full py-2 border font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      d
                        ? "bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-gray-200"
                        : "bg-white hover:bg-gray-100 border-gray-200 text-gray-700"
                    }`}
                  >
                    <Clock size={11} /> Lắp ráp bưu phẩm
                  </button>

                  <button
                    onClick={() =>
                      onUpdateOrderStatus(
                        ord.orderId,
                        "Đang bàn giao bưu tá Express",
                        "shipping",
                      )
                    }
                    className={`w-full py-2 border font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      d
                        ? "bg-blue-950/40 hover:bg-blue-900/60 border-blue-900/30 text-blue-400"
                        : "bg-blue-50 hover:bg-blue-100 border-blue-200/40 text-blue-700"
                    }`}
                  >
                    <Truck size={11} /> Giao bưu tá
                  </button>

                  {confirmAction[ord.orderId] === "success" ? (
                    <div className="space-y-1.5 p-2 rounded-xl border border-emerald-500/25 bg-emerald-500/5">
                      <p className="text-[9px] uppercase font-bold text-center text-emerald-500">Xác nhận hoàn tất đơn hàng?</p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            onUpdateOrderStatus(ord.orderId, "Hoàn tất bàn giao", "success");
                            setConfirmAction(prev => ({ ...prev, [ord.orderId]: null }));
                          }}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[9px] rounded cursor-pointer"
                        >
                          Đồng ý
                        </button>
                        <button
                          onClick={() => setConfirmAction(prev => ({ ...prev, [ord.orderId]: null }))}
                          className={`flex-1 py-1.5 font-bold uppercase tracking-wider text-[9px] rounded cursor-pointer ${
                            d ? "bg-[#21262d] hover:bg-[#30363d] text-gray-300" : "bg-white hover:bg-gray-100 border border-gray-200 text-gray-700"
                          }`}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : confirmAction[ord.orderId] === "cancelled" ? (
                    <div className="space-y-1.5 p-2 rounded-xl border border-rose-500/25 bg-rose-500/5">
                      <p className="text-[9px] uppercase font-bold text-center text-rose-500">Xác nhận hủy đơn hàng?</p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            onUpdateOrderStatus(ord.orderId, "Hủy bỏ", "cancelled");
                            setConfirmAction(prev => ({ ...prev, [ord.orderId]: null }));
                          }}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider text-[9px] rounded cursor-pointer"
                        >
                          Đồng ý
                        </button>
                        <button
                          onClick={() => setConfirmAction(prev => ({ ...prev, [ord.orderId]: null }))}
                          className={`flex-1 py-1.5 font-bold uppercase tracking-wider text-[9px] rounded cursor-pointer ${
                            d ? "bg-[#21262d] hover:bg-[#30363d] text-gray-300" : "bg-white hover:bg-gray-100 border border-gray-200 text-gray-700"
                          }`}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setConfirmAction(prev => ({ ...prev, [ord.orderId]: "success" }))}
                        className={`w-full py-2 border font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          d
                            ? "bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-900/30 text-emerald-400"
                            : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200/40 text-emerald-700"
                        }`}
                      >
                        <CheckCircle size={11} /> Đóng dấu Hoàn tất
                      </button>

                      <button
                        onClick={() => setConfirmAction(prev => ({ ...prev, [ord.orderId]: "cancelled" }))}
                        className={`w-full py-2 font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          d
                            ? "bg-rose-950/30 hover:bg-rose-900/40 text-rose-400"
                            : "bg-rose-50 hover:bg-rose-100 text-rose-600"
                        }`}
                      >
                        <X size={11} /> Hủy bỏ đơn
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
