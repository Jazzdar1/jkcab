import React from 'react';
import { Car, Mountain } from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface LogoProps {
  scrolled?: boolean;
  className?: string;
}

export default function Logo({ scrolled, className = "" }: LogoProps) {
  const { settings } = useSite();
  return (
    <div className={`flex items-center space-x-3 group cursor-pointer ${className}`}>
      <div className="relative">
        <div className={`p-2.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl flex items-center justify-center border-2 border-white overflow-hidden ${scrolled ? 'bg-black shadow-black/20' : 'bg-yellow-400 shadow-yellow-400/30'}`}>
          <Car className={`h-6 w-6 transition-all group-hover:scale-110 relative z-10 ${scrolled ? 'text-yellow-400' : 'text-black'}`} />
          <Mountain className="absolute -bottom-2 -left-1 h-8 w-8 text-black/5 opacity-40 -rotate-12" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse shadow-sm shadow-green-500/20 z-20"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`text-2xl font-black tracking-tighter leading-none transition-colors duration-300 font-display ${scrolled ? 'text-black dark:text-white' : 'text-white'}`}>
            {settings.logoLine1}<span className="text-yellow-400 font-black">{settings.logoLine2}</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 mt-0.5">
          <div className="h-[1.5px] w-4 bg-yellow-400"></div>
          <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-300 font-sans ${scrolled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-300'} opacity-100`}>
            {settings.logoTagline}
          </span>
        </div>
      </div>
    </div>
  );
}
