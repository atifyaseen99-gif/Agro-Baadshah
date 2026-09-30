import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, MessageCircle, MapPin, ArrowRight, Printer, FileText } from 'lucide-react';
import { TrackingTimeline } from '../../components/customer/TrackingTimeline';
import { PrintableInvoice } from '../../components/common/PrintableInvoice';
import { orderService, settingsService } from '../../services';
import logoImg from '../../assets/images/logo.jpg';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [showInvoice, setShowInvoice] = useState(false);
  const order = orderService.getById(orderId || '');
  const settings = settingsService.get();

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500">Could not locate order #{orderId}.</p>
        <Link to="/track-order" className="inline-block px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-lg">
          Track Another Order
        </Link>
      </div>
    );
  }

  const phoneClean = settings.whatsapp.replace(/\D/g, '');

  const handleSendWhatsAppConfirmation = () => {
    let msg = `*Agro Baadshah — Order Confirmation*\n\n`;
    msg += `*Order ID:* ${order.id}\n`;
    msg += `*Customer:* ${order.customer.fullName} (${order.customer.mobile})\n`;
    msg += `*Address:* ${order.customer.address}, ${order.customer.tehsil}, ${order.customer.city}, ${order.customer.province}\n\n`;
    msg += `*Items Ordered:*\n`;
    order.items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (${item.packSize}) × ${item.quantity} = Rs. ${item.total.toLocaleString()}\n`;
    });
    msg += `\n*Subtotal:* Rs. ${order.subtotal.toLocaleString()}`;
    if (order.discount > 0) msg += `\n*Discount:* -Rs. ${order.discount.toLocaleString()}`;
    msg += `\n*Delivery:* Rs. ${order.deliveryFee.toLocaleString()}`;
    msg += `\n*Grand Total:* Rs. ${order.total.toLocaleString()}`;
    msg += `\n*Payment Method:* ${order.paymentMethod}`;
    msg += `\n\nPlease confirm dispatch from your Khanpur shop. Shukriya!`;

    window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8" id="printable-order">
      {/* Success banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-500/40 mx-auto bg-[#07130e] p-0.5">
          <img
            src={logoImg}
            alt="Agro Baadshah Logo"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h1 className="text-2xl font-bold font-serif text-emerald-950">
          Shukriya! Your Order Has Been Received
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
          Order reference <strong>#{order.id}</strong> has been registered. Our Khanpur dispatch center will verify and
          hand it over to the courier.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setShowInvoice(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Print Official Invoice (بل / رسید)</span>
          </button>
          <button
            onClick={handleSendWhatsAppConfirmation}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order Copy to WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      <PrintableInvoice
        order={order}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />

      {/* Visual Tracking Timeline */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Live Order Tracking ({order.id})
            </h3>
            <p className="text-xs text-stone-500">Current Status: <strong className="text-emerald-800">{order.orderStatus}</strong></p>
          </div>
          <Link
            to={`/track-order?id=${order.id}`}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>Public Tracking Link</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TrackingTimeline events={order.trackingEvents} currentStatus={order.orderStatus} />
      </div>

      {/* Order & Customer Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-xs text-xs text-stone-600">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-800" />
            Delivery Destination
          </h4>
          <p><strong>Customer Name:</strong> {order.customer.fullName}</p>
          <p><strong>Mobile:</strong> {order.customer.mobile}</p>
          {order.customer.whatsapp && <p><strong>WhatsApp:</strong> {order.customer.whatsapp}</p>}
          <p><strong>Address:</strong> {order.customer.address}</p>
          <p><strong>Tehsil & District:</strong> {order.customer.tehsil}, {order.customer.city} ({order.customer.province})</p>
          {order.customer.landmark && <p><strong>Landmark:</strong> {order.customer.landmark}</p>}
          {order.notes && <p className="italic text-stone-500 pt-1"><strong>Notes:</strong> {order.notes}</p>}
        </div>

        {/* Payment & Courier info */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-xs text-xs text-stone-600">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-800" />
            Dispatch & Courier
          </h4>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> <span className="font-semibold text-emerald-800">{order.paymentStatus}</span></p>
          <p><strong>Courier:</strong> {order.courierName || 'Assigned at dispatch (TCS / Leopard / Cargo)'}</p>
          <p><strong>Tracking Number:</strong> {order.trackingNumber || 'Generated upon pickup'}</p>
          {order.trackingUrl && (
            <p>
              <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline font-semibold">
                Track on Courier Portal →
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Items Summary */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
          Ordered Items
        </h4>
        <div className="divide-y divide-stone-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded border border-stone-200"
                />
                <div>
                  <p className="font-bold text-stone-900">{item.name}</p>
                  <p className="text-stone-500">{item.packSize} · Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-stone-900">Rs. {item.total.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-right text-stone-600">
          <p>Subtotal: <strong className="text-stone-900">Rs. {order.subtotal.toLocaleString()}</strong></p>
          {order.discount > 0 && <p className="text-emerald-700">Discount: <strong>-Rs. {order.discount.toLocaleString()}</strong></p>}
          <p>Shipping: <strong className="text-stone-900">{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee.toLocaleString()}`}</strong></p>
          <p className="text-base font-extrabold text-[#0e4d34] pt-2 border-t border-stone-100">
            Grand Total: Rs. {order.total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
