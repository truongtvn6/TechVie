import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, TabType } from "../types";
import {
  ArrowLeftRight,
  Activity,
  Cpu,
  Compass,
  ArrowRight,
  Check,
  Send,
  Plus,
} from "lucide-react";
import { subscribeNewsletter, API_BASE_URL } from "../services/api";
import ProductCard from "./ProductPage/ProductCard";
import ProductDetail from "./ProductPage/ProductDetail";
import SloganQuote from "./SloganQuote";
import slide1 from '../assets/slideshow/slide1.png';
import slide2 from '../assets/slideshow/slide2.png';
import slide3 from '../assets/slideshow/slide3.png';
import slide4 from '../assets/slideshow/slide4.png';
import slide5 from '../assets/slideshow/slide5.png';
import img_card from '../assets/images/home_page_card.png';


interface HomePageProps {
  products?: Product[];
  onNavigate: (tab: TabType) => void;
  onAddToCart: (product: Product) => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  userProfile?: any;
}

const normalizeProduct = (p: any): Product => {
  let safeSpecs: { label: string; value: string }[] = [];
  if (Array.isArray(p.specs)) {
    safeSpecs = p.specs.map((s: any) => ({
      label: s && typeof s.label === "string" ? s.label : "Thông số",
      value:
        s && typeof s.value === "string"
          ? s.value
          : typeof s === "string"
            ? s
            : "Đang cập nhật",
    }));
  } else if (p.specs && typeof p.specs === "object") {
    safeSpecs = Object.entries(p.specs).map(([key, val]) => ({
      label: key,
      value: String(val),
    }));
  }

  while (safeSpecs.length < 2) {
    safeSpecs.push({ label: "Thông số", value: "Đang cập nhật" });
  }

  return {
    id: p.id || p._id || String(Math.random()),
    name: p.name || "Sản phẩm TechVie",
    price: typeof p.price === "number" ? p.price : Number(p.price) || 0,
    image:
      p.image ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: p.category || "Thiết bị",
    description: p.description || "Mô tả đang được cập nhật.",
    specs: safeSpecs,
    colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? p.colors.split(',').map((c: string) => c.trim()) : []),
    averageRating: typeof p.averageRating === 'number' ? p.averageRating : 0,
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : 0,
  };
};

export default function HomePage({
  products,
  onNavigate,
  onAddToCart,
  isLoggedIn = false,
  userEmail = "",
  userProfile,
}: HomePageProps) {
  const allProducts = (products || []).map(normalizeProduct);
  const isPremium = isLoggedIn && (userProfile?.shieldStatus === "Đang Kích Hoạt (Premium)" || userProfile?.shieldStatus === "Premium");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(
    !!localStorage.getItem("techvie_subscribed")
  );
  const [isSubmittingSubscription, setIsSubmittingSubscription] =
    useState(false);
  const [isLoadedFromApi, setIsLoadedFromApi] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [magneticRefId, setMagneticRefId] = useState<string | null>(null);
  const [flyingParticles, setFlyingParticles] = useState<
    { id: number; startX: number; startY: number; image: string }[]
  >([]);

  // Scroll reveal — IntersectionObserver
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const handleAddToCartWithSuccess = (
    product: Product,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (e) {
      const buttonRect = e.currentTarget.getBoundingClientRect();
      startX = buttonRect.left + buttonRect.width / 2;
      startY = buttonRect.top + buttonRect.height / 2;
    }

    const particleId = Date.now() + Math.random();
    setFlyingParticles((prev) => [
      ...prev,
      {
        id: particleId,
        startX: startX,
        startY: startY,
        image: product.image,
      },
    ]);

    setTimeout(() => {
      setFlyingParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 950);

    setMagneticRefId(product.id);
    setTimeout(() => {
      setMagneticRefId(null);
    }, 600);

    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 2000);
  };

  const [images, setImages] = useState<string[]>([
    slide1,
    slide2,
    slide3,
    slide4,
    slide5
  ]);

  // Fetch slider images dynamically from backend express API (port 5000)
  /*
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchImages = () => {
      fetch(`${API_BASE_URL}/api/hero-images`)
        .then((res) => {
          if (!res.ok) throw new Error("API server unreachable");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setImages(data);
            setIsLoadedFromApi(true);
            // Đảm bảo chỉ số slide hiện tại không vượt quá mảng dữ liệu mới từ backend
            setCurrentSlide((prev) => (prev >= data.length ? 0 : prev));
          } else {
            throw new Error("Received empty image list");
          }
        })
        .catch((error) => {
          console.warn(
            "Fallback to local slide images used safely. Detail:",
            error.message || error,
          );
          setIsLoadedFromApi(false);
        });
    };

    // Chạy tải dữ liệu ngay lập tức
    fetchImages();

    // Nếu chưa tải được API, thử lại sau mỗi 5 giây. Nếu đã tải thành công, cập nhật định kỳ mỗi 30 giây.
    const intervalTime = isLoadedFromApi ? 30000 : 5000;
    intervalId = setInterval(fetchImages, intervalTime);

    return () => clearInterval(intervalId);
  }, [isLoadedFromApi]);
  */

  // Rotating slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToSubscribe =
      isLoggedIn && userEmail ? userEmail : newsletterEmail;
    if (emailToSubscribe.trim() === "" || isSubmittingSubscription) return;
    setIsSubmittingSubscription(true);
    try {
      const res = await subscribeNewsletter(emailToSubscribe);
      if (res.success) {
        localStorage.setItem("techvie_subscribed", "true");
        setShowSubscriptionSuccess(true);
        setNewsletterEmail("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingSubscription(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Slideshow Section */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-150 -mt-18">
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence>
            <motion.img
              key={images[currentSlide] || currentSlide}
              src={images[currentSlide]}
              alt={`TechVie Slideshow ${currentSlide + 1}`}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          {/* Lớp phủ màu đen mờ giúp tăng độ tương phản cho slideshow */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Ambient Overlay & Radial highlight, matching Vietnamese TechVie presentation card */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-black/10 backdrop-brightness-95 flex items-center justify-start px-6 md:px-margin-desktop z-10 pt-18">
          <div className="max-w-7xl mx-auto w-full flex">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl bg-white/45 backdrop-blur-[35px] p-6 sm:p-8 md:p-10 lg:p-14 rounded-2xl sm:rounded-3xl border border-white/60 shadow-[0_30px_70px_rgba(0,0,0,0.1)] relative"
            >
              {/* <div className="absolute top-0 right-0 p-6 flex flex-col items-end opacity-35 text-[9px] font-mono tracking-widest text-gray-800">
                <span>MÃ LƯỚI: 48.85 / 2.35</span>
                <div className="w-12 h-px bg-gray-800 mt-1"></div>
              </div> */}

              <div className="absolute -left-px top-1/4 h-24 w-1 bg-gradient-to-b from-transparent via-secondary/40 to-transparent"></div>

              <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-secondary font-bold mb-4 lg:mb-6 block">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                PHỤ KIỆN & ĐỒ SETUP AESTHETIC
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tighter text-gray-900 mb-4 lg:mb-6 leading-[1.05]">
                Góc Làm Việc <br />
                Đậm Chất Riêng
              </h1>

              <p className="font-sans text-gray-650 text-sm sm:text-md leading-relaxed mb-4 lg:mb-8 max-w-md text-justify">
                Khơi nguồn cảm hứng với các combo phụ kiện tiện ích và ốp lưng
                custom độc quyền. TechVie đồng hành cùng bạn kiến tạo góc làm
                việc tối giản, bảo vệ sức khỏe và thể hiện cá tính.
              </p>

              {/* Specification stats box in vietnamese template */}
              <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-4 lg:mb-8 py-1 lg:py-2">
                <div>
                  <div className="text-[12px] sm:text-[15px] font-extrabold uppercase tracking-widest text-gray-900 mb-1">
                    BẢO HÀNH 1-ĐỔI-1
                  </div>
                  <div className="text-[11px] sm:text-[13px] text-gray-500 flex items-baseline gap-1">
                    Lỗi từ nhà sản xuất
                  </div>
                </div>
                <div>
                  <div className="text-[12px] sm:text-[15px] font-extrabold uppercase tracking-widest text-gray-900 mb-1">
                    ĐÓNG GÓI GIFT BOX
                  </div>
                  <div className="text-[11px] sm:text-[13px] text-gray-500 flex items-baseline gap-1">
                    Trải nghiệm unbox khác biệt
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate("brand")}
                  className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500  duration-500 before:duration-500 hover:duration-500  hover:after:-right-6 hover:before:right-8 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-white relative bg-neutral-800 h-16 text-right p-8 text-gray-50 text-base font-bold rounded-2xl overflow-hidden before:absolute before:w-12 before:h-12 before:content-[''] before:right-1 before:top-1 before:z-10 before:bg-white/40 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content-[''] after:bg-amber-100 after:right-8 after:top-3 after:rounded-full after:blur-lg cursor-pointer flex items-center justify-between w-full shadow-amber-100 shadow-2xl"
                >
                  <span className="relative z-[2] flex items-center gap-2 uppercase transition-all duration-300 group-hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)]">
                    Khám phá thương hiệu
                    <ArrowRight
                      size={24}
                      className="transition-all duration-300 group-hover:translate-x-1.5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    />
                  </span>
                </button>
                {/* <button
                  onClick={() => onNavigate("products")}
                  className="bg-white/80 hover:bg-white text-gray-900 border border-gray-300 px-8 py-4 rounded-full font-sans font-extrabold uppercase tracking-wider text-[13px] transition-all flex items-center justify-center cursor-pointer"
                >
                  Bộ Sưu Tập
                </button> */}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Circular progress indicators underneath matching vietnamese design dot indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 shadow-md border border-black/10 ${
                currentSlide === idx
                  ? "bg-white w-8 scale-110"
                  : "bg-white/50 hover:bg-white/80 w-2.5"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Electronics Collection */}
      <section
        ref={(el) => { revealRefs.current[0] = el; }}
        className="reveal py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
              SẢN PHẨM NỔI BẬT
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-sans tracking-tighter text-gray-950 font-extrabold">
              Góc Setup Trendy & Tiện Ích
            </h2>
          </div>
          <button
            onClick={() => onNavigate("products")}
            className="mt-4 sm:mt-0 text-[13px] uppercase tracking-[0.3em] font-black border-b-2 border-primary pb-1.5 hover:opacity-75 transition-opacity cursor-pointer"
          >
            Gian Trưng Bày
          </button>
        </div>

        {/* Products grid — 1 col xs, 2 col sm, 3 col md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
          {allProducts.slice(0, 3).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard
                product={product}
                onSelect={setSelectedProduct}
                onAddToCart={handleAddToCartWithSuccess}
                isJustAdded={justAddedId === product.id}
                isMagnetized={magneticRefId === product.id}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <SloganQuote />

      {/* Exquisite Brand Promo Card Banner */}
      <section
        ref={(el) => { revealRefs.current[1] = el; }}
        className="reveal reveal-delay-1 px-4 sm:px-6 max-w-7xl mx-auto mb-16 sm:mb-20 mt-24 sm:mt-40"
      >
        <div className="bg-linear-to-l from-black/5 to-white/90 rounded-[3rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">
              TRẢI NGHIỆM MUA SẮM KHÁC BIỆT
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tighter text-gray-950 font-black leading-tight">
              Nâng Tầm Cảm Xúc Khi Mở Hộp
            </h2>
            <p className="text-gray-650 font-sans text-md leading-relaxed mt-6 mb-8 text-justify">
              Không chỉ cung cấp phụ kiện, TechVie chú trọng vào trải nghiệm của
              bạn. Mọi sản phẩm đều được kiểm tra kỹ lưỡng (QC 100%) và đóng gói
              dưới dạng hộp quà tặng (Gift box) chỉn chu kèm thiệp viết tay.
            </p>
            <div className="flex flex-wrap gap-8 mb-8 border-t border-gray-200 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-15 h-10 rounded-xl flex items-center justify-center text-secondary">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">
                    Đóng Gói Aesthetic
                  </h4>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Bao bì chống sốc an toàn, thiết kế tối giản, mang lại sự
                    tinh tế ngay từ cái nhìn đầu tiên
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-15 h-10 rounded-xl flex items-center justify-center text-secondary">
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">
                    Dịch Vụ Custom
                  </h4>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Hỗ trợ in ấn tên, hình vẽ lên ốp lưng theo yêu cầu để bạn tự
                    do sáng tạo cái tôi độc bản
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => onNavigate("brand")}
                className="bg-black text-white hover:bg-gray-800 font-sans text-xs uppercase tracking-widest font-black px-8 py-3.5 rounded-full flex items-center gap-2 cursor-pointer"
              >
                TÌM HIỂU THÊM
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="aspect-video lg:aspect-square overflow-hidden rounded-[2rem] shadow relative hover:-translate-y-2 transition-all duration-300 shadow-2xl">
            <img
              src={img_card}
              alt="TechVie Laboratory equipment"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all"
            />
          </div>
        </div>
      </section>

      {/* Luxurious Newsletter subscription matching modern grid template details */}
      {!isPremium && !showSubscriptionSuccess && (
        <section
          ref={(el) => { revealRefs.current[2] = el; }}
          className="reveal reveal-delay-2 py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-sans tracking-tighter text-gray-950 font-black leading-none mb-6">
                Nhận Ưu Đãi <br />
                Độc Quyền
              </h2>
              <p className="text-gray-655 font-sans text-md leading-relaxed max-w-md text-justify">
                Đăng ký email để không bỏ lỡ các mã Freeship, voucher giảm giá và
                thông tin mới nhất về các bộ sưu tập đồ setup từ TechVie.
              </p>
            </div>

            <div>
              <AnimatePresence mode="wait">
                <motion.form
                  key="subscribe-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-4 max-w-md w-full"
                >
                  {!isLoggedIn ? (
                    <>
                      <label htmlFor="newsletter-email" className="sr-only">
                        Địa chỉ Email
                      </label>
                      <input
                        id="newsletter-email"
                        type="email"
                        placeholder="email@techvie.com"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                        disabled={isSubmittingSubscription}
                        className="bg-white/50 backdrop-blur-md border border-gray-300 focus:border-black rounded-2xl px-6 py-4 outline-none font-sans text-base placeholder:text-gray-400 transition-colors disabled:opacity-60"
                      />
                    </>
                  ) : (
                    <div className="bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl px-6 py-4 font-sans text-sm text-gray-800">
                      Đăng ký bằng tài khoản:{" "}
                      <strong className="text-black font-extrabold">
                        {userEmail}
                      </strong>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmittingSubscription}
                    className="bg-black text-white hover:bg-gray-900 disabled:bg-gray-700 disabled:cursor-not-allowed px-8 py-4 rounded-2xl font-sans text-xs uppercase tracking-[0.3em] font-black w-full flex items-center justify-center gap-2 transition-transform h-14 cursor-pointer"
                  >
                    {isSubmittingSubscription
                      ? "ĐANG GỬI ĐĂNG KÝ..."
                      : "THAM GIA ĐẶC QUYỀN"}
                    {!isSubmittingSubscription && <Send size={14} />}
                  </button>
                </motion.form>
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Product Detail Specs Modal */}
      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCartWithSuccess}
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      {/* Flying Particles for Cart Magnet */}
      <div className="fixed inset-0 pointer-events-none z-[101]">
        {flyingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              left: particle.startX - 24,
              top: particle.startY - 24,
              scale: 0.8,
              opacity: 1,
              rotate: 0,
              position: "fixed",
            }}
            animate={{
              left: [
                particle.startX - 24,
                particle.startX - 80,
                window.innerWidth - 80,
              ],
              top: [particle.startY - 24, particle.startY - 180, 24],
              scale: [0.8, 1.2, 0.12],
              opacity: [1, 1, 0],
              rotate: [0, -30, 360],
            }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-2xl border border-gray-250 flex items-center justify-center p-1"
          >
            <img
              src={particle.image}
              alt="glowing-hardware"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
