import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, User } from 'lucide-react';
import { guideService } from '../../services';

export const GuidesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const allGuides = guideService.getAll();

  const categories = ['all', 'Crop Guide', 'Pest Control', 'Disease Management', 'Weed Control', 'Spray Tips'];

  const filtered = selectedCategory === 'all'
    ? allGuides
    : allGuides.filter((g) => g.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Farmer Advisory</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
          Agriculture Knowledge Hub (زرعی رہنمائی و معلومات)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Field-tested agronomic articles, spray calibration best practices, and pest management guides by Agro Baadshah experts.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {cat === 'all' ? 'All Guides' : cat}
          </button>
        ))}
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((guide) => (
          <Link
            key={guide.id}
            to={`/guide/${guide.slug}`}
            className="group bg-white border border-stone-200 rounded-2xl p-6 hover:border-emerald-600 transition hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-emerald-800">{guide.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {guide.readTime}
                </span>
              </div>

              <h2 className="text-base font-bold font-serif text-stone-900 group-hover:text-emerald-800 transition leading-snug">
                {guide.title}
              </h2>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {guide.summary}
              </p>

              {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 space-y-1">
                  <span className="text-[11px] font-bold text-stone-700 block">Key Takeaway:</span>
                  <p className="text-[11px] text-stone-600 line-clamp-2">
                    {guide.keyTakeaways[0]}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800 mt-4">
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
