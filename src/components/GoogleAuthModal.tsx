import React, { useState } from 'react';
import { 
  GoogleCredential, 
  GoogleUser, 
  generateDemoGoogleCredential, 
  getRecentGoogleAccounts, 
  STORAGE_KEY_GOOGLE_AUTH 
} from '../lib/googleAuth';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  UserPlus, 
  Lock, 
  Database, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credential: GoogleCredential, syncProfile: boolean) => void;
  currentEmail?: string;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentEmail
}) => {
  const [accounts] = useState<GoogleUser[]>(() => getRecentGoogleAccounts());
  const [selectedAccount, setSelectedAccount] = useState<GoogleUser | null>(() => {
    const list = getRecentGoogleAccounts();
    if (currentEmail) {
      const match = list.find(a => a.email.toLowerCase() === currentEmail.toLowerCase());
      if (match) return match;
    }
    return list[0] || null;
  });

  const [mode, setMode] = useState<'pick' | 'custom'>('pick');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [syncProfile, setSyncProfile] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleSignInWithUser = (user: GoogleUser) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      const cred = generateDemoGoogleCredential(user);
      setIsAuthenticating(false);
      onSuccess(cred, syncProfile);
      onClose();
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setIsAuthenticating(true);
    setTimeout(() => {
      const nameParts = customName.trim().split(' ');
      const givenName = nameParts[0] || 'Demo';
      const familyName = nameParts.slice(1).join(' ') || 'User';

      const customUser: Partial<GoogleUser> = {
        name: customName.trim() || 'Demo User',
        givenName,
        familyName,
        email: customEmail.trim(),
        verifiedEmail: true,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(customName.trim() || 'Google User')}&background=4285F4&color=fff&size=200`
      };

      const cred = generateDemoGoogleCredential(customUser);
      setIsAuthenticating(false);
      onSuccess(cred, syncProfile);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Top Header with Google Branding */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Multicolored SVG Logo */}
            <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-stone-200/80 flex items-center justify-center p-1.5 shrink-0">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.43 7.37 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.57 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Sign in with Google
              </h2>
              <p className="text-xs text-stone-500">
                Choose an account to continue to Matchwise Prism
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            id="google-auth-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMode('pick')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'pick'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              id="google-mode-pick-btn"
            >
              Demo Accounts
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'custom'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              id="google-mode-custom-btn"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Use Another Account</span>
            </button>
          </div>

          {/* Mode 1: Quick Account Picker */}
          {mode === 'pick' && (
            <div className="space-y-2">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {accounts.map((account) => {
                  const isSelected = selectedAccount?.email === account.email;
                  return (
                    <button
                      key={account.id}
                      onClick={() => setSelectedAccount(account)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left group ${
                        isSelected
                          ? 'border-[#4285F4] bg-blue-50/40 ring-2 ring-[#4285F4]/20'
                          : 'border-stone-200/80 bg-white hover:bg-stone-50'
                      }`}
                      id={`google-account-${account.email.replace(/[@.]/g, '-')}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={account.picture}
                            alt={account.name}
                            className="w-10 h-10 rounded-full object-cover border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900 group-hover:text-[#4285F4] transition-colors">
                              {account.name}
                            </span>
                            {account.email === 'tminnthike@gmail.com' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-100 text-blue-700">
                                Current User
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 block">
                            {account.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#4285F4] bg-[#4285F4]'
                              : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedAccount && (
                <button
                  disabled={isAuthenticating}
                  onClick={() => handleSignInWithUser(selectedAccount)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow transition-all disabled:opacity-50"
                  id="google-confirm-signin-btn"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating & Persisting...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue as {selectedAccount.givenName}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Mode 2: Custom Google Account Form */}
          {mode === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 text-stone-800"
                  id="google-custom-name-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan.hayes@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 text-stone-800"
                  id="google-custom-email-input"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || !customEmail.trim()}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow transition-all disabled:opacity-50"
                id="google-custom-submit-btn"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    <span>Generate OIDC Token & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sync profile toggle option */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-stone-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={syncProfile}
                onChange={(e) => setSyncProfile(e.target.checked)}
                className="rounded text-[#4285F4] focus:ring-[#4285F4]/30 w-3.5 h-3.5 cursor-pointer"
                id="google-sync-profile-toggle"
              />
              <span>Sync profile name with Google account</span>
            </label>
          </div>

          {/* Storage notice banner */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-2.5 text-[11px] text-stone-600">
            <Database className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-bold text-stone-800">Local Storage Persistence:</span>
              <p className="mt-0.5 text-stone-500 font-mono text-[10px]">
                Key: <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">{STORAGE_KEY_GOOGLE_AUTH}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-stone-400" />
            <span>OAuth 2.0 & OpenID Connect (OIDC) Demo Protocol</span>
          </div>
          <span className="font-mono">Google Identity v2</span>
        </div>

      </div>
    </div>
  );
};
