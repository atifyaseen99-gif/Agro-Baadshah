import React from 'react';
import { Printer, ShieldCheck, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';
import { settingsService } from '../../services';
import { numberToWordsPKR } from '../../utils/numberToWords';
import logoImg from '../../assets/images/logo.jpg';

interface OrderInvoiceProps {
  order: Order;
  onPrint?: () => void;
  showControls?: boolean;
}

export const OrderInvoice: React.FC<OrderInvoiceProps> = ({
  order,
  onPrint,
  showControls = true,
}) => {
  const settings = settingsService.get();

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const invoiceNumber = `INV-${order.id.replace('AB-', '')}`;
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar (Excluded during printing via .no-print) */}
      {showControls && (
        <div className="no-print bg-[#082a1c] text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-sm border border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/40 bg-[#06140e] shrink-0 p-0.5">
              <img src={logoImg} alt="Agro Baadshah" className="w-full h-full object-cover rounded-md" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold tracking-tight">
                Official Commercial Invoice: {order.id}
              </p>
              <p className="text-[11px] text-emerald-300">
                A4 Portrait Format · Ready for instant printing or PDF export
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Print Invoice</span>
          </button>
        </div>
      )}

      {/* Printable Invoice Sheet */}
      <div
        id="printable-invoice"
        className="bg-white p-6 sm:p-10 rounded-2xl shadow-md border border-stone-200 text-stone-800 font-sans space-y-6 print:p-0 print:border-none print:shadow-none print:rounded-none"
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-[#072418] via-emerald-800 to-amber-500 rounded-full print:rounded-none" />

        {/* Header: Brand Logo, Store Info & Invoice Meta */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-stone-200">
          {/* Logo & Company Identification */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-500/50 shrink-0 bg-[#06140e] p-0.5">
              <img
                src={logoImg}
                alt="Agro Baadshah Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-serif text-[#082d1e] tracking-tight uppercase">
                  Agro Baadshah
                </h1>
                <span className="text-sm font-bold text-emerald-800">ایگرو بادشاہ</span>
              </div>
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                Solutions For A Better Tomorrow · زرعی ادویات و کھادیں
              </p>
              <p className="text-[11px] text-stone-600 font-medium leading-relaxed max-w-sm">
                {settings.address}, Tehsil {settings.tehsil}, District {settings.district}, Punjab, Pakistan.
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-stone-500 pt-0.5">
                <span>Phone / WA: <strong className="text-stone-800">{settings.phone}</strong></span>
                <span>·</span>
                <span>Email: <strong className="text-stone-800">{settings.email}</strong></span>
              </div>
              <div className="text-[10px] text-emerald-950 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                Govt. Punjab Agri-Inputs Retail Reg: RYK-KNP-0033 · NTN: 8492019-4
              </div>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="sm:text-right bg-stone-50 sm:bg-transparent p-4 sm:p-0 rounded-xl w-full sm:w-auto border sm:border-0 border-stone-200">
            <span className="inline-block px-3 py-1 bg-[#0b3826] text-white text-[11px] font-bold uppercase tracking-wider rounded-md mb-2 shadow-2xs">
              Tax Invoice / Cash Memo
            </span>
            <p className="text-base font-extrabold text-stone-900 font-mono">
              {invoiceNumber}
            </p>
            <p className="text-xs text-stone-600 mt-0.5">
              Order Ref: <strong className="font-mono text-emerald-900">{order.id}</strong>
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Date: <strong>{formattedDate}</strong> ({formattedTime})
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Payment Mode: <strong className="text-stone-800">{order.paymentMethod}</strong>
            </p>
            <div className="mt-2 inline-block">
              <span
                className={`px-3 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                  order.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                Status: {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Coordinates & Courier Logistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Customer Billed To */}
          <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-200/80 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Billed To / معزز کسان
            </span>
            <p className="text-sm font-bold text-stone-900">{order.customer.fullName}</p>
            <p className="text-stone-600">
              Primary Mobile: <strong className="text-stone-800">{order.customer.mobile}</strong>
              {order.customer.whatsapp && ` · WA: ${order.customer.whatsapp}`}
            </p>
            <p className="text-stone-600">
              Delivery Address: <strong>{order.customer.address}</strong>
            </p>
            <p className="text-stone-600">
              Tehsil & City: {order.customer.tehsil}, {order.customer.city} ({order.customer.province})
            </p>
            {order.customer.landmark && (
              <p className="text-stone-500 italic">Nearby Landmark: {order.customer.landmark}</p>
            )}
          </div>

          {/* Shipping & Consignment Box */}
          <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-200/80 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Dispatch & Consignment / ترسیل کی تفصیلات
            </span>
            <p className="text-stone-800">
              Courier Service: <strong>{order.courierName || 'TCS Express Pakistan'}</strong>
            </p>
            <p className="text-stone-800 font-mono">
              Consignment Tracking #: <strong>{order.trackingNumber || 'Pending Pickup Hub'}</strong>
            </p>
            <p className="text-stone-600">
              Origin: <strong>Main Gallah Mandi Hub, Khanpur</strong>
            </p>
            <p className="text-stone-600">
              Destination: <strong>{order.customer.city} ({order.customer.province})</strong>
            </p>
            {order.notes && (
              <p className="text-[11px] text-stone-500 italic">Order Note: {order.notes}</p>
            )}
          </div>
        </div>

        {/* Line-Item Table */}
        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left divide-y divide-stone-200">
            <thead className="bg-[#0b3826] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">Description of Agri-Product</th>
                <th className="py-2.5 px-3 text-center">Pack Size</th>
                <th className="py-2.5 px-3 text-right">Unit Rate</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Total (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {order.items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-3 px-3 text-center text-stone-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold">
                    <span className="text-stone-900 block font-bold">{item.name}</span>
                    <span className="text-[10px] text-emerald-800 block">
                      Certified Pesticide / Foliar Formulation · Original Factory Seal
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-stone-600">{item.packSize}</td>
                  <td className="py-3 px-3 text-right font-mono">
                    Rs. {item.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-stone-900">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-stone-900 font-mono">
                    Rs. {item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary & Bank Details */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
          {/* Amount in words & Bank info (7 cols) */}
          <div className="sm:col-span-7 space-y-3 text-xs">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 block">
                Amount in Words / کل رقم الفاظ میں
              </span>
              <p className="font-bold text-emerald-900 italic">
                {numberToWordsPKR(order.total)}
              </p>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600 space-y-1">
              <span className="font-bold text-stone-900 block">Store Bank Coordinates (for direct transfer):</span>
              <p>{settings.bankDetails.bankName}</p>
              <p>Account Title: <strong>{settings.bankDetails.accountTitle}</strong></p>
              <p>Account No: <strong className="font-mono">{settings.bankDetails.accountNumber}</strong></p>
              <p>IBAN: <strong className="font-mono">{settings.bankDetails.iban}</strong></p>
            </div>
          </div>

          {/* Pricing Breakdown (5 cols) */}
          <div className="sm:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900 font-mono">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount Coupon</span>
                <span className="font-mono">-Rs. {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Shipping & Cargo (All Pakistan)</span>
              <span className="font-bold text-stone-900 font-mono">
                {order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee.toLocaleString()}`}
              </span>
            </div>
            <div className="pt-2 border-t-2 border-stone-300 flex justify-between items-baseline">
              <span className="font-extrabold text-stone-900 text-sm">Grand Total Due</span>
              <span className="text-base sm:text-lg font-black text-[#082d1e] font-mono">
                Rs. {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Signatures & Official Stamp Seal */}
        <div className="pt-8 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-xs">
          {/* Receiver Signature */}
          <div className="text-center space-y-2">
            <div className="border-b border-stone-400 w-36 mx-auto h-12" />
            <p className="text-[11px] text-stone-600 font-semibold">
              Receiver Signature / دستخط وصول کنندہ
            </p>
          </div>

          {/* Official Stamp Seal */}
          <div className="text-center hidden sm:flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-800 flex flex-col items-center justify-center p-1 text-[#082d1e] rotate-[-6deg] opacity-85">
              <div className="w-20 h-20 rounded-full border border-emerald-700 flex flex-col items-center justify-center text-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-950">AGRO BAADSHAH</span>
                <span className="text-[10px]">★ ★ ★</span>
                <span className="text-[7px] font-bold uppercase text-emerald-800">MAIN MANDI KHANPUR</span>
                <span className="text-[6px] text-stone-500 uppercase">OFFICIAL SEAL</span>
              </div>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 font-medium">Verified Commercial Document</span>
          </div>

          {/* Authorized Signatory */}
          <div className="text-center space-y-2">
            <div className="border-b border-stone-400 w-36 mx-auto h-12 flex items-end justify-center pb-1">
              <span className="font-serif italic font-bold text-emerald-900 text-xs tracking-wider">
                Agro Baadshah
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-semibold">
              Authorized Signatory / مجاز دستخط
            </p>
          </div>
        </div>

        {/* Disclaimer & Footer */}
        <div className="pt-4 border-t border-stone-100 text-[10px] text-stone-500 text-center leading-relaxed">
          <p>
            <strong>Terms:</strong> Registered agricultural chemicals. Please inspect security holograms and seals
            upon courier delivery. Follow label safety instructions (PHI and PPE precautions).
          </p>
          <p className="mt-1 font-semibold text-stone-600">
            Agro Baadshah · Shop No. 33, Main Gallah Mandi, Khanpur, Rahim Yar Khan, Punjab · Helpline: +92 314 4047044
          </p>
        </div>
      </div>
    </div>
  );
};
