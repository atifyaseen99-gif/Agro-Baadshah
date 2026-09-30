import React from 'react';
import { Link } from 'react-router-dom';
import { brandService, productService } from '../../services';

export const BrandsPage: React.FC = () => {
  const brands = brandService.getAll().filter((b) => b.active);
  const products = productService.getAll();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Multinational & National Partners</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
          Authorized Agricultural Brands
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Direct partnership with world-class manufacturers ensuring original formulations and guaranteed authenticity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => {
          const count = products.filter((p) => p.brandId === brand.id).length;
          return (
            <Link
              key={brand.id}
              to={`/shop?brand=${brand.id}`}
              className="group bg-white border border-stone-200 rounded-2xl p-6 hover:border-emerald-600 transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-xl bg-stone-50 p-2 border border-stone-200 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition">
                  {brand.name}
                </h3>
                <span className="text-xs text-stone-400 block mt-0.5">{brand.origin || 'Pakistan'}</span>
                <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">{brand.description}</p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800 mt-4">
                <span>Browse Products</span>
                <span>({count}) →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
