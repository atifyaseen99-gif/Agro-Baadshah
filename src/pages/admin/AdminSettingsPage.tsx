import React, { useState } from 'react';
import { Save, Store, MapPin, Phone, Mail, Clock, Truck, CreditCard } from 'lucide-react';
import { settingsService } from '../../services';
import { StoreSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(() => settingsService.get());
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: e.target.type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    settingsService.update(settings);
    showToast('Store settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Store Settings & Business Profile</h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure business details, official WhatsApp number, delivery fees, and bank account information.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Details */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-800" />
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Store Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Official Order Phone</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Official WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Official Email Address</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Business Hours</label>
              <input
                type="text"
                name="businessHours"
                value={settings.businessHours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Address Location Details */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-800" />
            Khanpur Mandi Shop Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block font-bold text-stone-700 mb-1">Street Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Tehsil</label>
              <input
                type="text"
                name="tehsil"
                value={settings.tehsil}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">District</label>
              <input
                type="text"
                name="district"
                value={settings.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Province & Country</label>
              <input
                type="text"
                name="province"
                value={`${settings.province}, ${settings.country}`}
                readOnly
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-800" />
            Nationwide Shipping & Freight
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                name="standardDeliveryFee"
                value={settings.standardDeliveryFee}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                name="freeDeliveryThreshold"
                value={settings.freeDeliveryThreshold}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Bank & Mobile Account Coordinates */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-800" />
            Payment Accounts (Bank, Easypaisa, JazzCash)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Bank Name & Branch</label>
              <input
                type="text"
                name="bankDetails.bankName"
                value={settings.bankDetails.bankName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Bank Account Title</label>
              <input
                type="text"
                name="bankDetails.accountTitle"
                value={settings.bankDetails.accountTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Bank Account Number</label>
              <input
                type="text"
                name="bankDetails.accountNumber"
                value={settings.bankDetails.accountNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">IBAN Number</label>
              <input
                type="text"
                name="bankDetails.iban"
                value={settings.bankDetails.iban}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Easypaisa Mobile Number</label>
              <input
                type="text"
                name="easypaisaDetails.mobileNumber"
                value={settings.easypaisaDetails.mobileNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">JazzCash Mobile Number</label>
              <input
                type="text"
                name="jazzCashDetails.mobileNumber"
                value={settings.jazzCashDetails.mobileNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0e4d34] hover:bg-[#093926] text-white font-bold rounded-lg shadow transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
