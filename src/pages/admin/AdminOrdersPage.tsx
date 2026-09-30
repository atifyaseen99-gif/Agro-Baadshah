import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  Printer,
  X,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  MapPin,
  Calendar,
  FileText,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { orderService, settingsService } from '../../services';
import { TrackingTimeline } from '../../components/customer/TrackingTimeline';
import { PrintableInvoice } from '../../components/common/PrintableInvoice';
import { OrderInvoice } from '../../components/admin/OrderInvoice';
import { useToast } from '../../context/ToastContext';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => orderService.getAll());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'logistics' | 'invoice'>('logistics');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Edit courier tracking inputs in modal
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [trackingNotes, setTrackingNotes] = useState('');

  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const settings = settingsService.get();

  useEffect(() => {
    const viewId = searchParams.get('view');
    if (viewId) {
      const found = orders.find((o) => o.id === viewId);
      if (found) handleOpenOrderDetails(found);
    }
  }, [searchParams, orders]);

  const reloadOrders = () => {
    const updated = orderService.getAll();
    setOrders(updated);
    if (selectedOrder) {
      const refreshed = updated.find((o) => o.id === selectedOrder.id);
      if (refreshed) setSelectedOrder(refreshed);
    }
  };

  const handleOpenOrderDetails = (order: Order, tab: 'logistics' | 'invoice' = 'logistics') => {
    setSelectedOrder(order);
    setActiveTab(tab);
    setCourierName(order.courierName || 'TCS Express Pakistan');
    setTrackingNumber(order.trackingNumber || '');
    setTrackingUrl(order.trackingUrl || '');
    setTrackingNotes(order.trackingNotes || '');
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const updated = orderService.updateStatus(selectedOrder.id, newStatus, {
      courierName: courierName.trim() || undefined,
      trackingNumber: trackingNumber.trim() || undefined,
      trackingUrl: trackingUrl.trim() || undefined,
      trackingNotes: trackingNotes.trim() || undefined,
    });
    reloadOrders();
    showToast(`Order #${selectedOrder.id} status updated to ${newStatus}.`);
  };

  const handleSaveCourierDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    orderService.updateStatus(selectedOrder.id, selectedOrder.orderStatus, {
      courierName: courierName.trim(),
      trackingNumber: trackingNumber.trim(),
      trackingUrl: trackingUrl.trim(),
      trackingNotes: trackingNotes.trim(),
    });
    reloadOrders();
    showToast('Courier & Tracking details saved.');
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.mobile.includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Order Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Review customer orders, update tracking statuses, dispatch with couriers, and generate invoices.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search Order ID, Customer, Phone, Tracking #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
            {filteredOrders.length} Orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700 divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & Location</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount & Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Courier / Tracking</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-stone-500 italic">
                    No orders matching filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 font-mono block">{ord.id}</span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-800 block">{ord.customer.fullName}</span>
                      <span className="text-[11px] text-stone-500">
                        {ord.customer.city} · {ord.customer.mobile}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium">
                      <span>{ord.items.length} Products</span>
                      <span className="text-[10px] text-stone-400 block line-clamp-1">
                        {ord.items.map((i) => i.name).join(', ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-900">
                      <span>Rs. {ord.total.toLocaleString()}</span>
                      <span className="text-[10px] text-stone-500 block font-normal">{ord.paymentMethod}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800'
                            : ord.orderStatus === 'DISPATCHED' || ord.orderStatus === 'OUT_FOR_DELIVERY'
                            ? 'bg-purple-100 text-purple-800'
                            : ord.orderStatus === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px]">
                      {ord.trackingNumber ? (
                        <div>
                          <span className="font-mono font-bold text-emerald-800 block">{ord.trackingNumber}</span>
                          <span className="text-stone-400">{ord.courierName || 'Courier'}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Not Dispatched</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenOrderDetails(ord, 'invoice')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-md shadow-2xs transition text-[11px]"
                          title="Print / View Official Invoice"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Invoice</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenOrderDetails(ord)}
                          className="px-3 py-1.5 bg-[#0e4d34] hover:bg-[#093926] text-white font-bold rounded-md shadow-xs transition"
                        >
                          Manage
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

      {/* Order Details & Tracking Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden" id="printable-order">
            {/* Modal Header */}
            <div className="no-print px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold font-serif text-stone-900">
                  Order Details: {selectedOrder.id}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                  {selectedOrder.orderStatus}
                </span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('logistics')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    activeTab === 'logistics'
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Logistics & Actions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('invoice')}
                  className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                    activeTab === 'invoice'
                      ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Invoice (رسید)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('invoice');
                    setTimeout(() => window.print(), 100);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0e4d34] hover:bg-[#093926] text-white rounded-lg shadow-2xs text-xs font-bold transition cursor-pointer"
                  title="Print Official Tax Invoice"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/60 transition"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs bg-stone-100/50 print:p-0 print:bg-white">
              {activeTab === 'invoice' ? (
                /* Dedicated Invoice View in Order Details */
                <OrderInvoice
                  order={selectedOrder}
                  onPrint={() => window.print()}
                  showControls={true}
                />
              ) : (
                /* Logistics & Actions View */
                <>
                  {/* Quick Invoice Action Banner */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                    <div>
                      <span className="font-bold text-emerald-950 block text-xs">
                        Official Commercial Tax Invoice / رسید
                      </span>
                      <span className="text-stone-600 text-[11px]">
                        Review formatted tax invoice with Agro Baadshah logo, customer coordinates, and certified line-items.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('invoice')}
                        className="px-3.5 py-2 bg-white hover:bg-stone-50 text-emerald-900 border border-emerald-300 font-bold rounded-lg shadow-2xs text-xs flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>View Invoice</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('invoice');
                          setTimeout(() => window.print(), 100);
                        }}
                        className="px-3.5 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white font-bold rounded-lg shadow-2xs text-xs flex items-center gap-1.5 transition"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Print Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Status Action Buttons */}
                  <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                    <span className="font-bold text-stone-700 uppercase tracking-wider block">
                      Update Order Status (Synchronizes with customer live tracking):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange('CONFIRMED')}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow-xs"
                      >
                        Mark Confirmed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('PROCESSING')}
                        className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded shadow-xs"
                      >
                        Mark Processing
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('DISPATCHED')}
                        className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded shadow-xs"
                      >
                        Mark Dispatched
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('OUT_FOR_DELIVERY')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-xs"
                      >
                        Mark Out for Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('DELIVERED')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow-xs"
                      >
                        Mark Delivered
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('CANCELLED')}
                        className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded shadow-xs"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>

              {/* Visual Tracking Timeline */}
              <div className="p-5 bg-white border border-stone-200 rounded-xl">
                <TrackingTimeline
                  events={selectedOrder.trackingEvents}
                  currentStatus={selectedOrder.orderStatus}
                />
              </div>

              {/* Courier Tracking Details Form */}
              <form onSubmit={handleSaveCourierDetails} className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider">
                  Courier Consignment & Tracking URL
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Courier Name</label>
                    <input
                      type="text"
                      placeholder="e.g. TCS Express / Leopard / Mandi Cargo"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Tracking / Consignment Number</label>
                    <input
                      type="text"
                      placeholder="e.g. TCS-99120485"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Courier Portal URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-semibold">Tracking Notes for Customer</label>
                  <input
                    type="text"
                    placeholder="Dispatched from Khanpur Gallah Mandi hub..."
                    value={trackingNotes}
                    onChange={(e) => setTrackingNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded shadow-xs"
                  >
                    Save Courier Info
                  </button>
                </div>
              </form>

              {/* Customer and Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-1.5">
                  <h4 className="font-bold uppercase tracking-wider text-stone-900 mb-2">Customer Coordinates</h4>
                  <p><strong>Name:</strong> {selectedOrder.customer.fullName}</p>
                  <p><strong>Mobile:</strong> {selectedOrder.customer.mobile}</p>
                  <p><strong>WhatsApp:</strong> {selectedOrder.customer.whatsapp}</p>
                  <p><strong>Address:</strong> {selectedOrder.customer.address}</p>
                  <p><strong>Tehsil & District:</strong> {selectedOrder.customer.tehsil}, {selectedOrder.customer.city} ({selectedOrder.customer.province})</p>
                  {selectedOrder.customer.landmark && <p><strong>Landmark:</strong> {selectedOrder.customer.landmark}</p>}
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-stone-900 mb-2">Products in Order</h4>
                  <div className="divide-y divide-stone-100 max-h-40 overflow-y-auto">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between">
                        <span>{item.quantity}× {item.name} ({item.packSize})</span>
                        <span className="font-bold">Rs. {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-stone-200 text-right space-y-1">
                    <p>Subtotal: Rs. {selectedOrder.subtotal.toLocaleString()}</p>
                    {selectedOrder.discount > 0 && <p className="text-emerald-700">Discount: -Rs. {selectedOrder.discount.toLocaleString()}</p>}
                    <p>Delivery: Rs. {selectedOrder.deliveryFee.toLocaleString()}</p>
                    <p className="font-bold text-sm text-[#0e4d34]">Total: Rs. {selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )}

      {/* Printable Invoice Modal */}
      {invoiceOrder && (
        <PrintableInvoice
          order={invoiceOrder}
          isOpen={!!invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
