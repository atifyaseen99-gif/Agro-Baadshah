import {
  Product,
  Category,
  Brand,
  Crop,
  Pest,
  Disease,
  SliderItem,
  StoreSettings,
  Order,
  OrderStatus,
  TrackingEvent,
  Review,
  Coupon,
  AgricultureGuide,
  AdminSession,
} from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import {
  initialStoreSettings,
  initialCategories,
  initialBrands,
  initialCrops,
  initialPests,
  initialDiseases,
  initialProducts,
  initialSliderItems,
  initialCoupons,
  initialOrders,
  initialReviews,
  initialGuides,
} from '../data/seedData';

// --- Initialization ---
export const initializeData = (): void => {
  if (!storage.get<Product[] | null>(STORAGE_KEYS.PRODUCTS, null)) {
    storage.set(STORAGE_KEYS.PRODUCTS, initialProducts);
  }
  if (!storage.get<Category[] | null>(STORAGE_KEYS.CATEGORIES, null)) {
    storage.set(STORAGE_KEYS.CATEGORIES, initialCategories);
  }
  if (!storage.get<Brand[] | null>(STORAGE_KEYS.BRANDS, null)) {
    storage.set(STORAGE_KEYS.BRANDS, initialBrands);
  }
  if (!storage.get<Crop[] | null>(STORAGE_KEYS.CROPS, null)) {
    storage.set(STORAGE_KEYS.CROPS, initialCrops);
  }
  if (!storage.get<Pest[] | null>(STORAGE_KEYS.PESTS, null)) {
    storage.set(STORAGE_KEYS.PESTS, initialPests);
  }
  if (!storage.get<Disease[] | null>(STORAGE_KEYS.DISEASES, null)) {
    storage.set(STORAGE_KEYS.DISEASES, initialDiseases);
  }
  if (!storage.get<SliderItem[] | null>(STORAGE_KEYS.HOMEPAGE_SLIDER, null)) {
    storage.set(STORAGE_KEYS.HOMEPAGE_SLIDER, initialSliderItems);
  }
  const existingSettings = storage.get<StoreSettings | null>(STORAGE_KEYS.SETTINGS, null);
  if (!existingSettings) {
    storage.set(STORAGE_KEYS.SETTINGS, initialStoreSettings);
  } else if (!existingSettings.tagline || existingSettings.tagline.includes('Leading Agricultural')) {
    storage.set(STORAGE_KEYS.SETTINGS, { ...existingSettings, tagline: 'Solutions For A Better Tomorrow' });
  }
  if (!storage.get<Coupon[] | null>(STORAGE_KEYS.COUPONS, null)) {
    storage.set(STORAGE_KEYS.COUPONS, initialCoupons);
  }
  if (!storage.get<Order[] | null>(STORAGE_KEYS.ORDERS, null)) {
    storage.set(STORAGE_KEYS.ORDERS, initialOrders);
  }
  if (!storage.get<Review[] | null>(STORAGE_KEYS.REVIEWS, null)) {
    storage.set(STORAGE_KEYS.REVIEWS, initialReviews);
  }
  if (!storage.get<AgricultureGuide[] | null>(STORAGE_KEYS.AGRICULTURE_GUIDES, null)) {
    storage.set(STORAGE_KEYS.AGRICULTURE_GUIDES, initialGuides);
  }
};

// --- Products Service ---
export const productService = {
  getAll(): Product[] {
    return storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  },
  getById(id: string): Product | undefined {
    return this.getAll().find((p) => p.id === id);
  },
  getBySlug(slug: string): Product | undefined {
    return this.getAll().find((p) => p.slug === slug);
  },
  save(product: Product): Product {
    const products = this.getAll();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      products.unshift({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },
  delete(id: string): void {
    const products = this.getAll().filter((p) => p.id !== id);
    storage.set(STORAGE_KEYS.PRODUCTS, products);
  },
  updateStock(id: string, newStock: number): void {
    const products = this.getAll().map((p) =>
      p.id === id ? { ...p, stock: Math.max(0, newStock), updatedAt: new Date().toISOString() } : p
    );
    storage.set(STORAGE_KEYS.PRODUCTS, products);
  },
};

// --- Categories Service ---
export const categoryService = {
  getAll(): Category[] {
    return storage.get<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  },
  getById(id: string): Category | undefined {
    return this.getAll().find((c) => c.id === id);
  },
  getBySlug(slug: string): Category | undefined {
    return this.getAll().find((c) => c.slug === slug);
  },
  save(category: Category): Category {
    const categories = this.getAll();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    storage.set(STORAGE_KEYS.CATEGORIES, categories);
    return category;
  },
  delete(id: string): void {
    const categories = this.getAll().filter((c) => c.id !== id);
    storage.set(STORAGE_KEYS.CATEGORIES, categories);
  },
};

// --- Brands Service ---
export const brandService = {
  getAll(): Brand[] {
    return storage.get<Brand[]>(STORAGE_KEYS.BRANDS, initialBrands);
  },
  getById(id: string): Brand | undefined {
    return this.getAll().find((b) => b.id === id);
  },
  getBySlug(slug: string): Brand | undefined {
    return this.getAll().find((b) => b.slug === slug);
  },
  save(brand: Brand): Brand {
    const brands = this.getAll();
    const index = brands.findIndex((b) => b.id === brand.id);
    if (index >= 0) {
      brands[index] = brand;
    } else {
      brands.push(brand);
    }
    storage.set(STORAGE_KEYS.BRANDS, brands);
    return brand;
  },
  delete(id: string): void {
    const brands = this.getAll().filter((b) => b.id !== id);
    storage.set(STORAGE_KEYS.BRANDS, brands);
  },
};

// --- Crops Service ---
export const cropService = {
  getAll(): Crop[] {
    return storage.get<Crop[]>(STORAGE_KEYS.CROPS, initialCrops);
  },
  getById(id: string): Crop | undefined {
    return this.getAll().find((c) => c.id === id);
  },
  getBySlug(slug: string): Crop | undefined {
    return this.getAll().find((c) => c.slug === slug);
  },
  save(crop: Crop): Crop {
    const crops = this.getAll();
    const index = crops.findIndex((c) => c.id === crop.id);
    if (index >= 0) {
      crops[index] = crop;
    } else {
      crops.push(crop);
    }
    storage.set(STORAGE_KEYS.CROPS, crops);
    return crop;
  },
  delete(id: string): void {
    const crops = this.getAll().filter((c) => c.id !== id);
    storage.set(STORAGE_KEYS.CROPS, crops);
  },
};

// --- Pests Service ---
export const pestService = {
  getAll(): Pest[] {
    return storage.get<Pest[]>(STORAGE_KEYS.PESTS, initialPests);
  },
  getById(id: string): Pest | undefined {
    return this.getAll().find((p) => p.id === id);
  },
  getBySlug(slug: string): Pest | undefined {
    return this.getAll().find((p) => p.slug === slug);
  },
  save(pest: Pest): Pest {
    const pests = this.getAll();
    const index = pests.findIndex((p) => p.id === pest.id);
    if (index >= 0) {
      pests[index] = pest;
    } else {
      pests.push(pest);
    }
    storage.set(STORAGE_KEYS.PESTS, pests);
    return pest;
  },
  delete(id: string): void {
    const pests = this.getAll().filter((p) => p.id !== id);
    storage.set(STORAGE_KEYS.PESTS, pests);
  },
};

// --- Diseases Service ---
export const diseaseService = {
  getAll(): Disease[] {
    return storage.get<Disease[]>(STORAGE_KEYS.DISEASES, initialDiseases);
  },
  getById(id: string): Disease | undefined {
    return this.getAll().find((d) => d.id === id);
  },
  getBySlug(slug: string): Disease | undefined {
    return this.getAll().find((d) => d.slug === slug);
  },
  save(disease: Disease): Disease {
    const list = this.getAll();
    const index = list.findIndex((d) => d.id === disease.id);
    if (index >= 0) {
      list[index] = disease;
    } else {
      list.push(disease);
    }
    storage.set(STORAGE_KEYS.DISEASES, list);
    return disease;
  },
  delete(id: string): void {
    const list = this.getAll().filter((d) => d.id !== id);
    storage.set(STORAGE_KEYS.DISEASES, list);
  },
};

// --- Homepage Slider Service ---
export const sliderService = {
  getAll(): SliderItem[] {
    return storage
      .get<SliderItem[]>(STORAGE_KEYS.HOMEPAGE_SLIDER, initialSliderItems)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  getActive(): SliderItem[] {
    return this.getAll().filter((s) => s.active);
  },
  save(slide: SliderItem): SliderItem {
    const slides = this.getAll();
    const index = slides.findIndex((s) => s.id === slide.id);
    if (index >= 0) {
      slides[index] = slide;
    } else {
      slides.push(slide);
    }
    storage.set(STORAGE_KEYS.HOMEPAGE_SLIDER, slides);
    return slide;
  },
  delete(id: string): void {
    const slides = this.getAll().filter((s) => s.id !== id);
    storage.set(STORAGE_KEYS.HOMEPAGE_SLIDER, slides);
  },
};

// --- Orders & Tracking Service ---
const statusProgression: OrderStatus[] = [
  'PLACED',
  'CONFIRMED',
  'PROCESSING',
  'DISPATCHED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const statusDescriptions: Record<OrderStatus, { title: string; desc: string }> = {
  PLACED: { title: 'Order Placed', desc: 'Customer submitted order on Agro Baadshah store.' },
  CONFIRMED: { title: 'Order Confirmed', desc: 'Order verified and approved by Agro Baadshah.' },
  PROCESSING: { title: 'Processing & Packed', desc: 'Agricultural inputs gathered, inspected, and packed.' },
  DISPATCHED: { title: 'Dispatched via Courier', desc: 'Consignment handed to courier hub for transit.' },
  OUT_FOR_DELIVERY: { title: 'Out for Delivery', desc: 'Courier rider is en route to your address.' },
  DELIVERED: { title: 'Delivered', desc: 'Order safely delivered to recipient.' },
  CANCELLED: { title: 'Order Cancelled', desc: 'Order has been cancelled.' },
};

export const orderService = {
  getAll(): Order[] {
    return storage.get<Order[]>(STORAGE_KEYS.ORDERS, initialOrders);
  },
  getById(id: string): Order | undefined {
    return this.getAll().find(
      (o) => o.id.trim().toUpperCase() === id.trim().toUpperCase()
    );
  },
  search(orderIdOrPhone: string): Order | undefined {
    const query = orderIdOrPhone.trim().toLowerCase();
    if (!query) return undefined;
    return this.getAll().find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.customer.mobile.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === query)
    );
  },
  create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingEvents' | 'orderStatus'>): Order {
    const now = new Date();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AB-${now.getFullYear()}-${randomDigits}`;

    const initialEvent: TrackingEvent = {
      id: `evt-${Date.now()}-1`,
      status: 'PLACED',
      title: 'Order Placed',
      description: 'Order placed online successfully via Agro Baadshah.',
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: true,
    };

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderStatus: 'PLACED',
      trackingEvents: [initialEvent],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Decrement stock for ordered items
    orderData.items.forEach((item) => {
      const prod = productService.getById(item.productId);
      if (prod) {
        productService.updateStock(prod.id, prod.stock - item.quantity);
      }
    });

    const orders = this.getAll();
    orders.unshift(newOrder);
    storage.set(STORAGE_KEYS.ORDERS, orders);

    return newOrder;
  },
  updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    details?: {
      trackingNumber?: string;
      courierName?: string;
      trackingUrl?: string;
      trackingNotes?: string;
    }
  ): Order | undefined {
    const orders = this.getAll();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return undefined;

    const order = orders[orderIndex];
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update or generate tracking events
    const updatedEvents = [...order.trackingEvents];

    if (newStatus === 'CANCELLED') {
      updatedEvents.push({
        id: `evt-${Date.now()}`,
        status: 'CANCELLED',
        title: 'Order Cancelled',
        description: details?.trackingNotes || 'Order was cancelled by store administrator.',
        date: dateStr,
        time: timeStr,
        completed: true,
      });
    } else {
      const targetIndex = statusProgression.indexOf(newStatus);
      statusProgression.forEach((st, idx) => {
        let existing = updatedEvents.find((e) => e.status === st);
        if (idx <= targetIndex) {
          if (!existing) {
            existing = {
              id: `evt-${Date.now()}-${idx}`,
              status: st,
              title: statusDescriptions[st].title,
              description: statusDescriptions[st].desc,
              date: dateStr,
              time: timeStr,
              completed: true,
            };
            updatedEvents.push(existing);
          } else {
            existing.completed = true;
          }
        } else if (existing) {
          existing.completed = false;
        }
      });
    }

    const updatedOrder: Order = {
      ...order,
      orderStatus: newStatus,
      trackingNumber: details?.trackingNumber ?? order.trackingNumber,
      courierName: details?.courierName ?? order.courierName,
      trackingUrl: details?.trackingUrl ?? order.trackingUrl,
      trackingNotes: details?.trackingNotes ?? order.trackingNotes,
      trackingEvents: updatedEvents,
      updatedAt: now.toISOString(),
    };

    orders[orderIndex] = updatedOrder;
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return updatedOrder;
  },
};

// --- Store Settings Service ---
export const settingsService = {
  get(): StoreSettings {
    return storage.get<StoreSettings>(STORAGE_KEYS.SETTINGS, initialStoreSettings);
  },
  update(newSettings: Partial<StoreSettings>): StoreSettings {
    const current = this.get();
    const updated = { ...current, ...newSettings };
    storage.set(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },
};

// --- Coupons Service ---
export const couponService = {
  getAll(): Coupon[] {
    return storage.get<Coupon[]>(STORAGE_KEYS.COUPONS, initialCoupons);
  },
  save(coupon: Coupon): Coupon {
    const coupons = this.getAll();
    const index = coupons.findIndex((c) => c.id === coupon.id);
    if (index >= 0) {
      coupons[index] = coupon;
    } else {
      coupons.push(coupon);
    }
    storage.set(STORAGE_KEYS.COUPONS, coupons);
    return coupon;
  },
  delete(id: string): void {
    const list = this.getAll().filter((c) => c.id !== id);
    storage.set(STORAGE_KEYS.COUPONS, list);
  },
  validate(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const coupon = this.getAll().find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon || !coupon.active) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Coupon requires minimum order of Rs. ${coupon.minOrderAmount.toLocaleString()}.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return { valid: true, discount, message: `Coupon applied: Rs. ${discount.toLocaleString()} off!`, coupon };
  },
};

// --- Reviews Service ---
export const reviewService = {
  getAll(): Review[] {
    return storage.get<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews);
  },
  getApproved(): Review[] {
    return this.getAll().filter((r) => r.status === 'approved');
  },
  getByProductId(productId: string): Review[] {
    return this.getApproved().filter((r) => r.productId === productId);
  },
  add(review: Omit<Review, 'id' | 'date' | 'status'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'approved', // Auto-approved for prototype
    };
    const list = this.getAll();
    list.unshift(newRev);
    storage.set(STORAGE_KEYS.REVIEWS, list);
    return newRev;
  },
  updateStatus(id: string, status: 'approved' | 'rejected'): void {
    const list = this.getAll().map((r) => (r.id === id ? { ...r, status } : r));
    storage.set(STORAGE_KEYS.REVIEWS, list);
  },
  delete(id: string): void {
    const list = this.getAll().filter((r) => r.id !== id);
    storage.set(STORAGE_KEYS.REVIEWS, list);
  },
};

// --- Guides Service ---
export const guideService = {
  getAll(): AgricultureGuide[] {
    return storage.get<AgricultureGuide[]>(STORAGE_KEYS.AGRICULTURE_GUIDES, initialGuides);
  },
  getBySlug(slug: string): AgricultureGuide | undefined {
    return this.getAll().find((g) => g.slug === slug);
  },
  save(guide: AgricultureGuide): AgricultureGuide {
    const list = this.getAll();
    const index = list.findIndex((g) => g.id === guide.id);
    if (index >= 0) {
      list[index] = guide;
    } else {
      list.push(guide);
    }
    storage.set(STORAGE_KEYS.AGRICULTURE_GUIDES, list);
    return guide;
  },
  delete(id: string): void {
    const list = this.getAll().filter((g) => g.id !== id);
    storage.set(STORAGE_KEYS.AGRICULTURE_GUIDES, list);
  },
};

// --- Admin Authentication Service ---
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = 'agro1803';

export const authService = {
  getSession(): AdminSession | null {
    return storage.get<AdminSession | null>(STORAGE_KEYS.ADMIN_SESSION, null);
  },
  isAuthenticated(): boolean {
    const session = this.getSession();
    return Boolean(session && session.isAuthenticated);
  },
  login(username: string, pass: string): boolean {
    if (username.trim() === ADMIN_USERNAME && pass === ADMIN_PASSWORD_HASH) {
      const session: AdminSession = {
        isAuthenticated: true,
        username: ADMIN_USERNAME,
        loginTime: new Date().toISOString(),
      };
      storage.set(STORAGE_KEYS.ADMIN_SESSION, session);
      return true;
    }
    return false;
  },
  logout(): void {
    storage.remove(STORAGE_KEYS.ADMIN_SESSION);
  },
};
