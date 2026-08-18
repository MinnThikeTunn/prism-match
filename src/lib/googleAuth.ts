export interface GoogleUser {
  id: string;
  sub: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
  verifiedEmail: boolean;
  locale: string;
  hd?: string; // Hosted domain (e.g. google.com or company.org)
}

export interface GoogleCredential {
  idToken: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: number;
  expiresAt: number;
  user: GoogleUser;
  scope: string;
}

export const STORAGE_KEY_GOOGLE_AUTH = 'matchwise_google_credential';
export const STORAGE_KEY_GOOGLE_ACCOUNTS = 'matchwise_google_saved_accounts';

export const DEFAULT_DEMO_ACCOUNTS: GoogleUser[] = [
  {
    id: 'google-1092834710293847',
    sub: '109283471029384756201',
    email: 'tminnthike@gmail.com',
    name: 'T Min Nthike',
    givenName: 'T Min',
    familyName: 'Nthike',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    verifiedEmail: true,
    locale: 'en'
  },
  {
    id: 'google-9928172635412839',
    sub: '992817263541283948572',
    email: 'alex.mercer.prism@gmail.com',
    name: 'Alex Mercer',
    givenName: 'Alex',
    familyName: 'Mercer',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    verifiedEmail: true,
    locale: 'en'
  },
  {
    id: 'google-8817263549102834',
    sub: '881726354910283475612',
    email: 'elena.vance.ai@gmail.com',
    name: 'Dr. Elena Vance',
    givenName: 'Elena',
    familyName: 'Vance',
    picture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    verifiedEmail: true,
    locale: 'en'
  },
  {
    id: 'google-7728193840192847',
    sub: '772819384019284756381',
    email: 'julian.cross.tech@gmail.com',
    name: 'Julian Cross',
    givenName: 'Julian',
    familyName: 'Cross',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    verifiedEmail: true,
    locale: 'en'
  }
];

/**
 * Generate a realistic simulated OpenID Connect JWT Token for Google Sign-In
 */
function createMockJwt(user: GoogleUser, issuedAt: number, expiresAt: number): string {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: 'google-auth-mock-key-' + Math.random().toString(36).substring(2, 8)
  };

  const payload = {
    iss: 'https://accounts.google.com',
    azp: '779093589485-matchwise-prism.apps.googleusercontent.com',
    aud: '779093589485-matchwise-prism.apps.googleusercontent.com',
    sub: user.sub,
    email: user.email,
    email_verified: user.verifiedEmail,
    at_hash: 'dEMo_AtHaSh_' + Math.random().toString(36).substring(2, 10),
    name: user.name,
    picture: user.picture,
    given_name: user.givenName,
    family_name: user.familyName,
    locale: user.locale || 'en',
    iat: Math.floor(issuedAt / 1000),
    exp: Math.floor(expiresAt / 1000)
  };

  const b64Header = btoa(JSON.stringify(header)).replace(/=/g, '');
  const b64Payload = btoa(JSON.stringify(payload)).replace(/=/g, '');
  const mockSignature = 'mock_signature_sig_' + btoa(user.email + issuedAt).substring(0, 32).replace(/=/g, '');

  return `${b64Header}.${b64Payload}.${mockSignature}`;
}

export function generateDemoGoogleCredential(partialUser: Partial<GoogleUser>): GoogleCredential {
  const now = Date.now();
  const expiresInSeconds = 3600; // 1 hour
  const expiresAt = now + (expiresInSeconds * 1000);

  const givenName = partialUser.givenName || (partialUser.name ? partialUser.name.split(' ')[0] : 'Demo');
  const familyName = partialUser.familyName || (partialUser.name ? partialUser.name.split(' ').slice(1).join(' ') : 'User');
  const name = partialUser.name || `${givenName} ${familyName}`;
  const email = partialUser.email || 'demo.user@gmail.com';
  const sub = partialUser.sub || '10' + Math.floor(10000000000000000 + Math.random() * 90000000000000000).toString();
  const id = partialUser.id || `google-${sub.substring(0, 16)}`;
  const picture = partialUser.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D97706&color=fff&size=200`;

  const user: GoogleUser = {
    id,
    sub,
    email,
    name,
    givenName,
    familyName,
    picture,
    verifiedEmail: partialUser.verifiedEmail !== false,
    locale: partialUser.locale || 'en',
    hd: email.endsWith('@gmail.com') ? undefined : email.split('@')[1]
  };

  const idToken = createMockJwt(user, now, expiresAt);
  const accessToken = `ya29.a0AfH6SM_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;

  return {
    idToken,
    accessToken,
    tokenType: 'Bearer',
    expiresIn: expiresInSeconds,
    issuedAt: now,
    expiresAt,
    user,
    scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile'
  };
}

/**
 * Retrieve saved Google Credential from localStorage
 */
export function getStoredGoogleCredential(): GoogleCredential | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GOOGLE_AUTH);
    if (!raw) return null;
    const parsed: GoogleCredential = JSON.parse(raw);
    if (!parsed || !parsed.user || !parsed.idToken) return null;
    return parsed;
  } catch (err) {
    console.warn('Failed to parse stored Google credential from localStorage:', err);
    return null;
  }
}

/**
 * Save Google Credential into localStorage and update recent accounts history
 */
export function saveGoogleCredential(credential: GoogleCredential): void {
  try {
    localStorage.setItem(STORAGE_KEY_GOOGLE_AUTH, JSON.stringify(credential));
    
    // Also save to account history
    const existingRaw = localStorage.getItem(STORAGE_KEY_GOOGLE_ACCOUNTS);
    let accounts: GoogleUser[] = [];
    if (existingRaw) {
      try {
        accounts = JSON.parse(existingRaw);
      } catch {
        accounts = [];
      }
    }
    
    // Prepend and dedup by email
    accounts = [credential.user, ...accounts.filter(a => a.email.toLowerCase() !== credential.user.email.toLowerCase())].slice(0, 5);
    localStorage.setItem(STORAGE_KEY_GOOGLE_ACCOUNTS, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save Google credential to localStorage:', err);
  }
}

/**
 * Clear Google Credential from localStorage
 */
export function removeGoogleCredential(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_GOOGLE_AUTH);
  } catch (err) {
    console.error('Failed to clear Google credential from localStorage:', err);
  }
}

/**
 * Get recent Google accounts list from localStorage or default presets
 */
export function getRecentGoogleAccounts(): GoogleUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GOOGLE_ACCOUNTS);
    if (raw) {
      const parsed: GoogleUser[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with defaults
        const merged = [...parsed];
        for (const def of DEFAULT_DEMO_ACCOUNTS) {
          if (!merged.some(m => m.email.toLowerCase() === def.email.toLowerCase())) {
            merged.push(def);
          }
        }
        return merged;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_DEMO_ACCOUNTS;
}
