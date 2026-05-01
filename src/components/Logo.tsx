import React from 'react';
import { useSite } from '@/context/SiteContext';
import { motion } from 'motion/react';
import { Car } from 'lucide-react';

interface LogoProps {
  scrolled?: boolean;
  className?: string;
}

export default function Logo({ scrolled, className = "" }: LogoProps) {
  const { settings } = useSite();
  return (
    <div className={`flex items-center space-x-4 group cursor-pointer ${className}`}>
      <div className="relative perspective-1000">
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="relative w-14 h-14 preserve-3d"
        >
          <div className="absolute inset-0 backface-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-3 rounded-2xl bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] transform preserve-3d">
                      <Car className="h-8 w-8 text-black" />
                      <div className="absolute inset-0 border-2 border-black/10 rounded-2xl"></div>
                    </div>
          </div>
          {/* Back side of the card to make it look full 3D when revolving */}
          <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] opacity-60">
             <div className="absolute inset-0 flex items-center justify-center p-3 rounded-2xl bg-yellow-500 shadow-xl transform preserve-3d">
                <Car className="h-8 w-8 text-black opacity-20" />
             </div>
          </div>
        </motion.div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`text-2xl font-black tracking-tighter leading-none transition-colors duration-300 font-display ${scrolled ? 'text-black dark:text-white' : 'text-white'}`}>
            {settings.logoLine1 || 'JK'}<span className="text-yellow-400 font-black">{settings.logoLine2 || 'CABS'}</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 mt-0.5">
          <div className="h-[1.5px] w-4 bg-yellow-400"></div>
          <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-300 font-sans ${scrolled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-300'} opacity-100`}>
            {settings.logoTagline || 'Kashmir Premium Service'}
          </span>
        </div>
      </div>
    </div>
  );
}
