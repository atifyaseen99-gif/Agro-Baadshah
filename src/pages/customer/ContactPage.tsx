import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { settingsService } from '../../services';
import { useToast } from '../../context/ToastContext';
import logoImg from '../../assets/images/logo.jpg';

export const ContactPage: React.FC = () => {
  const settings = settingsService.get();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    crop: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to Agro Baadshah!');
    setFormData({ name: '', phone: '', crop: '', message: '' });
  };

  const phoneClean = settings.whatsapp.replace(/\D/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Gallah Mandi Khanpur Store
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900">
          Contact Agro Baadshah
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          We welcome farmers, agricultural contractors, and dealers to visit our main store or contact us via WhatsApp for instant technical advisory and bulk pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b3826] text-white p-6 sm:p-8 rounded-2xl space-y-6 shadow-md">
            <div className="flex items-center gap-3.5 border-b border-emerald-900 pb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/40 shrink-0 bg-[#06140e] p-0.5 shadow-md">
                <img src={logoImg} alt="Agro Baadshah" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <h2 className="text-base font-bold font-serif text-white">
                  Official Store Headquarters
                </h2>
                <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">Khanpur Gallah Mandi</span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-stone-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Main Retail Shop:</span>
                  <p className="mt-0.5 leading-relaxed">
                    {settings.address}, Tehsil {settings.tehsil}, District {settings.district}, Punjab, Pakistan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Helpline & Orders:</span>
                  <p className="mt-0.5">{settings.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Official WhatsApp Advisory:</span>
                  <p className="mt-0.5">{settings.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Email Address:</span>
                  <p className="mt-0.5">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Store Business Hours:</span>
                  <p className="mt-0.5 leading-relaxed">{settings.businessHours}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum Agro Baadshah, I am contacting you through your official website.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow transition"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366]" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold font-serif text-stone-900 border-b border-stone-100 pb-3 mb-5">
            Send an Agronomy Inquiry or Order Request
          </h2>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">Thank you for contacting us!</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Our Khanpur technical team will review your inquiry and contact you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-bold text-emerald-800 underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name / آپ کا نام <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Haji Ghulam Rasool"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile / WhatsApp <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="03001234567"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Crop Name / فصل (e.g., Cotton, Wheat, Sugarcane)
                </label>
                <input
                  type="text"
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  placeholder="e.g. Cotton (Whitefly / Bollworm issue)"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Message / Details of Problem <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, pest symptoms, or products required..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
