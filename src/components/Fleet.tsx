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
      const fetchedVehicles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      setVehicles(fetchedVehicles);
    }, (error) => {
      console.error("Error fetching fleet:", error);
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
    <section id="fleet" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="h-[2px] w-8 bg-yellow-400"></div>
              <span className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">{settings.fleetSectionLabel}</span>
              <div className="h-[2px] w-8 bg-yellow-400"></div>
            </div>
            <h3 className="text-5xl font-black text-gray-900 mb-8 tracking-tighter font-display">{settings.fleetSubtitle}</h3>
          </motion.div>

          {/* Filter Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === cat 
                    ? 'bg-black text-white shadow-2xl scale-105 border-transparent' 
                    : 'bg-white text-gray-400 hover:text-black border border-gray-100 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => handleVehicleClick(vehicle.id, vehicle.name)}
                className="bg-[#fafafa] rounded-[2.5rem] overflow-hidden hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 flex flex-col h-full group cursor-pointer"
              >
                <div className="h-64 overflow-hidden relative group">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Enhanced Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="h-[1px] w-8 bg-yellow-400"></div>
                        <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.3em]">Full Details</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-4 bg-white/10 backdrop-blur-md border border-white/20 w-fit px-4 py-2 rounded-xl text-white">
                        <Users className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-[11px] font-black uppercase tracking-widest">{vehicle.capacity} Capacity</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {vehicle.features.map((feature, i) => (
                          <div key={i} className="flex items-center text-[9px] font-black uppercase tracking-widest text-white/90">
                            <Check className="h-2.5 w-2.5 mr-2 text-yellow-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-6 left-6 flex gap-2 pointer-events-none group-hover:opacity-0 transition-all duration-300 translate-y-0 group-hover:-translate-y-4">
                    <span className="bg-black/90 backdrop-blur-xl px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-white border border-white/10">
                      {vehicle.type}
                    </span>
                    {vehicle.isPremium && (
                      <span className="bg-yellow-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-black border border-white shadow-lg">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <h4 className="text-xl font-black text-gray-900 mb-4 font-display group-hover:text-yellow-600 transition-colors">{vehicle.name}</h4>
                  
                  <div className="flex items-center text-[10px] text-gray-400 mb-6 font-black uppercase tracking-[0.2em]">
                    <Users className="h-3.5 w-3.5 mr-2 text-yellow-500" />
                    {vehicle.capacity} Maximum
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {vehicle.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center text-xs text-gray-500 font-medium">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-gray-200 mt-auto flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{settings.labelPerDay}</div>
                      <div className="text-2xl font-black text-black group-hover:text-yellow-600 transition-colors">{vehicle.pricePerDay}</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVehicleClick(vehicle.id, vehicle.name);
                      }}
                      className="bg-white text-black p-4 rounded-2xl border border-gray-100 hover:bg-yellow-400 hover:border-yellow-400 transition-all shadow-sm active:scale-95 group-hover:shadow-xl group-hover:shadow-yellow-400/20"
                    >
                      <ArrowRight className="h-5 w-5" />
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
