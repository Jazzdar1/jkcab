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
      setRates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Error fetching rates:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="rates" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-black text-yellow-600 uppercase tracking-[0.2em] mb-4">{settings.ratesSectionLabel}</h2>
            <h3 className="text-4xl font-black text-gray-900 mb-6">{settings.ratesSubtitle}</h3>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-black p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400 p-3 rounded-2xl">
                  <Car className="h-6 w-6 text-black" />
                </div>
                <h4 className="text-xl font-bold text-white">Route Pricing (Standard)</h4>
              </div>
              <div className="flex space-x-4">
                <span className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  Sedan
                </span>
                <span className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                  SUV
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {rates.map((rate, index) => (
                <motion.div
                  key={rate.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-6 group-hover:bg-yellow-400 transition-colors">
                      <MapPin className="h-5 w-5 text-yellow-600 group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{rate.route}</span>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end md:space-x-12">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{settings.labelSedan}</div>
                      <div className="text-xl font-black text-black">{rate.sedan}</div>
                    </div>
                    <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{settings.labelSuv}</div>
                      <div className="text-xl font-black text-yellow-600">{rate.suv}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-yellow-400 p-8 text-center">
              <p className="text-black font-bold text-sm mb-4">
                * Prices are subject to change during peak season. All tolls and parking extra as applicable.
              </p>
              <button 
                onClick={onCustomInquiry}
                className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-xl flex items-center mx-auto group"
              >
                Check Custom Route Price
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
