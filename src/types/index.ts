export type OrderStatus = 
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  salePrice?: number;
  discount?: number; // e.g. 10%
  stock: number;
  lowStockThreshold: number;
  unit: string; // e.g., 'Bottle', 'Pack', 'Bag', 'Drum'
  packSize: string; // e.g., '500 ml', '1 Litre', '250 gm', '1 kg'
  activeIngredient: string; // e.g., 'Imidacloprid', 'Emamectin Benzoate'
  concentration?: string; // e.g., '20% SL', '5% SG'
  formulation: string; // e.g., 'EC', 'SC', 'SL', 'WG', 'WP', 'GR'
  manufacturer: string;
  registrationNumber?: string;
  registrationStatus?: 'Registered' | 'Provisional' | 'Exempt';
  targetCrops: string[]; // Crop IDs or names
  targetPests: string[]; // Pest IDs or names
  targetDiseases: string[]; // Disease IDs or names
  usageInformation?: string;
  safetyInformation?: string;
  labelInformation?: string;
  batchNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  supplier?: string;
  purchasePrice?: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  status: 'active' | 'inactive' | 'draft';
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: string[];
  active: boolean;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  origin?: string;
  active: boolean;
  productCount?: number;
}

export interface Crop {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description: string;
  commonPests: string[];
  commonDiseases: string[];
  relatedProducts: string[];
}

export interface Pest {
  id: string;
  name: string;
  slug: string;
  urduName?: string;
  image?: string;
  description: string;
  affectedCrops: string[];
  symptoms: string[];
  recommendedIngredients: string[];
}

export interface Disease {
  id: string;
  name: string;
  slug: string;
  urduName?: string;
  image?: string;
  description: string;
  affectedCrops: string[];
  symptoms: string[];
  recommendedIngredients: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPrice: number;
}

export interface Address {
  fullName: string;
  mobile: string;
  whatsapp: string;
  province: string;
  city: string;
  tehsil: string;
  address: string;
  landmark?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  packSize: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string; // e.g. "AB-2026-8941"
  customer: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'COD' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  trackingUrl?: string;
  trackingNotes?: string;
  trackingEvents: TrackingEvent[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  city: string;
  tehsil: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerCity?: string;
  rating: number; // 1 to 5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  purchasePrice: number;
  salePrice: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expiring_soon';
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  cropId?: string;
  active: boolean;
  sortOrder: number;
}

export interface AgricultureGuide {
  id: string;
  title: string;
  slug: string;
  category: 'Crop Guide' | 'Pest Control' | 'Disease Management' | 'Weed Control' | 'Spray Tips' | 'Farmer Guide';
  crop?: string;
  readTime: string;
  publishedDate: string;
  summary: string;
  content: string;
  author: string;
  keyTakeaways: string[];
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  tehsil: string;
  district: string;
  province: string;
  country: string;
  currency: string;
  deliveryCoverage: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  businessHours: string;
  aboutText: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  whatsappGroupUrl?: string;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  easypaisaDetails: {
    accountTitle: string;
    mobileNumber: string;
  };
  jazzCashDetails: {
    accountTitle: string;
    mobileNumber: string;
  };
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  loginTime: string;
}
