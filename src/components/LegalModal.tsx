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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn" id="legal-modal-overlay">
      <div className="bg-[#1C0D0E] border-2 border-amber-500/30 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-amber-500/15 flex items-center justify-between bg-black/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/30 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-black text-amber-200">
                Heritage Matrimony — Legal & Compliance Registry
              </h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Last Updated: June 30, 2026 • Vedic Purity & Data Integrity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
            aria-label="Close legal documents"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area with Sidebar */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-amber-500/15 bg-black/20 p-4 space-y-1.5 overflow-y-auto shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-2.5 py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}

            <div className="mt-8 pt-4 border-t border-amber-500/10 text-center">
              <div className="inline-flex items-center space-x-1 bg-[#2D1617] border border-amber-600/30 rounded-lg px-2 py-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[9px] font-mono font-bold text-amber-400">100% SECURE DIRECTORY</span>
              </div>
            </div>
          </div>

          {/* Actual Policy Content View */}
          <div className="flex-grow p-6 md:p-8 overflow-y-auto bg-black/10 scrollbar-thin text-xs text-slate-300 space-y-6 font-serif leading-relaxed">
            
            {activeTab === "privacy" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" /> PRIVACY POLICY
                </h3>
                <p className="italic text-slate-400">
                  Your privacy is our sacred trust. Heritage Matrimony is committed to protecting the personal, genealogical, and astrological data of our Brahmin members.
                </p>
                
                <h4 className="font-bold text-amber-200 mt-4 text-sm">1. Information We Collect</h4>
                <p>
                  To provide accurate Kundali (horoscope) matching and lineage security, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>Astrological Parameters:</strong> Date of birth, precise time of birth, place of birth, Gotra, Rasi, Nakshatram, Charan, and Padam details.</li>
                  <li><strong>Personal Credentials:</strong> Complete name, age, biological gender, sub-sect affiliation (e.g., Vadama, Thenkalai, Smartha, Madhva), native place, and contact credentials.</li>
                  <li><strong>Reference Details:</strong> Genuine guardian or cross-reference contact name, number, and relationship to protect the directory against infiltration.</li>
                  <li><strong>Media Assets:</strong> Captured live camera photographs or uploaded profile pictures (used solely for identification and matched with high-privacy controls).</li>
                </ul>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">2. Purpose of Data Processing</h4>
                <p>
                  We process this personal data to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Perform authentic Porutham calculations based on the traditional 10-fold Vedic rules.</li>
                  <li>Avoid Sagotra matches (clans sharing identical paternal lineage) to respect physiological and traditional boundaries.</li>
                  <li>Construct a highly trusted, verified directory restricted strictly to authentic Brahmin candidates.</li>
                  <li>Prevent fraud, catfishing, and unsolicited commercial queries.</li>
                </ul>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">3. Data Sharing & Security Mandates</h4>
                <p>
                  We strictly <strong>do not sell, trade, or rent</strong> your personal data to third-party marketing companies. 
                  Your exact astrological coordinates are stored securely. Reference details provided for cross-checking are only visible to certified verified members who have matched or initiated premium chats.
                </p>
                <p>
                  All active communications, direct video calls, and text chats are fully encrypted using WebRTC/SSL tunnels, preventing external intercept.
                </p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">4. Your Control Rights</h4>
                <p>
                  Under IT Rules 2021 and DPDPA 2023 guidelines, you retain full rights to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Rectification:</strong> Correct any astrological typo or native place configuration.</li>
                  <li><strong>Deletion:</strong> Completely purge your profile from our database and local storage.</li>
                  <li><strong>Access:</strong> Obtain an immediate summary of all recorded metadata.</li>
                </ul>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">5. Grievance Officer & Contact Disclosure</h4>
                <p>
                  In accordance with Intermediary Guidelines (IT Rules 2021), the details of our Grievance Officer are:
                </p>
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-amber-500/20 mt-2 space-y-1">
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
                <p className="italic text-slate-400">
                  Welcome to Heritage Matrimony. By accessing our platform, you agree to comply with and be bound by the following traditional and regulatory terms.
                </p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">1. Eligibility Criteria</h4>
                <p>
                  This matrimonial registry is strictly dedicated to individuals of <strong>Brahmin lineage</strong> seeking genuine, sacred marital alliances. By registering, you confirm:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You are of legal marriageable age according to local jurisdiction laws (e.g., 18 for females, 21 for males in India).</li>
                  <li>Your intention is purely matrimonial; commercial use, research scraping, or casual dating is strictly prohibited.</li>
                  <li>The sub-sect, gotra, and astrological attributes entered are truthful and family-supported.</li>
                </ul>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">2. Account Security & Verification Integrity</h4>
                <p>
                  You are responsible for maintaining the confidentiality of your credentials. Heritage Matrimony enforces high-integrity security protocols. 
                  Our administration team reserves the absolute right to suspend or block accounts immediately that:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide misleading astrological coordinates or fake reference contacts.</li>
                  <li>Harass or abuse other members during chats, audio-calls, or video sessions.</li>
                  <li>Violate traditional gotra guidelines with malicious intent.</li>
                </ul>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">3. Traditional Marriage Mandates & Code of Conduct</h4>
                <p>
                  While we calculate astronomical compatibility (Kundali Porutham) and perform baseline cross-reference checks, the final responsibility for checking a candidate's background, conduct, and employment lies entirely with the family of the bride and groom. 
                  Heritage Matrimony does not assume liability for post-marriage disputes or interpersonal discrepancies.
                </p>
              </div>
            )}

            {activeTab === "refund" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-[#7C1C13] flex items-center gap-2">
                  <Coins className="w-5 h-5 text-rose-500" /> REFUND POLICY
                </h3>
                <p className="italic text-slate-400">
                  Transparency and integrity are the cornerstones of Heritage Matrimony. Please read our refund policy for paid subscriptions, premium plan tokens, and digital store orders.
                </p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">1. Subscription Plans</h4>
                <p>
                  Since matrimonial matchmaking involves instantaneous directory unlocks, astrological charts generation, and direct access to contact cards, all premium membership plans are <strong>strictly non-refundable</strong> once any profile contact card is unlocked or any chat session is initiated.
                </p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">2. Brahmin Sweet Store & Puja Samagri Orders</h4>
                <p>
                  For food items ordered through our Ghee Sweets promo or sacred Puja materials:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Cancellations:</strong> Permitted only within 2 hours of placing the order. Once dispatch/shipping begins, the order cannot be canceled.</li>
                  <li><strong>Damaged / Quality Issues:</strong> If food packages are received in a damaged condition, we will issue a full refund or a fresh replacement upon verification of photographic evidence sent within 24 hours of delivery.</li>
                </ul>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">3. Exceptions & Special Cases</h4>
                <p>
                  If a user registers a profile and pays for premium, but their profile is subsequently rejected by our manual administrators during the baseline reference check due to a lineage mismatch, we will issue a <strong>100% full refund</strong> of the fee paid, processed back to the original payment channel within 5-7 business days.
                </p>
              </div>
            )}

            {activeTab === "cookie" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-amber-400" /> COOKIE POLICY
                </h3>
                <p className="italic text-slate-400">
                  This policy explains how we use cookies, local storage key-values, and similar tracking technologies to optimize your matchmaking experience.
                </p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">1. What are Cookies and Local Storage?</h4>
                <p>
                  Cookies are small text files placed on your device. We heavily utilize safe <strong>browser local storage</strong> to retain your secure session keys, system roles, verified profile parameters, and chat logs locally. This ensures zero data loss if your connection drops.
                </p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">2. Classification of Cookies We Use</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Essential Cookies & States:</strong> Critical for account sessions. For example, 
                    <code className="text-amber-400 bg-black/40 px-1 py-0.5 rounded font-mono mx-1">registeredBrahminProfile</code>
                    stores your secure verified profile data to let you browse compatibility without re-entering details.
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Used to store your language translation configuration (Tamil, Sanskrit, Hindi, English) and active UI tab filters.
                  </li>
                  <li>
                    <strong>Security Cookies:</strong> Used to prevent directory scraping, manage active logins, and track secure reference validation.
                  </li>
                </ul>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">3. Managing and Disabling Cookies</h4>
                <p>
                  You can configure your browser to decline all cookies. However, disabling essential local storage states will lock you out of direct profile synchronization, live chat modules, and horoscope chart matching capabilities.
                </p>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-400 animate-pulse" /> AI & ASTRO-ALGORITHM DISCLAIMER
                </h3>
                <p className="italic text-slate-400">
                  Auspicious calculations powered by technology must be viewed in tandem with pure traditional wisdom.
                </p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">1. Astrological Calculations & Algorithms</h4>
                <p>
                  The Porutham calculations, Grahachara placements, and astrological match scores shown on Heritage Matrimony are processed using state-of-the-art computational algorithms conforming to ancient <strong>Brihat Parasara Hora Sastra</strong> standards. 
                </p>
                <p>
                  While these algorithmic calculations are highly precise (accounting for precise timezone corrections, latitude/longitude offsets, and ayanamsa shifts), they are meant as a <strong>preliminary compatibility screening</strong>. We strongly recommend that families consult their traditional family astrologer before finalizing any auspicious agreement.
                </p>

                <h4 className="font-bold text-amber-200 mt-4 text-sm">2. Generative AI and Trust Score Metrics</h4>
                <p>
                  Our trust score index is computed using a multi-factor weighting engine that evaluates reference details, live camera checks, and community verification logs. 
                  AI models assist in scanning and blocking abusive speech, unauthorized document numbers, or inappropriate profile pictures to keep our sacred community completely safe. 
                </p>
                <p>
                  AI and automated models do not make final marriage decisions or replace human intuition. They are tools configured solely to speed up search, eliminate bots, and highlight compatible lineages.
                </p>
              </div>
            )}

            {activeTab === "consent" && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-black text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> COMPREHENSIVE CONSENT REGISTRY
                </h3>
                <p className="italic text-slate-400">
                  By registering or using Heritage Matrimony, you explicitly grand consent to several key security, lineage, and matching processing protocols.
                </p>

                <h4 className="font-bold text-emerald-300 mt-4 text-sm">✓ Lineage & Gotra Verification Consent</h4>
                <p>
                  You grant us permission to index and evaluate your sub-sect, gotra, and rasi parameters. This data is strictly processed to crosscheck traditional gotra rules, run automatic sagotra avoidance alerts, and preserve directory integrity.
                </p>

                <h4 className="font-bold text-emerald-300 mt-4 text-sm">✓ Reference & Crosscheck Authorization</h4>
                <p>
                  You explicitly authorize Heritage Matrimony administrators (and potential compatible families with matching horoscopes) to contact the cross-reference person provided by you in Step 3 of the verification wizard to confirm familial roots and lineage status.
                </p>

                <h4 className="font-bold text-emerald-300 mt-4 text-sm">✓ Astrological Calculations Consent</h4>
                <p>
                  You authorize our backend to calculate and display your Kundali, Poruthams, and astrological matches to other certified registered members of the appropriate complementary gender.
                </p>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/35 rounded-2xl flex items-center space-x-3 mt-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-serif font-black text-emerald-300 text-xs block">Active Consent Enforcement</span>
                    <span className="text-[10px] text-slate-400 leading-snug block">Heritage Matrimony strictly logs all user consents to comply with privacy frameworks and protect the sanctity of the Brahmin alliance.</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-500/15 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[10px] text-slate-500 font-serif">
            Heritage Matrimony — Sacred Alliances Protected under Astrological & Lineage Integrity Mandates.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all duration-300 text-center"
          >
            I Acknowledge & Agree
          </button>
        </div>

      </div>
    </div>
  );
}
