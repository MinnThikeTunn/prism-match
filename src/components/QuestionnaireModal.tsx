import React, { useState } from 'react';
import { UserProfile, OCEANProfile } from '../types';
import { Check, Palette } from 'lucide-react';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile
}) => {
  const [ocean, setOcean] = useState<OCEANProfile>({ ...currentUser.ocean });
  const [offersInput, setOffersInput] = useState(currentUser.needsOffers.offers.join(', '));
  const [needsInput, setNeedsInput] = useState(currentUser.needsOffers.needs.join(', '));

  if (!isOpen) return null;

  const handleSave = () => {
    const newSolar = Math.round((ocean.conscientiousness * 0.7) + (ocean.openness * 0.3));
    const newNexus = Math.round((ocean.openness * 0.6) + (ocean.conscientiousness * 0.4));
    const newResonance = Math.round((ocean.agreeableness * 0.7) + ((100 - ocean.neuroticism) * 0.3));
    const globalScore = Math.round((newSolar + newNexus + newResonance) / 3);

    const updatedUser: UserProfile = {
      ...currentUser,
      ocean,
      executionScore: newSolar,
      capabilityScore: newNexus,
      resonanceScore: newResonance,
      needsOffers: {
        ...currentUser.needsOffers,
        offers: offersInput.split(',').map(s => s.trim()).filter(Boolean),
        needs: needsInput.split(',').map(s => s.trim()).filter(Boolean)
      },
      spectrum: {
        ...currentUser.spectrum,
        solarResonance: newSolar,
        deepTealAnchor: newNexus,
        verdantSpark: newResonance,
        globalSynergyScore: globalScore
      }
    };

    onUpdateProfile(updatedUser);
    onClose();
  };

  const getToneLabel = (val: number) => {
    if (val > 80) return 'Luminous Radiance';
    if (val > 60) return 'Vibrant Tone';
    if (val > 40) return 'Harmonic Depth';
    return 'Soft Aura';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-xl font-bold text-stone-900">
                Chromatic Spectrum Calibration
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Tune your psychometric chromatic spectrum and calibrate your active Prism signature.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Chromatic Tone Sliders */}
          <div className="space-y-4 bg-stone-50 p-5 rounded-xl border border-stone-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Color Frequency Calibration
            </h3>

            {/* Solar Gold */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  Solar Gold: Conscientiousness & Velocity
                </span>
                <span className="text-[#D97706] font-bold">{getToneLabel(ocean.conscientiousness)}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={ocean.conscientiousness}
                onChange={(e) => setOcean({ ...ocean, conscientiousness: parseInt(e.target.value) })}
                className="w-full accent-[#D97706]"
              />
            </div>

            {/* Oceanic Teal */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0A6275]" />
                  Deep Teal: Cognitive Architecture & Openness
                </span>
                <span className="text-[#0A6275] font-bold">{getToneLabel(ocean.openness)}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={ocean.openness}
                onChange={(e) => setOcean({ ...ocean, openness: parseInt(e.target.value) })}
                className="w-full accent-[#0A6275]"
              />
            </div>

            {/* Verdant Green */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                  Verdant Green: Agreeableness & Ethical Safety
                </span>
                <span className="text-[#059669] font-bold">{getToneLabel(ocean.agreeableness)}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={ocean.agreeableness}
                onChange={(e) => setOcean({ ...ocean, agreeableness: parseInt(e.target.value) })}
                className="w-full accent-[#059669]"
              />
            </div>

            {/* Royal Purple */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                  Royal Purple: Extraversion & Intuition
                </span>
                <span className="text-[#7C3AED] font-bold">{getToneLabel(ocean.extraversion)}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={ocean.extraversion}
                onChange={(e) => setOcean({ ...ocean, extraversion: parseInt(e.target.value) })}
                className="w-full accent-[#7C3AED]"
              />
            </div>
          </div>

          {/* Needs & Offers Vectors */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Capabilities Offered (Comma-separated)
              </label>
              <input
                type="text"
                value={offersInput}
                onChange={(e) => setOffersInput(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Capabilities Needed (Comma-separated)
              </label>
              <input
                type="text"
                value={needsInput}
                onChange={(e) => setNeedsInput(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706] focus:outline-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Chromatic Signature</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
