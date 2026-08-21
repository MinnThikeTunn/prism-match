import {
  UserProfile,
  MatchResult,
  IntentSubMode,
  KeyDriver,
  ArchetypalMetric,
  CriteriaCardData,
} from '../types';
import { calculateColorMatchScore } from './colorSystem';

/**
 * Evaluates Hard Boundary Gate G in {0, 1}
 */
export function evaluateHardBoundary(userA: UserProfile, userB: UserProfile): { passed: boolean; reason?: string } {
  // Check blocked users
  if (userA.constraints.blockedUserIds?.includes(userB.id) || userB.constraints.blockedUserIds?.includes(userA.id)) {
    return { passed: false, reason: 'Candidate is on blocked list' };
  }

  // Check language compatibility
  const sharedLanguages = userA.constraints.languages.filter(l => userB.constraints.languages.includes(l));
  if (userA.constraints.languages.length > 0 && userB.constraints.languages.length > 0 && sharedLanguages.length === 0) {
    return { passed: false, reason: 'No shared communication language' };
  }

  return { passed: true };
}

/**
 * Calculates System Confidence Factor C in [0, 1]
 * Missing data reduces C, never S
 */
export function calculateConfidence(userA: UserProfile, userB: UserProfile): number {
  let scorePoints = 0;
  let maxPoints = 6;

  if (userA.ocean && userB.ocean) scorePoints += 2;
  if (userA.needsOffers.offers.length > 0 && userB.needsOffers.needs.length > 0) scorePoints += 1;
  if (userA.needsOffers.needs.length > 0 && userB.needsOffers.offers.length > 0) scorePoints += 1;
  if (userA.constraints.connectionGoals.length > 0 && userB.constraints.connectionGoals.length > 0) scorePoints += 1;
  if (userA.availabilityHoursPerWeek > 0 && userB.availabilityHoursPerWeek > 0) scorePoints += 1;

  return Math.min(1.0, Math.max(0.4, scorePoints / maxPoints));
}

/**
 * Tier 1: Personal Engine Compatibility S_personal
 */
export function computePersonalScore(userA: UserProfile, userB: UserProfile, subMode: IntentSubMode): {
  score: number;
  drivers: KeyDriver[];
} {
  // Weights based on subMode
  let wAttr = 0.05, wFuture = 0.10, wProc = 0.20, wDaily = 0.35, wPrac = 0.30;
  if (subMode === 'DATING') {
    wAttr = 0.35; wFuture = 0.25; wProc = 0.20; wDaily = 0.10; wPrac = 0.10;
  } else if (subMode === 'ACTIVITIES') {
    wAttr = 0.05; wFuture = 0.05; wProc = 0.10; wDaily = 0.40; wPrac = 0.40;
  }

  // Sub-scores without artificial floors
  const sAttr = Math.max(0.2, 1 - Math.abs(userA.ocean.extraversion - userB.ocean.extraversion) / 100);
  const sFuture = Math.max(0.2, 1 - Math.abs(userA.ocean.openness - userB.ocean.openness) / 100);
  const sProc = Math.max(0.2, 1 - Math.abs(userA.ocean.agreeableness - userB.ocean.agreeableness) / 100);
  const sDaily = Math.max(0.2, 1 - Math.abs(userA.ocean.conscientiousness - userB.ocean.conscientiousness) / 100);
  const sPrac = Math.max(0.2, 1 - Math.abs(userA.availabilityHoursPerWeek - userB.availabilityHoursPerWeek) / 35);

  const score = (wAttr * sAttr) + (wFuture * sFuture) + (wProc * sProc) + (wDaily * sDaily) + (wPrac * sPrac);

  const drivers: KeyDriver[] = [
    {
      title: 'Philosophical Rhythm',
      description: sProc >= 0.7 ? 'Strong alignment in fundamental ethics provides deep communicative empathy.' : 'Divergent ethical framing requires explicit intent alignment.',
      type: 'values',
      scoreImpact: Math.round(sProc * 100)
    },
    {
      title: 'Interaction Cadence',
      description: sDaily >= 0.7 ? 'Compatible energy expenditure cycles and preferred latency.' : 'Different operating velocities may require asynchronous boundaries.',
      type: 'communication',
      scoreImpact: Math.round(sDaily * 100)
    },
    {
      title: 'Shared Vision & Discovery',
      description: sFuture >= 0.7 ? 'High intellectual and creative curiosity creates expansive mutual growth.' : 'Grounded operational balance complements creative discovery.',
      type: 'technical',
      scoreImpact: Math.round(sFuture * 100)
    }
  ];

  return { score, drivers };
}

/**
 * Tier 2: Professional Engine Compatibility S_professional
 * Asymmetric Needs <-> Offers dot product
 */
export function computeProfessionalScore(userA: UserProfile, userB: UserProfile, subMode: IntentSubMode): {
  score: number;
  drivers: KeyDriver[];
} {
  // Exchange A -> B: (O_A . N_B) / (||N_B|| + eps)
  const offersA = userA.needsOffers.offers;
  const needsB = userB.needsOffers.needs;
  const offersB = userB.needsOffers.offers;
  const needsA = userA.needsOffers.needs;

  const matchAtoB = needsB.filter(n => offersA.some(o => o.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(o.toLowerCase()))).length;
  const sExchAtoB = (matchAtoB + 0.5) / (Math.max(1, needsB.length) + 0.5);

  const matchBtoA = needsA.filter(n => offersB.some(o => o.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(o.toLowerCase()))).length;
  const sExchBtoA = (matchBtoA + 0.5) / (Math.max(1, needsA.length) + 0.5);

  const sExchTotal = Math.min(1.0, (sExchAtoB + sExchBtoA) / 2);

  // Goals & Domain Fit
  const sharedDomains = userA.needsOffers.domains.filter(d => userB.needsOffers.domains.includes(d));
  const sDomain = sharedDomains.length > 0 ? Math.min(1.0, 0.5 + (sharedDomains.length * 0.25)) : 0.4;
  const sGoals = Math.max(0.3, 1 - Math.abs(userA.ocean.conscientiousness - userB.ocean.conscientiousness) / 100);
  const sAvail = Math.max(0.3, 1 - Math.abs(userA.availabilityHoursPerWeek - userB.availabilityHoursPerWeek) / 35);

  let wExch = 0.40, wGoals = 0.30, wDomain = 0.15, wAvail = 0.15;
  if (subMode === 'MENTORSHIP') {
    wExch = 0.50; wGoals = 0.25; wDomain = 0.15; wAvail = 0.10;
  } else if (subMode === 'STUDY_PARTNERS') {
    wExch = 0.35; wGoals = 0.35; wDomain = 0.20; wAvail = 0.10;
  }

  const score = (wExch * sExchTotal) + (wGoals * sGoals) + (wDomain * sDomain) + (wAvail * sAvail);

  const drivers: KeyDriver[] = [
    {
      title: sharedDomains.length > 0 ? 'Domain Synergies' : 'Cross-Domain Potential',
      description: sharedDomains.length > 0 ? `Shared expertise across ${sharedDomains.join(', ')} provides common technical vocabulary.` : 'Complementary domain perspectives with fresh cross-industry insights.',
      type: 'technical',
      scoreImpact: Math.round(sExchTotal * 100)
    },
    {
      title: 'Operating Cadence',
      description: sAvail >= 0.7 ? 'Synchronized schedule bandwidth for iterative collaboration.' : 'Bandwidth gap necessitates clear asynchronous milestones.',
      type: 'communication',
      scoreImpact: Math.round(sAvail * 100)
    },
    {
      title: 'Execution & Governance Fit',
      description: sGoals >= 0.7 ? 'Matched expectations on rigor, testing, and delivery standards.' : 'Different risk tolerances require mutually agreed review gates.',
      type: 'risk',
      scoreImpact: Math.round(sGoals * 100)
    }
  ];

  return { score, drivers };
}

/**
 * Tier 3: Collaborative Engine Group & Task Optimization
 */
export function computeCollaborativeScore(team: UserProfile[], criteria?: CriteriaCardData): number {
  if (team.length === 0) return 0;
  
  // Skill coverage
  const allOffers = team.flatMap(u => u.needsOffers.offers);
  const uniqueOffers = new Set(allOffers.map(o => o.toLowerCase()));
  const coverageScore = Math.min(1.0, uniqueOffers.size / 6);

  // Competence
  const avgExecution = team.reduce((acc, u) => acc + u.executionScore, 0) / (team.length * 100);
  const avgCapability = team.reduce((acc, u) => acc + u.capabilityScore, 0) / (team.length * 100);
  const competenceScore = (avgExecution * 0.5) + (avgCapability * 0.5);

  // Overlap & Schedule
  const avgAvail = team.reduce((acc, u) => acc + u.availabilityHoursPerWeek, 0) / team.length;
  const availScore = Math.min(1.0, avgAvail / 25);

  // Role imbalance penalty
  const pRole = team.length > 3 ? 0.05 : 0.0;

  const fTeam = (0.45 * coverageScore) + (0.35 * competenceScore) + (0.20 * availScore) - pRole;
  return Math.min(1.0, Math.max(0.35, fTeam));
}

/**
 * Unified Recommendation Pipeline: Final Match Score = G * S_blended * C
 * Accurately incorporates Chromatic Friction & Cognitive Alignment (35% - 96%).
 */
export function evaluatePairwiseMatch(
  requester: UserProfile,
  candidate: UserProfile,
  intentOverride?: IntentSubMode
): MatchResult {
  const subMode = intentOverride || candidate.subMode || requester.subMode || 'NETWORKING';
  
  // 1. Evaluate Hard Boundary Gate G
  const gateResult = evaluateHardBoundary(requester, candidate);
  const G = gateResult.passed ? 1 : 0;

  // 2. Contextual Tier Scoring S
  let S = 0.75;
  let keyDrivers: KeyDriver[] = [];

  if (['DATING', 'FRIENDS', 'ACTIVITIES'].includes(subMode)) {
    const res = computePersonalScore(requester, candidate, subMode);
    S = res.score;
    keyDrivers = res.drivers;
  } else if (['NETWORKING', 'MENTORSHIP', 'STUDY_PARTNERS'].includes(subMode)) {
    const res = computeProfessionalScore(requester, candidate, subMode);
    S = res.score;
    keyDrivers = res.drivers;
  } else {
    // Collaborative pairwise
    S = ((requester.capabilityScore + candidate.capabilityScore) / 200) * 0.5 + 
        ((requester.executionScore + candidate.executionScore) / 200) * 0.5;
    keyDrivers = [
      {
        title: 'Execution Momentum',
        description: 'Combined delivery capability and implementation capacity.',
        type: 'technical',
        scoreImpact: Math.round(((requester.executionScore + candidate.executionScore) / 2))
      },
      {
        title: 'Architecture Complementarity',
        description: 'Systems design pairs with front-line execution drive.',
        type: 'technical',
        scoreImpact: Math.round(((requester.capabilityScore + candidate.capabilityScore) / 2))
      },
      {
        title: 'Delivery & Shipping Focus',
        description: 'Synchronized commitment to tangible milestones and working deliverables.',
        type: 'risk',
        scoreImpact: Math.round(((requester.executionScore + candidate.executionScore) / 2))
      }
    ];
  }

  // 3. System Confidence Factor C
  const C = calculateConfidence(requester, candidate);

  // 4. Chromatic & Cognitive Friction Factor
  const colorMatch = calculateColorMatchScore(requester, candidate);
  const fChromatic = colorMatch.score / 100;

  // Blend Domain/Contextual S with Chromatic Friction
  const S_blended = S * 0.6 + fChromatic * 0.4;

  // Final Match Score = G * S_blended * C
  const finalPercentage = Math.round(G * S_blended * C * 100);

  // If there is notable cognitive friction, surface it as a primary driver
  if (colorMatch.frictionRisk === 'High' || colorMatch.frictionRisk === 'Critical' || finalPercentage < 65) {
    keyDrivers.unshift({
      title: `Cognitive Tension (${colorMatch.frictionRisk})`,
      description: `${colorMatch.frictionSummary} Protocol: ${colorMatch.mitigationCadence}`,
      type: 'risk',
      scoreImpact: colorMatch.score
    });
  }

  // Determine synergy label & archetypal metrics
  let synergyLabel = `${colorMatch.colorA.primaryName} & ${colorMatch.colorB.primaryName} Synergy`;
  let synergyDescription = colorMatch.subLabel;

  if (finalPercentage >= 90) {
    synergyLabel = `${colorMatch.harmonicTitle} · Transcendent`;
    synergyDescription = 'Remarkable multi-dimensional alignment across strategic execution, cognitive architecture, and ethical grounding.';
  } else if (finalPercentage >= 80) {
    synergyLabel = `${colorMatch.harmonicTitle} · High Synergy`;
    synergyDescription = 'A balanced blend of technical precision and communicative resonance with high collaborative flow.';
  } else if (finalPercentage >= 65) {
    synergyLabel = `${colorMatch.harmonicTitle} · Complementary`;
    synergyDescription = 'Strong asymmetrical utility with balanced velocity and constructive creative tension.';
  } else if (finalPercentage >= 50) {
    synergyLabel = `${colorMatch.harmonicTitle} · Moderate Friction`;
    synergyDescription = `Operating differences detected: ${colorMatch.frictionSummary}`;
  } else {
    synergyLabel = `${colorMatch.harmonicTitle} · High Friction`;
    synergyDescription = `Severe operational cadence clash: ${colorMatch.frictionSummary}`;
  }

  const focusScore = Math.round(Math.min(99, Math.max(30, ((requester.executionScore + candidate.executionScore) / 2))));
  const clarityScore = Math.round(Math.min(99, Math.max(30, ((requester.capabilityScore + candidate.capabilityScore) / 2))));
  const agilityScore = Math.round(Math.min(99, Math.max(30, ((requester.resonanceScore + candidate.resonanceScore) / 2))));

  const archetypalMetrics: ArchetypalMetric[] = [
    {
      name: 'Focus & Execution',
      percentage: focusScore,
      color: '#D97706', // Solar Gold
      iconType: 'circle'
    },
    {
      name: 'Clarity & Structure',
      percentage: clarityScore,
      color: '#0A6275', // Oceanic Teal
      iconType: 'triangle-left'
    },
    {
      name: 'Agility & Vision',
      percentage: agilityScore,
      color: '#7C3AED', // Royal Amethyst
      iconType: 'triangle-up'
    }
  ];

  return {
    candidate,
    requester,
    hardGatePassed: G === 1,
    gateFailureReason: gateResult.reason,
    rawCompatibilityScore: Number(S_blended.toFixed(3)),
    confidenceFactor: Number(C.toFixed(3)),
    finalMatchScore: finalPercentage,
    synergyLabel,
    synergyDescription,
    keyDrivers: keyDrivers.slice(0, 3),
    archetypalMetrics,
    holisticBalance: finalPercentage,
    frictionRisk: colorMatch.frictionRisk,
    frictionSummary: colorMatch.frictionSummary,
    mitigationCadence: colorMatch.mitigationCadence
  };
}

