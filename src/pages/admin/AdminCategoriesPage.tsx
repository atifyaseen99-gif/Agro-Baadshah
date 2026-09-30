import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Category } from '../../types';
import { categoryService, productService } from '../../services';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useToast } from '../../context/ToastContext';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => categoryService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    subcategories: [],
    active: true,
  });

  const reload = () => setCategories(categoryService.getAll());

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image: '', subcategories: [], active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData(c);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      categoryService.delete(id);
      reload();
      showToast(`Category "${name}" deleted.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const slug = (formData.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const catToSave: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: formData.name.trim(),
      slug,
      description: formData.description || '',
      image: formData.image || '',
      subcategories: typeof formData.subcategories === 'string'
        ? (formData.subcategories as string).split(',').map((s) => s.trim()).filter(Boolean)
        : formData.subcategories || [],
      active: formData.active !== false,
    };

    categoryService.save(catToSave);
    reload();
    setIsModalOpen(false);
    showToast(editingCategory ? 'Category updated.' : 'Category added.');
  };

  const products = productService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Category Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Organize agricultural pesticides, weedicides, fungicides, and farming gear into categories.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => {
          const productCount = products.filter((p) => p.categoryId === c.id).length;
          return (
            <div key={c.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold">AB</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 truncate">{c.name}</h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {productCount} Products
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">{c.description}</p>
                </div>
              </div>

              {c.subcategories && c.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-1 text-[10px] text-stone-600">
                  {c.subcategories.map((s, i) => (
                    <span key={i} className="bg-stone-100 px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase ${c.active ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {c.active ? 'Active' : 'Disabled'}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-stone-500 hover:text-emerald-800 rounded">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 text-stone-500 hover:text-rose-600 rounded">
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
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <ImageUploader
                label="Category Banner / Icon Image"
                images={formData.image ? [formData.image] : []}
                onChange={(imgs) => setFormData({ ...formData, image: imgs[0] || '' })}
                maxImages={1}
              />

              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div>
                <label className="block font-bold text-stone-700 mb-1">Subcategories (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Sucking Pest, Chewing Worm, Termite Control"
                  value={Array.isArray(formData.subcategories) ? formData.subcategories.join(', ') : formData.subcategories || ''}
                  onChange={(e) => setFormData({ ...formData, subcategories: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.active !== false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-emerald-800"
                />
                <label htmlFor="catActive" className="font-bold text-stone-700 cursor-pointer">
                  Category Active
                </label>
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
