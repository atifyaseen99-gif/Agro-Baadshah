import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, BookOpen } from 'lucide-react';
import { AgricultureGuide } from '../../types';
import { guideService } from '../../services';
import { useToast } from '../../context/ToastContext';

export const AdminGuidesPage: React.FC = () => {
  const [guides, setGuides] = useState<AgricultureGuide[]>(() => guideService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<AgricultureGuide | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<AgricultureGuide>>({
    title: '',
    category: 'Crop Guide',
    crop: 'Cotton',
    readTime: '5 min read',
    publishedDate: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
    author: 'Agro Baadshah Agronomy Team',
    keyTakeaways: [],
  });

  const reload = () => setGuides(guideService.getAll());

  const handleOpenAdd = () => {
    setEditingGuide(null);
    setFormData({
      title: '',
      category: 'Crop Guide',
      crop: 'Cotton',
      readTime: '5 min read',
      publishedDate: new Date().toISOString().split('T')[0],
      summary: '',
      content: '',
      author: 'Agro Baadshah Agronomy Team',
      keyTakeaways: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: AgricultureGuide) => {
    setEditingGuide(g);
    setFormData(g);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      guideService.delete(id);
      reload();
      showToast('Guide article deleted.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.content?.trim()) return;

    const slug = (formData.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const guideToSave: AgricultureGuide = {
      id: editingGuide ? editingGuide.id : `guide-${Date.now()}`,
      title: formData.title.trim(),
      slug,
      category: (formData.category as any) || 'Crop Guide',
      crop: formData.crop || '',
      readTime: formData.readTime || '5 min read',
      publishedDate: formData.publishedDate || new Date().toISOString().split('T')[0],
      summary: formData.summary || '',
      content: formData.content || '',
      author: formData.author || 'Agro Baadshah Agronomy Team',
      keyTakeaways: typeof formData.keyTakeaways === 'string'
        ? (formData.keyTakeaways as string).split('\n').map((s) => s.trim()).filter(Boolean)
        : formData.keyTakeaways || [],
    };

    guideService.save(guideToSave);
    reload();
    setIsModalOpen(false);
    showToast(editingGuide ? 'Article updated.' : 'Article created.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Agriculture Advisory & Guides</h1>
          <p className="text-xs text-stone-500 mt-1">
            Publish educational articles on crop management, spray nozzles, and weed eradication for farmers.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Guide</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((g) => (
          <div key={g.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                {g.category}
              </span>
              <h3 className="text-sm font-bold text-stone-900 leading-snug">{g.title}</h3>
              <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">{g.summary}</p>
              <span className="text-[11px] text-stone-400 block pt-1">{g.publishedDate} · {g.readTime}</span>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end gap-1">
              <button onClick={() => handleOpenEdit(g)} className="p-1.5 text-stone-500 hover:text-emerald-800 rounded">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(g.id, g.title)} className="p-1.5 text-stone-500 hover:text-rose-600 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs">
            <div className="p-5 border-b flex justify-between items-center bg-stone-50">
              <h2 className="text-base font-bold font-serif text-stone-900">
                {editingGuide ? 'Edit Guide Article' : 'Write Agriculture Guide'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Managing Whitefly in Cotton"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category || 'Crop Guide'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  >
                    <option value="Crop Guide">Crop Guide</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Disease Management">Disease Management</option>
                    <option value="Weed Control">Weed Control</option>
                    <option value="Spray Tips">Spray Tips</option>
                    <option value="Farmer Guide">Farmer Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Crop (Optional)</label>
                  <input
                    type="text"
                    placeholder="Cotton, Wheat, Rice"
                    value={formData.crop || ''}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    placeholder="6 min read"
                    value={formData.readTime || ''}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Summary / Short Teaser</label>
                <textarea
                  rows={2}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Key Farmer Takeaways (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="Ensure 100 liters of water per acre&#10;Never spray at midday heat&#10;Use hollow cone nozzle"
                  value={Array.isArray(formData.keyTakeaways) ? formData.keyTakeaways.join('\n') : formData.keyTakeaways || ''}
                  onChange={(e) => setFormData({ ...formData, keyTakeaways: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Article Content *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0e4d34] text-white rounded-lg font-bold">
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
