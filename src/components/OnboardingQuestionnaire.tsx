import React, { useMemo, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  Palette,
  Users,
} from 'lucide-react';
import { UserProfile } from '../types';
import { MOCK_PROFILES } from '../data/mockData';
import { deriveColorIdentityFromProfile, saveUserCustomColorIdentity, ColorIdentity } from '../lib/colorSystem';
import {
  RankedColorMatchCandidate,
  rankCandidatesByColorMatch,
  loadSwipes,
  saveSwipes,
  saveConnection,
  getStoredConnections,
  MATCH_VERSION,
  candidateTags,
  SwipeRecord,
} from '../lib/discovery';
import {
  ConnectionGoal,
  DEFAULT_FEATURES,
  GOAL_TO_SUBMODE,
  MATCH_FEATURES_STORAGE_KEY,
  MatchFeatures,
} from '../lib/onboardingStorage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  candidatePool?: UserProfile[];
  onComplete: (updated: UserProfile, features: MatchFeatures) => void;
}

const GOALS: { id: ConnectionGoal; label: string }[] = [
  { id: 'FRIENDSHIP', label: 'Friendship' },
  { id: 'DATING', label: 'Dating' },
  { id: 'STUDY_PARTNERS', label: 'Study partners' },
  { id: 'HACKATHON_TEAMS', label: 'Hackathon / project teams' },
  { id: 'GAMING', label: 'Gaming partners' },
  { id: 'NETWORKING', label: 'Networking' },
  { id: 'MENTORSHIP', label: 'Mentorship' },
];

const INTEREST_GROUPS: { group: string; items: string[] }[] = [
  { group: 'Tech & Creativity', items: ['Programming', 'AI / ML', 'Design', 'Photography', 'Writing', 'Music', 'Film'] },
  { group: 'Play', items: ['Gaming', 'Esports', 'Board games', 'Anime', 'Cosplay'] },
  { group: 'Body & Outdoors', items: ['Sports', 'Gym', 'Running', 'Hiking', 'Travel'] },
  { group: 'Mind', items: ['Reading', 'Startups', 'Finance', 'Languages', 'Volunteering'] },
];

const VALUES = ['Career Growth', 'Family', 'Learning', 'Adventure', 'Creativity', 'Stability', 'Impact', 'Independence'];
const CHANNELS = ['Text', 'Voice call', 'Video call', 'In person'];
const CONVO = ['Small talk', 'Deep conversation', 'Balanced'];
const REPLY = ['Immediate', 'Within hours', 'Daily'];

const TEAM_ROLES = ['Leader', 'Supporter', 'Organizer', 'Idea generator'];
const SKILLS = ['Frontend', 'Backend', 'Mobile', 'Design / UX', 'Data / ML', 'Product', 'Marketing', 'Research'];
const CREATIVITY_ROLES = ['Idea generator', 'Refiner', 'Executor', 'Critic'];
const EXPERIENCE = ['Beginner', 'Intermediate', 'Advanced', 'Mentor'];

const SLEEP = ['Morning person', 'Night owl', 'Flexible'];
const EXERCISE = ['Everyday', 'Often', 'Sometimes', 'Never'];
const WORK_STYLE = ['Deep focus blocks', 'Short sprints', 'Pair working', 'Async solo'];
const SOCIAL_ENERGY = ['Recharge alone', 'Recharge with people', 'Depends on the day'];

const DAYS = ['Weekdays', 'Weekends'];
const TIME_BLOCKS = ['Early morning', 'Morning', 'Afternoon', 'Evening', 'Late night'];
const LANGUAGES = ['English', 'Burmese', 'Mandarin', 'Japanese', 'Korean', 'Thai', 'Spanish', 'French'];

const OCEAN_ITEMS: { key: keyof MatchFeatures['ocean']; label: string; hint: string; color: string }[] = [
  { key: 'openness', label: 'Openness', hint: 'Curiosity for new ideas and experiments', color: '#0A6275' },
  { key: 'conscientiousness', label: 'Conscientiousness', hint: 'Structure, follow-through and deadlines', color: '#D97706' },
  { key: 'extraversion', label: 'Extraversion', hint: 'Energy from group interaction', color: '#7C3AED' },
  { key: 'agreeableness', label: 'Agreeableness', hint: 'Cooperation and trust in conflict', color: '#059669' },
  { key: 'neuroticism', label: 'Emotional reactivity', hint: 'Sensitivity to stress and pressure', color: '#DC2626' },
];

type StepId =
  | 'identity'
  | 'goals'
  | 'interests'
  | 'values'
  | 'communication'
  | 'personality'
  | 'complementarity'
  | 'lifestyle'
  | 'availability'
  | 'constraints'
  | 'review'
  | 'discovery';

const STEPS: { id: StepId; title: string; subtitle: string; skippable: boolean }[] = [
  { id: 'identity', title: 'Tell us who you are', subtitle: 'This is the identity shown on your Prism dossier and match cards.', skippable: false },
  { id: 'goals', title: 'What are you looking for?', subtitle: 'Each connection type uses different scoring weights.', skippable: false },
  { id: 'interests', title: 'What are you into?', subtitle: 'Pick up to 10 interests. Scored with Jaccard similarity (30%).', skippable: true },
  { id: 'values', title: 'What matters most to you?', subtitle: 'Shared values and goals carry 15% of the similarity score.', skippable: true },
  { id: 'communication', title: "How do you communicate?", subtitle: 'Channel, depth and reply speed — 15% of the score.', skippable: true },
  { id: 'personality', title: 'A few things about you', subtitle: 'Big Five (OCEAN) traits — 25% of the score.', skippable: false },
  { id: 'complementarity', title: 'How do you work with others?', subtitle: 'Complementary roles and skills, weighted by connection type.', skippable: true },
  { id: 'lifestyle', title: "Let's talk lifestyle habits", subtitle: 'Rhythm and energy compatibility — 10%.', skippable: true },
  { id: 'availability', title: 'When are you free?', subtitle: 'Overlapping schedules — 5%.', skippable: true },
  { id: 'constraints', title: 'Your matching boundaries', subtitle: 'Hard rules that filter or penalise matches.', skippable: true },
  { id: 'review', title: 'Your matching profile', subtitle: 'This feeds directly into your chromatic spectrum & resonance matrix.', skippable: false },
  { id: 'discovery', title: 'Discover & Connect', subtitle: 'Your top recommendations ranked strictly by pure Chromatic Color Match.', skippable: true },
];

const Pill: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm transition-all border ${
      active
        ? 'bg-[#D97706]/10 border-[#D97706] text-[#92400E] font-semibold'
        : 'bg-stone-100 border-transparent text-stone-600 hover:bg-stone-200'
    }`}
  >
    {children}
  </button>
);

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-stone-100 border border-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#D97706] transition-colors';

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-bold text-stone-800 mb-2.5">{children}</h3>
);

export const OnboardingQuestionnaire: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  candidatePool = MOCK_PROFILES,
  onComplete,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [f, setF] = useState<MatchFeatures>(() => {
    try {
      const saved = localStorage.getItem(MATCH_FEATURES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_FEATURES,
          ...parsed,
          identity: { ...DEFAULT_FEATURES.identity, ...(parsed.identity ?? {}) },
        };
      }
    } catch { /* ignore */ }
    return {
      ...DEFAULT_FEATURES,
      ocean: { ...currentUser.ocean },
      identity: {
        ...DEFAULT_FEATURES.identity,
        name: currentUser.name ?? '',
        title: currentUser.title ?? '',
        location: currentUser.location ?? '',
        bio: currentUser.bio ?? '',
        avatar: currentUser.avatar ?? '',
      },
    };
  });

  // Discovery swipes and connection state
  const [swipes, setSwipes] = useState<SwipeRecord[]>(() => loadSwipes());
  const [connections, setConnections] = useState<string[]>(() => getStoredConnections());

  const step = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const toggle = (list: string[], value: string, max?: number) =>
    list.includes(value)
      ? list.filter(v => v !== value)
      : max && list.length >= max
        ? list
        : [...list, value];

  const canContinue = useMemo(() => {
    if (step.id === 'identity') return f.identity.name.trim().length > 1;
    if (step.id === 'goals') return f.connectionGoals.length > 0;
    return true;
  }, [step.id, f.connectionGoals, f.identity.name]);

  // Dynamically compute the updated profile from current questionnaire state
  const computedUser = useMemo<UserProfile>(() => {
    const primaryGoal = f.connectionGoals[0];
    const execution = Math.round(f.ocean.conscientiousness * 0.7 + f.ocean.openness * 0.3);
    const capability = Math.round(f.ocean.openness * 0.6 + f.ocean.conscientiousness * 0.4);
    const resonance = Math.round(f.ocean.agreeableness * 0.7 + (100 - f.ocean.neuroticism) * 0.3);

    const identity = f.identity;
    return {
      ...currentUser,
      name: identity.name.trim() || currentUser.name,
      title: identity.title.trim() || currentUser.title,
      location: identity.location.trim() || currentUser.location,
      bio: identity.bio.trim() || currentUser.bio,
      avatar: identity.avatar.trim() || currentUser.avatar,
      ocean: f.ocean,
      subMode: primaryGoal ? GOAL_TO_SUBMODE[primaryGoal] : currentUser.subMode,
      availabilityHoursPerWeek: f.availability.hoursPerWeek,
      communicationLatency: f.communication.replySpeed || currentUser.communicationLatency,
      needsOffers: {
        ...currentUser.needsOffers,
        offers: f.complementarity.skills.length ? f.complementarity.skills : currentUser.needsOffers.offers,
        domains: f.interests.length ? f.interests : currentUser.needsOffers.domains,
      },
      constraints: {
        ...currentUser.constraints,
        languages: f.constraints.languages,
        minAge: f.constraints.minAge,
        maxAge: f.constraints.maxAge,
        maxDistanceKm: f.constraints.maxDistanceKm,
        connectionGoals: f.connectionGoals,
      },
      executionScore: execution,
      capabilityScore: capability,
      resonanceScore: resonance,
      spectrum: {
        ...currentUser.spectrum,
        solarResonance: execution,
        deepTealAnchor: capability,
        verdantSpark: resonance,
        globalSynergyScore: Math.round((execution + capability + resonance) / 3),
      },
    };
  }, [f, currentUser]);

  const userColorIdentity = useMemo(() => deriveColorIdentityFromProfile(computedUser), [computedUser]);

  // Candidate queue ranked strictly by Color Match
  const colorMatchQueue = useMemo(
    () => rankCandidatesByColorMatch(computedUser, candidatePool, swipes),
    [computedUser, candidatePool, swipes]
  );

  const topCandidate = colorMatchQueue[0];
  const upcomingCandidates = colorMatchQueue.slice(1, 3);

  const handleSwipeAction = (candidate: UserProfile, action: 'like' | 'pass') => {
    const nextSwipes: SwipeRecord[] = [
      ...swipes,
      {
        candidateId: candidate.id,
        action,
        context: 'COLLABORATE',
        at: new Date().toISOString(),
        matchVersion: MATCH_VERSION,
        tags: candidateTags(candidate),
      },
    ];
    setSwipes(nextSwipes);
    saveSwipes(nextSwipes);

    if (action === 'like') {
      const updatedConnections = saveConnection(candidate.id);
      setConnections(updatedConnections);
    }
  };

  const handleUndoSwipe = () => {
    if (!swipes.length) return;
    const next = swipes.slice(0, -1);
    setSwipes(next);
    saveSwipes(next);
    setConnections(getStoredConnections());
  };

  if (!isOpen) return null;

  const finish = () => {
    const features: MatchFeatures = { ...f, completedAt: new Date().toISOString() };
    try {
      localStorage.setItem(MATCH_FEATURES_STORAGE_KEY, JSON.stringify(features));
    } catch { /* ignore */ }

    const primaryGoal = features.connectionGoals[0];
    const execution = Math.round(features.ocean.conscientiousness * 0.7 + features.ocean.openness * 0.3);
    const capability = Math.round(features.ocean.openness * 0.6 + features.ocean.conscientiousness * 0.4);
    const resonance = Math.round(features.ocean.agreeableness * 0.7 + (100 - features.ocean.neuroticism) * 0.3);

    const identity = features.identity;
    const updated: UserProfile = {
      ...currentUser,
      name: identity.name.trim() || currentUser.name,
      title: identity.title.trim() || currentUser.title,
      location: identity.location.trim() || currentUser.location,
      bio: identity.bio.trim() || currentUser.bio,
      avatar: identity.avatar.trim() || currentUser.avatar,
      ocean: features.ocean,
      subMode: primaryGoal ? GOAL_TO_SUBMODE[primaryGoal] : currentUser.subMode,
      availabilityHoursPerWeek: features.availability.hoursPerWeek,
      communicationLatency: features.communication.replySpeed || currentUser.communicationLatency,
      needsOffers: {
        ...currentUser.needsOffers,
        offers: features.complementarity.skills.length ? features.complementarity.skills : currentUser.needsOffers.offers,
        domains: features.interests.length ? features.interests : currentUser.needsOffers.domains,
      },
      constraints: {
        ...currentUser.constraints,
        languages: features.constraints.languages,
        minAge: features.constraints.minAge,
        maxAge: features.constraints.maxAge,
        maxDistanceKm: features.constraints.maxDistanceKm,
        connectionGoals: features.connectionGoals,
      },
      executionScore: execution,
      capabilityScore: capability,
      resonanceScore: resonance,
      spectrum: {
        ...currentUser.spectrum,
        solarResonance: execution,
        deepTealAnchor: capability,
        verdantSpark: resonance,
        globalSynergyScore: Math.round((execution + capability + resonance) / 3),
      },
    };

    const colorIdentity = deriveColorIdentityFromProfile(updated);
    saveUserCustomColorIdentity(updated.id, colorIdentity);
    saveUserCustomColorIdentity('user-current-alex', colorIdentity);

    onComplete(updated, features);
    onClose();
  };

  const next = () => (stepIndex === STEPS.length - 1 ? finish() : setStepIndex(i => i + 1));
  const back = () => (stepIndex === 0 ? onClose() : setStepIndex(i => i - 1));

  const setIdentity = (patch: Partial<MatchFeatures['identity']>) =>
    setF({ ...f, identity: { ...f.identity, ...patch } });

  const renderStep = () => {
    switch (step.id) {
      case 'identity':
        return (
          <div className="space-y-5">
            <div>
              <SectionLabel>Full name *</SectionLabel>
              <input
                type="text"
                value={f.identity.name}
                onChange={e => setIdentity({ name: e.target.value })}
                placeholder="Alex Mercer"
                className={inputClass}
              />
            </div>
            <div>
              <SectionLabel>Headline / role</SectionLabel>
              <input
                type="text"
                value={f.identity.title}
                onChange={e => setIdentity({ title: e.target.value })}
                placeholder="Design Technologist"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <SectionLabel>Location</SectionLabel>
                <input
                  type="text"
                  value={f.identity.location}
                  onChange={e => setIdentity({ location: e.target.value })}
                  placeholder="San Francisco, CA"
                  className={inputClass}
                />
              </div>
              <div>
                <SectionLabel>Age</SectionLabel>
                <input
                  type="number"
                  min={13}
                  max={100}
                  value={f.identity.age ?? ''}
                  onChange={e => setIdentity({ age: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="28"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <SectionLabel>Short bio</SectionLabel>
              <textarea
                rows={4}
                value={f.identity.bio}
                onChange={e => setIdentity({ bio: e.target.value })}
                placeholder="What you build, what you're looking for, and how you like to collaborate."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <SectionLabel>Avatar image URL</SectionLabel>
              <div className="flex items-center gap-3">
                {f.identity.avatar ? (
                  <img src={f.identity.avatar} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border border-stone-200" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-sm font-bold text-stone-400">
                    {f.identity.name.trim().charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <input
                  type="url"
                  value={f.identity.avatar}
                  onChange={e => setIdentity({ avatar: e.target.value })}
                  placeholder="https://…"
                  className={`${inputClass} flex-1`}
                />
              </div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(g => {
              const active = f.connectionGoals.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setF({ ...f, connectionGoals: toggle(f.connectionGoals, g.id) as ConnectionGoal[] })}
                  className={`h-24 rounded-2xl text-sm text-left p-4 border transition-all ${
                    active
                      ? 'border-[#D97706] bg-[#D97706]/10 text-[#92400E] font-semibold'
                      : 'border-transparent bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-6">
            {INTEREST_GROUPS.map(grp => (
              <div key={grp.group}>
                <SectionLabel>{grp.group}</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {grp.items.map(item => (
                    <Pill
                      key={item}
                      active={f.interests.includes(item)}
                      onClick={() => setF({ ...f, interests: toggle(f.interests, item, 10) })}
                    >
                      {item}
                    </Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'values':
        return (
          <div className="flex flex-wrap gap-2">
            {VALUES.map(v => (
              <Pill key={v} active={f.values.includes(v)} onClick={() => setF({ ...f, values: toggle(f.values, v, 5) })}>
                {v}
              </Pill>
            ))}
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Preferred channels</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map(c => (
                  <Pill
                    key={c}
                    active={f.communication.channels.includes(c)}
                    onClick={() => setF({ ...f, communication: { ...f.communication, channels: toggle(f.communication.channels, c) } })}
                  >
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Conversation preference</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {CONVO.map(c => (
                  <Pill
                    key={c}
                    active={f.communication.conversationPreference === c}
                    onClick={() => setF({ ...f, communication: { ...f.communication, conversationPreference: c } })}
                  >
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Reply speed</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {REPLY.map(c => (
                  <Pill
                    key={c}
                    active={f.communication.replySpeed === c}
                    onClick={() => setF({ ...f, communication: { ...f.communication, replySpeed: c } })}
                  >
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        );

      case 'personality':
        return (
          <div className="space-y-5">
            {OCEAN_ITEMS.map(item => (
              <div key={String(item.key)}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <div className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      {item.label}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{item.hint}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{f.ocean[item.key]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={f.ocean[item.key]}
                  onChange={e => setF({ ...f, ocean: { ...f.ocean, [item.key]: parseInt(e.target.value) } })}
                  className="w-full"
                  style={{ accentColor: item.color }}
                />
              </div>
            ))}
          </div>
        );

      case 'complementarity':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Your team role</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {TEAM_ROLES.map(r => (
                  <Pill key={r} active={f.complementarity.teamRole === r} onClick={() => setF({ ...f, complementarity: { ...f.complementarity, teamRole: r } })}>{r}</Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Skills you bring</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(s => (
                  <Pill key={s} active={f.complementarity.skills.includes(s)} onClick={() => setF({ ...f, complementarity: { ...f.complementarity, skills: toggle(f.complementarity.skills, s) } })}>{s}</Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>In a creative process you are</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {CREATIVITY_ROLES.map(s => (
                  <Pill key={s} active={f.complementarity.creativityRole === s} onClick={() => setF({ ...f, complementarity: { ...f.complementarity, creativityRole: s } })}>{s}</Pill>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Experience level</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE.map(s => (
                  <Pill key={s} active={f.complementarity.experienceLevel === s} onClick={() => setF({ ...f, complementarity: { ...f.complementarity, experienceLevel: s } })}>{s}</Pill>
                ))}
              </div>
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Sleep schedule</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {SLEEP.map(s => <Pill key={s} active={f.lifestyle.sleepSchedule === s} onClick={() => setF({ ...f, lifestyle: { ...f.lifestyle, sleepSchedule: s } })}>{s}</Pill>)}
              </div>
            </div>
            <div>
              <SectionLabel>Exercise frequency</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {EXERCISE.map(s => <Pill key={s} active={f.lifestyle.exerciseFrequency === s} onClick={() => setF({ ...f, lifestyle: { ...f.lifestyle, exerciseFrequency: s } })}>{s}</Pill>)}
              </div>
            </div>
            <div>
              <SectionLabel>Work style</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {WORK_STYLE.map(s => <Pill key={s} active={f.lifestyle.workStyle === s} onClick={() => setF({ ...f, lifestyle: { ...f.lifestyle, workStyle: s } })}>{s}</Pill>)}
              </div>
            </div>
            <div>
              <SectionLabel>Social energy</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_ENERGY.map(s => <Pill key={s} active={f.lifestyle.socialEnergy === s} onClick={() => setF({ ...f, lifestyle: { ...f.lifestyle, socialEnergy: s } })}>{s}</Pill>)}
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Days</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(d => <Pill key={d} active={f.availability.days.includes(d)} onClick={() => setF({ ...f, availability: { ...f.availability, days: toggle(f.availability.days, d) } })}>{d}</Pill>)}
              </div>
            </div>
            <div>
              <SectionLabel>Time blocks</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {TIME_BLOCKS.map(d => <Pill key={d} active={f.availability.timeBlocks.includes(d)} onClick={() => setF({ ...f, availability: { ...f.availability, timeBlocks: toggle(f.availability.timeBlocks, d) } })}>{d}</Pill>)}
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-stone-800 mb-1.5">
                <span>Hours available per week</span>
                <span className="text-[#D97706]">{f.availability.hoursPerWeek} hrs</span>
              </div>
              <input
                type="range" min={1} max={40}
                value={f.availability.hoursPerWeek}
                onChange={e => setF({ ...f, availability: { ...f.availability, hoursPerWeek: parseInt(e.target.value) } })}
                className="w-full accent-[#D97706]"
              />
            </div>
          </div>
        );

      case 'constraints':
        return (
          <div className="space-y-6">
            <div>
              <SectionLabel>Languages you can connect in</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => (
                  <Pill key={l} active={f.constraints.languages.includes(l)} onClick={() => setF({ ...f, constraints: { ...f.constraints, languages: toggle(f.constraints.languages, l) } })}>{l}</Pill>
                ))}
              </div>
              <p className="text-xs text-stone-500 mt-2">No shared language eliminates a match entirely.</p>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-stone-800 mb-1.5">
                <span>Age preference</span>
                <span className="text-[#D97706]">{f.constraints.minAge}–{f.constraints.maxAge}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="range" min={18} max={80} value={f.constraints.minAge}
                  onChange={e => setF({ ...f, constraints: { ...f.constraints, minAge: Math.min(parseInt(e.target.value), f.constraints.maxAge) } })}
                  className="w-full accent-[#D97706]" />
                <input type="range" min={18} max={80} value={f.constraints.maxAge}
                  onChange={e => setF({ ...f, constraints: { ...f.constraints, maxAge: Math.max(parseInt(e.target.value), f.constraints.minAge) } })}
                  className="w-full accent-[#D97706]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-stone-800 mb-1.5">
                <span>Distance preference</span>
                <span className="text-[#D97706]">{f.constraints.maxDistanceKm} km</span>
              </div>
              <input type="range" min={5} max={500} step={5} value={f.constraints.maxDistanceKm}
                onChange={e => setF({ ...f, constraints: { ...f.constraints, maxDistanceKm: parseInt(e.target.value) } })}
                className="w-full accent-[#D97706]" />
              <label className="flex items-center gap-2 mt-3 text-sm text-stone-600">
                <input type="checkbox" checked={f.constraints.locationFlexible}
                  onChange={e => setF({ ...f, constraints: { ...f.constraints, locationFlexible: e.target.checked } })}
                  className="accent-[#D97706] w-4 h-4" />
                Remote-friendly — distance is a soft penalty, not a hard filter
              </label>
            </div>
          </div>
        );

      case 'review': {
        const rows: [string, string][] = [
          ['Identity', [f.identity.name, f.identity.title, f.identity.location, f.identity.age ? `${f.identity.age}` : ''].filter(Boolean).join(' · ') || '—'],
          ['Connection goals', f.connectionGoals.map(g => GOALS.find(x => x.id === g)?.label).join(', ') || '—'],
          ['Interests (30%)', f.interests.join(', ') || '—'],
          ['Values (15%)', f.values.join(', ') || '—'],
          ['Communication (15%)', [f.communication.conversationPreference, f.communication.replySpeed, ...f.communication.channels].filter(Boolean).join(' · ') || '—'],
          ['Personality (25%)', OCEAN_ITEMS.map(i => `${i.label.slice(0, 4)} ${f.ocean[i.key]}`).join(' · ')],
          ['Complementarity', [f.complementarity.teamRole, f.complementarity.experienceLevel, ...f.complementarity.skills].filter(Boolean).join(' · ') || '—'],
          ['Lifestyle (10%)', Object.values(f.lifestyle).filter(Boolean).join(' · ') || '—'],
          ['Availability (5%)', [...f.availability.days, ...f.availability.timeBlocks, `${f.availability.hoursPerWeek} hrs/wk`].join(' · ')],
          ['Constraints', `${f.constraints.languages.join(', ') || '—'} · ${f.constraints.minAge}–${f.constraints.maxAge} · ${f.constraints.maxDistanceKm} km`],
        ];
        return (
          <div className="space-y-4">
            {/* Chromatic calculated banner */}
            <div
              className="p-4 rounded-2xl text-white shadow-xs"
              style={{ background: userColorIdentity.bgGradient || 'linear-gradient(135deg, #D97706, #0A6275)' }}
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                <Palette className="w-3.5 h-3.5" />
                <span>Your Generated Spectrum</span>
              </div>
              <h3 className="text-lg font-black mt-1 text-stone-900">
                {userColorIdentity.harmonicTitle}
              </h3>
              <p className="text-xs text-stone-700 mt-1">
                {userColorIdentity.toneDescription}
              </p>
            </div>

            <div className="space-y-2.5">
              {rows.map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">{k}</div>
                  <div className="text-sm text-stone-800 mt-0.5 break-words">{v}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-500 pt-1">
              Next: Experience real-time discovery recommendations ordered by your pure chromatic color resonance.
            </p>
          </div>
        );
      }

      case 'discovery': {
        return (
          <div className="space-y-4">
            {/* Connection badge summary */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-xs"
                  style={{ backgroundColor: userColorIdentity.primaryColor }}
                />
                <span>Your Signature: {userColorIdentity.primaryName}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-xs font-bold text-[#92400E]">
                <Users className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{connections.length} Connected</span>
              </div>
            </div>

            {/* Stacked Card Container */}
            <div className="relative h-[480px] sm:h-[510px]">
              {upcomingCandidates
                .slice()
                .reverse()
                .map((r, i) => (
                  <div
                    key={r.candidate.id}
                    className="absolute inset-x-0 top-0 h-full rounded-3xl border border-stone-200 bg-white shadow-sm"
                    style={{
                      transform: `translateY(${(upcomingCandidates.length - i) * 8}px) scale(${
                        1 - (upcomingCandidates.length - i) * 0.025
                      })`,
                      zIndex: i,
                    }}
                  />
                ))}

              <AnimatePresence mode="popLayout">
                {topCandidate ? (
                  <OnboardingSwipeCard
                    key={topCandidate.candidate.id}
                    ranked={topCandidate}
                    userColor={userColorIdentity}
                    onConnect={() => handleSwipeAction(topCandidate.candidate, 'like')}
                    onPass={() => handleSwipeAction(topCandidate.candidate, 'pass')}
                  />
                ) : (
                  <div className="absolute inset-0 rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-[#D97706] flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-stone-900 text-base">You've explored all top matches!</h3>
                    <p className="text-xs text-stone-500 max-w-xs">
                      You've made {connections.length} connection{connections.length === 1 ? '' : 's'}. You can always connect with more candidates anytime from your Dashboard and Maps.
                    </p>
                    <button
                      onClick={finish}
                      className="mt-2 px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-2"
                    >
                      <span>Proceed to Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Swipe Controls */}
            {topCandidate && (
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={() => handleSwipeAction(topCandidate.candidate, 'pass')}
                  aria-label="Pass"
                  className="w-13 h-13 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <button
                  onClick={handleUndoSwipe}
                  disabled={!swipes.length}
                  aria-label="Undo last swipe"
                  className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-400 hover:text-stone-800 disabled:opacity-40 transition-colors active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSwipeAction(topCandidate.candidate, 'like')}
                  aria-label="Connect"
                  className="w-13 h-13 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white" />
                </button>
              </div>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center sm:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-5 pt-5 pb-3 flex items-center gap-3 shrink-0">
          <button onClick={back} className="text-stone-700 p-1 -ml-1 hover:text-stone-900" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 h-1 rounded-full bg-stone-200 overflow-hidden">
            <div className="h-full bg-[#D97706] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          {step.skippable ? (
            <button onClick={next} className="text-sm font-semibold text-stone-500 hover:text-stone-800">
              Skip
            </button>
          ) : (
            <button onClick={onClose} className="text-sm font-semibold text-stone-400 hover:text-stone-700">
              Close
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight tracking-tight">
            {step.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-5">
            {step.subtitle}
          </p>
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 bg-white border-t border-stone-100 shrink-0">
          {step.id === 'discovery' ? (
            <button
              onClick={finish}
              className="w-full py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Complete Onboarding & Enter Dashboard</span>
            </button>
          ) : step.id === 'review' ? (
            <button
              onClick={next}
              disabled={!canContinue}
              className={`w-full py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                canContinue ? 'bg-[#D97706] text-white hover:bg-[#B45309]' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Chromatic Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!canContinue}
              className={`w-full py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                canContinue ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function OnboardingSwipeCard({
  ranked,
  userColor,
  onConnect,
  onPass,
}: {
  ranked: RankedColorMatchCandidate;
  userColor: ColorIdentity;
  onConnect: () => void;
  onPass: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const connectOpacity = useTransform(x, [30, 110], [0, 1]);
  const passOpacity = useTransform(x, [-110, -30], [1, 0]);
  const c = ranked.candidate;
  const match = ranked.colorMatch;

  return (
    <motion.article
      className="absolute inset-0 z-10 rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-md cursor-grab active:cursor-grabbing flex flex-col select-none"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={(_, info) => {
        if (info.offset.x > 110) onConnect();
        else if (info.offset.x < -110) onPass();
      }}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: 0, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22 }}
    >
      {/* Visual Stamps for gestures */}
      <motion.div
        style={{ opacity: connectOpacity }}
        className="absolute top-4 left-4 z-30 rounded-xl border-2 border-[#D97706] bg-white/95 backdrop-blur-xs px-3 py-1 text-xs font-black tracking-widest text-[#D97706] rotate-[-10deg] shadow-sm"
      >
        CONNECT
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-4 right-4 z-30 rounded-xl border-2 border-stone-600 bg-white/95 backdrop-blur-xs px-3 py-1 text-xs font-black tracking-widest text-stone-700 rotate-[10deg] shadow-sm"
      >
        PASS
      </motion.div>

      {/* Top Banner with Chromatic Gradient */}
      <div
        className="px-5 py-3.5 text-white shrink-0 shadow-inner"
        style={{ background: match.gradient }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-black/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
            {match.harmonicTitle}
          </span>
          <span className="text-xs font-black bg-white/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
            {match.score}% Color Match
          </span>
        </div>
      </div>

      {/* Candidate Profile Header */}
      <div className="p-4 border-b border-stone-100 flex items-center gap-3.5 bg-stone-50/60 shrink-0">
        <div className="relative shrink-0">
          <img
            src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={c.name || 'Candidate'}
            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white shadow-xs"
            referrerPolicy="no-referrer"
          />
          <span
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-xs"
            style={{ backgroundColor: match.colorB.primaryColor }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-stone-900 truncate">{c.name || 'Anonymous Peer'}</h4>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border"
              style={{
                backgroundColor: `${match.colorB.primaryColor}15`,
                color: match.colorB.primaryColor,
                borderColor: `${match.colorB.primaryColor}30`,
              }}
            >
              {match.colorB.primaryName}
            </span>
          </div>
          <p className="text-xs text-stone-600 truncate">{c.title || 'Prism Pioneer'}</p>
          <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-0.5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" /> {c.location || 'Global Node'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" /> {c.availabilityHoursPerWeek ?? 20}h/wk
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-left">
        {/* Spectrum Comparison */}
        <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center justify-between">
            <span>Spectral Synthesis</span>
            <span className="text-stone-700 font-semibold">{match.resonanceTier}</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">Your Color</span>
              <span className="font-bold text-stone-800">{userColor.primaryName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">{(c.name || 'Peer').split(' ')[0]}'s Color</span>
              <span className="font-bold text-stone-800">{match.colorB.primaryName}</span>
            </div>
          </div>
        </div>

        {/* Why this color match */}
        <div className="rounded-2xl bg-amber-500/5 p-3 border border-amber-500/15">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Why this color resonance?</span>
          </div>
          <ul className="space-y-1 text-xs text-stone-700">
            {match.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#D97706] font-bold shrink-0">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key capabilities */}
        {c.needsOffers?.offers?.length ? (
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Key Capabilities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.needsOffers.offers.slice(0, 4).map(o => (
                <span key={o} className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium">
                  {o}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
