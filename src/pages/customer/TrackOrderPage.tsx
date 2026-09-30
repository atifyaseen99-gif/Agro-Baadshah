import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, ExternalLink, MessageCircle, AlertCircle, Calendar, MapPin, FileText, Printer } from 'lucide-react';
import { TrackingTimeline } from '../../components/customer/TrackingTimeline';
import { PrintableInvoice } from '../../components/common/PrintableInvoice';
import { orderService, settingsService } from '../../services';
import { Order } from '../../types';

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialQuery);
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const settings = settingsService.get();

  const performSearch = (id: string, phone?: string) => {
    if (!id.trim() && !phone?.trim()) return;

    let found = orderService.getById(id.trim());
    if (!found && phone?.trim()) {
      found = orderService.search(phone.trim());
    }
    if (!found && id.trim()) {
      found = orderService.search(id.trim());
    }

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      setSearchParams({ id: orderIdInput.trim() });
    }
    performSearch(orderIdInput, phoneInput);
  };

  const phoneClean = settings.whatsapp.replace(/\D/g, '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Agro Baadshah Logistics
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
          Track Your Agricultural Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Enter your Order ID (e.g., <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-emerald-900">AB-2026-8941</code>) or registered mobile number.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Order ID (e.g. AB-2026-8941)
              </label>
              <input
                type="text"
                placeholder="AB-2026-XXXX"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="0300XXXXXXX"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Track Order</span>
          </button>
        </form>
      </div>

      {/* Results Display */}
      {hasSearched && (
        <div>
          {searchedOrder ? (
            <div className="space-y-6">
              {/* Order Status Card */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Order Reference</span>
                    <h2 className="text-xl font-bold font-serif text-stone-900">{searchedOrder.id}</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()} · Payment: {searchedOrder.paymentMethod}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div>
                      <span className="text-xs font-semibold text-stone-500 mr-2">Status:</span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full uppercase tracking-wider">
                        {searchedOrder.orderStatus}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowInvoice(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-xs transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Print Official Invoice (رسید)</span>
                    </button>
                  </div>
                </div>

                {/* Printable Invoice Modal */}
                <PrintableInvoice
                  order={searchedOrder}
                  isOpen={showInvoice}
                  onClose={() => setShowInvoice(false)}
                />

                {/* Visual Tracking Timeline */}
                <TrackingTimeline
                  events={searchedOrder.trackingEvents}
                  currentStatus={searchedOrder.orderStatus}
                />

                {/* Courier details & Track with courier button */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold text-stone-900">Courier Partner: {searchedOrder.courierName || 'Pending Allocation'}</p>
                    <p className="text-stone-600 mt-0.5">
                      Consignment # <strong className="font-mono text-emerald-800">{searchedOrder.trackingNumber || 'Pending pickup'}</strong>
                    </p>
                    {searchedOrder.trackingNotes && (
                      <p className="text-stone-500 text-[11px] mt-1">{searchedOrder.trackingNotes}</p>
                    )}
                  </div>

                  {searchedOrder.trackingUrl && (
                    <a
                      href={searchedOrder.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shrink-0 transition"
                    >
                      <span>Track with Courier</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Customer and Items breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 text-xs">
                  <div className="space-y-1 text-stone-600">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-800" />
                      Recipient Address
                    </h4>
                    <p><strong>Name:</strong> {searchedOrder.customer.fullName}</p>
                    <p><strong>Mobile:</strong> {searchedOrder.customer.mobile}</p>
                    <p><strong>Address:</strong> {searchedOrder.customer.address}, {searchedOrder.customer.tehsil}, {searchedOrder.customer.city}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-emerald-800" />
                      Items in Consignment ({searchedOrder.items.length})
                    </h4>
                    <div className="divide-y divide-stone-100 max-h-40 overflow-y-auto">
                      {searchedOrder.items.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between">
                          <span className="text-stone-800 font-medium">
                            {item.quantity}× {item.name} ({item.packSize})
                          </span>
                          <span className="font-bold text-stone-900">Rs. {item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-stone-200 text-right font-extrabold text-stone-900">
                      Total: <span className="text-[#0e4d34]">Rs. {searchedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
              <h3 className="text-base font-bold text-rose-900">No Order Found</h3>
              <p className="text-xs text-rose-700 max-w-sm mx-auto">
                We could not find an order matching <code className="font-bold">{orderIdInput || phoneInput}</code>.
                Please double check your Order ID or contact our Khanpur team directly on WhatsApp.
              </p>
              <a
                href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum Agro Baadshah, please help me track my order #${orderIdInput || ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Help via WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
