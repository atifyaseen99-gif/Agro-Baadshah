import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { useWishlist } from '../../context/WishlistContext';
import { productService } from '../../services';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  const allProducts = productService.getAll();
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Saved Items</span>
        <h1 className="text-2xl font-bold font-serif text-stone-900 mt-1">My Wishlist</h1>
        <p className="text-xs text-stone-500 mt-1">
          {wishlistProducts.length} items saved for future purchase or spray planning.
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center space-y-3">
          <Heart className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Explore our pesticides, fertilizers, and equipment and click the heart icon on any product to save it here.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-3 px-6 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-emerald-900 transition"
          >
            Explore Store
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
