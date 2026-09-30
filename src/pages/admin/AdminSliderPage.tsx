import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, X, Sliders } from 'lucide-react';
import { SliderItem } from '../../types';
import { sliderService, cropService } from '../../services';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useToast } from '../../context/ToastContext';

export const AdminSliderPage: React.FC = () => {
  const [slides, setSlides] = useState<SliderItem[]>(() => sliderService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SliderItem | null>(null);

  const { showToast } = useToast();
  const crops = cropService.getAll();

  const initialFormState: Partial<SliderItem> = {
    title: '',
    subtitle: '',
    image: '',
    buttonText: 'View Products',
    buttonLink: '/shop',
    cropId: crops[0]?.id || '',
    active: true,
    sortOrder: slides.length + 1,
  };

  const [formData, setFormData] = useState<Partial<SliderItem>>(initialFormState);

  const reloadSlides = () => {
    setSlides(sliderService.getAll());
  };

  const handleOpenAddModal = () => {
    setEditingSlide(null);
    setFormData({
      ...initialFormState,
      sortOrder: slides.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: SliderItem) => {
    setEditingSlide(slide);
    setFormData(slide);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete slide "${title}"?`)) {
      sliderService.delete(id);
      reloadSlides();
      showToast(`Slide "${title}" deleted.`);
    }
  };

  const handleToggleActive = (slide: SliderItem) => {
    sliderService.save({ ...slide, active: !slide.active });
    reloadSlides();
    showToast(`Slide ${!slide.active ? 'enabled' : 'disabled'}.`);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    updated.forEach((s, idx) => {
      s.sortOrder = idx + 1;
      sliderService.save(s);
    });

    reloadSlides();
    showToast('Slide order updated.');
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.image) {
      showToast('Please provide a slide title and upload a crop slide image.', 'error');
      return;
    }

    const slideToSave: SliderItem = {
      id: editingSlide ? editingSlide.id : `slide-${Date.now()}`,
      title: formData.title.trim(),
      subtitle: formData.subtitle || '',
      image: formData.image,
      buttonText: formData.buttonText || 'View Products',
      buttonLink: formData.buttonLink || '/shop',
      cropId: formData.cropId || '',
      active: formData.active !== undefined ? formData.active : true,
      sortOrder: formData.sortOrder || slides.length + 1,
    };

    sliderService.save(slideToSave);
    reloadSlides();
    setIsModalOpen(false);
    showToast(editingSlide ? 'Slide updated successfully!' : 'Slide added successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Homepage Slider Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage top crop carousel slides, upload custom field photography, and link directly to crop products.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop Slide</span>
        </button>
      </div>

      {/* Slides List */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="divide-y divide-stone-100">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                slide.active ? 'bg-white' : 'bg-stone-50 opacity-70'
              }`}
            >
              {/* Image & Title */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveOrder(idx, 'up')}
                    className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-stone-400">{slide.sortOrder}</span>
                  <button
                    disabled={idx === slides.length - 1}
                    onClick={() => handleMoveOrder(idx, 'down')}
                    className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-24 h-16 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-900">{slide.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-1 max-w-md mt-0.5">{slide.subtitle}</p>
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                    Button: {slide.buttonText} → {slide.buttonLink}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleToggleActive(slide)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                    slide.active
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  }`}
                  title={slide.active ? 'Disable Slide' : 'Enable Slide'}
                >
                  {slide.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{slide.active ? 'Active' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => handleOpenEditModal(slide)}
                  className="p-2 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded"
                  title="Edit Slide"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(slide.id, slide.title)}
                  className="p-2 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-base font-bold font-serif text-stone-900">
                {editingSlide ? 'Edit Crop Slide' : 'Add New Crop Slide'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="p-6 space-y-4 text-xs">
              {/* Slide Image Uploader */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <ImageUploader
                  label="Slide Crop Image (Required)"
                  helperText="Upload high quality crop photograph (Cotton, Wheat, Rice, Sugarcane, etc.). JPG, PNG, WEBP."
                  images={formData.image ? [formData.image] : []}
                  onChange={(imgs) => setFormData({ ...formData, image: imgs[0] || '' })}
                  maxImages={1}
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Slide Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cotton Crop Defense (کپاس کی حفاظت)"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Reliable insecticidal shields against Whitefly, Jassid, and Pink Bollworm..."
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText || ''}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Button Link URL</label>
                  <input
                    type="text"
                    value={formData.buttonLink || ''}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Related Crop (Optional)</label>
                  <select
                    value={formData.cropId || ''}
                    onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  >
                    <option value="">General / All Crops</option>
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.active !== false}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded text-emerald-800"
                    />
                    <span>Active on Homepage</span>
                  </label>
                </div>
              </div>

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
                  {editingSlide ? 'Save Slide' : 'Add Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
