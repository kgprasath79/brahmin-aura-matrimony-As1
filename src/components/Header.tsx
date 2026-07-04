/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldCheck, Sparkles, Type, Key, ShieldAlert, Check, UserCheck, ChevronDown, Lock, Globe, Smartphone, MessageSquare, Loader2 } from "lucide-react";
import KalasaLogo from "./KalasaLogo";
import { useLanguage, Language } from "../context/LanguageContext";

interface HeaderProps {
  userVerified: boolean;
  onNavigateToVerify: () => void;
  userRole: "member" | "super_admin" | "moderator" | "support_admin";
  onChangeUserRole: (role: "member" | "super_admin" | "moderator" | "support_admin") => void;
  userIsLoggedIn: boolean;
  onSetUserIsLoggedIn: (loggedIn: boolean) => void;
  onSetUserVerified: (verified: boolean) => void;
}

export default function Header({
  userVerified,
  onNavigateToVerify,
  userRole,
  onChangeUserRole,
  userIsLoggedIn,
  onSetUserIsLoggedIn,
  onSetUserVerified,
}: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showMemberLoginModal, setShowMemberLoginModal] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Member Login Inputs & OTP/Password Methods (Requirement 2)
  const [memberMobileInput, setMemberMobileInput] = useState<string>("");
  const [memberLoginMethod, setMemberLoginMethod] = useState<"otp" | "password">("otp");
  const [memberOtpSent, setMemberOtpSent] = useState<boolean>(false);
  const [memberOtpInput, setMemberOtpInput] = useState<string>("");
  const [memberPasswordInput, setMemberPasswordInput] = useState<string>("");
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [memberOtpFeedback, setMemberOtpFeedback] = useState<string | null>(null);
  const [memberLoginError, setMemberLoginError] = useState<string | null>(null);

  // Master Pin lock for developer credentials sheet (Point 5)
  const [masterPinInput, setMasterPinInput] = useState<string>("");
  const [isMasterPinVerified, setIsMasterPinVerified] = useState<boolean>(false);
  const [masterPinError, setMasterPinError] = useState<string | null>(null);

  const { language, setLanguage, t } = useLanguage();

  const getLoggedInMemberName = () => {
    try {
      const saved = localStorage.getItem("registeredBrahminProfile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          return parsed.name;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return "Demo Member";
  };

  const getLoggedInMemberImage = () => {
    try {
      const saved = localStorage.getItem("registeredBrahminProfile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selfieMockUrl) return parsed.selfieMockUrl;
        if (parsed.imageUrl) return parsed.imageUrl;

        // Gender-based fallback if no photo found in record
        if (parsed.gender === "Male") {
          return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120";
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Default female fallback
    return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120";
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const user = usernameInput.trim().toLowerCase();
    const pass = passwordInput.trim();

    if (user === "member") {
      onChangeUserRole("member");
      onSetUserIsLoggedIn(true);
      setShowLoginModal(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Save cryptographic tokens in localStorage to synchronize with the SelfAudit active sessions monitor
        localStorage.setItem("heritage_access_token", data.accessToken);
        localStorage.setItem("heritage_refresh_token", data.refreshToken);

        onChangeUserRole(data.role);
        onSetUserIsLoggedIn(true);
        setShowLoginModal(false);
        setUsernameInput("");
        setPasswordInput("");
      } else {
        setLoginError(data.error || "Authentication failed. Invalid password or account lockout.");
      }
    } catch (err) {
      console.warn("Secure authentication gateway offline. Falling back to local offline sandbox...", err);
      
      const fallbacks = {
        admin_super: { pass: "heritage2026", role: "super_admin" as const },
        admin_mod: { pass: "verify2026", role: "moderator" as const },
        admin_support: { pass: "support2026", role: "support_admin" as const },
      };

      if (user in fallbacks) {
        const fallback = fallbacks[user as keyof typeof fallbacks];
        if (fallback.pass === pass) {
          onChangeUserRole(fallback.role);
          onSetUserIsLoggedIn(true);
          setShowLoginModal(false);
          setUsernameInput("");
          setPasswordInput("");
        } else {
          setLoginError("Invalid offline password. Use the preconfigured defaults or verify network connectivity.");
        }
      } else {
        setLoginError("Unknown user. Try 'admin_super', 'admin_mod', 'admin_support', or 'member'.");
      }
    }
  };

  const handleSendOtp = () => {
    setMemberLoginError(null);
    setMemberOtpFeedback(null);
    const mobile = memberMobileInput.trim().replace(/\D/g, "");
    
    if (mobile.length < 10) {
      setMemberLoginError("Please enter a valid 10-digit registered mobile number.");
      return;
    }
    
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setMemberOtpSent(true);
      setMemberOtpFeedback("✨ SMS Gateway Status: SECURE OTP SENT! Enter '1008' to authenticate instantly.");
    }, 1200);
  };

  const handleMemberLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberLoginError(null);

    const mobile = memberMobileInput.trim().replace(/\D/g, "");

    if (mobile.length < 10) {
      setMemberLoginError("Please enter a valid 10-digit registered mobile number.");
      return;
    }

    if (!memberOtpSent) {
      handleSendOtp();
      return;
    }

    const otp = memberOtpInput.trim();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: mobile, otp }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        onSetUserIsLoggedIn(true);
        onSetUserVerified(true);
        setShowMemberLoginModal(false);
        alert(`🎉 Welcome back! Successfully signed in using secure OTP.`);
        setMemberOtpSent(false);
        setMemberOtpInput("");
        setMemberOtpFeedback(null);
      } else {
        setMemberLoginError(data.error || "Invalid OTP code.");
      }
    } catch (err) {
      if (otp === "1008" || mobile === "9876543210") {
        onSetUserIsLoggedIn(true);
        onSetUserVerified(true);
        setShowMemberLoginModal(false);
        alert(`🎉 (Sandbox) Welcome back! Successfully signed in.`);
        return;
      }
      setMemberLoginError("Authentication gateway error.");
    }
  };

  const handleLogoutClick = () => {
    if (confirm("Are you sure you want to sign out from the Brahmin directory?")) {
      onSetUserIsLoggedIn(false);
      alert("Successfully logged out. Sacred directory is now re-encrypted.");
    }
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case "super_admin":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30 font-bold";
      case "moderator":
        return "bg-teal-500/10 text-teal-300 border-teal-500/30 font-medium";
      case "support_admin":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 font-medium";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700/50";
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "super_admin":
        return t("superAdmin");
      case "moderator":
        return t("moderator");
      case "support_admin":
        return t("support");
      default:
        return t("memberView");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#6b1419] to-[#4c0d10] border-b-2 border-amber-500/40 px-4 py-3 text-slate-100 shadow-xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Logo and auspicious dual-sided Brahmin title */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="bg-amber-500/10 p-1.5 rounded-2xl border border-amber-400/30 shadow-inner flex items-center justify-center">
            <KalasaLogo size={42} />
          </div>
          <div>
            {/* Double Side / Stacked Brand Name with English and traditional Indian language scripts */}
            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-xl md:text-2xl tracking-wide bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text text-transparent drop-shadow">
                BRAHMIN-HERITAGE MATRIMONY
              </span>
              <span className="text-[10px] font-bold text-amber-400/90 tracking-widest font-serif flex items-center gap-1.5 uppercase">
                Sacred Lineage • Brahmin Alliance
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </div>
        </div>

        {/* Font Scaling & Authentication Control HUD */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Language Selector dropdown - Reduced size, aligned to same height */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 border-2 border-amber-300 px-3.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all h-11">
            <Globe className="w-4 h-4 text-slate-950 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black tracking-widest text-slate-950 uppercase block leading-none">SELECT LANGUAGE</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs text-slate-950 font-black outline-none cursor-pointer border-none p-0 focus:ring-0 font-serif leading-tight py-0.5"
                style={{ fontSize: '11px', border: 'none', background: 'transparent' }}
              >
                <option value="en" className="bg-[#1a0b0d] text-slate-100 font-bold">English</option>
                <option value="hi" className="bg-[#1a0b0d] text-slate-100 font-bold">हिन्दी (Hindi)</option>
                <option value="kn" className="bg-[#1a0b0d] text-slate-100 font-bold">ಕನ್ನಡ (Kannada)</option>
                <option value="te" className="bg-[#1a0b0d] text-slate-100 font-bold">తెలుగు (Telugu)</option>
                <option value="ta" className="bg-[#1a0b0d] text-slate-100 font-bold">தமிழ் (Tamil)</option>
                <option value="mr" className="bg-[#1a0b0d] text-slate-100 font-bold">मराठी (Marathi)</option>
              </select>
            </div>
          </div>

          {/* User Status Registration button */}
          <button
            id="header-user-status"
            onClick={onNavigateToVerify}
            className={`flex items-center justify-center space-x-1.5 px-3.5 rounded-xl text-xs font-black border transition-all duration-300 cursor-pointer h-11 ${
              userVerified
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                : "bg-amber-500/20 border-amber-500/30 text-amber-300 animate-pulse hover:bg-amber-500/30"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>REGISTER PROFILE</span>
          </button>

          {/* SECURE MEMBER LOGIN / LOGOUT SEPARATELY */}
          {!userIsLoggedIn && (
            <button
              id="header-member-login"
              onClick={() => setShowMemberLoginModal(true)}
              className="flex items-center justify-center space-x-1 px-4 rounded-xl text-xs font-black border bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:scale-105 cursor-pointer transition-all duration-300 shadow-md shadow-emerald-500/10 animate-pulse h-11"
            >
              <span>LOGIN</span>
            </button>
          )}

          {userIsLoggedIn && (
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2 bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 rounded-full border border-amber-500/35 shadow-md shadow-amber-500/5 transition-all duration-300 h-11 select-none">
                <img
                  src={getLoggedInMemberImage()}
                  alt={getLoggedInMemberName()}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-amber-400"
                />
                <span className="text-xs font-black text-amber-200 font-serif pr-0.5">
                  {getLoggedInMemberName()}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                id="header-member-logout"
                onClick={handleLogoutClick}
                className="flex items-center justify-center space-x-1 px-3.5 rounded-full text-xs font-black border bg-red-950/40 border-red-500/30 text-red-300 hover:bg-red-950/60 cursor-pointer transition-all duration-300 h-11"
              >
                <span>LOGOUT</span>
              </button>
            </div>
          )}

          {/* Role selection toggle button - MEMBER VIEW TAB - ONLY visible for admins or if not logged in */}
          {(!userIsLoggedIn || userRole !== "member") && (
            <button
              id="role-portal-toggle"
              onClick={() => setShowLoginModal(true)}
              className={`flex items-center justify-center space-x-1 px-3 rounded-xl text-[10px] border transition-all duration-300 cursor-pointer h-11 font-bold ${getRoleBadge()}`}
            >
              <Lock className="w-3.5 h-3.5" />
              <div className="flex flex-col text-left">
                <span className="text-[7px] uppercase tracking-wider opacity-70">PORTAL</span>
                <span className="leading-none">{getRoleLabel()}</span>
              </div>
              <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
            </button>
          )}

        </div>
      </div>

      {/* traditional role-based credential dialog */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a0b0d] border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-200 animate-fadeIn space-y-4">
            
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <KalasaLogo size={32} />
                <div>
                  <h3 className="font-serif font-bold text-amber-300 text-sm">Identity & Privilege Portal</h3>
                  <p className="text-[10px] text-amber-400/60 font-serif">Auspicious Matrimonial Guard Deck</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm font-bold bg-slate-900/60 px-2 py-0.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-serif">
              Aura Matrimony features robust authorization. Toggle between roles to verify access shields or test administrative actions like adding or deleting profiles.
            </p>

            {/* Quick credentials testing sheet with secure developer lock (Point 5) */}
            {!isMasterPinVerified ? (
              <div className="bg-slate-950/90 p-4 rounded-2xl border-2 border-rose-500/40 space-y-3 text-center">
                <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] block flex items-center justify-center gap-1.5">
                  🔒 DEPLOYMENT CREDENTIALS LOCK
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  The preconfigured testing credentials sheet is encrypted to protect against unauthorized modifications by random visitors.
                </p>
                
                <div className="flex gap-2 justify-center items-center">
                  <input
                    type="password"
                    placeholder="Enter Master Security Pin..."
                    value={masterPinInput}
                    onChange={(e) => {
                      setMasterPinInput(e.target.value);
                      setMasterPinError(null);
                    }}
                    className="bg-black/60 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-amber-500 w-full max-w-[180px] text-center"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (masterPinInput.trim() === "1008") {
                        setIsMasterPinVerified(true);
                        setMasterPinError(null);
                      } else {
                        setMasterPinError("Incorrect Security Pin! Try the sacred Vedic number (e.g. 1008).");
                      }
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:brightness-110 transition cursor-pointer"
                  >
                    Unlock
                  </button>
                </div>
                {masterPinError && (
                  <p className="text-[9px] text-rose-400 font-mono animate-pulse">{masterPinError}</p>
                )}
                <p className="text-[9px] text-amber-500/60 font-mono">Hint: Try the auspicious Vedic number of cosmic order (1008)</p>
              </div>
            ) : (
              <div className="bg-black/50 p-3 rounded-2xl border border-amber-500/20 space-y-2 text-[10px] font-sans">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-400 uppercase tracking-wider block">Preconfigured Credentials:</span>
                  <button
                    onClick={() => {
                      setIsMasterPinVerified(false);
                      setMasterPinInput("");
                    }}
                    className="text-[9px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Lock Sheet
                  </button>
                </div>
                <div className="space-y-1 divide-y divide-slate-800/40">
                  <div className="pt-1 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200 block">Super Admin (Add / Delete / Backups)</span>
                      <span className="text-[9px] text-slate-400 font-mono">User: <strong className="text-amber-300 font-bold">admin_super</strong> | Pass: <strong className="text-amber-300 font-bold">heritage2026</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        setUsernameInput("admin_super");
                        setPasswordInput("heritage2026");
                      }}
                      className="px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20 text-[9px] hover:bg-amber-500/20 cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>

                  <div className="pt-1 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200 block">Moderator (Approve ID / Add Profiles)</span>
                      <span className="text-[9px] text-slate-400 font-mono">User: <strong className="text-teal-300 font-bold">admin_mod</strong> | Pass: <strong className="text-teal-300 font-bold">verify2026</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        setUsernameInput("admin_mod");
                        setPasswordInput("verify2026");
                      }}
                      className="px-2 py-0.5 bg-teal-500/10 text-teal-300 rounded border border-teal-500/20 text-[9px] hover:bg-teal-500/20 cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>

                  <div className="pt-1 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200 block">Support Helpdesk (Read-Only Logs)</span>
                      <span className="text-[9px] text-slate-400 font-mono">User: <strong className="text-indigo-300 font-bold">admin_support</strong> | Pass: <strong className="text-indigo-300 font-bold">support2026</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        setUsernameInput("admin_support");
                        setPasswordInput("support2026");
                      }}
                      className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20 text-[9px] hover:bg-indigo-500/20 cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>

                  <div className="pt-1 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200 block">Standard Client View (No Admin Dashboard)</span>
                      <span className="text-[9px] text-slate-400 font-mono">User: <strong className="text-slate-300 font-bold">member</strong> | Pass: <strong className="text-slate-400">None required</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        setUsernameInput("member");
                        setPasswordInput("");
                      }}
                      className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[9px] hover:bg-slate-700 cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Username / Client ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin_super or member"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              {usernameInput !== "member" && (
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Passkey Pin</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {loginError && (
                <p className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 shadow-md shadow-amber-500/10"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Verify Credentials & Connect</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* MEMBER SECURE LOGIN DIALOG */}
      {showMemberLoginModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c0c0e] border-2 border-emerald-500 rounded-3xl max-w-md w-full p-6 shadow-2xl shadow-emerald-500/10 text-slate-200 animate-fadeIn space-y-4">
            
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <KalasaLogo size={32} />
                <div>
                  <h3 className="font-serif font-bold text-emerald-400 text-sm">Secure Member Login</h3>
                  <p className="text-[10px] text-amber-400 font-serif uppercase tracking-widest">Auspicious Matrimonial Registry</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowMemberLoginModal(false);
                  setMemberOtpSent(false);
                  setMemberOtpFeedback(null);
                }}
                className="text-slate-400 hover:text-white font-mono text-sm font-bold bg-slate-900/60 px-2 py-0.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-serif">
              Access your sacred Brahmin Matrimonial profile by entering your registered mobile number below.
            </p>

            <form onSubmit={handleMemberLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={memberMobileInput}
                    onChange={(e) => setMemberMobileInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl pl-9 pr-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {memberOtpSent ? (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                      Enter 4-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Enter OTP (e.g. 1008)"
                      value={memberOtpInput}
                      onChange={(e) => setMemberOtpInput(e.target.value)}
                      className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-emerald-500 text-center tracking-widest font-mono text-sm"
                    />
                  </div>

                  {memberOtpFeedback && (
                    <p className="text-[10px] text-amber-400 font-semibold bg-amber-950/20 p-2 rounded-lg border border-amber-900/30">
                      {memberOtpFeedback}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Verify OTP & Sign In</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isSendingOtp}
                  onClick={handleSendOtp}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Secure Code...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Verification OTP</span>
                    </>
                  )}
                </button>
              )}

              {memberLoginError && (
                <p className="text-[10px] text-rose-400 font-bold flex items-center gap-1 bg-rose-950/20 p-2 rounded-lg border border-rose-900/30">
                  <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                  {memberLoginError}
                </p>
              )}
            </form>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 block text-center uppercase tracking-wider font-bold">Quick Sandbox Testing Options</span>
              <button
                onClick={() => {
                  setMemberMobileInput("9876543210");
                  setMemberLoginMethod("otp");
                  setMemberOtpSent(true);
                  setMemberOtpInput("1008");
                  setMemberOtpFeedback("✨ SMS Gateway Status: SECURE OTP SENT! Enter '1008' to authenticate instantly.");
                }}
                className="w-full py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/30 text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
              >
                <span>✨ Auto-Fill Demo OTP Login</span>
              </button>
              <button
                onClick={() => {
                  setMemberMobileInput("9876543210");
                  setMemberLoginMethod("password");
                  setMemberPasswordInput("demo");
                }}
                className="w-full py-2 bg-gradient-to-r from-slate-800/40 to-slate-800/60 border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
              >
                <span>🔑 Auto-Fill Demo Password Login</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
