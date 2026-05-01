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
import { db, logOut } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firebaseUtils';

export default function Dashboard() {
  const { user, profile, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bookings' | 'admin'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || (!isAdmin && user.email !== 'darajazb@gmail.com'))) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    let q;
    const bookingsPath = 'bookings';
    if (isAdmin && activeTab === 'admin') {
      q = query(collection(db, bookingsPath), orderBy('createdAt', 'desc'));
    } else {
      q = query(
        collection(db, bookingsPath), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
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

  if (!user || (!isAdmin && user.email !== 'darajazb@gmail.com')) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {t('dashboard.cp')}
            </span>
            {isAdmin && activeTab === 'admin' && (
              <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full animate-pulse">
                Live Admin Mode
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            {t('dashboard.welcome')}, <br/>
            <span className="text-yellow-500 font-black">{profile?.name?.split(' ')[0] || user.displayName?.split(' ')[0]}</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {isAdmin && (
            <div className="bg-gray-100/50 p-1.5 rounded-[2rem] flex border border-gray-100 backdrop-blur-sm relative">
              <motion.div
                layoutId="activeTab"
                className="absolute bg-white rounded-[1.5rem] shadow-xl shadow-black/5"
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
                className={`relative z-10 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === 'bookings' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
              >
                {t('dashboard.myTrips')}
              </button>
              <button 
                onClick={() => setActiveTab('admin')}
                className={`relative z-10 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === 'admin' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
              >
                {t('dashboard.adminPanel')}
              </button>
            </div>
          )}
          <button 
            onClick={() => logOut()}
            className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all group shadow-sm active:scale-90"
            title="Sign Out"
          >
            <LogOut className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.all')}</p>
           <div className="text-3xl font-black text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-yellow-400">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.pending')}</p>
           <div className="text-3xl font-black text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-green-400">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.confirmed')}</p>
           <div className="text-3xl font-black text-green-600">{stats.confirmed}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-red-400">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.cancelled')}</p>
           <div className="text-3xl font-black text-red-600">{stats.cancelled}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
             <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-yellow-500" /> {t('dashboard.filterBy')}
             </h4>
             
             <div className="space-y-2">
                {[
                  { id: 'all', label: t('dashboard.all'), color: 'bg-black' },
                  { id: 'pending', label: t('dashboard.pending'), color: 'bg-yellow-400' },
                  { id: 'confirmed', label: t('dashboard.confirmed'), color: 'bg-green-500' },
                  { id: 'cancelled', label: t('dashboard.cancelled'), color: 'bg-red-500' }
                ].map(status => (
                  <button
                    key={status.id}
                    onClick={() => setStatusFilter(status.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all group ${
                      statusFilter === status.id 
                        ? 'bg-gray-900 text-white shadow-xl shadow-black/10 scale-[1.02]' 
                        : 'hover:bg-gray-50 text-gray-500 hover:text-black'
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
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
             <input 
               type="text"
               placeholder={t('dashboard.searchPlaceholder')}
               className="w-full pl-16 pr-6 py-6 bg-white border border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all text-base font-bold shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                   <div className="w-16 h-16 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
                   <Loader2 className="h-6 w-6 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">{t('dashboard.fetching')}</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] py-24 text-center">
                 <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                    <History className="h-10 w-10 text-gray-200" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 mb-2">{t('dashboard.noBookings')}</h3>
                 <p className="text-gray-500 font-medium">{t('dashboard.historyEmpty')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                {filteredBookings.map((booking) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={booking.id}
                    className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 group-hover:bg-yellow-400/10 transition-colors"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                            booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                            booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                            'bg-yellow-400 text-black'
                          }`}>
                            {booking.status === 'pending' ? t('dashboard.pending') : 
                             booking.status === 'confirmed' ? t('dashboard.confirmed') : 
                             t('dashboard.cancelled')}
                          </span>
                          <span className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                            <Clock className="h-3 w-3 mr-1.5" />
                            {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : t('dashboard.recent')}
                          </span>
                          <span className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            ID: {booking.id.slice(0, 8)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <div className="flex items-start space-x-4">
                               <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-50 transition-colors">
                                  <MapPin className="h-5 w-5 text-yellow-500" />
                               </div>
                               <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.route')}</p>
                                 <h4 className="text-lg font-bold text-gray-900 leading-tight">
                                   {booking.pickup} <ChevronRight className="inline h-4 w-4 text-gray-300 mx-1" /> {booking.dropoff}
                                 </h4>
                               </div>
                             </div>

                             <div className="flex items-start space-x-4">
                               <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-50 transition-colors">
                                  <Car className="h-5 w-5 text-yellow-500" />
                               </div>
                               <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.details')}</p>
                                 <h4 className="text-lg font-bold text-gray-900 uppercase">
                                   {booking.vehicle} • {booking.passengers} PAX
                                 </h4>
                               </div>
                             </div>
                          </div>

                          <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                     <UserIcon className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{t('dashboard.customer')}</p>
                                     <p className="text-sm font-bold text-gray-900">{booking.customerName}</p>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                     <Phone className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{t('dashboard.contact')}</p>
                                     <p className="text-sm font-bold text-gray-900">{booking.customerPhone}</p>
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
                               className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                                 booking.status === 'confirmed' 
                                   ? 'bg-gray-100 text-gray-400 shadow-none' 
                                   : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20 active:scale-95'
                               }`}
                             >
                               {t('dashboard.confirmed')}
                             </button>
                             <button
                               onClick={() => updateStatus(booking.id, 'cancelled')}
                               disabled={booking.status === 'cancelled'}
                               className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                 booking.status === 'cancelled' 
                                   ? 'bg-gray-100 text-gray-400' 
                                   : 'bg-red-50 text-red-500 hover:bg-red-100 active:scale-95'
                               }`}
                             >
                               {t('dashboard.cancelled')}
                             </button>
                             <button
                               onClick={() => deleteBooking(booking.id)}
                               className="w-full py-2 text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors mt-2"
                             >
                               Delete Perm
                             </button>
                           </div>
                         ) : (
                           <div className="flex flex-row md:flex-col gap-2">
                             <button 
                               onClick={() => {
                                 const message = `Hello JK CABS, I need help with my booking. \n\nBooking ID: ${booking.id}\nCustomer: ${booking.customerName}\nRoute: ${booking.pickup} to ${booking.dropoff}`;
                                 window.open(`https://wa.me/917006268328?text=${encodeURIComponent(message)}`, '_blank');
                               }}
                               className="px-8 py-4 bg-black text-white rounded-[1.5rem] text-sm font-black flex items-center hover:bg-gray-900 transition-all shadow-2xl shadow-black/20 active:scale-95"
                             >
                               <Phone className="h-5 w-5 mr-3" />
                               {t('dashboard.support')}
                             </button>
                             {booking.status === 'pending' && (
                               <button 
                                 onClick={() => updateStatus(booking.id, 'cancelled')}
                                 className="px-8 py-4 bg-red-50 text-red-500 rounded-[1.5rem] text-sm font-black flex items-center hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                               >
                                 <XCircle className="h-5 w-5 mr-3" />
                                 Cancel Trip
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

