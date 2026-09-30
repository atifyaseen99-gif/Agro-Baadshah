import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { settingsService } from '../../services';
import logoImg from '../../assets/images/logo.jpg';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    totalItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);
  const navigate = useNavigate();
  const settings = settingsService.get();

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, success: res.success });
    if (res.success) setCouponCode('');
  };

  const handleWhatsAppCheckout = () => {
    const phoneClean = settings.whatsapp.replace(/\D/g, '');
    let msg = `*Order Inquiry via Cart — Agro Baadshah*\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}* (${item.product.packSize})\n   Qty: ${item.quantity} × Rs. ${item.selectedPrice.toLocaleString()} = Rs. ${(item.quantity * item.selectedPrice).toLocaleString()}\n`;
    });
    msg += `\n*Subtotal:* Rs. ${subtotal.toLocaleString()}`;
    if (discount > 0) msg += `\n*Discount:* -Rs. ${discount.toLocaleString()}`;
    msg += `\n*Delivery:* Rs. ${deliveryFee.toLocaleString()}`;
    msg += `\n*Grand Total:* Rs. ${grandTotal.toLocaleString()}`;
    msg += `\n\nPlease confirm availability and delivery timeframe to my address.`;

    window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 5000;
  const progressToFreeDelivery = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-amber-500/40 shrink-0 bg-[#06140e]">
                <img src={logoImg} alt="Agro Baadshah" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-stone-900 leading-tight">Agro Baadshah Cart</h2>
                <span className="text-[10px] text-stone-500 font-medium">Certified Agri-Inputs</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full ml-1">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery progress bar */}
          <div className="bg-emerald-50/70 px-6 py-2.5 border-b border-emerald-100 text-xs text-stone-700">
            {subtotal >= freeDeliveryThreshold ? (
              <p className="font-semibold text-emerald-800 flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked FREE Nationwide Delivery!
              </p>
            ) : (
              <div>
                <p className="font-medium text-stone-700">
                  Add{' '}
                  <span className="font-bold text-emerald-800">
                    Rs. {(freeDeliveryThreshold - subtotal).toLocaleString()}
                  </span>{' '}
                  more for <span className="font-bold text-emerald-900">FREE Delivery</span>!
                </p>
                <div className="w-full bg-emerald-200/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeDelivery}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Drawer Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-500/40 bg-[#06140e] p-0.5 mb-3 shadow-md">
                  <img src={logoImg} alt="Agro Baadshah" className="w-full h-full object-cover rounded-xl" />
                </div>
                <h3 className="font-bold text-stone-800 text-base">Your cart is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Browse authentic agricultural pesticides, weedicides, and fertilizers to get started.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-5 px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-emerald-900 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-stone-200 bg-stone-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 truncate">{item.product.name}</h4>
                        <p className="text-[11px] text-stone-500">{item.product.packSize}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-stone-200 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-stone-600 hover:bg-stone-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-stone-600 hover:bg-stone-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-900">
                          Rs. {(item.selectedPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 p-6 bg-stone-50 space-y-3">
              {/* Coupon form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-100/60 border border-emerald-300 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{appliedCoupon.code} applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-700 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g., BAADSHAH10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md uppercase focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-800 text-white text-xs font-semibold rounded-md hover:bg-stone-900"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1 font-medium ${
                      couponMsg.success ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/80 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery (All Pakistan)</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 border-t border-stone-200 pt-2">
                  <span>Grand Total</span>
                  <span className="text-[#0e4d34]">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#0e4d34] hover:bg-[#093926] text-white font-bold text-sm rounded-lg shadow transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300/80 font-semibold text-xs rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Order via WhatsApp Direct</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
