import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Tag } from 'lucide-react';
import { Coupon } from '../../types';
import { couponService } from '../../services';
import { useToast } from '../../context/ToastContext';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => couponService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 2000,
    maxDiscount: 1000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 100,
    usageCount: 0,
    active: true,
  });

  const reload = () => setCoupons(couponService.getAll());

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 2000,
      maxDiscount: 1000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 100,
      usageCount: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData(c);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Delete coupon "${code}"?`)) {
      couponService.delete(id);
      reload();
      showToast(`Coupon "${code}" removed.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code?.trim()) return;

    const couponToSave: Coupon = {
      id: editingCoupon ? editingCoupon.id : `coup-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType || 'percentage',
      discountValue: Number(formData.discountValue || 0),
      minOrderAmount: Number(formData.minOrderAmount || 0),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      startDate: formData.startDate || '2026-01-01',
      endDate: formData.endDate || '2026-12-31',
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      usageCount: formData.usageCount || 0,
      active: formData.active !== false,
    };

    couponService.save(couponToSave);
    reload();
    setIsModalOpen(false);
    showToast(editingCoupon ? 'Coupon updated.' : 'Coupon added.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Discount Coupons</h1>
          <p className="text-xs text-stone-500 mt-1">
            Create promotional coupons for farmer discounts (percentage or fixed amount in PKR).
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-extrabold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {c.code}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-xs font-bold text-stone-800 pt-1">
                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Rs. ${c.discountValue.toLocaleString()} OFF`}
              </p>
              <p className="text-xs text-stone-500">Min Order: Rs. {c.minOrderAmount.toLocaleString()}</p>
              {c.maxDiscount && <p className="text-xs text-stone-500">Max Cap: Rs. {c.maxDiscount.toLocaleString()}</p>}
              <p className="text-[11px] text-stone-400">Valid: {c.startDate} to {c.endDate}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400 text-[11px]">Used: {c.usageCount} times</span>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-stone-500 hover:text-emerald-800 rounded">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(c.id, c.code)} className="p-1.5 text-stone-500 hover:text-rose-600 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base font-bold font-serif text-stone-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BAADSHAH10"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType || 'percentage'}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue || 10}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min Order (PKR)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount || 2000}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Max Discount Cap</label>
                  <input
                    type="number"
                    placeholder="Optional max cap"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={formData.active !== false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-emerald-800"
                />
                <label htmlFor="couponActive" className="font-bold text-stone-700 cursor-pointer">
                  Coupon Active
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0e4d34] text-white rounded-lg font-bold">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
