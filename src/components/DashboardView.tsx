import React from 'react';
import { Zap, Infinity as InfinityIcon, Scale, SlidersHorizontal, Sparkles, Palette, ArrowRight, Brain, Globe, Heart, Briefcase } from 'lucide-react';
import { UserProfile, EngineTier } from '../types';
import { getColorIdentity, deriveColorIdentityFromProfile } from '../lib/colorSystem';

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
  // Derived from the signed-in user's own profile scores, not a static id lookup
  const userColor = React.useMemo(
    () => deriveColorIdentityFromProfile(currentUser),
    [currentUser.executionScore, currentUser.capabilityScore, currentUser.resonanceScore, currentUser.ocean]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Your Prism Signature
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 max-w-2xl">
            A pure chromatic spectrum expressing your strategic velocity, cognitive architecture, and ethical resonance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600">Active Spectrum:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
            {userColor.harmonicTitle}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (8 cols): Large Global Synergy Ring + 3 Metric Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visual Display Card with User's Chromatic Aura */}
          <div className="bg-gradient-to-b from-stone-100/90 to-stone-200/60 border border-stone-200/90 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px] shadow-xs relative overflow-hidden">
            {/* Ambient concentric background glow using user's colors */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
              <div
                className="w-96 h-96 rounded-full border animate-pulse"
                style={{ borderColor: `${userColor.primaryColor}20` }}
              />
              <div
                className="w-80 h-80 rounded-full border absolute"
                style={{ borderColor: `${userColor.secondaryColor}20` }}
              />
              <div
                className="w-64 h-64 rounded-full border absolute"
                style={{ borderColor: `${userColor.spectrumBars[2]?.color ?? '#059669'}20` }}
              />
            </div>

            {/* Central User Chromatic Spectrum Orb */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 shadow-xl flex items-center justify-center hover:scale-105 transition-transform duration-500"
                style={{
                  background: `linear-gradient(to top right, ${userColor.primaryColor}, ${userColor.secondaryColor}, ${userColor.spectrumBars[2]?.color ?? '#059669'})`
                }}
              >
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden">
                  {/* Subtle inner chromatic gradient fill */}
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{ background: userColor.bgGradient }}
                  />

                  {/* Multi-color orb visual from user's spectrum */}
                  <div className="flex items-center gap-1.5 mb-2">
                    {userColor.spectrumBars.slice(0, 4).map((bar, i) => (
                      <span
                        key={bar.name}
                        className={`rounded-full shadow-sm ${i === 1 ? 'w-4 h-4 animate-pulse' : 'w-3.5 h-3.5'} ${i === 0 ? 'animate-bounce' : ''}`}
                        style={{ backgroundColor: bar.color, animationDuration: i === 0 ? '1.5s' : undefined }}
                      />
                    ))}
                  </div>

                  <span className="text-xs sm:text-sm font-black text-stone-900 tracking-wide uppercase">
                    {userColor.primaryName}
                  </span>
                  <span
                    className="mt-1 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase"
                    style={{ color: userColor.primaryColor }}
                  >
                    {userColor.harmonicTitle}
                  </span>
                  <span className="mt-0.5 text-[8px] sm:text-[9px] font-semibold text-stone-400 uppercase tracking-widest">
                    {userColor.toneDescription}
                  </span>
                </div>
              </div>

              {/* User's Spectrum Color Channels */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-stone-700">
                {userColor.spectrumBars.map((bar) => (
                  <div
                    key={bar.name}
                    className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full border border-stone-200 shadow-xs"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: bar.color }}
                    />
                    <span>{bar.name}</span>
                    <span className="text-[10px] text-stone-400">({bar.intensity})</span>
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
