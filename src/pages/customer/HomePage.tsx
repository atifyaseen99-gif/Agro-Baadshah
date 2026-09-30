import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  Award,
  Phone,
  CheckCircle2,
  BookOpen,
  Star,
  MapPin,
} from 'lucide-react';
import { CropSlider } from '../../components/customer/CropSlider';
import { ProductCard } from '../../components/common/ProductCard';
import {
  productService,
  categoryService,
  brandService,
  cropService,
  pestService,
  reviewService,
  guideService,
  settingsService,
} from '../../services';
import logoImg from '../../assets/images/logo.jpg';

export const HomePage: React.FC = () => {
  const products = productService.getAll();
  const categories = categoryService.getAll().filter((c) => c.active);
  const brands = brandService.getAll().filter((b) => b.active);
  const crops = cropService.getAll();
  const pests = pestService.getAll();
  const reviews = reviewService.getApproved().slice(0, 3);
  const guides = guideService.getAll().slice(0, 3);
  const settings = settingsService.get();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const specialOffers = products.filter((p) => p.salePrice && p.salePrice < p.price).slice(0, 4);

  const phoneClean = settings.whatsapp.replace(/\D/g, '');

  return (
    <div className="space-y-12 pb-16">
      {/* 2. Crop Image Slider */}
      <section>
        <CropSlider />
      </section>

      {/* 3. Main Hero / Shop CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#072418] via-[#0b3826] to-[#124d35] rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-emerald-800/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-2xl text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 shrink-0 bg-[#06140e] p-0.5">
              <img
                src={logoImg}
                alt="Agro Baadshah Official Seal"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                  Official Brand Seal
                </span>
                <span className="text-stone-400 text-xs">·</span>
                <span className="text-emerald-300 font-semibold text-xs tracking-wider">
                  Khanpur Mandi Retailer
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif leading-tight">
                Agro Baadshah — Solutions For A Better Tomorrow
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                Pakistan's trusted agricultural supplier for registered crop protection, insecticides, selective weedicides, and foliar nutrition. Fast, verified nationwide dispatch with cash on delivery.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <Link
              to="/shop"
              className="px-6 py-3 bg-white text-[#0a3524] hover:bg-emerald-50 font-bold text-xs rounded-xl text-center shadow transition-colors"
            >
              Browse All Products
            </Link>
            <a
              href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                'Assalam-o-Alaikum Agro Baadshah, please share your product catalog & dealer price list.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl text-center flex items-center justify-center gap-2 shadow transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
              <span>WhatsApp Inquiries</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Product Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Agro Baadshah Categories</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Explore by Category</h2>
          </div>
          <Link to="/categories" className="text-xs font-semibold text-emerald-800 hover:underline">
            View All ({categories.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group p-4 bg-white border border-stone-200/90 rounded-xl hover:border-emerald-600 transition-all hover:shadow-md flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-100 mb-3 border border-stone-200 group-hover:scale-105 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                {cat.subcategories ? `${cat.subcategories.length} Subtypes` : 'Agri-Inputs'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Recommended By Agronomists</span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Featured Crop Protectors</h2>
            </div>
            <Link to="/shop?filter=featured" className="text-xs font-semibold text-emerald-800 hover:underline">
              View All Featured →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Farmer Favorites</span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Best Selling Products</h2>
            </div>
            <Link to="/shop?sort=best_selling" className="text-xs font-semibold text-emerald-800 hover:underline">
              Shop Best Sellers →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Fresh Batch Stocks</span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">New Arrivals</h2>
            </div>
            <Link to="/shop?sort=newest" className="text-xs font-semibold text-emerald-800 hover:underline">
              Browse New Stock →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Special Offers */}
      {specialOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Save on Farm Inputs</span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Discounted Special Offers</h2>
              </div>
              <Link to="/shop?filter=discount" className="text-xs font-semibold text-emerald-800 hover:underline">
                View All Discounts →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {specialOffers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Popular Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Authorized Formulations</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Popular Multinationals & Brands</h2>
          </div>
          <Link to="/brands" className="text-xs font-semibold text-emerald-800 hover:underline">
            All Brands →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/shop?brand=${brand.id}`}
              className="p-3 bg-white border border-stone-200/80 rounded-xl hover:border-emerald-600 transition-all hover:shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-lg bg-stone-50 overflow-hidden mb-2 border border-stone-100 flex items-center justify-center p-1">
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-bold text-stone-800 group-hover:text-emerald-800 line-clamp-1">
                {brand.name}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5">{brand.origin || 'Pakistan'}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 10. Shop by Crop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tailored Agronomy</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Shop by Crop (فصل کے مطابق خریداری)</h2>
          </div>
          <Link to="/crops" className="text-xs font-semibold text-emerald-800 hover:underline">
            All Crops ({crops.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {crops.map((crop) => (
            <Link
              key={crop.id}
              to={`/shop?crop=${crop.id}`}
              className="group bg-white border border-stone-200/90 rounded-xl overflow-hidden hover:border-emerald-600 transition-all hover:shadow-md flex flex-col"
            >
              <div className="aspect-square bg-stone-100 overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-2.5 text-center">
                <h3 className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 truncate">
                  {crop.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 11. Pest & Disease Solutions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Pest Scouting & Defense</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Pest & Disease Solutions</h2>
          </div>
          <Link to="/pests" className="text-xs font-semibold text-emerald-800 hover:underline">
            Browse All Problems →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {pests.slice(0, 6).map((pest) => (
            <Link
              key={pest.id}
              to={`/shop?pest=${encodeURIComponent(pest.name)}`}
              className="p-4 bg-white border border-stone-200 rounded-xl hover:border-rose-600 transition-all hover:shadow-md flex flex-col group"
            >
              <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center font-bold text-lg mb-3">
                🪲
              </div>
              <h3 className="text-xs font-bold text-stone-900 group-hover:text-rose-700">
                {pest.name}
              </h3>
              {pest.urduName && (
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">{pest.urduName}</p>
              )}
              <span className="text-[10px] text-stone-400 mt-2">
                Affects: {pest.affectedCrops.slice(0, 2).join(', ')}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 12. Why Choose Agro Baadshah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-100/80 rounded-2xl p-6 sm:p-10 border border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Unmatched Reliability</span>
            <h2 className="text-2xl font-bold font-serif text-stone-900 mt-1">Why Farmers Trust Agro Baadshah</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Based in the agricultural heartland of Khanpur, Rahim Yar Khan, we bridge genuine manufacturing with farmer
              success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Zero Tolerance for Counterfeits</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Counterfeit pesticides ruin entire harvests. Every bottle, bag, and pack sold at Agro Baadshah comes with
                manufacturer holograms and verifiable batch numbers.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Doorstep Delivery Across Pakistan</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Whether you farm in Khanpur, Rahim Yar Khan, Sadiqabad, Bahawalpur, Multan, or Sindh, our courier and
                bulk cargo network delivers promptly.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Field-Tested Agronomic Advice</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We do not sell arbitrary chemicals. Our agronomists recommend exact active ingredients, proper water
                volume, and spray nozzles for your specific pest pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Agriculture Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Farmer Knowledge Hub</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">Agriculture Guides & Advisory</h2>
          </div>
          <Link to="/guides" className="text-xs font-semibold text-emerald-800 hover:underline">
            All Farmer Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              to={`/guide/${guide.slug}`}
              className="bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-600 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-emerald-800">{guide.category}</span>
                  <span>{guide.readTime}</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">{guide.summary}</p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800 mt-4">
                <span>Read Full Advisory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 14. Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Verified Farmer Reviews</span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-1">What Farmers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 bg-white border border-stone-200/90 rounded-xl space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">"{rev.comment}"</p>
              <div className="border-t border-stone-100 pt-2 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{rev.customerName}</span>
                <span className="text-stone-500">{rev.customerCity || 'Punjab'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 15. Delivery Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0b3826] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Nationwide Transit</span>
            <h3 className="text-xl font-bold font-serif">Delivery All Over Pakistan with Live Order Tracking</h3>
            <p className="text-xs text-stone-200 leading-relaxed">
              We dispatch via TCS Express, Leopard Courier, and heavy agro-cargo services. Free delivery on orders over
              Rs. {settings.freeDeliveryThreshold.toLocaleString()}!
            </p>
          </div>
          <Link
            to="/track-order"
            className="px-6 py-3 bg-white text-[#0b3826] hover:bg-emerald-50 font-bold text-xs rounded-lg shadow shrink-0 transition-colors"
          >
            Track Your Consignment
          </Link>
        </div>
      </section>

      {/* 16. WhatsApp CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-emerald-50 border-2 border-emerald-600/30 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-md">
            <MessageCircle className="w-6 h-6 fill-white stroke-[#25D366]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
            Order or Inquire Directly on WhatsApp
          </h3>
          <p className="text-xs text-stone-600 max-w-lg mx-auto leading-relaxed">
            Send us a photo of your affected crop leaf, weed, or borer worm. Our team will recommend the exact
            formulation and deliver it straight to your farm.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                'Assalam-o-Alaikum Agro Baadshah, I need agricultural advice for my crop.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-lg shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
              <span>Chat with Us ({settings.whatsapp})</span>
            </a>
          </div>
        </div>
      </section>

      {/* 17. Contact & Store Address Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Visit Our Shop</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {settings.address}, Tehsil {settings.tehsil}, District {settings.district}, Punjab, Pakistan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Call & Helpline</h4>
              <p className="text-xs text-stone-600 mt-1">{settings.phone}</p>
              <p className="text-xs text-stone-400 mt-0.5">{settings.businessHours}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Authorized Retail</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Genuine supply guaranteed for Khanpur, Rahim Yar Khan, Liaquatpur, and all Punjab farmers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
