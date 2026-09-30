/**
 * Agro Baadshah LocalStorage Utility Layer
 * Handles robust typed serialization, quota protections, and import/export capabilities.
 */

export const STORAGE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  CROPS: 'crops',
  PESTS: 'pests',
  DISEASES: 'diseases',
  CART: 'cart',
  WISHLIST: 'wishlist',
  RECENTLY_VIEWED: 'recentlyViewed',
  CUSTOMERS: 'customers',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  COUPONS: 'coupons',
  INVENTORY: 'inventory',
  SETTINGS: 'settings',
  ADMIN_SESSION: 'adminSession',
  STORE_CONFIG: 'storeConfig',
  HOMEPAGE_SLIDER: 'homepageSlider',
  ORDER_TRACKING: 'orderTracking',
  AGRICULTURE_GUIDES: 'agricultureGuides',
} as const;

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[LocalStorage] Error reading key "${key}":`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[LocalStorage] Error writing key "${key}":`, error);
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
        alert('Browser storage quota reached. Consider removing old data or uploading smaller images.');
      }
      return false;
    }
  },

  update<T>(key: string, updater: (current: T) => T, defaultValue: T): T {
    const current = this.get<T>(key, defaultValue);
    const updated = updater(current);
    this.set(key, updated);
    return updated;
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[LocalStorage] Error removing key "${key}":`, error);
    }
  },

  clearAll(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('[LocalStorage] Error clearing storage:', error);
    }
  },

  exportAll(): string {
    const backup: Record<string, unknown> = {
      _exportDate: new Date().toISOString(),
      _app: 'Agro Baadshah',
      _version: '1.0.0',
    };

    Object.values(STORAGE_KEYS).forEach((key) => {
      // Exclude session from public backup export for safety
      if (key === STORAGE_KEYS.ADMIN_SESSION) return;
      const data = localStorage.getItem(key);
      if (data) {
        try {
          backup[key] = JSON.parse(data);
        } catch {
          backup[key] = data;
        }
      }
    });

    return JSON.stringify(backup, null, 2);
  },

  importAll(jsonString: string): { success: boolean; message: string; keysRestored?: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || parsed === null) {
        return { success: false, message: 'Invalid backup file format.' };
      }

      let count = 0;
      Object.keys(parsed).forEach((key) => {
        if (key.startsWith('_')) return; // Metadata
        if (key === STORAGE_KEYS.ADMIN_SESSION) return; // Don't tamper session
        localStorage.setItem(key, JSON.stringify(parsed[key]));
        count++;
      });

      return {
        success: true,
        message: `Backup restored successfully! ${count} data collections updated.`,
        keysRestored: count,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to parse JSON file';
      return { success: false, message };
    }
  },
};
