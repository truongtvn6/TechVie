import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Star, Send, ShieldCheck, Trash2 } from 'lucide-react';
import { Product, TabType, Review, ReviewSummary } from '../../types';
import { getReviewsByProduct, createReview, deleteReview, getCurrentUser, checkCanReview } from '../../services/api';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (tab: TabType) => void;
  isLoggedIn?: boolean;
}

export default function ProductDetail({
  product,
  onClose,
  onAddToCart,
  onNavigate,
  isLoggedIn = false,
}: ProductDetailProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [checkingPurchase, setCheckingPurchase] = useState<boolean>(false);
  const [canReviewReason, setCanReviewReason] = useState<string>('');

  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!product) return;

    const loadReviewsAndUser = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setCanReviewReason('');
      
      // Tải danh sách đánh giá từ API
      const reviewRes = await getReviewsByProduct(product.id);
      if (reviewRes.success) {
        setReviews(reviewRes.reviews);
        setSummary(reviewRes.summary);
      }

      // Kiểm tra người dùng và quyền đánh giá
      if (isLoggedIn) {
        const token = localStorage.getItem('techvie_token') || '';
        if (token) {
          setCheckingPurchase(true);
          try {
            // Lấy profile user để hiển thị nút xóa đánh giá của chính mình
            const userRes = await getCurrentUser(token);
            if (userRes.success && userRes.user) {
              setCurrentUser(userRes.user);
            }

            // Gọi endpoint can-review để kiểm tra server-side (chính xác nhất)
            const canReviewRes = await checkCanReview(product.id);
            setHasPurchased(canReviewRes.canReview === true);
            setCanReviewReason(canReviewRes.reason || '');
          } catch (err) {
            console.error("Lỗi khi tải thông tin tài khoản:", err);
          } finally {
            setCheckingPurchase(false);
          }
        }
      } else {
        setCurrentUser(null);
        setHasPurchased(false);
        setCanReviewReason('');
      }
      setIsLoading(false);
    };

    loadReviewsAndUser();
  }, [product, isLoggedIn]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;
    
    const res = await deleteReview(reviewId);
    if (res.success) {
      const reviewRes = await getReviewsByProduct(product!.id);
      if (reviewRes.success) {
        setReviews(reviewRes.reviews);
        setSummary(reviewRes.summary);
      }
      // Re-check can review after deletion
      const canReviewRes = await checkCanReview(product!.id);
      setHasPurchased(canReviewRes.canReview === true);
      setCanReviewReason(canReviewRes.reason || '');
    } else {
      alert(res.message || "Xóa đánh giá thất bại.");
    }
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    setErrorMessage('');
    
    const res = await createReview(product!.id, {
      rating: newRating,
      title: newTitle.trim() || undefined,
      comment: newComment.trim()
    });

    if (res.success) {
      setNewComment('');
      setNewTitle('');
      setNewRating(5);
      setHasPurchased(false);
      setCanReviewReason('already_reviewed');
      
      const reviewRes = await getReviewsByProduct(product!.id);
      if (reviewRes.success) {
        setReviews(reviewRes.reviews);
        setSummary(reviewRes.summary);
      }
    } else {
      setErrorMessage(res.message || 'Đăng đánh giá thất bại. Vui lòng thử lại.');
    }
    setIsSubmitting(false);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4 cursor-pointer animate-fade-in"
      >
        {/* Floating Close Button outside the scrollable modal card */}
        <button 
          onClick={onClose}
          className="fixed top-6 right-6 md:top-8 md:right-8 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/20 text-white hover:text-black flex items-center justify-center text-lg transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 z-[101]"
          title="Đóng (Esc / Click ngoài)"
        >
          ✕
        </button>

        <motion.div 
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white rounded-[2.5rem] border border-gray-200 p-8 md:p-12 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl cursor-default"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Image side */}
            <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center aspect-square">
              <img 
                src={product.image} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-60 object-contain mix-blend-multiply"
              />
            </div>

            {/* Info side */}
            <div className="text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold block mb-1">
                {product.category} • TECHVIE REFINERY
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950 mb-3">
                {product.name}
              </h2>
              <p className="text-sm font-black text-indigo-600 mb-6">
                {product.price.toLocaleString('vi-VN')}₫
              </p>

              <p className="text-sm text-gray-600 leading-relaxed font-sans mb-6">
                {product.description}
              </p>
              {/* Select color option */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2.5">
                    Màu sắc có sẵn:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white shadow-xs"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete detailed tech specs table */}
              <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 text-xs">
                <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1.5 border-b border-gray-200 pb-2 mb-2">
                  <Cpu size={12} />
                  Bảng thông số kỹ thuật (Tech Sheet)
                </h4>
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between py-1">
                    <span className="text-gray-500 font-sans">{spec.label}</span>
                    <span className="font-mono text-gray-950 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-grow bg-black text-white hover:bg-gray-800 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-black transition-colors cursor-pointer text-center"
                >
                  Thành lập liên kết & Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>

          {/* Product Reviews & Comments Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-left">
            <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-3 block">
              COMMENT & REVIEW PRODUCT
            </span>
            <h3 className="text-2xl font-sans tracking-tighter text-gray-950 font-extrabold mb-8 flex items-center gap-3">
              Đánh giá & Bình luận
            </h3>

            {/* Breakdown stats */}
            {summary && summary.reviewCount > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-8">
                <div className="text-center md:border-r border-gray-200 py-2">
                  <div className="text-4xl font-extrabold text-gray-900">{summary.averageRating.toFixed(1)}</div>
                  <div className="flex justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} className={star <= Math.round(summary.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">{summary.reviewCount} đánh giá từ khách hàng</div>
                </div>
                
                <div className="col-span-2 space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => {
                    const count = summary.breakdown[stars] || 0;
                    const pct = summary.reviewCount > 0 ? (count / summary.reviewCount) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="w-8 flex items-center gap-0.5 font-bold">{stars} <Star size={10} className="text-yellow-400 fill-yellow-400" /></span>
                        <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right font-mono text-gray-400">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* List of reviews for this product */}
            <div className="space-y-4 mb-8">
              {isLoading ? (
                <div className="text-center py-6 text-sm text-gray-500">Đang tải đánh giá...</div>
              ) : reviews.length > 0 ? (
                reviews.map(review => {
                  const userObj = typeof review.user_id === 'object' ? review.user_id : null;
                  const isOwner = currentUser && (currentUser.id === (userObj?._id || review.user_id));
                  const isAdmin = currentUser && currentUser.role === 'admin';
                  const avatarUrl = userObj?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${review.username}`;
                  const formattedDate = new Date(review.created_at).toLocaleDateString('vi-VN');

                  return (
                    <div key={review.id || review._id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:-translate-y-1 transition-all duration-300 ease-in-out relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={avatarUrl} 
                            alt={review.username} 
                            className="w-10 h-10 rounded-full border border-gray-200 object-cover bg-white"
                          />
                          <div>
                            <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5 flex-wrap">
                              {review.username}
                              {review.verified_purchase && (
                                <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-emerald-200">
                                  <ShieldCheck size={10} /> ĐÃ MUA
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono block">{formattedDate}</span>
                          </div>
                        </div>

                        {/* Delete button */}
                        {(isOwner || isAdmin) && (
                          <button
                            onClick={() => handleDeleteReview(review.id || review._id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                            title="Xóa đánh giá này"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="flex gap-1 mb-2.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={11} className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>

                      {review.title && (
                        <h4 className="text-xs font-black text-gray-900 mb-1">{review.title}</h4>
                      )}
                      <p className="text-sm text-gray-700 font-sans leading-relaxed">{review.comment}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 italic">Chưa có đánh giá nào cho sản phẩm này.</p>
              )}
            </div>

            {/* Add new review form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Viết đánh giá của bạn</h4>
              {!isLoggedIn ? (
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100 flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-4">Vui lòng đăng nhập để có thể đánh giá và bình luận sản phẩm.</p>
                  <button 
                    onClick={() => {
                      onClose();
                      onNavigate("login");
                    }}
                    className="px-6 py-2.5 bg-black text-white text-[11px] uppercase tracking-widest font-bold rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              ) : checkingPurchase ? (
                <div className="text-center py-4 text-sm text-gray-500">Đang xác minh lịch sử mua hàng...</div>
              ) : canReviewReason === 'already_reviewed' ? (
                <div className="bg-indigo-50 rounded-xl p-5 text-center border border-indigo-150 flex flex-col items-center">
                  <p className="text-sm font-sans font-bold text-indigo-900 mb-1">Cảm ơn bạn đã gửi đánh giá!</p>
                  <p className="text-xs text-indigo-700">Mỗi sản phẩm chỉ được đánh giá một lần duy nhất.</p>
                </div>
              ) : !hasPurchased ? (
                <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200 flex flex-col items-center">
                  <p className="text-sm text-amber-800">
                    Bạn chưa thể đánh giá sản phẩm này. Chỉ những khách hàng đã mua và nhận hàng thành công mới có quyền đánh giá sản phẩm.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {errorMessage && (
                    <div className="text-xs text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-150">
                      {errorMessage}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Đánh giá:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={18} 
                          onClick={() => setNewRating(star)}
                          className={`cursor-pointer transition-colors ${star <= newRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-200"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Tiêu đề đánh giá (ví dụ: Tuyệt vời, Rất đáng tiền...)"
                      className="w-full text-sm font-sans bg-gray-50 rounded-xl px-4 py-2.5 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black placeholder-gray-400 transition-all text-gray-800 border border-gray-200"
                    />
                  </div>
                  <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      className="w-full text-sm font-sans bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black placeholder-gray-400 transition-all text-gray-800 border border-gray-200 min-h-[100px] resize-y"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSubmitReview}
                      disabled={!newComment.trim() || isSubmitting}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full font-sans text-xs uppercase tracking-widest font-black transition-colors cursor-pointer"
                    >
                      <Send size={14} />
                      {isSubmitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
