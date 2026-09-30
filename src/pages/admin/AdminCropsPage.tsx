import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Crop } from '../../types';
import { cropService } from '../../services';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useToast } from '../../context/ToastContext';

export const AdminCropsPage: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>(() => cropService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Crop>>({
    name: '',
    slug: '',
    image: '',
    description: '',
    commonPests: [],
    commonDiseases: [],
    relatedProducts: [],
  });

  const reload = () => setCrops(cropService.getAll());

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setFormData({
      name: '',
      slug: '',
      image: '',
      description: '',
      commonPests: [],
      commonDiseases: [],
      relatedProducts: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData(crop);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete crop "${name}"?`)) {
      cropService.delete(id);
      reload();
      showToast(`Crop "${name}" deleted.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const slug = (formData.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const cropToSave: Crop = {
      id: editingCrop ? editingCrop.id : `crop-${Date.now()}`,
      name: formData.name.trim(),
      slug,
      image: formData.image || '',
      description: formData.description || '',
      commonPests: typeof formData.commonPests === 'string'
        ? (formData.commonPests as string).split(',').map((s) => s.trim()).filter(Boolean)
        : formData.commonPests || [],
      commonDiseases: typeof formData.commonDiseases === 'string'
        ? (formData.commonDiseases as string).split(',').map((s) => s.trim()).filter(Boolean)
        : formData.commonDiseases || [],
      relatedProducts: formData.relatedProducts || [],
    };

    cropService.save(cropToSave);
    reload();
    setIsModalOpen(false);
    showToast(editingCrop ? 'Crop updated.' : 'Crop created.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Crop Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage agricultural crops (Cotton, Wheat, Rice, Sugarcane) and crop photography.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((c) => (
          <div key={c.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="aspect-video bg-stone-100 overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold">CROP</div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-stone-900">{c.name}</h3>
                <p className="text-xs text-stone-600 line-clamp-2">{c.description}</p>
                {c.commonPests.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {c.commonPests.slice(0, 3).map((p, i) => (
                      <span key={i} className="bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded border border-rose-100">{p}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-end gap-1">
              <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-stone-500 hover:text-emerald-800 rounded">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 text-stone-500 hover:text-rose-600 rounded">
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
                {editingCrop ? 'Edit Crop' : 'Add Crop'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Crop image upload */}
              <ImageUploader
                label="Crop Image (Uploadable)"
                helperText="Upload real crop field photography (JPG, PNG, WEBP)"
                images={formData.image ? [formData.image] : []}
                onChange={(imgs) => setFormData({ ...formData, image: imgs[0] || '' })}
                maxImages={1}
              />

              <div>
                <label className="block font-bold text-stone-700 mb-1">Crop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cotton (کپاس)"
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
                <label className="block font-bold text-stone-700 mb-1">Common Pests (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Whitefly, Jassid, Thrips, Pink Bollworm"
                  value={Array.isArray(formData.commonPests) ? formData.commonPests.join(', ') : formData.commonPests || ''}
                  onChange={(e) => setFormData({ ...formData, commonPests: e.target.value as any })}
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
