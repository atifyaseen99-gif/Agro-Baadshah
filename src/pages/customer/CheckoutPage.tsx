import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, MessageCircle, CreditCard, Banknote, Building, Smartphone, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { orderService, settingsService } from '../../services';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const settings = settingsService.get();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    whatsapp: '',
    province: 'Punjab',
    city: 'Khanpur',
    tehsil: 'Khanpur',
    address: '',
    landmark: '',
    orderNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash'>('COD');
  const [couponCode, setCouponCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500">Add agricultural products to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-emerald-900 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.mobile.trim() || !formData.address.trim()) {
      showToast('Please complete all required shipping fields.', 'error');
      return;
    }

    setSubmitting(true);

    const order = orderService.create({
      customer: {
        fullName: formData.fullName.trim(),
        mobile: formData.mobile.trim(),
        whatsapp: formData.whatsapp.trim() || formData.mobile.trim(),
        province: formData.province,
        city: formData.city.trim(),
        tehsil: formData.tehsil.trim(),
        address: formData.address.trim(),
        landmark: formData.landmark.trim(),
      },
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        image: i.product.images[0],
        packSize: i.product.packSize,
        price: i.selectedPrice,
        quantity: i.quantity,
        total: i.selectedPrice * i.quantity,
      })),
      subtotal,
      discount,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      notes: formData.orderNotes.trim(),
    });

    clearCart();
    showToast(`Order #${order.id} placed successfully!`);
    navigate(`/order-confirmation/${order.id}`);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    showToast(res.message, res.success ? 'success' : 'error');
    if (res.success) setCouponCode('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 pb-4 border-b border-stone-200">
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Agro Baadshah Checkout</span>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Billing & Delivery Details</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Information & Address Form (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
              1. Customer & Farm Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name / نام <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Muhammad Aslam"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number / موبائل نمبر <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  placeholder="03001234567"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  WhatsApp Number / واٹس ایپ نمبر
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="03001234567 (for dispatch updates)"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Province / صوبہ <span className="text-rose-600">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa (KPK)</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad</option>
                  <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  City / شہر <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Khanpur / Rahim Yar Khan"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tehsil / تحصیل <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="tehsil"
                  required
                  placeholder="e.g. Khanpur, Liaquatpur, Sadiqabad"
                  value={formData.tehsil}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Complete Delivery Address / مکمل پتہ <span className="text-rose-600">*</span>
              </label>
              <textarea
                name="address"
                required
                rows={2}
                placeholder="Chak No, Dera, Street, Village, or Mandi shop address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nearest Landmark / مشہور مقام (اختیاری)
              </label>
              <input
                type="text"
                name="landmark"
                placeholder="e.g. Near Sugar Mills, Main Canal Bridge, Adda"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Order Notes / خصوصی ہدایات
              </label>
              <input
                type="text"
                name="orderNotes"
                placeholder="Call before arrival, specific packaging instructions, etc."
                value={formData.orderNotes}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
              2. Payment Method / ادائیگی کا طریقہ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 border-2 rounded-xl cursor-pointer flex flex-col justify-between transition ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-emerald-700"
                  />
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-stone-500">Pay cash upon delivery by courier.</span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-emerald-800 self-end mt-2" />
              </label>

              <label
                className={`p-4 border-2 rounded-xl cursor-pointer flex flex-col justify-between transition ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Bank Transfer'}
                    onChange={() => setPaymentMethod('Bank Transfer')}
                    className="text-emerald-700"
                  />
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Direct Bank Transfer</span>
                    <span className="text-[11px] text-stone-500">HBL Bank Account Khanpur branch.</span>
                  </div>
                </div>
                <Building className="w-5 h-5 text-emerald-800 self-end mt-2" />
              </label>

              <label
                className={`p-4 border-2 rounded-xl cursor-pointer flex flex-col justify-between transition ${
                  paymentMethod === 'Easypaisa'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Easypaisa'}
                    onChange={() => setPaymentMethod('Easypaisa')}
                    className="text-emerald-700"
                  />
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Easypaisa</span>
                    <span className="text-[11px] text-stone-500">Transfer via Easypaisa mobile account.</span>
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-emerald-800 self-end mt-2" />
              </label>

              <label
                className={`p-4 border-2 rounded-xl cursor-pointer flex flex-col justify-between transition ${
                  paymentMethod === 'JazzCash'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'JazzCash'}
                    onChange={() => setPaymentMethod('JazzCash')}
                    className="text-emerald-700"
                  />
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">JazzCash</span>
                    <span className="text-[11px] text-stone-500">Transfer via JazzCash mobile account.</span>
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-emerald-800 self-end mt-2" />
              </label>
            </div>

            {/* Bank details instruction when bank transfer selected */}
            {paymentMethod === 'Bank Transfer' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1.5 text-stone-800">
                <span className="font-bold text-emerald-900 block">Agro Baadshah Official Bank Account:</span>
                <p>Bank: <strong>{settings.bankDetails.bankName}</strong></p>
                <p>Account Title: <strong>{settings.bankDetails.accountTitle}</strong></p>
                <p>Account Number: <strong>{settings.bankDetails.accountNumber}</strong></p>
                <p>IBAN: <strong>{settings.bankDetails.iban}</strong></p>
                <p className="text-[11px] text-stone-500 pt-1">
                  After placing order, please send the payment screenshot on WhatsApp to <strong>{settings.whatsapp}</strong>.
                </p>
              </div>
            )}

            {/* Easypaisa details */}
            {paymentMethod === 'Easypaisa' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-stone-800">
                <span className="font-bold text-emerald-900 block">Easypaisa Account:</span>
                <p>Title: <strong>{settings.easypaisaDetails.accountTitle}</strong></p>
                <p>Mobile: <strong>{settings.easypaisaDetails.mobileNumber}</strong></p>
                <p className="text-[11px] text-stone-500 pt-1">Send payment receipt to WhatsApp +92 314 4047044.</p>
              </div>
            )}

            {/* JazzCash details */}
            {paymentMethod === 'JazzCash' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-stone-800">
                <span className="font-bold text-emerald-900 block">JazzCash Account:</span>
                <p>Title: <strong>{settings.jazzCashDetails.accountTitle}</strong></p>
                <p>Mobile: <strong>{settings.jazzCashDetails.mobileNumber}</strong></p>
                <p className="text-[11px] text-stone-500 pt-1">Send payment receipt to WhatsApp +92 314 4047044.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Column (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 space-y-5 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
              Order Summary ({items.length} Products)
            </h3>

            {/* Items scroll */}
            <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-md border border-stone-200 bg-stone-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-stone-500">
                      {item.quantity} × Rs. {item.selectedPrice.toLocaleString()} ({item.product.packSize})
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    Rs. {(item.quantity * item.selectedPrice).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Application */}
            <div className="pt-2 border-t border-stone-100">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon {appliedCoupon.code} applied</span>
                  </div>
                  <button onClick={removeCoupon} type="button" className="text-rose-600 font-semibold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. BAADSHAH10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-stone-800 text-white text-xs font-semibold rounded-lg hover:bg-stone-900"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-semibold text-stone-900">
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 border-t border-stone-200 pt-3">
                <span>Total Amount Due</span>
                <span className="text-[#0e4d34]">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0e4d34] hover:bg-[#093926] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/20 transition disabled:opacity-50"
            >
              <span>{submitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-stone-500 space-y-1 text-center pt-2">
              <p>✓ All orders verified by phone or WhatsApp before dispatch</p>
              <p>✓ Live order tracking number provided automatically</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
