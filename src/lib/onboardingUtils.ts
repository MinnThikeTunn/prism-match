import type { Json } from '../integrations/supabase/types';

export type PublicProfileRow = {
  id: string;
  name: string;
  title: string | null;
  location: string | null;
  bio: string | null;
  avatar: string | null;
  public_data: Json;
  updated_at: string;
};

export const MAX_PAYLOAD_BYTES = 96 * 1024;

export type SaveInput = {
  token: string;
  name?: string;
  title?: string | null;
  location?: string | null;
  bio?: string | null;
  avatar?: string | null;
  publicData?: unknown;
  features?: unknown;
  completed?: boolean;
  isPublic?: boolean;
};

export function clean(value: unknown, max = 500): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export function validateToken(token: unknown): string {
  if (typeof token !== 'string' || !/^[a-f0-9]{32,128}$/i.test(token)) {
    throw new Error('Invalid device token');
  }
  return token;
}

export function validateJson(value: unknown, label: string): Json {
  const obj = (value && typeof value === 'object' && !Array.isArray(value)
    ? JSON.parse(JSON.stringify(value))
    : {}) as Json;
  const size = JSON.stringify(obj).length;
  if (size > MAX_PAYLOAD_BYTES) throw new Error(`${label} payload too large`);
  return obj;
}

export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(`matchwise:${token}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
