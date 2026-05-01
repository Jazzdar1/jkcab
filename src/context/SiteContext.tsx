import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface Highlight {
  title: string;
  desc: string;
}

interface SiteSettings {
  logoLine1: string;
  logoLine2: string;
  logoTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImage: string;
  heroStatsRating: string;
  heroStatsLabel: string;
  heroClientsCount: string;
  heroScrollLabel: string;
  fleetTitle: string;
  fleetSubtitle: string;
  fleetSectionLabel: string;
  ratesTitle: string;
  ratesSubtitle: string;
  ratesSectionLabel: string;
  packagesTitle: string;
  packagesSubtitle: string;
  packagesSectionLabel: string;
  packagesDescription: string;
  featuresTitle: string;
  featuresSubtitle: string;
  featuresSectionLabel: string;
  highlights: Highlight[];
  contactEmail: string;
  contactPhone: string;
  footerText: string;
  address: string;
  customFleetTitle: string;
  customFleetDesc: string;
  customFleetButton: string;
  labelPerDay: string;
  labelStartsAt: string;
  labelBookingTitle: string;
  labelBookingSubtitle: string;
  labelSedan: string;
  labelSuv: string;
  labelBookNow: string;
  navHome: string;
  navFleet: string;
  navRates: string;
  navPackages: string;
  navContact: string;
  navDrivers: string;
  navDashboard: string;
  navSignIn: string;
  navCallNow: string;
  labelCapacity: string;
  labelPricing: string;
  labelVehicle: string;
  labelBookingBack: string;
  labelBookingConfirm: string;
  labelBookingReview: string;
  labelSuccessTitle: string;
  labelSuccessMsg: string;
  labelInquire: string;
  labelNoAdvance: string;
}

interface SiteContextType {
  settings: SiteSettings;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
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
  fleetSectionLabel: 'Section 01',
  ratesTitle: 'Live Route Estimates',
  ratesSubtitle: 'Transparent Pricing',
  ratesSectionLabel: 'Section 02',
  packagesTitle: 'Curated Journeys',
  packagesSubtitle: 'Experience the Magic',
  packagesSectionLabel: 'Section 03',
  packagesDescription: 'Hand-picked experiences designed for comfort, discovery, and unforgettable memories in the heart of the Himalayas.',
  contactEmail: 'contact@daraz.com',
  contactPhone: '+91 99999 99999',
  footerText: '© 2024 Daraz Luxe. Excellence in Motion.',
  address: 'Executive Suites, MG Road, Bangalore',
  featuresTitle: 'A Service Built on',
  featuresSubtitle: 'Trust & Experience',
  featuresSectionLabel: 'Why Us',
  highlights: [
    { title: 'Reliable Service', desc: 'We pride ourselves on punctuality and high safety standards for every client.' },
    { title: 'No Hidden Costs', desc: 'Transparent pricing from the start. What we quote is what you pay.' },
    { title: 'Local Experts', desc: 'Our drivers are born and raised in Kashmir, knowing every hidden gem.' },
    { title: 'Real-time Tracking', desc: 'Stay informed with live driver tracking and instant WhatsApp updates.' }
  ],
  customFleetTitle: 'Need a custom fleet for an event?',
  customFleetDesc: 'We provide bulk bookings for weddings, corporate events, and large group tours across Jammu & Kashmir.',
  customFleetButton: 'Bulk Inquiry',
  labelPerDay: 'Per Day Rate',
  labelStartsAt: 'Package Starts At',
  labelBookingTitle: 'Secure Your Journey',
  labelBookingSubtitle: 'Complete the form below to receive a direct quote and availability status for your selected vehicle.',
  labelSedan: 'Sedan',
  labelSuv: 'SUV',
  labelBookNow: 'Book Now',
  navHome: 'Home',
  navFleet: 'Fleet',
  navRates: 'Rates',
  navPackages: 'Tours',
  navContact: 'Contact',
  navDrivers: 'Drivers',
  navDashboard: 'Account',
  navSignIn: 'Sign In',
  navCallNow: 'Call Now',
  labelCapacity: 'Capacity',
  labelPricing: 'Pricing',
  labelVehicle: 'Selected Vehicle',
  labelBookingBack: 'Go Back',
  labelBookingConfirm: 'Confirm Booking',
  labelBookingReview: 'Review your details before confirming',
  labelSuccessTitle: 'Booking Confirmed!',
  labelSuccessMsg: 'Your request has been received. Our team will contact you via WhatsApp shortly to finalize your trip.',
  labelInquire: 'Inquire',
  labelNoAdvance: 'No Advance Payment Required for Booking'
};

const SiteContext = createContext<SiteContextType>({
  settings: defaultSettings,
  loading: true
});

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) {
        setSettings({ ...defaultSettings, ...snap.data() } as SiteSettings);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error loading site settings:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <SiteContext.Provider value={{ settings, loading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
