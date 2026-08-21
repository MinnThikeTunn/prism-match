import { UserProfile } from '../types';
import { getColorIdentity, ColorIdentity, CANONICAL_COLORS } from './colorSystem';

export interface IsoClauseEvaluation {
  clauseNumber: string;
  clauseTitle: string;
  channelName: string;
  score: number;
  threshold: number;
  status: 'CONFORMING' | 'EXEMPLARY' | 'QUALIFIED';
  specification: string;
  auditFinding: string;
}

export interface IsoCertificateData {
  certificateNumber: string;
  standardCode: string;
  standardTitle: string;
  accreditationStandard: string;
  holderName: string;
  holderPrismId: string;
  holderTitle: string;
  holderAvatar: string;
  holderLocation: string;
  
  // Chromatic Qualification
  certifiedArchetype: string;
  certifiedArchetypeTitle: string;
  certifiedColorName: string;
  certifiedColorHex: string;
  oklchSpec: string;
  wavelengthNm: number;
  qualificationGrade: string;
  qualificationTier: string;
  spectrumAura: string;
  dominantDriveDescription: string;
  
  // ISO Conformity Assessment
  clauses: IsoClauseEvaluation[];
  overallComplianceScore: number;
  assessmentStatus: 'OFFICIALLY CERTIFIED' | 'ACCREDITED CONFORMITY';
  
  // Issuance & Governance
  issuanceDate: string;
  effectiveDate: string;
  expiryDate: string;
  issuingAuthority: string;
  accreditationBody: string;
  governingRegistry: string;
  registryBlockHeight: number;
  cryptographicAuditHash: string;
  signatoryTitle: string;
  signatoryName: string;
  registrarTitle: string;
  registrarName: string;
}

// Canonical wavelength mappings for the 5 behavioral channels
const COLOR_WAVELENGTHS: Record<string, number> = {
  'Solar Gold': 589,     // 589 nm (Spectral Gold/Amber)
  'Oceanic Teal': 495,    // 495 nm (Cyan/Teal Boundary)
  'Verdant Emerald': 520, // 520 nm (Pure Spectral Green)
  'Royal Amethyst': 415,  // 415 nm (Deep Violet/Purple)
  'Cobalt Blue': 465,     // 465 nm (Deep Cobalt Blue)
};

/**
 * Deterministic pseudo SHA-256 hash generator from user fields
 */
function generateDeterministicHash(seed: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hexPart2 = Math.abs((hash ^ 0x5bd1e995) >>> 0).toString(16).padStart(8, '0');
  const hexPart3 = Math.abs((hash ^ 0x27d4eb2d) >>> 0).toString(16).padStart(8, '0');
  const hexPart4 = Math.abs((hash ^ 0x9e3779b9) >>> 0).toString(16).padStart(8, '0');
  
  return `0x${hexPart1}${hexPart2}${hexPart3}${hexPart4}bf84c1a790e25d48`.toLowerCase();
}

/**
 * Generates an official ISO-Grade Chromatic Qualification Certificate data object
 * conforming to ISO/PRISM-9001:2026 and ISO/IEC 17024 standards.
 */
export function generateIsoCertificate(user: UserProfile): IsoCertificateData {
  const colorIdentity: ColorIdentity = getColorIdentity(user.id, user);
  const cleanPrismId = (user.prismId || 'MW-9842-AX').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  const execScore = user.executionScore ?? 90;
  const capScore = user.capabilityScore ?? 88;
  const resScore = user.resonanceScore ?? 92;
  const openScore = user.ocean?.openness ?? 85;
  const cobScore = user.ocean?.conscientiousness ?? 90;

  const wavelength = COLOR_WAVELENGTHS[colorIdentity.primaryName] || 580;
  const certNumber = `CERT-ISO9001-${cleanPrismId}-2026`;
  
  // Format verification dates
  const verifiedDate = user.verifiedAt ? new Date(user.verifiedAt) : new Date();
  const issueDateStr = verifiedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const effectiveDateStr = verifiedDate.toISOString().split('T')[0];
  
  // Expiry is 3 years after verification
  const expiryDate = new Date(verifiedDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 3);
  const expiryDateStr = expiryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate overall compliance average
  const complianceAvg = Math.round((execScore + capScore + resScore + openScore + cobScore) / 5);

  // Derive OKLCH coordinate specification
  const lVal = (0.65 + (execScore / 100) * 0.15).toFixed(2);
  const cVal = (0.14 + (capScore / 100) * 0.08).toFixed(2);
  const hVal = colorIdentity.profileCode === 'S' ? '75.0' :
               colorIdentity.profileCode === 'O' ? '195.0' :
               colorIdentity.profileCode === 'V' ? '155.0' :
               colorIdentity.profileCode === 'R' ? '290.0' : '245.0';
               
  const oklchSpec = `oklch(${lVal} ${cVal} ${hVal}°)`;

  // ISO 9001 / IEC 17024 Clause Conformity Matrix
  const clauses: IsoClauseEvaluation[] = [
    {
      clauseNumber: 'Clause 4.1',
      clauseTitle: 'Directive Velocity & High-Speed Execution Capacity',
      channelName: 'Solar Gold Channel',
      score: execScore,
      threshold: 60,
      status: execScore >= 85 ? 'EXEMPLARY' : 'CONFORMING',
      specification: 'ISO/PRISM-9001:2026 §4.1 - Unblocking latency < 4.0h, sprint conversion speed, bias for action.',
      auditFinding: `Verified ${execScore}% velocity index. Demonstrates high directive leadership and rapid sprint execution.`
    },
    {
      clauseNumber: 'Clause 5.2',
      clauseTitle: 'Cognitive Architecture & Formal Systems Rigor',
      channelName: 'Oceanic Teal Channel',
      score: capScore,
      threshold: 60,
      status: capScore >= 85 ? 'EXEMPLARY' : 'CONFORMING',
      specification: 'ISO/PRISM-9001:2026 §5.2 - Distributed schema modeling, async specification depth, architectural durability.',
      auditFinding: `Verified ${capScore}% schema bandwidth. Validated for high-depth abstraction and fault-tolerant software modeling.`
    },
    {
      clauseNumber: 'Clause 6.3',
      clauseTitle: 'Interpersonal Psychological Safety & Ethical Equilibrium',
      channelName: 'Verdant Emerald Channel',
      score: resScore,
      threshold: 60,
      status: resScore >= 85 ? 'EXEMPLARY' : 'CONFORMING',
      specification: 'ISO/PRISM-9001:2026 §6.3 - Cross-functional empathy resonance, bilateral trust preservation, ethical safety.',
      auditFinding: `Verified ${resScore}% resonance factor. Proven capability to safeguard team psychological safety and de-escalate friction.`
    },
    {
      clauseNumber: 'Clause 7.4',
      clauseTitle: 'Lateral Discovery & Frontier Paradigm Synthesis',
      channelName: 'Royal Amethyst Channel',
      score: openScore,
      threshold: 60,
      status: openScore >= 85 ? 'EXEMPLARY' : 'CONFORMING',
      specification: 'ISO/PRISM-9001:2026 §7.4 - Boundary-crossing innovation index, exploratory hypothesis generation, design novelty.',
      auditFinding: `Verified ${openScore}% lateral openness. Certified for 0-to-1 paradigm exploration and creative technological invention.`
    },
    {
      clauseNumber: 'Clause 8.5',
      clauseTitle: 'Deterministic Operational Resilience & Zero-Defect Discipline',
      channelName: 'Cobalt Blue Channel',
      score: cobScore,
      threshold: 60,
      status: cobScore >= 85 ? 'EXEMPLARY' : 'CONFORMING',
      specification: 'ISO/PRISM-9001:2026 §8.5 - Regression test compliance, SLA adherence, zero-downtime infrastructure stability.',
      auditFinding: `Verified ${cobScore}% resilience rating. Confirms high operational discipline, telemetry verification, and contract rigor.`
    }
  ];

  // Qualification Grade
  const qualificationGrade = complianceAvg >= 90 
    ? 'Grade I - Master Chromatic Radiance (Full Luminous Spectrum)'
    : complianceAvg >= 75
    ? 'Grade II - Advanced Chromatic Resonance (Deep Radiance Spectrum)'
    : 'Grade III - Certified Chromatic Practitioner (Standard Aura)';

  const auditHash = generateDeterministicHash(`${user.id}-${cleanPrismId}-${colorIdentity.primaryName}-${complianceAvg}`);
  const blockHeight = 18492000 + Math.abs(auditHash.charCodeAt(2) * 1420);

  return {
    certificateNumber: certNumber,
    standardCode: 'ISO/PRISM-9001:2026 & IEC-17024-C',
    standardTitle: 'International Standard for Behavioral Chromatic Classification & Perceptual Spectrum Calibration',
    accreditationStandard: 'Accreditation Standard for Individual Cognitive Competence & Multi-Agent Harmony',
    holderName: user.name,
    holderPrismId: user.prismId || 'MW-9842-AX',
    holderTitle: user.title,
    holderAvatar: user.avatar,
    holderLocation: user.location,

    certifiedArchetype: colorIdentity.archetypeName,
    certifiedArchetypeTitle: colorIdentity.archetypeTitle,
    certifiedColorName: colorIdentity.primaryName,
    certifiedColorHex: colorIdentity.primaryColor,
    oklchSpec,
    wavelengthNm: wavelength,
    qualificationGrade,
    qualificationTier: user.tier || 'PROFESSIONAL',
    spectrumAura: colorIdentity.auraClass,
    dominantDriveDescription: colorIdentity.toneDescription,

    clauses,
    overallComplianceScore: complianceAvg,
    assessmentStatus: 'OFFICIALLY CERTIFIED',

    issuanceDate: issueDateStr,
    effectiveDate: effectiveDateStr,
    expiryDate: expiryDateStr,
    issuingAuthority: 'International Chromatic Standardization Bureau (ICSB)',
    accreditationBody: 'Prism Global Accreditation Forum (PGAF)',
    governingRegistry: 'ICSB Global Decentralized Telemetry Ledger (Mainnet)',
    registryBlockHeight: blockHeight,
    cryptographicAuditHash: auditHash,
    signatoryTitle: 'Chief Standardization Metrologist & Accreditation Chair',
    signatoryName: 'Dr. Elena Vance-Morgan, Ph.D.',
    registrarTitle: 'Global Registrar of Chromatic Competency',
    registrarName: 'Julian Cross, M.S. Eng.'
  };
}
