export interface Driver {
  id: string;
  name: string;
  experience: string;
  rating: number;
  image: string;
  languages: string[];
  specialty: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'Sedan' | 'SUV' | 'Luxury' | 'Large Group';
  capacity: string;
  pricePerDay: string;
  image: string;
  features: string[];
  isPremium?: boolean;
}

export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  price: string;
  destinations: string[];
  image: string;
  description: string;
}

export interface BookingData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  vehicleType: string;
  passengers: string;
  name: string;
  phone: string;
}
