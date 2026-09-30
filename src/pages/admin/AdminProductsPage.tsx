import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  AlertTriangle,
  X,
  Check,
  ChevronDown,
  ArrowUpDown,
  Eye,
} from 'lucide-react';
import { Product } from '../../types';
import { ImageUploader } from '../../components/common/ImageUploader';
import {
  productService,
  brandService,
  categoryService,
  cropService,
  pestService,
} from '../../services';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => productService.getAll());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { showToast } = useToast();

  const brands = brandService.getAll();
  const categories = categoryService.getAll();
  const crops = cropService.getAll();
  const pests = pestService.getAll();

  const initialFormState: Partial<Product> = {
    name: '',
    sku: '',
    brandId: brands[0]?.id || '',
    categoryId: categories[0]?.id || '',
    subcategoryId: '',
    shortDescription: '',
    description: '',
    images: [],
    price: 1500,
    salePrice: undefined,
    stock: 25,
    lowStockThreshold: 5,
    unit: 'Bottle',
    packSize: '500 ml',
    activeIngredient: '',
    concentration: '',
    formulation: 'EC',
    manufacturer: 'Agro Baadshah',
    targetCrops: ['Cotton', 'Wheat'],
    targetPests: ['Whitefly', 'Bollworms'],
    targetDiseases: [],
    batchNumber: 'BT-2026-01',
    manufacturingDate: '2026-01-01',
    expiryDate: '2028-01-01',
    featured: false,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 5.0,
    reviewCount: 0,
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const reloadProducts = () => {
    setProducts(productService.getAll());
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialFormState,
      sku: `AB-${Date.now().toString().slice(-6)}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      productService.delete(id);
      reloadProducts();
      showToast(`Product "${name}" deleted.`);
    }
  };

  const handleDuplicate = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    productService.save(duplicated);
    reloadProducts();
    showToast(`Product "${p.name}" duplicated.`);
  };

  const handleQuickStockUpdate = (id: string, newStock: number) => {
    productService.updateStock(id, newStock);
    reloadProducts();
    showToast('Stock quantity updated.');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.activeIngredient?.trim() || !formData.price) {
      showToast('Please fill out the required product fields.', 'error');
      return;
    }

    const slug = (formData.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      sku: formData.sku || `SKU-${Date.now()}`,
      name: formData.name.trim(),
      slug,
      brandId: formData.brandId || brands[0]?.id || '',
      categoryId: formData.categoryId || categories[0]?.id || '',
      subcategoryId: formData.subcategoryId || '',
      description: formData.description || '',
      shortDescription: formData.shortDescription || '',
      images: formData.images && formData.images.length > 0 ? formData.images : [],
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      discount:
        formData.salePrice && Number(formData.salePrice) < Number(formData.price)
          ? Math.round(((Number(formData.price) - Number(formData.salePrice)) / Number(formData.price)) * 100)
          : undefined,
      stock: Number(formData.stock || 0),
      lowStockThreshold: Number(formData.lowStockThreshold || 5),
      unit: formData.unit || 'Bottle',
      packSize: formData.packSize || '500 ml',
      activeIngredient: formData.activeIngredient.trim(),
      concentration: formData.concentration || '',
      formulation: formData.formulation || 'EC',
      manufacturer: formData.manufacturer || 'Agro Baadshah',
      registrationNumber: formData.registrationNumber || '',
      registrationStatus: formData.registrationStatus || 'Registered',
      targetCrops: formData.targetCrops || [],
      targetPests: formData.targetPests || [],
      targetDiseases: formData.targetDiseases || [],
      batchNumber: formData.batchNumber || '',
      manufacturingDate: formData.manufacturingDate || '',
      expiryDate: formData.expiryDate || '',
      featured: Boolean(formData.featured),
      bestSeller: Boolean(formData.bestSeller),
      newArrival: Boolean(formData.newArrival),
      status: formData.status || 'active',
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    productService.save(productToSave);
    reloadProducts();
    setIsModalOpen(false);
    showToast(editingProduct ? 'Product updated successfully!' : 'New product created successfully!');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.activeIngredient.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Products Catalog</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage agricultural pesticides, formulations, prices, inventory, and uploaded images.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search by product, active ingredient, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
            {filteredProducts.length} Products
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700 divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Product & Image</th>
                <th className="py-3 px-4">Active Ingredient</th>
                <th className="py-3 px-4">Brand / Category</th>
                <th className="py-3 px-4">Price (PKR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-stone-500 italic">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const brand = brands.find((b) => b.id === p.brandId);
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{p.name}</span>
                            <span className="text-[11px] text-stone-500">
                              {p.packSize} · {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-800">{p.activeIngredient}</span>
                        <span className="text-[10px] text-stone-400 block">{p.formulation}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="block font-medium text-stone-800">{brand?.name || 'Agro Baadshah'}</span>
                        <span className="text-[11px] text-stone-400">{cat?.name}</span>
                      </td>

                      <td className="py-3 px-4 font-bold text-stone-900">
                        {p.salePrice ? (
                          <div>
                            <span className="text-emerald-800">Rs. {p.salePrice.toLocaleString()}</span>
                            <span className="text-[10px] text-stone-400 line-through block">
                              Rs. {p.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span>Rs. {p.price.toLocaleString()}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={(e) => handleQuickStockUpdate(p.id, Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-xs border border-stone-300 rounded font-semibold text-center"
                          />
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.stock <= 0
                                ? 'bg-rose-600'
                                : p.stock <= p.lowStockThreshold
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.featured && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                              Featured
                            </span>
                          )}
                          {p.bestSeller && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                              Best Seller
                            </span>
                          )}
                          {p.newArrival && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 text-stone-500 hover:text-blue-800 hover:bg-stone-100 rounded"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-base font-bold font-serif text-stone-900">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Agricultural Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* CRITICAL REQUIREMENT: PRODUCT IMAGE UPLOAD BOX */}
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                <ImageUploader
                  label="Product Images (Required / Uploadable)"
                  helperText="Upload original product container / pack photo (JPG, PNG, WEBP). The uploaded image will be rendered across all public pages."
                  images={formData.images || []}
                  onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                  maxImages={6}
                />
              </div>

              {/* General Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Belt 480 SC"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Active Ingredient *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flubendiamide"
                    value={formData.activeIngredient || ''}
                    onChange={(e) => setFormData({ ...formData, activeIngredient: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Brand / Company</label>
                  <select
                    value={formData.brandId || ''}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Formulation</label>
                  <input
                    type="text"
                    placeholder="SC, EC, WG, SL, WP, GR"
                    value={formData.formulation || ''}
                    onChange={(e) => setFormData({ ...formData, formulation: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Discounted price"
                    value={formData.salePrice || ''}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pack Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 ml, 1 kg"
                    value={formData.packSize || ''}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    placeholder="Brief 1-line product summary"
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Full Description & Action Mode</label>
                  <textarea
                    rows={3}
                    placeholder="Detailed chemical description..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Batch, Dates & Manufacturer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={formData.batchNumber || ''}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="flex flex-wrap gap-6 pt-2 border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-emerald-800"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller || false}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                    className="rounded text-emerald-800"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.newArrival || false}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="rounded text-emerald-800"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white rounded-lg font-bold transition shadow"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
