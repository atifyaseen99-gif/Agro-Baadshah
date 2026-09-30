import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bug, Activity } from 'lucide-react';
import { pestService, diseaseService } from '../../services';

export const PestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pests' | 'diseases'>('pests');
  const pests = pestService.getAll();
  const diseases = diseaseService.getAll();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Crop Protection Directory</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
          Pests & Disease Solutions (کیڑوں اور بیماریوں کا علاج)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Identify insect pest symptoms and fungal/bacterial diseases with recommended chemical active ingredients.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('pests')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'pests'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Major Insect Pests ({pests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diseases')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'diseases'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Crop Diseases ({diseases.length})</span>
        </button>
      </div>

      {/* Pests list */}
      {activeTab === 'pests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pests.map((pest) => (
            <div
              key={pest.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-600 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">{pest.name}</h3>
                    {pest.urduName && (
                      <span className="text-xs font-bold text-emerald-800 block mt-0.5">{pest.urduName}</span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-lg">
                    🪲
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{pest.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                  <div>
                    <span className="font-semibold text-stone-700">Affected Crops:</span>
                    <p className="text-stone-500">{pest.affectedCrops.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Recommended Active Ingredients:</span>
                    <p className="text-emerald-800 font-medium">{pest.recommendedIngredients.join(', ')}</p>
                  </div>
                </div>
              </div>

              <Link
                to={`/shop?pest=${encodeURIComponent(pest.name)}`}
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl transition"
              >
                <span>Find Pesticides for {pest.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Diseases list */}
      {activeTab === 'diseases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((dis) => (
            <div
              key={dis.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-600 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">{dis.name}</h3>
                    {dis.urduName && (
                      <span className="text-xs font-bold text-purple-800 block mt-0.5">{dis.urduName}</span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
                    🔬
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{dis.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                  <div>
                    <span className="font-semibold text-stone-700">Affected Crops:</span>
                    <p className="text-stone-500">{dis.affectedCrops.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Recommended Fungicide Actives:</span>
                    <p className="text-emerald-800 font-medium">{dis.recommendedIngredients.join(', ')}</p>
                  </div>
                </div>
              </div>

              <Link
                to={`/shop?category=cat-fungicides`}
                className="w-full flex items-center justify-center gap-2 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs rounded-xl transition"
              >
                <span>Find Fungicides for {dis.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
