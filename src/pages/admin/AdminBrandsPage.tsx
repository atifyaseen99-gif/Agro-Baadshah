import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Brand } from '../../types';
import { brandService, productService } from '../../services';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useToast } from '../../context/ToastContext';

export const AdminBrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(() => brandService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Brand>>({
    name: '',
    slug: '',
    description: '',
    logo: '',
    origin: 'Pakistan',
    active: true,
  });

  const reload = () => setBrands(brandService.getAll());

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({ name: '', slug: '', description: '', logo: '', origin: 'Pakistan', active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Brand) => {
    setEditingBrand(b);
    setFormData(b);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete brand "${name}"?`)) {
      brandService.delete(id);
      reload();
      showToast(`Brand "${name}" deleted.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const slug = (formData.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const brandToSave: Brand = {
      id: editingBrand ? editingBrand.id : `brand-${Date.now()}`,
      name: formData.name.trim(),
      slug,
      description: formData.description || '',
      logo: formData.logo || '',
      origin: formData.origin || 'Pakistan',
      active: formData.active !== false,
    };

    brandService.save(brandToSave);
    reload();
    setIsModalOpen(false);
    showToast(editingBrand ? 'Brand updated.' : 'Brand created.');
  };

  const products = productService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Brand Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage multinational and domestic chemical manufacturers and supplier logos.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((b) => {
          const count = products.filter((p) => p.brandId === b.id).length;
          return (
            <div key={b.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-16 h-16 rounded-xl bg-stone-50 p-2 border border-stone-200 flex items-center justify-center mb-3">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="font-bold text-stone-400">LOGO</span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-stone-900">{b.name}</h3>
                <span className="text-[11px] text-stone-400">{b.origin || 'Pakistan'}</span>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1">{b.description}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800">{count} Products</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-stone-500 hover:text-emerald-800 rounded">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(b.id, b.name)} className="p-1.5 text-stone-500 hover:text-rose-600 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base font-bold font-serif text-stone-900">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <ImageUploader
                label="Brand Logo Upload"
                images={formData.logo ? [formData.logo] : []}
                onChange={(imgs) => setFormData({ ...formData, logo: imgs[0] || '' })}
                maxImages={1}
              />

              <div>
                <label className="block font-bold text-stone-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Country / Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Germany / Pakistan"
                  value={formData.origin || ''}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0e4d34] text-white rounded-lg font-bold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
