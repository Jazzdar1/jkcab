import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Car, Users, Image as ImageIcon, Ruler, 
  MapPin, DollarSign, LayoutDashboard, Settings, LogOut, ChevronRight,
  Menu, X, Search, MoreVertical, CheckCircle2, XCircle, Clock, ExternalLink,
  ShieldCheck, RefreshCw, Smartphone, Globe, Calendar, LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, setDoc, serverTimestamp, getDoc 
} from 'firebase/firestore';
import { VEHICLES, DRIVERS, ROUTE_RATES, TOUR_PACKAGES } from '@/constants';

// Vercel Build Fix - Absolute Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, profile, logout, isAdmin: authIsAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'fleet' | 'rates' | 'drivers' | 'packages' | 'bookings' | 'users' | 'settings'>('fleet');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(authIsAdmin);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [fleet, setFleet] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    logoLine1: 'J&K',
    logoLine2: 'CABS',
    logoTagline: 'EST. 2010',
    heroTitle: 'Luxury Travel Redefined',
    heroSubtitle: 'Experience the pinnacle of chauffeured travel with our elite fleet and professional crew.',
    heroBadge: 'Premium Chauffeur Service',
    heroImage: 'https://images.unsplash.com/photo-1598305310232-a764dca2161b?q=80&w=2070&auto=format&fit=crop',
    heroStatsRating: '4.9',
    heroStatsLabel: 'Verified Srinagar Reviews',
    heroClientsCount: '+2k Happy Clients',
    heroScrollLabel: 'Discover Kashmir',
    fleetTitle: 'Premium Fleet',
    fleetSubtitle: 'Select Your Companion',
    ratesTitle: 'Live Route Estimates',
    ratesSubtitle: 'Transparent Pricing',
    packagesTitle: 'Curated Journeys',
    packagesSubtitle: 'Experience the Magic',
    contactEmail: 'booking@jandkcabs.in',
    contactPhone: '+91 70062 68328',
    footerText: '© 2024 J&K CABS. Excellence in Motion.',
    address: 'Srinagar, Jammu & Kashmir, India',
    featuresTitle: 'A Service Built on',
    featuresSubtitle: 'Trust & Experience',
    highlights: []
  });
  
  // Edit State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFirestoreError = (error: any, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: user?.uid,
        email: user?.email,
        emailVerified: user?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    toast.error(`Permission Denied: ${operationType} on ${path}`);
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    const checkAdmin = async () => {
      try {
        // Optimized check: Try to fetch specifically the current user's document
        // from either the admins collection or check their role in the users collection
        const { getDoc, doc } = await import('firebase/firestore');
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        const isAdminUser = adminDoc.exists() || (userDoc.exists() && userDoc.data()?.role === 'admin');
        
        if (isAdminUser || user.email === 'darajazb@gmail.com') {
          setIsAdmin(true);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("Error checking admin:", err);
        // Fallback to email check if Firestore check fails due to permissions
        if (user.email === 'darajazb@gmail.com') {
          setIsAdmin(true);
        } else {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubFleet = onSnapshot(collection(db, 'fleet'), (snap) => {
      setFleet(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'fleet'));

    const unsubRates = onSnapshot(collection(db, 'rates'), (snap) => {
      setRates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'rates'));

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snap) => {
      setDrivers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'drivers'));

    const unsubPackages = onSnapshot(collection(db, 'packages'), (snap) => {
      setPackages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'packages'));

    const unsubBookings = onSnapshot(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')), (snap) => {
      setAllBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'bookings'));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'users'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) {
        setSiteSettings(snap.data());
      }
    }, (err) => handleFirestoreError(err, 'get', 'settings/site'));

    return () => {
      unsubFleet();
      unsubRates();
      unsubDrivers();
      unsubPackages();
      unsubBookings();
      unsubUsers();
      unsubSettings();
    };
  }, [isAdmin]);

  const handleWipeAllData = async () => {
    if (!confirm("CRITICAL ACTION: This will delete ALL data (Fleet, Rates, Drivers, Packages, Bookings) from your cloud storage. This cannot be undone. Are you sure?")) return;
    
    toast.promise(async () => {
      const collections = ['fleet', 'rates', 'drivers', 'packages', 'bookings'];
      for (const col of collections) {
        const snap = await getDocs(collection(db, col));
        for (const d of snap.docs) {
          await deleteDoc(doc(db, col, d.id));
        }
      }
    }, {
      loading: 'Wiping cloud data...',
      success: 'Database cleared successfully!',
      error: 'Failed to clear database.',
    });
  };

  const handleSyncInitial = async () => {
    toast.promise(async () => {
      // Self-promote current user if they are the primary admin email
      if (user?.email === 'darajazb@gmail.com') {
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          role: 'admin',
          updatedAt: serverTimestamp()
        });
      }
      
      // Just sync settings if they don't exist
      const settingsSnap = await getDoc(doc(db, 'settings', 'site'));
      if (!settingsSnap.exists()) {
        await setDoc(doc(db, 'settings', 'site'), siteSettings);
      }
    }, {
      loading: 'Syncing admin profile...',
      success: 'Admin profile synced!',
      error: 'Failed to sync profile.',
    });
  };
  const handleDelete = async (col: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, col, id));
      toast.success("Item deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete item");
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status, updatedAt: serverTimestamp() });
      toast.success(`Booking status updated to ${status}`);
    } catch (err) {
      console.error("Booking update error:", err);
      toast.error("Failed to update booking");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {};
    formData.forEach((value, key) => {
      if (key === 'languages' || key === 'features' || key === 'destinations') {
        data[key] = (value as string).split(',').map(s => s.trim()).filter(Boolean);
      } else if (key === 'rating') {
        data[key] = parseFloat(value as string);
      } else if (key === 'isPremium') {
        data[key] = value === 'on';
      } else {
        data[key] = value;
      }
    });

    try {
      const collectionName = activeTab === 'fleet' ? 'fleet' : activeTab;
      
      if (activeTab === 'settings') {
        const highlights: any[] = [];
        for (let i = 0; i < 4; i++) {
          highlights.push({
            title: formData.get(`h_title_${i}`),
            desc: formData.get(`h_desc_${i}`)
          });
        }
        
        await setDoc(doc(db, 'settings', 'site'), {
          ...data,
          highlights,
          updatedAt: serverTimestamp()
        });
        toast.success("Site settings updated successfully");
        return;
      }

      if (editingItem?.id) {
        await updateDoc(doc(db, collectionName, editingItem.id), {
          ...data,
          updatedAt: serverTimestamp()
        });
        toast.success("Item updated successfully");
      } else {
        await addDoc(collection(db, collectionName), {
          ...data,
          updatedAt: serverTimestamp()
        });
        toast.success("New item added successfully");
      }
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving changes");
    }
  };

  const filteredData = () => {
    let data = [];
    switch (activeTab) {
      case 'fleet': data = fleet; break;
      case 'rates': data = rates; break;
      case 'drivers': data = drivers; break;
      case 'packages': data = packages; break;
      case 'bookings': data = allBookings; break;
      case 'users': data = allUsers; break;
    }
    
    if (!searchQuery) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter((item: any) => 
      (item.name || item.title || item.route || item.customerName || item.email || '').toLowerCase().includes(query)
    );
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mb-6"
        />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Initializing Portal</p>
      </div>
    );
  }

  if (!isAdmin && user?.email !== 'darajazb@gmail.com') return null;

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#0a0a0a] overflow-hidden font-sans">
      <Toaster position="top-center" richColors />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-[#111] border-r border-gray-100 dark:border-white/5 shadow-2xl z-50">
        <div className="p-8 pb-4">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-2 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
            <h1 className="text-xl font-black tracking-tighter dark:text-white uppercase leading-none">
              Admin<span className="text-yellow-400">Suite</span>
            </h1>
          </div>
          
          <nav className="space-y-1">
            {[
              { id: 'fleet', label: 'Fleet Hub', icon: Car },
              { id: 'rates', label: 'Tariff Matrix', icon: DollarSign },
              { id: 'drivers', label: 'Crew Base', icon: Users },
              { id: 'packages', label: 'Tour Plans', icon: MapPin },
              { id: 'bookings', label: 'Live Orders', icon: Calendar },
              { id: 'users', label: 'User CRM', icon:ShieldCheck },
              { id: 'settings', label: 'Site Config', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 font-black' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <tab.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-black' : 'text-gray-400'}`} />
                <span className="text-[11px] uppercase tracking-widest leading-none mt-0.5">{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-3">
          <Button 
            variant="outline" 
            onClick={handleWipeAllData}
            className="w-full justify-start space-x-3 h-14 rounded-2xl text-[10px] uppercase font-black tracking-widest border-dashed border-red-200 dark:border-red-500/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 hover:border-red-500/30"
          >
            <Trash2 className="h-4 w-4" />
            <span>Wipe Data</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSyncInitial}
            className="w-full justify-start space-x-3 h-14 rounded-2xl text-[10px] uppercase font-black tracking-widest border-dashed border-gray-200 dark:border-white/10 hover:bg-yellow-400/5 hover:border-yellow-400/30"
          >
            <RefreshCw className="h-4 w-4 text-yellow-500" />
            <span>Sync Admin</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="w-full justify-start space-x-3 h-14 rounded-2xl text-[10px] uppercase font-black tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Terminate</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#fafafa] dark:bg-[#0a0a0a] relative">
        
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-8 z-40">
          <div className="flex items-center flex-1 max-w-md bg-gray-50 dark:bg-white/5 rounded-2xl px-4 h-12 group focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-yellow-500" />
            <Input 
              placeholder="Instant Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 text-xs font-bold" 
            />
          </div>

          <div className="flex items-center space-x-4 pl-8">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-[10px] font-black uppercase text-gray-900 dark:text-white tracking-widest leading-none mb-1">
                {profile?.name || 'Authorized Admin'}
              </span>
              <span className="text-[8px] font-bold text-gray-500 tracking-widest leading-none">SECURE ACCESS GRANTED</span>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-yellow-400 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-yellow-400/20">
              {profile?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Content Surface */}
        <ScrollArea className="flex-1">
          <div className="p-8 md:p-12 max-w-7xl mx-auto w-full">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="h-[1px] w-8 bg-yellow-400"></span>
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">Section 0{['fleet', 'rates', 'drivers', 'packages', 'bookings', 'users'].indexOf(activeTab) + 1}</span>
                </div>
                <h2 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                  {activeTab === 'settings' ? 'Configure' : activeTab}
                </h2>
              </div>

              {activeTab === 'settings' ? (
                <div className="flex gap-4">
                  <Button 
                    onClick={handleSyncInitial}
                    className="bg-yellow-400 text-black h-16 px-10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <RefreshCw className="h-4 w-4 mr-3" />
                    Sync Admin
                  </Button>
                  <Button 
                    onClick={handleWipeAllData}
                    className="bg-red-500 text-white h-16 px-10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Wipe Database
                  </Button>
                </div>
              ) : activeTab !== 'bookings' && activeTab !== 'users' && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger 
                    render={
                      <Button 
                        onClick={() => { setEditingItem(null); setIsEditDialogOpen(true); }}
                        className="bg-black dark:bg-white text-white dark:text-black h-16 px-10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                      />
                    }
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Add {activeTab === 'fleet' ? 'Vehicle' : activeTab.slice(0, -1)}
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white dark:bg-[#111] border-0 rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
                    <DialogHeader className="mb-8">
                      <DialogTitle className="text-3xl font-black tracking-tighter uppercase leading-none">
                        {editingItem ? 'Modify Record' : `Initialize ${activeTab}`}
                      </DialogTitle>
                      <DialogDescription className="text-xs uppercase font-bold text-gray-500 tracking-widest mt-2">
                        System configuration parameters and asset allocation.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Render form fields based on activeTab */}
                       {activeTab === 'fleet' && (
                        <>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Model Reference</label>
                             <Input name="name" defaultValue={editingItem?.name} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Classification</label>
                             <select name="type" defaultValue={editingItem?.type} className="w-full h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold px-4 text-sm appearance-none">
                               <option value="Sedan">Executive Sedan</option>
                               <option value="SUV">Luxury SUV</option>
                               <option value="Luxury">Premium Elite</option>
                               <option value="Large Group">Group Carrier</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Pax Multiplier</label>
                             <Input name="capacity" defaultValue={editingItem?.capacity} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Base Rate (Daily)</label>
                             <Input name="pricePerDay" defaultValue={editingItem?.pricePerDay} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Source Visual URL</label>
                             <Input name="image" defaultValue={editingItem?.image} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Asset Attributes (Comma SEP)</label>
                             <Input name="features" defaultValue={editingItem?.features?.join(', ')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl md:col-span-2">
                             <input type="checkbox" name="isPremium" defaultChecked={editingItem?.isPremium} id="isPremium" className="w-5 h-5 accent-yellow-400 rounded" />
                             <label htmlFor="isPremium" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Premium Logistics Tier</label>
                          </div>
                        </>
                      )}

                      {activeTab === 'rates' && (
                        <>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Origin-Destination Vector</label>
                             <Input name="route" defaultValue={editingItem?.route} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Sedan Unit Cost</label>
                             <Input name="sedan" defaultValue={editingItem?.sedan} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">SUV Unit Cost</label>
                             <Input name="suv" defaultValue={editingItem?.suv} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                        </>
                      )}

                      {activeTab === 'drivers' && (
                        <>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Personnel Identity</label>
                             <Input name="name" defaultValue={editingItem?.name} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Tenure / Experience</label>
                             <Input name="experience" defaultValue={editingItem?.experience} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Service Index (0-5)</label>
                             <Input type="number" step="0.1" name="rating" defaultValue={editingItem?.rating} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Operational Specialty</label>
                             <Input name="specialty" defaultValue={editingItem?.specialty} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Biometric Avatar URL</label>
                             <Input name="image" defaultValue={editingItem?.image} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Linguistic Proficiency (Comma SEP)</label>
                             <Input name="languages" defaultValue={editingItem?.languages?.join(', ')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                        </>
                      )}

                      {activeTab === 'packages' && (
                        <>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Product Designation</label>
                             <Input name="title" defaultValue={editingItem?.title} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Temporal Scope</label>
                             <Input name="duration" defaultValue={editingItem?.duration} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Pricing Tier</label>
                             <Input name="price" defaultValue={editingItem?.price} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Marketing Asset URL</label>
                             <Input name="image" defaultValue={editingItem?.image} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Scope Narrative</label>
                             <textarea 
                                name="description" 
                                defaultValue={editingItem?.description} 
                                required 
                                className="w-full h-32 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold p-4 text-sm" 
                             />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Itinerary Vectors (Comma SEP)</label>
                             <Input name="destinations" defaultValue={editingItem?.destinations?.join(', ')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                          </div>
                        </>
                      )}

                      <DialogFooter className="md:col-span-2 flex gap-4 mt-8">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="h-14 flex-1 rounded-2xl text-[10px] uppercase font-black tracking-widest leading-none border-2">Cancel Operation</Button>
                        <Button type="submit" className="h-14 flex-1 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] uppercase font-black tracking-widest leading-none shadow-xl shadow-yellow-400/20">Execute Save</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Site Settings Tab Content */}
            {activeTab === 'settings' && (
              <Card className="rounded-[3rem] border-0 bg-white dark:bg-[#111] shadow-2xl p-10 mt-8 mb-20">
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Branding Group */}
                  <div className="md:col-span-2 border-b border-gray-100 dark:border-white/5 pb-8 mb-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center">
                       <Smartphone className="h-5 w-5 mr-3 text-yellow-500" />
                       Brand Identity
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Logo Main (e.g. J&K)</label>
                        <Input name="logoLine1" defaultValue={siteSettings?.logoLine1} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Logo Accent (e.g. CABS)</label>
                        <Input name="logoLine2" defaultValue={siteSettings?.logoLine2} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Logo Tagline (EST)</label>
                        <Input name="logoTagline" defaultValue={siteSettings?.logoTagline} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                    </div>
                  </div>

                  {/* Hero Group */}
                  <div className="md:col-span-2 border-b border-gray-100 dark:border-white/5 pb-8 mb-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center">
                       <Car className="h-5 w-5 mr-3 text-yellow-500" />
                       Hero Section
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Hero Primary Headline</label>
                        <Input name="heroTitle" defaultValue={siteSettings?.heroTitle} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Hero Descriptive Narrative</label>
                        <textarea 
                          name="heroSubtitle" 
                          defaultValue={siteSettings?.heroSubtitle} 
                          required 
                          className="w-full h-32 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold p-4 text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Hero Badge Text</label>
                        <Input name="heroBadge" defaultValue={siteSettings?.heroBadge} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Hero Background Image URL</label>
                        <Input name="heroImage" defaultValue={siteSettings?.heroImage} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Stats Rating (e.g. 4.9)</label>
                        <Input name="heroStatsRating" defaultValue={siteSettings?.heroStatsRating} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                       <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Stats Rating Label</label>
                        <Input name="heroStatsLabel" defaultValue={siteSettings?.heroStatsLabel} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Clients Count Label</label>
                        <Input name="heroClientsCount" defaultValue={siteSettings?.heroClientsCount} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Scroll Message</label>
                        <Input name="heroScrollLabel" defaultValue={siteSettings?.heroScrollLabel} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                    </div>
                  </div>

                  {/* Section Titles Group */}
                  <div className="md:col-span-2 border-b border-gray-100 dark:border-white/5 pb-8 mb-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center">
                       <Globe className="h-5 w-5 mr-3 text-yellow-500" />
                       Section Sub-Headers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Fleet Section</label>
                          <Input name="fleetSectionLabel" defaultValue={siteSettings?.fleetSectionLabel} placeholder="Section Label" required className="h-10 rounded-xl bg-white dark:bg-white/5 border-0 font-bold mb-2" />
                          <Input name="fleetTitle" defaultValue={siteSettings?.fleetTitle} placeholder="Main Title" required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold mb-2" />
                          <Input name="fleetSubtitle" defaultValue={siteSettings?.fleetSubtitle} placeholder="Subtitle" required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold" />
                       </div>
                       <div className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Rates Section</label>
                          <Input name="ratesSectionLabel" defaultValue={siteSettings?.ratesSectionLabel} placeholder="Section Label" required className="h-10 rounded-xl bg-white dark:bg-white/5 border-0 font-bold mb-2" />
                          <Input name="ratesTitle" defaultValue={siteSettings?.ratesTitle} placeholder="Main Title" required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold mb-2" />
                          <Input name="ratesSubtitle" defaultValue={siteSettings?.ratesSubtitle} placeholder="Subtitle" required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold" />
                       </div>
                       <div className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Tour Packages Section</label>
                          <Input name="packagesSectionLabel" defaultValue={siteSettings?.packagesSectionLabel} placeholder="Section Label" required className="h-10 rounded-xl bg-white dark:bg-white/5 border-0 font-bold mb-2" />
                          <Input name="packagesTitle" defaultValue={siteSettings?.packagesTitle} placeholder="Main Title" required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold mb-2" />
                          <Input name="packagesSubtitle" defaultValue={siteSettings?.packagesSubtitle} placeholder="Subtitle" required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold mb-2" />
                          <textarea name="packagesDescription" defaultValue={siteSettings?.packagesDescription} placeholder="Description" required className="w-full h-20 rounded-xl bg-white dark:bg-white/5 border-0 font-bold p-3 text-xs" />
                       </div>
                       <div className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Footer & Contact</label>
                          <Input name="contactEmail" defaultValue={siteSettings?.contactEmail} placeholder="Email" required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold mb-2" />
                          <Input name="contactPhone" defaultValue={siteSettings?.contactPhone} placeholder="Phone" required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold" />
                       </div>
                    </div>
                  </div>

                  {/* UI Labels Group */}
                  <div className="md:col-span-2 border-b border-gray-100 dark:border-white/5 pb-8 mb-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center">
                       <LayoutGrid className="h-5 w-5 mr-3 text-yellow-500" />
                       Interface Labels
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Price Suffix (e.g. Per Day Rate)</label>
                        <Input name="labelPerDay" defaultValue={siteSettings?.labelPerDay} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Package Suffix (e.g. Package Starts At)</label>
                        <Input name="labelStartsAt" defaultValue={siteSettings?.labelStartsAt} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Booking Title</label>
                        <Input name="labelBookingTitle" defaultValue={siteSettings?.labelBookingTitle} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Booking Subtitle</label>
                        <textarea name="labelBookingSubtitle" defaultValue={siteSettings?.labelBookingSubtitle} required className="w-full h-24 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold p-3 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Sedan Label</label>
                        <Input name="labelSedan" defaultValue={siteSettings?.labelSedan} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">SUV Label</label>
                        <Input name="labelSuv" defaultValue={siteSettings?.labelSuv} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Book Now Label</label>
                        <Input name="labelBookNow" defaultValue={siteSettings?.labelBookNow} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Capacity Label</label>
                        <Input name="labelCapacity" defaultValue={siteSettings?.labelCapacity} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Pricing Label</label>
                        <Input name="labelPricing" defaultValue={siteSettings?.labelPricing} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Go Back Label</label>
                        <Input name="labelBookingBack" defaultValue={siteSettings?.labelBookingBack} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Confirm Button Label</label>
                        <Input name="labelBookingConfirm" defaultValue={siteSettings?.labelBookingConfirm} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Success Title</label>
                        <Input name="labelSuccessTitle" defaultValue={siteSettings?.labelSuccessTitle} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Success Message</label>
                        <textarea name="labelSuccessMsg" defaultValue={siteSettings?.labelSuccessMsg} required className="w-full h-24 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold p-3 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Inquiry Label</label>
                        <Input name="labelInquire" defaultValue={siteSettings?.labelInquire} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">No Advance Msg Label</label>
                        <Input name="labelNoAdvance" defaultValue={siteSettings?.labelNoAdvance} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Labels Group */}
                  <div className="md:col-span-2 border-b border-gray-100 dark:border-white/5 pb-8 mb-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center">
                       <Menu className="h-5 w-5 mr-3 text-yellow-500" />
                       Navigation & Link Labels
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Home</label>
                        <Input name="navHome" defaultValue={siteSettings?.navHome} required className="h-10 rounded-xl bg-gray-50 dark:bg-white/5 border-0 font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Fleet</label>
                        <Input name="navFleet" defaultValue={siteSettings?.navFleet} required className="h-10 rounded-xl bg-gray-50 dark:bg-white/5 border-0 font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Rates</label>
                        <Input name="navRates" defaultValue={siteSettings?.navRates} required className="h-10 rounded-xl bg-gray-50 dark:bg-white/5 border-0 font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Packages</label>
                        <Input name="navPackages" defaultValue={siteSettings?.navPackages} required className="h-10 rounded-xl bg-gray-50 dark:bg-white/5 border-0 font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Drivers</label>
                        <Input name="navDrivers" defaultValue={siteSettings?.navDrivers} required className="h-10 rounded-xl bg-gray-50 dark:bg-white/5 border-0 font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Dashboard</label>
                        <Input name="navDashboard" defaultValue={siteSettings?.navDashboard} required className="h-10 rounded-xl bg-gray-50 dark:bg-white/5 border-0 font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Sign In</label>
                        <Input name="navSignIn" defaultValue={siteSettings?.navSignIn} required className="h-10 rounded-xl bg-gray-50 dark:bg-white/5 border-0 font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Call Now</label>
                        <Input name="navCallNow" defaultValue={siteSettings?.navCallNow} required className="h-10 rounded-xl bg-gray-50 dark:bg-white/5 border-0 font-bold text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Custom Fleet Banner Group */}
                  <div className="md:col-span-2 border-b border-gray-100 dark:border-white/5 pb-8 mb-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center">
                       <Smartphone className="h-5 w-5 mr-3 text-yellow-500" />
                       Bulk Inquiry Prompt (Fleet Page)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Banner Title</label>
                        <Input name="customFleetTitle" defaultValue={siteSettings?.customFleetTitle} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Banner Description</label>
                        <textarea name="customFleetDesc" defaultValue={siteSettings?.customFleetDesc} required className="w-full h-24 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold p-3 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Button Label</label>
                        <Input name="customFleetButton" defaultValue={siteSettings?.customFleetButton} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Headquarters Location</label>
                    <Input name="address" defaultValue={siteSettings?.address} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Footer Legal Attribution</label>
                    <Input name="footerText" defaultValue={siteSettings?.footerText} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 dark:border-white/5 pt-8 mt-4">
                    <h4 className="text-sm font-black uppercase tracking-tighter mb-6">Features Section Customization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Features Label</label>
                          <Input name="featuresSectionLabel" defaultValue={siteSettings?.featuresSectionLabel} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Features Main Title</label>
                          <Input name="featuresTitle" defaultValue={siteSettings?.featuresTitle} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Features Emphasis Subtitle</label>
                          <Input name="featuresSubtitle" defaultValue={siteSettings?.featuresSubtitle} required className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-0 font-bold" />
                       </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 dark:border-white/5 pt-8 mt-4">
                    <h4 className="text-sm font-black uppercase tracking-tighter mb-6">Service Highlights (Value Props)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Highlight {i+1} Title</label>
                            <Input name={`h_title_${i}`} defaultValue={siteSettings?.highlights?.[i]?.title} required className="h-12 rounded-xl bg-white dark:bg-white/5 border-0 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Highlight {i+1} Description</label>
                            <textarea name={`h_desc_${i}`} defaultValue={siteSettings?.highlights?.[i]?.desc} required className="w-full h-24 rounded-xl bg-white dark:bg-white/5 border-0 font-bold p-3 text-xs" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end mt-4">
                    <Button type="submit" className="h-16 px-12 rounded-[2rem] bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] uppercase font-black tracking-widest leading-none shadow-xl shadow-yellow-400/20">
                      Synchronize Global Config
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Grid Layout for Assets */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${activeTab === 'settings' ? 'hidden' : ''}`}>
              <AnimatePresence mode="popLayout">
                {filteredData().map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'bookings' ? (
                      <Card className="rounded-[2rem] border-0 bg-white dark:bg-[#111] shadow-xl overflow-hidden group">
                        <CardHeader className="p-6 pb-2">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black tracking-[0.2em] uppercase leading-none border-2 ${
                              item.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                              item.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              'bg-yellow-400/10 text-yellow-500 border-yellow-400/20'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-[8px] font-black text-gray-400 tracking-widest">#{item.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                          <CardTitle className="text-sm font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">{item.customerName}</CardTitle>
                          <CardDescription className="text-[10px] font-bold text-gray-500 flex items-center">
                            <Smartphone className="h-3 w-3 mr-1" /> {item.customerPhone}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                          <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-start">
                              <MapPin className="h-3 w-3 text-yellow-500 mt-0.5 mr-2 shrink-0" />
                              <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 leading-tight">{item.pickup} → {item.dropoff}</p>
                            </div>
                            <div className="flex items-center">
                              <Car className="h-3 w-3 text-yellow-500 mr-2 shrink-0" />
                              <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{item.vehicle}</p>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 text-yellow-500 mr-2 shrink-0" />
                              <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{item.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => updateBookingStatus(item.id, 'confirmed')} className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest h-10">Confirm</Button>
                            <Button size="sm" variant="ghost" onClick={() => updateBookingStatus(item.id, 'cancelled')} className="flex-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-[8px] font-black uppercase tracking-widest h-10">Reject</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : activeTab === 'users' ? (
                      <Card className="rounded-[2.5rem] border-0 bg-white dark:bg-[#111] shadow-xl p-8 flex items-center space-x-4 group hover:bg-yellow-400 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-colors">
                          <Users className="h-6 w-6 text-yellow-500 group-hover:text-black transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate group-hover:text-black transition-colors">{item.name}</h4>
                          <p className="text-[10px] font-bold text-gray-500 tracking-widest truncate group-hover:text-black/60 transition-colors">{item.email}</p>
                        </div>
                      </Card>
                    ) : (
                      <Card className="rounded-[2.5rem] border-0 bg-white dark:bg-[#111] shadow-xl overflow-hidden group hover:translate-y-[-8px] transition-all duration-500">
                        <div className="h-48 relative overflow-hidden">
                          <img src={item.image || 'https://via.placeholder.com/400'} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-4 right-4 flex space-x-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                            <Button 
                              size="icon" 
                              onClick={() => { setEditingItem(item); setIsEditDialogOpen(true); }}
                              className="h-10 w-10 bg-white/90 backdrop-blur text-blue-600 rounded-xl hover:scale-110 active:scale-95"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              onClick={() => handleDelete(activeTab === 'fleet' ? 'fleet' : activeTab, item.id)}
                              className="h-10 w-10 bg-white/90 backdrop-blur text-red-600 rounded-xl hover:scale-110 active:scale-95"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-8">
                          <h3 className="text-black dark:text-white font-black uppercase text-xs tracking-widest mb-2 leading-none">
                            {item.name || item.title || item.route}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest leading-none">
                              {activeTab === 'fleet' ? item.type : activeTab === 'rates' ? `ID: ${item.id.slice(-4)}` : item.experience || item.duration}
                            </span>
                            <span className="text-[12px] font-black text-gray-900 dark:text-white tracking-tighter">
                              {activeTab === 'fleet' ? item.pricePerDay : activeTab === 'rates' ? `₹${item.sedan}` : item.price}
                            </span>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {activeTab !== 'settings' && filteredData().length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-4 leading-none">Database Empty</h3>
                <p className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase mb-12 max-w-sm mx-auto leading-relaxed">Your cloud storage has no records for this section. Initialize the system with default data to get started.</p>
                <Button 
                  onClick={handleSyncInitial}
                  className="bg-yellow-400 text-black h-20 px-12 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  <RefreshCw className="h-4 w-4 mr-3" />
                  Initialize System Database
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      {/* Mobile Toggle & Sidebar Popup (Overlay style) */}
      <div className="md:hidden fixed bottom-8 right-8 z-[100]">
        <Button 
          size="icon" 
          onClick={() => setIsSidebarOpen(true)}
          className="h-16 w-16 bg-yellow-400 text-black rounded-[2rem] shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white dark:bg-[#111] z-[120] p-8 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="w-1.5 h-8 bg-yellow-400 rounded-full"></div>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="h-12 w-12 rounded-2xl">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <nav className="space-y-2 flex-1">
                {[
                  { id: 'fleet', label: 'Fleet', icon: Car },
                  { id: 'rates', label: 'Rates', icon: DollarSign },
                  { id: 'drivers', label: 'Crew', icon: Users },
                  { id: 'packages', label: 'Tours', icon: MapPin },
                  { id: 'bookings', label: 'Bookings', icon: Calendar },
                  { id: 'users', label: 'Users', icon: ShieldCheck },
                  { id: 'settings', label: 'Config', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${
                      activeTab === tab.id ? 'bg-yellow-400 text-black' : 'text-gray-500'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="pt-8 space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl text-[10px] uppercase font-black tracking-widest border-2"
                  onClick={() => { handleSyncInitial(); setIsSidebarOpen(false); }}
                >
                  Sync System
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-14 rounded-2xl text-[10px] uppercase font-black tracking-widest text-red-500"
                  onClick={() => navigate('/')}
                >
                  Exit Portal
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
