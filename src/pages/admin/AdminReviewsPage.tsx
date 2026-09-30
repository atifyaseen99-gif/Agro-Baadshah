import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import { reviewService } from '../../services';
import { useToast } from '../../context/ToastContext';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => reviewService.getAll());
  const { showToast } = useToast();

  const reload = () => setReviews(reviewService.getAll());

  const handleStatus = (id: string, status: 'approved' | 'rejected') => {
    reviewService.updateStatus(id, status);
    reload();
    showToast(`Review marked as ${status}.`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this review permanently?')) {
      reviewService.delete(id);
      reload();
      showToast('Review deleted.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Customer & Farmer Reviews</h1>
        <p className="text-xs text-stone-500 mt-1">
          Moderate product ratings and farmer testimonials submitted on product pages.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700 divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-stone-500 italic">
                    No customer reviews submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block">{r.customerName}</span>
                      <span className="text-[10px] text-stone-400">{r.customerCity || 'Punjab'} · {r.date}</span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-emerald-900">{r.productName}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center text-amber-500">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-sm text-stone-600 italic">"{r.comment}"</td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          r.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => handleStatus(r.id, 'approved')}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Approve Review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatus(r.id, 'rejected')}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded"
                            title="Reject Review"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
