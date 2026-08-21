import React, { useState } from 'react';
import { UserProfile, MatchResult } from '../types';
import { evaluatePairwiseMatch } from '../lib/algorithm';
import { 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Scale, 
  Circle, 
  Triangle, 
  Send, 
  Check, 
  RefreshCw,
  ArrowLeft,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getColorIdentity, getPairwiseColorHarmonics } from '../lib/colorSystem';

interface SynergyMatchViewProps {
  requester: UserProfile;
  candidate: UserProfile;
  onBack: () => void;
}

export const SynergyMatchView: React.FC<SynergyMatchViewProps> = ({
  requester,
  candidate,
  onBack
}) => {
  const [matchResult, setMatchResult] = useState<MatchResult>(() =>
    evaluatePairwiseMatch(requester, candidate)
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);

  const reqColor = getColorIdentity(requester.id);
  const candColor = getColorIdentity(candidate.id);
  const harmonic = getPairwiseColorHarmonics(requester.id, candidate.id);

  const [collaborationMessage, setCollaborationMessage] = useState(
    `Hi ${candidate.name},\n\nI reviewed our Matchwise Prism chromatic synergy (${harmonic.title}). I'd love to connect and harmonize across ${requester.needsOffers.offers[0]} and ${candidate.needsOffers.offers[0]}.\n\nBest,\n${requester.name}`
  );
  const [isSent, setIsSent] = useState(false);

  const handleRegenerateXai = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/explain-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userA: requester,
          userB: candidate,
          matchResult
        })
      });
      const data = await res.json();
      if (data?.explanation?.keyDrivers) {
        setMatchResult(prev => ({
          ...prev,
          synergyDescription: data.explanation.synergyDescription || prev.synergyDescription,
          keyDrivers: data.explanation.keyDrivers,
          isAiGeneratedExplanation: true
        }));
      }
    } catch (err) {
      console.warn('Failed to regenerate XAI explanation:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleInitiateCollaboration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setShowCollaborationModal(true);
  };

  const handleSendMessage = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowCollaborationModal(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Return Navigation */}
      <button
        onClick={onBack}
        className="mb-4 sm:mb-6 flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        id="back-to-dashboard-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header Section with Pure Color Harmony */}
      <div className="mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-500/30 text-xs font-bold mb-3 shadow-2xs">
          <Palette className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{harmonic.title}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Chromatic Synergy Resonance
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed max-w-2xl mx-auto">
          A seamless synthesis of {reqColor.primaryName} velocity and {candColor.primaryName} architecture. This pairing produces a luminous multi-spectral resonance across strategic and creative horizons.
        </p>
      </div>

      {/* Main Top Pair Dossier Card */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
          {/* Left User: Alex Mercer */}
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full p-1 mb-3 ring-4 shadow-sm"
              style={{ ['--tw-ring-color' as any]: reqColor.primaryColor }}
            >
              <img
                src={requester.avatar}
                alt={requester.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {requester.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {requester.title}
            </p>
            <span
              className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5"
              style={{
                backgroundColor: `${reqColor.primaryColor}15`,
                color: reqColor.primaryColor,
                borderColor: `${reqColor.primaryColor}30`
              }}
            >
              <span className="w-3.5 h-3.5 rounded-full text-white text-[9px] font-black flex items-center justify-center" style={{ backgroundColor: reqColor.primaryColor }}>
                {reqColor.profileCode}
              </span>
              <span>{reqColor.primaryName}</span>
            </span>
          </div>

          {/* Center: Pairwise Chromatic Synergy */}
          <div className="flex flex-col items-center justify-center py-4 border-y md:border-y-0 md:border-x border-stone-100">
            <div
              className="w-24 h-24 rounded-full shadow-lg p-1 flex items-center justify-center relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${reqColor.primaryColor}, ${candColor.primaryColor})` }}
            >
              <div className="w-full h-full rounded-full bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reqColor.primaryColor }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: candColor.primaryColor }} />
                </div>
                <span className="text-lg font-black tracking-tight text-stone-900 leading-none">
                  {matchResult.finalMatchScore}%
                </span>
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                  {matchResult.finalMatchScore >= 80 ? 'High Synergy' : matchResult.finalMatchScore >= 65 ? 'Complementary' : 'Cognitive Friction'}
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-stone-600 text-center">
              {harmonic.subLabel}
            </div>
          </div>

          {/* Right User: Candidate */}
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full p-1 mb-3 ring-4 shadow-sm"
              style={{ ['--tw-ring-color' as any]: candColor.primaryColor }}
            >
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {candidate.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {candidate.title}
            </p>
            <span
              className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5"
              style={{
                backgroundColor: `${candColor.primaryColor}15`,
                color: candColor.primaryColor,
                borderColor: `${candColor.primaryColor}30`
              }}
            >
              <span className="w-3.5 h-3.5 rounded-full text-white text-[9px] font-black flex items-center justify-center" style={{ backgroundColor: candColor.primaryColor }}>
                {candColor.profileCode}
              </span>
              <span>{candColor.primaryName}</span>
            </span>
          </div>
        </div>

        {/* Cognitive Friction & Mitigation Banner if Tension Exists */}
        {(matchResult.finalMatchScore < 65 || harmonic.frictionRisk === 'High' || harmonic.frictionRisk === 'Critical') && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                Active Cognitive Friction ({harmonic.frictionRisk} Risk)
              </span>
              <p className="text-stone-700">
                {harmonic.frictionSummary}
              </p>
            </div>
            <div className="px-3 py-1.5 bg-white/80 border border-amber-500/20 rounded-xl text-amber-900 font-medium text-[11px] shrink-0">
              <strong>Mitigation:</strong> {harmonic.mitigationCadence}
            </div>
          </div>
        )}
      </div>

      {/* Bottom 2 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: XAI Key Drivers (Pure Color Drivers) */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <h2 className="text-base font-bold text-stone-800">
                  XAI Chromatic Drivers
                </h2>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Explainable behavioral and structural compatibility vectors
                </p>
              </div>
              <button
                onClick={handleRegenerateXai}
                disabled={isGeneratingAi}
                className="text-xs font-semibold text-[#D97706] hover:text-amber-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 transition-colors disabled:opacity-50"
                title="Regenerate with AI"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAi ? 'Analyzing...' : 'AI Re-analyze'}</span>
              </button>
            </div>

            {/* Dynamic Drivers List */}
            <div className="space-y-5">
              {matchResult.keyDrivers && matchResult.keyDrivers.length > 0 ? (
                matchResult.keyDrivers.map((driver, idx) => {
                  const getDriverConfig = (type: string) => {
                    switch (type) {
                      case 'technical':
                        return {
                          icon: CheckCircle2,
                          bgClass: 'bg-emerald-50 text-emerald-600',
                          dotColor: '#059669',
                          badgeLabel: 'Technical Overlap',
                        };
                      case 'communication':
                        return {
                          icon: MessageSquare,
                          bgClass: 'bg-teal-50 text-[#0A6275]',
                          dotColor: '#0A6275',
                          badgeLabel: 'Communication Sync',
                        };
                      case 'risk':
                        return {
                          icon: Scale,
                          bgClass: 'bg-amber-50 text-[#D97706]',
                          dotColor: '#D97706',
                          badgeLabel: 'Risk & Cadence',
                        };
                      case 'values':
                      default:
                        return {
                          icon: Sparkles,
                          bgClass: 'bg-purple-50 text-[#7C3AED]',
                          dotColor: '#7C3AED',
                          badgeLabel: 'Archetypal Resonance',
                        };
                    }
                  };

                  const cfg = getDriverConfig(driver.type);
                  const Icon = cfg.icon;

                  return (
                    <div key={idx} className="flex items-start gap-3.5 p-3 rounded-xl bg-stone-50/60 border border-stone-100 transition-all hover:bg-stone-50">
                      <div className={`w-8 h-8 rounded-full ${cfg.bgClass} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-stone-900">
                              {driver.title}
                            </h4>
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: cfg.dotColor }}
                            />
                          </div>
                          {driver.scoreImpact !== undefined && (
                            <span className="text-[10px] font-mono font-bold text-stone-400 bg-white px-2 py-0.5 rounded-md border border-stone-200 shrink-0">
                              +{driver.scoreImpact} pts
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {driver.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-stone-400 py-4 text-center">
                  Calculating pure chromatic drivers...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Card: Archetypal Resonance (Pure Color Bands, dynamically bound) */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="pb-4 border-b border-stone-100 mb-6">
              <h2 className="text-base font-bold text-stone-800">
                How similar are you two?
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Each bar shows how closely you and {candidate.name} match on that trait — 100% means nearly identical.
              </p>
            </div>

            <div className="space-y-4">
              {(() => {
                const sim = (a: number, b: number) =>
                  Math.max(0, Math.round(100 - Math.abs((a ?? 0) - (b ?? 0))));

                const channels = [
                  {
                    code: 'S',
                    name: 'Focus & Execution',
                    color: '#D97706',
                    gradient: 'from-amber-200 via-amber-400 to-[#D97706]',
                    textColor: 'text-amber-900',
                    a: requester.executionScore ?? 0,
                    b: candidate.executionScore ?? 0,
                  },
                  {
                    code: 'O',
                    name: 'Clarity & Systems Logic',
                    color: '#0A6275',
                    gradient: 'from-cyan-200 via-teal-400 to-[#0A6275]',
                    textColor: 'text-teal-900',
                    a: requester.capabilityScore ?? 0,
                    b: candidate.capabilityScore ?? 0,
                  },
                  {
                    code: 'V',
                    name: 'Empathy & Ethical Anchor',
                    color: '#059669',
                    gradient: 'from-emerald-200 via-emerald-400 to-[#059669]',
                    textColor: 'text-emerald-900',
                    a: requester.resonanceScore ?? 0,
                    b: candidate.resonanceScore ?? 0,
                  },
                  {
                    code: 'R',
                    name: 'Curiosity & Vision',
                    color: '#7C3AED',
                    gradient: 'from-purple-200 via-purple-400 to-[#7C3AED]',
                    textColor: 'text-purple-900',
                    a: requester.ocean?.openness ?? 0,
                    b: candidate.ocean?.openness ?? 0,
                  },
                  {
                    code: 'C',
                    name: 'Reliability & Follow-through',
                    color: '#1D4ED8',
                    gradient: 'from-blue-200 via-blue-400 to-[#1D4ED8]',
                    textColor: 'text-blue-900',
                    a: requester.ocean?.conscientiousness ?? 0,
                    b: candidate.ocean?.conscientiousness ?? 0,
                  },
                ].map((ch) => ({ ...ch, score: sim(ch.a, ch.b) }));

                const overall = Math.round(
                  channels.reduce((acc, c) => acc + c.score, 0) / channels.length,
                );

                const label = (score: number) => {
                  if (score >= 90) return 'Almost identical';
                  if (score >= 75) return 'Very similar';
                  if (score >= 60) return 'Fairly similar';
                  if (score >= 40) return 'Somewhat different';
                  return 'Very different';
                };

                return (
                  <>
                    <div className="flex items-baseline justify-between rounded-xl bg-stone-50 border border-stone-100 px-4 py-3">
                      <span className="text-xs font-semibold text-stone-600">
                        Overall similarity
                      </span>
                      <span className="text-lg font-bold text-stone-900">
                        {overall}%
                      </span>
                    </div>

                    {channels.map((ch) => (
                      <div key={ch.code}>
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shadow-2xs"
                              style={{ backgroundColor: ch.color }}
                            />
                            <span>{ch.name}</span>
                          </div>
                          <span className={`text-[11px] font-bold ${ch.textColor}`}>
                            {ch.score}% · {label(ch.score)}
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden shadow-inner">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${ch.gradient} transition-all duration-500 shadow-xs`}
                            style={{ width: `${ch.score}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1">
                          You {Math.round(ch.a)} · {candidate.name} {Math.round(ch.b)}
                        </p>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>


          {/* Action Button */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <button
              onClick={handleInitiateCollaboration}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              id="initiate-collaboration-btn"
            >
              <Palette className="w-4 h-4 text-amber-300" />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collaboration Dispatch Modal */}
      {showCollaborationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: candColor.primaryColor }} />
                <span>Connect with {candidate.name} ({candColor.primaryName})</span>
              </h3>
              <button
                onClick={() => setShowCollaborationModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Chromatic Synergy Proposal
              </label>
              <textarea
                rows={5}
                value={collaborationMessage}
                onChange={(e) => setCollaborationMessage(e.target.value)}
                className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-[#D97706] transition-all leading-relaxed"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCollaborationModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSent}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                id="confirm-send-collaboration-btn"
              >
                {isSent ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isSent ? 'Sent' : 'Send Invitation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
