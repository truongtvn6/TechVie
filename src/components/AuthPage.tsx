import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

// @ts-ignore
import userImage from '/image/jakub-zerdzicki-VfZj-4H5D48-unsplash.jpg';

interface AuthPageProps {
  initialMode: 'login' | 'register';
  onNavigate: (tab: any) => void;
  onLoginSuccess: (email: string, token?: string) => void;
  onRegisterSuccess: (email: string, name: string) => void;
}

export default function AuthPage({ 
  initialMode, 
  onNavigate, 
  onLoginSuccess, 
  onRegisterSuccess 
}: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (loginPassword.length < 6) {
      setLoginError('Mật khẩu hệ thống TechVie ID yêu cầu tối thiểu từ 6 ký tự.');
      return;
    }

    setIsLoggingIn(true);
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.message || 'Sai thông tin đăng nhập!'); });
        }
        return res.json();
      })
      .then(data => {
        setIsLoggingIn(false);
        if (data.success && data.token) {
          onLoginSuccess(loginEmail, data.token);
        } else {
          setLoginError(data.message || 'Sai thông tin đăng nhập!');
        }
      })
      .catch(err => {
        console.warn('Backend login failed, using fallback mock login.', err);
        // Fallback: If it's the admin demo, we'll pretend login succeeded
        if (loginEmail === 'admin@techvie.com' && loginPassword === 'admin123') {
          setIsLoggingIn(false);
          onLoginSuccess(loginEmail, 'Bearer mock_admin_token');
        } else if (loginEmail === 'mintzinfinity898@gmail.com' && loginPassword === '123456') {
          setIsLoggingIn(false);
          onLoginSuccess(loginEmail, 'Bearer mock_user_token');
        } else {
          setIsLoggingIn(false);
          setLoginError(err.message || 'Lỗi kết nối máy chủ!');
        }
      });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!regFullName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegisterError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (regPassword.length < 6) {
      setRegisterError('Mật khẩu bảo mật TechVie ID yêu cầu tối thiểu từ 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegisterError('Xác nhận lại mật khẩu chưa trùng khớp.');
      return;
    }

    if (!agreeTerms) {
      setRegisterError('Bạn cần chấp thuận Điều khoản dịch vụ & Chính sách bảo mật.');
      return;
    }

    setIsRegistering(true);
    fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: regFullName, email: regEmail, password: regPassword })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.message || 'Đăng ký thất bại!'); });
        }
        return res.json();
      })
      .then(data => {
        setIsRegistering(false);
        if (data.success) {
          onRegisterSuccess(regEmail, regFullName);
        } else {
          setRegisterError(data.message || 'Đăng ký thất bại!');
        }
      })
      .catch(err => {
        setIsRegistering(false);
        console.warn('Backend registration failed, using fallback mock.', err);
        setRegisterError(err.message || 'Lỗi kết nối máy chủ!');
      });
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-white select-none">
      {/* Styles for Premium Liquid Glass Theme */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,300..900;1,300..900&display=swap');

        .font-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        /* Deep Liquid Refraction Effect */
        .liquid-glass-slab {
          background: rgba(255, 255, 255, 0.32);
          backdrop-filter: blur(50px) saturate(190%) contrast(105%);
          -webkit-backdrop-filter: blur(50px) saturate(190%) contrast(105%);
          box-shadow: 
            0 30px 60px -15px rgba(0, 0, 0, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.45);
        }

        /* Liquid Sheen (Refractive light sweep anim) */
        .glass-sheen-container {
          position: relative;
          overflow: hidden;
        }
        .glass-sheen-container::after {
          content: '';
          position: absolute;
          top: -150%;
          left: -150%;
          width: 300%;
          height: 300%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.35) 48%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.35) 52%,
            rgba(255, 255, 255, 0) 60%
          );
          transform: rotate(25deg);
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          z-index: 5;
        }
        .glass-sheen-container:hover::after {
          transform: translate(120%, 120%) rotate(25deg);
        }

        /* Glass border highlight line */
        .glass-edge {
          position: relative;
        }
        .glass-edge::before {
          content: "";
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          background: linear-gradient(
            145deg, 
            rgba(255,255,255,0.85) 0%, 
            rgba(255,255,255,0.1) 35%, 
            rgba(0,0,0,0.05) 60%, 
            rgba(255,255,255,0.45) 100%
          ) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          border-radius: inherit;
        }

        /* Premium Glass Input Fields */
        .glass-input {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          border-left: 1px solid rgba(0, 0, 0, 0.05);
          border-bottom: 2px solid rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          color: #000000;
        }
        .glass-input:hover {
          background: rgba(255, 255, 255, 0.25);
          border-bottom-color: rgba(0, 0, 0, 0.25);
        }
        .glass-input:focus {
          background: rgba(255, 255, 255, 0.4);
          border-bottom-color: #000000;
          box-shadow: 
            0 10px 25px -10px rgba(0, 0, 0, 0.08),
            0 0 12px 2px rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        /* High-Intensity Glow Buttons with Fluid Shadows */
        .glow-button {
          box-shadow: 
            0 0 0 1px rgba(0,0,0,1),
            0 12px 24px -8px rgba(0,0,0,0.45),
            0 25px 50px -12px rgba(0,0,0,0.2),
            inset 0 1px 1px rgba(255,255,255,0.4);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glow-button:hover {
          box-shadow: 
            0 0 0 1px rgba(0,0,0,1),
            0 18px 36px -10px rgba(0,0,0,0.55),
            0 35px 70px -15px rgba(0,0,0,0.3),
            0 0 45px 5px rgba(255,255,255,0.95);
          transform: translateY(-2px);
        }

        /* Liquid flowing orbs in background container */
        .aurora-bg {
          background: linear-gradient(135deg, #f3f4f6 0%, #e2e8f0 45%, #cbd5e1 100%);
          position: relative;
          overflow: hidden;
        }
        
        /* Floating abstract oil glass blobs (Liquid Glass feel) */
        .liquid-orb-1 {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(147, 197, 253, 0.5) 0%, rgba(191, 219, 254, 0.15) 50%, transparent 80%);
          filter: blur(40px);
          animation: floatOrb1 28s infinite alternate ease-in-out;
          pointer-events: none;
          z-index: 1;
        }
        .liquid-orb-2 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(251, 191, 36, 0.35) 0%, rgba(254, 243, 199, 0.1) 60%, transparent 80%);
          filter: blur(50px);
          animation: floatOrb2 34s infinite alternate ease-in-out;
          pointer-events: none;
          z-index: 1;
        }
        .liquid-orb-3 {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(224, 231, 255, 0.6) 0%, rgba(238, 242, 255, 0.2) 50%, transparent 80%);
          filter: blur(30px);
          animation: floatOrb3 24s infinite alternate ease-in-out;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes floatOrb1 {
          0% { transform: translate(-10%, -20%) scale(1) rotate(0deg); }
          50% { transform: translate(30%, 15%) scale(1.15) rotate(180deg); }
          100% { transform: translate(-5%, 35%) scale(0.9) rotate(360deg); }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(40%, 30%) scale(1.1) rotate(360deg); }
          50% { transform: translate(-20%, -10%) scale(0.85) rotate(180deg); }
          100% { transform: translate(15%, -25%) scale(1.05) rotate(0deg); }
        }
        @keyframes floatOrb3 {
          0% { transform: translate(15%, -30%) scale(0.9) rotate(180deg); }
          50% { transform: translate(-30%, 20%) scale(1.12) rotate(0deg); }
          100% { transform: translate(25%, 15%) scale(1) rotate(360deg); }
        }

        .small-caps {
          font-variant: all-small-caps;
          letter-spacing: 0.12em;
        }

        /* Refractive Glass Card */
        .glass-floating-card {
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.38);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          box-shadow: 
            0 4px 30px rgba(0, 0, 0, 0.03),
            0 25px 60px -15px rgba(0, 0, 0, 0.1),
            inset 0 1px 3px rgba(255, 255, 255, 0.6);
        }

        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .glass-shimmer-sweep {
          animation: shimmer 1.8s infinite ease-in-out;
        }
      `}</style>

      {/* Floating Home Back Button */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('home');
        }}
        className="group absolute top-6 left-6 md:left-12 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.12] hover:bg-white/[0.22] text-white border border-white/20 hover:border-white/40 transition-all text-[11px] font-bold tracking-wider backdrop-blur-2xl active:scale-95 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_44px_rgba(255,255,255,0.18)] uppercase font-jakarta overflow-hidden"
      >
        {/* Shimmer sweep glass effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:glass-shimmer-sweep pointer-events-none" />
        
        {/* Sparkle border reflex */}
        <span className="absolute inset-0 rounded-full border border-white/10 pointer-events-none group-hover:border-white/30 transition-colors" />

        <ArrowLeft size={13} className="text-white group-hover:-translate-x-0.5 transition-transform duration-200" />
        <span className="relative z-10 text-white/90 group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Trở lại Trang chủ</span>
      </a>

      {/* Left Column: Full-bleed high precision product image (60vw on desktop, hidden on mobile) */}
      <div className="hidden lg:block lg:w-[60vw] h-screen relative overflow-hidden bg-black">
        {/* Dynamic Light source ambient orbs for real-time backdrop refraction */}
        <div 
          className="absolute right-[-120px] top-[15%] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-amber-400/20 to-blue-400/25 filter blur-[40px] opacity-70 z-10 pointer-events-none"
          style={{ mixBlendMode: 'plus-lighter', animation: 'floatOrb1 32s infinite alternate ease-in-out' }}
        />
        <div 
          className="absolute left-[10%] bottom-[10%] w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-cyan-400/25 to-indigo-400/15 filter blur-[50px] opacity-60 z-10 pointer-events-none"
          style={{ mixBlendMode: 'plus-lighter', animation: 'floatOrb2 28s infinite alternate ease-in-out' }}
        />

        <motion.img 
          initial={{ scale: 1.05 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
          alt="TechVie Architectural Tech Backdrop" 
          className="w-full h-full object-cover opacity-85 ease-in-out" 
          src={userImage} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
        
        {/* Stunning Progressive Liquid Glass Refraction Plates (reversing X gradient to the left) */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            backdropFilter: 'blur(32px) saturate(190%) contrast(106%) brightness(1.04)',
            WebkitBackdropFilter: 'blur(32px) saturate(190%) contrast(106%) brightness(1.04)',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
          }}
        />
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            backdropFilter: 'blur(16px) saturate(145%) brightness(1.02)',
            WebkitBackdropFilter: 'blur(16px) saturate(145%) brightness(1.02)',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.65) 5%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.65) 5%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0) 100%)'
          }}
        />

        {/* Branding Overlay */}
        <div className="absolute bottom-16 left-16 z-30">
          <h1 className="text-white font-playfair text-6xl leading-tight font-black tracking-tighter mix-blend-difference select-none">
            TECHVIE
          </h1>
          <p className="text-white/60 font-jakarta text-[11px] tracking-[0.4em] uppercase mt-4 font-semibold select-none small-caps">
            Refractive Excellence
          </p>
        </div>
      </div>

      {/* 
        CENTRAL SPLIT AXIS: LIQUID GLASS BLEND CORRIDOR
        Creates a seamless, ultra-premium organic gradient blur transition 
        between the hyper-sharp structural image on the left and 
        the vibrant flowing glass aesthetics on the right.
      */}
      <div className="hidden lg:block absolute left-[60vw] -translate-x-[160px] w-[320px] h-full pointer-events-none z-30">
        {/* Layer 1: Progressive Refractive Blur (smoothly fades the image details) */}
        <div 
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(45px) saturate(180%) contrast(102%)',
            WebkitBackdropFilter: 'blur(45px) saturate(180%) contrast(102%)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 10%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.9) 75%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 10%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.9) 75%, rgba(0,0,0,1) 100%)'
          }}
        />

        {/* Layer 2: Extreme Liquid glass Refraction near the right side edge */}
        <div 
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(90px) saturate(220%) brightness(1.05) contrast(110%)',
            WebkitBackdropFilter: 'blur(90px) saturate(220%) brightness(1.05) contrast(110%)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 45%, rgba(0,0,0,0.3) 65%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 45%, rgba(0,0,0,0.3) 65%, black 100%)'
          }}
        />

        {/* Layer 3: Chromatic light spectrum accent right at the glass boundary */}
        <div 
          className="absolute inset-y-0 left-[100px] right-0 opacity-30 mix-blend-color-dodge bg-gradient-to-r from-amber-400/20 via-blue-500/20 to-transparent"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 40%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%, transparent 95%)'
          }}
        />

        {/* Layer 4: Physical solid crystal edge Chamfer highlights */}
        <div className="absolute inset-y-0 left-[160px] w-[1px] bg-white/40 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
        <div className="absolute inset-y-0 left-[161px] w-[1px] bg-black/10" />
      </div>

      {/* Right Column: Unified Auth Panel with Refractive Frost Effect */}
      <div className="w-full lg:w-[40vw] h-screen aurora-bg relative flex flex-col items-center justify-center font-jakarta p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Highly blurred continuation background of the left image to blend colors organically */}
        <div 
          className="absolute inset-0 bg-cover pointer-events-none scale-110 opacity-75"
          style={{ 
            backgroundImage: `url(${userImage})`,
            backgroundPosition: 'right center',
            filter: 'blur(75px) saturate(180%) brightness(0.97)',
          }}
        />

        {/* Rich Flowing Liquid Orbs */}
        <div className="liquid-orb-1 opacity-70" />
        <div className="liquid-orb-2 opacity-60" />
        <div className="liquid-orb-3 opacity-75" />
        
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="liquid-glass-slab glass-edge glass-sheen-container w-full h-full max-h-[850px] lg:max-h-full rounded-[28px] sm:rounded-[36px] lg:border-none px-6 py-8 sm:px-12 md:px-14 lg:px-10 xl:px-14 flex flex-col justify-center z-10 overflow-y-auto"
        >
          {/* Header Section */}
          <div className="mb-7 mt-3 relative z-10">
            <h2 className="font-sans text-3xl sm:text-4xl text-black font-extrabold tracking-tighter mb-7">
              {mode === 'login' ? 'Chào mừng trở lại' : 'Mời Bạn Tham Gia TechVie'}
            </h2>

            {/* Tab Switcher with Sleek Glassy Styling */}
            <div className="flex border-b border-black/5 relative p-0.5">
              <button 
                type="button"
                className={`flex-1 py-4 font-jakarta text-[13px] font-bold tracking-[0.15em] relative z-20 transition-all cursor-pointer ${
                  mode === 'login' ? 'text-black border-b-2 border-black font-extrabold' : 'text-black/40 border-b-2 border-transparent hover:text-black/70'
                }`}
                onClick={() => {
                  setMode('login');
                  onNavigate('dang-nhap');
                }}
              >
                ĐĂNG NHẬP
              </button>
              <button 
                type="button"
                className={`flex-1 py-4 font-jakarta text-[13px] font-bold tracking-[0.15em] relative z-20 transition-all cursor-pointer ${
                  mode === 'register' ? 'text-black border-b-2 border-black font-extrabold' : 'text-black/40 border-b-2 border-transparent hover:text-black/70'
                }`}
                onClick={() => {
                  setMode('register');
                  onNavigate('dang-ky');
                }}
              >
                ĐĂNG KÝ
              </button>
            </div>
          </div>

          {/* Form Switcher with beautiful Horizontal Slide & Fade Animations */}
          <div className="relative overflow-visible z-10">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div
                  key="login-form-div"
                  initial={{ opacity: 0, x: -15, y: 1 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 15, y: -1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                    {loginError && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-xl"
                      >
                        {loginError}
                      </motion.div>
                    )}

                    {/* Email Field with Frosted Glass look */}
                    <div className="space-y-1.5">
                      <label className="font-jakarta text-[12px] uppercase tracking-widest text-black/60 font-semibold small-caps block ml-0.5">
                        Email
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full glass-input px-4 py-3 rounded-xl font-jakarta text-sm outline-none placeholder-black/35 animate-none"
                      />
                    </div>

                    {/* Password Field with Frosted Glass look */}
                    <div className="space-y-1.5">
                      <label className="font-jakarta text-[12px] uppercase tracking-widest text-black/60 font-semibold small-caps block ml-0.5">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <input 
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full glass-input pl-4 pr-11 py-3 rounded-xl font-jakarta text-sm outline-none placeholder-black/35"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/45 hover:text-black transition-opacity cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forget Password */}
                    <div className="flex justify-between items-center mt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input 
                          type="checkbox"
                          defaultChecked
                          className="rounded border-black/20 text-black focus:ring-0 h-4 w-4 bg-transparent cursor-pointer" 
                        />
                        <span className="font-jakarta text-[12px] font-semibold text-black/60 group-hover:text-black transition-colors uppercase tracking-wider">
                          Ghi nhớ tôi
                        </span>
                      </label>
                      <a 
                        href="#forgot-password"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Liên kết khôi phục mật khẩu đã được gửi đến email của bạn.');
                        }}
                        className="font-jakarta text-[12px] font-semibold text-black hover:opacity-50 transition-opacity uppercase tracking-wider underline underline-offset-4"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full py-4.5 sm:py-5 bg-black text-white rounded-xl font-jakarta text-xs font-bold tracking-[0.2em] mt-2 active:scale-[0.98] transition-all glow-button uppercase cursor-pointer"
                    >
                      {isLoggingIn ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>ĐANG ĐĂNG NHẬP...</span>
                        </div>
                      ) : (
                        'ĐĂNG NHẬP NGAY'
                      )}
                    </button>
                  </form>

                  {/* Demo Login Trigger */}
                  <div className="mt-5 p-3.5 bg-white/20 border border-black/5 hover:bg-white/35 transition-all rounded-xl backdrop-blur-md flex flex-col gap-2.5">
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black/55 block mb-1 font-jakarta">Thử nghiệm nhanh một chạm:</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setLoginEmail('mintzinfinity898@gmail.com');
                          setLoginPassword('123456');
                          setIsLoggingIn(true);
                          fetch('http://localhost:5000/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: 'mintzinfinity898@gmail.com', password: '123456' })
                          })
                            .then(res => res.json())
                            .then(data => {
                              setIsLoggingIn(false);
                              if (data.success && data.token) {
                                onLoginSuccess('mintzinfinity898@gmail.com', data.token);
                              } else {
                                onLoginSuccess('mintzinfinity898@gmail.com', 'Bearer mock_user_token');
                              }
                            })
                            .catch(() => {
                              setIsLoggingIn(false);
                              onLoginSuccess('mintzinfinity898@gmail.com', 'Bearer mock_user_token');
                            });
                        }}
                        className="text-[10.5px] font-semibold font-mono tracking-wider text-black hover:opacity-75 transition-opacity underline decoration-black/30 underline-offset-3"
                      >
                        Demo: mintzinfinity898@gmail.com (123456)
                      </button>
                    </div>

                    <div className="border-t border-black/5 pt-2.5 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1 font-jakarta">⚡ Quyền Administrator (Người Quản Lý):</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setLoginEmail('admin@techvie.com');
                          setLoginPassword('admin123');
                          setIsLoggingIn(true);
                          fetch('http://localhost:5000/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: 'admin@techvie.com', password: 'admin123' })
                          })
                            .then(res => res.json())
                            .then(data => {
                              setIsLoggingIn(false);
                              if (data.success && data.token) {
                                onLoginSuccess('admin@techvie.com', data.token);
                              } else {
                                onLoginSuccess('admin@techvie.com', 'Bearer mock_admin_token');
                              }
                            })
                            .catch(() => {
                              setIsLoggingIn(false);
                              onLoginSuccess('admin@techvie.com', 'Bearer mock_admin_token');
                            });
                        }}
                        className="text-[10.5px] font-bold font-mono tracking-wider text-indigo-600 hover:opacity-75 transition-opacity underline decoration-indigo-400 underline-offset-3 block mx-auto cursor-pointer"
                      >
                        Gia vòm admin: admin@techvie.com (admin123)
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register-form-div"
                  initial={{ opacity: 0, x: 15, y: 1 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -15, y: -1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4.5">
                    {registerError && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 text-red-650 text-xs rounded-xl"
                      >
                        {registerError}
                      </motion.div>
                    )}

                    {/* Full Name Field */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] uppercase tracking-widest text-black/60 font-semibold small-caps block ml-0.5">
                        Họ và Tên
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none placeholder-black/35"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] uppercase tracking-widest text-black/60 font-semibold small-caps block ml-0.5">
                        Email
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="example@techvie.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none placeholder-black/35"
                      />
                    </div>

                    {/* Password Row */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[12px] uppercase tracking-widest text-black/60 font-semibold small-caps block ml-0.5">
                          Mật khẩu
                        </label>
                        <div className="relative">
                          <input 
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full glass-input pl-4 pr-10 py-2.5 rounded-xl text-sm outline-none placeholder-black/35"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/45 hover:text-black transition-opacity cursor-pointer"
                          >
                            {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[12px] uppercase tracking-widest text-black/60 font-semibold small-caps block ml-0.5">
                          Xác nhận lại mật khẩu
                        </label>
                        <div className="relative">
                          <input 
                            type={showRegConfirmPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            className="w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none placeholder-black/35"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/45 hover:text-black transition-opacity cursor-pointer"
                          >
                            {showRegConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Agree Terms Checkbox */}
                    <div className="flex items-center gap-2.5 pt-0.5">
                      <input 
                        type="checkbox"
                        id="reg-agree-terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded border-black/20 text-black focus:ring-0 h-4 w-4 bg-transparent cursor-pointer" 
                      />
                      <label htmlFor="reg-agree-terms" className="font-jakarta text-[12px] font-semibold text-black/60 select-none cursor-pointer">
                        Tôi đồng ý với <span className="text-black hover:underline cursor-pointer">Điều khoản dịch vụ</span> &amp; <span className="text-black hover:underline cursor-pointer">Bảo mật</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      disabled={isRegistering}
                      className="w-full py-4.5 sm:py-5 bg-black text-white rounded-xl font-jakarta text-xs font-bold tracking-[0.2em] mt-2 active:scale-[0.98] transition-all glow-button uppercase cursor-pointer"
                    >
                      {isRegistering ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>ĐANG ĐĂNG KÝ...</span>
                        </div>
                      ) : (
                        'THAM GIA TECHVIE'
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Social Connect */}
          <div className="mt-7 relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-[1px] flex-1 bg-black/5"></div>
              <span className="font-jakarta text-[12px] font-bold text-black/40 uppercase tracking-[0.25em] small-caps">Tiếp tục với</span>
              <div className="h-[1px] flex-1 bg-black/5"></div>
            </div>

            <div className="flex gap-3.5">
              <button 
                type="button"
                onClick={() => {
                  if (mode === 'login') {
                    onLoginSuccess('google-user@gmail.com');
                  } else {
                    onRegisterSuccess('google-user@gmail.com', 'Google User');
                  }
                }}
                className="flex-1 h-13 border border-black/10 bg-white/40 hover:bg-white/60 rounded-xl flex items-center justify-center transition-all active:scale-95 glass-edge cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" role="img" viewBox="0 0 24 24" fill="currentColor">
                  <title>Google</title>
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span className="font-jakarta text-[11px] font-bold tracking-[0.15em] uppercase">Google</span>
              </button>

              {/* <button 
                type="button"
                onClick={() => {
                  if (mode === 'login') {
                    onLoginSuccess('apple-user@apple.com');
                  } else {
                    onRegisterSuccess('apple-user@apple.com', 'Apple User');
                  }
                }}
                className="flex-1 h-13 border border-black/10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all active:scale-95 glass-edge cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" role="img" viewBox="0 0 24 24" fill="currentColor">
                  <title>Apple</title>
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                <span className="font-jakarta text-[11px] font-bold tracking-[0.15em] uppercase">Apple</span>
              </button> */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
