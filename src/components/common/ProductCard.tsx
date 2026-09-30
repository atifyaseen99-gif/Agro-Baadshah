import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, MessageCircle, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { settingsService, brandService } from '../../services';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const brand = brandService.getById(product.brandId);
  const settings = settingsService.get();
  const inWishlist = isInWishlist(product.id);

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart.`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phoneClean = settings.whatsapp.replace(/\D/g, '');
    const message = `Assalam-o-Alaikum Agro Baadshah, I want to order:\n\n*Product:* ${product.name}\n*Active Ingredient:* ${product.activeIngredient}\n*Pack Size:* ${product.packSize}\n*Price:* Rs. ${currentPrice.toLocaleString()}\n\nPlease confirm availability and dispatch to my address.`;
    window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(
      inWishlist ? `Removed "${product.name}" from wishlist.` : `Added "${product.name}" to wishlist.`
    );
  };

  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23e2e8f0"><rect width="100%" height="100%"/><text x="50%" y="50%" fill="%2364748b" text-anchor="middle" dy=".3em">No Image</text></svg>';

  return (
    <div className="group relative bg-white border border-stone-200/90 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:border-emerald-700/40">
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
        {isOutOfStock ? (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white rounded">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white rounded">
            Low Stock ({product.stock} left)
          </span>
        ) : hasDiscount ? (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white rounded">
            {discountPercent}% OFF
          </span>
        ) : null}

        {product.bestSeller && !isOutOfStock && (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#0e4d34] text-white rounded">
            Best Seller
          </span>
        )}
        {product.newArrival && !isOutOfStock && !hasDiscount && (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white rounded">
            New
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-sm transition-colors ${
          inWishlist
            ? 'bg-rose-50 text-rose-600 shadow'
            : 'bg-white/80 hover:bg-white text-stone-500 hover:text-rose-600'
        }`}
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
      </button>

      {/* Image container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-square bg-stone-100 overflow-hidden"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Pack size clean metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium text-stone-600 truncate">{brand?.name || 'Agro Baadshah'}</span>
            <span className="shrink-0 font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
              {product.packSize}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Active Ingredient & Formulation */}
          <p className="text-xs text-emerald-800 font-medium truncate mt-0.5">
            {product.activeIngredient} {product.concentration && `· ${product.concentration}`}
          </p>

          {/* Ratings & reviews */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="ml-1 font-bold text-stone-800">{product.rating.toFixed(1)}</span>
            </div>
            <span>·</span>
            <span>{product.reviewCount} reviews</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-3 pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-extrabold text-[#0a3a27]">
              Rs. {currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-stone-100 hover:bg-emerald-100 text-stone-800 hover:text-emerald-900 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-800" />
                <span>Add</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex items-center justify-center py-2 px-2.5 bg-[#0e4d34] hover:bg-[#093926] text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Buy Now
              </button>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-medium text-xs rounded-lg transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>WhatsApp Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
