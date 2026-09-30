import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cropService, productService } from '../../services';

export const CropsPage: React.FC = () => {
  const crops = cropService.getAll();
  const products = productService.getAll();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Crop-Specific Agronomy</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
          Shop by Agricultural Crop (فصل کے مطابق خریداری)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Select your crop to view targeted pest, weed, and disease solutions verified for Pakistani farming conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => {
          const cropKeyword = crop.name.split(' ')[0].toLowerCase();
          const matchCount = products.filter((p) =>
            p.targetCrops.some((c) => c.toLowerCase().includes(cropKeyword))
          ).length;

          return (
            <div
              key={crop.id}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-600 transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video bg-stone-100 overflow-hidden relative">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold rounded">
                    {matchCount} Solutions
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold font-serif text-stone-900">{crop.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{crop.description}</p>

                  {crop.commonPests.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Common Pests:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {crop.commonPests.map((p, idx) => (
                          <span key={idx} className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {crop.commonDiseases.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Common Diseases:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {crop.commonDiseases.map((d, idx) => (
                          <span key={idx} className="text-[10px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/shop?crop=${crop.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition"
                >
                  <span>View Products for {crop.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
