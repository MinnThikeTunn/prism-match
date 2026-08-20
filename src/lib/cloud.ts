import { supabase } from '../integrations/supabase/client';
import type { UserProfile } from '../types';
import type { SwipeRecord } from './discovery';

/** ---------- Profile ---------- */

export async function fetchCloudProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('profile_data, name, email, avatar')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  const profile = data.profile_data as unknown as UserProfile | null;
  if (!profile || !profile.id) return null;
  return profile;
}

export async function saveCloudProfile(userId: string, profile: UserProfile) {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      name: profile.name ?? '',
      email: profile.email ?? null,
      avatar: profile.avatar ?? null,
      title: profile.title ?? null,
      bio: profile.bio ?? null,
      location: profile.location ?? null,
      profile_data: profile as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
  if (error) console.error('[cloud] saveCloudProfile', error.message);
}

/** ---------- Onboarding match features ---------- */

export async function fetchCloudFeatures(
  userId: string,
): Promise<{ features: unknown; completed: boolean } | null> {
  const { data, error } = await supabase
    .from('match_features')
    .select('features, completed')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return { features: data.features, completed: data.completed };
}

export async function saveCloudFeatures(userId: string, features: unknown, completed: boolean) {
  const { error } = await supabase.from('match_features').upsert(
    {
      user_id: userId,
      features: features as Record<string, unknown>,
      completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (error) console.error('[cloud] saveCloudFeatures', error.message);
}

/** ---------- Swipes ---------- */

export async function fetchCloudSwipes(userId: string): Promise<SwipeRecord[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select('candidate_id, decision, context, score, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({
    candidateId: row.candidate_id,
    action: row.decision === 'connect' ? 'like' : 'pass',
    context: (row.context ?? 'COLLABORATE') as SwipeRecord['context'],
    at: row.created_at,
    matchVersion: 'cloud',
    tags: [],
  }));
}

export async function pushCloudSwipe(userId: string, record: SwipeRecord) {
  const { error } = await supabase.from('swipes').upsert(
    {
      user_id: userId,
      candidate_id: record.candidateId,
      decision: record.action === 'like' ? 'connect' : 'pass',
      context: record.context,
    },
    { onConflict: 'user_id,candidate_id,context' },
  );
  if (error) console.error('[cloud] pushCloudSwipe', error.message);

  if (record.action === 'like') {
    const { error: connErr } = await supabase.from('connections').upsert(
      {
        requester_id: userId,
        target_id: record.candidateId,
        context: record.context,
        status: 'requested',
      },
      { onConflict: 'requester_id,target_id' },
    );
    if (connErr) console.error('[cloud] connection', connErr.message);
  }
}

export async function clearCloudSwipes(userId: string) {
  await supabase.from('swipes').delete().eq('user_id', userId);
  await supabase.from('connections').delete().eq('requester_id', userId);
}
