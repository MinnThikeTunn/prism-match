import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Flame, Check, Info } from 'lucide-react';

interface MobileArchetype {
  id: string;
  name: string;
  title: string;
  primaryColor: string;
  tagline: string;
  behaviorSummary: string;
  strengths: string[];
  blindspots: string[];
}

interface MobilePair {
  id: string;
  sourceId: string;
  targetId: string;
  archetypeA: string;
  archetypeB: string;
  colorA: string;
  colorB: string;
  synergyScore: number;
  synergyTitle: string;
  description: string;
  frictionRisk: string;
  cadenceBalance?: string;
}

interface Props {
  archetypes: MobileArchetype[];
  pairs: MobilePair[];
}

const scoreTone = (score: number) => {
  if (score >= 90) return { label: 'Ultra resonance', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', bar: '#059669' };
  if (score >= 80) return { label: 'High resonance', cls: 'bg-purple-100 text-purple-800 border-purple-200', bar: '#7C3AED' };
  if (score >= 70) return { label: 'Workable', cls: 'bg-amber-100 text-amber-800 border-amber-200', bar: '#D97706' };
  return { label: 'High friction', cls: 'bg-rose-100 text-rose-800 border-rose-200', bar: '#E11D48' };
};

/**
 * Big, static, touch-first version of the synergy web for mobile.
 * No physics, no canvas, no animation — just large tappable rows.
 */
export const MobileSynergyBoard: React.FC<Props> = ({ archetypes, pairs }) => {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);
  const [openPairId, setOpenPairId] = useState<string | null>(null);

  const openNode = archetypes.find(a => a.id === openNodeId) || null;
  const openPair = pairs.find(p => p.id === openPairId) || null;

  // Detail: a selected pair
  if (openPair) {
    const tone = scoreTone(openPair.synergyScore);
    return (
      <div className="bg-white border border-stone-200/90 rounded-[28px] p-5 space-y-5">
        <button
          onClick={() => setOpenPairId(null)}
          className="flex items-center gap-1.5 text-sm font-bold text-stone-600 py-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full ring-2 ring-white shadow" style={{ backgroundColor: openPair.colorA }} />
          <span className="w-10 h-10 rounded-full ring-2 ring-white shadow -ml-5" style={{ backgroundColor: openPair.colorB }} />
          <div className="ml-1">
            <p className="text-base font-black text-stone-900 leading-tight">{openPair.synergyTitle}</p>
            <p className="text-xs text-stone-500">{openPair.archetypeA} & {openPair.archetypeB}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-stone-900 text-white p-5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Match strength</span>
          <p className="text-5xl font-black tracking-tight mt-1">{openPair.synergyScore}%</p>
          <div className="h-2 rounded-full bg-white/15 mt-3 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${openPair.synergyScore}%`, backgroundColor: tone.bar }} />
          </div>
          <p className="text-[11px] text-stone-300 mt-2">{tone.label}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Why this score
          </h4>
          <p className="text-sm text-stone-700 leading-relaxed p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            {openPair.description}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" /> Friction to watch
          </h4>
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
            <p className="text-sm text-amber-950 leading-relaxed">{openPair.frictionRisk}</p>
            {openPair.cadenceBalance && (
              <p className="text-xs text-stone-600 pt-2 border-t border-amber-200/60">
                <strong className="text-stone-800">Cadence balance: </strong>{openPair.cadenceBalance}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Detail: a selected archetype + all of its pair percentages
  if (openNode) {
    const nodePairs = pairs
      .filter(p => p.sourceId === openNode.id || p.targetId === openNode.id)
      .sort((a, b) => b.synergyScore - a.synergyScore);

    return (
      <div className="bg-white border border-stone-200/90 rounded-[28px] p-5 space-y-5">
        <button
          onClick={() => setOpenNodeId(null)}
          className="flex items-center gap-1.5 text-sm font-bold text-stone-600 py-2"
        >
          <ChevronLeft className="w-4 h-4" /> All colors
        </button>

        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: `linear-gradient(135deg, ${openNode.primaryColor}, ${openNode.primaryColor}CC)` }}
        >
          <span className="text-[10px] font-black uppercase tracking-widest bg-black/25 px-2.5 py-1 rounded-full">
            Color archetype
          </span>
          <h3 className="text-2xl font-black mt-2 tracking-tight">{openNode.name}</h3>
          <p className="text-xs text-white/90">{openNode.title}</p>
          <p className="text-xs text-white/85 italic mt-3 pt-3 border-t border-white/20">"{openNode.tagline}"</p>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed">{openNode.behaviorSummary}</p>

        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <h5 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5">
              <Check className="w-3.5 h-3.5" /> Strengths
            </h5>
            <ul className="space-y-1 text-emerald-950">
              {openNode.strengths.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h5 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
              <Info className="w-3.5 h-3.5" /> Blindspots
            </h5>
            <ul className="space-y-1 text-amber-950">
              {openNode.blindspots.map((b, i) => <li key={i}>• {b}</li>)}
            </ul>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-900">
            Match % with other colors
          </h4>
          {nodePairs.map(p => {
            const otherName = p.sourceId === openNode.id ? p.archetypeB : p.archetypeA;
            const otherColor = p.sourceId === openNode.id ? p.colorB : p.colorA;
            const tone = scoreTone(p.synergyScore);
            return (
              <button
                key={p.id}
                onClick={() => setOpenPairId(p.id)}
                className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white active:bg-stone-50"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: otherColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-900 truncate">{otherName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{p.synergyTitle}</p>
                  </div>
                  <span className="text-xl font-black text-stone-900">{p.synergyScore}%</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
                <div className="h-2 rounded-full bg-stone-100 mt-3 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.synergyScore}%`, backgroundColor: tone.bar }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // List: all colors + all pairs
  return (
    <div className="space-y-4">
      <div className="bg-white border border-stone-200/90 rounded-[28px] p-5 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-stone-900">
          Tap a color to see what it means
        </h4>
        {archetypes.map(a => (
          <button
            key={a.id}
            onClick={() => setOpenNodeId(a.id)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-stone-200 bg-white active:bg-stone-50 text-left"
          >
            <span className="w-12 h-12 rounded-2xl shrink-0" style={{ backgroundColor: a.primaryColor }} />
            <div className="flex-1 min-w-0">
              <p className="text-base font-black text-stone-900 truncate">{a.name}</p>
              <p className="text-xs text-stone-500 truncate">{a.title}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400" />
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200/90 rounded-[28px] p-5 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-stone-900">
          Match % between colors
        </h4>
        {pairs.length === 0 && (
          <p className="text-xs text-stone-500">No pairs match the current filters.</p>
        )}
        {[...pairs].sort((a, b) => b.synergyScore - a.synergyScore).map(p => {
          const tone = scoreTone(p.synergyScore);
          return (
            <button
              key={p.id}
              onClick={() => setOpenPairId(p.id)}
              className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-white active:bg-stone-50"
            >
              <div className="flex items-center gap-3">
                <span className="flex -space-x-2 shrink-0">
                  <span className="w-8 h-8 rounded-full ring-2 ring-white" style={{ backgroundColor: p.colorA }} />
                  <span className="w-8 h-8 rounded-full ring-2 ring-white" style={{ backgroundColor: p.colorB }} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-900 truncate">
                    {p.archetypeA.replace('The ', '')} × {p.archetypeB.replace('The ', '')}
                  </p>
                  <p className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tone.cls}`}>
                    {tone.label}
                  </p>
                </div>
                <span className="text-xl font-black text-stone-900">{p.synergyScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-stone-100 mt-3 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.synergyScore}%`, backgroundColor: tone.bar }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
