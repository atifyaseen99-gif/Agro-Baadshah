import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, ExternalLink, Edit, Printer } from 'lucide-react';
import { orderService } from '../../services';
import { Order, OrderStatus } from '../../types';
import { TrackingTimeline } from '../../components/customer/TrackingTimeline';
import { PrintableInvoice } from '../../components/common/PrintableInvoice';
import { useToast } from '../../context/ToastContext';

export const AdminOrderTrackingPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => orderService.getAll());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const [courierName, setCourierName] = useState(selectedOrder?.courierName || 'TCS Express Pakistan');
  const [trackingNumber, setTrackingNumber] = useState(selectedOrder?.trackingNumber || '');
  const [trackingUrl, setTrackingUrl] = useState(selectedOrder?.trackingUrl || '');
  const [trackingNotes, setTrackingNotes] = useState(selectedOrder?.trackingNotes || '');

  const reload = () => {
    const list = orderService.getAll();
    setOrders(list);
    if (selectedOrder) {
      const refreshed = list.find((o) => o.id === selectedOrder.id);
      if (refreshed) setSelectedOrder(refreshed);
    }
  };

  const handleSelect = (ord: Order) => {
    setSelectedOrder(ord);
    setCourierName(ord.courierName || 'TCS Express Pakistan');
    setTrackingNumber(ord.trackingNumber || '');
    setTrackingUrl(ord.trackingUrl || '');
    setTrackingNotes(ord.trackingNotes || '');
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!selectedOrder) return;
    orderService.updateStatus(selectedOrder.id, status, {
      courierName: courierName.trim() || undefined,
      trackingNumber: trackingNumber.trim() || undefined,
      trackingUrl: trackingUrl.trim() || undefined,
      trackingNotes: trackingNotes.trim() || undefined,
    });
    reload();
    showToast(`Order #${selectedOrder.id} status changed to ${status}.`);
  };

  const handleSaveCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    orderService.updateStatus(selectedOrder.id, selectedOrder.orderStatus, {
      courierName: courierName.trim(),
      trackingNumber: trackingNumber.trim(),
      trackingUrl: trackingUrl.trim(),
      trackingNotes: trackingNotes.trim(),
    });
    reload();
    showToast('Courier information saved.');
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return !q || o.id.toLowerCase().includes(q) || o.customer.fullName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Order Tracking & Logistics Hub</h1>
        <p className="text-xs text-stone-500 mt-1">
          Assign courier tracking numbers (TCS, Leopard, Mandi Cargo) and advance customer delivery milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Selector (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-4 space-y-4 shadow-xs">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
            {filtered.map((ord) => (
              <div
                key={ord.id}
                onClick={() => handleSelect(ord)}
                className={`p-3 rounded-lg cursor-pointer transition text-xs ${
                  selectedOrder?.id === ord.id
                    ? 'bg-emerald-50 border border-emerald-300'
                    : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 font-mono">{ord.id}</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                    {ord.orderStatus}
                  </span>
                </div>
                <p className="text-stone-600 mt-1 font-medium">{ord.customer.fullName} ({ord.customer.city})</p>
                <p className="text-stone-400 text-[11px]">Rs. {ord.total.toLocaleString()} · {ord.items.length} items</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Details & Control (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedOrder ? (
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Selected Consignment</span>
                  <h2 className="text-xl font-bold font-serif text-stone-900">{selectedOrder.id}</h2>
                  <p className="text-stone-500 mt-0.5">
                    {selectedOrder.customer.fullName} · {selectedOrder.customer.address}, {selectedOrder.customer.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInvoice(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-2xs transition"
                    title="Print Official Tax Invoice"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print Invoice</span>
                  </button>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full uppercase">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Status progression triggers */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-800 uppercase tracking-wider block">
                  Advance Delivery Milestone:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus('CONFIRMED')}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded"
                  >
                    Mark Confirmed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('PROCESSING')}
                    className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded"
                  >
                    Mark Processing
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('DISPATCHED')}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded"
                  >
                    Mark Dispatched
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded"
                  >
                    Mark Out for Delivery
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('DELIVERED')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="p-4 border border-stone-200 rounded-xl">
                <TrackingTimeline
                  events={selectedOrder.trackingEvents}
                  currentStatus={selectedOrder.orderStatus}
                />
              </div>

              {/* Courier form */}
              <form onSubmit={handleSaveCourier} className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider">Courier Dispatch Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Courier Name</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Tracking Number / CN</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-semibold">Courier Portal Tracking URL</label>
                  <input
                    type="url"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-semibold">Tracking Notes</label>
                  <input
                    type="text"
                    value={trackingNotes}
                    onChange={(e) => setTrackingNotes(e.target.value)}
                    placeholder="Dispatched from Khanpur Gallah Mandi hub..."
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded"
                  >
                    Save Courier Info
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-500">
              Select an order on the left to review tracking events and update shipping status.
            </div>
          )}
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedOrder && (
        <PrintableInvoice
          order={selectedOrder}
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};
