import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { TOUR_PACKAGES as FALLBACK_PACKAGES } from '@/constants';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useSite } from '@/context/SiteContext';

interface PackagesProps {
  onPackageSelect?: (pkgName: string) => void;
}

export default function Packages({ onPackageSelect }: PackagesProps) {
  const [packages, setPackages] = useState<any[]>([]);
  const { settings } = useSite();

  useEffect(() => {
    const q = query(collection(db, 'packages'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setPackages(FALLBACK_PACKAGES);
      } else {
        setPackages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    }, (error) => {
      console.error("Error fetching packages:", error);
      setPackages(FALLBACK_PACKAGES);
    });

    return () => unsubscribe();
  }, []);

  const gridCols = packages.length >= 4 
    ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" 
    : packages.length === 2 
    ? "sm:grid-cols-2" 
    : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="tourpackages" className="py-20 bg-[var(--color-hotstar-bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-[1px] w-8 bg-yellow-400"></div>
              <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em] font-sans">{settings.packagesTitle}</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight font-display">
              {settings.packagesSubtitle}
            </h3>
            <p className="text-gray-400 font-medium max-w-xl text-sm leading-relaxed">{settings.packagesDescription}</p>
          </motion.div>
        </div>

        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onPackageSelect?.(pkg.title)}
              className="group bg-[#101c2b] rounded-[2rem] overflow-hidden border border-white/5 hover:border-yellow-400/30 transition-all duration-300 flex flex-col h-full cursor-pointer shadow-xl"
            >
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#101c2b] via-transparent to-transparent z-10 opacity-60"></div>
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20 bg-yellow-400 text-black px-3 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase">
                  Popular
                </div>
                <div className="absolute bottom-4 left-4 z-20">
                    <div className="flex items-center text-white text-[9px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                        <Clock className="h-3 w-3 mr-2 text-yellow-400" />
                        {pkg.duration}
                    </div>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h4 className="text-xl font-black text-white mb-3 leading-tight tracking-tight group-hover:text-yellow-400 transition-colors">
                  {pkg.title}
                </h4>
                
                <p className="text-xs text-gray-500 mb-6 font-medium line-clamp-2 leading-relaxed uppercase tracking-tight">
                  {pkg.description}
                </p>

                <div className="space-y-2 mb-8 flex-grow">
                  {pkg.destinations.slice(0, 3).map((dest, i) => (
                    <div key={i} className="flex items-center text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                      <div className="w-1 h-1 bg-yellow-400/50 rounded-full mr-3"></div>
                      {dest}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div>
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{settings.labelStartsAt}</div>
                        <div className="text-xl font-black text-white">
                             {pkg.price.includes('from ') ? pkg.price.split('from ')[1] : pkg.price}
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-yellow-400 group-hover:text-black flex items-center justify-center transition-all">
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
