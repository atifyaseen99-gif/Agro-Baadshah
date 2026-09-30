import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, ChevronRight, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import { guideService, settingsService } from '../../services';

export const GuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = guideService.getBySlug(slug || '');
  const settings = settingsService.get();

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-900">Guide Not Found</h2>
        <Link to="/guides" className="inline-block mt-4 text-xs font-bold text-emerald-800 underline">
          Return to Knowledge Hub
        </Link>
      </div>
    );
  }

  const phoneClean = settings.whatsapp.replace(/\D/g, '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500">
        <Link to="/" className="hover:text-emerald-800">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to="/guides" className="hover:text-emerald-800">Knowledge Hub</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate">{guide.title}</span>
      </nav>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs">
        {/* Header */}
        <div className="space-y-3 border-b border-stone-100 pb-6">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full uppercase tracking-wider">
            {guide.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900 leading-tight">
            {guide.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-2">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              {guide.author}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {guide.publishedDate}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {guide.readTime}
            </span>
          </div>
        </div>

        {/* Key Takeaways Box */}
        {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
              Key Recommendations for Farmers:
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-800">
              {guide.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-stone text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4 whitespace-pre-line">
          {guide.content}
        </div>

        {/* Agronomy Help Banner */}
        <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50 p-6 rounded-xl">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Have Questions About This Crop?</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Contact our agronomists at Khanpur Gallah Mandi directly on WhatsApp.
            </p>
          </div>
          <a
            href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
              `Assalam-o-Alaikum Agro Baadshah, I have a question regarding the guide: "${guide.title}".`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-2 shadow-xs transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consult Agronomist</span>
          </a>
        </div>
      </div>
    </div>
  );
};
