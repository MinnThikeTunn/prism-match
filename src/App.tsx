import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { MapsView } from './components/MapsView';
import { DiscoveryView } from './components/DiscoveryView';
import { VerificationView } from './components/VerificationView';
import { SynergyMatchView } from './components/SynergyMatchView';
import { ProfileView } from './components/ProfileView';
import { ColorSystemView } from './components/ColorSystemView';
import { CustomAiMatchModal } from './components/CustomAiMatchModal';
import { NetworkModal } from './components/NetworkModal';
import { OnboardingQuestionnaire } from './components/OnboardingQuestionnaire';
import { ChromaticTestModal } from './components/ChromaticTestModal';
import { CURRENT_USER, MOCK_PROFILES } from './data/mockData';
import { UserProfile, ViewMode } from './types';
import { MatchFeatures } from './types/matching';
import { ChromaticAssessmentResult } from './lib/colorSystem';
import { AccountIdentity } from './lib/account';
import { fetchPublicProfiles } from './lib/cloudProfile';
import { getMyProfile, saveMyProfile, completeOnboarding } from './lib/profile.functions';
import { supabase } from './integrations/supabase/client';

/** Merge the account's stored profile data over the default profile shape. */
function hydrateProfile(
  base: UserProfile,
  row: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    title: string | null;
    bio: string | null;
    location: string | null;
    profile_data: unknown;
  },
): UserProfile {
  const stored =
    row.profile_data && typeof row.profile_data === 'object'
      ? (row.profile_data as Partial<UserProfile>)
      : {};

  return {
    ...base,
    ...stored,
    id: row.id,
    name: row.name || stored.name || base.name,
    email: row.email ?? stored.email,
    avatar: row.avatar || stored.avatar || base.avatar,
    title: row.title || stored.title || base.title,
    bio: row.bio || stored.bio || base.bio,
    location: row.location || stored.location || base.location,
  };
}

export default function App() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  const [account, setAccount] = useState<AccountIdentity | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);

  const [candidatePool, setCandidatePool] = useState<UserProfile[]>(MOCK_PROFILES);
  const [selectedCandidate, setSelectedCandidate] = useState<UserProfile>(
    MOCK_PROFILES.find(p => p.id === 'user-sam-reed') || MOCK_PROFILES[3]
  );

  const [highContrast, setHighContrast] = useState(false);
  const [isFirstTimer, setIsFirstTimer] = useState<boolean>(false);
  const [isChromaticTestOpen, setIsChromaticTestOpen] = useState<boolean>(false);

  // Modals state
  const [isCustomMatchOpen, setIsCustomMatchOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  // Onboarding is per-account and lives in the cloud database.
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  const handleUpdateUser = useCallback((updated: UserProfile) => {
    setCurrentUser(updated);
    void saveMyProfile({
      data: {
        name: updated.name,
        title: updated.title,
        location: updated.location,
        bio: updated.bio,
        avatar: updated.avatar,
        profileData: updated as unknown as Record<string, unknown>,
      },
    }).catch(err => console.warn('Profile save failed:', err));
  }, []);

  // Load the signed-in account's profile + onboarding state from the database.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getMyProfile();
        if (cancelled) return;

        if (res.profile) {
          const hydrated = hydrateProfile(CURRENT_USER, res.profile);
          setCurrentUser(hydrated);
          setAccount({
            id: res.userId,
            email: res.email ?? '',
            name: hydrated.name,
          });
        } else {
          setAccount({ id: res.userId, email: res.email ?? '', name: CURRENT_USER.name });
        }

        (window as unknown as Record<string, unknown>).__profileDebug = { done: res.onboardingCompleted, hasProfile: Boolean(res.profile) };
        setOnboardingDone(res.onboardingCompleted);
        setIsFirstTimer(!res.onboardingCompleted);
        if (!res.onboardingCompleted) setIsQuestionnaireOpen(true);
      } catch (err) {
        (window as unknown as Record<string, unknown>).__profileErr = String(err);
        console.warn('Could not load your account profile:', err);
        setOnboardingDone(true);
      }

      const publicProfiles = await fetchPublicProfiles();
      if (cancelled || publicProfiles.length === 0) return;
      setCandidatePool(prev => {
        const fresh = publicProfiles.filter(p => p.name);
        const seen = new Set(fresh.map(p => p.id));
        return [...fresh, ...prev.filter(p => !seen.has(p.id))];
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate({ to: '/auth', replace: true });
  }, [navigate]);

  const handleCompleteOnboarding = (updated: UserProfile, features: MatchFeatures) => {
    setCurrentUser(updated);
    setOnboardingDone(true);
    setIsQuestionnaireOpen(false);
    void completeOnboarding({
      data: {
        name: updated.name,
        title: updated.title,
        location: updated.location,
        bio: updated.bio,
        avatar: updated.avatar,
        profileData: updated as unknown as Record<string, unknown>,
        features: features as unknown as Record<string, unknown>,
      },
    }).catch(err => console.warn('Onboarding save failed:', err));
  };

  const handleCompleteChromaticTest = (updatedUser: UserProfile, _result: ChromaticAssessmentResult) => {
    handleUpdateUser(updatedUser);
    setIsFirstTimer(false);
  };

  const handleSelectCandidate = (candidate: UserProfile) => {
    setSelectedCandidate(candidate);
    setCurrentView('synergy');
  };

  const quickMatches = candidatePool.slice(0, 4);

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      highContrast ? 'bg-white text-black font-semibold' : 'bg-[#FAFBFD] text-stone-900'
    }`}>
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCustomMatch={() => setIsCustomMatchOpen(true)}
        onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
        onOpenNetwork={() => setIsNetworkOpen(true)}
        onOpenChromaticTest={() => setIsChromaticTestOpen(true)}
        currentUser={currentUser}
        highContrast={highContrast}
        account={account}
        onSignOut={handleSignOut}
      />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            quickMatches={quickMatches}
            onSelectCandidate={handleSelectCandidate}
            onOpenNetworkModal={() => setIsNetworkOpen(true)}
            onOpenCustomMatch={() => setIsCustomMatchOpen(true)}
            onNavigateToColors={() => setCurrentView('colors')}
            onNavigateToMaps={(_tier) => {
              setCurrentView('maps');
            }}
          />
        )}

        {currentView === 'discovery' && (
          <DiscoveryView
            currentUser={currentUser}
            candidatePool={candidatePool}
            onSelectCandidate={handleSelectCandidate}
          />
        )}

        {currentView === 'maps' && (
          <MapsView
            candidates={candidatePool}
            currentUser={currentUser}
            onSelectCandidate={handleSelectCandidate}
          />
        )}

        {currentView === 'verification' && (
          <VerificationView
            currentUser={currentUser}
            account={account}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            candidatePool={candidatePool}
            onUpdateProfile={handleUpdateUser}
            onSelectCandidateSynergy={handleSelectCandidate}
            onNavigateToColors={() => setCurrentView('colors')}
            onOpenChromaticTest={() => setIsChromaticTestOpen(true)}
            account={account}
          />
        )}

        {currentView === 'colors' && (
          <ColorSystemView 
            onOpenChromaticTest={() => setIsChromaticTestOpen(true)} 
          />
        )}

        {currentView === 'synergy' && (
          <SynergyMatchView
            requester={currentUser}
            candidate={selectedCandidate}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Modals */}
      <ChromaticTestModal
        isOpen={isChromaticTestOpen}
        onClose={() => setIsChromaticTestOpen(false)}
        currentUser={currentUser}
        onCompleteTest={handleCompleteChromaticTest}
        isFirstTimer={isFirstTimer}
      />

      <CustomAiMatchModal
        isOpen={isCustomMatchOpen}
        onClose={() => setIsCustomMatchOpen(false)}
        candidatePool={candidatePool}
        onSelectCandidate={handleSelectCandidate}
      />

      <NetworkModal
        isOpen={isNetworkOpen}
        onClose={() => setIsNetworkOpen(false)}
        currentUser={currentUser}
        candidates={candidatePool}
        onSelectCandidate={handleSelectCandidate}
      />

      <OnboardingQuestionnaire
        isOpen={isQuestionnaireOpen}
        onClose={() => {
          // First-time accounts must finish onboarding before using the app.
          if (onboardingDone) setIsQuestionnaireOpen(false);
        }}
        currentUser={currentUser}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}
