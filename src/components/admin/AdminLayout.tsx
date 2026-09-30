import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  Sprout,
  Bug,
  Activity,
  ShoppingBag,
  Truck,
  Users,
  Boxes,
  Tag,
  Star,
  BookOpen,
  Sliders,
  Settings,
  Database,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/images/logo.jpg';

export const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/brands', label: 'Brands', icon: Award },
    { to: '/admin/crops', label: 'Crops', icon: Sprout },
    { to: '/admin/pests', label: 'Pests', icon: Bug },
    { to: '/admin/diseases', label: 'Diseases', icon: Activity },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/order-tracking', label: 'Order Tracking', icon: Truck },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/agriculture-guide', label: 'Agriculture Guide', icon: BookOpen },
    { to: '/admin/homepage-slider', label: 'Homepage Slider', icon: Sliders },
    { to: '/admin/settings', label: 'Store Settings', icon: Settings },
    { to: '/admin/backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a3322] text-stone-200 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="p-4 border-b border-emerald-900/60 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-amber-500/40 shrink-0 bg-[#06140e]">
                <img src={logoImg} alt="Agro Baadshah" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-bold text-white text-sm tracking-tight block">Agro Baadshah</span>
                <span className="text-[10px] text-amber-400 font-medium">Administration Panel</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-stone-400 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links scroll */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 text-xs font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      isActive
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-stone-300 hover:bg-emerald-900/40 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom user & logout section */}
          <div className="p-3 border-t border-emerald-900/60 space-y-2 bg-[#072418]">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-stone-300 hover:bg-emerald-900/40 hover:text-white transition"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-stone-700 hidden sm:inline">
              Agro Baadshah Management
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline text-stone-500 font-medium">
              Khanpur Mandi Shop #33
            </span>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-900 font-semibold rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Admin Online</span>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
