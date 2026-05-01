import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, ShieldAlert, Award, Star, ThumbsUp } from 'lucide-react';
import { useSite } from '@/context/SiteContext';

export default function Features() {
  const { settings } = useSite();
  const highlightIcons = [ShieldCheck, ShieldAlert, Award, Clock];
  
  const highlights = settings.highlights.map((h, i) => ({
    ...h,
    icon: highlightIcons[i] || ShieldCheck
  }));

  return (
    <section className="py-24 bg-[#030b17] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-[2px] w-8 bg-yellow-400"></div>
              <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em] font-sans">{settings.featuresSectionLabel}</span>
            </div>
            
            <h3 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tighter font-display leading-none uppercase">
              {settings.featuresTitle} <br />
              <span className="text-yellow-400 font-bold italic lowercase opacity-80">{settings.featuresSubtitle}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {highlights.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-300 border border-white/5 group-hover:border-white shadow-xl flex-shrink-0">
                      <item.icon className="h-6 w-6 text-yellow-400 group-hover:text-black transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white mb-2 font-display group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{item.title}</h4>
                      <p className="text-gray-500 text-[11px] leading-relaxed font-bold opacity-80 lowercase first-letter:uppercase">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[4/5] bg-[#101c2b] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-white/10 group">
                 <img 
                    src="https://images.unsplash.com/photo-1598305310232-a764dca2161b?q=80&w=800&auto=format&fit=crop" 
                    alt="Kashmir Experience"
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#030b17] via-transparent to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-[#101c2b] p-6 rounded-2xl shadow-2xl z-20 hidden md:block border border-white/10"
            >
                <div className="flex items-center space-x-3 mb-2">
                    <div className="flex space-x-0.5">
                        {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <span className="font-black text-lg text-white">4.9</span>
                </div>
                <div className="text-gray-500 font-black text-[8px] uppercase tracking-widest leading-none">Overall Customer Rating</div>
            </motion.div>

            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -top-6 -right-6 bg-yellow-400 p-6 rounded-2xl shadow-2xl z-20 hidden md:block border-2 border-white"
            >
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mb-3">
                  <ThumbsUp className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-black tracking-tight font-display">10+</div>
                <div className="text-black font-black text-[7px] uppercase tracking-[0.2em] mt-1 space-x-2">
                   <span>YEARS</span>
                   <span className="opacity-40">OF TRUST</span>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
