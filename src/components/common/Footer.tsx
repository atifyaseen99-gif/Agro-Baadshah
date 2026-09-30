import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, Truck, Clock, AlertTriangle } from 'lucide-react';
import { settingsService } from '../../services';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const settings = settingsService.get();
  const whatsappClean = settings.whatsapp.replace(/\D/g, '');

  return (
    <footer className="bg-[#08281b] text-stone-300 pt-14 pb-8 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Core Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-emerald-950/60 text-stone-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Genuine Agri-Inputs</h4>
              <p className="text-xs text-stone-400 mt-1">
                Direct authorized channels from Bayer, Syngenta, FMC, and Corteva.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Fast Delivery Nationwide</h4>
              <p className="text-xs text-stone-400 mt-1">
                Reliable courier & cargo dispatch across Punjab, Sindh, KPK, and Balochistan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-400 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Expert Agronomy Advisory</h4>
              <p className="text-xs text-stone-400 mt-1">
                Consult with our field experts on WhatsApp before spraying your crop.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Live Order Tracking</h4>
              <p className="text-xs text-stone-400 mt-1">
                Real-time tracking from dispatch to delivery on our website.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block hover:opacity-95 transition-opacity">
              <Logo theme="dark" size="lg" showTagline={true} />
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Agro Baadshah is Pakistan's premier agricultural pesticides, weedicides, fungicides, and crop nutrition
              provider based in Khanpur, Rahim Yar Khan.
            </p>

            <div className="space-y-2.5 text-xs text-stone-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, Tehsil {settings.tehsil}, District {settings.district}, Punjab, Pakistan.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-emerald-300">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${whatsappClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-semibold"
                >
                  WhatsApp: {settings.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-emerald-300">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Product Categories</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/shop?category=cat-insecticides" className="hover:text-emerald-300">
                  Insecticides (حشرات کش)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-weedicides" className="hover:text-emerald-300">
                  Weedicides (جڑی بوٹی مار)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-fungicides" className="hover:text-emerald-300">
                  Fungicides (پھپھوندی کش)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-granules" className="hover:text-emerald-300">
                  Granules (دانے دار زہریں)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-fertilizers" className="hover:text-emerald-300">
                  Foliar Fertilizers & Zinc
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-emerald-400 font-medium hover:underline pt-1 inline-block">
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop by Crop */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Shop by Crop</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/shop?crop=crop-cotton" className="hover:text-emerald-300">
                  Cotton (کپاس)
                </Link>
              </li>
              <li>
                <Link to="/shop?crop=crop-wheat" className="hover:text-emerald-300">
                  Wheat (گندم)
                </Link>
              </li>
              <li>
                <Link to="/shop?crop=crop-rice" className="hover:text-emerald-300">
                  Rice / Paddy (دھان)
                </Link>
              </li>
              <li>
                <Link to="/shop?crop=crop-sugarcane" className="hover:text-emerald-300">
                  Sugarcane (کماد)
                </Link>
              </li>
              <li>
                <Link to="/shop?crop=crop-maize" className="hover:text-emerald-300">
                  Maize (مکئی)
                </Link>
              </li>
              <li>
                <Link to="/crops" className="text-emerald-400 font-medium hover:underline pt-1 inline-block">
                  All Crops Guide →
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Legal */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Service</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/track-order" className="text-emerald-300 font-semibold hover:underline">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-emerald-300">
                  Agriculture Knowledge Hub
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-300">
                  About Agro Baadshah
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-300">
                  Gallah Mandi Shop Contact
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-policy" className="hover:text-emerald-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="hover:text-emerald-300">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/shipping" className="hover:text-emerald-300">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/legal/disclaimer" className="hover:text-emerald-300">
                  Pesticide Safety Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-[#051c13] p-4 rounded-lg border border-emerald-950 text-[11px] text-stone-400 flex items-start gap-3 my-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-stone-300">Pesticide Safety & Regulatory Disclaimer:</span>
            <p>
              Agro Baadshah supplies authentic registered agrochemicals for agricultural pest, weed, and disease
              management. Always read and strictly follow label instructions regarding dosage, safety interval (PHI),
              protective clothing, and disposal. Keep all agricultural pesticides securely locked away from children and
              livestock.
            </p>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Agro Baadshah. All rights reserved. Khanpur, Rahim Yar Khan, Punjab.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="text-stone-500 hover:text-stone-300 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
