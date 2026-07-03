import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Star, Send } from 'lucide-react';
import { Product, TabType } from '../../types';

interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

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
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      productId: 'p1',
      user: 'Hoàng Anh',
      rating: 5,
      comment: 'Sản phẩm hoàn thiện siêu cao cấp, đúng chất lượng TechVie Lab. Rất đáng đồng tiền bát gạo.',
      date: '18-06-2026'
    },
    {
      id: 'r2',
      productId: 'p1',
      user: 'Minh Quân',
      rating: 4,
      comment: 'Giao hàng hỏa tốc siêu nhanh. Thiết kế nhôm nguyên khối cảm giác sờ lạnh tay cực thích.',
      date: '17-06-2026'
    }
  ]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');

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
            
            {/* List of reviews for this product */}
            <div className="space-y-4 mb-8">
              {reviews.filter(r => r.productId === product.id || r.productId === 'p1').map(review => (
                <div key={review.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:-translate-y-2 transition-all duration-300 ease-in-out">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-gray-900">{review.user}</span>
                    <span className="text-xs text-gray-400 font-mono">{review.date}</span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={12} className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 font-sans">{review.comment}</p>
                </div>
              ))}
              {reviews.filter(r => r.productId === product.id || r.productId === 'p1').length === 0 && (
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
              ) : (
                <div className="space-y-4">
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
                      onClick={() => {
                        if (!newComment.trim()) return;
                        const newReview: Review = {
                          id: Date.now().toString(),
                          productId: product.id,
                          user: 'Người dùng (Bạn)',
                          rating: newRating,
                          comment: newComment,
                          date: new Date().toLocaleDateString('vi-VN')
                        };
                        setReviews(prev => [newReview, ...prev]);
                        setNewComment('');
                        setNewRating(5);
                      }}
                      disabled={!newComment.trim()}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full font-sans text-xs uppercase tracking-widest font-black transition-colors cursor-pointer"
                    >
                      <Send size={14} />
                      Gửi Đánh Giá
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
