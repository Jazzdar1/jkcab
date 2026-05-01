diff --git a/src/components/AdminPanel.tsx b/src/components/AdminPanel.tsx
index 68c8f560e526727313d5fa836c335cffbc6c0577..954d2864482d61b77b99b9c92ae84ad6a42a5090 100644
--- a/src/components/AdminPanel.tsx
+++ b/src/components/AdminPanel.tsx
@@ -6,51 +6,51 @@ import {
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
-  const { user, profile, logout, isAdmin: authIsAdmin, loginAnonymously } = useAuth();
+  const { user, profile, logout, isAdmin: authIsAdmin, login } = useAuth();
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState<'fleet' | 'rates' | 'drivers' | 'packages' | 'bookings' | 'users' | 'settings'>('fleet');
   const [loading, setLoading] = useState(true);
   const [isAdmin, setIsAdmin] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [pinInput, setPinInput] = useState('');
   const [isUnlocked, setIsUnlocked] = useState(false);
   
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
