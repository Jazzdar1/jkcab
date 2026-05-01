import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Calendar, 
  Settings, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Car, 
  Users, 
  MoreVertical,
  Filter,
  Search,
  Loader2,
  Phone,
  User as UserIcon,
  LogOut,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firebaseUtils';

export default function Dashboard() {
  const { user, profile, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bookings' | 'admin'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!user && !isAdmin) return;

    let q;
    const bookingsPath = 'bookings';
    if (isAdmin && activeTab === 'admin') {
      q = query(collection(db, bookingsPath), orderBy('createdAt', 'desc'));
    } else if (user) {
      q = query(
        collection(db, bookingsPath), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
    } else {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, bookingsPath);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, isAdmin, activeTab]);

  const updateStatus = async (bookingId: string, status: string) => {
    const path = `bookings/${bookingId}`;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!window.confirm('Delete this booking forever?')) return;
    const path = `bookings/${bookingId}`;
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (b.customerName || '').toLowerCase().includes(searchLower) ||
      (b.pickup || '').toLowerCase().includes(searchLower) ||
      (b.dropoff || '').toLowerCase().includes(searchLower) ||
      (b.customerPhone || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (!loading && !user && !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-[var(--color-hotstar-bg)]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {t('dashboard.cp')}
            </span>
            {isAdmin && activeTab === 'admin' && (
              <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full animate-pulse font-sans">
                Live Admin Mode
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight font-display tracking-tighter">
            {t('dashboard.welcome')}, <br/>
            <span className="text-yellow-400 font-black">{profile?.name?.split(' ')[0] || user.displayName?.split(' ')[0]}</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {isAdmin && (
            <div className="bg-white/5 p-1.5 rounded-[2rem] flex border border-white/5 backdrop-blur-sm relative">
              <motion.div
                layoutId="activeTab"
                className="absolute bg-white/10 rounded-[1.5rem] shadow-xl border border-white/10"
                initial={false}
                animate={{
                  x: activeTab === 'bookings' ? 0 : '100%',
                  width: 'calc(50% - 6px)'
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                style={{ top: 6, bottom: 6, left: 6 }}
              />
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`relative z-10 px-8 py-3 rounded-[1.5rem] text-xs uppercase tracking-widest font-black transition-all ${activeTab === 'bookings' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {t('dashboard.myTrips')}
              </button>
              <button 
                onClick={() => setActiveTab('admin')}
                className={`relative z-10 px-8 py-3 rounded-[1.5rem] text-xs uppercase tracking-widest font-black transition-all ${activeTab === 'admin' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {t('dashboard.adminPanel')}
              </button>
            </div>
          )}
          <button 
            onClick={() => navigate('/admin')}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all group shadow-sm active:scale-90"
            title="Admin Settings"
          >
            <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform" />
          </button>
          <button 
            onClick={() => logout()}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all group shadow-sm active:scale-90"
            title="Sign Out"
          >
            <LogOut className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#101c2b] p-6 rounded-[2rem] border border-white/5 shadow-xl">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('dashboard.all')}</p>
           <div className="text-3xl font-black text-white font-display tracking-tight">{stats.total}</div>
        </div>
        <div className="bg-[#101c2b] p-6 rounded-[2rem] border border-white/5 shadow-xl border-l-4 border-l-yellow-400">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('dashboard.pending')}</p>
           <div className="text-3xl font-black text-yellow-400 font-display tracking-tight">{stats.pending}</div>
        </div>
        <div className="bg-[#101c2b] p-6 rounded-[2rem] border border-white/5 shadow-xl border-l-4 border-l-green-400">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('dashboard.confirmed')}</p>
           <div className="text-3xl font-black text-green-400 font-display tracking-tight">{stats.confirmed}</div>
        </div>
        <div className="bg-[#101c2b] p-6 rounded-[2rem] border border-white/5 shadow-xl border-l-4 border-l-red-400">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('dashboard.cancelled')}</p>
           <div className="text-3xl font-black text-red-500 font-display tracking-tight">{stats.cancelled}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 space-y-6">
          <div className="bg-[#101c2b] rounded-[2.5rem] p-8 border border-white/5 shadow-xl sticky top-28">
             <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-yellow-400" /> {t('dashboard.filterBy')}
             </h4>
             
             <div className="space-y-3">
                {[
                  { id: 'all', label: t('dashboard.all'), color: 'bg-white' },
                  { id: 'pending', label: t('dashboard.pending'), color: 'bg-yellow-400' },
                  { id: 'confirmed', label: t('dashboard.confirmed'), color: 'bg-green-500' },
                  { id: 'cancelled', label: t('dashboard.cancelled'), color: 'bg-red-500' }
                ].map(status => (
                  <button
                    key={status.id}
                    onClick={() => setStatusFilter(status.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                      statusFilter === status.id 
                        ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/20 scale-[1.02]' 
                        : 'hover:bg-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    <span>{status.label}</span>
                    <div className={`w-2 h-2 rounded-full ${status.color} transition-transform group-hover:scale-125`}></div>
                  </button>
                ))}
             </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="relative mb-8">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-600" />
             <input 
               type="text"
               placeholder={t('dashboard.searchPlaceholder')}
               className="w-full pl-16 pr-6 py-6 bg-[#101c2b] border border-white/5 rounded-[2rem] outline-none focus:ring-4 focus:ring-yellow-400/10 transition-all text-sm font-black uppercase tracking-widest text-white shadow-xl"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                   <div className="w-16 h-16 border-4 border-yellow-400/10 border-t-yellow-400 rounded-full animate-spin"></div>
                   <Loader2 className="h-6 w-6 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">{t('dashboard.fetching')}</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-[#101c2b] border-2 border-dashed border-white/5 rounded-[3rem] py-24 text-center">
                 <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                    <History className="h-10 w-10 text-gray-500 opacity-20" />
                 </div>
                 <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{t('dashboard.noBookings')}</h3>
                 <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{t('dashboard.historyEmpty')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 pb-20">
                <AnimatePresence mode="popLayout">
                {filteredBookings.map((booking) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={booking.id}
                    className="bg-[#101c2b] rounded-[2.5rem] p-8 border border-white/5 shadow-xl hover:border-yellow-400/20 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:bg-yellow-400/5 transition-colors"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg ${
                            booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                            booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                            'bg-yellow-400 text-black'
                          }`}>
                            {booking.status === 'pending' ? t('dashboard.pending') : 
                             booking.status === 'confirmed' ? t('dashboard.confirmed') : 
                             t('dashboard.cancelled')}
                          </span>
                          <span className="px-4 py-1.5 bg-white/5 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center border border-white/5">
                            <Clock className="h-3 w-3 mr-1.5 text-yellow-400" />
                            {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : t('dashboard.recent')}
                          </span>
                          <span className="px-4 py-1.5 bg-white/5 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5">
                            ID: {booking.id.slice(0, 8)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <div className="flex items-start space-x-4">
                               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-black transition-colors border border-white/5">
                                  <MapPin className="h-5 w-5 text-yellow-400 group-hover:text-black" />
                               </div>
                               <div>
                                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Trip Vector</p>
                                 <h4 className="text-base font-black text-white leading-tight uppercase tracking-tight">
                                   {booking.pickup} <ChevronRight className="inline h-4 w-4 text-gray-600 mx-1" /> {booking.dropoff}
                                 </h4>
                               </div>
                             </div>

                             <div className="flex items-start space-x-4">
                               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-black transition-colors border border-white/5">
                                  <Car className="h-5 w-5 text-yellow-400 group-hover:text-black" />
                               </div>
                               <div>
                                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 leading-none">Vehicle Specifics</p>
                                 <h4 className="text-base font-black text-white uppercase tracking-tight">
                                   {booking.vehicle} • {booking.passengers} PAX
                                 </h4>
                               </div>
                             </div>
                          </div>

                          <div className="p-6 bg-black/20 rounded-[2rem] border border-white/5 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-xl bg-white/5 shadow-sm flex items-center justify-center border border-white/5">
                                     <UserIcon className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                     <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Manifest Contact</p>
                                     <p className="text-xs font-black text-white uppercase">{booking.customerName}</p>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-xl bg-white/5 shadow-sm flex items-center justify-center border border-white/5">
                                     <Phone className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                     <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Digit Link</p>
                                     <p className="text-xs font-black text-white uppercase">{booking.customerPhone}</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center gap-3 self-end md:self-start">
                         {isAdmin && activeTab === 'admin' ? (
                           <div className="flex flex-col gap-2 w-full min-w-[140px]">
                             <button
                               onClick={() => updateStatus(booking.id, 'confirmed')}
                               disabled={booking.status === 'confirmed'}
                               className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
                                 booking.status === 'confirmed' 
                                   ? 'bg-white/5 text-gray-500 shadow-none border border-white/5' 
                                   : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20 active:scale-95'
                               }`}
                             >
                               {t('dashboard.confirmed')}
                             </button>
                             <button
                               onClick={() => updateStatus(booking.id, 'cancelled')}
                               disabled={booking.status === 'cancelled'}
                               className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                 booking.status === 'cancelled' 
                                   ? 'bg-white/5 text-gray-500 border border-white/5' 
                                   : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-95 border border-red-500/20'
                               }`}
                             >
                               {t('dashboard.cancelled')}
                             </button>
                             <button
                               onClick={() => deleteBooking(booking.id)}
                               className="w-full py-2 text-[9px] font-black text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors mt-2"
                             >
                               Purge Entry
                             </button>
                           </div>
                         ) : (
                           <div className="flex flex-row md:flex-col gap-2">
                             <button 
                               onClick={() => {
                                 const message = `Hello JK CABS, I need help with my booking. \n\nBooking ID: ${booking.id}\nCustomer: ${booking.customerName}\nRoute: ${booking.pickup} to ${booking.dropoff}`;
                                 window.open(`https://wa.me/917006268328?text=${encodeURIComponent(message)}`, '_blank');
                               }}
                               className="px-8 py-4 bg-yellow-400 text-black rounded-2xl text-xs font-black uppercase tracking-widest flex items-center hover:bg-white transition-all shadow-xl shadow-yellow-400/20 active:scale-95"
                             >
                               <Phone className="h-4 w-4 mr-3" />
                               {t('dashboard.support')}
                             </button>
                             {booking.status === 'pending' && (
                               <button 
                                 onClick={() => updateStatus(booking.id, 'cancelled')}
                                 className="px-8 py-4 bg-white/5 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center hover:bg-white transition-all active:scale-95 border border-white/5"
                               >
                                 <XCircle className="h-4 w-4 mr-3" />
                                 Abort Trip
                               </button>
                             )}
                           </div>
                         )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

