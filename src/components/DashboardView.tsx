import React from 'react';
import { Zap, Infinity as InfinityIcon, Scale, SlidersHorizontal, Sparkles, Palette, ArrowRight, Brain, Globe, Heart, Briefcase } from 'lucide-react';
import { UserProfile, EngineTier } from '../types';
import { getColorIdentity } from '../lib/colorSystem';

interface DashboardViewProps {
  currentUser: UserProfile;
  quickMatches: UserProfile[];
  onSelectCandidate: (candidate: UserProfile) => void;
  onOpenNetworkModal: () => void;
  onOpenCustomMatch: () => void;
  onNavigateToColors?: () => void;
  onNavigateToMaps?: (tier?: EngineTier) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  quickMatches,
  onSelectCandidate,
  onOpenNetworkModal,
  onNavigateToColors,
  onNavigateToMaps
}) => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Your Profile
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 max-w-2xl">
            Everything the matching engine reads about you: who you are, what you offer, what you need, and how you work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600">Looking for:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-stone-800 animate-pulse" />
            {currentUser.subMode.replace(/_/g, ' ')}
          </span>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (8 cols): Large Global Synergy Ring + 3 Metric Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Summary Card */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <img
                src={currentUser.avatar}
                alt={`${currentUser.name}'s profile photo`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-200 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                    {currentUser.name}
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-600 tracking-wide">
                    {currentUser.tier}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-600 tracking-wide">
                    {currentUser.subMode.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-stone-700">{currentUser.title}</p>
                <p className="text-xs text-stone-500">{currentUser.location}</p>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">{currentUser.bio}</p>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Availability', value: `${currentUser.availabilityHoursPerWeek} hrs/wk` },
                    { label: 'Response', value: currentUser.communicationLatency },
                    { label: 'Risk Appetite', value: currentUser.riskTolerance },
                    { label: 'Verified', value: new Date(currentUser.verifiedAt).toLocaleDateString() }
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        {item.label}
                      </div>
                      <div className="mt-0.5 text-xs font-semibold text-stone-800 truncate">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: 'Offers', items: currentUser.needsOffers.offers },
                { label: 'Needs', items: currentUser.needsOffers.needs },
                { label: 'Domains', items: currentUser.needsOffers.domains }
              ].map((group) => (
                <div key={group.label}>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    {group.label}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.items.length === 0 ? (
                      <span className="text-xs text-stone-400">Not set yet</span>
                    ) : (
                      group.items.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-semibold text-stone-700"
                        >
                          {item}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Personality Profile
              </h3>
              <div className="mt-3 space-y-2.5">
                {[
                  { name: 'Openness', value: currentUser.ocean.openness, note: 'Curiosity for new ideas and approaches' },
                  { name: 'Conscientiousness', value: currentUser.ocean.conscientiousness, note: 'Follow-through and structure' },
                  { name: 'Extraversion', value: currentUser.ocean.extraversion, note: 'Energy drawn from people and momentum' },
                  { name: 'Agreeableness', value: currentUser.ocean.agreeableness, note: 'Cooperation and trust in teams' },
                  { name: 'Emotional Stability', value: 100 - currentUser.ocean.neuroticism, note: 'Steadiness under pressure' }
                ].map((trait) => (
                  <div key={trait.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-800">{trait.name}</span>
                      <span className="font-bold text-stone-500">{Math.round(trait.value)}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-stone-800"
                        style={{ width: `${Math.max(0, Math.min(100, trait.value))}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-stone-400">{trait.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* 3 Metric Cards in a Row - Expressed PURELY in Rich Color Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. SOLAR CHANNEL (Gold / Amber) */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  {/* Color Swatch Badge */}
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                    Solar Gold
                  </span>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  EXECUTION SPECTRUM
                </h3>
                <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                  Strategic velocity, momentum, and rapid execution drive.
                </p>
              </div>
              {/* Pure Color Gradient Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 mb-1">
                  <span>Pure Hue</span>
                  <span>Luminous Gold</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-[#D97706] shadow-xs" />
              </div>
            </div>

            {/* 2. NEXUS CHANNEL (Deep Teal / Cyan) */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0A6275] flex items-center justify-center">
                    <InfinityIcon className="w-4 h-4" />
                  </div>
                  {/* Color Swatch Badge */}
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-900 border border-teal-500/30 text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0A6275]" />
                    Deep Teal
                  </span>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  CAPABILITY SPECTRUM
                </h3>
                <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                  Cognitive architecture, systems mastery, and adaptability.
                </p>
              </div>
              {/* Pure Color Gradient Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-[10px] font-bold text-teal-900 mb-1">
                  <span>Pure Hue</span>
                  <span>Oceanic Teal</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-cyan-200 via-teal-400 to-[#0A6275] shadow-xs" />
              </div>
            </div>

            {/* 3. RESONANCE CHANNEL (Verdant Emerald / Green) */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  {/* Color Swatch Badge */}
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-500/30 text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#059669]" />
                    Verdant Green
                  </span>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  RESONANCE SPECTRUM
                </h3>
                <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                  Philosophical alignment, trust, and ethical governance.
                </p>
              </div>
              {/* Pure Color Gradient Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-900 mb-1">
                  <span>Pure Hue</span>
                  <span>Emerald Radiance</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-200 via-emerald-400 to-[#059669] shadow-xs" />
              </div>
            </div>
          </div>

          {/* Dedicated Color System & Behavioral Science Banner Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span>Matchwise Chromatic Behavioral Model</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100/70 text-[#D97706]">
                    OKLCH Science
                  </span>
                </h4>
                <p className="text-xs text-stone-500 max-w-xl">
                  Learn how perceptual color frequencies define execution speed, systems thinking, empathy, and visionary intuition across team dynamics.
                </p>
              </div>
            </div>

            {onNavigateToColors && (
              <button
                onClick={onNavigateToColors}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
                id="dashboard-explore-color-system-btn"
              >
                <span>Explore Color System</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>

          {/* 3 Types of Maps Spatial Grid Banner */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                    Spatial Constellation Grid
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-white">
                  3 Purpose-Aligned Maps
                </h3>
                <p className="text-xs text-stone-300 max-w-lg">
                  Explore global nodes across Personal, Professional, and Collaborative spatial cartographies with sub-purpose filtering.
                </p>
              </div>

              {onNavigateToMaps && (
                <button
                  onClick={() => onNavigateToMaps()}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
                  id="dashboard-open-maps-btn"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Launch Maps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={() => onNavigateToMaps && onNavigateToMaps('PERSONAL')}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Personal Map</span>
                </div>
                <p className="text-[11px] text-stone-300">Dating, friendship & activity partners</p>
              </button>

              <button
                onClick={() => onNavigateToMaps && onNavigateToMaps('PROFESSIONAL')}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Professional Map</span>
                </div>
                <p className="text-[11px] text-stone-300">Networking, mentorship & study cohorts</p>
              </button>

              <button
                onClick={() => onNavigateToMaps && onNavigateToMaps('COLLABORATIVE')}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Collaborative Map</span>
                </div>
                <p className="text-[11px] text-stone-300">Hackathon squads & venture co-founders</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Matches Card with Color Spectrum Identifiers */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <h2 className="text-base font-bold text-stone-900">
                    Resonant Colors
                  </h2>
                </div>
                <button
                  onClick={onOpenNetworkModal}
                  className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label="Filter quick matches"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Match Items List with Pure Color Identifiers */}
              <div className="mt-3 divide-y divide-stone-100">
                {quickMatches.map((profile) => {
                  const profColor = getColorIdentity(profile.id);

                  return (
                    <div
                      key={profile.id}
                      onClick={() => onSelectCandidate(profile)}
                      className="py-3.5 flex items-center justify-between hover:bg-stone-50/80 px-2 rounded-xl transition-all cursor-pointer group"
                      id={`quick-match-card-${profile.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-10 h-10 rounded-full object-cover ring-2"
                            style={{ borderColor: profColor.primaryColor }}
                            referrerPolicy="no-referrer"
                          />
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: profColor.primaryColor }}
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                            {profile.name}
                          </h4>
                          <p className="text-[11px] text-stone-400">
                            {profile.title}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs"
                          style={{
                            backgroundColor: `${profColor.primaryColor}15`,
                            color: profColor.primaryColor,
                            borderColor: `${profColor.primaryColor}30`
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: profColor.primaryColor }}
                          />
                          {profColor.primaryName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 border-t border-stone-100 mt-6">
              <button
                onClick={onOpenNetworkModal}
                className="w-full py-2.5 px-4 bg-[#EAECEF] hover:bg-[#DFE2E7] text-stone-800 text-xs font-semibold rounded-xl transition-colors text-center"
                id="view-complete-network-btn"
              >
                View Full Chromatic Network
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
