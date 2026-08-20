import { createFileRoute } from '@tanstack/react-router';
import App from '../../App';

export const Route = createFileRoute('/_authenticated/app')({
  head: () => ({
    meta: [
      { title: 'Your Prism — Matchwise Prism' },
      {
        name: 'description',
        content:
          'Your Prism dashboard: profile spectrum, discovery deck, and explainable synergy metrics for every match.',
      },
      { property: 'og:title', content: 'Your Prism — Matchwise Prism' },
      {
        property: 'og:description',
        content: 'Profile spectrum, discovery deck, and explainable synergy metrics.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: App,
});
