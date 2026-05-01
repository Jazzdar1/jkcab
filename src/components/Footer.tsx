import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Car, Mountain } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0a0a0a] pt-32 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-[120px]"></div>
      
      {/* Animated Vehicle Section */}
      <div className="absolute top-0 left-0 w-full h-16 pointer-events-none overflow-hidden z-20 flex items-center">
        <div className="w-full animate-drive flex items-center pl-4">
            <div className="flex items-center space-x-2 bg-yellow-400 px-4 py-1.5 rounded-full scale-75 md:scale-90 shadow-[0_0_30px_rgba(250,204,21,0.5)] border-2 border-white">
               <Car className="h-4 w-4 text-black" />
               <span className="text-[9px] font-black text-black uppercase tracking-widest whitespace-nowrap">J&K CABS - Est. 2010</span>
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
              {['Home', 'Our Fleet', 'Rates', 'Tour Packages', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '')}`} className="text-gray-500 text-sm hover:text-yellow-400 transition-all font-bold uppercase tracking-widest flex items-center group">
                    <span className="w-0 group-hover:w-4 h-[2px] bg-yellow-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    {item}
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
                   <p className="text-sm text-gray-300 font-bold leading-relaxed">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">24/7 Helpline</p>
                   <p className="text-lg text-white font-black tracking-tighter">{CONTACT_INFO.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Email Support</p>
                   <p className="text-sm text-gray-300 font-bold">{CONTACT_INFO.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] gap-8">
          <div className="flex items-center space-x-4">
             <span>© 2026 J&K CABS.</span>
             <span className="text-gray-800">|</span>
             <span>Crafted in Srinagar</span>
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
