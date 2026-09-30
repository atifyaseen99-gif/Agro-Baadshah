import React from 'react';
import { MessageCircle } from 'lucide-react';
import { settingsService } from '../../services';

export const FloatingWhatsApp: React.FC = () => {
  const settings = settingsService.get();
  const phoneClean = settings.whatsapp.replace(/\D/g, '');

  return (
    <a
      href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
        'Assalam-o-Alaikum Agro Baadshah, I need agricultural advisory / want to place an order.'
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order or Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
    >
      <MessageCircle className="w-5 h-5 fill-white stroke-[#25D366]" />
      <span className="hidden sm:inline font-bold">WhatsApp Advisory</span>
    </a>
  );
};
