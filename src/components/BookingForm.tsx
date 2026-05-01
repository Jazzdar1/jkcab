import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Car, 
  ChevronRight, 
  User, 
  Phone, 
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ShieldCheck,
  MessageSquare,
  AtSign
} from 'lucide-react';
import { VEHICLES, CONTACT_INFO } from '../constants';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { useSite } from '../context/SiteContext';

declare global {
  interface Window {
    puter: any;
  }
}

interface BookingFormProps {
  initialData?: Partial<typeof initialFormState>;
  onSuccess?: () => void;
}

const initialFormState = {
  pickup: '',
  dropoff: '',
  date: '',
  passengers: '1',
  vehicles: [VEHICLES[0].name] as string[],
  features: [] as string[],
  name: '',
  phone: '',
  email: '',
  isBulk: false,
  isCustom: false,
  contactViaWhatsApp: true,
  contactViaEmail: true,
};

export default function BookingForm({ initialData, onSuccess }: BookingFormProps) {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const { settings } = useSite();
  const [step, setStep] = useState<'booking' | 'details' | 'confirmation' | 'success'>('booking');
  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    ...initialData,
    vehicles: initialData?.vehicles || initialFormState.vehicles
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  useEffect(() => {
    if (initialData?.vehicles) {
      setFormData(prev => ({ ...prev, vehicles: initialData.vehicles! }));
    }
    if (initialData?.isBulk !== undefined) {
      setFormData(prev => ({ ...prev, isBulk: initialData.isBulk! }));
    }
    if ((initialData as any)?.isCustom !== undefined) {
      setFormData(prev => ({ ...prev, isCustom: (initialData as any).isCustom }));
    }
    if ((initialData as any)?.serviceType === 'package') {
      const pkgName = (initialData as any).packageName;
      setFormData(prev => ({ 
        ...prev, 
        pickup: prev.pickup || 'Srinagar', 
        dropoff: prev.dropoff || pkgName,
        features: [...prev.features, 'Tour Package'] 
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || profile.name || '',
        phone: prev.phone || profile.phone || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user, profile]);

  const validateBooking = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.pickup.trim()) newErrors.pickup = 'Required';
    if (!formData.dropoff.trim()) newErrors.dropoff = 'Required';
    if (!formData.date) newErrors.date = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid number';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'booking' && validateBooking()) {
      setStep('details');
    } else if (step === 'details' && validateDetails()) {
      setStep('confirmation');
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const timestamp = new Date();
      const generatedId = `JK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setBookingRef(generatedId);

      const bookingData = {
        bookingId: generatedId,
        userId: user?.uid || 'guest',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        date: formData.date,
        passengers: parseInt(formData.passengers) || 1,
        vehicle: formData.vehicles.join(', '),
        features: formData.features,
        status: 'pending',
        isCustom: formData.isCustom || false,
        contactPreferences: {
          whatsapp: formData.contactViaWhatsApp,
          email: formData.contactViaEmail
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const path = 'bookings';
      try {
        await addDoc(collection(db, path), bookingData);
      } catch (error) {
        console.error("Firestore booking error:", error);
        // We try to log it but don't stop the flow if Puter is used
      }

      // 2. Try Puter.js (as requested)
      try {
        if (window.puter) {
          const puterData = {
            ...bookingData,
            createdAt: timestamp.toISOString(),
            updatedAt: timestamp.toISOString(),
          };
          const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await window.puter.kv.set(bookingId, JSON.stringify(puterData));
          console.log("Booking saved to Puter.js KV store");
        } else {
          console.warn("Puter.js SDK not found on window");
        }
      } catch (puterError) {
        console.error("Puter.js storage error:", puterError);
      }

      // Simulate Email Sending
      if (formData.contactViaEmail && formData.email) {
        console.log(`[SIMULATION] Email sent to ${formData.email} for booking confirmation.`);
      }

      const message = `*NEW BOOKING REQUEST - JK CABS*\n\n` +
        `👤 *Customer:* ${formData.name}\n` +
        `📞 *Phone:* ${formData.phone}\n` +
        `📧 *Email:* ${formData.email || 'N/A'}\n` +
        `📍 *From:* ${formData.pickup}\n` +
        `🏁 *To:* ${formData.dropoff}\n` +
        `📅 *Date:* ${formData.date}\n` +
        `👥 *Passengers:* ${formData.passengers}\n` +
        `🚗 *Vehicles:* ${formData.vehicles.join(', ')}\n` +
        `✨ *Features:* ${formData.features.length > 0 ? formData.features.map(f => t(`booking.${f}`)).join(', ') : 'None'}\n\n` +
        `_Requested via website inquiry form._`;

      const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
      
      setStep('success');
      if (onSuccess) onSuccess();
      
      if (formData.contactViaWhatsApp) {
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 3000);
      }

    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-hotstar-surface/90 backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/40 dark:border-white/10 relative overflow-hidden group/form">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover/form:bg-yellow-400/10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-10">
           <div className="w-1.5 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
           <div className="flex flex-col">
             <h3 className="text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-none uppercase tracking-[0.1em]">
               {settings.labelBookingTitle}
             </h3>
             <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest">{settings.labelBookingSubtitle}</p>
           </div>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 'booking' ? (
              <motion.div
                key="booking-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">
                       {t('booking.pickup')}
                    </label>
                    <div className="relative group/input">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Srinagar Airport"
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-white/5 border-2 rounded-2xl focus:ring-0 focus:border-yellow-400 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-bold text-gray-900 dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 ${errors.pickup ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-white/20'}`}
                        value={formData.pickup}
                        onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">
                       {t('booking.dropoff')}
                    </label>
                    <div className="relative group/input">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Gulmarg"
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-white/5 border-2 rounded-2xl focus:ring-0 focus:border-yellow-400 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-bold text-gray-900 dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 ${errors.dropoff ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-white/20'}`}
                        value={formData.dropoff}
                        onChange={(e) => setFormData({...formData, dropoff: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">
                       {t('booking.date')}
                    </label>
                    <div className="relative group/input">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input
                        type="date"
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-white/5 border-2 rounded-2xl focus:ring-0 focus:border-yellow-400 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-bold text-gray-900 dark:text-white outline-none ${errors.date ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-white/20'}`}
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">
                       Pax / Passengers
                    </label>
                    <div className="relative group/input">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-yellow-500 transition-colors" />
                      <select
                        className="w-full pl-12 pr-10 py-4 bg-gray-50/50 dark:bg-white/5 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-yellow-400 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-bold text-gray-900 dark:text-white outline-none appearance-none cursor-pointer hover:border-gray-200 dark:hover:border-white/20"
                        value={formData.passengers}
                        onChange={(e) => setFormData({...formData, passengers: e.target.value})}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, '8+'].map((num) => (
                          <option key={num} value={num}>{num} Passengers</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within/input:text-yellow-500">
                         <ChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">
                       {formData.isBulk ? 'Select Vehicles' : t('booking.vehicle')}
                    </label>
                    <div className="space-y-2">
                       {formData.isBulk ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                            {VEHICLES.map((v) => (
                             <label key={v.id} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                               <input 
                                 type="checkbox"
                                 checked={formData.vehicles.includes(v.name)}
                                 onChange={(e) => {
                                   const newVehicles = e.target.checked 
                                     ? [...formData.vehicles, v.name]
                                     : formData.vehicles.filter(name => name !== v.name);
                                   if (newVehicles.length > 0) {
                                     setFormData({...formData, vehicles: newVehicles});
                                   }
                                 }}
                                 className="w-4 h-4 accent-yellow-400"
                               />
                               <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{v.name}</span>
                             </label>
                           ))}
                         </div>
                       ) : (
                        <div className="relative group/input">
                          <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-yellow-500 transition-colors" />
                          <select
                            className="w-full pl-12 pr-10 py-4 bg-gray-50/50 dark:bg-white/5 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-yellow-400 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-bold text-gray-900 dark:text-white outline-none appearance-none cursor-pointer hover:border-gray-200 dark:hover:border-white/20"
                            value={formData.vehicles?.[0] || VEHICLES[0].name}
                            onChange={(e) => setFormData({...formData, vehicles: [e.target.value]})}
                          >
                            {VEHICLES.map((v) => (
                              <option key={v.id} value={v.name}>{v.name}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within/input:text-yellow-500">
                             <ChevronRight className="h-4 w-4 rotate-90" />
                          </div>
                        </div>
                       )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-yellow-400 hover:text-black py-5 rounded-[1.75rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all transform active:scale-95 group shadow-2xl shadow-black/20"
                >
                  <span>{t('booking.continue')}</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : step === 'details' ? (
              <motion.div
                key="details-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">
                       {t('booking.name')}
                    </label>
                    <div className="relative group/input">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-white/5 border-2 rounded-2xl focus:ring-0 focus:border-yellow-400 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-bold text-gray-900 dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 ${errors.name ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-white/20'}`}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">
                         {t('booking.phone')}
                      </label>
                      <div className="relative group/input">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-yellow-500 transition-colors" />
                        <input
                          type="tel"
                          placeholder="9876543210"
                          className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-white/5 border-2 rounded-2xl focus:ring-0 focus:border-yellow-400 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-bold text-gray-900 dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 ${errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-white/20'}`}
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">
                         {t('booking.email')}
                      </label>
                      <div className="relative group/input">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-yellow-500 transition-colors" />
                        <input
                          type="email"
                          placeholder="john@example.com"
                          className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-white/5 border-2 rounded-2xl focus:ring-0 focus:border-yellow-400 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-bold text-gray-900 dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-white/20'}`}
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('booking')}
                    className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>{settings.labelBookingBack}</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-black text-white hover:bg-yellow-400 hover:text-black py-4 rounded-[1.75rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-3 transition-all transform active:scale-95 group shadow-2xl shadow-black/20"
                  >
                    <span>{t('booking.continue')}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ) : step === 'confirmation' ? (
              <motion.div
                key="confirmation-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gray-50/50 dark:bg-white/5 rounded-[2rem] p-6 space-y-4 border border-gray-100 dark:border-white/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">{t('booking.name')}</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">{t('booking.phone')}</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{formData.phone}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
                    <div>
                      <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">{t('booking.pickup')}</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate block">{formData.pickup}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">{t('booking.dropoff')}</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate block">{formData.dropoff}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                    <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3">{t('booking.vehicle')}</span>
                    <div className="flex flex-wrap gap-2">
                       {(formData.vehicles || []).map((v, i) => (
                         <span key={i} className="px-3 py-1.5 bg-yellow-400 text-black text-[10px] font-black rounded-lg uppercase tracking-wider">
                           {v}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] ml-1">
                      {t('booking.contactPref')}
                   </label>
                   <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, contactViaWhatsApp: !formData.contactViaWhatsApp})}
                        className={`flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all ${
                          formData.contactViaWhatsApp 
                            ? 'border-green-500 bg-green-500/10 text-green-600'
                            : 'border-transparent bg-gray-50 dark:bg-white/5 text-gray-400'
                        }`}
                      >
                         <MessageSquare className="h-4 w-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{t('booking.whatsapp')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, contactViaEmail: !formData.contactViaEmail})}
                        className={`flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all ${
                          formData.contactViaEmail 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                            : 'border-transparent bg-gray-50 dark:bg-white/5 text-gray-400'
                        }`}
                      >
                         <AtSign className="h-4 w-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{t('booking.emailPref')}</span>
                      </button>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>{t('booking.back')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-2 transition-all transform active:scale-95 shadow-xl shadow-yellow-400/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>{settings.labelBookingConfirm}</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                  {settings.labelBookingReview}
                </p>
              </motion.div>
            ) : step === 'success' ? (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-green-100 dark:border-green-500/20 relative">
                   <div className="absolute inset-0 bg-green-400/10 dark:bg-green-400/5 blur-xl rounded-full"></div>
                   <CheckCircle2 className="h-10 w-10 text-green-500 relative z-10" />
                </div>
                
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 font-display tracking-tight leading-tight">{settings.labelSuccessTitle}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto font-medium text-sm">
                  {settings.labelSuccessMsg}
                </p>

                <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-6 mb-8 border border-gray-100 dark:border-white/10 text-left space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200/50 dark:border-white/5">
                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">Booking Ref</span>
                    <span className="text-xs font-black text-yellow-500 uppercase tracking-widest">{bookingRef}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                       <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mt-1">Route</span>
                       <div className="text-right">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{formData.pickup} → {formData.dropoff}</p>
                          <p className="text-[10px] font-medium text-gray-400">{formData.date}</p>
                       </div>
                    </div>

                    <div className="flex items-start justify-between">
                       <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mt-1">Vehicle</span>
                       <div className="flex flex-wrap justify-end gap-1">
                          {formData.vehicles.map((v, i) => (
                            <span key={i} className="text-[9px] font-bold text-gray-700 dark:text-gray-300">
                              {v}{i < formData.vehicles.length - 1 ? ',' : ''}
                            </span>
                          ))}
                       </div>
                    </div>

                    <div className="flex items-start justify-between">
                       <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mt-1">Contact</span>
                       <div className="text-right">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{formData.name}</p>
                          <p className="text-[10px] font-medium text-gray-400">{formData.phone}</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-yellow-400/10 dark:bg-yellow-400/5 rounded-[1.5rem] inline-flex items-center space-x-4 border border-yellow-400/20">
                   <div className="w-6 h-6 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
                   <span className="text-[9px] font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-widest leading-none">{t('booking.whatsappRedirect')}</span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
