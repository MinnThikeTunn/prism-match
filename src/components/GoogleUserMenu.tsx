import React, { useState, useRef, useEffect } from 'react';
import { GoogleCredential, STORAGE_KEY_GOOGLE_AUTH } from '../lib/googleAuth';
import { 
  ShieldCheck, 
  Database, 
  LogOut, 
  UserCheck, 
  ChevronDown, 
  ExternalLink, 
  KeyRound, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

interface GoogleUserMenuProps {
  credential: GoogleCredential | null;
  onOpenSignIn: () => void;
  onOpenInspector: () => void;
  onSignOut: () => void;
}

export const GoogleUserMenu: React.FC<GoogleUserMenuProps> = ({
  credential,
  onOpenSignIn,
  onOpenInspector,
  onSignOut
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!credential) {
    return (
      <button
        onClick={onOpenSignIn}
        className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold rounded-full shadow-xs hover:shadow transition-all group"
        id="google-signin-header-btn"
        title="Sign in with Google (Demo LocalStorage)"
      >
        {/* Google G Logo */}
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
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
        <span className="hidden sm:inline">Sign in with Google</span>
        <span className="sm:hidden">Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Authenticated Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 rounded-full transition-all text-left shadow-2xs group"
        id="google-user-menu-btn"
        title={`Signed in as ${credential.user.email} (Saved in LocalStorage)`}
      >
        <div className="relative">
          <img
            src={credential.user.picture}
            alt={credential.user.name}
            className="w-6 h-6 rounded-full object-cover border border-blue-300"
            referrerPolicy="no-referrer"
          />
          {/* Small Google G Badge */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white shadow-2xs p-0.2 flex items-center justify-center">
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
        </div>

        <div className="hidden lg:block text-left">
          <span className="text-[11px] font-bold text-stone-900 leading-none block truncate max-w-[100px]">
            {credential.user.givenName || credential.user.name}
          </span>
          <span className="text-[9px] text-blue-700 font-semibold leading-none flex items-center gap-0.5 mt-0.5">
            <Check className="w-2.5 h-2.5 text-[#34A853]" /> Google Auth
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
          
          {/* Account header */}
          <div className="flex items-start gap-3 pb-3 border-b border-stone-100">
            <img
              src={credential.user.picture}
              alt={credential.user.name}
              className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-stone-900 truncate">
                  {credential.user.name}
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {credential.user.email}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-blue-700 font-mono mt-1">
                <Database className="w-3 h-3 text-[#4285F4]" />
                <span className="truncate">Saved in localStorage</span>
              </div>
            </div>
          </div>

          {/* Stored Token status */}
          <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-100 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-stone-600">
              <span className="text-stone-400 font-medium">Storage Key:</span>
              <code className="text-[#D97706] font-bold text-[10px] bg-amber-50 px-1 py-0.5 rounded border border-amber-200/60">
                {STORAGE_KEY_GOOGLE_AUTH}
              </code>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span className="text-stone-400 font-medium">Auth Provider:</span>
              <span className="font-bold text-stone-800 text-[10px]">accounts.google.com (OIDC)</span>
            </div>
          </div>

          {/* Menu Action Items */}
          <div className="mt-3 space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenInspector();
              }}
              className="w-full flex items-center justify-between p-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors text-left"
              id="google-menu-inspect-btn"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#D97706]" />
                <span>Inspect Stored Token & Claims</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">JWT</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSignIn();
              }}
              className="w-full flex items-center gap-2 p-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors text-left"
              id="google-menu-switch-btn"
            >
              <UserCheck className="w-4 h-4 text-[#4285F4]" />
              <span>Switch Google Account</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2 p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
              id="google-menu-signout-btn"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out & Clear Storage</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
