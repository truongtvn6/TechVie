import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Trash2, 
  RotateCcw, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  Calendar,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import { 
  getAdminReviews, 
  getAdminReviewStats, 
  deleteReview, 
  restoreReview,
  sendClientLog
} from '../../services/api';

interface ReviewManagerProps {
  isDarkMode?: boolean;
  onRefreshStats?: () => void;
}

export default function ReviewManager({ 
  isDarkMode = false,
  onRefreshStats
}: ReviewManagerProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalReviews: 0,
    deletedReviews: 0,
    recentReviews: 0,
    averageRating: 0,
    breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const d = isDarkMode;

  const loadData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      // 1. Fetch stats
      const statsRes = await getAdminReviewStats();
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }

      // 2. Fetch reviews
      const reviewsRes = await getAdminReviews({
        search: searchQuery || undefined,
        rating: ratingFilter === 'all' ? undefined : ratingFilter,
        includeDeleted: includeDeleted
      });

      if (reviewsRes.success && reviewsRes.reviews) {
        setReviews(reviewsRes.reviews);
      }
      
      if (onRefreshStats) {
        onRefreshStats();
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu review admin:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [ratingFilter, includeDeleted]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // Trigger load directly with empty search
    setIsLoading(true);
    getAdminReviews({
      rating: ratingFilter === 'all' ? undefined : ratingFilter,
      includeDeleted: includeDeleted
    }).then(res => {
      if (res.success && res.reviews) {
        setReviews(res.reviews);
      }
      setIsLoading(false);
    });
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa ẩn đánh giá này khỏi hệ thống công cộng?')) return;

    setActionInProgress(reviewId);
    try {
      sendClientLog(`[ReviewManager] Admin yêu cầu xóa đánh giá ID: ${reviewId}`, 'log');
      const res = await deleteReview(reviewId);
      if (res.success) {
        sendClientLog(`[ReviewManager] Đã xóa đánh giá thành công`, 'log');
        loadData(false);
      } else {
        alert(res.message || 'Xóa đánh giá thất bại');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRestore = async (reviewId: string) => {
    setActionInProgress(reviewId);
    try {
      sendClientLog(`[ReviewManager] Admin yêu cầu khôi phục đánh giá ID: ${reviewId}`, 'log');
      const res = await restoreReview(reviewId);
      if (res.success) {
        sendClientLog(`[ReviewManager] Đã khôi phục đánh giá thành công`, 'log');
        loadData(false);
      } else {
        alert(res.message || 'Khôi phục đánh giá thất bại');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setActionInProgress(null);
    }
  };

  // Helper calculating percentages
  const totalStarStats = Object.values(stats.breakdown).reduce((a: any, b: any) => a + b, 0) as number;
  const fiveStarCount = stats.breakdown[5] || 0;
  const fiveStarPercentage = totalStarStats > 0 ? Math.round((fiveStarCount / totalStarStats) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Tổng đánh giá */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col items-start text-left shadow-xs ${
          d ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-gray-250/60 text-gray-900'
        }`}>
          <div className={`p-3 rounded-2xl mb-4 ${d ? 'bg-indigo-950/40 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
            <MessageSquare size={18} />
          </div>
          <span className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-gray-400">Tổng Đánh Giá</span>
          <span className="text-3xl font-black tracking-tight mt-1">{stats.totalReviews}</span>
          <div className="text-[10px] text-gray-500 mt-2 font-mono">Đang hoạt động công khai</div>
        </div>

        {/* Card 2: Điểm trung bình */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col items-start text-left shadow-xs ${
          d ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-gray-250/60 text-gray-900'
        }`}>
          <div className={`p-3 rounded-2xl mb-4 ${d ? 'bg-amber-950/40 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
            <Star size={18} className="fill-amber-500 text-amber-500" />
          </div>
          <span className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-gray-400">Điểm Trung Bình</span>
          <span className="text-3xl font-black tracking-tight mt-1 flex items-baseline gap-1.5">
            {stats.averageRating}
            <span className="text-xs text-gray-400 font-bold">/ 5</span>
          </span>
          <div className="flex gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map(s => (
              <Star 
                key={s} 
                size={10} 
                className={s <= Math.round(stats.averageRating) ? "text-amber-500 fill-amber-500" : "text-gray-300"} 
              />
            ))}
          </div>
        </div>

        {/* Card 3: 7 Ngày gần đây */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col items-start text-left shadow-xs ${
          d ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-gray-250/60 text-gray-900'
        }`}>
          <div className={`p-3 rounded-2xl mb-4 ${d ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
            <Calendar size={18} />
          </div>
          <span className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-gray-400">Đánh Giá Gần Đây</span>
          <span className="text-3xl font-black tracking-tight mt-1">+{stats.recentReviews}</span>
          <div className="text-[10px] text-emerald-500 mt-2 font-mono font-extrabold">Trong 7 ngày qua</div>
        </div>

        {/* Card 4: Tỉ lệ 5 sao */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col items-start text-left shadow-xs ${
          d ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-gray-250/60 text-gray-900'
        }`}>
          <div className={`p-3 rounded-2xl mb-4 ${d ? 'bg-rose-950/40 text-rose-400' : 'bg-rose-50 text-rose-500'}`}>
            <ThumbsUp size={18} />
          </div>
          <span className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-gray-400">Tỉ Lệ Đánh Giá 5★</span>
          <span className="text-3xl font-black tracking-tight mt-1">{fiveStarPercentage}%</span>
          <div className="text-[10px] text-gray-500 mt-2 font-mono">Đạt {fiveStarCount} lượt 5 sao</div>
        </div>

      </div>

      {/* Main Section */}
      <div className={`p-6 sm:p-8 rounded-[2rem] border transition-all duration-300 ${
        d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
      }`}>
        
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nội dung, tên SP, thành viên..."
                className={`w-full h-11 rounded-xl pl-9 pr-8 text-xs font-semibold outline-none border transition-all duration-300 ${
                  d
                    ? 'bg-[#0d1117]/60 border-[#30363d] text-white focus:bg-[#161b22] focus:border-white placeholder-gray-500'
                    : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-black text-gray-905 placeholder-gray-400'
                }`}
              />
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`h-11 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                d ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-gray-800'
              }`}
            >
              Lọc
            </button>
          </form>

          {/* Filtering controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Star filter dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Số sao:</span>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className={`h-11 rounded-xl px-3 text-xs font-semibold outline-none border transition-all ${
                  d
                    ? 'bg-[#0d1117] border-[#30363d] text-white focus:border-white'
                    : 'bg-slate-50 border-slate-200 focus:border-black text-gray-905'
                }`}
              >
                <option value="all">Tất cả sao</option>
                <option value="5">5 sao ★★★★★</option>
                <option value="4">4 sao ★★★★</option>
                <option value="3">3 sao ★★★</option>
                <option value="2">2 sao ★★</option>
                <option value="1">1 sao ★</option>
              </select>
            </div>

            {/* Toggle show deleted items */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={includeDeleted}
                  onChange={(e) => setIncludeDeleted(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors duration-300 ${
                  includeDeleted ? 'bg-indigo-600' : d ? 'bg-[#30363d]' : 'bg-slate-200'
                }`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${
                  includeDeleted ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Xem Đã Xóa</span>
            </label>

            {/* Refresh button */}
            <button
              onClick={() => loadData(true)}
              disabled={isLoading}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isLoading ? 'opacity-50' : 'active:scale-95'
              } ${
                d ? 'bg-[#0d1117] border-[#30363d] text-white hover:bg-white/5' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-gray-700'
              }`}
              title="Tải lại dữ liệu"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>

          </div>

        </div>

        {/* Data Table */}
        <div className={`rounded-[2rem] overflow-hidden border transition-colors duration-300 ${
          d ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200/80'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`uppercase font-extrabold text-[9px] tracking-wider border-b transition-colors duration-300 ${
                  d ? 'bg-[#0d1117]/60 border-[#30363d] text-gray-500' : 'bg-slate-50 border-slate-150 text-slate-400'
                }`}>
                  <th className="py-4.5 px-6 whitespace-nowrap">Sản phẩm</th>
                  <th className="py-4.5 px-6 whitespace-nowrap">Khách hàng</th>
                  <th className="py-4.5 px-6 whitespace-nowrap">Số sao</th>
                  <th className="py-4.5 px-6 whitespace-nowrap">Nội dung đánh giá</th>
                  <th className="py-4.5 px-6 whitespace-nowrap">Ngày gửi</th>
                  <th className="py-4.5 px-6 whitespace-nowrap">Trạng thái</th>
                  <th className="py-4.5 px-6 whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${d ? 'divide-[#30363d]' : 'divide-slate-150'}`}>
                
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw size={24} className="animate-spin text-indigo-500" />
                        <span className="text-xs font-mono">Đang nạp danh sách đánh giá...</span>
                      </div>
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-24 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle size={32} className="text-gray-300" />
                        <div className="font-extrabold text-sm uppercase tracking-wider">Không tìm thấy đánh giá nào</div>
                        <div className="text-xs text-gray-500">Hãy thử thay đổi bộ lọc tìm kiếm hoặc từ khóa của bạn.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reviews.map((rev) => {
                    const prodName = rev.product_id?.name || 'Sản phẩm không tồn tại';
                    const prodImage = rev.product_id?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
                    const memberName = rev.username || 'Người dùng TechVie';
                    const memberEmail = rev.user_id?.email || 'N/A';
                    
                    return (
                      <tr 
                        key={rev._id}
                        className={`transition-colors duration-300 ${
                          d 
                            ? `hover:bg-[#21262d]/50 ${rev.isDeleted ? 'bg-rose-950/10' : ''}` 
                            : `hover:bg-slate-50/40 ${rev.isDeleted ? 'bg-rose-50/10' : ''}`
                        }`}
                      >
                        
                        {/* Product info */}
                        <td className="py-4 px-6 text-left max-w-[200px]">
                          <div className="flex items-center gap-3">
                            <img 
                              src={prodImage} 
                              alt={prodName} 
                              className="w-10 h-10 rounded-xl object-cover border border-gray-250/20 shrink-0" 
                            />
                            <div className="truncate text-left">
                              <span className={`font-bold block truncate transition-colors duration-300 ${d ? 'text-gray-100' : 'text-gray-900'}`} title={prodName}>
                                {prodName}
                              </span>
                              <span className="text-[10px] text-gray-505 block truncate">ID: {rev.product_id?._id || rev.product_id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="py-4 px-6 text-left">
                          <div>
                            <span className={`font-extrabold block transition-colors duration-300 ${d ? 'text-gray-100' : 'text-gray-900'}`}>
                              {memberName}
                            </span>
                            <span className="text-[10px] text-gray-550 block">{memberEmail}</span>
                          </div>
                        </td>

                        {/* Rating stars */}
                        <td className="py-4 px-6 text-left">
                          <div className="flex items-center gap-1">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                  key={star} 
                                  size={11} 
                                  className={star <= rev.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"} 
                                />
                              ))}
                            </div>
                            <span className={`font-bold ml-1 text-xs ${rev.rating >= 4 ? 'text-amber-500' : rev.rating === 3 ? 'text-gray-500' : 'text-rose-500'}`}>
                              {rev.rating}★
                            </span>
                          </div>
                        </td>

                        {/* Review Content */}
                        <td className="py-4 px-6 text-left max-w-[300px]">
                          <div>
                            {rev.title && (
                              <span className={`font-bold block text-xs mb-1 transition-colors duration-300 ${d ? 'text-gray-200' : 'text-gray-800'}`}>
                                {rev.title}
                              </span>
                            )}
                            <p className="text-gray-500 text-xs leading-relaxed break-words" title={rev.comment}>
                              {rev.comment}
                            </p>
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-6 text-left text-gray-550 whitespace-nowrap">
                          {rev.created_at ? new Date(rev.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-6 text-left">
                          {rev.isDeleted ? (
                            <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                              d ? 'bg-rose-955/30 text-rose-500 border-rose-900/40' : 'bg-rose-50 text-rose-600 border-rose-250'
                            }`}>
                              Đã Xóa
                            </span>
                          ) : (
                            <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                              d ? 'bg-emerald-955/30 text-emerald-400 border-emerald-900/40' : 'bg-emerald-50 text-emerald-700 border-emerald-250'
                            }`}>
                              Công khai
                            </span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {rev.isDeleted ? (
                            <button
                              onClick={() => handleRestore(rev._id)}
                              disabled={actionInProgress === rev._id}
                              className={`h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 ml-auto cursor-pointer shadow-xs active:scale-95 ${
                                d ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-gray-800'
                              }`}
                              title="Khôi phục đánh giá này"
                            >
                              <RotateCcw size={12} className={actionInProgress === rev._id ? "animate-spin" : ""} />
                              Hiện lại
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDelete(rev._id)}
                              disabled={actionInProgress === rev._id}
                              className="h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 ml-auto text-rose-500 hover:text-rose-650 hover:bg-rose-500/5 transition-all cursor-pointer active:scale-95"
                              title="Xóa ẩn đánh giá này"
                            >
                              <Trash2 size={12} className={actionInProgress === rev._id ? "animate-spin" : ""} />
                              Ẩn đi
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
