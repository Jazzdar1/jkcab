import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Car, ChevronRight, User, Phone, Clock } from 'lucide-react';
import { VEHICLES, CONTACT_INFO, TOUR_PACKAGES } from '@/constants';
import { useLanguage } from '@/context/LanguageContext';
import { useSite } from '@/context/SiteContext';

import BookingForm from './BookingForm';

interface HeroProps {
  selectedVehicle?: string;
}

export default function Hero({ selectedVehicle }: HeroProps) {
  const { t } = useLanguage();
  const { settings } = useSite();

  const [selectedTour, setSelectedTour] = useState<any>(null);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 scale-105"
        style={{ 
          backgroundImage: `url("${settings.heroImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 md:backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-12 md:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center space-x-3 mb-6">
              <span className="h-[2px] w-8 bg-yellow-400"></span>
              <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em] font-sans">
                {settings.heroBadge}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tighter font-display">
              {settings.heroTitle}
            </h1>
            
            {/* Interactive Review Showcase in "Free Space" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 mb-12 relative"
            >
              <div className="absolute -inset-4 bg-yellow-400/10 blur-3xl rounded-full" />
              <div 
                className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 max-w-lg hover:bg-white/10 transition-all cursor-pointer group shadow-2xl overflow-hidden"
                onClick={() => document.getElementById('googlereviews')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl">
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-base font-black tracking-tighter uppercase mb-0.5">Verified Reviews</div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-yellow-400">
                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-yellow-400 text-[10px] font-black uppercase ml-1">4.9 Overall</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] bg-yellow-400 text-black font-black px-3 py-1.5 rounded-xl uppercase tracking-widest group-hover:scale-110 transition-transform shadow-xl shadow-yellow-400/20">
                    Srinagar Choice
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <p className="text-white text-base italic font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                      "Absolutely the best cab service in J&K. Punctual, safe, and premium vehicles. Our trip to Gulmarg was unforgettable!"
                    </p>
                    <div className="flex items-center mt-3 ml-2">
                       <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-black border-2 border-white/20">AK</div>
                       <div className="ml-3">
                         <div className="text-white text-[10px] font-black uppercase tracking-widest">Aditya Kapoor</div>
                         <div className="text-gray-500 text-[8px] font-bold uppercase tracking-widest">Verified Traveler • 2 days ago</div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] overflow-hidden bg-gray-800 shadow-xl group-hover:translate-x-1 transition-transform">
                        <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="user" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-yellow-400 flex items-center justify-center text-[9px] font-black text-black shadow-xl">
                      +2k
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Based on 2.4k reviews
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="text-xl text-gray-200 mb-10 max-w-xl leading-relaxed font-medium opacity-90 border-l-4 border-yellow-400/50 pl-6 py-2">
              {settings.heroSubtitle}
            </p>
            
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center space-x-4 text-white bg-black/40 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-yellow-400/20">{settings.heroStatsRating}</div>
                <div>
                  <div className="text-sm font-black uppercase tracking-wider">{t('hero.stats.rating')}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{settings.heroStatsLabel}</div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden -ml-3 first:ml-0 bg-gray-500">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                ))}
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-4">{settings.heroClientsCount}</div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative group" key={selectedTour?.id || 'default'}>
              <div className="absolute -inset-1 bg-yellow-400/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <BookingForm 
                initialData={{ 
                  vehicles: selectedVehicle ? [selectedVehicle] : undefined,
                  ...(selectedTour ? { serviceType: 'package', packageName: selectedTour.title } : {})
                } as any} 
              />
            </div>
            
            {/* Tour Selection Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">
                   {t('hero.popularTours') || 'Or Choose a Popular Tour'}
                </h4>
                <div className="h-[1px] flex-grow bg-white/10 mx-4"></div>
              </div>
              
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-1 gap-3 overflow-x-auto pb-4 sm:pb-0 no-scrollbar -mx-2 px-2 snap-x">
                {TOUR_PACKAGES.slice(0, 4).map((pkg) => (
                  <motion.button
                    key={pkg.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTour(pkg)}
                    className={`flex items-center p-4 rounded-[2rem] transition-all duration-300 border-2 text-left group flex-shrink-0 w-[240px] sm:w-auto snap-center ${
                      selectedTour?.id === pkg.id 
                        ? 'bg-yellow-400 border-white shadow-xl shadow-yellow-400/20' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 backdrop-blur-xl'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl overflow-hidden mr-4 flex-shrink-0 transition-transform duration-500 ${selectedTour?.id === pkg.id ? 'scale-110' : ''}`}>
                      <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className={`text-[11px] font-black uppercase tracking-wider mb-0.5 ${selectedTour?.id === pkg.id ? 'text-black' : 'text-white'}`}>
                        {pkg.title}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest flex items-center ${selectedTour?.id === pkg.id ? 'text-black/60' : 'text-gray-400'}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {pkg.duration}
                        </span>
                        <span className={`w-1 h-1 rounded-full ${selectedTour?.id === pkg.id ? 'bg-black/20' : 'bg-white/10'}`}></span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${selectedTour?.id === pkg.id ? 'text-black/80' : 'text-yellow-400'}`}>
                          {pkg.price}
                        </span>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      selectedTour?.id === pkg.id ? 'bg-black text-white' : 'bg-white/10 text-white opacity-0 group-hover:opacity-100'
                    }`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 flex items-center justify-center space-x-6">
                {selectedTour && (
                  <button 
                    onClick={() => setSelectedTour(null)}
                    className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest underline decoration-white/10 transition-colors"
                  >
                    Clear Selection
                  </button>
                )}
                <a 
                  href="#packages"
                  className="text-[10px] font-black text-yellow-400 hover:text-white uppercase tracking-widest flex items-center group transition-colors"
                >
                  View All Tours
                  <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
      >
        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4">{settings.heroScrollLabel}</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-yellow-400 to-transparent"></div>
      </motion.div>
    </section>
  );
}
