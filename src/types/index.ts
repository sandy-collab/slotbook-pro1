// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

// ─── Business ────────────────────────────────────────────────────────────────
export type BusinessType =
  | 'Restaurant'
  | 'Gym'
  | 'Salon'
  | 'Clinic'
  | 'Coaching'
  | 'Turf'
  | 'Other';

export interface Business {
  id: string;
  name: string;
  businessType: BusinessType;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  logoUrl?: string;
  openingTime: string;
  closingTime: string;
  createdAt: string;
}

// ─── Offer ───────────────────────────────────────────────────────────────────
export type OfferStatus = 'Draft' | 'Active' | 'Paused' | 'Expired' | 'Cancelled';

export interface Offer {
  id: string;
  businessId: string;
  businessName: string;
  businessType: BusinessType;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalCapacity: number;
  maxBookingPerCustomer: number;
  termsAndConditions: string;
  status: OfferStatus;
  emoji: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Slot ────────────────────────────────────────────────────────────────────
export type SlotStatus = 'Available' | 'Full' | 'Closed' | 'Expired' | 'Cancelled';

export interface OfferSlot {
  id: string;
  offerId: string;
  offerTitle: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  availableCount: number;
  status: SlotStatus;
  createdAt: string;
}

// ─── Booking ─────────────────────────────────────────────────────────────────
export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Cancelled'
  | 'Completed'
  | 'NoShow';

export interface Booking {
  id: string;
  bookingReference: string;
  offerId: string;
  offerTitle: string;
  businessName: string;
  slotId: string;
  slotDate: string;
  slotTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  specialNote?: string;
  status: BookingStatus;
  createdAt: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardSummary {
  totalOffers: number;
  activeOffers: number;
  totalBookings: number;
  todaysBookings: number;
  totalCapacity: number;
  bookedSeats: number;
  availableSeats: number;
  conversionRate: number;
  weeklyData: { day: string; count: number }[];
}

// ─── Forms ───────────────────────────────────────────────────────────────────
export interface LoginForm {
  email: string;
  password: string;
}

export interface BookingForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  selectedSlotId: string;
  peopleCount: number;
  specialNote: string;
}

export interface OfferForm {
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  offerPrice: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalCapacity: number;
  maxBookingPerCustomer: number;
  termsAndConditions: string;
  status: OfferStatus;
}
