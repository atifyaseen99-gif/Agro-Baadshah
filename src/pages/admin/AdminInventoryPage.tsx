import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';
import { productService } from '../../services';
import { Product } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => productService.getAll());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const { showToast } = useToast();

  const reload = () => setProducts(productService.getAll());

  const handleUpdateStock = (id: string, newStock: number) => {
    productService.updateStock(id, newStock);
    reload();
    showToast('Inventory count updated.');
  };

  const lowStockList = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockList = products.filter((p) => p.stock <= 0);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.batchNumber?.toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (filter === 'low') return p.stock > 0 && p.stock <= p.lowStockThreshold;
    if (filter === 'out') return p.stock <= 0;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Inventory & Stock Control</h1>
        <p className="text-xs text-stone-500 mt-1">
          Monitor product batch numbers, manufacturing dates, expiry timelines, purchase costs, and stock levels.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            filter === 'all' ? 'border-emerald-600 bg-emerald-50/50' : 'border-stone-200 bg-white'
          }`}
        >
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total SKUs</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1">{products.length}</p>
        </div>

        <div
          onClick={() => setFilter('low')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            filter === 'low' ? 'border-amber-600 bg-amber-50/50' : 'border-stone-200 bg-white'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Low Stock Alerts
          </span>
          <p className="text-2xl font-extrabold text-amber-800 mt-1">{lowStockList.length}</p>
        </div>

        <div
          onClick={() => setFilter('out')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            filter === 'out' ? 'border-rose-600 bg-rose-50/50' : 'border-stone-200 bg-white'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Out of Stock
          </span>
          <p className="text-2xl font-extrabold text-rose-800 mt-1">{outOfStockList.length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by SKU, Product, or Batch #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
        <span className="text-xs text-stone-500 ml-auto">Showing {filtered.length} Items</span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700 divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Purchase Price</th>
                <th className="py-3 px-4">Sale Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Supplier / Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((p) => {
                const isOut = p.stock <= 0;
                const isLow = !isOut && p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover rounded border" />
                        <div>
                          <span className="font-bold text-stone-900 block">{p.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{p.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">{p.batchNumber || 'BT-2026-PAK'}</td>

                    <td className="py-3 px-4">{p.expiryDate || '2028-01-01'}</td>

                    <td className="py-3 px-4 text-stone-500">
                      Rs. {p.purchasePrice ? p.purchasePrice.toLocaleString() : '—'}
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-900">
                      Rs. {(p.salePrice || p.price).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={p.stock}
                          onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                          className="w-16 px-1.5 py-1 text-xs border border-stone-300 rounded font-semibold text-center"
                        />
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            isOut
                              ? 'bg-rose-100 text-rose-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isOut ? 'Out' : isLow ? 'Low' : 'OK'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-500 text-[11px]">
                      {p.supplier || 'Agro Baadshah Khanpur'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
