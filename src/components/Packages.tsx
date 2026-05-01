import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { TOUR_PACKAGES } from '../constants';

export default function Packages() {
  const gridCols = TOUR_PACKAGES.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";

  return (
    <section id="packages" className="py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-[2px] w-12 bg-yellow-400"></div>
              <span className="text-yellow-600 text-xs font-black uppercase tracking-[0.4em] font-sans">Sample Itineraries</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter font-display">Curated Kashmir <span className="text-yellow-400 underline decoration-black/5 flex-shrink-0">Journeys</span></h3>
            <p className="text-gray-500 font-medium max-w-xl text-lg leading-relaxed">Hand-picked experiences designed for comfort, discovery, and unforgettable memories in the heart of the Himalayas.</p>
          </motion.div>
        </div>

        <div className={`grid grid-cols-1 ${gridCols} gap-12`}>
          {TOUR_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-[3rem] overflow-hidden hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4 flex flex-col h-full border border-gray-100/50"
            >
              <div className="h-72 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-8 left-8 z-20 bg-yellow-400 text-black px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border-2 border-white shadow-xl">
                  Best Seller
                </div>
                <div className="absolute bottom-8 left-8 z-20">
                    <div className="flex items-center text-white text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/20">
                        <Clock className="h-3.5 w-3.5 mr-2 text-yellow-400" />
                        {pkg.duration}
                    </div>
                </div>
              </div>

              <div className="p-10 flex-grow flex flex-col">
                <h4 className="text-2xl font-black text-gray-900 mb-6 leading-tight font-display group-hover:text-yellow-600 transition-colors">
                  {pkg.title}
                </h4>
                
                <p className="text-sm text-gray-500 mb-8 font-medium line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                  {pkg.destinations.slice(0, 3).map((dest, i) => (
                    <div key={i} className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest transition-colors group-hover:text-gray-600">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-4 shadow-[0_0_8px_rgba(250,204,21,0.5)]"></div>
                      {dest}
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Package Starts At</div>
                        <div className="text-2xl font-black text-black">
                             {pkg.price.split('from ')[1]}
                        </div>
                    </div>
                    <button className="w-12 h-12 rounded-[1.25rem] bg-gray-50 group-hover:bg-yellow-400 flex items-center justify-center transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-yellow-400/20 active:scale-90 border border-gray-100 group-hover:border-white">
                        <ArrowRight className="h-6 w-6 text-black" />
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
