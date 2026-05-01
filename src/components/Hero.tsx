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
