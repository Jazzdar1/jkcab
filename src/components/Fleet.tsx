import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, LayoutGrid, ListFilter, Users, ArrowRight } from 'lucide-react';
import { VEHICLES as FALLBACK_VEHICLES } from '@/constants';
import { Vehicle } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useSite } from '@/context/SiteContext';

interface FleetProps {
  onVehicleSelect?: (vehicleId: string, vehicleName: string) => void;
  onBulkInquiry?: () => void;
}

export default function Fleet({ onVehicleSelect, onBulkInquiry }: FleetProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState<Vehicle['type'] | 'All'>('All');
  const { t } = useLanguage();
  const { settings } = useSite();

  useEffect(() => {
    const q = query(collection(db, 'fleet'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setVehicles(FALLBACK_VEHICLES);
      } else {
        const fetchedVehicles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        setVehicles(fetchedVehicles);
      }
    }, (error) => {
      console.error("Error fetching fleet:", error);
      setVehicles(FALLBACK_VEHICLES);
    });

    return () => unsubscribe();
  }, []);

  const handleVehicleClick = (id: string, name: string) => {
    if (onVehicleSelect) {
      onVehicleSelect(id, name);
    }
  };

  const filteredVehicles = filter === 'All' 
    ? vehicles 
    : vehicles.filter(v => v.type === filter);

  const categories: (Vehicle['type'] | 'All')[] = ['All', 'Sedan', 'SUV', 'Luxury', 'Large Group'];

  return (
    <section id="fleet" className="py-20 bg-[var(--color-hotstar-bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-[1px] w-6 bg-yellow-400"></div>
              <span className="text-yellow-400 text-[9px] font-black uppercase tracking-[0.4em] font-sans">{settings.fleetSectionLabel}</span>
              <div className="h-[1px] w-6 bg-yellow-400"></div>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter font-display uppercase">{settings.fleetSubtitle}</h3>
          </motion.div>

          {/* Filter Controls */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === cat 
                    ? 'bg-yellow-400 text-black shadow-xl scale-105' 
                    : 'bg-white/5 text-gray-500 hover:text-white border border-white/5 hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onClick={() => handleVehicleClick(vehicle.id, vehicle.name)}
                className="bg-[#101c2b] rounded-3xl overflow-hidden hover:border-yellow-400/30 transition-all duration-300 border border-white/5 flex flex-col h-full group cursor-pointer shadow-xl"
              >
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider text-white">
                      {vehicle.type}
                    </span>
                    {vehicle.isPremium && (
                      <span className="bg-yellow-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider text-black">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h4 className="text-lg font-black text-white mb-2 tracking-tight">{vehicle.name}</h4>
                  
                  <div className="flex items-center text-[9px] text-gray-400 mb-4 font-black uppercase tracking-widest">
                    <Users className="h-3 w-3 mr-2 text-yellow-400" />
                    {vehicle.capacity} Max
                  </div>

                  <div className="space-y-2 mb-6 flex-grow">
                    {vehicle.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                        <div className="w-1 h-1 bg-green-500 rounded-full mr-2 opacity-60"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-auto flex justify-between items-center">
                    <div>
                      <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{settings.labelPerDay}</div>
                      <div className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors tracking-tight">{vehicle.pricePerDay}</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVehicleClick(vehicle.id, vehicle.name);
                      }}
                      className="bg-white/5 text-white p-3 rounded-xl hover:bg-yellow-400 hover:text-black transition-all"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-20 bg-black rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h5 className="text-2xl font-bold text-white mb-2">{settings.customFleetTitle}</h5>
            <p className="text-gray-400 font-medium max-w-xl">
              {settings.customFleetDesc}
            </p>
          </div>
          <button 
            onClick={onBulkInquiry}
            className="mt-8 md:mt-0 bg-yellow-400 text-black px-10 py-4 rounded-2xl font-bold hover:bg-white transition-all whitespace-nowrap shadow-xl relative z-10"
          >
            {settings.customFleetButton}
          </button>
        </div>
      </div>
    </section>
  );
}
