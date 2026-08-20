import React, { useState } from 'react';
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
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { GoogleCredentialInspectorModal } from './components/GoogleCredentialInspectorModal';
import { CURRENT_USER, MOCK_PROFILES } from './data/mockData';
import { UserProfile, ViewMode } from './types';
import { ChromaticAssessmentResult } from './lib/colorSystem';
import { ONBOARDING_COMPLETE_KEY } from './lib/onboardingStorage';
import { 
  GoogleCredential, 
  getStoredGoogleCredential, 
  saveGoogleCredential, 
  removeGoogleCredential 
} from './lib/googleAuth';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  
  // Load saved user profile if available, otherwise default to CURRENT_USER
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('matchwise_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return CURRENT_USER;
  });

  // Google Authentication State stored in localStorage
  const [googleCredential, setGoogleCredential] = useState<GoogleCredential | null>(() => {
    return getStoredGoogleCredential();
  });

  const [candidatePool] = useState<UserProfile[]>(MOCK_PROFILES);
  const [selectedCandidate, setSelectedCandidate] = useState<UserProfile>(
    MOCK_PROFILES.find(p => p.id === 'user-sam-reed') || MOCK_PROFILES[3]
  );

  const [highContrast, setHighContrast] = useState(false);

  // Check if first-timer (test not completed yet in localStorage)
  const [isFirstTimer, setIsFirstTimer] = useState<boolean>(() => {
    try {
      return localStorage.getItem('matchwise_chromatic_test_completed') !== 'true';
    } catch {
      return false;
    }
  });

  // Open assessment modal automatically if first-timer
  const [isChromaticTestOpen, setIsChromaticTestOpen] = useState<boolean>(false);

  // Modals state
  const [isCustomMatchOpen, setIsCustomMatchOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_COMPLETE_KEY) !== 'true';
    } catch {
      return false;
    }
  });
  const [isGoogleSignInOpen, setIsGoogleSignInOpen] = useState(false);
  const [isGoogleInspectorOpen, setIsGoogleInspectorOpen] = useState(false);

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('matchwise_user_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCompleteChromaticTest = (updatedUser: UserProfile, _result: ChromaticAssessmentResult) => {
    handleUpdateUser(updatedUser);
    setIsFirstTimer(false);
  };

  const handleSelectCandidate = (candidate: UserProfile) => {
    setSelectedCandidate(candidate);
    setCurrentView('synergy');
  };

  // Google Auth Handlers
  const handleGoogleSuccess = (credential: GoogleCredential, syncProfile: boolean) => {
    saveGoogleCredential(credential);
    setGoogleCredential(credential);

    if (syncProfile) {
      const updatedProfile: UserProfile = {
        ...currentUser,
        name: credential.user.name,
        avatar: credential.user.picture,
        email: credential.user.email,
        bio: `${currentUser.bio} (Authenticated via Google Account ${credential.user.email})`
      };
      handleUpdateUser(updatedProfile);
    }
  };

  const handleGoogleSignOut = () => {
    removeGoogleCredential();
    setGoogleCredential(null);
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
        googleCredential={googleCredential}
        onOpenGoogleSignIn={() => setIsGoogleSignInOpen(true)}
        onOpenGoogleInspector={() => setIsGoogleInspectorOpen(true)}
        onGoogleSignOut={handleGoogleSignOut}
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
            googleCredential={googleCredential}
            onOpenGoogleSignIn={() => setIsGoogleSignInOpen(true)}
            onOpenGoogleInspector={() => setIsGoogleInspectorOpen(true)}
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
            googleCredential={googleCredential}
            onOpenGoogleSignIn={() => setIsGoogleSignInOpen(true)}
            onOpenGoogleInspector={() => setIsGoogleInspectorOpen(true)}
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
        onClose={() => setIsQuestionnaireOpen(false)}
        currentUser={currentUser}
        onComplete={(updated) => {
          handleUpdateUser(updated);
          try {
            localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
          } catch {
            // ignore
          }
        }}
      />

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleSignInOpen}
        onClose={() => setIsGoogleSignInOpen(false)}
        onSuccess={handleGoogleSuccess}
        currentCredential={googleCredential}
      />

      {/* Google Credential & JWT Claims Inspector Modal */}
      <GoogleCredentialInspectorModal
        isOpen={isGoogleInspectorOpen}
        onClose={() => setIsGoogleInspectorOpen(false)}
        credential={googleCredential}
        onSignOut={handleGoogleSignOut}
        onSwitchAccount={() => {
          setIsGoogleInspectorOpen(false);
          setIsGoogleSignInOpen(true);
        }}
      />
    </div>
  );
}
