import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Car, Mountain, ArrowLeft } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';
import Logo from './Logo';
import { useSite } from '@/context/SiteContext';

export default function Footer() {
  const { settings } = useSite();
  return (
    <footer id="contact" className="relative bg-[#030b17] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-[120px] -z-10"></div>
      
      {/* Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Logo scrolled={true} />
            <p className="text-gray-500 text-sm font-bold leading-relaxed max-w-xs lowercase first-letter:uppercase opacity-70">
              Premium cab service in Jammu & Kashmir. Experience the valley with professional standards and local warmth.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:bg-yellow-400 hover:text-black transition-all border border-white/5 group shadow-xl"
                >
                  <Icon className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: settings.navHome, id: '' },
                { name: settings.navFleet, id: 'fleet' },
                { name: settings.navRates, id: 'rates' },
                { name: settings.navPackages, id: 'tourpackages' }
              ].map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="text-gray-500 hover:text-yellow-400 text-xs font-black uppercase tracking-wider transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Destinations</h4>
            <ul className="space-y-4">
              {['Srinagar Local', 'Gulmarg Trip', 'Pahalgam Trip', 'Sonamarg Day', 'Airport Trans'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-yellow-400 text-xs font-black uppercase tracking-wider transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#101c2b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-yellow-400/10 transition-all"></div>
              <div className="relative space-y-6">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-4">Contact Support</h4>
                
                <a href={`tel:${settings.contactPhone}`} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all border border-white/5 group/link">
                  <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center group-hover/link:bg-black/10 transition-colors">
                    <Phone className="h-5 w-5 text-yellow-400 group-hover/link:text-black" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest opacity-50">24/7 Helpline</div>
                    <div className="text-sm font-black tracking-tight">{settings.contactPhone}</div>
                  </div>
                </a>

                <a href={`mailto:${settings.contactEmail}`} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all border border-white/5 group/link">
                  <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center group-hover/link:bg-black/10 transition-colors">
                    <Mail className="h-5 w-5 text-yellow-400 group-hover/link:text-black" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest opacity-50">Email Support</div>
                    <div className="text-sm font-black tracking-tight">{settings.contactEmail}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-gray-600 text-[9px] font-black uppercase tracking-[0.3em] text-center md:text-left">
            © {new Date().getFullYear()} {settings.businessName}. {settings.footerText}
          </div>
          
          <div className="flex items-center space-x-12">
            <a href="#" className="text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-[0.3em] transition-colors">Privacy Policy</a>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group hover:bg-yellow-400 transition-all border border-white/5"
            >
              <ArrowLeft className="h-4 w-4 text-yellow-400 group-hover:text-black rotate-90" />
            </button>
          </div>

          {/* Animated Car */}
          <div className="relative hidden md:block w-32 h-8 overflow-hidden opacity-10">
             <Car className="h-5 w-5 text-yellow-400 animate-drive absolute bottom-0" />
          </div>
        </div>
      </div>
    </footer>
  );
}
