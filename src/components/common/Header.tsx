import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  Phone,
  Truck,
  Menu,
  X,
  Shield,
  MapPin,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { settingsService, productService, categoryService, cropService } from '../../services';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);

  const navigate = useNavigate();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const settings = settingsService.get();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchSuggestionsOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const allProducts = productService.getAll();
  const filteredSuggestions = searchQuery.trim()
    ? allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const categories = categoryService.getAll().filter((c) => c.active).slice(0, 6);
  const crops = cropService.getAll().slice(0, 6);

  const whatsappClean = settings.whatsapp.replace(/\D/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      {/* Top utility bar */}
      <div className="bg-[#0b3826] text-stone-200 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Main Gallah Mandi, Khanpur, Punjab
            </span>
            <span className="hidden md:inline-block text-stone-500">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-stone-300">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Delivery All Over Pakistan
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/track-order"
              className="flex items-center gap-1.5 text-white hover:text-emerald-300 transition-colors font-medium border-b border-dashed border-emerald-400/60 pb-0.5"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Track Order
            </Link>
            <span className="text-stone-600">|</span>
            <a
              href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                'Assalam-o-Alaikum Agro Baadshah, I want to inquire about agricultural products.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              {settings.phone}
            </a>
            <span className="text-stone-600">|</span>
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
              title="Admin Login"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo & Brand Identity */}
          <Link to="/" className="shrink-0 group hover:opacity-95 transition-opacity">
            <Logo size="md" showTagline={true} />
          </Link>

          {/* Search bar */}
          <div className="hidden md:block flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, active ingredients (e.g., Confidor, Belt, Flubendiamide)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchSuggestionsOpen(true);
                }}
                onFocus={() => setSearchSuggestionsOpen(true)}
                className="w-full pl-10 pr-24 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-300 focus:border-emerald-700 rounded-lg text-sm transition focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-semibold rounded-md transition-colors"
              >
                Search
              </button>
            </form>

            {/* Suggestions dropdown */}
            {searchSuggestionsOpen && filteredSuggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-stone-100"
                onMouseLeave={() => setSearchSuggestionsOpen(false)}
              >
                {filteredSuggestions.map((prod) => (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.slug}`}
                    onClick={() => setSearchSuggestionsOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-emerald-50/50 transition-colors"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded border border-stone-200 bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">{prod.name}</p>
                      <p className="text-xs text-stone-500 truncate">{prod.activeIngredient}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-800">
                        Rs. {(prod.salePrice || prod.price).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
                <Link
                  to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchSuggestionsOpen(false)}
                  className="block p-2 text-center text-xs font-semibold text-emerald-800 hover:bg-emerald-50 bg-stone-50"
                >
                  View all results for "{searchQuery}"
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions: Wishlist, Cart & Mobile button */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/wishlist"
              className="relative p-2 text-stone-700 hover:text-emerald-800 transition-colors rounded-lg hover:bg-stone-100"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 font-semibold rounded-lg transition-colors border border-emerald-200/70"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-800" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Cart</span>
              <span className="w-5 h-5 bg-[#0e4d34] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search pesticides, seeds, crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#0e4d34] text-white text-xs font-semibold rounded"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main navigation categories bar */}
      <nav className="hidden md:block bg-stone-50 border-t border-stone-200 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-stone-700">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="py-2.5 text-stone-900 hover:text-emerald-800 font-semibold border-b-2 border-transparent hover:border-emerald-800 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="py-2.5 text-stone-900 hover:text-emerald-800 font-semibold border-b-2 border-transparent hover:border-emerald-800 transition-colors"
            >
              All Products
            </Link>

            {/* Categories dropdown */}
            <div className="relative group py-2.5 cursor-pointer">
              <span className="flex items-center gap-1 hover:text-emerald-800">
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-stone-200 rounded-lg shadow-xl w-60 py-2 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    className="block px-4 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 text-xs font-medium"
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-stone-100 my-1"></div>
                <Link
                  to="/categories"
                  className="block px-4 py-1.5 text-emerald-800 font-semibold hover:bg-emerald-50 text-xs"
                >
                  View All Categories →
                </Link>
              </div>
            </div>

            {/* Shop by Crop */}
            <div className="relative group py-2.5 cursor-pointer">
              <span className="flex items-center gap-1 hover:text-emerald-800">
                Shop by Crop <ChevronDown className="w-3.5 h-3.5" />
              </span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-stone-200 rounded-lg shadow-xl w-56 py-2 z-50">
                {crops.map((crop) => (
                  <Link
                    key={crop.id}
                    to={`/shop?crop=${crop.id}`}
                    className="block px-4 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 text-xs font-medium"
                  >
                    {crop.name}
                  </Link>
                ))}
                <div className="border-t border-stone-100 my-1"></div>
                <Link
                  to="/crops"
                  className="block px-4 py-1.5 text-emerald-800 font-semibold hover:bg-emerald-50 text-xs"
                >
                  All Crops Guide →
                </Link>
              </div>
            </div>

            <Link
              to="/pests"
              className="py-2.5 hover:text-emerald-800 border-b-2 border-transparent hover:border-emerald-800 transition-colors"
            >
              Pests & Diseases
            </Link>
            <Link
              to="/guides"
              className="py-2.5 hover:text-emerald-800 border-b-2 border-transparent hover:border-emerald-800 transition-colors"
            >
              Agriculture Guide
            </Link>
            <Link
              to="/track-order"
              className="py-2.5 text-emerald-800 font-bold hover:text-emerald-950 border-b-2 border-transparent hover:border-emerald-800 transition-colors"
            >
              Track Order
            </Link>
            <Link
              to="/contact"
              className="py-2.5 hover:text-emerald-800 border-b-2 border-transparent hover:border-emerald-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <div className="py-2 text-stone-500">
            Helpline:{' '}
            <a href={`tel:${settings.phone}`} className="font-semibold text-stone-800 hover:underline">
              {settings.phone}
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-5 py-4 space-y-3">
          <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
            <Logo size="sm" showTagline={true} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-stone-900 py-1"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-stone-900 py-1"
          >
            All Products
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 py-1"
          >
            All Categories
          </Link>
          <Link
            to="/crops"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 py-1"
          >
            Shop by Crop
          </Link>
          <Link
            to="/pests"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 py-1"
          >
            Pest & Disease Solutions
          </Link>
          <Link
            to="/guides"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 py-1"
          >
            Farmer Agriculture Guide
          </Link>
          <Link
            to="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-emerald-800 py-1"
          >
            Track Order
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 py-1"
          >
            Contact & Gallah Mandi Shop
          </Link>
          <div className="border-t border-stone-100 pt-3">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-semibold text-stone-500 py-1"
            >
              <Shield className="w-4 h-4" /> Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
