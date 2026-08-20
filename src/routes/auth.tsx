import { createFileRoute, ClientOnly } from '@tanstack/react-router';
import { AuthScreen } from '../components/AuthScreen';

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [
      { title: 'Sign in — Matchwise Prism' },
      {
        name: 'description',
        content:
          'Sign in or create a Matchwise Prism account to sync your profile, onboarding answers, and match signals across devices.',
      },
      { property: 'og:title', content: 'Sign in — Matchwise Prism' },
      {
        property: 'og:description',
        content: 'Create your Matchwise Prism account to sync your matching profile securely.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-[#FAFBFD]" />}>
      <AuthScreen />
    </ClientOnly>
  );
}
