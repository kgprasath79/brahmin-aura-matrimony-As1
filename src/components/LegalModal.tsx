import React, { useState, useEffect } from "react";
import { Shield, FileText, Scale, Coins, Cookie, Brain, CheckCircle, X } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "privacy" | "terms" | "refund" | "cookie" | "ai" | "consent";
}

export default function LegalModal({ isOpen, onClose, defaultTab = "privacy" }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "refund" | "cookie" | "ai" | "consent">(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: "privacy", label: "Privacy Policy", icon: <Shield className="w-4 h-4" /> },
    { id: "terms", label: "Terms & Conditions", icon: <Scale className="w-4 h-4" /> },
    { id: "refund", label: "Refund Policy", icon: <Coins className="w-4 h-4" /> },
    { id: "cookie", label: "Cookie Policy", icon: <Cookie className="w-4 h-4" /> },
    { id: "ai", label: "AI Disclaimer", icon: <Brain className="w-4 h-4" /> },
    { id: "consent", label: "Consent Registry", icon: <CheckCircle className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-50 animate-fadeIn" id="legal-modal-overlay">
      <div className="bg-[#1C0D0E] border-2 border-amber-500 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        <div className="p-5 border-b border-amber-500 flex items-center justify-between bg-black shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 p-2 rounded-xl border border-amber-500 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-black text-amber-200">
                Heritage Matrimony — Legal & Compliance Registry
              </h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Last Updated: July 4, 2026 • Vedic Purity & Data Integrity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
            aria-label="Close legal documents"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-amber-500 bg-black p-4 space-y-1.5 overflow-y-auto shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-2.5 py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-amber-300 border border-amber-500 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-grow p-6 md:p-8 overflow-y-auto bg-black scrollbar-thin text-xs text-slate-300 space-y-6 font-serif leading-relaxed">
            
            {activeTab === "privacy" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" /> PRIVACY POLICY
                </h3>
                <p className="italic text-slate-400">
                  Your privacy is our sacred trust. Heritage Matrimony is committed to protecting the data of our Brahmin members.
                </p>
                
                <h4 className="font-bold text-amber-200 mt-4 text-sm">1. Information We Collect</h4>
                <p>To provide accurate matching, we collect astrological parameters and personal credentials.</p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">2. Purpose of Data Processing</h4>
                <p>We process data for authentic Porutham calculations and lineage security.</p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">3. Data Sharing</h4>
                <p>We strictly do not sell your personal data to third parties.</p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">4. Your Control Rights</h4>
                <p>Under IT Rules 2021, you retain full rights to rectification, deletion, and access.</p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">5. Grievance Officer</h4>
                <div className="bg-slate-900 p-4 rounded-2xl border border-amber-500 mt-2 space-y-1">
                  <p><strong>Name:</strong> K. G. Prasath (Nodal Officer)</p>
                  <p><strong>Email:</strong> kgprasath79@gmail.com</p>
                  <p><strong>Designation:</strong> Data Protection & Grievance Head</p>
                </div>
              </div>
            )}

            {activeTab === "terms" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" /> TERMS & CONDITIONS
                </h3>
                <p>This registry is dedicated to individuals of Brahmin lineage seeking genuine alliances.</p>
                <h4 className="font-bold text-amber-200 mt-4 text-sm">1. Eligibility</h4>
                <p>You must be of legal marriageable age.</p>
              </div>
            )}

            {activeTab === "refund" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-rose-500 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-rose-500" /> REFUND POLICY
                </h3>
                <p>All premium membership plans are strictly non-refundable once any profile is unlocked.</p>
              </div>
            )}

            {activeTab === "cookie" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-amber-400" /> COOKIE POLICY
                </h3>
                <p>We use local storage to retain your secure session keys and verified profile parameters.</p>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-400" /> AI DISCLAIMER
                </h3>
                <p>Algorithmic calculations are meant as a preliminary compatibility screening.</p>
              </div>
            )}

            {activeTab === "consent" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> CONSENT REGISTRY
                </h3>
                <p>You grant consent to lineage evaluation and reference crosscheck authorization.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-amber-500 bg-black flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[10px] text-slate-500 font-serif">
            Heritage Matrimony — Sacred Alliances Protected under Lineage Integrity Mandates.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
          >
            I Acknowledge & Agree
          </button>
        </div>

      </div>
    </div>
  );
}
