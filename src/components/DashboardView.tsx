import React from 'react';
import { Zap, Infinity as InfinityIcon, Scale, SlidersHorizontal, Sparkles, Palette, ArrowRight, Brain, Globe, Heart, Briefcase } from 'lucide-react';
import { UserProfile, EngineTier } from '../types';
import { getColorIdentity } from '../lib/colorSystem';
import { getStoredConnections, MIN_COLOR_MATCH_SCORE } from '../lib/discovery';
import { ProfileHeroCard } from './ProfileHeroCard';

interface DashboardViewProps {
  currentUser: UserProfile;
  quickMatches: UserProfile[];
  candidatePool?: UserProfile[];
  connections?: string[];
  onSelectCandidate: (candidate: UserProfile) => void;
  onOpenNetworkModal: () => void;
  onOpenCustomMatch: () => void;
  onNavigateToColors?: () => void;
  onNavigateToMaps?: (tier?: EngineTier) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  quickMatches,
  candidatePool = [],
  connections = [],
  onSelectCandidate,
  onOpenNetworkModal,
  onNavigateToColors,
  onNavigateToMaps
}) => {
  const activeConnections = connections.length ? connections : getStoredConnections();
  const connectedProfiles = candidatePool.filter(c => activeConnections.includes(c.id));
  const [activeTab, setActiveTab] = React.useState<'connected' | 'pool'>(
    connectedProfiles.length > 0 ? 'connected' : 'pool'
  );

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
          {/* Chromatic dossier hero (swapped in from the profile page) */}
          <ProfileHeroCard profile={currentUser} />

          {/* Dedicated Color System & Behavioral Science Banner Card */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 text-white border border-stone-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.15),transparent_70%)] pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#D97706] text-xs font-bold uppercase tracking-wider">
                  <Palette className="w-4 h-4" />
                  <span>Five-Color Chromatic Engine</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Discover Your Full Spectral Resonance
                </h3>
                <p className="text-xs text-stone-300 max-w-xl">
                  Deep-dive into Solar Gold (Execution), Oceanic Teal (Systems Logic), Verdant Emerald (Empathy), Royal Amethyst (Vision), and Cobalt Blue (Reliability) archetype synergy matrices.
                </p>
              </div>
              {onNavigateToColors && (
                <button
                  onClick={onNavigateToColors}
                  className="px-4 py-2.5 bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-md group cursor-pointer"
                >
                  <span>Explore Color Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Three Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => onNavigateToMaps?.('PROFESSIONAL')}
              className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-[#D97706]/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-50 rounded-xl text-[#D97706]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                  TIER 1
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                Professional
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Hard skills, project deliverables & work styles.
              </p>
            </div>

            <div
              onClick={() => onNavigateToMaps?.('COLLABORATIVE')}
              className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-[#0A6275]/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-teal-50 rounded-xl text-[#0A6275]">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                  TIER 2
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#0A6275] transition-colors">
                Collaborative
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Communication cadence, working rhythm & latency.
              </p>
            </div>

            <div
              onClick={() => onNavigateToMaps?.('PERSONAL')}
              className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-[#059669]/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded-xl text-[#059669]">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                  TIER 3
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#059669] transition-colors">
                Personal
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Core values, passions, philosophy & vibe.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Connected / Resonant Pool Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Card Header & Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <h2 className="text-base font-bold text-stone-900">
                    Network Resonance
                  </h2>
                </div>
                <button
                  onClick={onOpenNetworkModal}
                  className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label="Filter network"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Connected / Resonant Tab Switcher */}
              <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl mt-3 mb-2">
                <button
                  onClick={() => setActiveTab('connected')}
                  className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'connected'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${activeTab === 'connected' ? 'fill-[#D97706] text-[#D97706]' : ''}`} />
                  <span>Connected ({connectedProfiles.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('pool')}
                  className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'pool'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <span>Resonant Pool</span>
                </button>
              </div>

              {/* Items List */}
              <div className="mt-2 divide-y divide-stone-100 max-h-[380px] overflow-y-auto">
                {activeTab === 'connected' ? (
                  connectedProfiles.length === 0 ? (
                    <div className="py-8 text-center px-4">
                      <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#D97706] mb-2">
                        <Heart className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-stone-800">No connections yet</h4>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Connect with peers during onboarding or browse the network directory.
                      </p>
                      <button
                        onClick={onOpenNetworkModal}
                        className="mt-3 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors"
                      >
                        Explore Network
                      </button>
                    </div>
                  ) : (
                    connectedProfiles.map((profile) => {
                      const profColor = getColorIdentity(profile.id, profile);
                      return (
                        <div
                          key={profile.id}
                          onClick={() => onSelectCandidate(profile)}
                          className="py-3 flex items-center justify-between hover:bg-amber-50/40 px-2 rounded-xl transition-all cursor-pointer group"
                          id={`connected-card-${profile.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
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
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                                  {profile.name}
                                </h4>
                                <Heart className="w-3 h-3 fill-[#D97706] text-[#D97706]" />
                              </div>
                              <p className="text-[11px] text-stone-400 truncate max-w-[150px]">
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
                    })
                  )
                ) : quickMatches.length === 0 ? (
                  <div className="py-8 text-center px-4">
                    <h4 className="text-xs font-bold text-stone-800">No resonant matches yet</h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Nobody currently clears the {MIN_COLOR_MATCH_SCORE}% chromatic resonance floor.
                    </p>
                  </div>
                ) : (
                  quickMatches.map((profile) => {
                    const profColor = getColorIdentity(profile.id, profile);
                    const isUserConnected = activeConnections.includes(profile.id);

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
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                                {profile.name}
                              </h4>
                              {isUserConnected && (
                                <span title="Connected Profile">
                                  <Heart className="w-3 h-3 fill-[#D97706] text-[#D97706]" />
                                </span>
                              )}
                            </div>
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
                  })
                )}
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
