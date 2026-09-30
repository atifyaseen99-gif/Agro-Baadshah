import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Bug } from 'lucide-react';
import { Pest } from '../../types';
import { pestService } from '../../services';
import { useToast } from '../../context/ToastContext';

export const AdminPestsPage: React.FC = () => {
  const [pests, setPests] = useState<Pest[]>(() => pestService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPest, setEditingPest] = useState<Pest | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Pest>>({
    name: '',
    urduName: '',
    slug: '',
    description: '',
    affectedCrops: [],
    symptoms: [],
    recommendedIngredients: [],
  });

  const reload = () => setPests(pestService.getAll());

  const handleOpenAdd = () => {
    setEditingPest(null);
    setFormData({
      name: '',
      urduName: '',
      slug: '',
      description: '',
      affectedCrops: [],
      symptoms: [],
      recommendedIngredients: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Pest) => {
    setEditingPest(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete pest entry "${name}"?`)) {
      pestService.delete(id);
      reload();
      showToast(`Pest "${name}" deleted.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const slug = (formData.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const pestToSave: Pest = {
      id: editingPest ? editingPest.id : `pest-${Date.now()}`,
      name: formData.name.trim(),
      urduName: formData.urduName || '',
      slug,
      description: formData.description || '',
      affectedCrops: typeof formData.affectedCrops === 'string'
        ? (formData.affectedCrops as string).split(',').map((s) => s.trim()).filter(Boolean)
        : formData.affectedCrops || [],
      symptoms: typeof formData.symptoms === 'string'
        ? (formData.symptoms as string).split(',').map((s) => s.trim()).filter(Boolean)
        : formData.symptoms || [],
      recommendedIngredients: typeof formData.recommendedIngredients === 'string'
        ? (formData.recommendedIngredients as string).split(',').map((s) => s.trim()).filter(Boolean)
        : formData.recommendedIngredients || [],
    };

    pestService.save(pestToSave);
    reload();
    setIsModalOpen(false);
    showToast(editingPest ? 'Pest updated.' : 'Pest added.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Pest Directory</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage crop-damaging insects, economic injury thresholds, and chemical recommendations.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pest</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pests.map((p) => (
          <div key={p.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{p.name}</h3>
                  {p.urduName && <span className="text-xs font-bold text-emerald-800">{p.urduName}</span>}
                </div>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  🪲
                </div>
              </div>
              <p className="text-xs text-stone-600 line-clamp-2">{p.description}</p>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <span className="font-semibold text-stone-700 block">Recommended Actives:</span>
                <span className="text-emerald-800 font-medium">{p.recommendedIngredients.join(', ')}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end gap-1">
              <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-stone-500 hover:text-emerald-800 rounded">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-stone-500 hover:text-rose-600 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base font-bold font-serif text-stone-900">
                {editingPest ? 'Edit Pest Entry' : 'Add Pest Entry'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pest Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Whitefly"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Urdu Name</label>
                  <input
                    type="text"
                    placeholder="e.g. سفید مکھی"
                    value={formData.urduName || ''}
                    onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description & Crop Damage</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Affected Crops (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Cotton, Vegetables, Citrus"
                  value={Array.isArray(formData.affectedCrops) ? formData.affectedCrops.join(', ') : formData.affectedCrops || ''}
                  onChange={(e) => setFormData({ ...formData, affectedCrops: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Recommended Actives (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Pyriproxyfen, Spirotetramat, Flonicamid"
                  value={Array.isArray(formData.recommendedIngredients) ? formData.recommendedIngredients.join(', ') : formData.recommendedIngredients || ''}
                  onChange={(e) => setFormData({ ...formData, recommendedIngredients: e.target.value as any })}
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
