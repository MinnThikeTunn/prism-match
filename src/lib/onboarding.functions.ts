import { createServerFn } from '@tanstack/react-start';
import {
  clean,
  hashToken,
  validateJson,
  validateToken,
  type PublicProfileRow,
  type SaveInput,
} from './onboardingUtils';

export type { PublicProfileRow } from './onboardingUtils';

export const saveOnboardingProfile = createServerFn({ method: 'POST' })
  .inputValidator((input: SaveInput) => {
    validateToken(input?.token);
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('../integrations/supabase/client.server');
    const tokenHash = await hashToken(data.token);

    const publicData = validateJson(data.publicData, 'Profile');
    const features = validateJson(data.features, 'Answers');

    const row = {
      token_hash: tokenHash,
      name: clean(data.name, 120) ?? '',
      title: clean(data.title, 160),
      location: clean(data.location, 160),
      bio: clean(data.bio, 1000),
      avatar: clean(data.avatar, 500),
      public_data: publicData,
      is_public: data.isPublic !== false,
    };

    const { data: profile, error } = await supabaseAdmin
      .from('anon_profiles')
      .upsert(row, { onConflict: 'token_hash' })
      .select('id')
      .single();

    if (error || !profile) throw new Error(error?.message ?? 'Failed to save profile');

    const { error: featuresError } = await supabaseAdmin
      .from('anon_profile_features')
      .upsert(
        {
          profile_id: profile.id,
          features,
          completed: data.completed === true,
        },
        { onConflict: 'profile_id' },
      );

    if (featuresError) throw new Error(featuresError.message);

    return { id: profile.id as string };
  });

export const getOnboardingProfile = createServerFn({ method: 'POST' })
  .inputValidator((input: { token: string }) => {
    validateToken(input?.token);
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('../integrations/supabase/client.server');
    const tokenHash = await hashToken(data.token);

    const { data: profile } = await supabaseAdmin
      .from('anon_profiles')
      .select('id, name, title, location, bio, avatar, public_data, is_public')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (!profile) return { profile: null, features: null, completed: false };

    const { data: features } = await supabaseAdmin
      .from('anon_profile_features')
      .select('features, completed')
      .eq('profile_id', profile.id)
      .maybeSingle();

    return {
      profile,
      features: features?.features ?? null,
      completed: features?.completed ?? false,
    };
  });

export const listPublicProfiles = createServerFn({ method: 'GET' }).handler(async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const key =
    process.env['SUPABASE_PUBLISHABLE_KEY'] ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const url = process.env['SUPABASE_URL'] ?? import.meta.env.VITE_SUPABASE_URL;

  if (!key || !url) {
    return { profiles: [] as PublicProfileRow[], error: 'Cloud directory is unavailable.' };
  }

  const supabasePublic = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) {
          headers.delete('Authorization');
        }
        headers.set('apikey', key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const { data, error } = await supabasePublic
    .from('anon_profiles')
    .select('id, name, title, location, bio, avatar, public_data, updated_at')
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) return { profiles: [] as PublicProfileRow[], error: error.message as string | null };
  return { profiles: (data ?? []) as unknown as PublicProfileRow[], error: null as string | null };
});
