import { UserProfile, IntentSubMode } from '../types';
import { evaluatePairwiseMatch } from './algorithm';
import { calculateColorMatchScore, ColorMatchResult } from './colorSystem';

export const MATCH_VERSION = 'MATCHWISE_MATCH_V1_0';

/** Connection storage helpers */
export const CONNECTIONS_STORAGE_KEY = 'matchwise_connections';

export function getStoredConnections(): string[] {
  try {
    const raw = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as string[];
    const swipes = loadSwipes();
    return Array.from(new Set(swipes.filter(s => s.action === 'like').map(s => s.candidateId)));
  } catch {
    return [];
  }
}

export function saveConnection(candidateId: string): string[] {
  try {
    const current = getStoredConnections();
    if (!current.includes(candidateId)) {
      const next = [...current, candidateId];
      localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(next));
      return next;
    }
    return current;
  } catch {
    return [];
  }
}

export function removeConnection(candidateId: string): string[] {
  try {
    const current = getStoredConnections();
    const next = current.filter(id => id !== candidateId);
    localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export function isConnected(candidateId: string): boolean {
  return getStoredConnections().includes(candidateId);
}

export interface RankedColorMatchCandidate {
  candidate: UserProfile;
  colorMatch: ColorMatchResult;
  score: number;
}

/**
 * Ranks candidate pool strictly based on Chromatic Resonance (Color Match).
 */
export function rankCandidatesByColorMatch(
  requester: UserProfile,
  pool: UserProfile[],
  swipes: SwipeRecord[] = []
): RankedColorMatchCandidate[] {
  const seen = new Set(swipes.map(s => s.candidateId));

  return pool
    .filter(c => c.id !== requester.id && !seen.has(c.id))
    .map(candidate => {
      const colorMatch = calculateColorMatchScore(requester, candidate);
      return {
        candidate,
        colorMatch,
        score: colorMatch.score,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/** Non-romantic discovery contexts. */
export type DiscoveryContext = 'COLLABORATE' | 'STUDY' | 'FRIENDS' | 'TEAMS';

export const DISCOVERY_CONTEXTS: {
  id: DiscoveryContext;
  label: string;
  subMode: IntentSubMode;
  blurb: string;
}[] = [
  { id: 'COLLABORATE', label: 'Collaborate', subMode: 'NETWORKING', blurb: 'Skill exchange & co-building' },
  { id: 'STUDY', label: 'Study', subMode: 'STUDY_PARTNERS', blurb: 'Peers, tutors & learners' },
  { id: 'FRIENDS', label: 'Community', subMode: 'FRIENDS', blurb: 'Social rhythm & shared activities' },
  { id: 'TEAMS', label: 'Teams', subMode: 'PROJECT_GROUPS', blurb: 'Role coverage & delivery fit' },
];

export type SwipeAction = 'like' | 'pass';

export interface SwipeRecord {
  candidateId: string;
  action: SwipeAction;
  context: DiscoveryContext;
  at: string;
  matchVersion: string;
  /** Tags the candidate was shown with — only shown candidates feed learning. */
  tags: string[];
}

const STORAGE_KEY = 'matchwise_discovery_swipes';

export function loadSwipes(): SwipeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SwipeRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveSwipes(records: SwipeRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-400)));
  } catch {
    /* ignore */
  }
}

export function clearSwipes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONNECTIONS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Tags used as preference signals for a candidate. */
export function candidateTags(candidate: UserProfile): string[] {
  if (!candidate) return [];
  const offers = Array.isArray(candidate.needsOffers?.offers) ? candidate.needsOffers.offers : [];
  const domains = Array.isArray(candidate.needsOffers?.domains) ? candidate.needsOffers.domains : [];
  return [...offers, ...domains].map((t) => String(t).toLowerCase());
}

export interface LearnedSignal {
  weights: Record<string, number>;
  liked: number;
  passed: number;
}

/** Learned preference from actual swipe behaviour, per context. */
export function learnSignal(swipes: SwipeRecord[], context: DiscoveryContext): LearnedSignal {
  const weights: Record<string, number> = {};
  let liked = 0;
  let passed = 0;
  for (const s of swipes) {
    if (s.context !== context) continue;
    const delta = s.action === 'like' ? 1 : -0.6;
    if (s.action === 'like') liked++;
    else passed++;
    for (const tag of s.tags || []) weights[tag] = (weights[tag] || 0) + delta;
  }
  return { weights, liked, passed };
}

export function topLearnedTags(signal: LearnedSignal, n = 3): string[] {
  return Object.entries(signal.weights)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

export interface RankedCandidate {
  candidate: UserProfile;
  baseScore: number;
  behaviourAdjustment: number;
  score: number;
  confidence: number;
  eligible: boolean;
  gateReason?: string;
  isExploration: boolean;
  reasons: string[];
  uncertainties: string[];
}

function evidence(
  requester: UserProfile,
  candidate: UserProfile,
  context: DiscoveryContext,
): { reasons: string[]; uncertainties: string[] } {
  const reasons: string[] = [];
  const uncertainties: string[] = [];

  const reqNeeds = Array.isArray(requester.needsOffers?.needs) ? requester.needsOffers.needs : [];
  const reqOffers = Array.isArray(requester.needsOffers?.offers) ? requester.needsOffers.offers : [];
  const reqDomains = Array.isArray(requester.needsOffers?.domains) ? requester.needsOffers.domains : [];

  const candNeeds = Array.isArray(candidate.needsOffers?.needs) ? candidate.needsOffers.needs : [];
  const candOffers = Array.isArray(candidate.needsOffers?.offers) ? candidate.needsOffers.offers : [];
  const candDomains = Array.isArray(candidate.needsOffers?.domains) ? candidate.needsOffers.domains : [];

  const theirOffersYouNeed = reqNeeds.filter((n) =>
    candOffers.some(
      (o) => o.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(o.toLowerCase()),
    ),
  );
  const yourOffersTheyNeed = candNeeds.filter((n) =>
    reqOffers.some(
      (o) => o.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(o.toLowerCase()),
    ),
  );
  const sharedDomains = reqDomains.filter((d) =>
    candDomains.includes(d),
  );
  const availGap = Math.abs((requester.availabilityHoursPerWeek ?? 20) - (candidate.availabilityHoursPerWeek ?? 20));

  const colorMatch = calculateColorMatchScore(requester, candidate);

  if (colorMatch.score >= 85) {
    reasons.push(`${colorMatch.harmonicTitle}: Natural ${colorMatch.resonanceTier.toLowerCase()} synergy (${colorMatch.score}%).`);
  }

  if (theirOffersYouNeed.length) reasons.push(`They cover what you're missing: ${theirOffersYouNeed.slice(0, 2).join(', ')}.`);
  if (yourOffersTheyNeed.length) reasons.push(`You cover what they're missing: ${yourOffersTheyNeed.slice(0, 2).join(', ')}.`);
  if (sharedDomains.length) reasons.push(`You both work in ${sharedDomains.slice(0, 2).join(' and ')}.`);
  if (availGap <= 6) reasons.push('Your weekly availability lines up closely.');
  if (context === 'STUDY' && Math.abs((requester.capabilityScore ?? 50) - (candidate.capabilityScore ?? 50)) >= 10)
    reasons.push('Skill gap is complementary — useful for teaching and learning.');
  if (context === 'TEAMS' && (candidate.executionScore ?? 50) >= 80)
    reasons.push('High execution drive strengthens delivery on a team.');
  if (context === 'FRIENDS' && Math.abs((requester.ocean?.extraversion ?? 50) - (candidate.ocean?.extraversion ?? 50)) <= 15)
    reasons.push('Similar social rhythm makes casual contact easy.');
  if (!reasons.length) reasons.push('Broad profile overlap without a single standout factor.');

  if (colorMatch.frictionRisk === 'High' || colorMatch.frictionRisk === 'Critical') {
    uncertainties.push(`Cognitive Tension (${colorMatch.frictionRisk}): ${colorMatch.frictionSummary}`);
  }

  if (availGap > 12) uncertainties.push('Weekly availability differs a lot — coordination may be harder.');
  if (!sharedDomains.length) uncertainties.push('No shared domain recorded yet.');
  if (!candidate.constraints?.connectionGoals?.length) uncertainties.push('Their connection goals are not filled in.');
  if (context === 'STUDY') uncertainties.push('We have limited information about their study style.');

  return { reasons, uncertainties: uncertainties.slice(0, 3) };
}

/**
 * Candidate pool -> remove self -> remove seen/blocked -> hard boundaries ->
 * context scoring -> behaviour adjustment -> confidence -> explanation -> rank.
 */
export function rankDiscovery(
  requester: UserProfile,
  pool: UserProfile[],
  context: DiscoveryContext,
  swipes: SwipeRecord[],
): RankedCandidate[] {
  const seen = new Set(swipes.filter((s) => s.context === context).map((s) => s.candidateId));
  const signal = learnSignal(swipes, context);
  const subMode = DISCOVERY_CONTEXTS.find((c) => c.id === context)!.subMode;

  const ranked = pool
    .filter((c) => c.id !== requester.id && !seen.has(c.id))
    .map<RankedCandidate>((candidate) => {
      const result = evaluatePairwiseMatch(requester, candidate, subMode);
      const tags = candidateTags(candidate);
      const raw = tags.reduce((acc, t) => acc + (signal.weights[t] || 0), 0);
      // Bounded nudge so learned behaviour never dominates the deterministic score.
      const behaviourAdjustment = Math.max(-6, Math.min(6, raw * 1.2));
      const { reasons, uncertainties } = evidence(requester, candidate, context);
      return {
        candidate,
        baseScore: result.finalMatchScore,
        behaviourAdjustment: Math.round(behaviourAdjustment * 10) / 10,
        score: Math.round(result.finalMatchScore + behaviourAdjustment),
        confidence: result.confidenceFactor,
        eligible: result.hardGatePassed,
        gateReason: result.gateFailureReason,
        isExploration: false,
        reasons,
        uncertainties,
      };
    })
    .filter((r) => r.eligible)
    .sort((a, b) => b.score - a.score);

  // Exploration slot: keep one lower-ranked candidate near the top so the feed
  // does not collapse into a single narrow profile type.
  if (ranked.length > 4) {
    const idx = 3 + (swipes.length % Math.max(1, ranked.length - 3));
    const [explore] = ranked.splice(Math.min(idx, ranked.length - 1), 1);
    if (explore) {
      explore.isExploration = true;
      ranked.splice(Math.min(2, ranked.length), 0, explore);
    }
  }

  return ranked;
}

export function confidenceLabel(c: number): string {
  if (c >= 0.88) return 'High';
  if (c >= 0.7) return 'Moderate';
  return 'Limited';
}

export function evidenceLabel(score: number): string {
  if (score >= 90) return 'Transcendent Fit';
  if (score >= 80) return 'Strong Synergy';
  if (score >= 65) return 'Complementary';
  if (score >= 50) return 'Moderate Tension';
  return 'High Friction';
}
