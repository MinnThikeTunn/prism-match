import React, { useState } from 'react';
import { ChromaticCertificateCard } from './ChromaticCertificateCard';
import { UserProfile } from '../types';
import { 
  Palette, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Copy, 
  Users, 
  Globe, 
  X
} from 'lucide-react';
import { generateIsoCertificate, IsoCertificateData } from '../lib/standardizationCertificate';
import { getColorIdentity } from '../lib/colorSystem';

interface VerificationViewProps {
  currentUser: UserProfile;
  candidatePool?: UserProfile[];
}

export const VerificationView: React.FC<VerificationViewProps> = ({ 
  currentUser,
  candidatePool = []
}) => {
  // Combine currentUser with candidate pool for profile selection
  const allProfiles = [currentUser, ...candidatePool.filter(p => p.id !== currentUser.id)];
  const [selectedUser, setSelectedUser] = useState<UserProfile>(currentUser);
  const [activeTab, setActiveTab] = useState<'certificate' | 'audit' | 'spectrum'>('certificate');
  const [isRegistryModalOpen, setIsRegistryModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Generate ISO standardization certificate for currently selected profile
  const cert: IsoCertificateData = generateIsoCertificate(selectedUser);
  const userColor = getColorIdentity(selectedUser.id, selectedUser);

  const handleCopyAuditToken = () => {
    navigator.clipboard.writeText(cert.cryptographicAuditHash);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-300 relative space-y-8">
      
      {/* Top Header & Overview */}
      <div className="no-print bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Chromatic ambient glow */}
        <div 
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${userColor.primaryColor} 0%, #0A6275 60%, transparent 100%)`
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-500/30 text-xs font-bold">
                <Palette className="w-3.5 h-3.5 text-[#D97706]" />
                <span>ISO/PRISM-9001:2026 Chromatic Quality Standard</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Accredited Qualification</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
              Standardized Chromatic Qualification & Certificate
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Official conformity assessment standardizing individual behavioral frequency into certified OKLCH spectrums. Modeled after ISO 9001 and ISO/IEC 17024 for verifiable competency calibration.
            </p>

            {/* Profile Summary Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-600">
              <div>
                <span className="text-stone-400 font-medium">QUALIFIED SUBJECT:</span>{' '}
                <span className="font-bold text-stone-900">{selectedUser.name}</span>
              </div>
              <div>
                <span className="text-stone-400 font-medium">PRISM ID:</span>{' '}
                <span className="font-mono font-bold text-stone-800">{selectedUser.prismId}</span>
              </div>
              <div>
                <span className="text-stone-400 font-medium">STANDARDIZED COLOR:</span>{' '}
                <span className="font-bold px-2 py-0.5 rounded-md text-white text-[11px]" style={{ backgroundColor: userColor.primaryColor }}>
                  {cert.certifiedColorName} ({cert.certifiedArchetype})
                </span>
              </div>
            </div>
          </div>

          {/* Profile Switcher Dropdown */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 shrink-0 min-w-[260px] space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-500" />
              <span>Inspect Profile Certificate:</span>
            </label>
            <select
              value={selectedUser.id}
              onChange={(e) => {
                const found = allProfiles.find(p => p.id === e.target.value);
                if (found) setSelectedUser(found);
              }}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 cursor-pointer shadow-2xs"
              id="verification-profile-select"
            >
              <optgroup label="Current User">
                <option value={currentUser.id}>{currentUser.name} (You - {currentUser.prismId})</option>
              </optgroup>
              {candidatePool.length > 0 && (
                <optgroup label="Candidate Network">
                  {candidatePool.filter(p => p.id !== currentUser.id).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.title} - {p.prismId})</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* 3 View Tabs Navigation (Hidden on Print) */}
      <div className="no-print flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('certificate')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'certificate'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
          }`}
          id="verification-tab-certificate"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Official Qualification Certificate</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-[#0A6275] text-white shadow-xs'
              : 'bg-teal-50 text-[#0A6275] hover:bg-teal-100'
          }`}
          id="verification-tab-audit"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>ISO Standardization Clauses & Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('spectrum')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'spectrum'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-emerald-50 text-[#059669] hover:bg-emerald-100'
          }`}
          id="verification-tab-spectrum"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Conic Spectrum & Optical Telemetry</span>
        </button>
      </div>

      {/* Tab 1: Official Luxury ISO Qualification Certificate */}
      {activeTab === 'certificate' && (
        <div className="animate-in fade-in duration-200">
          <ChromaticCertificateCard
            cert={cert}
            onOpenRegistryModal={() => setIsRegistryModalOpen(true)}
          />
        </div>
      )}

      {/* Tab 2: ISO Standardization Clauses & Compliance Audit */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0A6275] border border-teal-200 text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>ISO/PRISM-9001:2026 Formal Audit Specification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Clause-by-Clause Competency Conformity Assessment
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Every certified Prism subject is audited against 5 standardized competency clauses with quantifiable empirical thresholds.
            </p>
          </div>

          <div className="space-y-4">
            {cert.clauses.map((clause, idx) => (
              <div 
                key={clause.clauseNumber}
                className="p-5 sm:p-6 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-3 transition-all hover:border-stone-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-stone-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                      §{idx + 4}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-700">{clause.clauseNumber}</span>
                        <span className="text-xs font-bold text-stone-900">{clause.clauseTitle}</span>
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium">{clause.channelName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Calibrated Score</span>
                      <span className="font-mono text-sm font-bold text-stone-900">{clause.score}%</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      ✓ {clause.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-stone-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Standard Specification</span>
                    <p className="text-stone-700 font-mono text-[11px]">{clause.specification}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Audit Finding & Telemetry</span>
                    <p className="text-stone-700 text-[11px]">{clause.auditFinding}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audit Verification Summary */}
          <div className="p-6 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                AUDIT CONCLUSION & CONFORMITY STATUS
              </span>
              <p className="text-sm font-semibold">
                Subject satisfies all 5 mandatory clauses with an overall compliance rating of {cert.overallComplianceScore}%.
              </p>
              <p className="text-xs text-stone-400">
                Authorized for global multi-agent collaboration, high-velocity co-founding, and distributed team synthesis.
              </p>
            </div>
            <button
              onClick={() => setIsRegistryModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0"
            >
              Verify Public Ledger
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Conic Spectrum Visualizer & Optical Telemetry */}
      {activeTab === 'spectrum' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch animate-in fade-in duration-200">
          {/* Left: Raytraced Conic Ring Component */}
          <div className="bg-gradient-to-b from-stone-100/90 to-stone-200/60 border border-stone-200/90 rounded-3xl p-8 flex flex-col justify-between items-center text-center shadow-xs">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-800">
                Conic Spectrum Raytraced Render
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-bold">
                OKLCH Multi-Wavelength
              </span>
            </div>

            <div className="my-6 flex items-center justify-center">
              <ConicRingVisual size={340} />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-white/80 px-4 py-1.5 rounded-full border border-stone-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Chromatic Grade: {cert.qualificationGrade.split('(')[0]}</span>
            </div>
          </div>

          {/* Right: Certified Spectrum Breakdown Palette */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 flex flex-col justify-between shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
                <h2 className="text-base font-bold text-stone-800">
                  Calibrated Spectral Breakdown
                </h2>
                <span className="text-xs font-bold text-stone-400">
                  5 Wavelength Bands
                </span>
              </div>

              <div className="space-y-3">
                {/* 5 Primary Color Rows */}
                {[
                  { name: 'SOLAR GOLD', hex: '#D97706', nm: '589 nm', role: 'Directive Velocity & High Execution Drive' },
                  { name: 'OCEANIC TEAL', hex: '#0A6275', nm: '495 nm', role: 'Cognitive Architecture & Formal Schemas' },
                  { name: 'VERDANT EMERALD', hex: '#059669', nm: '520 nm', role: 'Psychological Safety & Ethical Equilibrium' },
                  { name: 'ROYAL AMETHYST', hex: '#7C3AED', nm: '415 nm', role: 'Lateral Exploration & Frontier Vision' },
                  { name: 'COBALT BLUE', hex: '#1D4ED8', nm: '465 nm', role: 'Deterministic Stability & Zero-Defect SLA' },
                ].map((col) => {
                  const isPrimary = col.name.toLowerCase().includes(cert.certifiedColorName.toLowerCase());
                  return (
                    <div 
                      key={col.name}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isPrimary 
                          ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-xs' 
                          : 'bg-stone-50/60 border-stone-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: col.hex }}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                              {col.name}
                            </span>
                            {isPrimary && (
                              <span className="text-[9px] font-bold bg-amber-500 text-white px-2 py-0.2 rounded-full">
                                PRIMARY
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 block">
                            {col.role}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-stone-600">
                        {col.nm}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optical Telemetry Signatory */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif italic font-bold text-stone-900 block">{cert.signatoryName}</span>
                  <span className="text-[10px] text-stone-400">{cert.signatoryTitle}</span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                SPECTRUM VERIFIED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global Public Registry Verification Modal */}
      {isRegistryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsRegistryModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              id="close-registry-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  ICSB Global Public Ledger Verification
                </h3>
                <p className="text-xs text-stone-500">
                  Cryptographic verification against the International Chromatic Standardization Registry.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    CERTIFICATE STATUS: IMMUTABLE & VERIFIED
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                    BLOCK #{cert.registryBlockHeight}
                  </span>
                </div>
                <p className="text-emerald-900 text-[11px] leading-relaxed">
                  The qualification token for <strong>{cert.holderName}</strong> ({cert.holderPrismId}) has been cryptographically validated against standard <strong>{cert.standardCode}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-stone-400 text-[10px]">
                  <span>RECORD TELEMETRY</span>
                  <span>MAINNET</span>
                </div>
                <div className="text-stone-700 space-y-1">
                  <div><strong>Standard:</strong> {cert.standardCode}</div>
                  <div><strong>Serial:</strong> {cert.certificateNumber}</div>
                  <div><strong>Class:</strong> {cert.certifiedArchetype} ({cert.certifiedColorName})</div>
                  <div><strong>Wavelength:</strong> {cert.wavelengthNm} nm ({cert.oklchSpec})</div>
                  <div><strong>Accreditation Body:</strong> {cert.accreditationBody}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-[10px] font-mono">
                  <span>SHA-256 INTEGRITY HASH</span>
                  <span className="text-emerald-400 font-bold">MATCH 100%</span>
                </div>
                <div className="font-mono text-[11px] text-stone-300 break-all leading-relaxed bg-black/40 p-2.5 rounded-xl">
                  {cert.cryptographicAuditHash}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCopyAuditToken}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken ? 'Hash Copied' : 'Copy Hash'}</span>
              </button>
              <button
                onClick={() => setIsRegistryModalOpen(false)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
