import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Check, Megaphone } from 'lucide-react';
import { AD_INVENTORY } from '../data/ads';

export const Route = createFileRoute('/premium')({
  head: () => ({
    meta: [
      { title: 'Premium Packages — Matchwise Prism' },
      {
        name: 'description',
        content:
          'Prism Plus, Prism Teams and Verified Signal — upgrade options that unlock unlimited discovery, role-gap analysis and higher confidence scoring.',
      },
      { property: 'og:title', content: 'Premium Packages — Matchwise Prism' },
      {
        property: 'og:description',
        content: 'Unlock unlimited discovery, team role-gap analysis and verified trust signals.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: PremiumPage,
});

function PremiumPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900">
          <ArrowLeft className="w-4 h-4" />
          Back to discovery
        </Link>

        <div className="mt-6 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-stone-500">
          <Megaphone className="w-3 h-3" />
          Sponsored placement · our own inventory
        </div>

        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900">
          Premium packages
        </h1>
        <p className="mt-3 text-stone-600 max-w-2xl">
          Upgrades change what you can see and how confidently you are scored — never who the
          deterministic engine says is a good match.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {AD_INVENTORY.map((ad) => (
            <div
              key={ad.id}
              id={ad.id}
              className="rounded-2xl border border-stone-200 bg-white p-6 flex flex-col"
              style={{ borderTopColor: ad.accent, borderTopWidth: 3 }}
            >
              <h2 className="text-xl font-semibold text-stone-900">{ad.headline}</h2>
              <p className="mt-1 text-sm font-medium" style={{ color: ad.accent }}>
                {ad.price}
              </p>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed flex-1">{ad.body}</p>
              <ul className="mt-4 space-y-2">
                {ad.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-sm text-stone-700">
                    <Check className="w-3.5 h-3.5" style={{ color: ad.accent }} />
                    {perk}
                  </li>
                ))}
              </ul>
              <button
                className="mt-6 rounded-xl py-2.5 text-sm font-medium text-white"
                style={{ background: ad.accent }}
              >
                {ad.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
