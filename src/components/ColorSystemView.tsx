import React from 'react';
import { 
  Palette
} from 'lucide-react';
import { SynergyFrictionGraphWeb, HarmonicPair } from './SynergyFrictionGraphWeb';

export interface Archetype {
  id: string;
  code: 'S' | 'O' | 'V' | 'R' | 'C';
  name: string;
  title: string;
  primaryColor: string;
  gradientClass: string;
  bgGradient: string;
  tagline: string;
  behaviorSummary: string;
  cadence: {
    communication: string;
    velocity: string;
    riskProfile: string;
    decisionMaking: string;
  };
  oceanProfile: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    stability: number;
  };
  strengths: string[];
  blindspots: string[];
  optimalCounterpart: string;
}

const CHROMATIC_ARCHETYPES: Archetype[] = [
  {
    id: 'solar-catalyst',
    code: 'S',
    name: 'The Solar Catalyst',
    title: 'High-Velocity Execution Driver (Solar Gold)',
    primaryColor: '#D97706',
    gradientClass: 'from-[#D97706] to-[#B45309]',
    bgGradient: 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, rgba(217,119,6,0.06) 100%)',
    tagline: 'Translates ambiguity into tangible velocity within hours.',
    behaviorSummary: 'Possesses exceptional directive agency and bias for shipping. Excels at unblocking stalled initiatives, driving sprint deadlines, and turning abstract strategies into running software.',
    cadence: {
      communication: 'Direct, synchronous-friendly, punchy summaries',
      velocity: 'Rapid iterative cycles (hours to days)',
      riskProfile: 'High experimental risk tolerance',
      decisionMaking: 'Intuitive execution grounded in immediate feedback'
    },
    oceanProfile: {
      openness: 72,
      conscientiousness: 88,
      extraversion: 78,
      agreeableness: 65,
      stability: 82
    },
    strengths: ['0-to-1 Momentum', 'Unblocking Teams', 'Bias for Action', 'Decisive Prioritization'],
    blindspots: ['May bypass edge-case documentation', 'Impatient with prolonged consensus'],
    optimalCounterpart: 'The Oceanic Architect (Oceanic Teal) to ensure structural longevity'
  },
  {
    id: 'oceanic-architect',
    code: 'O',
    name: 'The Oceanic Architect',
    title: 'Systems & Cognitive Theorist (Oceanic Teal)',
    primaryColor: '#0A6275',
    gradientClass: 'from-[#0A6275] to-[#0891B2]',
    bgGradient: 'radial-gradient(circle, rgba(10,98,117,0.18) 0%, rgba(10,98,117,0.06) 100%)',
    tagline: 'Builds fault-tolerant abstractions designed to scale for decades.',
    behaviorSummary: 'Characterized by high analytical bandwidth and structural precision. Prefers deep async memos, formal system specifications, and meticulous root-cause investigations.',
    cadence: {
      communication: 'Async-first, structured technical memos, thorough PR reviews',
      velocity: 'Calculated, high-fidelity long-range cycles',
      riskProfile: 'Measured, mathematically bounded risk',
      decisionMaking: 'First-principles analytical synthesis'
    },
    oceanProfile: {
      openness: 86,
      conscientiousness: 94,
      extraversion: 45,
      agreeableness: 72,
      stability: 88
    },
    strengths: ['Distributed Architecture', 'Fault-Tolerant Schemas', 'Root-Cause Analysis', 'Deep async documentation'],
    blindspots: ['Risk of over-engineering early prototypes', 'Slower initial momentum'],
    optimalCounterpart: 'The Solar Catalyst (Solar Gold) to accelerate time-to-market'
  },
  {
    id: 'verdant-mediator',
    code: 'V',
    name: 'The Verdant Mediator',
    title: 'Ethical & Psychological Anchor (Verdant Emerald)',
    primaryColor: '#059669',
    gradientClass: 'from-[#059669] to-[#047857]',
    bgGradient: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, rgba(5,150,105,0.06) 100%)',
    tagline: 'Maintains psychological safety and ethical congruence under extreme stress.',
    behaviorSummary: 'The emotional and cultural bedrock of high-performing collectives. Excels at active listening, de-escalating friction, facilitating consensus, and safeguarding long-term member wellbeing.',
    cadence: {
      communication: 'High-empathy, diplomatic, bilateral check-ins',
      velocity: 'Steady, sustainable, burnout-resistant pace',
      riskProfile: 'Human-centric cautious risk',
      decisionMaking: 'Consensus-oriented with long-term ethical horizon'
    },
    oceanProfile: {
      openness: 70,
      conscientiousness: 76,
      extraversion: 68,
      agreeableness: 96,
      stability: 90
    },
    strengths: ['Conflict Resolution', 'Psychological Safety', 'Values Alignment', 'Stakeholder Empathy'],
    blindspots: ['May hesitate to deliver harsh direct critiques', 'Slow to enforce drastic cutbacks'],
    optimalCounterpart: 'The Solar Catalyst (Solar Gold) to enforce hard operational constraints'
  },
  {
    id: 'royal-visionary',
    code: 'R',
    name: 'The Royal Visionary',
    title: 'Lateral Explorer & Paradigm Pioneer (Royal Amethyst)',
    primaryColor: '#7C3AED',
    gradientClass: 'from-[#7C3AED] to-[#6D28D9]',
    bgGradient: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 100%)',
    tagline: 'Discovers uncharted vectors at the boundary of disparate domains.',
    behaviorSummary: 'Driven by intense intellectual curiosity and lateral pattern matching. Challenges legacy assumptions, anticipates macroeconomic shifts, and conceives novel interface paradigms.',
    cadence: {
      communication: 'Conceptual, visual frameworks, speculative whitepapers',
      velocity: 'Non-linear breakthrough bursts',
      riskProfile: 'Frontier exploratory risk appetite',
      decisionMaking: 'Intuitive pattern synthesis and counter-consensus insights'
    },
    oceanProfile: {
      openness: 98,
      conscientiousness: 65,
      extraversion: 62,
      agreeableness: 74,
      stability: 76
    },
    strengths: ['Novel Product Concepts', 'Cross-Domain Synthesis', 'Zero-to-One Innovation', 'Macro Vision'],
    blindspots: ['May lose interest once routine maintenance begins', 'Can generate too many parallel hypotheses'],
    optimalCounterpart: 'The Cobalt Anchor (Cobalt Blue) to ground breakthrough visions in rock-solid execution'
  },
  {
    id: 'cobalt-anchor',
    code: 'C',
    name: 'The Cobalt Anchor',
    title: 'High-Resilience Operational Guardian (Cobalt Blue)',
    primaryColor: '#1D4ED8',
    gradientClass: 'from-[#1D4ED8] to-[#1E40AF]',
    bgGradient: 'radial-gradient(circle, rgba(29,78,216,0.18) 0%, rgba(29,78,216,0.06) 100%)',
    tagline: 'Upholds zero-defect standards and immutable operational discipline.',
    behaviorSummary: 'The ultimate stabilizer for mission-critical operations. Ensures uptime, security compliance, regression testing, and relentless adherence to contract commitments.',
    cadence: {
      communication: 'Precise, factual, telemetry-backed updates',
      velocity: 'Deterministic, milestone-driven reliability',
      riskProfile: 'Zero-tolerance for unmitigated failure',
      decisionMaking: 'Empirical verification and stress-testing'
    },
    oceanProfile: {
      openness: 60,
      conscientiousness: 98,
      extraversion: 48,
      agreeableness: 70,
      stability: 96
    },
    strengths: ['Zero-Downtime Operations', 'Security & Compliance', 'Stress Resilience', 'Contractual Rigor'],
    blindspots: ['Can be resistant to radical paradigm shifts', 'Heavy process overhead for lightweight tasks'],
    optimalCounterpart: 'The Royal Visionary (Royal Amethyst) to inject fresh lateral exploration'
  }
];

const HARMONIC_PAIRS: HarmonicPair[] = [
  {
    archetypeA: 'The Solar Catalyst',
    colorA: '#D97706',
    archetypeB: 'The Oceanic Architect',
    colorB: '#0A6275',
    synergyScore: 96,
    synergyTitle: 'Solar-Oceanic Velocity Engine',
    description: 'The definitive founder combination. Solar drive forces rapid market validation while Oceanic rigor guarantees zero technical debt. Friction is practically non-existent when roles are clearly segmented.',
    frictionRisk: 'Low (Occasional timeline debate over prototype vs perfection; resolved with sandbox vs production milestones).',
    cadenceBalance: 'Fast synchronous syncs for daily sprints; deep async RFCs for architectural schemas.'
  },
  {
    archetypeA: 'The Oceanic Architect',
    colorA: '#0A6275',
    archetypeB: 'The Cobalt Anchor',
    colorB: '#1D4ED8',
    synergyScore: 92,
    synergyTitle: 'Deterministic Systems Fortress',
    description: 'Unmatched operational resilience and zero-defect architecture. Oceanic provides elegant distributed models while Cobalt enforces strict telemetry, compliance, CI/CD reliability, and high uptime.',
    frictionRisk: 'Low-Medium (Can risk over-planning before customer feedback; benefits from velocity pressure).',
    cadenceBalance: 'Deep async memos, comprehensive PR reviews, and deterministic release cycles.'
  },
  {
    archetypeA: 'The Solar Catalyst',
    colorA: '#D97706',
    archetypeB: 'The Verdant Mediator',
    colorB: '#059669',
    synergyScore: 91,
    synergyTitle: 'Harmonic Execution & Culture',
    description: 'Prevents founder burnout and team turnover during intense crunch cycles. Solar provides execution velocity while Verdant safeguards empathy, psychological safety, and collective morale.',
    frictionRisk: 'Low (High mutual appreciation of complementary values; minor friction if tough feedback is softened).',
    cadenceBalance: 'Punchy task-oriented standups softened with regular 1:1 empathy check-ins.'
  },
  {
    archetypeA: 'The Verdant Mediator',
    colorA: '#059669',
    archetypeB: 'The Cobalt Anchor',
    colorB: '#1D4ED8',
    synergyScore: 88,
    synergyTitle: 'Organizational Safety Net',
    description: 'Provides the highest degree of organizational stability and psychological trust. Cobalt ensures zero operational failures while Verdant ensures zero interpersonal burnout.',
    frictionRisk: 'Low (Steady, predictable, and supportive operating environment).',
    cadenceBalance: 'Methodical, transparent communication with reliable cadence.'
  },
  {
    archetypeA: 'The Verdant Mediator',
    colorA: '#059669',
    archetypeB: 'The Royal Visionary',
    colorB: '#7C3AED',
    synergyScore: 84,
    synergyTitle: 'Human-Centric Future Design',
    description: 'Creates empathetic, transformative user experiences. Royal Amethyst conceives novel interaction paradigms while Verdant Emerald ensures the technology serves genuine human emotional and ethical needs.',
    frictionRisk: 'Low-Medium (Visionary rapid cognitive pivots must be paced for team comprehension).',
    cadenceBalance: 'Empathetic feedback sessions on futuristic prototypes.'
  },
  {
    archetypeA: 'The Verdant Mediator',
    colorA: '#059669',
    archetypeB: 'The Verdant Mediator',
    colorB: '#059669',
    synergyScore: 80,
    synergyTitle: 'Empathic Consensus Core',
    description: 'Unbeatable mutual psychological safety and trust, but can hesitate to execute drastic operational cuts or direct performance critiques without external velocity enforcement.',
    frictionRisk: 'Low-Medium (Decision latency during complex tradeoffs).',
    cadenceBalance: 'Schedule explicit decision deadlines with external execution pressure.'
  },
  {
    archetypeA: 'The Oceanic Architect',
    colorA: '#0A6275',
    archetypeB: 'The Oceanic Architect',
    colorB: '#0A6275',
    synergyScore: 78,
    synergyTitle: 'Dual Architect Nexus',
    description: 'Extremely high theoretical bandwidth and system depth, but can result in protracted architectural debates over abstraction boundaries and framework selection.',
    frictionRisk: 'Medium (Abstraction deadlock without domain partitioning).',
    cadenceBalance: 'Define clear subsystem boundaries and appoint tie-breaking criteria.'
  },
  {
    archetypeA: 'The Royal Visionary',
    colorA: '#7C3AED',
    archetypeB: 'The Solar Catalyst',
    colorB: '#D97706',
    synergyScore: 74,
    synergyTitle: '0-to-1 Innovation Sprint',
    description: 'Rapid frontier innovation and blitzscaling. Royal Amethyst opens radical new paradigm spaces while Solar Gold immediately turns speculative ideas into living code and working MVPs in record time.',
    frictionRisk: 'Medium (Risk of pivoting too quickly before completing existing initiatives without anchor stability).',
    cadenceBalance: 'Dynamic visual brainstorming coupled with immediate sprint commitments.'
  },
  {
    archetypeA: 'The Oceanic Architect',
    colorA: '#0A6275',
    archetypeB: 'The Verdant Mediator',
    colorB: '#059669',
    synergyScore: 72,
    synergyTitle: 'Empathetic Systems Architecture',
    description: 'Combines high intellectual bandwidth with human-centered product development. Oceanic builds clear, fault-tolerant mental models while Verdant ensures team collaboration remains healthy, inclusive, and aligned.',
    frictionRisk: 'Low-Medium (Gentle, thoughtful communication cadence; decisions are measured and carefully reasoned).',
    cadenceBalance: 'Async-first structured memos paired with bilateral consensus building.'
  },
  {
    archetypeA: 'The Oceanic Architect',
    colorA: '#0A6275',
    archetypeB: 'The Royal Visionary',
    colorB: '#7C3AED',
    synergyScore: 66,
    synergyTitle: 'Deep Cognitive Theorist Guild',
    description: 'A powerhouse of first-principles thinking and lateral discovery. Connects abstract macro-horizons with mathematical schemas and formal data models.',
    frictionRisk: 'Medium (Can get stuck in theoretical exploration without an execution driver to force concrete shipping).',
    cadenceBalance: 'Formal technical whitepapers and regular prototype milestone checks.'
  },
  {
    archetypeA: 'The Cobalt Anchor',
    colorA: '#1D4ED8',
    archetypeB: 'The Cobalt Anchor',
    colorB: '#1D4ED8',
    synergyScore: 54,
    synergyTitle: 'Process Fortress (Risk Averse)',
    description: 'Process inertia & extreme risk aversion: Mutual insistence on exhaustive edge-case testing and compliance reviews can cause paralysis and delay shipping.',
    frictionRisk: 'High (Over-regulation and resistance to rapid prototyping).',
    cadenceBalance: 'Enforce maximum SLA review windows and lightweight prototype sandbox exemptions.'
  },
  {
    archetypeA: 'The Solar Catalyst',
    colorA: '#D97706',
    archetypeB: 'The Solar Catalyst',
    colorB: '#D97706',
    synergyScore: 52,
    synergyTitle: 'Dual Solar Pulse (Authority Friction)',
    description: 'Authority collision: Two high-velocity execution drivers clashing on technical leadership, roadmap ownership, and sprint priorities.',
    frictionRisk: 'High (Territory disputes on velocity leadership).',
    cadenceBalance: 'Daily domain segmentation and strict independent autonomy.'
  },
  {
    archetypeA: 'The Solar Catalyst',
    colorA: '#D97706',
    archetypeB: 'The Cobalt Anchor',
    colorB: '#1D4ED8',
    synergyScore: 48,
    synergyTitle: 'Velocity vs Verification Tension',
    description: 'Forces high-speed builder and high-reliability guardian to collide. Solar demands immediate production deployment; Cobalt halts releases until multi-stage regression and compliance suites pass.',
    frictionRisk: 'High (Severe pacing deadlock without clear staging SLAs and decoupled sandbox environments).',
    cadenceBalance: 'Explicit SLA agreements: fast staging iteration with strict production gates.'
  },
  {
    archetypeA: 'The Royal Visionary',
    colorA: '#7C3AED',
    archetypeB: 'The Royal Visionary',
    colorB: '#7C3AED',
    synergyScore: 45,
    synergyTitle: 'Speculative Loop (Low Execution)',
    description: 'Speculative Loop: Endless generative brainstorming and paradigm reimagination with zero operational follow-through or working software.',
    frictionRisk: 'High (Visionary looping with zero shipping cadence).',
    cadenceBalance: 'Must be paired with a Cobalt Anchor or Solar Catalyst to enforce delivery deadlines.'
  },
  {
    archetypeA: 'The Royal Visionary',
    colorA: '#7C3AED',
    archetypeB: 'The Cobalt Anchor',
    colorB: '#1D4ED8',
    synergyScore: 42,
    synergyTitle: 'Paradigm Ambiguity vs SLA Clash',
    description: 'Fundamental cognitive incompatibility: Radical speculative experimentation directly opposes zero-defect deterministic compliance.',
    frictionRisk: 'Critical (Severe friction: Visionary rejects rigid processes; Cobalt rejects unvalidated paradigms).',
    cadenceBalance: 'Complete phase separation: Royal explores in isolated R&D labs; Cobalt governs hardened production pipelines.'
  }
];

interface ColorSystemViewProps {
  onOpenChromaticTest?: () => void;
}

export const ColorSystemView: React.FC<ColorSystemViewProps> = ({
  onOpenChromaticTest
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-6 sm:mb-8 relative overflow-hidden">
        {/* Chromatic ambient glow */}
        <div 
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #D97706 0%, #0A6275 40%, #059669 80%, transparent 100%)'
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] text-xs font-bold">
            <Palette className="w-3.5 h-3.5" />
            <span>Matchwise Behavioral Chromatics (OKLCH Standard)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            How We Define Human Behavior with Perceptual Color
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Human personality and collaboration chemistry cannot be reduced to a single 1-to-10 rating or a rigid 4-letter box. Matchwise maps cognitive cadence, execution velocity, ethical alignment, and visionary intuition into continuous <strong>OKLCH Perceptual Color Space</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              Solar Gold (Execution)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0A6275]" />
              Oceanic Teal (Systems Logic)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
              Verdant Emerald (Empathy)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
              Royal Amethyst (Vision)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
              Cobalt Blue (Resilience)
            </span>
          </div>

        </div>
      </div>

      {/* Synergy & Friction Metrics (Obsidian Web & Matrix Grid) */}
      <div className="animate-in fade-in duration-200">
        <SynergyFrictionGraphWeb
          archetypes={CHROMATIC_ARCHETYPES}
          harmonicPairs={HARMONIC_PAIRS}
          onOpenChromaticTest={onOpenChromaticTest}
        />
      </div>
    </div>
  );
};
