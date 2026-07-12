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
import slide1 from "../assets/slideshow/slide1.png";
import slide2 from "../assets/slideshow/slide2.png";
import slide3 from "../assets/slideshow/slide3.png";
import slide4 from "../assets/slideshow/slide4.png";
import slide5 from "../assets/slideshow/slide5.png";
import img_card from "../assets/images/home_page_card.png";

interface HomePageProps {
  products?: Product[];
  onNavigate: (tab: TabType) => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
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
    colors: Array.isArray(p.colors)
      ? p.colors
      : typeof p.colors === "string"
        ? p.colors.split(",").map((c: string) => c.trim())
        : [],
    averageRating: typeof p.averageRating === "number" ? p.averageRating : 0,
    reviewCount: typeof p.reviewCount === "number" ? p.reviewCount : 0,
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
  const isPremium =
    isLoggedIn &&
    (userProfile?.shieldStatus === "Đang Kích Hoạt (Premium)" ||
      userProfile?.shieldStatus === "Premium");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(
    !!localStorage.getItem("techvie_subscribed"),
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
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleAddToCartWithSuccess = (
    product: Product,
    selectedColor?: string,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (e && e.currentTarget) {
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

    onAddToCart(product, selectedColor);
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
    slide5,
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
      <section className="bg-gray-150 relative h-screen w-full overflow-hidden -mt-18">
        <div className="absolute inset-0 h-full w-full">
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
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          {/* Lớp phủ màu đen mờ giúp tăng độ tương phản cho slideshow */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Ambient Overlay & Radial highlight, matching Vietnamese TechVie presentation card */}
        <div className="md:px-margin-desktop absolute inset-0 z-10 flex items-center justify-start bg-gradient-to-r from-white/35 via-transparent to-black/10 px-6 backdrop-brightness-95">
          <div className="mx-auto flex w-full max-w-7xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative max-w-2xl rounded-2xl border border-white/60 bg-white/45 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.1)] backdrop-blur-[35px] sm:rounded-3xl sm:p-8 md:p-10 lg:p-14"
            >
              {/* <div className="absolute top-0 right-0 p-6 flex flex-col items-end opacity-35 text-[9px] font-mono tracking-widest text-gray-800">
                <span>MÃ LƯỚI: 48.85 / 2.35</span>
                <div className="w-12 h-px bg-gray-800 mt-1"></div>
              </div> */}

              <div className="via-secondary/40 absolute top-1/4 -left-px h-24 w-1 bg-gradient-to-b from-transparent to-transparent"></div>

              <span className="text-secondary mb-4 block text-xs font-bold tracking-[0.25em] uppercase sm:text-sm lg:mb-6">
                <span className="bg-secondary h-2.5 w-2.5 animate-pulse rounded-full"></span>
                PHỤ KIỆN & ĐỒ SETUP AESTHETIC
              </span>

              <h1 className="mb-4 font-sans text-3xl leading-[1.05] font-black tracking-tighter text-gray-900 sm:text-4xl md:text-5xl lg:mb-6 lg:text-6xl">
                Góc Làm Việc <br />
                Đậm Chất Riêng
              </h1>

              <p className="text-gray-650 sm:text-md mb-4 max-w-md text-justify font-sans text-sm leading-relaxed lg:mb-8">
                Khơi nguồn cảm hứng với các combo phụ kiện tiện ích và ốp lưng
                custom độc quyền. TechVie đồng hành cùng bạn kiến tạo góc làm
                việc tối giản, bảo vệ sức khỏe và thể hiện cá tính.
              </p>

              {/* Specification stats box in vietnamese template */}
              <div className="mb-4 grid grid-cols-2 gap-4 py-1 sm:gap-8 lg:mb-8 lg:py-2">
                <div>
                  <div className="mb-1 text-[12px] font-extrabold tracking-widest text-gray-900 uppercase sm:text-[15px]">
                    BẢO HÀNH 1-ĐỔI-1
                  </div>
                  <div className="flex items-baseline gap-1 text-[11px] text-gray-500 sm:text-[13px]">
                    Lỗi từ nhà sản xuất
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[12px] font-extrabold tracking-widest text-gray-900 uppercase sm:text-[15px]">
                    ĐÓNG GÓI GIFT BOX
                  </div>
                  <div className="flex items-baseline gap-1 text-[11px] text-gray-500 sm:text-[13px]">
                    Trải nghiệm unbox khác biệt
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => onNavigate("brand")}
                  className="group relative flex h-16 w-full origin-left cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-neutral-800 p-8 text-right text-base font-bold text-gray-50 shadow-2xl shadow-amber-100 duration-500 before:absolute before:top-1 before:right-1 before:z-10 before:h-12 before:w-12 before:rounded-full before:bg-white/40 before:blur-lg before:duration-500 before:content-[''] group-hover:before:duration-500 after:absolute after:top-3 after:right-8 after:z-10 after:h-20 after:w-20 after:rounded-full after:bg-amber-100 after:blur-lg after:duration-500 after:content-[''] group-hover:after:duration-500 hover:text-white hover:decoration-2 hover:duration-500 hover:before:right-8 hover:before:-bottom-8 hover:before:blur hover:after:-right-6"
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
        <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 space-x-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full border border-black/10 shadow-md transition-all duration-300 ${
                currentSlide === idx
                  ? "w-8 scale-110 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Electronics Collection */}
      <section
        ref={(el) => {
          revealRefs.current[0] = el;
        }}
        className="reveal mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mb-10 flex flex-col items-start justify-between sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <span className="text-secondary mb-3 block text-xs font-bold tracking-[0.3em] uppercase">
              SẢN PHẨM NỔI BẬT
            </span>
            <h2 className="font-sans text-2xl font-extrabold tracking-tighter text-gray-950 sm:text-3xl md:text-5xl">
              Góc Setup Trendy & Tiện Ích
            </h2>
          </div>
          <button
            onClick={() => onNavigate("products")}
            className="border-primary mt-4 cursor-pointer border-b-2 pb-1.5 text-[13px] font-black tracking-[0.3em] uppercase transition-opacity hover:opacity-75 sm:mt-0"
          >
            Gian Trưng Bày
          </button>
        </div>

        {/* Products grid — 1 col xs, 2 col sm, 3 col md+ */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
          {allProducts.slice(0, 3).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.45,
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
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
        ref={(el) => {
          revealRefs.current[1] = el;
        }}
        className="reveal reveal-delay-1 mx-auto mt-24 mb-16 max-w-7xl px-4 sm:mt-40 sm:mb-20 sm:px-6"
      >
        <div className="grid grid-cols-1 items-center gap-12 rounded-[3rem] bg-linear-to-l from-black/5 to-white/90 p-8 md:p-16 lg:grid-cols-2">
          <div>
            <span className="text-secondary mb-3 block text-xs font-bold tracking-[0.3em] uppercase">
              TRẢI NGHIỆM MUA SẮM KHÁC BIỆT
            </span>
            <h2 className="font-sans text-3xl leading-tight font-black tracking-tighter text-gray-950 md:text-5xl">
              Nâng Tầm Cảm Xúc Khi Mở Hộp
            </h2>
            <p className="text-gray-650 text-md mt-6 mb-8 text-justify font-sans leading-relaxed">
              Không chỉ cung cấp phụ kiện, TechVie chú trọng vào trải nghiệm của
              bạn. Mọi sản phẩm đều được kiểm tra kỹ lưỡng (QC 100%) và đóng gói
              dưới dạng hộp quà tặng (Gift box) chỉn chu kèm thiệp viết tay.
            </p>
            <div className="mb-8 flex flex-wrap gap-8 border-t border-gray-200 pt-8">
              <div className="flex items-center gap-3">
                <div className="text-secondary flex h-10 w-15 items-center justify-center rounded-xl">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Đóng Gói Aesthetic
                  </h4>
                  <p className="max-w-xs text-sm text-gray-500">
                    Bao bì chống sốc an toàn, thiết kế tối giản, mang lại sự
                    tinh tế ngay từ cái nhìn đầu tiên
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-secondary flex h-10 w-15 items-center justify-center rounded-xl">
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Dịch Vụ Custom
                  </h4>
                  <p className="max-w-xs text-sm text-gray-500">
                    Hỗ trợ in ấn tên, hình vẽ lên ốp lưng theo yêu cầu để bạn tự
                    do sáng tạo cái tôi độc bản
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => onNavigate("brand")}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-black px-8 py-3.5 font-sans text-xs font-black tracking-widest text-white uppercase hover:bg-gray-800"
              >
                TÌM HIỂU THÊM
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-[2rem] shadow shadow-2xl transition-all duration-300 hover:-translate-y-2 lg:aspect-square">
            <img
              src={img_card}
              alt="TechVie Laboratory equipment"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-all"
            />
          </div>
        </div>
      </section>

      {/* Luxurious Newsletter subscription matching modern grid template details */}
      {!isPremium && !showSubscriptionSuccess && (
        <section
          ref={(el) => {
            revealRefs.current[2] = el;
          }}
          className="reveal reveal-delay-2 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-sans text-4xl leading-none font-black tracking-tighter text-gray-950 md:text-5xl">
                Nhận Ưu Đãi <br />
                Độc Quyền
              </h2>
              <p className="text-gray-655 text-md max-w-md text-justify font-sans leading-relaxed">
                Đăng ký email để không bỏ lỡ các mã Freeship, voucher giảm giá
                và thông tin mới nhất về các bộ sưu tập đồ setup từ TechVie.
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
                  className="flex w-full max-w-md flex-col gap-4"
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
                        className="rounded-2xl border border-gray-300 bg-white/50 px-6 py-4 font-sans text-base backdrop-blur-md transition-colors outline-none placeholder:text-gray-400 focus:border-black disabled:opacity-60"
                      />
                    </>
                  ) : (
                    <div className="rounded-2xl border border-gray-200/50 bg-white/40 px-6 py-4 font-sans text-sm text-gray-800 backdrop-blur-md">
                      Đăng ký bằng tài khoản:{" "}
                      <strong className="font-extrabold text-black">
                        {userEmail}
                      </strong>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmittingSubscription}
                    className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-8 py-4 font-sans text-xs font-black tracking-[0.3em] text-white uppercase transition-transform hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-700"
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
      <div className="pointer-events-none fixed inset-0 z-[101]">
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
            className="border-gray-250 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border bg-white p-1 shadow-2xl"
          >
            <img
              src={particle.image}
              alt="glowing-hardware"
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
