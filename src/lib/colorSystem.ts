export type CanonicalColorName = 
  | 'Solar Gold' 
  | 'Oceanic Teal' 
  | 'Verdant Emerald' 
  | 'Royal Amethyst' 
  | 'Cobalt Blue';

export type CanonicalProfileCode = 'S' | 'O' | 'V' | 'R' | 'C';

export interface CanonicalProfileDefinition {
  code: CanonicalProfileCode;
  name: string;
  title: string;
  colorName: CanonicalColorName;
  hex: string;
  oklchHue: number;
  auraClass: string;
  tagline: string;
  description: string;
}

export const CANONICAL_PROFILES: Record<CanonicalProfileCode, CanonicalProfileDefinition> = {
  S: {
    code: 'S',
    name: 'The Solar Catalyst',
    title: 'High-Velocity Execution Driver (Solar Gold)',
    colorName: 'Solar Gold',
    hex: '#D97706',
    oklchHue: 75,
    auraClass: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
    tagline: 'Translates ambiguity into tangible velocity within hours.',
    description: 'Possesses exceptional directive agency and bias for shipping. Excels at unblocking stalled initiatives and driving sprint deadlines.'
  },
  O: {
    code: 'O',
    name: 'The Oceanic Architect',
    title: 'Systems & Cognitive Theorist (Oceanic Teal)',
    colorName: 'Oceanic Teal',
    hex: '#0A6275',
    oklchHue: 195,
    auraClass: 'bg-teal-500/15 text-teal-900 border-teal-500/30',
    tagline: 'Builds fault-tolerant abstractions designed to scale for decades.',
    description: 'Characterized by high analytical bandwidth and structural precision. Prefers deep async memos and formal system specifications.'
  },
  V: {
    code: 'V',
    name: 'The Verdant Mediator',
    title: 'Ethical & Psychological Anchor (Verdant Emerald)',
    colorName: 'Verdant Emerald',
    hex: '#059669',
    oklchHue: 155,
    auraClass: 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30',
    tagline: 'Maintains psychological safety and ethical congruence under extreme stress.',
    description: 'The emotional and cultural bedrock of high-performing collectives. Excels at active listening, de-escalating friction, and team trust.'
  },
  R: {
    code: 'R',
    name: 'The Royal Visionary',
    title: 'Lateral Explorer & Paradigm Pioneer (Royal Amethyst)',
    colorName: 'Royal Amethyst',
    hex: '#7C3AED',
    oklchHue: 290,
    auraClass: 'bg-purple-500/15 text-purple-900 border-purple-500/30',
    tagline: 'Discovers uncharted vectors at the boundary of disparate domains.',
    description: 'Driven by intense intellectual curiosity and lateral pattern matching. Challenges legacy assumptions and pioneers novel interface paradigms.'
  },
  C: {
    code: 'C',
    name: 'The Cobalt Anchor',
    title: 'High-Resilience Operational Guardian (Cobalt Blue)',
    colorName: 'Cobalt Blue',
    hex: '#1D4ED8',
    oklchHue: 245,
    auraClass: 'bg-blue-600/15 text-blue-900 border-blue-600/30',
    tagline: 'Upholds zero-defect standards and immutable operational discipline.',
    description: 'The ultimate stabilizer for mission-critical operations. Ensures high uptime, security compliance, regression testing, and contractual rigor.'
  }
};

export interface ColorIdentity {
  profileCode: CanonicalProfileCode;
  archetypeName: string;
  archetypeTitle: string;
  primaryName: CanonicalColorName;
  primaryColor: string; // Canonical Hex
  harmonicTitle: string;
  gradientClass: string;
  bgGradient: string;
  auraClass: string;
  toneDescription: string;
  spectrumBars: { 
    name: CanonicalColorName; 
    color: string; 
    intensity: 'Full Luminous' | 'Deep Radiance' | 'Vibrant Tone' | 'Soft Aura' 
  }[];
}

export const CANONICAL_COLORS: Record<CanonicalColorName, { hex: string; oklchHue: number; auraClass: string; description: string }> = {
  'Solar Gold': {
    hex: '#D97706',
    oklchHue: 75,
    auraClass: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
    description: 'Execution velocity, proactive unblocking, and rapid sprint momentum.'
  },
  'Oceanic Teal': {
    hex: '#0A6275',
    oklchHue: 195,
    auraClass: 'bg-teal-500/15 text-teal-900 border-teal-500/30',
    description: 'Systems architecture, mathematical logic, and formal schema rigor.'
  },
  'Verdant Emerald': {
    hex: '#059669',
    oklchHue: 155,
    auraClass: 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30',
    description: 'Empathic resonance, psychological safety, and team equilibrium.'
  },
  'Royal Amethyst': {
    hex: '#7C3AED',
    oklchHue: 290,
    auraClass: 'bg-purple-500/15 text-purple-900 border-purple-500/30',
    description: 'Visionary synthesis, lateral discovery, and cross-domain breakthrough invention.'
  },
  'Cobalt Blue': {
    hex: '#1D4ED8',
    oklchHue: 245,
    auraClass: 'bg-blue-600/15 text-blue-900 border-blue-600/30',
    description: 'Deterministic reliability, infrastructure resilience, and zero-defect governance.'
  }
};

export const COLOR_PROFILES: Record<string, ColorIdentity> = {
  'user-current-alex': {
    profileCode: 'S',
    archetypeName: 'The Solar Catalyst',
    archetypeTitle: 'High-Velocity Execution Driver (Solar Gold)',
    primaryName: 'Solar Gold',
    primaryColor: '#D97706',
    harmonicTitle: 'Solar Gold Radiance',
    gradientClass: 'from-[#D97706] to-[#B45309]',
    bgGradient: 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, rgba(217,119,6,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
    toneDescription: 'High-velocity execution driver with intense delivery drive and rapid prototyping momentum.',
    spectrumBars: [
      { name: 'Solar Gold', color: '#D97706', intensity: 'Full Luminous' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Deep Radiance' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Vibrant Tone' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  },
  'user-sam-reed': {
    profileCode: 'O',
    archetypeName: 'The Oceanic Architect',
    archetypeTitle: 'Systems & Cognitive Theorist (Oceanic Teal)',
    primaryName: 'Oceanic Teal',
    primaryColor: '#0A6275',
    harmonicTitle: 'Oceanic Teal Radiance',
    gradientClass: 'from-[#0A6275] to-[#0891B2]',
    bgGradient: 'radial-gradient(circle, rgba(10,98,117,0.18) 0%, rgba(10,98,117,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-teal-500/15 text-teal-900 border-teal-500/30',
    toneDescription: 'Deep systems theorist operating with high analytical precision and structured schemas.',
    spectrumBars: [
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Deep Radiance' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Vibrant Tone' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Soft Aura' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  },
  'user-elias-thorne': {
    profileCode: 'C',
    archetypeName: 'The Cobalt Anchor',
    archetypeTitle: 'High-Resilience Operational Guardian (Cobalt Blue)',
    primaryName: 'Cobalt Blue',
    primaryColor: '#1D4ED8',
    harmonicTitle: 'Cobalt Blue Radiance',
    gradientClass: 'from-[#1D4ED8] to-[#1E40AF]',
    bgGradient: 'radial-gradient(circle, rgba(29,78,216,0.18) 0%, rgba(29,78,216,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-blue-600/15 text-blue-900 border-blue-600/30',
    toneDescription: 'High-resilience infrastructure guardian upholding zero-defect reliability and backend rigor.',
    spectrumBars: [
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Full Luminous' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Full Luminous' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Deep Radiance' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Vibrant Tone' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Soft Aura' }
    ]
  },
  'user-aria-vance': {
    profileCode: 'V',
    archetypeName: 'The Verdant Mediator',
    archetypeTitle: 'Ethical & Psychological Anchor (Verdant Emerald)',
    primaryName: 'Verdant Emerald',
    primaryColor: '#059669',
    harmonicTitle: 'Verdant Emerald Radiance',
    gradientClass: 'from-[#059669] to-[#047857]',
    bgGradient: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, rgba(5,150,105,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30',
    toneDescription: 'Ethical governance and psychological anchor cultivating high trust and safety in collectives.',
    spectrumBars: [
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Deep Radiance' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Vibrant Tone' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Soft Aura' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  },
  'user-julian-cross': {
    profileCode: 'S',
    archetypeName: 'The Solar Catalyst',
    archetypeTitle: 'High-Velocity Execution Driver (Solar Gold)',
    primaryName: 'Solar Gold',
    primaryColor: '#D97706',
    harmonicTitle: 'Solar Gold Radiance',
    gradientClass: 'from-[#D97706] to-[#B45309]',
    bgGradient: 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, rgba(217,119,6,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
    toneDescription: 'Dynamic growth catalyst translating ambiguous strategic goals into shipped features.',
    spectrumBars: [
      { name: 'Solar Gold', color: '#D97706', intensity: 'Full Luminous' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Deep Radiance' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Vibrant Tone' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Soft Aura' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Soft Aura' }
    ]
  },
  'user-elena-rostova': {
    profileCode: 'R',
    archetypeName: 'The Royal Visionary',
    archetypeTitle: 'Lateral Explorer & Paradigm Pioneer (Royal Amethyst)',
    primaryName: 'Royal Amethyst',
    primaryColor: '#7C3AED',
    harmonicTitle: 'Royal Amethyst Radiance',
    gradientClass: 'from-[#7C3AED] to-[#6D28D9]',
    bgGradient: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-purple-500/15 text-purple-900 border-purple-500/30',
    toneDescription: 'Visionary autonomous agent theorist discovering latent connections across frontier paradigms.',
    spectrumBars: [
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Full Luminous' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Full Luminous' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Deep Radiance' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Soft Aura' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  },
  'user-marcus-chen': {
    profileCode: 'R',
    archetypeName: 'The Royal Visionary',
    archetypeTitle: 'Lateral Explorer & Paradigm Pioneer (Royal Amethyst)',
    primaryName: 'Royal Amethyst',
    primaryColor: '#7C3AED',
    harmonicTitle: 'Royal Amethyst Radiance',
    gradientClass: 'from-[#7C3AED] to-[#6D28D9]',
    bgGradient: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-purple-500/15 text-purple-900 border-purple-500/30',
    toneDescription: 'Creative technologist synthesizing novel generative interfaces and interactive experiences.',
    spectrumBars: [
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Full Luminous' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Deep Radiance' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Vibrant Tone' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Soft Aura' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  },
  'user-sophie-dubois': {
    profileCode: 'V',
    archetypeName: 'The Verdant Mediator',
    archetypeTitle: 'Ethical & Psychological Anchor (Verdant Emerald)',
    primaryName: 'Verdant Emerald',
    primaryColor: '#059669',
    harmonicTitle: 'Verdant Emerald Radiance',
    gradientClass: 'from-[#059669] to-[#047857]',
    bgGradient: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, rgba(5,150,105,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30',
    toneDescription: 'Spatial computing designer focused on tactile human harmony and empathic product interfaces.',
    spectrumBars: [
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Deep Radiance' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Vibrant Tone' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Soft Aura' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  },
  'user-tariq-al-mansoor': {
    profileCode: 'C',
    archetypeName: 'The Cobalt Anchor',
    archetypeTitle: 'High-Resilience Operational Guardian (Cobalt Blue)',
    primaryName: 'Cobalt Blue',
    primaryColor: '#1D4ED8',
    harmonicTitle: 'Cobalt Blue Radiance',
    gradientClass: 'from-[#1D4ED8] to-[#1E40AF]',
    bgGradient: 'radial-gradient(circle, rgba(29,78,216,0.18) 0%, rgba(29,78,216,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-blue-600/15 text-blue-900 border-blue-600/30',
    toneDescription: 'High-throughput infrastructure engineer ensuring deterministic reliability and scaling.',
    spectrumBars: [
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Full Luminous' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Deep Radiance' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Vibrant Tone' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Soft Aura' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Soft Aura' }
    ]
  },
  'user-kenji-sato': {
    profileCode: 'O',
    archetypeName: 'The Oceanic Architect',
    archetypeTitle: 'Systems & Cognitive Theorist (Oceanic Teal)',
    primaryName: 'Oceanic Teal',
    primaryColor: '#0A6275',
    harmonicTitle: 'Oceanic Teal Radiance',
    gradientClass: 'from-[#0A6275] to-[#0891B2]',
    bgGradient: 'radial-gradient(circle, rgba(10,98,117,0.18) 0%, rgba(10,98,117,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-teal-500/15 text-teal-900 border-teal-500/30',
    toneDescription: 'Robotics simulation and cognitive modeling architect establishing modular formal schemas.',
    spectrumBars: [
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Full Luminous' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Deep Radiance' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Vibrant Tone' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  },
  'user-chloe-lin': {
    profileCode: 'V',
    archetypeName: 'The Verdant Mediator',
    archetypeTitle: 'Ethical & Psychological Anchor (Verdant Emerald)',
    primaryName: 'Verdant Emerald',
    primaryColor: '#059669',
    harmonicTitle: 'Verdant Emerald Radiance',
    gradientClass: 'from-[#059669] to-[#047857]',
    bgGradient: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, rgba(5,150,105,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30',
    toneDescription: 'Human-AI interaction researcher creating deeply empathetic and intuitive collaborative interfaces.',
    spectrumBars: [
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Full Luminous' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Deep Radiance' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Vibrant Tone' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Soft Aura' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' }
    ]
  },
  'user-mateo-silva': {
    profileCode: 'C',
    archetypeName: 'The Cobalt Anchor',
    archetypeTitle: 'High-Resilience Operational Guardian (Cobalt Blue)',
    primaryName: 'Cobalt Blue',
    primaryColor: '#1D4ED8',
    harmonicTitle: 'Cobalt Blue Radiance',
    gradientClass: 'from-[#1D4ED8] to-[#1E40AF]',
    bgGradient: 'radial-gradient(circle, rgba(29,78,216,0.18) 0%, rgba(29,78,216,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-blue-600/15 text-blue-900 border-blue-600/30',
    toneDescription: 'Applied cryptography engineer with unwavering focus on mathematical correctness and security.',
    spectrumBars: [
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Full Luminous' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Full Luminous' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Deep Radiance' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Soft Aura' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Soft Aura' }
    ]
  },
  'user-maya-patel': {
    profileCode: 'O',
    archetypeName: 'The Oceanic Architect',
    archetypeTitle: 'Systems & Cognitive Theorist (Oceanic Teal)',
    primaryName: 'Oceanic Teal',
    primaryColor: '#0A6275',
    harmonicTitle: 'Oceanic Teal Radiance',
    gradientClass: 'from-[#0A6275] to-[#0891B2]',
    bgGradient: 'radial-gradient(circle, rgba(10,98,117,0.18) 0%, rgba(10,98,117,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-teal-500/15 text-teal-900 border-teal-500/30',
    toneDescription: 'AI systems architect structuring modular multi-agent communication protocols.',
    spectrumBars: [
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Full Luminous' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Full Luminous' },
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Deep Radiance' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Vibrant Tone' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Soft Aura' }
    ]
  },
  'user-zara-novak': {
    profileCode: 'R',
    archetypeName: 'The Royal Visionary',
    archetypeTitle: 'Lateral Explorer & Paradigm Pioneer (Royal Amethyst)',
    primaryName: 'Royal Amethyst',
    primaryColor: '#7C3AED',
    harmonicTitle: 'Royal Amethyst Radiance',
    gradientClass: 'from-[#7C3AED] to-[#6D28D9]',
    bgGradient: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 60%, rgba(250,251,253,0) 100%)',
    auraClass: 'bg-purple-500/15 text-purple-900 border-purple-500/30',
    toneDescription: 'Generative agent developer pioneering recursive self-improving prompt structures.',
    spectrumBars: [
      { name: 'Royal Amethyst', color: '#7C3AED', intensity: 'Full Luminous' },
      { name: 'Solar Gold', color: '#D97706', intensity: 'Full Luminous' },
      { name: 'Oceanic Teal', color: '#0A6275', intensity: 'Deep Radiance' },
      { name: 'Cobalt Blue', color: '#1D4ED8', intensity: 'Soft Aura' },
      { name: 'Verdant Emerald', color: '#059669', intensity: 'Soft Aura' }
    ]
  }
};

/* ------------------------------------------------------------------
 * PAIRWISE COGNITIVE FRICTION & SYNERGY MATRIX
 * Realistic spectrum from 42% (Severe Friction) to 96% (Transcendent)
 * ----------------------------------------------------------------- */

export interface PairwiseFrictionConfig {
  synergyScore: number;
  synergyTitle: string;
  frictionRisk: 'Low' | 'Low-Medium' | 'Medium' | 'High' | 'Critical';
  frictionSummary: string;
  mitigationCadence: string;
}

export const PAIRWISE_FRICTION_MATRIX: Record<string, PairwiseFrictionConfig> = {
  'O-S': {
    synergyScore: 96,
    synergyTitle: 'Solar-Oceanic Velocity Engine',
    frictionRisk: 'Low',
    frictionSummary: 'Occasional timeline tension between prototype speed and architectural completeness. Easily resolved with sandbox vs production milestones.',
    mitigationCadence: 'Fast synchronous syncs for daily sprints; deep async RFCs for architectural schemas.'
  },
  'C-O': {
    synergyScore: 92,
    synergyTitle: 'Deterministic Systems Fortress',
    frictionRisk: 'Low-Medium',
    frictionSummary: 'Risk of over-planning before customer feedback; benefits from external velocity pressure.',
    mitigationCadence: 'Deep async memos, comprehensive PR reviews, and deterministic release cycles.'
  },
  'S-V': {
    synergyScore: 91,
    synergyTitle: 'Harmonic Execution & Culture',
    frictionRisk: 'Low',
    frictionSummary: 'High mutual appreciation of values; minor risk of tough feedback being delayed during crunch periods.',
    mitigationCadence: 'Punchy task-oriented standups softened with regular 1:1 empathy check-ins.'
  },
  'C-V': {
    synergyScore: 88,
    synergyTitle: 'Organizational Safety Net',
    frictionRisk: 'Low',
    frictionSummary: 'Steady, predictable, and supportive, but can hesitate during radical product pivots.',
    mitigationCadence: 'Methodical, transparent communication with reliable cadence.'
  },
  'R-V': {
    synergyScore: 84,
    synergyTitle: 'Human-Centric Future Design',
    frictionRisk: 'Low-Medium',
    frictionSummary: 'Visionary rapid cognitive pivots must be paced for team comprehension and emotional alignment.',
    mitigationCadence: 'Empathetic feedback sessions on futuristic prototypes.'
  },
  'R-S': {
    synergyScore: 74,
    synergyTitle: '0-to-1 Innovation Sprint',
    frictionRisk: 'Medium',
    frictionSummary: 'High volatility: Rapid ideation paired with rapid coding, but high risk of pivoting before completing existing commitments.',
    mitigationCadence: 'Dynamic visual brainstorming coupled with immutable sprint milestone commitments.'
  },
  'O-V': {
    synergyScore: 72,
    synergyTitle: 'Empathetic Systems Architecture',
    frictionRisk: 'Low-Medium',
    frictionSummary: 'Gentle, thoughtful communication cadence; decisions are measured but latency can become slow.',
    mitigationCadence: 'Async-first structured memos paired with bilateral consensus building.'
  },
  'O-R': {
    synergyScore: 66,
    synergyTitle: 'Deep Cognitive Theorist Guild',
    frictionRisk: 'Medium',
    frictionSummary: 'Theoretical tension: First-principles schema modeling vs unconstrained lateral paradigm pivots.',
    mitigationCadence: 'Formal technical whitepapers and regular prototype milestone checks.'
  },
  'C-C': {
    synergyScore: 54,
    synergyTitle: 'Process Fortress (Risk Averse)',
    frictionRisk: 'High',
    frictionSummary: 'Process inertia & extreme risk aversion: Mutual insistence on exhaustive edge-case testing causes analysis paralysis.',
    mitigationCadence: 'Enforce maximum SLA review windows and lightweight prototype sandbox exemptions.'
  },
  'S-S': {
    synergyScore: 52,
    synergyTitle: 'Dual Solar Pulse (Authority Friction)',
    frictionRisk: 'High',
    frictionSummary: 'Authority collision: Two high-velocity execution drivers clashing on technical leadership, roadmap ownership, and sprint priorities.',
    mitigationCadence: 'Daily domain segmentation and strict independent autonomy.'
  },
  'C-S': {
    synergyScore: 48,
    synergyTitle: 'Velocity vs Verification Tension',
    frictionRisk: 'High',
    frictionSummary: 'Pacing & Verification Deadlock: Solar demands hotfixing straight to production; Cobalt blocks until full test suites and compliance pass.',
    mitigationCadence: 'Explicit SLA agreements: Fast isolated staging iteration with strict production gates.'
  },
  'R-R': {
    synergyScore: 45,
    synergyTitle: 'Speculative Loop (Low Execution)',
    frictionRisk: 'High',
    frictionSummary: 'Speculative Loop: Endless generative brainstorming and paradigm reimagination with zero operational follow-through or working software.',
    mitigationCadence: 'Must be paired with a Cobalt Anchor or Solar Catalyst to enforce delivery deadlines.'
  },
  'C-R': {
    synergyScore: 42,
    synergyTitle: 'Paradigm Ambiguity vs SLA Clash',
    frictionRisk: 'Critical',
    frictionSummary: 'Severe Fundamental Incompatibility: Radical exploratory ambiguity directly clashes with zero-defect, immutable compliance standards.',
    mitigationCadence: 'Complete phase separation: Royal explores strictly in sandbox R&D labs; Cobalt governs hardened production pipelines.'
  },
  'O-O': {
    synergyScore: 78,
    synergyTitle: 'Dual Architect Nexus',
    frictionRisk: 'Medium',
    frictionSummary: 'Extremely high theoretical bandwidth, but can result in protracted architectural debates over abstraction boundaries.',
    mitigationCadence: 'Define clear subsystem boundaries and appoint tie-breaking criteria.'
  },
  'V-V': {
    synergyScore: 80,
    synergyTitle: 'Empathic Consensus Core',
    frictionRisk: 'Low-Medium',
    frictionSummary: 'Unbeatable mutual psychological safety, but can hesitate to make drastic operational cutbacks or direct critiques.',
    mitigationCadence: 'Schedule explicit decision deadlines with external execution pressure.'
  }
};

export function getPairwiseFriction(codeA: CanonicalProfileCode, codeB: CanonicalProfileCode): PairwiseFrictionConfig {
  const key1 = `${codeA}-${codeB}`;
  const key2 = `${codeB}-${codeA}`;
  return PAIRWISE_FRICTION_MATRIX[key1] || PAIRWISE_FRICTION_MATRIX[key2] || {
    synergyScore: 70,
    synergyTitle: 'Emergent Collaborative Synthesis',
    frictionRisk: 'Medium',
    frictionSummary: 'Standard cross-channel communication friction manageable with structured check-ins.',
    mitigationCadence: 'Weekly bidirectional alignment check-ins.'
  };
}

export interface ChromaticTestScores {
  solar: number;     // Execution Velocity & Drive (Solar Gold)
  teal: number;      // Systems Architecture & Logic (Oceanic Teal)
  emerald: number;   // Empathic Resonance & Team Trust (Verdant Emerald)
  amethyst: number;  // Visionary Synthesis & Lateral Discovery (Royal Amethyst)
  cobalt: number;    // Deterministic Stability & Infrastructure (Cobalt Blue)
}

export interface ChromaticAssessmentResult {
  scores: ChromaticTestScores;
  primaryKey: keyof ChromaticTestScores;
  profileCode: CanonicalProfileCode;
  archetypeName: string;
  archetypeTagline: string;
  archetypeDescription: string;
  superpower: string;
  blindspot: string;
  idealPartners: string[];
  identity: ColorIdentity;
}

const COLOR_CHANNEL_META: Record<keyof ChromaticTestScores, { code: CanonicalProfileCode; name: CanonicalColorName; hex: string; oklchHue: number }> = {
  solar: { code: 'S', name: 'Solar Gold', hex: '#D97706', oklchHue: 75 },
  teal: { code: 'O', name: 'Oceanic Teal', hex: '#0A6275', oklchHue: 195 },
  emerald: { code: 'V', name: 'Verdant Emerald', hex: '#059669', oklchHue: 155 },
  amethyst: { code: 'R', name: 'Royal Amethyst', hex: '#7C3AED', oklchHue: 290 },
  cobalt: { code: 'C', name: 'Cobalt Blue', hex: '#1D4ED8', oklchHue: 245 },
};

export function computeAssessmentResult(scores: ChromaticTestScores): ChromaticAssessmentResult {
  // Sort entries descending to find dominant single channel
  const entries = (Object.entries(scores) as [keyof ChromaticTestScores, number][])
    .sort((a, b) => b[1] - a[1]);

  const primaryKey = entries[0][0];
  const prim = COLOR_CHANNEL_META[primaryKey];
  const profDef = CANONICAL_PROFILES[prim.code];

  let superpower = '';
  let blindspot = '';
  let idealPartners: string[] = [];

  if (primaryKey === 'solar') {
    superpower = 'Fierce execution velocity and rapid unblocking';
    blindspot = 'Occasional impatience with prolonged architecture deliberations';
    idealPartners = ['The Oceanic Architect (Oceanic Teal)', 'The Cobalt Anchor (Cobalt Blue)'];
  } else if (primaryKey === 'teal') {
    superpower = 'Structural foresight and deterministic system modeling';
    blindspot = 'Risk of over-engineering before market validation';
    idealPartners = ['The Solar Catalyst (Solar Gold)', 'The Verdant Mediator (Verdant Emerald)'];
  } else if (primaryKey === 'emerald') {
    superpower = 'Deep interpersonal resonance and collaborative cohesion';
    blindspot = 'Can hesitate when tough, unpopular executive cuts are required';
    idealPartners = ['The Solar Catalyst (Solar Gold)', 'The Oceanic Architect (Oceanic Teal)'];
  } else if (primaryKey === 'amethyst') {
    superpower = 'Breakthrough conceptual synthesis and rapid mental modeling';
    blindspot = 'Can lose interest once the initial frontier problem is solved';
    idealPartners = ['The Cobalt Anchor (Cobalt Blue)', 'The Oceanic Architect (Oceanic Teal)'];
  } else {
    superpower = 'Fault-tolerant execution and operational governance';
    blindspot = 'Skepticism toward radically speculative or unproven paradigms';
    idealPartners = ['The Royal Visionary (Royal Amethyst)', 'The Solar Catalyst (Solar Gold)'];
  }

  const harmonicTitle = `${prim.name} Radiance`;

  const spectrumBars = entries.map(([key, score]) => {
    const meta = COLOR_CHANNEL_META[key];
    let intensity: 'Full Luminous' | 'Deep Radiance' | 'Vibrant Tone' | 'Soft Aura' = 'Soft Aura';
    if (score >= 80) intensity = 'Full Luminous';
    else if (score >= 60) intensity = 'Deep Radiance';
    else if (score >= 40) intensity = 'Vibrant Tone';
    return {
      name: meta.name,
      color: meta.hex,
      intensity
    };
  });

  const auraClass = CANONICAL_COLORS[prim.name].auraClass;

  const hexToRgb = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [pr, pg, pb] = hexToRgb(prim.hex);

  const identity: ColorIdentity = {
    profileCode: prim.code,
    archetypeName: profDef.name,
    archetypeTitle: profDef.title,
    primaryName: prim.name,
    primaryColor: prim.hex,
    harmonicTitle,
    gradientClass: `from-[${prim.hex}] to-[${prim.hex}]/80`,
    bgGradient: `radial-gradient(circle, rgba(${pr},${pg},${pb},0.18) 0%, rgba(${pr},${pg},${pb},0.06) 60%, rgba(250,251,253,0) 100%)`,
    auraClass,
    toneDescription: `${profDef.name}: ${profDef.tagline}. Dominant frequency in ${prim.name}.`,
    spectrumBars
  };

  return {
    scores,
    primaryKey,
    profileCode: prim.code,
    archetypeName: profDef.name,
    archetypeTagline: profDef.tagline,
    archetypeDescription: profDef.description,
    superpower,
    blindspot,
    idealPartners,
    identity
  };
}

export function saveUserCustomColorIdentity(userId: string, identity: ColorIdentity) {
  try {
    localStorage.setItem(`matchwise_custom_color_${userId}`, JSON.stringify(identity));
    localStorage.setItem('matchwise_user_color_identity', JSON.stringify(identity));
    if (userId === 'user-current-alex' || userId.startsWith('user-')) {
      localStorage.setItem('matchwise_custom_color_user-current-alex', JSON.stringify(identity));
    }
  } catch {
    // ignore
  }
}

export function getColorIdentity(
  userId?: string,
  profile?: {
    executionScore?: number;
    capabilityScore?: number;
    resonanceScore?: number;
    ocean?: { openness?: number; conscientiousness?: number; extraversion?: number; agreeableness?: number; neuroticism?: number };
  }
): ColorIdentity {
  if (userId) {
    try {
      const custom = localStorage.getItem(`matchwise_custom_color_${userId}`);
      if (custom) {
        return JSON.parse(custom);
      }
    } catch {
      // fallback
    }
  }

  try {
    const globalCustom = localStorage.getItem('matchwise_user_color_identity');
    if (globalCustom && (!userId || userId === 'user-current-alex')) {
      return JSON.parse(globalCustom);
    }
  } catch {
    // fallback
  }

  if (profile && (profile.executionScore !== undefined || profile.ocean !== undefined)) {
    return deriveColorIdentityFromProfile(profile);
  }

  if (userId && COLOR_PROFILES[userId]) {
    return COLOR_PROFILES[userId];
  }

  return deriveColorIdentityFromProfile({});
}

export function getPairwiseColorHarmonics(userAId: string, userBId: string) {
  const colA = getColorIdentity(userAId);
  const colB = getColorIdentity(userBId);
  const friction = getPairwiseFriction(colA.profileCode, colB.profileCode);

  const title = colA.primaryName === colB.primaryName 
    ? `${colA.primaryName} Resonance`
    : `${colA.primaryName} & ${colB.primaryName} Synergy`;

  return {
    title,
    subLabel: `${friction.synergyTitle} (${friction.synergyScore}% Synergy)`,
    synergyScore: friction.synergyScore,
    frictionRisk: friction.frictionRisk,
    frictionSummary: friction.frictionSummary,
    mitigationCadence: friction.mitigationCadence,
    colorA: colA.primaryColor,
    nameA: colA.primaryName,
    codeA: colA.profileCode,
    colorB: colB.primaryColor,
    nameB: colB.primaryName,
    codeB: colB.profileCode,
    gradient: `linear-gradient(135deg, ${colA.primaryColor}, ${colB.primaryColor})`,
    resonanceLayers: [
      { name: `${colA.primaryName} Vector (${colA.profileCode})`, color: colA.primaryColor, tone: 'Dominant Resonance' },
      { name: `${colB.primaryName} Vector (${colB.profileCode})`, color: colB.primaryColor, tone: 'Counterpart Resonance' }
    ]
  };
}

/* ------------------------------------------------------------------
 * Profile-derived chromatic identity
 * ----------------------------------------------------------------- */

type ChannelSeed = { code: CanonicalProfileCode; name: CanonicalColorName; color: string; value: number };

function intensityFor(value: number): ColorIdentity['spectrumBars'][number]['intensity'] {
  if (value >= 80) return 'Full Luminous';
  if (value >= 60) return 'Deep Radiance';
  if (value >= 40) return 'Vibrant Tone';
  return 'Soft Aura';
}

export function deriveColorIdentityFromProfile(profile?: {
  executionScore?: number;
  capabilityScore?: number;
  resonanceScore?: number;
  ocean?: { openness?: number; conscientiousness?: number; extraversion?: number; agreeableness?: number; neuroticism?: number };
}): ColorIdentity {
  const p = profile || {};
  const execution = Math.max(0, Math.min(100, p.executionScore ?? 50));
  const capability = Math.max(0, Math.min(100, p.capabilityScore ?? 50));
  const resonance = Math.max(0, Math.min(100, p.resonanceScore ?? 50));
  const openness = Math.max(0, Math.min(100, p.ocean?.openness ?? 50));
  const conscientiousness = Math.max(0, Math.min(100, p.ocean?.conscientiousness ?? 50));

  const seeds: ChannelSeed[] = [
    { code: 'S', name: 'Solar Gold', color: '#D97706', value: execution },
    { code: 'O', name: 'Oceanic Teal', color: '#0A6275', value: capability },
    { code: 'V', name: 'Verdant Emerald', color: '#059669', value: resonance },
    { code: 'R', name: 'Royal Amethyst', color: '#7C3AED', value: openness },
    { code: 'C', name: 'Cobalt Blue', color: '#1D4ED8', value: conscientiousness },
  ];

  const ranked = [...seeds].sort((a, b) => b.value - a.value);
  const primary = ranked[0] || seeds[0];
  const profDef = CANONICAL_PROFILES[primary.code];

  const hexToRgb = (hex: string) => {
    if (!hex || !hex.startsWith('#')) return [217, 119, 6];
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [pr, pg, pb] = hexToRgb(primary.color);

  return {
    profileCode: primary.code,
    archetypeName: profDef.name,
    archetypeTitle: profDef.title,
    primaryName: primary.name,
    primaryColor: primary.color,
    harmonicTitle: `${primary.name} Radiance`,
    gradientClass: `from-[${primary.color}] to-[${primary.color}]/80`,
    bgGradient: `radial-gradient(circle, rgba(${pr},${pg},${pb},0.18) 0%, rgba(${pr},${pg},${pb},0.06) 60%, rgba(250,251,253,0) 100%)`,
    auraClass: profDef.auraClass,
    toneDescription: profDef.description,
    spectrumBars: ranked.map((s) => ({
      name: s.name,
      color: s.color,
      intensity: intensityFor(s.value),
    })),
  };
}

export interface ColorMatchResult {
  score: number; // 35 - 96
  harmonicTitle: string;
  subLabel: string;
  colorA: ColorIdentity;
  colorB: ColorIdentity;
  gradient: string;
  reasons: string[];
  frictionRisk: 'Low' | 'Low-Medium' | 'Medium' | 'High' | 'Critical';
  frictionSummary: string;
  mitigationCadence: string;
  resonanceTier: 'Transcendent' | 'Harmonic' | 'Complementary' | 'Friction' | 'Incompatible';
}

/**
 * Calculates pure Chromatic Resonance & Color Match between two profiles.
 * Reflects genuine psychological & cadence friction (35% to 96%).
 */
export function calculateColorMatchScore(
  profileA?: {
    id?: string;
    executionScore?: number;
    capabilityScore?: number;
    resonanceScore?: number;
    ocean?: { openness?: number; conscientiousness?: number; extraversion?: number; agreeableness?: number; neuroticism?: number };
  },
  profileB?: {
    id?: string;
    executionScore?: number;
    capabilityScore?: number;
    resonanceScore?: number;
    ocean?: { openness?: number; conscientiousness?: number; extraversion?: number; agreeableness?: number; neuroticism?: number };
  }
): ColorMatchResult {
  const safeA = profileA || {};
  const safeB = profileB || {};
  const colA = deriveColorIdentityFromProfile(safeA);
  const colB = deriveColorIdentityFromProfile(safeB);

  const frictionConfig = getPairwiseFriction(colA.profileCode, colB.profileCode);

  const execA = safeA.executionScore ?? 50;
  const capA = safeA.capabilityScore ?? 50;
  const resA = safeA.resonanceScore ?? 50;
  const openA = safeA.ocean?.openness ?? 50;
  const cobA = safeA.ocean?.conscientiousness ?? 50;

  const execB = safeB.executionScore ?? 50;
  const capB = safeB.capabilityScore ?? 50;
  const resB = safeB.resonanceScore ?? 50;
  const openB = safeB.ocean?.openness ?? 50;
  const cobB = safeB.ocean?.conscientiousness ?? 50;

  // 5D Vector dot product (S, O, V, R, C)
  const dot = execA * execB + capA * capB + resA * resB + openA * openB + cobA * cobB;
  const magA = Math.sqrt(execA * execA + capA * capA + resA * resA + openA * openA + cobA * cobA) || 1;
  const magB = Math.sqrt(execB * execB + capB * capB + resB * resB + openB * openB + cobB * cobB) || 1;
  const cosine = dot / (magA * magB);

  // Blend matrix baseline with continuous vector cosine
  const rawScore = frictionConfig.synergyScore * 0.7 + (cosine * 100) * 0.3;
  const score = Math.round(Math.min(96, Math.max(35, rawScore)));

  const reasons: string[] = [];
  if (score >= 85) {
    reasons.push(`High natural resonance: ${frictionConfig.synergyTitle}`);
  } else if (score >= 65) {
    reasons.push(`Complementary dynamic: ${frictionConfig.synergyTitle}`);
  } else {
    reasons.push(`Cognitive tension: ${frictionConfig.frictionSummary}`);
  }

  if (colA.primaryName === colB.primaryName) {
    if (score < 60) {
      reasons.push(`Same-color authority tension: competing ${colA.primaryName} drive requires clear ownership boundaries.`);
    } else {
      reasons.push(`Aligned ${colA.primaryName} frequency fosters natural workflow sync.`);
    }
  } else {
    reasons.push(`${colA.archetypeName} pairs with ${colB.archetypeName} with ${frictionConfig.frictionRisk.toLowerCase()} operational friction.`);
  }

  if (frictionConfig.frictionRisk === 'High' || frictionConfig.frictionRisk === 'Critical') {
    reasons.push(`Mitigation: ${frictionConfig.mitigationCadence}`);
  } else if (Math.min(resA, resB) >= 65) {
    reasons.push('Shared Verdant Emerald resonance brings psychological safety and open communication.');
  }

  const resonanceTier: ColorMatchResult['resonanceTier'] =
    score >= 90 ? 'Transcendent' : score >= 80 ? 'Harmonic' : score >= 65 ? 'Complementary' : score >= 50 ? 'Friction' : 'Incompatible';

  return {
    score,
    harmonicTitle: colA.primaryName === colB.primaryName ? `${colA.primaryName} Alignment` : `${colA.primaryName} & ${colB.primaryName} Synergy`,
    subLabel: `${resonanceTier} Resonance (${score}% Match)`,
    colorA: colA,
    colorB: colB,
    gradient: `linear-gradient(135deg, ${colA.primaryColor}, ${colB.primaryColor})`,
    reasons: reasons.slice(0, 3),
    frictionRisk: frictionConfig.frictionRisk,
    frictionSummary: frictionConfig.frictionSummary,
    mitigationCadence: frictionConfig.mitigationCadence,
    resonanceTier,
  };
}


