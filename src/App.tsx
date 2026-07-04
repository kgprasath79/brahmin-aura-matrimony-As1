/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from "react";
import Header from "./components/Header";
import VibrantLandingHome from "./components/VibrantLandingHome";
import LegalModal from "./components/LegalModal";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { mockProfiles as initialProfiles } from "./data/mockProfiles";
import { Profile } from "./types";
import { useLanguage } from "./context/LanguageContext";
import { Heart, Flame, MessageSquare, Video, ShieldCheck, Store, Activity, Zap, Shield, Compass, Lock } from "lucide-react";

// Lazy loading tabs for optimized production bundle size and code splitting
const DiscoverTab = lazy(() => import("./components/DiscoverTab"));
const CompatibilityTab = lazy(() => import("./components/CompatibilityTab"));
const HoroscopeTab = lazy(() => import("./components/HoroscopeTab"));
const MessageTab = lazy(() => import("./components/MessageTab"));
const VideoCallTab = lazy(() => import("./components/VideoCallTab"));
const VerificationTab = lazy(() => import("./components/VerificationTab"));
const VendorsTab = lazy(() => import("./components/VendorsTab"));
const SelfAuditTab = lazy(() => import("./components/SelfAuditTab"));
const IntegrationTab = lazy(() => import("./components/IntegrationTab"));
const AdminDashboardTab = lazy(() => import("./components/AdminDashboardTab"));
const LoginTab = lazy(() => import("./components/LoginTab"));

// Flag to temporarily hide video call option as requested
const SHOW_VIDEO_CALL_TAB_OPTION = false;

function TabLoadingSkeleton() {
  return (
    <div className="bg-white border-2 border-amber-600/10 rounded-3xl p-8 max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-amber-100 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-3 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-2.5 bg-slate-100 rounded w-full"></div>
        <div className="h-2.5 bg-slate-100 rounded w-5/6"></div>
        <div className="h-2.5 bg-slate-100 rounded w-2/3"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="h-20 bg-amber-50/40 border border-amber-500/10 rounded-2xl"></div>
        <div className="h-20 bg-amber-50/40 border border-amber-500/10 rounded-2xl"></div>
        <div className="h-20 bg-amber-50/40 border border-amber-500/10 rounded-2xl"></div>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"discover" | "compatibility" | "horoscope" | "messages" | "video" | "verify" | "vendors" | "audit" | "integration" | "admin" | "login">("discover");
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [selectedCandidate, setSelectedCandidate] = useState<Profile | null>(initialProfiles[0]);
  const [userVerified, setUserVerified] = useState<boolean>(() => localStorage.getItem("registeredBrahminProfile") !== null);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean>(() => localStorage.getItem("heritageUserLoggedIn") === "true");
  
  // Legal modal state
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<"privacy" | "terms" | "refund" | "cookie" | "ai" | "consent">("privacy");

  const handleOpenLegal = (tab: "privacy" | "terms" | "refund" | "cookie" | "ai" | "consent") => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  // Admin-controlled tab visibility states (synced in localStorage)
  const [showVideoCallToMembers, setShowVideoCallToMembers] = useState<boolean>(() => {
    const val = localStorage.getItem("admin_showVideoCallToMembers");
    return val !== null ? val === "true" : true;
  });
  const [showVendorsToMembers, setShowVendorsToMembers] = useState<boolean>(() => {
    const val = localStorage.getItem("admin_showVendorsToMembers");
    return val !== null ? val === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("heritageUserLoggedIn", userIsLoggedIn ? "true" : "false");
  }, [userIsLoggedIn]);

  useEffect(() => {
    localStorage.setItem("admin_showVideoCallToMembers", showVideoCallToMembers ? "true" : "false");
  }, [showVideoCallToMembers]);

  useEffect(() => {
    localStorage.setItem("admin_showVendorsToMembers", showVendorsToMembers ? "true" : "false");
  }, [showVendorsToMembers]);
  
  // Font scale fixed to a highly readable, majestic 1.1x scale for Brahmin family elders as requested
  const fontScale = 1.1;
  
  // Role-based auth state (default is member, admin roles can be unlocked)
  const [userRole, setUserRole] = useState<"member" | "super_admin" | "moderator" | "support_admin">("member");

  // Sync candidate if the selected one is deleted
  useEffect(() => {
    if (selectedCandidate && !profiles.some(p => p.id === selectedCandidate.id)) {
      setSelectedCandidate(profiles[0] || null);
    }
  }, [profiles, selectedCandidate]);

  // Prevent members from accessing integration, admin, and audit panels
  useEffect(() => {
    if ((activeTab === "integration" || activeTab === "admin" || activeTab === "audit") && userRole === "member") {
      setActiveTab("discover");
    }
  }, [activeTab, userRole]);

  // Redirect standard member if trying to access hidden tabs
  useEffect(() => {
    if (!SHOW_VIDEO_CALL_TAB_OPTION && activeTab === "video") {
      setActiveTab("discover");
      return;
    }
    if (userRole === "member") {
      if (activeTab === "video" && !showVideoCallToMembers) {
        setActiveTab("discover");
      }
      if (activeTab === "vendors" && !showVendorsToMembers) {
        setActiveTab("discover");
      }
    }
  }, [activeTab, userRole, showVideoCallToMembers, showVendorsToMembers]);

  const handleSelectCompatibility = (profile: Profile) => {
    setSelectedCandidate(profile);
    setActiveTab("compatibility");
  };

  const handleSelectChat = (profile: Profile) => {
    setSelectedCandidate(profile);
    setActiveTab("messages");
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddProfile = (newProfile: Profile) => {
    setProfiles((prev) => [newProfile, ...prev]);
  };

  const handleUpdateProfile = (updated: Profile) => {
    setProfiles((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  };

  return (
    <div 
      style={{ fontSize: `${fontScale}rem` }} 
      className="min-h-screen bg-[#FAF2DC] text-[#120A05] font-sans flex flex-col justify-between transition-all duration-300"
    >
      
      {/* Platform Navigation Header */}
      <Header
        userVerified={userVerified}
        onNavigateToVerify={() => setActiveTab("verify")}
        userRole={userRole}
        onChangeUserRole={setUserRole}
        userIsLoggedIn={userIsLoggedIn}
        onSetUserIsLoggedIn={setUserIsLoggedIn}
        onSetUserVerified={setUserVerified}
      />

      {/* TOP NAVIGATION TABS BAR - Elite light theme with amber/gold accents */}
      <nav className="w-full bg-[#FFFFFF] border-b border-amber-600/30 backdrop-blur-md py-3 px-4 shadow-md flex flex-wrap justify-around items-center gap-1.5 sticky top-[72px] z-50">
        <div className="max-w-6xl w-full mx-auto flex flex-wrap justify-around items-center gap-2">
          {/* Tab 1: Discover / Matches */}
          <button
            id="nav-tab-discover"
            onClick={() => setActiveTab("discover")}
            className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === "discover"
                ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                : "text-slate-600 hover:text-amber-800"
            }`}
          >
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600/20" />
            <span className="text-xs font-serif tracking-wide uppercase">{t("matches")}</span>
          </button>

          {/* Tab 2: Compatibility */}
          <button
            id="nav-tab-compatibility"
            onClick={() => setActiveTab("compatibility")}
            className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === "compatibility"
                ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                : "text-slate-600 hover:text-amber-800"
            }`}
          >
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-serif tracking-wide uppercase">{t("compatibility")}</span>
          </button>

          {/* Tab 2.5: Horoscope Sync */}
          <button
            id="nav-tab-horoscope"
            onClick={() => setActiveTab("horoscope")}
            className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === "horoscope"
                ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                : "text-slate-600 hover:text-amber-800"
            }`}
          >
            <Compass className="w-4 h-4 text-amber-600 animate-spin-slow" />
            <span className="text-xs font-serif tracking-wide uppercase">Horoscope Match</span>
          </button>

          {/* Tab 3: Encrypted Chat */}
          <button
            id="nav-tab-messages"
            onClick={() => setActiveTab("messages")}
            className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === "messages"
                ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                : "text-slate-600 hover:text-amber-800"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-serif tracking-wide uppercase">{t("chat")}</span>
          </button>

          {/* Tab 4: P2P Calls - Conditionally visible to members - TEMPORARILY HIDDEN */}
          {SHOW_VIDEO_CALL_TAB_OPTION && (userRole !== "member" || showVideoCallToMembers) && (
            <button
              id="nav-tab-video"
              onClick={() => setActiveTab("video")}
              className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "video"
                  ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                  : "text-slate-600 hover:text-amber-800"
              }`}
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-serif tracking-wide uppercase">{t("videoCall")}</span>
            </button>
          )}

          {/* Tab 5: Vendors Platform (Online Store) - Conditionally visible to members */}
          {(userRole !== "member" || showVendorsToMembers) && (
            <button
              id="nav-tab-vendors"
              onClick={() => setActiveTab("vendors")}
              className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "vendors"
                  ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                  : "text-slate-600 hover:text-amber-800"
              }`}
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-serif tracking-wide uppercase">{t("vendorsHub")}</span>
            </button>
          )}


          {/* Tab 7: Self Audit - Visible to ADMINS ONLY as per request */}
          {userIsLoggedIn && userRole !== "member" && (
            <button
              id="nav-tab-audit"
              onClick={() => setActiveTab("audit")}
              className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "audit"
                  ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                  : "text-slate-600 hover:text-amber-800"
              }`}
            >
              <Activity className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="text-xs font-serif tracking-wide uppercase text-rose-800">{t("selfAudit")}</span>
            </button>
          )}

          {/* Tab 7b: Dedicated Login Tab */}
          {!userIsLoggedIn && (
            <button
              id="nav-tab-login"
              onClick={() => setActiveTab("login")}
              className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "login"
                  ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105 animate-pulse"
                  : "text-slate-600 hover:text-amber-800"
              }`}
            >
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-serif tracking-wide uppercase font-bold">Login Tab</span>
            </button>
          )}

          {/* Tab 8: Integration Panel - ONLY visible to Admins/Moderators */}
          {userRole !== "member" && (
            <button
              id="nav-tab-integration"
              onClick={() => setActiveTab("integration")}
              className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "integration"
                  ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                  : "text-slate-600 hover:text-amber-800"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-serif tracking-wide uppercase font-bold">Integration</span>
            </button>
          )}

          {/* Tab 9: Admin Dashboard - ONLY visible to Admins/Moderators */}
          {userRole !== "member" && (
            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab("admin")}
              className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "admin"
                  ? "text-amber-800 bg-amber-500/15 border border-amber-500/40 font-bold scale-105"
                  : "text-slate-600 hover:text-amber-800"
              }`}
            >
              <Shield className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="text-xs font-serif tracking-wide uppercase font-bold">Admin Dashboard</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main View Area with Responsive Spacing */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6">
        {!userIsLoggedIn && activeTab !== "verify" && activeTab !== "login" && activeTab !== "horoscope" ? (
          /* Vibrant, traditional landing page instead of plain directory lock */
          <VibrantLandingHome
            onRegisterClick={() => setActiveTab("verify")}
            onLoginClick={() => setActiveTab("login")}
            totalProfilesCount={76540 + profiles.length}
            verifiedProfilesCount={4700 + profiles.filter(p => p.verified).length}
            successfulMarriagesCount={8310 + profiles.filter(p => p.currentMilestone === "Married" || p.currentMilestone === "Happy Testimony").length}
          />
        ) : (
          /* Normal Tab Content rendering when logged in, or when on the register tab */
          <Suspense fallback={<TabLoadingSkeleton />}>
            {activeTab === "discover" && (
              <div className="animate-fadeIn">
                <DiscoverTab
                  profiles={profiles}
                  userRole={userRole}
                  onDeleteProfile={handleDeleteProfile}
                  onAddProfile={handleAddProfile}
                  onSelectCompatibility={handleSelectCompatibility}
                  onSelectChat={handleSelectChat}
                  onUpdateProfile={handleUpdateProfile}
                />
              </div>
            )}

            {activeTab === "compatibility" && (
              <div className="animate-fadeIn">
                <CompatibilityTab
                  selectedCandidate={selectedCandidate}
                  allCandidates={profiles}
                  onSelectCandidate={setSelectedCandidate}
                  onNavigateToTab={setActiveTab}
                />
              </div>
            )}

            {activeTab === "horoscope" && (
              <div className="animate-fadeIn">
                <HoroscopeTab />
              </div>
            )}

            {activeTab === "messages" && (
              <div className="animate-fadeIn">
                <MessageTab
                  selectedCandidate={selectedCandidate}
                  allCandidates={profiles}
                  onSelectCandidate={setSelectedCandidate}
                  onNavigateToTab={setActiveTab}
                />
              </div>
            )}

            {activeTab === "video" && (
              <div className="animate-fadeIn">
                <VideoCallTab
                  selectedCandidate={selectedCandidate}
                  allCandidates={profiles}
                  onSelectCandidate={setSelectedCandidate}
                  onNavigateToTab={setActiveTab}
                />
              </div>
            )}

            {activeTab === "verify" && (
              <div className="animate-fadeIn">
                <VerificationTab
                  userVerified={userVerified}
                  onSetUserVerified={setUserVerified}
                  onNavigateToTab={setActiveTab}
                />
              </div>
            )}

            {activeTab === "vendors" && (
              <div className="animate-fadeIn">
                <VendorsTab onNavigateToTab={setActiveTab} />
              </div>
            )}

            {activeTab === "audit" && (
              <div className="animate-fadeIn">
                <SelfAuditTab 
                  profiles={profiles} 
                  onUpdateProfile={handleUpdateProfile} 
                  userRole={userRole}
                  showVideoCallToMembers={showVideoCallToMembers}
                  onToggleVideoCall={setShowVideoCallToMembers}
                  showVendorsToMembers={showVendorsToMembers}
                  onToggleVendors={setShowVendorsToMembers}
                  onNavigateToTab={setActiveTab}
                />
              </div>
            )}

            {activeTab === "integration" && userRole !== "member" && (
              <div className="animate-fadeIn">
                <IntegrationTab onNavigateToTab={setActiveTab} />
              </div>
            )}

            {activeTab === "admin" && userRole !== "member" && (
              <div className="animate-fadeIn">
                <AdminDashboardTab 
                  profiles={profiles}
                  onUpdateProfile={handleUpdateProfile}
                  userRole={userRole}
                  onNavigateToTab={setActiveTab}
                />
              </div>
            )}

            {activeTab === "login" && (
              <div className="animate-fadeIn">
                <LoginTab
                  onLoginSuccess={(role) => {
                    setUserRole(role);
                    setUserIsLoggedIn(true);
                    if (role === "member") {
                      setUserVerified(true);
                      setActiveTab("discover");
                    } else {
                      setActiveTab("admin");
                    }
                  }}
                  userIsLoggedIn={userIsLoggedIn}
                  userRole={userRole}
                  onLogout={() => {
                    setUserIsLoggedIn(false);
                    setUserRole("member");
                  }}
                  onNavigateToRegister={() => setActiveTab("verify")}
                />
              </div>
            )}
          </Suspense>
        )}
      </main>

      {/* Traditional Auspicious Footer */}
      <footer className="bg-[#EFE8D9] border-t-2 border-amber-600/40 py-8 text-center text-sm text-amber-950 font-serif">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-black text-[#7C1C13]">
            <button onClick={() => handleOpenLegal("privacy")} className="hover:text-amber-800 transition-colors cursor-pointer">Privacy Policy</button>
            <span className="text-amber-800/40">|</span>
            <button onClick={() => handleOpenLegal("terms")} className="hover:text-amber-800 transition-colors cursor-pointer">Terms & Conditions</button>
            <span className="text-amber-800/40">|</span>
            <button onClick={() => handleOpenLegal("refund")} className="hover:text-amber-800 transition-colors cursor-pointer">Refund Policy</button>
            <span className="text-amber-800/40">|</span>
            <button onClick={() => handleOpenLegal("cookie")} className="hover:text-amber-800 transition-colors cursor-pointer">Cookie Policy</button>
            <span className="text-amber-800/40">|</span>
            <button onClick={() => handleOpenLegal("ai")} className="hover:text-amber-800 transition-colors cursor-pointer">AI Disclaimer</button>
            <span className="text-amber-800/40">|</span>
            <button onClick={() => handleOpenLegal("consent")} className="hover:text-amber-800 transition-colors cursor-pointer">Consent Screens</button>
          </div>
          <div className="space-y-1">
            <p className="tracking-wide text-xs font-bold text-slate-800">© 2026 Brahmin-Heritage Matrimony. All rights reserved.</p>
            <p className="text-xs font-semibold text-slate-700">Dedicated to Preserving Cultural Roots, Sacred Gotra Sanctity, Vedic Horoscope & Astra Kundali Harmony.</p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner and Legal Modals */}
      <CookieConsentBanner onOpenLegal={handleOpenLegal} />
      <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} defaultTab={legalTab} />

    </div>
  );
}
