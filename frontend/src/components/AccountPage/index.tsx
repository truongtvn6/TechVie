import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminButton from './AdminButton';

// Modular sub-components
import AccountAuth from './AccountAuth';
import AccountSidebar from './AccountSidebar';
import TabProfile from './TabProfile';
import TabOrders from './TabOrders';
import TabDevices from './TabDevices';
import TabSecurity from './TabSecurity';

// @ts-ignore
import backgroundImage from '/image/huum-8fSitumSVw8-unsplash.jpg';

const defaultUserProfile = {
  name: 'Khách hàng TechVie',
  email: '',
  phone: '',
  address: '',
  memberSince: '01/07/2026',
  techvieId: 'TV-MEMBER',
  shieldStatus: 'Đang hoạt động',
  role: 'user',
};

import { getUserOrders, getUserDevices } from '../../services/api';

interface AccountPageProps {
  onNavigate: (tab: any) => void;
  isLoggedIn?: boolean;
  setIsLoggedIn?: (val: boolean) => void;
  userProfile?: any;
  setUserProfile?: (profile: any) => void;
  token?: string;
}

export default function AccountPage({ 
  onNavigate,
  isLoggedIn: externalIsLoggedIn,
  setIsLoggedIn: externalSetIsLoggedIn,
  userProfile: externalUserProfile,
  setUserProfile: externalSetUserProfile,
  token = "",
}: AccountPageProps) {
  const [localIsLoggedIn, localSetIsLoggedIn] = useState(false);
  const isLoggedIn = externalIsLoggedIn !== undefined ? externalIsLoggedIn : localIsLoggedIn;
  const setIsLoggedIn = externalSetIsLoggedIn !== undefined ? externalSetIsLoggedIn : localSetIsLoggedIn;
  
  // Dynamic background URL state with online Unsplash fallback
  const [bgUrl, setBgUrl] = useState<string>(backgroundImage);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onerror = () => {
      console.warn("Local background image failed to load, falling back to online Unsplash URL.");
      setBgUrl("https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    };
  }, []);

  // Active sub-tab inside dashboard
  const [accountTab, setAccountTab] = useState<'profile' | 'orders' | 'devices' | 'security'>('profile');

  // Interactive user data state matching Premium TechVie standards
  const [localUserProfile, localSetUserProfile] = useState(defaultUserProfile);
  const userProfile = externalUserProfile !== undefined ? externalUserProfile : localUserProfile;
  const setUserProfile = externalSetUserProfile !== undefined ? externalSetUserProfile : localSetUserProfile;

  // Real orders synced dynamically from MongoDB
  const [orders, setOrders] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  useEffect(() => {
    if (isLoggedIn && token) {
      getUserOrders(token).then((res) => {
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      });
      setIsLoadingDevices(true);
      getUserDevices().then((res) => {
        if (res.success && res.devices) {
          setDevices(res.devices);
        }
        setIsLoadingDevices(false);
      }).catch(() => {
        setIsLoadingDevices(false);
      });
    }
  }, [isLoggedIn, token]);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="relative min-h-screen w-full font-body-sm text-body-sm overflow-x-hidden selection:bg-black selection:text-white pb-12">
      {/* Local Liquid Glass Style Definitions */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;700;800;900&family=JetBrains+Mono:wght@700&display=swap');
        
        .font-tech-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0.15em;
          font-weight: 700;
        }
        .text-tech-label {
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0.15em;
          font-weight: 700;
        }
        .font-headline-md {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 18px;
          line-height: 1.3;
          letter-spacing: 0.05em;
          font-weight: 800;
        }
        .text-headline-md {
          font-size: 18px;
          line-height: 1.3;
          letter-spacing: 0.05em;
          font-weight: 800;
        }
        .font-display-hero {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 48px;
          line-height: 1.1;
          letter-spacing: -0.04em;
          font-weight: 900;
        }
        .text-display-hero {
          font-size: 48px;
          line-height: 1.1;
          letter-spacing: -0.04em;
          font-weight: 900;
        }
        .font-body-lg {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
        }
        .text-body-lg {
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
        }
        .font-headline-lg {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 24px;
          line-height: 1.2;
          letter-spacing: 0.1em;
          font-weight: 900;
        }
        .text-headline-lg {
          font-size: 24px;
          line-height: 1.2;
          letter-spacing: 0.1em;
          font-weight: 900;
        }
        .font-body-sm {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 400;
        }
        .text-body-sm {
          font-size: 13px;
          line-height: 1.5;
          font-weight: 400;
        }
        .font-caption-tiny {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 9px;
          line-height: 1;
          letter-spacing: 0.05em;
          font-weight: 900;
        }
        .text-caption-tiny {
          font-size: 9px;
          line-height: 1;
          letter-spacing: 0.05em;
          font-weight: 900;
        }
        .px-container-margin {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }
        .p-card-padding {
          padding: 2rem;
        }
        .gap-grid-gutter {
          gap: 1.5rem;
        }
        .gap-stack-gap {
          gap: 1.5rem;
        }
        .text-glow-indigo {
          text-shadow: 0 0 10px rgba(45, 55, 72, 0.2);
        }
        .custom-glass-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-glass-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.3);
        }
        .custom-glass-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(45, 55, 72, 0.2);
          border-radius: 9999px;
        }
      `}</style>

      {/* Fixed Background Layer */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* Atmospheric Blur Overlay for Text Legibility */}
      <div className="fixed inset-0 z-0 bg-white/40 backdrop-blur-[10px]" />

      {/* Main Content Layout Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-container-margin py-12 md:py-20 flex items-center justify-center min-h-[85vh]">
        <AnimatePresence mode="wait">
          
          {/* CASE 1: USER NOT SIGNED IN */}
          {!isLoggedIn ? (
            <AccountAuth onNavigate={onNavigate} setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <motion.div 
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {/* Liquid Glass Master Container */}
              <div className="w-full relative bg-white/85 backdrop-blur-[40px] border border-white/60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                {/* Specular Highlight Top Edge */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter p-card-padding">
                  
                  {/* LEFT SIDEBAR: User ID & Navigation */}
                  <AccountSidebar 
                    userProfile={userProfile}
                    accountTab={accountTab}
                    setAccountTab={setAccountTab}
                    ordersCount={orders.length}
                    handleLogout={handleLogout}
                    onNavigate={onNavigate}
                  />
                  
                  {/* RIGHT MAIN PANEL: Dynamic Content Section */}
                  <div className="lg:col-span-8 mt-8 lg:mt-0">
                    <AnimatePresence mode="wait">
                      {accountTab === 'profile' && (
                        <motion.div
                          key="profile-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TabProfile userProfile={userProfile} setUserProfile={setUserProfile} />
                        </motion.div>
                      )}

                      {accountTab === 'orders' && (
                        <motion.div
                          key="orders-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TabOrders orders={orders} />
                        </motion.div>
                      )}

                       {accountTab === 'devices' && (
                        <motion.div
                          key="devices-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full"
                        >
                          <TabDevices devices={devices} isLoading={isLoadingDevices} />
                        </motion.div>
                      )}

                      {accountTab === 'security' && (
                        <motion.div
                          key="security-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full"
                        >
                          <TabSecurity userProfile={userProfile} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
