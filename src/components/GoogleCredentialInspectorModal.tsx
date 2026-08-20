import React, { useState } from 'react';
import { GoogleCredential, STORAGE_KEY_GOOGLE_AUTH } from '../lib/googleAuth';
import { X, Copy, Check, ShieldCheck, Database, Key, Clock, User, Code, Lock } from 'lucide-react';

interface GoogleCredentialInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  credential: GoogleCredential | null;
  onSignOut: () => void;
  onSwitchAccount?: () => void;
}

export const GoogleCredentialInspectorModal: React.FC<GoogleCredentialInspectorModalProps> = ({
  isOpen,
  onClose,
  credential,
  onSignOut
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'claims' | 'raw' | 'storage'>('claims');

  if (!isOpen || !credential) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Decode JWT payload for inspection
  let decodedPayload: Record<string, any> = {};
  let decodedHeader: Record<string, any> = {};
  try {
    const parts = credential.idToken.split('.');
    if (parts.length >= 2) {
      decodedHeader = JSON.parse(atob(parts[0]));
      decodedPayload = JSON.parse(atob(parts[1]));
    }
  } catch (err) {
    decodedPayload = { error: 'Failed to decode token payload' };
  }

  const rawStorageString = JSON.stringify(credential, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5 text-[#4285F4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900 leading-tight">
                  Google Auth & Local Storage Inspector
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  PERSISTED
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Inspect stored OpenID Connect (OIDC) token & claims in <code className="text-[#D97706] font-semibold">{STORAGE_KEY_GOOGLE_AUTH}</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            id="google-inspector-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 pb-2 border-b border-stone-100 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'claims'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
            <span>Decoded JWT Claims</span>
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'raw'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-[#FBBC05]" />
            <span>ID Token & Access Token</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'storage'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Raw LocalStorage JSON</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Active Account Overview Pill */}
          <div className="p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={credential.user.picture}
                alt={credential.user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">
                    {credential.user.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Google OAuth2
                  </span>
                </div>
                <span className="text-xs text-stone-600 font-medium">
                  {credential.user.email}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
                Issued At
              </span>
              <span className="text-xs font-bold text-stone-800 font-mono">
                {new Date(credential.issuedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* TAB 1: Decoded JWT Claims */}
          {activeTab === 'claims' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  OpenID Connect Verified Payload
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(decodedPayload, null, 2), 'claims')}
                  className="flex items-center gap-1 text-xs font-bold text-[#4285F4] hover:text-blue-700 transition-colors"
                >
                  {copiedSection === 'claims' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Claims JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Issuer (iss)</span>
                  <span className="font-mono text-stone-800 font-bold text-[11px] break-all">{decodedPayload.iss || 'https://accounts.google.com'}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Subject ID (sub)</span>
                  <span className="font-mono text-stone-800 font-bold text-[11px] break-all">{decodedPayload.sub}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Audience (aud)</span>
                  <span className="font-mono text-stone-800 font-bold text-[11px] break-all">{decodedPayload.aud}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Email Verified</span>
                  <span className="font-mono text-emerald-700 font-bold text-[11px]">
                    {String(decodedPayload.email_verified)} ✓
                  </span>
                </div>
              </div>

              <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto">
                <pre>{JSON.stringify(decodedPayload, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: Tokens */}
          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>JWT ID Token (id_token)</span>
                  </label>
                  <button
                    onClick={() => copyToClipboard(credential.idToken, 'idToken')}
                    className="flex items-center gap-1 text-xs font-bold text-[#4285F4] hover:text-blue-700"
                  >
                    {copiedSection === 'idToken' ? (
                      <span className="text-emerald-600">Copied!</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value={credential.idToken}
                  className="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-700 select-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#0A6275]" />
                    <span>Access Token (Bearer)</span>
                  </label>
                  <button
                    onClick={() => copyToClipboard(credential.accessToken, 'accessToken')}
                    className="flex items-center gap-1 text-xs font-bold text-[#4285F4] hover:text-blue-700"
                  >
                    {copiedSection === 'accessToken' ? (
                      <span className="text-emerald-600">Copied!</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={credential.accessToken}
                  className="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-700 select-all"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LocalStorage Raw Object */}
          {activeTab === 'storage' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">
                  <code className="text-[#D97706] font-mono">localStorage.getItem('{STORAGE_KEY_GOOGLE_AUTH}')</code>
                </span>
                <button
                  onClick={() => copyToClipboard(rawStorageString, 'rawStorage')}
                  className="flex items-center gap-1 text-xs font-bold text-[#4285F4] hover:text-blue-700"
                >
                  {copiedSection === 'rawStorage' ? (
                    <span className="text-emerald-600">Copied!</span>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-stone-900 text-amber-300 rounded-2xl p-4 font-mono text-xs overflow-x-auto max-h-80">
                <pre>{rawStorageString}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
            id="google-inspector-signout-btn"
          >
            Clear from LocalStorage & Sign Out
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            id="google-inspector-done-btn"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
