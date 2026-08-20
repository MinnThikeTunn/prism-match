import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultNotFoundComponent: () => (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="text-sm text-muted-foreground">This route doesn’t exist in Matchwise Prism.</p>
        <a href="/app" className="text-sm font-medium text-primary underline">Back to dashboard</a>
      </div>
    ),
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
