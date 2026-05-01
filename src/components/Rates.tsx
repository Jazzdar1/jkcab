import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, Car } from 'lucide-react';
import { ROUTE_RATES as FALLBACK_RATES } from '@/constants';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useSite } from '@/context/SiteContext';

interface RatesProps {
  onCustomInquiry?: () => void;
}

export default function Rates({ onCustomInquiry }: RatesProps) {
  const { t } = useLanguage();
  const { settings } = useSite();
  const [rates, setRates] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'rates'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setRates(FALLBACK_RATES);
      } else {
        setRates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    }, (error) => {
      console.error("Error fetching rates:", error);
      setRates(FALLBACK_RATES);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="rates" className="py-20 bg-[var(--color-hotstar-bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-4">{settings.ratesSectionLabel}</h2>
            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{settings.ratesSubtitle}</h3>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#101c2b] rounded-[2rem] shadow-2xl overflow-hidden border border-white/5">
            <div className="bg-[#1a2c3d] p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 p-2.5 rounded-xl">
                  <Car className="h-5 w-5 text-black" />
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight">Route Pricing</h4>
              </div>
              <div className="flex space-x-4">
                <span className="flex items-center text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Sedan
                </span>
                <span className="flex items-center text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                  SUV
                </span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {rates.map((rate, index) => (
                <motion.div
                  key={rate.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center mr-4 group-hover:bg-yellow-400 transition-colors">
                      <MapPin className="h-4 w-4 text-yellow-400 group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-base font-black text-white uppercase tracking-tight">{rate.route}</span>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end md:space-x-10">
                    <div className="text-right">
                      <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{settings.labelSedan}</div>
                      <div className="text-lg font-black text-white tracking-tight">{rate.sedan}</div>
                    </div>
                    <div className="w-px h-8 bg-white/5 hidden md:block"></div>
                    <div className="text-right">
                      <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{settings.labelSuv}</div>
                      <div className="text-lg font-black text-yellow-400 tracking-tight">{rate.suv}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-yellow-400 p-6 text-center">
              <p className="text-black font-black text-[9px] mb-4 uppercase tracking-widest opacity-70">
                * Rates are estimates. Tolls & Parking Extra.
              </p>
              <button 
                onClick={onCustomInquiry}
                className="bg-black text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all flex items-center mx-auto group shadow-lg"
              >
                Custom Quote
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
