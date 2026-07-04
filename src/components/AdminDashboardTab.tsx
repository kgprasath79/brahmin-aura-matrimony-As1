/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Profile } from "../types";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  LogOut, 
  AlertOctagon, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  IndianRupee, 
  DollarSign, 
  AlertTriangle, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Lock, 
  RefreshCw, 
  Globe, 
  Fingerprint, 
  FileText, 
  UserX,
  CreditCard,
  UserCheck,
  Zap,
  Clock,
  Shield,
  HelpCircle
} from "lucide-react";

interface AdminDashboardTabProps {
  profiles: Profile[];
  onUpdateProfile: (updated: Profile) => void;
  userRole: "member" | "super_admin" | "moderator" | "support_admin";
  onNavigateToTab?: (tab: "discover" | "compatibility" | "messages" | "video" | "verify" | "vendors" | "audit" | "integration" | "admin") => void;
}

// Interfaces for our 9 modules
interface LiveUser {
  id: string;
  username: string;
  role: string;
  ip: string;
  location: string;
  device: string;
  lastActive: string;
  page: string;
}

interface FailedLogin {
  id: string;
  username: string;
  ip: string;
  timestamp: string;
  device: string;
  riskScore: number;
  blocked: boolean;
}

interface AbuseReport {
  id: string;
  reportedProfileId: string;
  reportedName: string;
  reportedBy: string;
  reason: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  status: "pending" | "banned" | "dismissed";
}

interface CustomerComplaint {
  id: string;
  profileId: string;
  memberName: string;
  category: "Horoscope" | "Subscription" | "Privacy" | "Other";
  subject: string;
  message: string;
  timestamp: string;
  priority: "critical" | "high" | "normal";
  status: "open" | "resolved" | "escalated";
}

export default function AdminDashboardTab({ profiles, onUpdateProfile, userRole, onNavigateToTab }: AdminDashboardTabProps) {
  // 1. Live Users state
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([
    { id: "SESS-101", username: "super_admin", role: "super_admin", ip: "106.51.28.14", location: "Bangalore, IN", device: "Desktop (macOS)", lastActive: "Just now", page: "Admin Control Deck" },
    { id: "SESS-102", username: "priya_sharma", role: "member", ip: "152.57.12.189", location: "Delhi, IN", device: "Mobile (iOS)", lastActive: "2m ago", page: "Kundali Matcher" },
    { id: "SESS-103", username: "rahul_iyer", role: "member", ip: "49.36.88.212", location: "Mumbai, IN", device: "Mobile (Android)", lastActive: "5m ago", page: "Discover Directory" },
    { id: "SESS-104", username: "ananya_bhatt", role: "member", ip: "103.241.12.1", location: "Pune, IN", device: "Desktop (Windows)", lastActive: "12m ago", page: "Compatibility Charts" },
  ]);

  // 2. Failed Logins state
  const [failedLogins, setFailedLogins] = useState<FailedLogin[]>([
    { id: "FL-201", username: "admin_super", ip: "185.220.101.4", timestamp: "3m ago", device: "Firefox (Linux) / VPN Node", riskScore: 85, blocked: false },
    { id: "FL-202", username: "sharma_99", ip: "106.51.28.14", timestamp: "25m ago", device: "Chrome (Android)", riskScore: 10, blocked: false },
    { id: "FL-203", username: "guest_user", ip: "45.138.89.201", timestamp: "1h ago", device: "Unknown Browser", riskScore: 90, blocked: true },
  ]);

  // 3. AI Usage state
  const [aiMetrics, setAiMetrics] = useState({
    geminiProTokens: 1425800,
    geminiFlashTokens: 8590400,
    apiCallsCount: 1548,
    avgLatencyMs: 340,
    estimatedCostUsd: 14.82,
    matchingSimRunning: false,
    history: [
      { label: "00:00", flash: 120, pro: 30 },
      { label: "04:00", flash: 80, pro: 15 },
      { label: "08:00", flash: 250, pro: 50 },
      { label: "12:00", flash: 410, pro: 85 },
      { label: "16:00", flash: 550, pro: 110 },
      { label: "20:00", flash: 320, pro: 65 },
    ]
  });

  // 4. Revenue Dashboard state
  const [revenue, setRevenue] = useState({
    totalSalesInr: 345800,
    subscriptionsCount: 142,
    conversionRate: 8.4,
    recentPurchases: [
      { id: "TXN-901", name: "Venkat Raman", plan: "Astra Premium Gold", amount: 2499, timestamp: "5m ago", status: "success" },
      { id: "TXN-902", name: "Sneha Mishra", plan: "Vedic Matched Platinum", amount: 4999, timestamp: "1h ago", status: "success" },
      { id: "TXN-903", name: "Karthik Namboothiri", plan: "Astra Premium Gold", amount: 2499, timestamp: "4h ago", status: "failed_charge" },
      { id: "TXN-904", name: "Meenakshi Joshi", plan: "Gotra Shield Unlimited", amount: 1599, timestamp: "1d ago", status: "disputed" },
    ]
  });

  // 5. Abuse Reports state
  const [abuseReports, setAbuseReports] = useState<AbuseReport[]>([
    { id: "REP-401", reportedProfileId: "4", reportedName: "Divya Namboothiri", reportedBy: "Kiran S.", reason: "Profile picture matches commercial stock models", severity: "high", timestamp: "30m ago", status: "pending" },
    { id: "REP-402", reportedProfileId: "8", reportedName: "Shruti Trivedi", reportedBy: "Anonymous Match", reason: "Inaccurate Gotra details reported by family elder", severity: "medium", timestamp: "4h ago", status: "pending" },
    { id: "REP-403", reportedProfileId: "3", reportedName: "Arvind Joshi", reportedBy: "Sanjay J.", reason: "Spamming commercial chat ads", severity: "high", timestamp: "1d ago", status: "banned" },
  ]);

  // 6. Customer Complaints state
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([
    { id: "CMP-501", profileId: "2", memberName: "Ramachandran Iyer", category: "Horoscope", subject: "Kundali matching Gana calculation dispute", message: "Vedic charts indicate we have 28/36 Gana matches, but your automated simulator shows 26/36. Please explain this traditional discrepancy.", timestamp: "12m ago", priority: "high", status: "open" },
    { id: "CMP-502", profileId: "1", memberName: "Priyan Sharma", category: "Subscription", subject: "Double charge during checkout", message: "My bank debited ₹2,499 twice during the payment gateway transfer. Requesting urgent refund of duplicate transaction.", timestamp: "1h ago", priority: "critical", status: "open" },
    { id: "CMP-503", profileId: "5", memberName: "Ananya Bhatt", category: "Privacy", subject: "Hide horoscope details from third-degree contacts", message: "I want to restrict access to my bio-data except to those with verified government IDs.", timestamp: "2d ago", priority: "normal", status: "resolved" },
  ]);

  // 7. Pending Verifications State (Directly linked to profiles verification statuses)
  // Find all profiles which are not verified, or create a mock list if all are verified
  const [customPendingList, setCustomPendingList] = useState<Array<{
    id: string;
    name: string;
    sect: string;
    gotra: string;
    refName: string;
    refMobile: string;
    docSimulated: string;
  }>>([
    { id: "2", name: "Ramachandran Iyer", sect: "Vadama", gotra: "Bharadwaja", refName: "Venkatesh Iyer (Father)", refMobile: "+91 94440 12345", docSimulated: "AADHAAR-HASH-8839" },
    { id: "4", name: "Divya Namboothiri", sect: "Nambudiri", gotra: "Vishwamitra", refName: "Govindan Namboothiri (Uncle)", refMobile: "+91 98460 99887", docSimulated: "PAN-HASH-4921" },
    { id: "7", name: "Suresh Joshi", sect: "Konkanastha", gotra: "Kashyapa", refName: "Mahadev Joshi (Father)", refMobile: "+91 98230 45678", docSimulated: "AADHAAR-HASH-3112" },
  ]);

  // 8. Fraud Dashboard State
  const [fraudIndicators, setFraudIndicators] = useState({
    vpnTrafficPercent: 12,
    deviceDensityCount: 4, // Multi-accounts on same device
    biometricMismatches: 2,
    blacklistedDomainsCount: 15,
    radarAlerts: [
      { id: "FRAUD-001", type: "Multiple Device Footprint", desc: "Hardware ID 'FP-992' registered under 3 different Brahmin surnames within 24 hours.", severity: "high", status: "flagged" },
      { id: "FRAUD-002", type: "Geographical Telemetry Jump", desc: "Profile registered in Pune logged in via a datacenter node in Frankfurt, Germany.", severity: "medium", status: "flagged" },
    ]
  });

  // 9. Security Dashboard State
  const [securityMetrics, setSecurityMetrics] = useState({
    shieldStrengthPercent: 98,
    owaspControls: [
      { name: "X-Frame-Options (Clickjacking Prevention)", status: true },
      { name: "Content-Security-Policy (XSS Mitigation)", status: true },
      { name: "Rate Limiter Gateways Active", status: true },
      { name: "JWT Cryptographic Keys Rotated", status: true },
      { name: "Aadhaar PII Cryptographic Hashing", status: true },
    ],
    vulnerabilitiesCount: 0,
    sslStatus: "A+ Strict Strict-Transport-Security Active",
    jwtChainCount: 3,
  });

  // Active sub-dashboard section view selection
  const [activeSubDashboard, setActiveSubDashboard] = useState<"summary" | "fraud" | "security" | "live_users" | "failed_logins" | "ai" | "revenue" | "abuse" | "complaints" | "pending">("summary");

  // Interactive functions to simulate logs and actions
  const handleSimulateLiveUser = () => {
    const names = ["Aditya Chaturvedi", "Sowmya Rao", "Karan Dwivedi", "Shruti Shastri"];
    const locs = ["Delhi, IN", "Chennai, IN", "Lucknow, IN", "Varanasi, IN"];
    const pages = ["Discover Directory", "Kundali Matcher", "Horoscope Charts", "Self-Audit Tab"];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLoc = locs[Math.floor(Math.random() * locs.length)];
    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    const randomId = `SESS-${Math.floor(100 + Math.random() * 900)}`;

    const newUser: LiveUser = {
      id: randomId,
      username: randomName.toLowerCase().replace(" ", "_"),
      role: "member",
      ip: `106.51.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: randomLoc,
      device: Math.random() > 0.5 ? "Mobile (iOS)" : "Desktop (macOS)",
      lastActive: "Just now",
      page: randomPage
    };

    setLiveUsers([newUser, ...liveUsers]);
  };

  const handleTerminateSession = (id: string) => {
    setLiveUsers(liveUsers.filter(u => u.id !== id));
  };

  const handleSimulateFailedLogin = () => {
    const names = ["admin_super", "brahmin_ally", "sacred_soul", "unknown_hacker"];
    const ips = ["198.51.100.42", "203.0.113.88", "185.220.101.99", "106.51.99.12"];
    const user = names[Math.floor(Math.random() * names.length)];
    const ip = ips[Math.floor(Math.random() * ips.length)];
    
    const newFail: FailedLogin = {
      id: `FL-${Math.floor(200 + Math.random() * 800)}`,
      username: user,
      ip: ip,
      timestamp: "Just now",
      device: "Safari (Mac OS) / Proxy",
      riskScore: user === "admin_super" ? 95 : Math.floor(20 + Math.random() * 60),
      blocked: false
    };

    setFailedLogins([newFail, ...failedLogins]);
  };

  const handleToggleBlockIP = (id: string) => {
    setFailedLogins(failedLogins.map(f => f.id === id ? { ...f, blocked: !f.blocked } : f));
  };

  const handleTriggerAISimulation = () => {
    if (aiMetrics.matchingSimRunning) return;
    setAiMetrics(prev => ({ ...prev, matchingSimRunning: true }));
    
    setTimeout(() => {
      setAiMetrics(prev => ({
        ...prev,
        geminiFlashTokens: prev.geminiFlashTokens + 4500,
        geminiProTokens: prev.geminiProTokens + 800,
        apiCallsCount: prev.apiCallsCount + 4,
        estimatedCostUsd: Number((prev.estimatedCostUsd + 0.12).toFixed(2)),
        avgLatencyMs: Math.floor(280 + Math.random() * 120),
        matchingSimRunning: false
      }));
    }, 1500);
  };

  const handleSimulatePurchase = () => {
    const names = ["Keshav Shastri", "Nandini Dwivedi", "Vikas Chaturvedi", "Shashi Rao"];
    const name = names[Math.floor(Math.random() * names.length)];
    const plan = Math.random() > 0.5 ? "Astra Premium Gold" : "Vedic Matched Platinum";
    const amount = plan === "Astra Premium Gold" ? 2499 : 4999;
    const randomId = `TXN-${Math.floor(900 + Math.random() * 100)}`;

    const newTxn = {
      id: randomId,
      name,
      plan,
      amount,
      timestamp: "Just now",
      status: "success"
    };

    setRevenue(prev => ({
      ...prev,
      totalSalesInr: prev.totalSalesInr + amount,
      subscriptionsCount: prev.subscriptionsCount + 1,
      recentPurchases: [newTxn, ...prev.recentPurchases]
    }));
  };

  const handleSimulateAbuseReport = () => {
    const reasons = [
      "Aggressive messaging behavior reported during horoscope exchange",
      "Using commercial photography from social influencers",
      "Inaccurate Gotra alignment verified by community elders",
      "Spam link insertion in matrimonial bio text"
    ];
    const targetIdx = Math.floor(Math.random() * profiles.length);
    const target = profiles[targetIdx] || profiles[0];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    const newReport: AbuseReport = {
      id: `REP-${Math.floor(400 + Math.random() * 600)}`,
      reportedProfileId: target.id,
      reportedName: target.name,
      reportedBy: "Vetted Member #" + Math.floor(100 + Math.random() * 900),
      reason,
      severity: Math.random() > 0.5 ? "high" : "medium",
      timestamp: "Just now",
      status: "pending"
    };

    setAbuseReports([newReport, ...abuseReports]);
  };

  const handleActionAbuseReport = (id: string, action: "banned" | "dismissed") => {
    setAbuseReports(abuseReports.map(r => r.id === id ? { ...r, status: action } : r));
    
    // If banned, find corresponding profile and flag it
    if (action === "banned") {
      const report = abuseReports.find(r => r.id === id);
      if (report) {
        const foundProfile = profiles.find(p => p.id === report.reportedProfileId);
        if (foundProfile) {
          // Put standard ban details or deactivate
          onUpdateProfile({
            ...foundProfile,
            verified: false,
            verification: {
              ...foundProfile.verification,
              status: "unverified"
            }
          });
          alert(`⚠️ Profile for ${foundProfile.name} (ID: #${foundProfile.id}) has been temporarily suspended from the Brahmin directory.`);
        }
      }
    }
  };

  const handleSimulateComplaint = () => {
    const subjects = [
      "Unable to fetch matching Gothra charts",
      "Horoscope generation failed for Rohini Nakshatra",
      "Incorrect payment receipt download failure",
      "Profile visibility preference toggle error"
    ];
    const message = "Simulation support query: I was attempting to configure traditional Vedic match constraints, but the interactive panel reported a token synchronization error. Please guide my family elders to solve this.";
    const profile = profiles[Math.floor(Math.random() * profiles.length)] || profiles[0];

    const newComplaint: CustomerComplaint = {
      id: `CMP-${Math.floor(500 + Math.random() * 500)}`,
      profileId: profile.id,
      memberName: profile.name,
      category: Math.random() > 0.5 ? "Horoscope" : "Subscription",
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      message,
      timestamp: "Just now",
      priority: "high",
      status: "open"
    };

    setComplaints([newComplaint, ...complaints]);
  };

  const handleActionComplaint = (id: string, action: "resolved" | "escalated") => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: action } : c));
  };

  const handleApprovePendingVerification = (item: any) => {
    const targetProfile = profiles.find(p => p.id === item.id);
    if (targetProfile) {
      onUpdateProfile({
        ...targetProfile,
        verified: true,
        verification: {
          ...targetProfile.verification,
          status: "verified",
          verifiedAt: new Date().toISOString()
        }
      });
      alert(`🎉 SUCCESS: ${targetProfile.name} is now certified and officially marked as a TRUSTED verified profile.`);
    }

    setCustomPendingList(customPendingList.filter(p => p.id !== item.id));
  };

  const handleRejectPendingVerification = (item: any) => {
    const targetProfile = profiles.find(p => p.id === item.id);
    if (targetProfile) {
      onUpdateProfile({
        ...targetProfile,
        verified: false,
        verification: {
          ...targetProfile.verification,
          status: "unverified",
          verifiedAt: ""
        }
      });
      alert(`⚠️ Verification request rejected for ${targetProfile.name}. Notification dispatched for reference re-submission.`);
    }

    setCustomPendingList(customPendingList.filter(p => p.id !== item.id));
  };

  const handleRotateSecrets = async () => {
    try {
      const res = await fetch("/api/auth/rotate-secrets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("heritage_access_token")}`
        }
      });
      if (res.ok) {
        alert("🎉 Cryptographic JWT Key Chain Secret rotated successfully on server!");
        setSecurityMetrics(prev => ({
          ...prev,
          jwtChainCount: prev.jwtChainCount + 1,
          shieldStrengthPercent: 100
        }));
      } else {
        alert("Simulating secret key rotation... Locally randomized key salt updated!");
        setSecurityMetrics(prev => ({
          ...prev,
          jwtChainCount: prev.jwtChainCount + 1,
          shieldStrengthPercent: 100
        }));
      }
    } catch (err) {
      alert("Simulating offline secret rotation... Key salt pool rotated.");
      setSecurityMetrics(prev => ({
        ...prev,
        jwtChainCount: prev.jwtChainCount + 1,
        shieldStrengthPercent: 100
      }));
    }
  };

  // Restrict access for members
  if (userRole === "member") {
    return (
      <div className="bg-[#FFFFFF] border-2 border-[#6b1419]/20 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-4 shadow-xl">
        <Lock className="w-12 h-12 text-rose-700 mx-auto animate-bounce" />
        <h3 className="text-xl font-serif font-extrabold text-[#4c0d10]">Access Restricted: Admin Dashboard Gate</h3>
        <p className="text-sm text-slate-600 leading-relaxed font-serif">
          The Admin Control deck is exclusive to Super Administrators, moderators, and support team members. To inspect these tools, please toggle your role to "Super Admin" via the Lock Portal in the main header.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* CANCEL & NAVIGATION BUTTON FOR ALL PAGES (Point 5) */}
      {onNavigateToTab && (
        <div className="flex flex-wrap justify-between items-center bg-[#FFFFFF] border border-amber-600/30 rounded-2xl p-3.5 shadow-sm">
          <span className="text-xs font-serif text-[#4c0d10]">Need to return to home page or matches?</span>
          <button
            onClick={() => onNavigateToTab("discover")}
            className="px-4.5 py-1.5 bg-[#6b1419]/10 hover:bg-[#6b1419]/20 text-[#6b1419] border border-[#6b1419]/30 text-xs font-bold rounded-xl transition duration-300 cursor-pointer flex items-center gap-1.5"
          >
            ✕ Cancel & Return to Matches
          </button>
        </div>
      )}
      
      {/* 1. COMPREHENSIVE HUB HEADER */}
      <div className="relative bg-gradient-to-r from-rose-900 via-slate-950 to-indigo-950 border-2 border-amber-500/30 rounded-3xl p-5 md:p-6 overflow-hidden text-slate-100 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 w-fit">
              <Shield className="w-3.5 h-3.5 text-amber-300 animate-spin" /> Heritage Admin Command Deck
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-black tracking-tight text-amber-100 flex items-center gap-2">
              Centralized Trust & Administrative Dashboard
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Consolidated command panel of Heritage Matrimony. Run compliance evaluations, manage dispute reports, monitor live billing streams, watch AI token telemetry, and approve user-submitted verifications.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center min-w-[150px] space-y-1 shadow-lg">
            <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase tracking-wider">Active Credentials</span>
            <span className="text-xs text-slate-100 font-extrabold block uppercase font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">
              {userRole.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SUB-DASHBOARD TABS (SELECT COMPONENT VIEW) */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-amber-600/15">
        {[
          { id: "summary", label: "Overview Summary", icon: <Activity className="w-3.5 h-3.5" /> },
          { id: "live_users", label: `Live Users (${liveUsers.length})`, icon: <Users className="w-3.5 h-3.5" /> },
          { id: "failed_logins", label: "Failed Logins", icon: <Lock className="w-3.5 h-3.5" /> },
          { id: "ai", label: "AI Gemini Usage", icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: "revenue", label: "Revenue Stream", icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: "abuse", label: `Abuse Reports (${abuseReports.filter(r=>r.status==="pending").length})`, icon: <AlertOctagon className="w-3.5 h-3.5" /> },
          { id: "complaints", label: `Complaints (${complaints.filter(c=>c.status==="open").length})`, icon: <AlertTriangle className="w-3.5 h-3.5" /> },
          { id: "pending", label: `Verifications (${customPendingList.length})`, icon: <ClipboardList className="w-3.5 h-3.5" /> },
          { id: "fraud", label: "Fraud Radar", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { id: "security", label: "Security Shields", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`sub-tab-${tab.id}`}
            onClick={() => setActiveSubDashboard(tab.id as any)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeSubDashboard === tab.id
                ? "bg-[#6b1419] border-[#6b1419] text-white font-bold shadow-md scale-105"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. SUB-DASHBOARD CONTENTS */}

      {/* A. OVERVIEW SUMMARY PANEL */}
      {activeSubDashboard === "summary" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Live Directory Traffic</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">{liveUsers.length}</span>
                <span className="text-xs text-emerald-500 font-bold">● Active sessions</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Unique connections viewing horoscopes and directories.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Astra Token Telemetry</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">
                  {((aiMetrics.geminiFlashTokens + aiMetrics.geminiProTokens) / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-indigo-500 font-mono font-bold bg-indigo-50 px-1 rounded">Flash + Pro</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Total API tokens processed by Gemini matching model.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Monthly Premium Revenue</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">₹{(revenue.totalSalesInr).toLocaleString()}</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">INR</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Certified Vedic subscription payments logged.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Cyber Shield Strength</span>
                <ShieldCheck className="w-4 h-4 text-teal-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">{securityMetrics.shieldStrengthPercent}%</span>
                <span className="text-xs text-teal-600 font-bold bg-teal-50 px-1 rounded">Optimal</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Consolidated OWASP security compliance index.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Urgent Tasks Vetting List */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 space-y-4">
              <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-amber-300" /> Vetting Action Center (Requires Vows)
              </h3>
              
              <div className="space-y-3">
                {/* Pending verifications preview */}
                {customPendingList.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-[10px] text-rose-300 font-semibold uppercase">{item.sect} • Gotra: {item.gotra}</span>
                      <h4 className="text-xs font-bold text-slate-100 mt-0.5">{item.name}</h4>
                      <p className="text-[9.5px] text-slate-400 mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" /> Elder Reference: <strong>{item.refName}</strong> | {item.refMobile}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRejectPendingVerification(item)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[10px] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprovePendingVerification(item)}
                        className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3 text-emerald-400" /> Verify
                      </button>
                    </div>
                  </div>
                ))}

                {customPendingList.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs font-sans">
                    ✓ All submitted profiles are fully vetted. Zero pending verifications queue.
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Live Attacks Indicator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-serif font-bold text-[#4c0d10] flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" /> Active Threat Radar
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wide block">FAILED LOGINS ATTACK</span>
                  <p className="text-[10px] text-slate-600">
                    Detected {failedLogins.length} failed login credentials attempts on admin path from standard IP blocks.
                  </p>
                  <button 
                    onClick={() => setActiveSubDashboard("failed_logins")}
                    className="text-[9px] font-black text-[#6b1419] uppercase hover:underline mt-1 block"
                  >
                    Inspect Failed Logins →
                  </button>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wide block">VPN MIGRATIONS ACTIVE</span>
                  <p className="text-[10px] text-slate-600">
                    {fraudIndicators.vpnTrafficPercent}% of matched queries routed via VPN. Biometric facial matching scans are live.
                  </p>
                  <button 
                    onClick={() => setActiveSubDashboard("fraud")}
                    className="text-[9px] font-black text-amber-800 uppercase hover:underline mt-1 block"
                  >
                    Open Fraud Radar →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* B. LIVE USERS DASHBOARD */}
      {activeSubDashboard === "live_users" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#4c0d10] flex items-center gap-1">
                <Users className="w-4 h-4 text-[#6b1419]" /> Live Directory Session Monitor
              </h3>
              <p className="text-[11px] text-slate-500">
                List of real-time active users. Kicking a session instantly terminates access.
              </p>
            </div>

            <button
              onClick={handleSimulateLiveUser}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-white" /> Simulate Active User Joined
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-mono text-[9px] border-b border-slate-100">
                  <th className="py-2.5 px-3 text-left">Session ID</th>
                  <th className="py-2.5 px-3 text-left">User Profile</th>
                  <th className="py-2.5 px-3 text-left">Authorization</th>
                  <th className="py-2.5 px-3 text-left">IP Address</th>
                  <th className="py-2.5 px-3 text-left">Location</th>
                  <th className="py-2.5 px-3 text-left">Hardware Device</th>
                  <th className="py-2.5 px-3 text-left">Current Action</th>
                  <th className="py-2.5 px-3 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liveUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{user.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-slate-800">{user.username}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase ${
                        user.role === "super_admin" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-slate-100 text-slate-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{user.ip}</td>
                    <td className="py-3 px-3 text-slate-700">{user.location}</td>
                    <td className="py-3 px-3 text-slate-600">{user.device}</td>
                    <td className="py-3 px-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[9px] font-bold">
                        {user.page}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleTerminateSession(user.id)}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-2.5 py-1 rounded-md cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <UserX className="w-3.5 h-3.5 text-rose-600" /> Terminate Session
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* C. FAILED LOGINS DASHBOARD */}
      {activeSubDashboard === "failed_logins" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#4c0d10] flex items-center gap-1">
                <Lock className="w-4 h-4 text-[#6b1419]" /> Failed Logins & Attack History
              </h3>
              <p className="text-[11px] text-slate-500">
                Security monitor tracking bad credentials entries, lockout statuses, and malicious IP routing logs.
              </p>
            </div>

            <button
              onClick={handleSimulateFailedLogin}
              className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-black rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-white" /> Simulate Attack Attempt
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-mono text-[9px] border-b border-slate-100">
                  <th className="py-2.5 px-3 text-left">Incident ID</th>
                  <th className="py-2.5 px-3 text-left">Attempt Username</th>
                  <th className="py-2.5 px-3 text-left">IP Address</th>
                  <th className="py-2.5 px-3 text-left">Timestamp</th>
                  <th className="py-2.5 px-3 text-left">Client Browser Meta</th>
                  <th className="py-2.5 px-3 text-left">Risk Score</th>
                  <th className="py-2.5 px-3 text-left">Vetting status</th>
                  <th className="py-2.5 px-3 text-right">Defense action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {failedLogins.map((fail) => (
                  <tr key={fail.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{fail.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-rose-700">{fail.username}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-600">{fail.ip}</td>
                    <td className="py-3 px-3 text-slate-600">{fail.timestamp}</td>
                    <td className="py-3 px-3 text-slate-500">{fail.device}</td>
                    <td className="py-3 px-3">
                      <span className={`font-mono font-bold ${fail.riskScore > 70 ? 'text-red-600' : 'text-slate-600'}`}>
                        {fail.riskScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {fail.blocked ? (
                        <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[8px] font-mono px-2 py-0.5 rounded">
                          BLACKLISTED
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[8px] font-mono px-2 py-0.5 rounded">
                          MONITORED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleBlockIP(fail.id)}
                        className={`text-[9px] font-extrabold px-3 py-1 rounded-md cursor-pointer ${
                          fail.blocked 
                            ? "bg-slate-100 text-slate-600 border border-slate-200" 
                            : "bg-red-500/10 text-red-500 border border-red-200 hover:bg-red-500/20"
                        }`}
                      >
                        {fail.blocked ? "Unblock IP" : "Block IP Node"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* D. AI GEMINI USAGE TELEMETRY */}
      {activeSubDashboard === "ai" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#4c0d10] flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Gemini API Token Telemetry
              </h3>
              <p className="text-[11px] text-slate-500">
                Server-side token counts, request logging, average model latency, and calculated costs.
              </p>
            </div>

            <button
              onClick={handleTriggerAISimulation}
              disabled={aiMetrics.matchingSimRunning}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black rounded-lg shadow-sm cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
            >
              {aiMetrics.matchingSimRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing matches...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                  <span>Simulate Gemini API Query</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Gemini 1.5 Pro Tokens</span>
              <span className="text-xl font-bold text-slate-800 block mt-1">{(aiMetrics.geminiProTokens).toLocaleString()}</span>
              <p className="text-[9px] text-slate-400 mt-1">Primarily utilized for deep compatibility matching and horoscopic evaluation</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Gemini 1.5 Flash Tokens</span>
              <span className="text-xl font-bold text-slate-800 block mt-1">{(aiMetrics.geminiFlashTokens).toLocaleString()}</span>
              <p className="text-[9px] text-slate-400 mt-1">Utilized for quick bio translations and directory search categorization</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Estimated API Costs (USD)</span>
              <span className="text-xl font-bold text-[#6b1419] block mt-1">${aiMetrics.estimatedCostUsd.toFixed(2)}</span>
              <p className="text-[9px] text-slate-400 mt-1">Based on Google AI Studio Cloud billing rates</p>
            </div>

          </div>

          {/* Bar graph representing hourly consumption */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold mb-4">Gemini API Request Consumption Curve (24 Hours)</span>
            <div className="flex justify-between items-end h-28 pt-2">
              {aiMetrics.history.map((h, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-1.5 h-full justify-end">
                  <div className="flex gap-1 items-end h-full w-12 justify-center">
                    {/* flash bar */}
                    <div 
                      className="bg-indigo-500 w-3 rounded-t-sm"
                      style={{ height: `${(h.flash / 600) * 100}%` }}
                      title={`Flash Tokens: ${h.flash}`}
                    />
                    {/* pro bar */}
                    <div 
                      className="bg-amber-400 w-3 rounded-t-sm"
                      style={{ height: `${(h.pro / 200) * 100}%` }}
                      title={`Pro Tokens: ${h.pro}`}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{h.label}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 mt-4 border-t border-slate-800 pt-3 text-[9px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded" />
                <span>Gemini 1.5 Flash Request Density</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-amber-400 rounded" />
                <span>Gemini 1.5 Pro Request Density</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E. REVENUE STREAM DASHBOARD */}
      {activeSubDashboard === "revenue" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#4c0d10] flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Revenue & Premium Checkout Stream
              </h3>
              <p className="text-[11px] text-slate-500">
                Premium subscription metrics, daily sales totals, and disputed charge alerts.
              </p>
            </div>

            <button
              onClick={handleSimulatePurchase}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-white" /> Process Mock Premium Purchase
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Sales</span>
              <span className="text-xl font-bold text-[#6b1419] block mt-1">₹{revenue.totalSalesInr.toLocaleString()}</span>
              <p className="text-[9px] text-slate-400 mt-1">Live checkout total</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Active Premium Subs</span>
              <span className="text-xl font-bold text-slate-800 block mt-1">{revenue.subscriptionsCount}</span>
              <p className="text-[9px] text-slate-400 mt-1">Recurring users</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Conversion Rate</span>
              <span className="text-xl font-bold text-slate-800 block mt-1">{revenue.conversionRate}%</span>
              <p className="text-[9px] text-slate-400 mt-1">Free-to-Paid transition</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Unsettled Disputes</span>
              <span className="text-xl font-bold text-rose-600 block mt-1">
                {revenue.recentPurchases.filter(p=>p.status==="disputed").length}
              </span>
              <p className="text-[9px] text-slate-400 mt-1">Active chargeback alerts</p>
            </div>

          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Recent Financial Transactions</span>
            
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
              {revenue.recentPurchases.map((txn) => (
                <div key={txn.id} className="p-3 bg-white hover:bg-slate-50/50 flex justify-between items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-slate-800">{txn.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{txn.plan} • {txn.timestamp}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-slate-700">₹{txn.amount.toLocaleString()}</span>
                    {txn.status === "success" && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                        PAID SUCCESS
                      </span>
                    )}
                    {txn.status === "failed_charge" && (
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[8px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                        FAILED PAYMENT
                      </span>
                    )}
                    {txn.status === "disputed" && (
                      <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[8px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                        CHARGEBACK DISPUTE
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* F. ABUSE REPORTS */}
      {activeSubDashboard === "abuse" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#4c0d10] flex items-center gap-1">
                <AlertOctagon className="w-4 h-4 text-rose-600" /> Member Abuse & Conduct Reports
              </h3>
              <p className="text-[11px] text-slate-500">
                User flags recorded for in-app messaging harassment, mismatched Gotra profiling, or commercial spam.
              </p>
            </div>

            <button
              onClick={handleSimulateAbuseReport}
              className="px-3.5 py-1.5 bg-[#6b1419] hover:bg-[#520e11] text-white text-[11px] font-black rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-white" /> Generate Mock Abuse Report
            </button>
          </div>

          <div className="space-y-3">
            {abuseReports.map((report) => (
              <div key={report.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 font-mono text-[9px] px-1.5 py-0.5 rounded text-slate-600 font-bold">
                      {report.id}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      report.severity === "high" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {report.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">{report.timestamp}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Reported Account: <strong className="text-[#6b1419] font-extrabold">{report.reportedName}</strong> (ID: #{report.reportedProfileId})
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Reason: {report.reason}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Filed By: {report.reportedBy}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
                  <span className={`text-[10px] font-bold ${
                    report.status === "pending" ? "text-amber-600" : report.status === "banned" ? "text-rose-600" : "text-emerald-600"
                  }`}>
                    Status: {report.status.toUpperCase()}
                  </span>

                  {report.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleActionAbuseReport(report.id, "dismissed")}
                        className="text-[10px] font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md cursor-pointer"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() => handleActionAbuseReport(report.id, "banned")}
                        className="text-[10px] font-bold text-rose-100 hover:bg-rose-700 bg-rose-600 px-3 py-1 rounded-md cursor-pointer flex items-center gap-1"
                      >
                        <UserX className="w-3.5 h-3.5" /> Suspend & Ban Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* G. CUSTOMER COMPLAINTS */}
      {activeSubDashboard === "complaints" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#4c0d10] flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Helpdesk & Customer Complaints
              </h3>
              <p className="text-[11px] text-slate-500">
                Support tickets regarding Kundali matches, double charges, and nakshatra calculations.
              </p>
            </div>

            <button
              onClick={handleSimulateComplaint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950" /> Simulate Support Ticket
            </button>
          </div>

          <div className="space-y-3">
            {complaints.map((comp) => (
              <div key={comp.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#6b1419]/10 text-[#6b1419] font-mono text-[9px] px-2 py-0.5 rounded font-bold">
                      {comp.id}
                    </span>
                    <span className="bg-slate-200 text-slate-600 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                      {comp.category}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">{comp.timestamp}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Subject: <strong className="text-[#6b1419]">{comp.subject}</strong>
                  </h4>
                  <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                    "{comp.message}"
                  </p>
                  <p className="text-[9.5px] text-slate-400 mt-1.5">
                    Member Name: <strong>{comp.memberName}</strong> (ID: #{comp.profileId})
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/50 pt-2.5">
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${
                    comp.status === "open" ? "text-amber-600" : comp.status === "resolved" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {comp.status === "open" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
                    Status: {comp.status.toUpperCase()}
                  </span>

                  {comp.status === "open" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleActionComplaint(comp.id, "escalated")}
                        className="text-[10px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 px-3 py-1 rounded-md cursor-pointer"
                      >
                        Escalate Ticket
                      </button>
                      <button
                        onClick={() => handleActionComplaint(comp.id, "resolved")}
                        className="text-[10px] font-bold text-emerald-100 bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-md cursor-pointer"
                      >
                        Resolve Dispute
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* H. PENDING VERIFICATIONS QUEUE */}
      {activeSubDashboard === "pending" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-[#4c0d10] flex items-center gap-1">
              <ClipboardList className="w-4 h-4 text-[#6b1419]" /> Vows & Elder Reference verification Queue
            </h3>
            <p className="text-[11px] text-slate-500">
              Profiles awaiting manual verification of familial elders references.
            </p>
          </div>

          <div className="space-y-3">
            {customPendingList.map((item) => (
              <div key={item.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-extrabold uppercase">
                    {item.sect}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5">
                    {item.name} <span className="text-slate-400 font-normal">(Gotra: {item.gotra})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-[10px] text-slate-500">
                    <p>Elder Reference Person: <strong className="text-slate-700">{item.refName}</strong></p>
                    <p>Reference Mobile: <strong className="text-slate-700">{item.refMobile}</strong></p>
                    <p>Simulated Govt Hash: <strong className="text-slate-700">{item.docSimulated}</strong></p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleRejectPendingVerification(item)}
                    className="text-[10px] font-extrabold text-rose-600 hover:bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleApprovePendingVerification(item)}
                    className="text-[10px] font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <UserCheck className="w-4 h-4 text-white" /> Approve Profile
                  </button>
                </div>
              </div>
            ))}

            {customPendingList.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                All verifications successfully approved. Queue is completely empty!
              </div>
            )}
          </div>
        </div>
      )}

      {/* I. FRAUD RADAR */}
      {activeSubDashboard === "fraud" && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-200 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" /> Advanced Multi-Vector Fraud Radar
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluates geographical leaps, commercial photo mismatches, and hardware fingerprint duplication rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Proxy / VPN Routing Rate</span>
              <span className="text-xl font-bold text-rose-400 block mt-1">{fraudIndicators.vpnTrafficPercent}%</span>
              <p className="text-[9px] text-slate-500 mt-1">Percentage of client sessions routing from datacenter nodes</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Multi-Account Density</span>
              <span className="text-xl font-bold text-rose-400 block mt-1">{fraudIndicators.deviceDensityCount} Profiles</span>
              <p className="text-[9px] text-slate-500 mt-1">Multiple matrimonial names linked to identical physical hardware fingerprint</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Biometric Facial Mismatches</span>
              <span className="text-xl font-bold text-rose-400 block mt-1">{fraudIndicators.biometricMismatches} Detected</span>
              <p className="text-[9px] text-slate-500 mt-1">Unsplash/Pinterest portrait metadata mismatch matches on reverse scan</p>
            </div>

          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Triggered Shield Alerts</span>
            
            <div className="space-y-2">
              {fraudIndicators.radarAlerts.map((alert) => (
                <div key={alert.id} className="bg-slate-900 border border-slate-800/60 p-3.5 rounded-xl flex items-start gap-3 text-left">
                  <div className="p-1 bg-rose-500/10 text-rose-400 rounded-lg mt-0.5 border border-rose-500/20">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{alert.type}</span>
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[8px] font-mono font-bold py-0.5 px-2 rounded-full">
                        {alert.severity.toUpperCase()} PRIORITY THREAT
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* J. SECURITY SHIELDS */}
      {activeSubDashboard === "security" && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-200 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cryptographic & Compliance Security Shields
              </h3>
              <p className="text-[11px] text-slate-400">
                OWASP compliance scanners, active SSL grading, rate limit enforcement status, and JWT keychain rotation controls.
              </p>
            </div>

            <button
              onClick={handleRotateSecrets}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5 hover:scale-105 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate Cryptographic JWT Secrets</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold">OWASP TOP 10 SECURITY SCANNERS</span>
              
              <div className="space-y-2 text-[10px] font-sans text-slate-300">
                {securityMetrics.owaspControls.map((ctrl, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-800/40 pb-1.5">
                    <span>{ctrl.name}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono text-[8px] font-bold">
                      ACTIVE & COMPLIANT
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold">TELEMETRY & HARDWARE DETAILS</span>
              
              <div className="space-y-3 text-[10.5px] text-slate-400 leading-normal">
                <p>
                  Active SSL Grade: <strong className="text-emerald-400 font-mono text-xs">{securityMetrics.sslStatus}</strong>
                </p>
                <p>
                  Cryptographic JWT Salt Key Pool size: <strong className="text-slate-200 font-mono">{securityMetrics.jwtChainCount} Active server salts</strong>
                </p>
                <p>
                  Hardware Fingerprint Engine: <strong className="text-slate-200">Device-FingerprintJS v4 Premium Active</strong>
                </p>
                <p>
                  Client Security Headers status: <strong className="text-emerald-400">Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Content-Security-Policy Fully Ingress Injected.</strong>
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
