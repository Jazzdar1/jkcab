import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Car, ChevronRight, User, Phone } from 'lucide-react';
import { VEHICLES, CONTACT_INFO } from '../constants';
import { useLanguage } from '../context/LanguageContext';

import BookingForm from './BookingForm';

interface HeroProps {
  selectedVehicle?: string;
}

export default function Hero({ selectedVehicle }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1598305310232-a764dca2161b?q=80&w=2070&auto=format&fit=crop")',
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
                {t('hero.badge')}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tighter font-display">
              {t('hero.title').split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-3">
                  {word === 'Kashmir' || word === 'कश्मीर' ? (
                    <span className="text-yellow-400 relative">
                       {word}
                       <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400/30 rounded-full animate-pulse"></span>
                    </span>
                  ) : word}
                </span>
              ))}
            </h1>
            
            <p className="text-xl text-gray-200 mb-10 max-w-xl leading-relaxed font-medium opacity-90 border-l-4 border-yellow-400/50 pl-6 py-2">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center space-x-4 text-white bg-black/40 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-yellow-400/20">4.9</div>
                <div>
                  <div className="text-sm font-black uppercase tracking-wider">{t('hero.stats.rating')}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Verified Srinagar Reviews</div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                {[1, 2, 3, 4].map((_, i) => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden -ml-3 first:ml-0 bg-gray-500">
                     <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                   </div>
                ))}
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-4">+2k Happy Clients</div>
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
            <div className="relative group">
              <div className="absolute -inset-1 bg-yellow-400/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <BookingForm initialData={{ vehicles: selectedVehicle ? [selectedVehicle] : undefined }} />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
      >
        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4">Discover Kashmir</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-yellow-400 to-transparent"></div>
      </motion.div>
    </section>
  );
}
