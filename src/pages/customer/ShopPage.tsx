import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import {
  productService,
  categoryService,
  brandService,
  cropService,
  pestService,
} from '../../services';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [selectedCrop, setSelectedCrop] = useState(searchParams.get('crop') || 'all');
  const [selectedPest, setSelectedPest] = useState(searchParams.get('pest') || 'all');
  const [selectedFormulation, setSelectedFormulation] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(searchParams.get('filter') === 'discount');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams.get('search') !== null) setSearch(searchParams.get('search') || '');
    if (searchParams.get('category') !== null) setSelectedCategory(searchParams.get('category') || 'all');
    if (searchParams.get('brand') !== null) setSelectedBrand(searchParams.get('brand') || 'all');
    if (searchParams.get('crop') !== null) setSelectedCrop(searchParams.get('crop') || 'all');
    if (searchParams.get('pest') !== null) setSelectedPest(searchParams.get('pest') || 'all');
    if (searchParams.get('sort') !== null) setSortBy(searchParams.get('sort') || 'featured');
    if (searchParams.get('filter') === 'discount') setOnlyDiscounted(true);
  }, [searchParams]);

  const allProducts = productService.getAll();
  const categories = categoryService.getAll().filter((c) => c.active);
  const brands = brandService.getAll().filter((b) => b.active);
  const crops = cropService.getAll();
  const pests = pestService.getAll();

  // Available formulations extracted from products
  const formulations = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => {
      if (p.formulation) set.add(p.formulation);
    });
    return Array.from(set);
  }, [allProducts]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesIngredient = product.activeIngredient.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesCrop = product.targetCrops.some((c) => c.toLowerCase().includes(q));
        const matchesPest = product.targetPests.some((p) => p.toLowerCase().includes(q));
        if (!matchesName && !matchesIngredient && !matchesSku && !matchesCrop && !matchesPest) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
        return false;
      }

      // Brand
      if (selectedBrand !== 'all' && product.brandId !== selectedBrand) {
        return false;
      }

      // Crop
      if (selectedCrop !== 'all') {
        const cropObj = crops.find((c) => c.id === selectedCrop);
        const cropName = cropObj ? cropObj.name.split(' ')[0].toLowerCase() : selectedCrop.toLowerCase();
        const matches = product.targetCrops.some((c) => c.toLowerCase().includes(cropName));
        if (!matches) return false;
      }

      // Pest
      if (selectedPest !== 'all') {
        const pestName = selectedPest.toLowerCase();
        const matches = product.targetPests.some((p) => p.toLowerCase().includes(pestName));
        if (!matches) return false;
      }

      // Formulation
      if (selectedFormulation !== 'all' && product.formulation !== selectedFormulation) {
        return false;
      }

      // In stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Discount
      if (onlyDiscounted && (!product.salePrice || product.salePrice >= product.price)) {
        return false;
      }

      return true;
    });
  }, [
    allProducts,
    search,
    selectedCategory,
    selectedBrand,
    selectedCrop,
    selectedPest,
    selectedFormulation,
    inStockOnly,
    onlyDiscounted,
    crops,
  ]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price_low':
        return list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price_high':
        return list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'best_selling':
        return list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
      case 'discount':
        return list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedCrop('all');
    setSelectedPest('all');
    setSelectedFormulation('all');
    setInStockOnly(false);
    setOnlyDiscounted(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedCrop !== 'all' ||
    selectedPest !== 'all' ||
    selectedFormulation !== 'all' ||
    inStockOnly ||
    onlyDiscounted;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Agro Baadshah Store</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            Agricultural Products & Inputs
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing {sortedProducts.length} certified products with delivery nationwide.
          </p>
        </div>

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="best_selling">Best Selling</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-800" />
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Search Term</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ingredient, product, SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Brand / Manufacturer</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Crop Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Target Crop (فصل)</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
              >
                <option value="all">All Crops</option>
                {crops.map((cr) => (
                  <option key={cr.id} value={cr.id}>
                    {cr.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pest Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Target Pest (کیڑا)</label>
              <select
                value={selectedPest}
                onChange={(e) => setSelectedPest(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
              >
                <option value="all">All Pests</option>
                {pests.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} {p.urduName && `(${p.urduName})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Formulation Filter */}
            {formulations.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Formulation Type</label>
                <select
                  value={selectedFormulation}
                  onChange={(e) => setSelectedFormulation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                >
                  <option value="all">All Formulations</option>
                  {formulations.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Checkbox Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-700"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-700"
                />
                <span>Discounted Deals Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-sm bg-white p-6 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h3 className="text-base font-bold text-stone-900">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-stone-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="all">All Brands</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">Crop</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="all">All Crops</option>
                    {crops.map((cr) => (
                      <option key={cr.id} value={cr.id}>
                        {cr.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>In Stock Only</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Discounted Deals Only</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      handleResetFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 py-2.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Apply ({sortedProducts.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-12 text-center space-y-3">
              <Search className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">No products matched your criteria</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your filters, selecting a different category, or resetting your search query.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-3 px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-emerald-900 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
