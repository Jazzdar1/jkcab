import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Users, Check, ShieldCheck, Star, Calendar, MessageSquare, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Fleet from '@/components/Fleet';
import Rates from '@/components/Rates';
import Packages from '@/components/Packages';
import Features from '@/components/Features';
import Drivers from '@/components/Drivers';
import Testimonials from '@/components/Testimonials';
import GoogleReviews from '@/components/GoogleReviews';
import TravelGuide from '@/components/TravelGuide';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Dashboard from '@/components/Dashboard';
import AdminPanel from '@/components/AdminPanel';
import BookingForm from '@/components/BookingForm';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SiteProvider } from '@/context/SiteContext';
import { VEHICLES as FALLBACK_VEHICLES, CONTACT_INFO } from '@/constants';
import { useLanguage } from '@/context/LanguageContext';
import { useSite } from '@/context/SiteContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

function BookingModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: any }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-hotstar-surface rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-hotstar-border flex-shrink-0">
               <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Secure Ride Booking</h4>
               <button 
                 onClick={onClose}
                 className="w-10 h-10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 rounded-2xl flex items-center justify-center transition-all"
               >
                 <X className="h-5 w-5" />
               </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 md:p-8 scrollbar-hide">
              <BookingForm initialData={initialData} onSuccess={() => setTimeout(onClose, 2500)} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function VehicleDetailsPage({ onBook }: { onBook: (id: string, name: string) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { settings } = useSite();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'fleet', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setVehicle(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching vehicle:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vehicle not found</h2>
          <button onClick={() => navigate('/')} className="text-yellow-600 font-bold uppercase tracking-widest text-xs">Go Back Home</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[var(--color-hotstar-bg)] min-h-screen"
    >
      <button 
        onClick={() => navigate(-1)}
        className="mb-12 flex items-center space-x-3 text-gray-500 hover:text-white transition-colors group"
      >
        <div className="p-2 bg-white/5 rounded-xl group-hover:bg-yellow-400 group-hover:text-black transition-all">
          <ArrowLeft className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{settings.labelBookingBack}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5"
          >
            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
          </motion.div>
          
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 overflow-hidden border border-white/5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                <img src={vehicle.image} className="w-full h-full object-cover" alt="Gallery" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="bg-yellow-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-black">
                {vehicle.type}
              </span>
              {vehicle.isPremium && (
                <span className="bg-white text-black px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider">
                  Premium Class
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 font-display tracking-tighter leading-none">{vehicle.name}</h1>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-400/10 rounded-2xl">
                  <Users className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{settings.labelCapacity}</div>
                  <div className="text-sm font-black text-white uppercase">{vehicle.capacity}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-400/10 rounded-2xl">
                  <Star className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{settings.labelPricing}</div>
                  <div className="text-sm font-black text-white uppercase">{vehicle.pricePerDay} <span className="text-[10px] text-gray-400">/ Day</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-[#101c2b] rounded-[2.5rem] border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Premium Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {vehicle.features.map((feature, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shadow-sm border border-white/5">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{feature}</span>
                </div>
              ))}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shadow-sm border border-white/5">
                  <ShieldCheck className="h-4 w-4 text-yellow-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Full Insurance</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shadow-sm border border-white/5">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Flexible Dates</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => onBook(id!, vehicle.name)}
              className="flex-[2] bg-yellow-400 text-black h-20 rounded-[1.75rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-yellow-400/20 hover:bg-white hover:scale-105 transition-all transform active:scale-95 flex items-center justify-center"
            >
              {settings.labelBookNow}
            </button>
            <a 
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-white/5 text-white h-20 rounded-[1.75rem] font-black uppercase tracking-[0.2em] text-[10px] border border-white/5 flex items-center justify-center space-x-2 hover:bg-white/10 transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{settings.labelInquire}</span>
            </a>
          </div>
          
          <p className="text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">
            {settings.labelNoAdvance}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function HomePage({ onVehicleSelect, onBulkInquiry, onPackageSelect, onCustomInquiry }: { onVehicleSelect: (id: string, name: string) => void, onBulkInquiry: () => void, onPackageSelect: (pkgName: string) => void, onCustomInquiry: () => void }) {
  const navigate = useNavigate();
  return (
    <>
      <Hero />
      <Fleet onVehicleSelect={(id) => {
        navigate(`/vehicle/${id}`);
      }} onBulkInquiry={onBulkInquiry} />
      <Rates onCustomInquiry={onCustomInquiry} />
      <Features />
      <Drivers />
      <Packages onPackageSelect={onPackageSelect} />
      <GoogleReviews />
      <Testimonials />
      <TravelGuide />
    </>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleVehicleSelect = (id: string, name: string) => {
    setModalData({ vehicles: [name], isBulk: false });
    setIsModalOpen(true);
  };

  const handleBulkInquiry = () => {
    setModalData({ isBulk: true });
    setIsModalOpen(true);
  };

  const handlePackageSelect = (packageName: string) => {
    setModalData({ serviceType: 'package', packageName, isBulk: false });
    setIsModalOpen(true);
  };

  const handleCustomInquiry = () => {
    setModalData({ isCustom: true });
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-yellow-200 selection:text-black transition-colors duration-500 ${theme === 'dark' ? 'dark bg-hotstar-bg text-white' : 'bg-white text-gray-900'}`}>
      <Navbar 
        onDashboardClick={() => navigate('/dashboard')} 
        onHomeClick={() => navigate('/')} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onVehicleSelect={handleVehicleSelect} onBulkInquiry={handleBulkInquiry} onPackageSelect={handlePackageSelect} onCustomInquiry={handleCustomInquiry} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/vehicle/:id" element={<VehicleDetailsPage onBook={handleVehicleSelect} />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={modalData} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SiteProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </SiteProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
