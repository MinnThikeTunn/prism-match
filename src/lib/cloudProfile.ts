import { UserProfile } from '../types';
import { listPublicProfiles } from './onboarding.functions';

/** Public directory of anonymous sample profiles — readable by anyone. */
export async function fetchPublicProfiles(): Promise<UserProfile[]> {
  try {
    const res = await listPublicProfiles();
    return (res?.profiles ?? [])
      .map(row => {
        const data = row.public_data as unknown;
        if (!data || typeof data !== 'object' || !('id' in (data as object))) return null;
        const profile = data as UserProfile;
        return { ...profile, id: `cloud-${row.id}` } as UserProfile;
      })
      .filter((p): p is UserProfile => p !== null);
  } catch (err) {
    console.warn('Public profile fetch failed:', err);
    return [];
  }
}
