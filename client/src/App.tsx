import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";
import { TabType, CartItem, Product } from "./types";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getSystemUsers,
  adminCreateUser,
  toggleUserRole,
  toggleUserVip,
  toggleUserStatus,
  adminDeleteUser,
  restoreProduct,
  restoreUser,
  getCurrentUser,
} from "./services/api";
import HomePage from "./components/HomePage";
import BrandPage from "./components/BrandPage";
import ProductPage from "./components/ProductPage";
import NewsPage from "./components/NewsPage";
import ContactPage from "./components/ContactPage";
import CheckoutPage from "./components/CheckoutPage";
import AccountPage from "./components/AccountPage";
import AuthPage from "./components/AuthPage";
import AdminPage from "./components/AdminPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchSidePanel from "./components/SearchSidePanel";
import PolicyPage from "./components/PolicyPage";
import CartSidePanel from "./components/CartSidePanel";
import ResetPassword from "./components/AuthPage/ResetPassword";

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (window.location.pathname === "/reset-password" && params.get("token")) {
        return "reset-password";
      }
      const saved = localStorage.getItem("active_tab");
      return saved ? (saved as TabType) : "home";
    } catch {
      return "home";
    }
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [token, setToken] = useState<string>(
    localStorage.getItem("techvie_token") || "",
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("techvie_token"),
  );
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    memberSince: "",
    techvieId: "",
    shieldStatus: "Standard",
    role: "user",
  });

  useEffect(() => {
    if (token && isLoggedIn) {
      getCurrentUser(token).then((res) => {
        if (res.success && res.user) {
          setUserProfile({
            name: res.user.username || "",
            email: res.user.email || "",
            phone: res.user.phone || "",
            address: res.user.address || "",
            memberSince: new Date(res.user.created_at).toLocaleDateString("vi-VN") || "",
            techvieId: `TV-${(res.user._id || res.user.id || "").substring(0, 6).toUpperCase()}`,
            shieldStatus: res.user.vipStatus === "Premium" ? "Đang Kích Hoạt (Premium)" : (res.user.vipStatus || "Standard"),
            role: res.user.role || "user",
          });
        } else {
          // Token might be invalid
          handleSetIsLoggedIn(false);
        }
      });
    }
  }, [token, isLoggedIn]);

  useEffect(() => {
    getProducts().then((res) => {
      if (res.success) {
        setProducts(res.products);
      }
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn && userProfile.role === "admin" && token) {
      getSystemUsers(token).then((res) => {
        if (res.success && res.users) {
          const mapped = res.users.map((u: any) => ({
            id: u.id || u._id,
            name: u.username,
            email: u.email,
            phone: u.phone,
            role: u.role,
            vipStatus: u.vipStatus,
            status: u.status,
            joinedDate: new Date(u.created_at).toLocaleDateString("vi-VN"),
          }));
          setSystemUsers(mapped);
        }
      });
    } else {
      setSystemUsers([]);
    }
  }, [isLoggedIn, userProfile.role, token]);

  useEffect(() => {
    try {
      if (activeTab !== ("reset-password" as any)) {
        localStorage.setItem("active_tab", activeTab);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTab]);

  const handleSetIsLoggedIn = (val: boolean) => {
    setIsLoggedIn(val);
    if (!val) {
      setToken("");
      localStorage.removeItem("techvie_token");
      setUserProfile({
        name: "Nguyễn Minh Tiến",
        email: "mintzinfinity898@gmail.com",
        phone: "0912 345 678",
        address: "86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
        memberSince: "17-06-2026",
        techvieId: "TV-992-88X",
        shieldStatus: "Đang Kích Hoạt (Premium)",
        role: "user",
      });
    }
  };

  const handleAddProduct = async (newProduct: any, imageFile: File | null) => {
    try {
      console.log("=== BẮT ĐẦU THÊM SẢN PHẨM MỚI ===");
      console.log("Dữ liệu thô:", newProduct);
      if (imageFile) {
        console.log(
          "Tải kèm tệp ảnh:",
          imageFile.name,
          `(${imageFile.size} bytes)`,
        );
      }

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", String(newProduct.price));
      formData.append("category", newProduct.category);
      formData.append("description", newProduct.description || "");
      formData.append("specs", JSON.stringify(newProduct.specs || []));
      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      const res = await createProduct(formData, token);
      if (res.success && res.product) {
        const added = {
          id: res.product.id || (res.product as any)._id,
          name: res.product.name,
          price: res.product.price,
          category: res.product.category,
          image: res.product.image || newProduct.image,
          description: res.product.description,
          specs: res.product.specs || [],
        };
        console.log(
          "Thêm sản phẩm thành công vào state React! Sản phẩm:",
          added,
        );
        setProducts((prev) => [added, ...prev]);
        console.log("Đăng bán sản phẩm thành công!");
      } else {
        console.error(
          "Lỗi phản hồi từ backend khi thêm sản phẩm:",
          res.message,
        );
        console.error(`Lỗi khi thêm sản phẩm: ${res.message}`);
      }
    } catch (error: any) {
      console.error("Lỗi thêm sản phẩm:", error);
      console.error("Không thể thêm sản phẩm, vui lòng kiểm tra kết nối.");
    }
  };

  const handleEditProduct = async (
    editedProduct: any,
    imageFile: File | null,
  ) => {
    try {
      console.log(`=== BẮT ĐẦU CẬP NHẬT SẢN PHẨM #${editedProduct.id} ===`);
      console.log("Dữ liệu cập nhật mới:", editedProduct);
      if (imageFile) {
        console.log(
          "Tải kèm tệp ảnh mới:",
          imageFile.name,
          `(${imageFile.size} bytes)`,
        );
      }

      const formData = new FormData();
      formData.append("name", editedProduct.name);
      formData.append("price", String(editedProduct.price));
      formData.append("category", editedProduct.category);
      formData.append("description", editedProduct.description || "");
      formData.append("specs", JSON.stringify(editedProduct.specs || []));
      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else if (editedProduct.image) {
        formData.append("image", editedProduct.image);
      }

      const res = await updateProduct(editedProduct.id, formData, token);
      if (res.success && res.product) {
        const updated = {
          id: res.product.id || (res.product as any)._id,
          name: res.product.name,
          price: res.product.price,
          category: res.product.category,
          image: res.product.image || editedProduct.image,
          description: res.product.description,
          specs: res.product.specs || [],
        };
        console.log(
          "Cập nhật sản phẩm thành công trong state React! Sản phẩm:",
          updated,
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
        console.log("Cập nhật sản phẩm thành công!");
      } else {
        console.error("Lỗi phản hồi từ backend khi sửa sản phẩm:", res.message);
        console.error(`Lỗi khi cập nhật sản phẩm: ${res.message}`);
      }
    } catch (error: any) {
      console.error("Lỗi sửa sản phẩm:", error);
      console.error("Không thể cập nhật sản phẩm, vui lòng kiểm tra kết nối.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      console.log(`=== BẮT ĐẦU XÓA SẢN PHẨM #${productId} ===`);
      const res = await deleteProduct(productId, token);
      if (res.success) {
        console.log(`Xóa sản phẩm #${productId} thành công khỏi state React.`);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        console.log("Xóa sản phẩm thành công!");
      } else {
        console.error("Lỗi phản hồi từ backend khi xóa sản phẩm:", res.message);
        console.error(`Lỗi khi xóa sản phẩm: ${res.message}`);
      }
    } catch (error: any) {
      console.error("Lỗi xóa sản phẩm:", error);
      console.error("Không thể xóa sản phẩm, vui lòng kiểm tra kết nối.");
    }
  };

  const handleRestoreProduct = async (productId: string) => {
    try {
      const res = await restoreProduct(productId, token);
      if (res.success) {
        // Refresh products to get the restored product with its details
        getProducts().then((data) => {
          if (data.success) setProducts(data.products);
        });
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (error: any) {
      return { success: false, message: "Lỗi kết nối khi khôi phục sản phẩm." };
    }
  };

  // User Management Admin Handlers
  const handleAddUser = async (newUser: any) => {
    try {
      const payload = {
        username: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        vipStatus: newUser.vipStatus,
      };
      const res = await adminCreateUser(payload, token);
      if (res.success && res.user) {
        const mappedUser = {
          id: res.user.id || res.user._id,
          name: res.user.username,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
          vipStatus: res.user.vipStatus,
          status: res.user.status,
          joinedDate: new Date(res.user.created_at).toLocaleDateString("vi-VN"),
        };
        setSystemUsers((prev) => [mappedUser, ...prev]);
        return { success: true, message: res.message, user: mappedUser };
      }
      return { success: false, message: res.message || "Lỗi từ máy chủ." };
    } catch (error: any) {
      console.error("Lỗi thêm thành viên:", error);
      return { success: false, message: "Lỗi kết nối khi thêm thành viên." };
    }
  };

  const handleToggleUserRole = async (id: string) => {
    try {
      const res = await toggleUserRole(id, token);
      if (res.success && res.user) {
        const mappedUser = {
          id: res.user.id || res.user._id,
          name: res.user.username,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
          vipStatus: res.user.vipStatus,
          status: res.user.status,
          joinedDate: new Date(res.user.created_at).toLocaleDateString("vi-VN"),
        };
        setSystemUsers((prev) =>
          prev.map((u) => (u.id === id ? mappedUser : u)),
        );
        return { success: true, message: res.message, user: mappedUser };
      }
      return { success: false, message: res.message || "Lỗi kết nối." };
    } catch (error: any) {
      console.error("Lỗi đổi quyền thành viên:", error);
      return { success: false, message: "Lỗi kết nối mạng." };
    }
  };

  const handleToggleUserVip = async (id: string) => {
    try {
      const res = await toggleUserVip(id, token);
      if (res.success && res.user) {
        const mappedUser = {
          id: res.user.id || res.user._id,
          name: res.user.username,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
          vipStatus: res.user.vipStatus,
          status: res.user.status,
          joinedDate: new Date(res.user.created_at).toLocaleDateString("vi-VN"),
        };
        setSystemUsers((prev) =>
          prev.map((u) => (u.id === id ? mappedUser : u)),
        );
        return { success: true, message: res.message, user: mappedUser };
      }
      return { success: false, message: res.message || "Lỗi kết nối." };
    } catch (error: any) {
      console.error("Lỗi đổi VIP thành viên:", error);
      return { success: false, message: "Lỗi kết nối mạng." };
    }
  };

  const handleToggleUserStatus = async (id: string) => {
    try {
      const res = await toggleUserStatus(id, token);
      if (res.success && res.user) {
        const mappedUser = {
          id: res.user.id || res.user._id,
          name: res.user.username,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
          vipStatus: res.user.vipStatus,
          status: res.user.status,
          joinedDate: new Date(res.user.created_at).toLocaleDateString("vi-VN"),
        };
        setSystemUsers((prev) =>
          prev.map((u) => (u.id === id ? mappedUser : u)),
        );
        return { success: true, message: res.message, user: mappedUser };
      }
      return { success: false, message: res.message || "Lỗi kết nối." };
    } catch (error: any) {
      console.error("Lỗi đổi trạng thái thành viên:", error);
      return { success: false, message: "Lỗi kết nối mạng." };
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await adminDeleteUser(id, token);
      if (res.success) {
        setSystemUsers((prev) => prev.filter((u) => u.id !== id));
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || "Lỗi kết nối." };
    } catch (error: any) {
      console.error("Lỗi xóa thành viên:", error);
      return { success: false, message: "Lỗi kết nối mạng." };
    }
  };

  const handleRestoreUser = async (id: string) => {
    try {
      const res = await restoreUser(id, token);
      if (res.success) {
        // Refresh users to get the restored user with its details
        getSystemUsers(token).then((data) => {
          if (data.success && data.users) {
            const mapped = data.users.map((u: any) => ({
              id: u.id || u._id,
              name: u.username,
              email: u.email,
              phone: u.phone,
              role: u.role,
              vipStatus: u.vipStatus,
              status: u.status,
              joinedDate: new Date(u.created_at).toLocaleDateString("vi-VN"),
            }));
            setSystemUsers(mapped);
          }
        });
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (error: any) {
      return { success: false, message: "Lỗi kết nối mạng." };
    }
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Open cart drawer so customer enjoys the feedback
    setIsCartOpen(true);
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showHeaderFooter =
    activeTab !== "dang-nhap" &&
    activeTab !== "dang-ky" &&
    activeTab !== "admin" &&
    activeTab !== "reset-password";

  const navigationItems: { id: TabType; label: string }[] = [
    { id: "home", label: "TRANG CHỦ" },
    { id: "products", label: "SẢN PHẨM" },
    { id: "brand", label: "THƯƠNG HIỆU" }, // The requested brand page
    { id: "news", label: "TIN TỨC" },
    { id: "policy", label: "CHÍNH SÁCH" },
    { id: "contact", label: "LIÊN HỆ" },
  ];

  return (
    <div
      ref={appRef}
      className="min-h-screen bg-[#f7f9fb] text-gray-900 font-sans flex flex-col justify-between selection:bg-black selection:text-white relative"
    >
      {/* Aurora Ambient Backgrounds */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] animate-drift-slow" />
        <div className="absolute bottom-[-100px] right-[-50px] w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[120px] animate-drift-medium" />
      </div>

      {/* Primary Global Navigation */}
      {showHeaderFooter && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigationItems={navigationItems}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          totalCartCount={totalCartCount}
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      {/* Interactive Main Body Swap Grid */}
      <main
        className={
          showHeaderFooter
            ? "flex-grow"
            : "min-h-screen flex items-center justify-center p-0 w-full"
        }
      >
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <HomePage
                products={products}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onAddToCart={handleAddToCart}
                isLoggedIn={isLoggedIn}
                userEmail={userProfile.email}
              />
            </motion.div>
          )}

          {activeTab === "brand" && (
            <motion.div
              key="brand-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <BrandPage />
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div
              key="products-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <ProductPage 
                products={products} 
                onAddToCart={handleAddToCart} 
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {activeTab === "news" && (
            <motion.div
              key="news-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <NewsPage />
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div
              key="contact-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <ContactPage />
            </motion.div>
          )}

          {activeTab === "policy" && (
            <motion.div
              key="policy-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <PolicyPage />
            </motion.div>
          )}

          {activeTab === "checkout" && (
            <motion.div
              key="checkout-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <CheckoutPage
                cart={cart}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                isLoggedIn={isLoggedIn}
                userProfile={userProfile}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {activeTab === "dang-nhap" && (
            <motion.div
              key="dang-nhap-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AuthPage
                initialMode="login"
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onLoginSuccess={(email, userToken) => {
                  const isSystemAdmin = email === "admin@techvie.com";
                  if (userToken) {
                    setToken(userToken);
                    localStorage.setItem("techvie_token", userToken);
                  }
                  setUserProfile((prev) => ({
                    ...prev,
                    email: email,
                    name: isSystemAdmin
                      ? "ADMINISTRATOR"
                      : email.split("@")[0].toUpperCase(),
                    role: isSystemAdmin ? "admin" : "user",
                  }));
                  setIsLoggedIn(true);
                  if (isSystemAdmin) {
                    setActiveTab("admin");
                  } else {
                    setActiveTab("account");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onRegisterSuccess={(email, name) => {
                  setUserProfile((prev) => ({
                    ...prev,
                    email: email,
                    name: name,
                    role: "user",
                  }));
                  setIsLoggedIn(true);
                  setActiveTab("account");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {activeTab === "dang-ky" && (
            <motion.div
              key="dang-ky-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AuthPage
                initialMode="register"
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onLoginSuccess={(email, userToken) => {
                  const isSystemAdmin = email === "admin@techvie.com";
                  if (userToken) {
                    setToken(userToken);
                    localStorage.setItem("techvie_token", userToken);
                  }
                  setUserProfile((prev) => ({
                    ...prev,
                    email: email,
                    name: isSystemAdmin
                      ? "ADMINISTRATOR"
                      : email.split("@")[0].toUpperCase(),
                    role: isSystemAdmin ? "admin" : "user",
                  }));
                  setIsLoggedIn(true);
                  if (isSystemAdmin) {
                    setActiveTab("admin");
                  } else {
                    setActiveTab("account");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onRegisterSuccess={(email, name) => {
                  setUserProfile((prev) => ({
                    ...prev,
                    email: email,
                    name: name,
                    role: "user",
                  }));
                  setIsLoggedIn(true);
                  setActiveTab("account");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {activeTab === "reset-password" && (
            <motion.div
              key="reset-password-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <ResetPassword 
                token={new URLSearchParams(window.location.search).get("token") || ""}
                onNavigate={(tab) => {
                  window.history.replaceState({}, document.title, "/");
                  setActiveTab(tab);
                }}
              />
            </motion.div>
          )}

          {activeTab === "account" && (
            <motion.div
              key="account-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AccountPage
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={handleSetIsLoggedIn}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
              />
            </motion.div>
          )}

          {activeTab === "admin" && userProfile.role === "admin" && (
            <motion.div
              key="admin-route"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AdminPage
                token={token}
                products={products}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onRestoreProduct={handleRestoreProduct}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                systemUsers={systemUsers}
                onAddUser={handleAddUser}
                onToggleUserRole={handleToggleUserRole}
                onToggleUserVip={handleToggleUserVip}
                onToggleUserStatus={handleToggleUserStatus}
                onDeleteUser={handleDeleteUser}
                onRestoreUser={handleRestoreUser}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Master Website Footer conforming to branding mock directions */}
      {showHeaderFooter && (
        <Footer navigationItems={navigationItems} setActiveTab={setActiveTab} />
      )}

      {/* Left 70%-width Slide out Search panel drawer */}
      <SearchSidePanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Right Slide-out Cart panel drawer */}
      <CartSidePanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && 
         activeTab !== 'account' && 
         activeTab !== 'admin' && 
         activeTab !== 'dang-nhap' && 
         activeTab !== 'dang-ky' && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-[40] w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-800 transition-colors cursor-pointer group"
            title="Lên đầu trang"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
