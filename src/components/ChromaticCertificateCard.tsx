import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Globe, 
  Fingerprint, 
  CheckCircle2, 
  Layers, 
  FileText,
  BadgeCheck
} from 'lucide-react';
import { IsoCertificateData } from '../lib/standardizationCertificate';

interface ChromaticCertificateCardProps {
  cert: IsoCertificateData;
  onOpenRegistryModal?: () => void;
}

export const ChromaticCertificateCard: React.FC<ChromaticCertificateCardProps> = ({
  cert,
  onOpenRegistryModal
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(cert.cryptographicAuditHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Interactive Actions Bar (Hidden on Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-stone-50 border border-stone-200/80 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-stone-800">
            Standard: <span className="font-mono text-stone-600">{cert.standardCode}</span>
          </span>
          <span className="hidden sm:inline text-xs text-stone-400">•</span>
          <span className="hidden sm:inline text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {cert.assessmentStatus}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Audit Token Button */}
          <button
            onClick={handleCopyHash}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold transition-all shadow-2xs active:scale-95"
            title="Copy cryptographic audit signature"
            id="cert-copy-hash-btn"
          >
            {copiedHash ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Hash Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy Audit Hash</span>
              </>
            )}
          </button>

          {/* Verify on Global Registry Button */}
          {onOpenRegistryModal && (
            <button
              onClick={onOpenRegistryModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              id="cert-verify-registry-btn"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify in Ledger</span>
            </button>
          )}

          {/* Print / Save PDF Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            id="cert-print-btn"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Luxury ISO Certificate Document */}
      <div 
        className="certificate-print-root relative bg-[#FCFBF7] border-[6px] border-double border-amber-600/40 rounded-[32px] p-6 sm:p-10 md:p-14 shadow-xl overflow-hidden transition-all text-stone-900"
        style={{
          boxShadow: '0 20px 50px -12px rgba(180, 130, 40, 0.15), 0 0 0 1px rgba(217, 119, 6, 0.15)'
        }}
      >
        {/* Subtle Watermark Guilloche Rosette Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none select-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #D97706 1px, transparent 1px), radial-gradient(circle at 0% 100%, #0A6275 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Top Glow in Certified Color */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            backgroundColor: cert.certifiedColorHex
          }}
        />

        {/* Outer Fine Guilloche Frame Border */}
        <div className="absolute inset-3 sm:inset-4 border border-dashed border-amber-600/30 rounded-[24px] pointer-events-none" />

        {/* Certificate Header Banner */}
        <div className="relative z-10 text-center space-y-3 pb-6 border-b border-amber-600/20">
          
          {/* Top Accreditation Crest */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-amber-600/60" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center text-white">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
            <div className="h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-amber-600/60" />
          </div>

          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-amber-800 uppercase">
              {cert.issuingAuthority}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-stone-900 leading-tight">
              Certificate of Chromatic Qualification
            </h1>
            <div className="text-xs sm:text-sm font-semibold tracking-wider text-amber-900/80 font-mono">
              CONFORMITY ACCREDITATION UNDER STANDARD {cert.standardCode}
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="relative z-10 py-8 sm:py-10 space-y-8 max-w-4xl mx-auto">
          
          {/* Attestation Clause */}
          <div className="text-center space-y-3">
            <p className="text-xs sm:text-sm text-stone-600 uppercase tracking-widest font-semibold">
              This is to certify that
            </p>

            {/* Holder Name & Identity */}
            <div className="py-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-950 tracking-tight">
                {cert.holderName}
              </h2>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-stone-600">
                <span className="font-mono bg-amber-100/70 text-amber-950 px-3 py-1 rounded-full border border-amber-300/60">
                  PRISM ID: {cert.holderPrismId}
                </span>
                <span>•</span>
                <span className="text-stone-800">{cert.holderTitle}</span>
                <span>•</span>
                <span className="text-stone-500">{cert.holderLocation}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
              has completed rigorous perceptual assessment, multi-vector cognitive calibration, and empirical telemetry verification, and is hereby officially classified and standardized under global qualification standard:
            </p>
          </div>

          {/* Certified Primary Color & Archetype Standardization Box */}
          <div 
            className="relative rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-md overflow-hidden text-center"
            style={{
              borderColor: `${cert.certifiedColorHex}60`,
              background: `linear-gradient(135deg, ${cert.certifiedColorHex}12 0%, #FFFFFF 60%, ${cert.certifiedColorHex}08 100%)`
            }}
          >
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border shadow-2xs text-xs font-bold text-stone-800"
                style={{ borderColor: `${cert.certifiedColorHex}40` }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: cert.certifiedColorHex }} />
                <span className="uppercase tracking-wider">OFFICIALLY STANDARDIZED CHROMATIC FREQUENCY</span>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight" style={{ color: cert.certifiedColorHex }}>
                  {cert.certifiedArchetype}
                </div>
                <div className="text-sm sm:text-base font-bold text-stone-800">
                  Primary Color: <span className="font-black underline decoration-2 underline-offset-4" style={{ textDecorationColor: cert.certifiedColorHex }}>{cert.certifiedColorName}</span>
                </div>
                <p className="text-xs text-stone-600 max-w-xl mx-auto italic mt-1">
                  "{cert.dominantDriveDescription}"
                </p>
              </div>

              {/* OKLCH Optical Telemetry & Wavelength Bar */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
                <div className="bg-white/90 p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">OKLCH Space</span>
                  <span className="font-mono text-xs font-bold text-stone-900 mt-0.5 block">{cert.oklchSpec}</span>
                </div>
                <div className="bg-white/90 p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Wavelength</span>
                  <span className="font-mono text-xs font-bold text-stone-900 mt-0.5 block">{cert.wavelengthNm} nm λ</span>
                </div>
                <div className="bg-white/90 p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Compliance</span>
                  <span className="font-mono text-xs font-bold text-emerald-700 mt-0.5 block">{cert.overallComplianceScore}% Index</span>
                </div>
                <div className="bg-white/90 p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Grade Standard</span>
                  <span className="font-mono text-xs font-bold text-amber-800 mt-0.5 block">Grade I Radiance</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 ISO Conformity Clause Compliance Badges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider px-1">
              <span>Standard ISO/PRISM-9001 Clause Assessment</span>
              <span className="text-emerald-700 font-mono">5/5 Clauses Passed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {cert.clauses.map((clause) => (
                <div 
                  key={clause.clauseNumber}
                  className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-stone-500">{clause.clauseNumber}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] font-bold text-stone-900 leading-tight mt-1 truncate" title={clause.clauseTitle}>
                      {clause.clauseTitle.split('&')[0]}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px]">
                    <span className="text-stone-500 font-medium">Score</span>
                    <span className="font-mono font-bold text-stone-900">{clause.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seals, Signatures, and Authority Stamp */}
          <div className="pt-6 border-t border-amber-600/20 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Signatory 1: Lead Metrologist */}
            <div className="text-center md:text-left space-y-1">
              <div className="font-serif italic text-lg sm:text-xl text-stone-900 font-bold border-b border-stone-300 pb-1 inline-block min-w-[180px]">
                {cert.signatoryName}
              </div>
              <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                {cert.signatoryTitle}
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                ICSB Board of Standardization
              </div>
            </div>

            {/* Center: Official Embossed Golden Security Seal (Hologram Look) */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-28 h-28 rounded-full border-4 border-double border-[#D97706] bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 p-1 shadow-lg flex items-center justify-center select-none group cursor-default">
                {/* Outer Serrated Star / Ring */}
                <div className="w-full h-full rounded-full border border-dashed border-amber-950/40 bg-gradient-to-b from-amber-100/90 to-amber-200/90 flex flex-col items-center justify-center p-1 text-center shadow-inner">
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-xs mb-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-[8px] font-black tracking-widest uppercase text-amber-950 leading-tight">
                    ISO/PRISM<br />
                    9001:2026<br />
                    QUALIFIED
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-900 mt-2 font-bold">
                OFFICIAL METROLOGY SEAL
              </span>
            </div>

            {/* Signatory 2: Registrar & Dates */}
            <div className="text-center md:text-right space-y-1">
              <div className="font-serif italic text-lg sm:text-xl text-stone-900 font-bold border-b border-stone-300 pb-1 inline-block min-w-[180px]">
                {cert.registrarName}
              </div>
              <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                {cert.registrarTitle}
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                Accredited: {cert.issuanceDate}
              </div>
            </div>

          </div>

          {/* Tamper-Proof Cryptographic Verification Hash & Serial Number */}
          <div className="pt-6 border-t border-stone-200 bg-stone-100/70 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="text-left space-y-0.5">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  CERTIFICATE SERIAL NO.
                </div>
                <div className="font-bold text-stone-900 text-xs">
                  {cert.certificateNumber}
                </div>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-right min-w-0">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                SHA-256 SPECTRUM AUDIT HASH
              </div>
              <div className="text-[11px] text-stone-700 truncate max-w-sm ml-auto">
                {cert.cryptographicAuditHash}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
