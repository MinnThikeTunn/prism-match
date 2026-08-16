import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';
import { Search, Sparkles, Bell, Palette } from 'lucide-react';
import { getColorIdentity } from '../lib/colorSystem';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenCustomMatch: () => void;
  onOpenQuestionnaire: () => void;
  onOpenNetwork: () => void;
  onOpenChromaticTest?: () => void;
  currentUser: UserProfile;
  highContrast: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenCustomMatch,
  onOpenQuestionnaire,
  onOpenNetwork,
  onOpenChromaticTest,
  currentUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const userColor = getColorIdentity(currentUser.id);

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-10">
          {/* Logo / Brand Name */}
          <button
            onClick={() => onViewChange('dashboard')}
            className="flex items-center gap-2 text-left group"
            id="brand-logo-btn"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#D97706] via-[#0A6275] to-[#059669] shadow-xs" />
            <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-[#D97706] transition-colors">
              Matchwise Prism
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`text-sm font-semibold transition-all relative py-1 ${
                currentView === 'dashboard'
                  ? 'text-[#D97706]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="nav-dashboard-btn"
            >
              Dashboard
              {currentView === 'dashboard' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
              )}
            </button>

            <button
              onClick={() => onViewChange('maps')}
              className={`text-sm font-semibold transition-all relative py-1 ${
                currentView === 'maps'
                  ? 'text-[#D97706]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="nav-maps-btn"
            >
              Maps
              {currentView === 'maps' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
              )}
            </button>

            <button
              onClick={() => onViewChange('verification')}
              className={`text-sm font-semibold transition-all relative py-1 ${
                currentView === 'verification'
                  ? 'text-[#D97706]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="nav-verification-btn"
            >
              Verification
              {currentView === 'verification' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
              )}
            </button>

            <button
              onClick={() => onViewChange('colors')}
              className={`text-sm font-semibold transition-all relative py-1 ${
                currentView === 'colors'
                  ? 'text-[#D97706]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="nav-colors-btn"
            >
              Color System
              {currentView === 'colors' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
              )}
            </button>

            <button
              onClick={() => onViewChange('profile')}
              className={`text-sm font-semibold transition-all relative py-1 ${
                currentView === 'profile'
                  ? 'text-[#D97706]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              id="nav-profile-btn"
            >
              Profile
              {currentView === 'profile' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
              )}
            </button>
          </nav>
        </div>

        {/* Right: Search, Custom Match Button, Notification, Avatar */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search spectrum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onOpenNetwork();
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706] transition-all"
              id="header-search-input"
            />
          </div>

          {/* Calibrate / Retake Color Test Button */}
          {onOpenChromaticTest && (
            <button
              onClick={onOpenChromaticTest}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-full shadow-xs transition-all"
              id="header-calibrate-color-btn"
              title="Calibrate or Retake Chromatic Assessment"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Calibrate Color</span>
            </button>
          )}

          {/* Custom AI Match Action Button */}
          <button
            onClick={onOpenCustomMatch}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 text-xs font-semibold rounded-full border border-[#D97706]/30 transition-all shadow-xs"
            id="header-custom-ai-match-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden md:inline">Custom AI Match</span>
          </button>

          {/* Notifications Icon with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors relative"
              id="header-notifications-btn"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D97706] rounded-full ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-800">Chromatic Feed</span>
                  <span className="text-[10px] text-[#D97706] font-semibold">2 New</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="text-xs p-2 bg-stone-50 rounded-lg border border-stone-100">
                    <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                      <span>Solar & Cobalt Resonance</span>
                    </p>
                    <p className="text-stone-500 text-[11px] mt-0.5">Elias Thorne matches your System Architecture spectrum.</p>
                  </div>
                  <div className="text-xs p-2 bg-stone-50 rounded-lg border border-stone-100">
                    <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#059669]" />
                      <span>Chromatic Signature Verified</span>
                    </p>
                    <p className="text-stone-500 text-[11px] mt-0.5">Your Conic Ring spectrum has been officially authenticated.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => onViewChange('profile')}
            className={`flex items-center gap-2 pl-2 border-l border-stone-200 hover:opacity-80 transition-all ${
              currentView === 'profile' ? 'opacity-100' : ''
            }`}
            id="header-profile-avatar-btn"
            title="View Dedicated Profile"
          >
            <div
              className={`w-8 h-8 rounded-full ring-2 overflow-hidden transition-all ${
                currentView === 'profile' ? 'ring-4 ring-[#D97706]' : ''
              }`}
              style={{ ringColor: currentView === 'profile' ? '#D97706' : userColor.primaryColor }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
