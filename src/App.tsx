/**
 * Agro Baadshah — Pakistan's Agricultural Pesticides & Agri-Inputs Store
 * Main Application Routing & Context Providers
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { initializeData } from './services';

// Layouts
import { CustomerLayout } from './components/customer/CustomerLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CategoriesPage } from './pages/customer/CategoriesPage';
import { CropsPage } from './pages/customer/CropsPage';
import { PestsPage } from './pages/customer/PestsPage';
import { BrandsPage } from './pages/customer/BrandsPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { TrackOrderPage } from './pages/customer/TrackOrderPage';
import { GuidesPage } from './pages/customer/GuidesPage';
import { GuideDetailPage } from './pages/customer/GuideDetailPage';
import { ContactPage } from './pages/customer/ContactPage';
import { AboutPage } from './pages/customer/AboutPage';
import { LegalPolicyPage } from './pages/customer/LegalPolicyPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBrandsPage } from './pages/admin/AdminBrandsPage';
import { AdminCropsPage } from './pages/admin/AdminCropsPage';
import { AdminPestsPage } from './pages/admin/AdminPestsPage';
import { AdminDiseasesPage } from './pages/admin/AdminDiseasesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderTrackingPage } from './pages/admin/AdminOrderTrackingPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminGuidesPage } from './pages/admin/AdminGuidesPage';
import { AdminSliderPage } from './pages/admin/AdminSliderPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminBackupPage } from './pages/admin/AdminBackupPage';

export default function App() {
  useEffect(() => {
    // Seed initial authentic agricultural data if LocalStorage is empty
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer Store Routes */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/crops" element={<CropsPage />} />
                  <Route path="/pests" element={<PestsPage />} />
                  <Route path="/brands" element={<BrandsPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/guides" element={<GuidesPage />} />
                  <Route path="/guide/:slug" element={<GuideDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/legal/:page" element={<LegalPolicyPage />} />
                </Route>

                {/* Admin Authentication (Public Login) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="brands" element={<AdminBrandsPage />} />
                  <Route path="crops" element={<AdminCropsPage />} />
                  <Route path="pests" element={<AdminPestsPage />} />
                  <Route path="diseases" element={<AdminDiseasesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="order-tracking" element={<AdminOrderTrackingPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="agriculture-guide" element={<AdminGuidesPage />} />
                  <Route path="homepage-slider" element={<AdminSliderPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="backup" element={<AdminBackupPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
