import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  MessageCircle,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Share2,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import {
  productService,
  brandService,
  categoryService,
  reviewService,
  settingsService,
} from '../../services';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = productService.getBySlug(slug || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'usage' | 'safety' | 'specs' | 'reviews'>('usage');

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">The requested agricultural product does not exist.</p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-lg"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const brand = brandService.getById(product.brandId);
  const category = categoryService.getById(product.categoryId);
  const reviews = reviewService.getByProductId(product.id);
  const settings = settingsService.get();
  const inWishlist = isInWishlist(product.id);

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice! : product.price;
  const isOutOfStock = product.stock <= 0;

  // Related products from same category
  const relatedProducts = productService
    .getAll()
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    showToast(`Added ${quantity} × "${product.name}" to cart.`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const phoneClean = settings.whatsapp.replace(/\D/g, '');
    const message = `Assalam-o-Alaikum Agro Baadshah, I want to order:\n\n*Product:* ${product.name}\n*Active Ingredient:* ${product.activeIngredient}\n*Pack Size:* ${product.packSize}\n*Quantity:* ${quantity}\n*Price:* Rs. ${(currentPrice * quantity).toLocaleString()}\n\nPlease confirm availability and dispatch to my location.`;
    window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    reviewService.add({
      productId: product.id,
      productName: product.name,
      customerName: reviewName.trim(),
      customerCity: reviewCity.trim() || 'Punjab',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    showToast('Thank you! Your farmer review has been posted.');
    setReviewName('');
    setReviewCity('');
    setReviewComment('');
    setActiveTab('reviews');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-emerald-800">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to="/shop" className="hover:text-emerald-800">
          Products
        </Link>
        {category && (
          <>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <Link to={`/shop?category=${category.id}`} className="hover:text-emerald-800">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs relative">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.bestSeller && (
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#0e4d34] text-white text-[11px] font-bold rounded uppercase tracking-wider shadow">
                Best Seller
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                    selectedImageIndex === idx
                      ? 'border-emerald-700 ring-2 ring-emerald-100'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {brand?.name || 'Agro Baadshah Certified'}
              </span>
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
                }}
                className={`p-2 rounded-full border transition ${
                  inWishlist
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'text-stone-500 hover:text-rose-600 border-stone-200'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
              {product.name}
            </h1>

            <p className="text-sm font-semibold text-emerald-900 mt-1">
              Active Ingredient: {product.activeIngredient} {product.concentration && `(${product.concentration})`}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="ml-1 font-bold text-stone-800">{product.rating.toFixed(1)}</span>
              </div>
              <span>·</span>
              <span>{reviews.length} Verified Reviews</span>
              <span>·</span>
              <span>SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-stone-50 border border-stone-200/90 rounded-xl space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#093b27]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-stone-400 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
              {hasDiscount && (
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-xs rounded">
                  Save Rs. {(product.price - currentPrice).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Pack Size: <span className="font-bold text-stone-800">{product.packSize}</span> · Price inclusive of all
              standard taxes.
            </p>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{product.shortDescription}</p>

          {/* Key Quick Attributes */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-stone-200 rounded-lg p-3">
            <div>
              <span className="text-stone-400">Formulation:</span>
              <p className="font-semibold text-stone-800">{product.formulation}</p>
            </div>
            <div>
              <span className="text-stone-400">Manufacturer:</span>
              <p className="font-semibold text-stone-800">{product.manufacturer}</p>
            </div>
            <div>
              <span className="text-stone-400">Stock Status:</span>
              <p
                className={`font-semibold ${
                  isOutOfStock
                    ? 'text-rose-600'
                    : product.stock <= product.lowStockThreshold
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : product.stock <= product.lowStockThreshold
                  ? `Low Stock (${product.stock} left)`
                  : 'In Stock (Ready to dispatch)'}
              </p>
            </div>
            <div>
              <span className="text-stone-400">Expiry Date:</span>
              <p className="font-semibold text-stone-800">{product.expiryDate || '2 Years from Mfg'}</p>
            </div>
          </div>

          {/* Target Crops & Pests Badges */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Target Crops (فصلیں)</span>
            <div className="flex flex-wrap gap-1.5">
              {product.targetCrops.map((crop, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-md"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-stone-600 hover:bg-stone-100 rounded-l-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-xs text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-stone-600 hover:bg-stone-100 rounded-r-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs rounded-lg transition disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-800" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-4 bg-[#0e4d34] hover:bg-[#093926] text-white font-bold text-xs rounded-lg shadow transition disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-lg shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
              <span>Order via WhatsApp Direct (+92 314 4047044)</span>
            </button>
          </div>

          {/* Delivery & Assurance bullet points */}
          <div className="border-t border-stone-200 pt-4 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Free Delivery on orders above Rs. {settings.freeDeliveryThreshold.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>100% Genuine product with original manufacturer hologram</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Dispatched from Main Gallah Mandi, Khanpur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Usage, Safety, Specs, Reviews */}
      <div className="border-t border-stone-200 pt-8">
        <div className="flex border-b border-stone-200 gap-4 sm:gap-8 overflow-x-auto text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'usage'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Usage Instructions & Dosage
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'safety'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Safety & Precautions
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'specs'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Batch & Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Farmer Reviews ({reviews.length})
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'usage' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-stone-900">Recommended Field Application:</h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {product.usageInformation ||
                  'Dilute standard dosage in 100-120 liters of clean water per acre. Spray early morning or late afternoon for maximum canopy absorption.'}
              </p>

              {product.targetPests.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-stone-800 block mb-1">Target Pests Controlled:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.targetPests.map((pest, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 text-xs rounded border border-rose-200">
                        {pest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.targetDiseases.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-stone-800 block mb-1">Target Diseases Prevented:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.targetDiseases.map((dis, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-800 text-xs rounded border border-purple-200">
                        {dis}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-950">Statutory Precautionary Notice</h4>
                  <p className="leading-relaxed">
                    {product.safetyInformation ||
                      'Always wear protective rubber gloves, mask, and long clothes. Never eat or smoke during pesticide application. Keep locked away from children.'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-2 pt-2">
                <p>• <strong>Pre-Harvest Interval (PHI):</strong> Follow standard 7 to 14 days interval before harvesting crop.</p>
                <p>• <strong>Container Disposal:</strong> Triple-rinse empty bottle/bag and puncture; do not use for food or water storage.</p>
                <p>• <strong>First Aid:</strong> In case of skin or eye contact, immediately flush with copious running water for 15 minutes.</p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-xl">
              <table className="w-full text-xs text-left text-stone-700 border border-stone-200 rounded-lg overflow-hidden divide-y divide-stone-200">
                <tbody>
                  <tr className="divide-x divide-stone-200">
                    <td className="p-2.5 font-bold bg-stone-50 w-1/3">Batch Number</td>
                    <td className="p-2.5">{product.batchNumber || 'BT-2026-PAK'}</td>
                  </tr>
                  <tr className="divide-x divide-stone-200">
                    <td className="p-2.5 font-bold bg-stone-50">Manufacturing Date</td>
                    <td className="p-2.5">{product.manufacturingDate || '2026-01-15'}</td>
                  </tr>
                  <tr className="divide-x divide-stone-200">
                    <td className="p-2.5 font-bold bg-stone-50">Expiry Date</td>
                    <td className="p-2.5">{product.expiryDate || '2028-01-14'}</td>
                  </tr>
                  <tr className="divide-x divide-stone-200">
                    <td className="p-2.5 font-bold bg-stone-50">Registration Number</td>
                    <td className="p-2.5">{product.registrationNumber || 'Original Reg.'}</td>
                  </tr>
                  <tr className="divide-x divide-stone-200">
                    <td className="p-2.5 font-bold bg-stone-50">Registration Status</td>
                    <td className="p-2.5">{product.registrationStatus || 'Registered'}</td>
                  </tr>
                  <tr className="divide-x divide-stone-200">
                    <td className="p-2.5 font-bold bg-stone-50">Supplier Channel</td>
                    <td className="p-2.5">{product.supplier || 'Agro Baadshah Khanpur'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">No reviews yet for this product. Be the first farmer to share your experience!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{rev.customerName}</span>
                          <span className="text-[11px] text-stone-500">({rev.customerCity || 'Punjab'})</span>
                        </div>
                        <span className="text-[11px] text-stone-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-stone-700">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add review form */}
              <form onSubmit={handleSubmitReview} className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">Add Your Farmer Feedback</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Muhammad Aslam"
                      className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your City / Tehsil</label>
                    <input
                      type="text"
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      placeholder="e.g. Khanpur / Rahim Yar Khan"
                      className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none"
                  >
                    <option value={5}>5 Stars - Outstanding Results</option>
                    <option value={4}>4 Stars - Effective Product</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Below Expectations</option>
                    <option value={1}>1 Star - Unsatisfied</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Your Experience / Field Result</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe how the formulation performed against pest/disease..."
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-stone-200">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Frequently Paired</span>
              <h2 className="text-xl font-bold font-serif text-stone-900">Related Agri-Inputs</h2>
            </div>
            <Link to="/shop" className="text-xs font-semibold text-emerald-800 hover:underline">
              View All Products →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
