import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { MapsView } from './components/MapsView';
import { VerificationView } from './components/VerificationView';
import { SynergyMatchView } from './components/SynergyMatchView';
import { ProfileView } from './components/ProfileView';
import { ColorSystemView } from './components/ColorSystemView';
import { CustomAiMatchModal } from './components/CustomAiMatchModal';
import { NetworkModal } from './components/NetworkModal';
import { QuestionnaireModal } from './components/QuestionnaireModal';
import { ChromaticTestModal } from './components/ChromaticTestModal';
import { CURRENT_USER, MOCK_PROFILES } from './data/mockData';
import { UserProfile, ViewMode } from './types';
import { ChromaticAssessmentResult } from './lib/colorSystem';

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
  const [isChromaticTestOpen, setIsChromaticTestOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('matchwise_chromatic_test_completed') !== 'true';
    } catch {
      return false;
    }
  });

  // Modals state
  const [isCustomMatchOpen, setIsCustomMatchOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

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

        {currentView === 'maps' && (
          <MapsView
            candidates={candidatePool}
            currentUser={currentUser}
            onSelectCandidate={handleSelectCandidate}
          />
        )}

        {currentView === 'verification' && (
          <VerificationView currentUser={currentUser} />
        )}

        {currentView === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            candidatePool={candidatePool}
            onUpdateProfile={handleUpdateUser}
            onSelectCandidateSynergy={handleSelectCandidate}
            onNavigateToColors={() => setCurrentView('colors')}
            onOpenChromaticTest={() => setIsChromaticTestOpen(true)}
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

      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateUser}
      />
    </div>
  );
}
