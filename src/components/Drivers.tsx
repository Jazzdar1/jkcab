import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Languages, Award } from 'lucide-react';
import { DRIVERS } from '../constants';

export default function Drivers() {
  return (
    <section id="drivers" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-yellow-600 uppercase tracking-[0.2em] mb-4">Meet Our Experts</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Local Drivers, Professional Standards</h3>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Our drivers are more than just chauffeurs; they are local enthusiasts who know every shortcut and scenic spot in the valley.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DRIVERS.map((driver, index) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-[2.5rem] p-8 group hover:bg-black hover:shadow-2xl transition-all duration-500 text-center"
            >
              <div className="relative mb-8 inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-yellow-400/30 transition-colors">
                  <img src={driver.image} alt={driver.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-2 rounded-xl shadow-lg flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-xs font-black">{driver.rating}</span>
                </div>
              </div>

              <h4 className="text-xl font-bold text-gray-900 group-hover:text-white mb-1 transition-colors">{driver.name}</h4>
              <p className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-6">{driver.specialty}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center text-sm text-gray-500 group-hover:text-gray-400 font-medium">
                  <Award className="h-4 w-4 mr-3 text-yellow-400" />
                  Experience: {driver.experience}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-500 group-hover:text-gray-400 font-medium">
                  <Languages className="h-4 w-4 mr-3 text-yellow-400" />
                  {driver.languages.join(', ')}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 group-hover:border-white/10 transition-colors">
                 <div className="inline-flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-yellow-400 transition-colors">
                    <ShieldCheck className="h-3 w-3 mr-2" />
                    Verified Expert
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-start">
                <div className="bg-yellow-400/10 p-3 rounded-2xl mr-6">
                    <ShieldCheck className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                    <h6 className="font-bold text-gray-900 mb-2">Police Verified</h6>
                    <p className="text-sm text-gray-500 leading-relaxed">Every driver undergoes a rigorous background check and regular training.</p>
                </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-start">
                <div className="bg-yellow-400/10 p-3 rounded-2xl mr-6">
                    <Languages className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                    <h6 className="font-bold text-gray-900 mb-2">Multilingual</h6>
                    <p className="text-sm text-gray-500 leading-relaxed">Our drivers are fluent in Hindi & English to communicate complex requirements.</p>
                </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-start">
                <div className="bg-yellow-400/10 p-3 rounded-2xl mr-6">
                    <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                    <h6 className="font-bold text-gray-900 mb-2">First Aid Trained</h6>
                    <p className="text-sm text-gray-500 leading-relaxed">Basic medical assistance training for high altitude journeys.</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
