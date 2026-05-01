import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, ShieldAlert, Award, Star, ThumbsUp } from 'lucide-react';

export default function Features() {
  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Reliable Service',
      desc: 'We pride ourselves on punctuality and high safety standards for every client.'
    },
    {
      icon: ShieldAlert,
      title: 'No Hidden Costs',
      desc: 'Transparant pricing from the start. What we quote is what you pay.'
    },
    {
      icon: Award,
      title: 'Local Experts',
      desc: 'Our drivers are born and raised in Kashmir, knowing every hidden gem.'
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      desc: 'Stay informed with live driver tracking and instant WhatsApp updates for every trip.'
    }
  ];

  return (
    <section className="py-32 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-[2px] w-12 bg-yellow-400"></div>
              <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.4em] font-sans">Why J&K CABS?</span>
            </div>
            
            <h3 className="text-5xl md:text-7xl font-black text-white mb-16 tracking-tighter font-display leading-[0.95]">
              A Service Built on <br />
              <span className="text-yellow-400 opacity-50 italic">Trust & Experience</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
              {highlights.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-white/5 rounded-[1.25rem] flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-500 border border-white/10 group-hover:border-white shadow-2xl">
                      <item.icon className="h-7 w-7 text-yellow-400 group-hover:text-black transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-3 font-display group-hover:text-yellow-400 transition-colors">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed font-medium opacity-80">{item.desc}</p>
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
            <div className="aspect-[4/5] bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border border-white/10 group">
                 <img 
                    src="https://images.unsplash.com/photo-1598305310232-a764dca2161b?q=80&w=800&auto=format&fit=crop" 
                    alt="Kashmir Experience"
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] z-20 hidden md:block border border-gray-100"
            >
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex space-x-1">
                        {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <span className="font-black text-2xl text-gray-900">4.9</span>
                </div>
                <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-none">Avg. Travellers' Satisfaction</div>
            </motion.div>

            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -top-10 -right-10 bg-yellow-400 p-10 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(250,204,21,0.3)] z-20 hidden md:block border-4 border-white"
            >
                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mb-4">
                  <ThumbsUp className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-5xl font-black text-black tracking-tighter font-display">10+</div>
                <div className="text-black font-black text-[10px] uppercase tracking-[0.2em] mt-1 space-x-2">
                   <span>YEARS</span>
                   <span className="opacity-40">EXPERIENCE</span>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
