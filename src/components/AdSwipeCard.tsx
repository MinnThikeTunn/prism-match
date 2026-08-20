import React from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Megaphone, Check, ArrowRight, X } from 'lucide-react';
import type { AdCard } from '../data/ads';

interface AdSwipeCardProps {
  ad: AdCard;
  /** Swipe right / tap CTA — open the ad destination. */
  onOpen: () => void;
  /** Swipe left — skip the ad. */
  onSkip: () => void;
}

export function AdSwipeCard({ ad, onOpen, onSkip }: AdSwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-12, 12]);
  const skipOpacity = useTransform(x, [-140, -20], [1, 0]);
  const openOpacity = useTransform(x, [20, 140], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: 0, opacity: 0, scale: 0.95 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 130) onOpen();
        else if (info.offset.x < -130) onSkip();
      }}
    >
      <div
        className="h-full rounded-3xl border border-stone-200 bg-white shadow-md overflow-hidden flex flex-col"
        style={{ borderColor: `${ad.accent}33` }}
      >
        <div className="px-6 pt-5 pb-4" style={{ background: `${ad.accent}12` }}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-stone-600">
              <Megaphone className="w-3 h-3" />
              Sponsored
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-stone-500">
              {ad.sponsor}
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight" style={{ color: ad.accent }}>
            {ad.headline}
          </h2>
          <p className="mt-1 text-sm font-medium text-stone-700">{ad.price}</p>
        </div>

        <div className="flex-1 px-6 py-5">
          <p className="text-stone-700 text-sm leading-relaxed">{ad.body}</p>
          <ul className="mt-5 space-y-2.5">
            {ad.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-sm text-stone-700">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${ad.accent}1F`, color: ad.accent }}
                >
                  <Check className="w-3 h-3" />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-xs text-stone-500">
            Swipe <span className="font-medium text-stone-800">right</span> to open ·{' '}
            <span className="font-medium text-stone-800">left</span> to skip. Ads never affect your
            match ranking.
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 rounded-xl border border-stone-200 py-3 text-sm text-stone-600 hover:border-stone-400"
          >
            Skip
          </button>
          <button
            onClick={onOpen}
            className="flex-[1.4] rounded-xl py-3 text-sm font-medium text-white flex items-center justify-center gap-2"
            style={{ background: ad.accent }}
          >
            {ad.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drag indicators */}
      <motion.div
        className="absolute top-6 left-6 px-3 py-1.5 rounded-full border-2 border-stone-400 text-stone-500 text-xs font-mono uppercase tracking-widest bg-white/90 flex items-center gap-1"
        style={{ opacity: skipOpacity }}
      >
        <X className="w-3 h-3" /> Skip ad
      </motion.div>
      <motion.div
        className="absolute top-6 right-6 px-3 py-1.5 rounded-full border-2 text-xs font-mono uppercase tracking-widest bg-white/90"
        style={{ opacity: openOpacity, borderColor: ad.accent, color: ad.accent }}
      >
        Open offer
      </motion.div>
    </motion.div>
  );
}
