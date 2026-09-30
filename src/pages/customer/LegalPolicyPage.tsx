import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { settingsService } from '../../services';

export const LegalPolicyPage: React.FC = () => {
  const { page } = useParams<{ page: string }>();
  const settings = settingsService.get();

  const getPolicyContent = () => {
    switch (page) {
      case 'terms':
        return {
          title: 'Terms & Conditions (قواعد و ضوابط)',
          updated: 'January 2026',
          body: `
### 1. Store Operations & Orders
Agro Baadshah operates as an agricultural inputs retailer based at Main Gallah Mandi, Shop No# 33, Khanpur, Punjab. All product orders placed through this website or directly via WhatsApp are subject to physical stock confirmation, batch verification, and regional delivery feasibility.

### 2. Pricing & Currency
All prices listed on this store are in Pakistani Rupees (PKR / Rs.). Prices reflect verified retailer pricing but may be updated in accordance with manufacturer tariff changes or seasonal adjustments.

### 3. Product Authenticity
Agro Baadshah guarantees that all branded pesticides, fungicides, weedicides, and micronutrients sold through our store are 100% genuine and procured directly from authorized manufacturer distribution depots.
          `,
        };
      case 'shipping':
        return {
          title: 'Shipping & Delivery Policy (ترسیل اور ڈلیوری پالیسی)',
          updated: 'January 2026',
          body: `
### 1. Delivery Coverage
Agro Baadshah delivers agricultural inputs across all provinces of Pakistan: Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad Capital Territory, Gilgit-Baltistan, and Azad Kashmir.

### 2. Courier & Cargo Partners
- **Express Consignments:** TCS Express, Leopard Courier, and Pakistan Post for packaged bottles, cartons, and small seed packs (typically 24 to 72 hours transit).
- **Bulk Agricultural Shipments:** Specialized inter-city freight and mandhi cargo carriers for drum pesticides, granular bags (Regent/Cartap), and fertilizer consignments.

### 3. Free Delivery Threshold
Orders with a total cart value exceeding Rs. ${settings.freeDeliveryThreshold.toLocaleString()} qualify for FREE standard delivery across Pakistan. Standard orders below this amount incur a nominal flat fee of Rs. ${settings.standardDeliveryFee}.
          `,
        };
      case 'privacy-policy':
        return {
          title: 'Privacy Policy (رازداری کی پالیسی)',
          updated: 'January 2026',
          body: `
### 1. Customer Information Collection
We collect customer delivery coordinates solely for fulfilling orders, managing logistics dispatch, providing live SMS/WhatsApp consignment updates, and issuing receipts. This includes: Full Name, Contact Telephone/WhatsApp Number, Delivery Address, Tehsil, and District.

### 2. Information Protection
Customer data stored in our local application databases is never rented, traded, or shared with third-party advertising brokers. Data is accessible solely to authorized dispatch personnel at Agro Baadshah Khanpur.
          `,
        };
      case 'disclaimer':
      default:
        return {
          title: 'Pesticide Safety & Regulatory Disclaimer (زرعی ادویات سے متعلق اہم تنبیہ)',
          updated: 'January 2026',
          body: `
### Statutory Caution & Disclaimer
Agricultural pesticides, insecticides, fungicides, and weedicides are potent chemical formulations intended exclusively for registered agronomic applications under prescribed parameters.

1. **Pre-Harvest Interval (PHI):** Strictly observe the mandatory safety interval between chemical spray and crop harvest to avoid hazardous residues on edible crops.
2. **Proper PPE:** Spray operators must wear full protective gear—rubber gloves, face shield or respirator, long boots, and protective clothing. Never spray against the wind.
3. **No Unsubstantiated Claims:** Agro Baadshah provides factual product specifications and manufacturer guidelines. We do not manufacture chemicals or invent scientific dosage claims.
4. **Storage:** Keep all chemical products tightly sealed in original containers, away from direct sunlight, and strictly locked out of reach of children and farm animals.
          `,
        };
    }
  };

  const policy = getPolicyContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Agro Baadshah Legal</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">{policy.title}</h1>
        <p className="text-xs text-stone-400 mt-1">Last Updated: {policy.updated}</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-xs prose prose-stone text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line space-y-4">
        {policy.body}
      </div>

      <div className="text-xs text-stone-500 pt-4 border-t border-stone-100 flex items-center justify-between">
        <span>Agro Baadshah · Main Gallah Mandi, Khanpur</span>
        <Link to="/" className="text-emerald-800 font-semibold hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};
