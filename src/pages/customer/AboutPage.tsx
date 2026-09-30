import React from 'react';
import { ShieldCheck, Award, Truck, MapPin, Users, HeartHandshake, Sparkles } from 'lucide-react';
import { settingsService } from '../../services';
import logoImg from '../../assets/images/logo.jpg';

export const AboutPage: React.FC = () => {
  const settings = settingsService.get();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero with Logo Badge */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/50 mx-auto bg-[#07130e] p-1">
          <img
            src={logoImg}
            alt="Agro Baadshah Official Logo"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Solutions For A Better Tomorrow
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-stone-900 leading-tight mt-1">
            Empowering Pakistani Farmers with Authentic Agricultural Inputs
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-2">
            Headquartered in Main Gallah Mandi, Khanpur, Agro Baadshah has evolved into one of South Punjab’s most trusted
            crop protection and agronomy supply centers.
          </p>
        </div>
      </div>

      {/* Story & Background */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs leading-relaxed text-xs sm:text-sm text-stone-700">
        <h2 className="text-xl font-bold font-serif text-stone-900">Our Story & Mission</h2>
        <p>
          The agricultural economy of Pakistan relies on the relentless dedication of our farming community. Yet, the
          spread of spurious, diluted, or unverified pesticide products has long threatened farmer livelihoods. Agro
          Baadshah was founded on an unyielding principle: <strong>100% genuine inputs with zero tolerance for counterfeits</strong>.
        </p>
        <p>
          From our flagship store at Shop #33, Main Gallah Mandi, Khanpur, District Rahim Yar Khan, we partner directly
          with global multinational leaders—including Bayer CropScience, Syngenta, FMC, and Corteva—alongside renowned
          national manufacturers.
        </p>
        <p>
          Today, Agro Baadshah serves farmers and agricultural dealers not only across Khanpur, Rahim Yar Khan,
          Sadiqabad, and Liaquatpur, but nationwide through our specialized agricultural logistics network.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Guaranteed Genuine Products</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every product batch is secured with manufacturer security holograms, verified batch certificates, and
            transparent expiry dates.
          </p>
        </div>

        <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Expert Agronomic Advisory</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We provide actionable guidance on pest scouting thresholds (ETL), tank mixes, water conditioners, and
            proper spray nozzle calibration.
          </p>
        </div>

        <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Nationwide Delivery Network</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Rapid express courier dispatch for bottles and packs, plus verified bulk cargo services for commercial
            farms and retail stockists across Pakistan.
          </p>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-[#0b3826] text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Visit Us In Person</span>
          <h3 className="text-xl font-bold font-serif">Agro Baadshah Main Store</h3>
          <p className="text-xs text-stone-200">
            {settings.address}, Tehsil {settings.tehsil}, District {settings.district}, Punjab, Pakistan.
          </p>
        </div>
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-white text-[#0b3826] hover:bg-emerald-50 text-xs font-bold rounded-lg shadow shrink-0 transition"
        >
          Contact Shop Manager
        </a>
      </div>
    </div>
  );
};
