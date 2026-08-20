import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Matchwise Prism — Context-Aware Human Matching' },
      {
        name: 'description',
        content:
          'Deterministic 3-tier algorithm scoring, Prism Spectrum visualization, and explainable AI synergy metrics for human matching.',
      },
      { property: 'og:title', content: 'Matchwise Prism — Context-Aware Human Matching' },
      {
        property: 'og:description',
        content: 'Deterministic scoring, Prism Spectrum visualization, and explainable synergy metrics.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      navigate({ to: data.session ? '/app' : '/auth', replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return <div className="min-h-screen bg-[#FAFBFD]" />;
}
