import React, { useState } from 'react';
import { Search, Users, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services';

export const AdminCustomersPage: React.FC = () => {
  const orders = orderService.getAll();
  const [search, setSearch] = useState('');

  // Group orders by customer mobile number
  const customerMap = new Map<
    string,
    {
      fullName: string;
      mobile: string;
      whatsapp: string;
      city: string;
      tehsil: string;
      address: string;
      ordersCount: number;
      totalSpent: number;
      lastOrderDate: string;
    }
  >();

  orders.forEach((o) => {
    const key = o.customer.mobile.trim();
    const existing = customerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += o.total;
      if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.createdAt;
      }
    } else {
      customerMap.set(key, {
        fullName: o.customer.fullName,
        mobile: o.customer.mobile,
        whatsapp: o.customer.whatsapp || o.customer.mobile,
        city: o.customer.city,
        tehsil: o.customer.tehsil,
        address: o.customer.address,
        ordersCount: 1,
        totalSpent: o.total,
        lastOrderDate: o.createdAt,
      });
    }
  });

  const customerList = Array.from(customerMap.values()).filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Registered Customers & Farmers</h1>
        <p className="text-xs text-stone-500 mt-1">
          Review customer buying history, contact mobile numbers, and geographical locations.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search by customer name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
        <span className="text-xs text-stone-500">{customerList.length} Farmers</span>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700 divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Mobile / WhatsApp</th>
                <th className="py-3 px-4">Location & Mandi Area</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Total Purchases</th>
                <th className="py-3 px-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customerList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-stone-500 italic">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customerList.map((c, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-bold text-stone-900">{c.fullName}</td>
                    <td className="py-3 px-4 font-mono text-emerald-800">{c.mobile}</td>
                    <td className="py-3 px-4">
                      <span>{c.city}</span>
                      <span className="text-stone-400 block text-[10px]">{c.tehsil}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">{c.ordersCount}</td>
                    <td className="py-3 px-4 font-bold text-emerald-900">Rs. {c.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">
                      {new Date(c.lastOrderDate).toLocaleDateString()}
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
