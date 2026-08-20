export interface AdCard {
  id: string;
  sponsor: string;
  /** 'internal' = our own premium promos. 'external' = future ad-network slots. */
  kind: 'internal' | 'external';
  headline: string;
  body: string;
  price: string;
  cta: string;
  /** Where a right-swipe lands. Internal ads use an app route. */
  href: string;
  perks: string[];
  accent: string;
}

/** Demo inventory — our own premium packages until an external network is wired in. */
export const AD_INVENTORY: AdCard[] = [
  {
    id: 'ad-prism-plus',
    sponsor: 'Matchwise Prism',
    kind: 'internal',
    headline: 'Prism Plus',
    body: 'Unlimited discovery, full synergy breakdowns, and priority placement in other people’s decks.',
    price: '$9 / month',
    cta: 'See what Plus unlocks',
    href: '/premium',
    perks: ['Unlimited swipes', 'Full evidence panel', 'Undo any decision'],
    accent: '#B5751E',
  },
  {
    id: 'ad-prism-teams',
    sponsor: 'Matchwise Prism',
    kind: 'internal',
    headline: 'Prism Teams',
    body: 'Build a balanced hackathon or project squad with role-gap detection across your whole pool.',
    price: '$29 / month',
    cta: 'Explore Teams',
    href: '/premium',
    perks: ['Role-gap analysis', 'Shared team decks', 'Bulk invites'],
    accent: '#1F6F6B',
  },
  {
    id: 'ad-prism-verify',
    sponsor: 'Matchwise Prism',
    kind: 'internal',
    headline: 'Verified Signal',
    body: 'Verified badges raise your confidence factor, so you rank higher in deterministic scoring.',
    price: '$4 / month',
    cta: 'Get verified',
    href: '/premium',
    perks: ['Identity badge', 'Higher confidence factor', 'Trust filters'],
    accent: '#5B4B8A',
  },
];

/** Show an ad after this many candidate swipes. */
export const AD_FREQUENCY = 3;
