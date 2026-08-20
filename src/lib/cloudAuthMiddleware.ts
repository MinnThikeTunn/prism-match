import { createClient } from '@supabase/supabase-js';
import { createMiddleware } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import type { Database } from '../integrations/supabase/types';

function createCloudFetch(apiKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (apiKey.startsWith('sb_') && headers.get('Authorization') === `Bearer ${apiKey}`) {
      headers.delete('Authorization');
    }
    headers.set('apikey', apiKey);

    return fetch(input, { ...init, headers });
  };
}

export const requireCloudAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const url = process.env['SUPABASE_URL'] ?? import.meta.env.VITE_SUPABASE_URL;
    const apiKey =
      process.env['SUPABASE_PUBLISHABLE_KEY'] ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !apiKey) {
      throw new Error('The Lovable Cloud connection is unavailable in this deployment.');
    }

    const request = getRequest();
    const authHeader = request?.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token || token.split('.').length !== 3) {
      throw new Response('Unauthorized', { status: 401 });
    }

    const supabase = createClient<Database>(url, apiKey, {
      global: {
        fetch: createCloudFetch(apiKey),
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.auth.getClaims(token);
    const userId = data?.claims?.sub;
    if (error || !userId) {
      throw new Response('Unauthorized', { status: 401 });
    }

    return next({
      context: {
        supabase,
        userId,
        claims: data.claims,
      },
    });
  },
);