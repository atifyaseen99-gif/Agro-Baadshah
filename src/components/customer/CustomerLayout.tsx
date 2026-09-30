import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { CartDrawer } from './CartDrawer';
import { FloatingWhatsApp } from '../common/FloatingWhatsApp';

export const CustomerLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfb] text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      <Header />
      <CartDrawer />
      <FloatingWhatsApp />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
