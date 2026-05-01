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
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: `url("${settings.heroImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#030b17] via-[#030b17]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030b17] via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-8 md:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="h-[2px] w-6 bg-yellow-400"></span>
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  {settings.heroBadge}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter font-display">
                {settings.heroTitle}
              </h1>
            </div>

            <p className="text-lg text-gray-300 max-w-lg leading-relaxed font-medium opacity-90 border-l-2 border-yellow-400/50 pl-5 text-balance">
              {settings.heroSubtitle}
            </p>
            
            {/* Interactive Review Showcase */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-lg"
            >
              <div 
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all cursor-pointer group shadow-2xl"
                onClick={() => document.getElementById('googlereviews')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5">
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-xs font-black tracking-tight uppercase">Verified Reviews</div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-yellow-400" aria-hidden="true">
                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-yellow-400 text-[8px] font-black uppercase ml-1">4.9 Overall</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] bg-yellow-400 text-black font-black px-3 py-1 rounded-xl uppercase tracking-widest shadow-lg shadow-yellow-400/20">
                    Srinagar Choice
                  </div>
                </div>

                <p className="text-white text-xs italic font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 mb-4">
                  "Absolutely the best cab service in J&K. Punctual, safe, and premium vehicles."
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-[#030b17] overflow-hidden bg-gray-800">
                        <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-none">
                    2.4k+ Google Reviews
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative" key={selectedTour?.id || 'default'}>
              <div className="absolute -inset-2 bg-yellow-400/10 rounded-[2.5rem] blur-2xl"></div>
              <div className="relative bg-[#0b1a2a]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="bg-yellow-400 py-3 text-center">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black italic">Instant Ride Booking</h3>
                </div>
                <div className="p-2">
                  <BookingForm 
                    initialData={{ 
                      vehicles: selectedVehicle ? [selectedVehicle] : undefined,
                      ...(selectedTour ? { serviceType: 'package', packageName: selectedTour.title } : {})
                    } as any} 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
      >
        <span className="text-[8px] font-black text-white uppercase tracking-[0.4em] mb-2">{settings.heroScrollLabel}</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-yellow-400 to-transparent"></div>
      </motion.div>
    </section>
  );
}
