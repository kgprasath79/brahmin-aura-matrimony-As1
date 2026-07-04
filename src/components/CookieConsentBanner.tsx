import React, { useState, useEffect } from "react";
import { Cookie, X, ShieldAlert, Check, Settings } from "lucide-react";

interface CookieConsentBannerProps {
  onOpenLegal: (tab: "privacy" | "terms" | "refund" | "cookie" | "ai" | "consent") => void;
}

export default function CookieConsentBanner({ onOpenLegal }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    astro: true,
    preferences: true,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("heritage_cookie_consent");
    if (!consent) {
      // Delay slightly for natural entrance transition
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "heritage_cookie_consent",
      JSON.stringify({
        essential: true,
        astro: true,
        preferences: true,
        analytics: true,
        acceptedAt: new Date().toISOString(),
      })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "heritage_cookie_consent",
      JSON.stringify({
        ...preferences,
        acceptedAt: new Date().toISOString(),
      })
    );
    setIsVisible(false);
    alert("✅ Cookie preferences updated and saved securely.");
  };

  const handleDeclineAll = () => {
    localStorage.setItem(
      "heritage_cookie_consent",
      JSON.stringify({
        essential: true,
        astro: false,
        preferences: false,
        analytics: false,
        acceptedAt: new Date().toISOString(),
      })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-lg bg-[#1C0D0E]/95 backdrop-blur-md border-2 border-amber-500/30 rounded-3xl p-5 shadow-2xl z-50 animate-fadeIn space-y-4 text-slate-200">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="bg-amber-500/15 p-2 rounded-xl border border-amber-500/30 text-amber-400">
            <Cookie className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-black text-amber-300 uppercase tracking-wide">
              Vedic & Privacy Consent
            </h3>
            <p className="text-[10px] text-slate-400 font-serif leading-none mt-0.5">
              We respect your lineage integrity & digital privacy
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Intro Text */}
      <p className="text-[11px] font-serif leading-relaxed text-slate-300">
        Heritage Matrimony uses essential local state storage (such as{" "}
        <code className="text-amber-300 font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">
          registeredBrahminProfile
        </code>
        ) and cookie variables to calculate secure astronomical matches (Poruthams), maintain gotra sanctity verification, and secure chat channels.
      </p>

      {/* Advanced Settings Checkboxes */}
      {showSettings ? (
        <div className="bg-black/45 p-3 rounded-2xl border border-amber-500/15 space-y-2.5 animate-fadeIn">
          <span className="text-[9px] uppercase font-mono text-amber-400 block tracking-wider font-bold">
            Configure Consent Settings:
          </span>
          
          <div className="space-y-2 text-[10px]">
            {/* Essential */}
            <label className="flex items-start justify-between cursor-not-allowed opacity-80">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-200">Essential Match State (Required)</span>
                <p className="text-slate-400 text-[9px] leading-tight">Necessary for storing registered credentials & gotra parameters.</p>
              </div>
              <input type="checkbox" checked disabled className="rounded text-amber-500 bg-slate-900 border-slate-700 w-3.5 h-3.5 shrink-0" />
            </label>

            {/* Astro */}
            <label className="flex items-start justify-between cursor-pointer">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-amber-200">Kundali Calculations (Recommended)</span>
                <p className="text-slate-400 text-[9px] leading-tight">Enables live matching scores & Porutham compatibility charts.</p>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.astro} 
                onChange={(e) => setPreferences({ ...preferences, astro: e.target.checked })}
                className="rounded text-amber-500 bg-slate-900 border-slate-700 w-3.5 h-3.5 shrink-0 accent-amber-500" 
              />
            </label>

            {/* Preferences */}
            <label className="flex items-start justify-between cursor-pointer">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-200">Language & Filtering Preference</span>
                <p className="text-slate-400 text-[9px] leading-tight">Saves preferred translation layout & sub-sect filters.</p>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.preferences} 
                onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                className="rounded text-amber-500 bg-slate-900 border-slate-700 w-3.5 h-3.5 shrink-0 accent-amber-500" 
              />
            </label>

            {/* Analytics */}
            <label className="flex items-start justify-between cursor-pointer">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-200">Anonymized Performance Analytics</span>
                <p className="text-slate-400 text-[9px] leading-tight">Helps optimize search speed and video call bandwidth.</p>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.analytics} 
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="rounded text-amber-500 bg-slate-900 border-slate-700 w-3.5 h-3.5 shrink-0 accent-amber-500" 
              />
            </label>
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer text-center"
          >
            Save Consent Preferences
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-serif">
          <span>By accepting, you agree to our</span>
          <button 
            onClick={() => onOpenLegal("cookie")} 
            className="text-amber-400 hover:underline font-bold"
          >
            Cookie Policy
          </button>
          <span>&</span>
          <button 
            onClick={() => onOpenLegal("privacy")} 
            className="text-amber-400 hover:underline font-bold"
          >
            Privacy Terms
          </button>
        </div>
      )}

      {/* Button Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-500/10 text-xs">
        <button
          onClick={handleAcceptAll}
          className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black rounded-xl transition-all shadow-md text-center cursor-pointer flex items-center justify-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Accept All</span>
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-3 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center"
          title="Configure detailed consent choices"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDeclineAll}
          className="px-3 py-2 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 font-bold rounded-xl transition-all cursor-pointer text-center"
        >
          Decline
        </button>
      </div>

    </div>
  );
}
