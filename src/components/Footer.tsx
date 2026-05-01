import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Car, Mountain } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import Logo from './Logo';
import { useSite } from '../context/SiteContext';

export default function Footer() {
  const { settings } = useSite();
  return (
    <footer id="contact" className="bg-[#0a0a0a] pt-32 pb-16 relative overflow-hidden z-0">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-[120px] -z-10"></div>
      
      {/* Animated Vehicle Section */}
      <div className="h-24 w-full pointer-events-none overflow-hidden flex items-center mb-8">
        <div className="animate-drive flex items-center">
            <div className="flex items-center space-x-3 bg-yellow-400 px-6 py-2.5 rounded-full shadow-[0_0_50px_rgba(250,204,21,0.6)] border-2 border-white transform scale-110 md:scale-125">
               <Car className="h-5 w-5 text-black" />
               <div className="flex flex-col leading-none">
                 <span className="text-[10px] font-black text-black uppercase tracking-widest whitespace-nowrap">J&K CABS</span>
                 <span className="text-[7px] font-bold text-black/60 uppercase tracking-tighter">Premium Service</span>
               </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-4">
            <Logo scrolled={false} className="mb-10" />
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm font-medium opacity-80">
              Kashmir's most trusted premium travel partner. We specialize in luxury fleet services, curated tour packages, and professional airport transfers across the paradise valley.
            </p>
            <div className="flex space-x-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <span key={i} className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl text-gray-400 hover:text-yellow-400 hover:bg-white/10 transition-all cursor-pointer group shadow-2xl">
                  <Icon className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10">Quick Links</h4>
            <ul className="space-y-6">
              {[
                { name: settings.navHome, id: '' },
                { name: settings.navFleet, id: 'fleet' },
                { name: settings.navRates, id: 'rates' },
                { name: settings.navPackages, id: 'tourpackages' },
                { name: settings.navContact, id: 'contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={`#${item.id}`} className="text-gray-500 text-sm hover:text-yellow-400 transition-all font-bold uppercase tracking-widest flex items-center group">
                    <span className="w-0 group-hover:w-4 h-[2px] bg-yellow-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10">Destinations</h4>
            <ul className="space-y-6">
              {['Srinagar Local', 'Gulmarg Trip', 'Pahalgam Trip', 'Sonamarg Day', 'Airport Trans'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 text-sm hover:text-yellow-400 transition-all font-bold uppercase tracking-widest flex items-center group">
                    <span className="w-0 group-hover:w-4 h-[2px] bg-yellow-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:ml-auto">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10">Inquiry & Support</h4>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-yellow-400/20 transition-all"></div>
              
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Office Address</p>
                   <p className="text-sm text-gray-300 font-bold leading-relaxed">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">24/7 Helpline</p>
                   <p className="text-lg text-white font-black tracking-tighter">{settings.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Email Support</p>
                   <p className="text-sm text-gray-300 font-bold">{settings.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] gap-8">
          <div className="flex items-center space-x-4">
             <span>{settings.footerText}</span>
          </div>
          <div className="flex space-x-12">
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Safety Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
