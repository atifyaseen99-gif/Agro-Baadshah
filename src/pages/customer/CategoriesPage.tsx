import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categoryService, productService } from '../../services';

export const CategoriesPage: React.FC = () => {
  const categories = categoryService.getAll().filter((c) => c.active);
  const products = productService.getAll();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Agro Baadshah Portfolio</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
          Agricultural Product Categories
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore specialized pesticide groups, weedicides, fungicides, bio-solutions, and spray machinery.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-emerald-700 transition hover:shadow-md flex flex-col"
            >
              <div className="aspect-video bg-stone-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-emerald-800">{count} Products</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1">
                    {cat.subcategories.map((sub, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
