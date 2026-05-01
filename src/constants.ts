import { Vehicle, TourPackage, Driver } from './types';

export const VEHICLES: Vehicle[] = [
  {
    id: 'dzire',
    name: 'Sedan (Dzire)',
    type: 'Sedan',
    capacity: '4 Seater',
    pricePerDay: '₹2,000',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    features: ['Air Conditioned', 'Clean & Comfortable', 'Professional Driver'],
  },
  {
    id: 'ertiga',
    name: 'Ertiga',
    type: 'SUV',
    capacity: '6 Seater',
    pricePerDay: '₹3,000',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    features: ['Spacious Cabin', 'Affordable for Families', 'Music System'],
  },
  {
    id: 'innova',
    name: 'Innova',
    type: 'SUV',
    capacity: '7 Seater',
    pricePerDay: '₹3,500',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    features: ['Reliable SUV', 'Standard Seating', 'Carrier Included'],
  },
  {
    id: 'crysta-premium',
    name: 'Innova Crysta Premium',
    type: 'Luxury',
    capacity: '7 Seater',
    pricePerDay: '₹5,000',
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1598305310232-a764dca2161b?auto=format&fit=crop&q=80&w=800',
    features: ['Premium Luxury', 'Extra Legroom', 'Top Tier Comfort'],
  },
  {
    id: 'fortuner',
    name: 'Fortuner Luxury SUV',
    type: 'Luxury',
    capacity: 'Luxury SUV',
    pricePerDay: '₹9,500',
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1606148632349-564e8c39385d?auto=format&fit=crop&q=80&w=800',
    features: ['VIP Presence', 'Leather Interior', 'Maximum Safety'],
  },
  {
    id: 'urbania',
    name: 'Force Urbania',
    type: 'Large Group',
    capacity: '12-17 Seater',
    pricePerDay: '₹7,000',
    image: 'https://images.unsplash.com/photo-1532105956690-5883038933cc?auto=format&fit=crop&q=80&w=800',
    features: ['Large Group Comfort', 'European Design', 'Wide Windows'],
  },
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-1',
    title: '6-Day Srinagar (Best Value)',
    duration: '6 Days / 5 Nights',
    price: 'Starting from ₹21,000',
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg'],
    image: 'https://images.unsplash.com/photo-1598305310232-a764dca2161b?auto=format&fit=crop&q=80&w=800',
    description: 'Our most popular package covering the essential highlights of the valley.',
  },
  {
    id: 'pkg-2',
    title: 'Alpine Wonders',
    duration: '5 Days / 4 Nights',
    price: 'Starting from ₹16,500',
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg'],
    image: 'https://images.unsplash.com/photo-1566371486490-560ded239df6?auto=format&fit=crop&q=80&w=800',
    description: 'Explore the golden meadows of Sonamarg and stay in houseboats at Dal Lake.',
  },
  {
    id: 'pkg-3',
    title: 'Magical Kashmir',
    duration: '4 Days / 3 Nights',
    price: 'Starting from ₹12,000',
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    image: 'https://images.unsplash.com/photo-1589133423730-48767e399cbf?auto=format&fit=crop&q=80&w=800',
    description: 'An immersive experience into the cinematic valleys and serene landscapes of Kashmir.',
  },
];

export const ROUTE_RATES = [
  { route: 'Srinagar → Pahalgam (Return Same Day)', sedan: '₹2,500', suv: '₹3,500' },
  { route: 'Srinagar → Pahalgam (Night Stay)', sedan: '₹3,500', suv: '₹4,500' },
  { route: 'Srinagar → Gulmarg (Return Same Day)', sedan: '₹2,500', suv: '₹3,500' },
  { route: 'Srinagar → Sonamarg (Return Same Day)', sedan: '₹2,500', suv: '₹3,500' },
  { route: 'Srinagar → Doodhpathri (Return Same Day)', sedan: '₹2,200', suv: '₹3,200' },
  { route: 'Srinagar Local Sightseeing', sedan: '₹2,000', suv: '₹3,000' },
  { route: 'Airport → Hotel + Local Sightseeing', sedan: '₹2,200', suv: '₹3,200' },
];

export const DRIVERS: Driver[] = [
  {
    id: 'dr-1',
    name: 'Faisal Ahmad',
    experience: '12 Years',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    languages: ['English', 'Hindi', 'Kashmiri'],
    specialty: 'Gulmarg/Pahalgam Specialist',
  },
  {
    id: 'dr-2',
    name: 'Imran Khan',
    experience: '8 Years',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    languages: ['Hindi', 'Kashmiri', 'Urdu'],
    specialty: 'Smooth Long Drive Specialist',
  },
  {
    id: 'dr-3',
    name: 'Shabir Dar',
    experience: '15 Years',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    languages: ['English', 'Hindi', 'Punjabi'],
    specialty: 'Airport & VIP Handling',
  },
  {
    id: 'dr-4',
    name: 'Zahid Hussain',
    experience: '6 Years',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    languages: ['Hindi', 'Kashmiri'],
    specialty: 'Offbeat Track Expert',
  },
];

export const CONTACT_INFO = {
  phone: '+91 70062 68328',
  whatsapp: '+91 70062 68328',
  email: 'booking@jandkcabs.in',
  address: 'Srinagar, Jammu & Kashmir, India',
};
