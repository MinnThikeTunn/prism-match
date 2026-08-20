import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Json } from '@/integrations/supabase/types';

type ProfileInput = {
  name?: string;
  title?: string | null;
  location?: string | null;
  bio?: string | null;
  avatar?: string | null;
  profileData?: Record<string, unknown>;
};

export const getMyProfile = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, email, avatar, title, bio, location, profile_data, onboarding_completed')
      .eq('id', userId)
      .maybeSingle();

    const { data: featureRow } = await supabase
      .from('match_features')
      .select('features, completed')
      .eq('user_id', userId)
      .maybeSingle();

    return {
      userId,
      email: (claims as { email?: string }).email ?? profile?.email ?? null,
      profile: profile ?? null,
      features: (featureRow?.features as Json | undefined) ?? null,
      onboardingCompleted: Boolean(profile?.onboarding_completed),
    };
  });

export const saveMyProfile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: ProfileInput) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error } = await supabase
      .from('profiles')
      .update({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
        ...(data.profileData !== undefined
          ? { profile_data: data.profileData as unknown as Json }
          : {}),
      })
      .eq('id', userId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const completeOnboarding = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: ProfileInput & { features: Record<string, unknown> }) => input,
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error: featureError } = await supabase.from('match_features').upsert(
      {
        user_id: userId,
        features: data.features as unknown as Json,
        completed: true,
      },
      { onConflict: 'user_id' },
    );
    if (featureError) throw new Error(featureError.message);

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
        ...(data.profileData !== undefined
          ? { profile_data: data.profileData as unknown as Json }
          : {}),
        onboarding_completed: true,
      })
      .eq('id', userId);
    if (profileError) throw new Error(profileError.message);

    return { ok: true };
  });
