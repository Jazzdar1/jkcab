import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center group"
    >
      <div className="max-w-0 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">
        <span className="pr-3 font-bold text-sm">Chat on WhatsApp</span>
      </div>
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
