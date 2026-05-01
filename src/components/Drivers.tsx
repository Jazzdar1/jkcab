import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Languages, Award } from 'lucide-react';
import { DRIVERS as FALLBACK_DRIVERS } from '@/constants';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function Drivers() {
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'drivers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setDrivers(FALLBACK_DRIVERS);
      } else {
        setDrivers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    }, (error) => {
      console.error("Error fetching drivers:", error);
      setDrivers(FALLBACK_DRIVERS);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="drivers" className="py-20 bg-[var(--color-hotstar-bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-4">Meet Our Experts</h2>
            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Professional Local Standard</h3>
            <p className="mt-4 text-sm text-gray-400 max-w-xl mx-auto font-medium lowercase first-letter:uppercase">
              Our drivers are more than just chauffeurs; they are local enthusiasts who know every shortcut and scenic spot in the valley.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {drivers.map((driver, index) => (
            <motion.div
              key={driver.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#101c2b] rounded-[2rem] p-6 group hover:border-yellow-400/30 transition-all duration-500 text-center border border-white/5 shadow-xl"
            >
              <div className="relative mb-6 inline-block">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl group-hover:border-yellow-400/30 transition-colors">
                  <img src={driver.image} alt={driver.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black px-2 py-1 rounded-lg shadow-lg flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-[9px] font-black">{driver.rating}</span>
                </div>
              </div>

              <h4 className="text-lg font-black text-white group-hover:text-yellow-400 mb-1 transition-colors tracking-tight">{driver.name}</h4>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4 opacity-70">{driver.specialty}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  <Award className="h-3 w-3 mr-2 text-yellow-400/50" />
                  {driver.experience} Exp
                </div>
                <div className="flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  <Languages className="h-3 w-3 mr-2 text-yellow-400/50" />
                  {driver.languages.slice(0, 2).join(', ')}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 transition-colors">
                 <div className="inline-flex items-center text-[8px] font-black text-gray-500 uppercase tracking-widest group-hover:text-yellow-400 transition-colors">
                    <ShieldCheck className="h-2.5 w-2.5 mr-1.5" />
                    Verified Expert
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#101c2b] p-6 rounded-[1.5rem] border border-white/5 flex items-start">
                <div className="bg-yellow-400/10 p-2.5 rounded-xl mr-4 flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                    <h6 className="font-black text-white text-xs uppercase tracking-widest mb-1">Police Verified</h6>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">Rigorous background check and training.</p>
                </div>
            </div>
            <div className="bg-[#101c2b] p-6 rounded-[1.5rem] border border-white/5 flex items-start">
                <div className="bg-yellow-400/10 p-2.5 rounded-xl mr-4 flex-shrink-0">
                    <Languages className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                    <h6 className="font-black text-white text-xs uppercase tracking-widest mb-1">Multilingual</h6>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">Fluent in Hindi & English communication.</p>
                </div>
            </div>
            <div className="bg-[#101c2b] p-6 rounded-[1.5rem] border border-white/5 flex items-start">
                <div className="bg-yellow-400/10 p-2.5 rounded-xl mr-4 flex-shrink-0">
                    <Award className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                    <h6 className="font-black text-white text-xs uppercase tracking-widest mb-1">First Aid Trained</h6>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">Basic medical assistance for high altitudes.</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
