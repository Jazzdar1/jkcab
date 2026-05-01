diff --git a/src/components/AdminPanel.tsx b/src/components/AdminPanel.tsx
index 1f71697c9ce3b5151db6f5b45e5cfe0e97430e7a..db50402640b11a4e6add3605c2160fdf83bd6be0 100644
--- a/src/components/AdminPanel.tsx
+++ b/src/components/AdminPanel.tsx
@@ -1,53 +1,53 @@
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
 
 // shadcn UI Components
-import { Button } from "./ui/button";
-import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
-import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
-import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
-import { Input } from "./ui/input";
-import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
-import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
-import { ScrollArea } from "./ui/scroll-area";
-import { Toaster } from "./ui/sonner";
-import { toast } from "sonner";
+import { Button } from '@/components/ui/button';
+import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
+import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
+import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
+import { Input } from '@/components/ui/input';
+import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
+import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
+import { ScrollArea } from '@/components/ui/scroll-area';
+import { Toaster } from '@/components/ui/sonner';
+import { toast } from 'sonner';
 
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
