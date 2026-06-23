import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { newsArticles } from '../data_mockdata';
import { NewsArticle } from '../types';
import { Calendar, ChevronRight, X, Heart } from 'lucide-react';

export default function NewsPage() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked[id]) {
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
      setHasLiked(prev => ({ ...prev, [id]: false }));
    } else {
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setHasLiked(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 max-w-7xl mx-auto px-6"
    >
      {/* Header */}
      <div className="mb-14 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
          TECHVIE NEWS & JOURNAL
        </span>
        <h1 className="text-4xl md:text-5xl font-sans tracking-tighter text-gray-950 font-extrabold">
          Nhật Ký Đổi Mới
        </h1>
        <p className="text-sm text-gray-500 font-sans mt-3 max-w-lg mx-auto leading-relaxed">
          Nơi cập nhật những công nghệ đột phá mới nhất, thông tin khai trương các showroom trải nghiệm và các chương trình ưu đãi độc quyền từ TechVie.
        </p>
      </div>

      {/* Articles Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {newsArticles.map((article) => (
          <article 
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group cursor-pointer bg-white border border-gray-150 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-black/20 flex flex-col justify-between"
          >
            <div>
              {/* Grayscale hover to colors image strip */}
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-103"
                />

                <span className="absolute top-4 left-4 bg-black text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>

              {/* Title & info summary */}
              <div className="p-8">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mb-3">
                  <Calendar size={12} />
                  {article.date}
                </div>

                <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-snug group-hover:text-secondary group-hover:underline underline-offset-4 transition-all">
                  {article.title}
                </h3>

                <p className="text-gray-500 font-sans text-xs mt-3 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>
            </div>

            {/* Read more button strip */}
            <div className="p-8 pt-0 flex justify-between items-center border-t border-gray-50 mt-4">
              <span className="text-[11px] uppercase tracking-widest font-black text-gray-900 flex items-center gap-1 group-hover:text-secondary group-hover:translate-x-1 transition-all">
                Đọc bài viết
                <ChevronRight size={14} />
              </span>

              {/* Minimal like mechanism */}
              <button 
                onClick={(e) => handleLike(article.id, e)}
                className={`flex items-center gap-1.5 text-xs font-mono transition-colors py-1.5 px-3 rounded-full ${
                  hasLiked[article.id]
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                }`}
              >
                <Heart size={14} fill={hasLiked[article.id] ? 'currentColor' : 'none'} />
                {likes[article.id] || 0}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Expanded Article Dialog Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[2.5rem] border border-gray-200 p-8 md:p-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-gray-500 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-gray-100 text-gray-500 px-3 py-1 rounded-full inline-block mb-3">
                  {selectedArticle.category}
                </span>

                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-950 leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mt-3">
                  <Calendar size={12} />
                  Đăng ngày {selectedArticle.date} • Tác giả TechVie Press Room
                </div>
              </div>

              {/* Featured banner image */}
              <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-gray-100">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content body */}
              <div className="prose prose-gray max-w-none text-sm leading-relaxed text-gray-700 font-sans space-y-4">
                <p className="font-semibold text-gray-900 text-base">{selectedArticle.summary}</p>
                <p>{selectedArticle.content}</p>
                <p>Chúng tôi luôn nỗ lực tuyệt đối để nâng cao tiêu chuẩn phục vụ và duy trì chuỗi nghiên cứu chân thực, đưa các thiết bị quang học Thủy Tinh Lỏng hội nhập vào đời sống kết nối bền bỉ nhất.</p>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-black transition-colors"
                >
                  Xác nhận lưu hành
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
