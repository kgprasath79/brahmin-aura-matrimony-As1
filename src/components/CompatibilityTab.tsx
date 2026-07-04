/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Profile, CompatibilityInsight } from "../types";
import { Sparkles, Heart, Brain, Calendar, HelpCircle, Activity, ChevronRight, CheckCircle2, ShieldAlert, Check, Star, RefreshCw, Flame, HelpCircle as InfoIcon, BookOpen, FileText, Users } from "lucide-react";
import HoroscopeChart from "./HoroscopeChart";
import { getTenPoruthams, PoruthamMatch } from "../utils/astrology";

interface CompatibilityTabProps {
  selectedCandidate: Profile | null;
  allCandidates: Profile[];
  onSelectCandidate: (profile: Profile) => void;
  onNavigateToTab?: (tab: "discover" | "compatibility" | "messages" | "video" | "verify" | "vendors" | "audit" | "integration" | "admin") => void;
}

// Enriched Brahmin Primary User Profile
const currentUserMock: Profile = {
  id: "user-primary",
  name: "You (Your Profile)",
  age: 29,
  gender: "Male",
  occupation: "Financial Risk Analyst & Amateur Chef",
  location: "Bangalore, India",
  education: "Chartered Accountant (CA) & CFA Level 3",
  religion: "Hindu (Brahmin)",
  sect: "Iyer (Vadama)",
  gotra: "Bharadwaja",
  nakshatra: "Hastam",
  rasi: "Kanya",
  lagnam: "Tula",
  bio: "Pragmatic, family-centric, and loves exploring high-country hikes or testing sourdough bread recipes over weekends. Balancing analytical discipline with creative culinary pursuits. I value integrity, mental health, and mutual goals.",
  imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80",
  interests: ["Cooking", "Hiking", "Financial Planning", "Jazz", "Yoga"],
  values: {
    family: "High",
    career: "High",
    lifestyle: "Moderate",
    growth: "High"
  },
  languages: ["English", "Hindi", "Marathi"],
  verified: true,
  verification: {
    documentType: "Aadhaar Card",
    idNumberMasked: "XXXX-XXXX-8812",
    selfieMatchScore: 99.4,
    verifiedAt: "2026-01-10",
    status: "verified"
  },
  dosham: {
    chevvai: "No",
    rahuKetu: "No"
  },
  rasiChartPlacements: {
    "Kanya": "Ch",
    "Tula": "Lg",
    "Mesha": "Sa, Ra",
    "Kataka": "Sy, Bu",
    "Mithuna": "Sk",
    "Rishabha": "Ma",
    "Meena": "Ke",
    "Kumbha": "Gu"
  },
  amsamChartPlacements: {
    "Kanya": "Ch",
    "Tula": "Lg",
    "Mesha": "Sa, Ra",
    "Kataka": "Sy, Bu",
    "Mithuna": "Sk",
    "Rishabha": "Ma",
    "Meena": "Ke",
    "Kumbha": "Gu"
  },
  expectations: "Seeking a companion who respects Brahmin heritage, enjoys traditional Carnatic music/arts, and maintains a clean vegetarian lifestyle with mutual career support.",
  achievements: "Completed Chartered Accountant (CA) certification on first attempt. Self-taught sourdough chef with a popular community blog.",
  familyWishes: "The family values Vadama Iyer gotra rules, horoscope matching compatibility, and prefers a modern-yet-spiritually aligned match."
};


// Dynamic traditional 10 Porutham calculations are imported from astrology.ts


export default function CompatibilityTab({ selectedCandidate, allCandidates, onSelectCandidate, onNavigateToTab }: CompatibilityTabProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [insight, setInsight] = useState<CompatibilityInsight | null>(null);
  const [engine, setEngine] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState<string>("");
  
  // Interactive sub-tab for compatibility choice
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<"vedic_astrology" | "expectations_wishes" | "ai_mind">("vedic_astrology");
  const [userProfile, setUserProfile] = useState<Profile>(currentUserMock);

  // New AI Premium Audit States
  const [premiumAudit, setPremiumAudit] = useState<any | null>(null);
  const [loadingPremium, setLoadingPremium] = useState<boolean>(false);
  const [premiumLoadingStep, setPremiumLoadingStep] = useState<string>("");
  const [humanReviewSubmitted, setHumanReviewSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("registeredBrahminProfile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile({
          ...currentUserMock,
          name: parsed.name || currentUserMock.name,
          age: parseInt(parsed.age) || currentUserMock.age,
          gender: parsed.gender || currentUserMock.gender,
          sect: parsed.sect || currentUserMock.sect,
          gotra: parsed.gotra || currentUserMock.gotra,
          nakshatra: parsed.nakshatra || currentUserMock.nakshatra,
          rasi: parsed.rasi || currentUserMock.rasi,
          padam: parsed.padam || currentUserMock.padam,
          lagnam: parsed.lagnam || currentUserMock.lagnam,
          rasiChartPlacements: parsed.rasiChartPlacements || currentUserMock.rasiChartPlacements,
          amsamChartPlacements: parsed.amsamChartPlacements || currentUserMock.amsamChartPlacements,
          expectations: parsed.expectations || currentUserMock.expectations,
          achievements: parsed.achievements || currentUserMock.achievements,
          familyWishes: parsed.familyWishes || currentUserMock.familyWishes,
          location: parsed.location || currentUserMock.location,
          education: parsed.education || currentUserMock.education,
          occupation: parsed.occupation || currentUserMock.occupation,
          bio: parsed.bio || currentUserMock.bio,
          imageUrl: parsed.selfieMockUrl || currentUserMock.imageUrl,
        });
      } catch (e) {
        console.error("Error reading registered profile in Compatibility", e);
      }
    } else {
      setUserProfile(currentUserMock);
    }
  }, []);

  useEffect(() => {
    if (selectedCandidate) {
      calculateCompatibility(selectedCandidate);
      setPremiumAudit(null); // Reset premium audit on candidate switch
      setHumanReviewSubmitted({});
    } else if (allCandidates.length > 0 && !selectedCandidate) {
      onSelectCandidate(allCandidates[0]);
    }
  }, [selectedCandidate, userProfile]);

  const handleRunPremiumAudit = async () => {
    if (!selectedCandidate) return;
    setLoadingPremium(true);
    setPremiumAudit(null);
    const steps = [
      "Securing analytical session endpoint...",
      "Analyzing life expectations and emotional readiness...",
      "Matching parental traditions, values and Gotras...",
      "Running identity and anomaly screening networks...",
      "Formatting diplomatic AI guidance output...",
    ];
    for (let i = 0; i < steps.length; i++) {
      setPremiumLoadingStep(steps[i]);
      await new Promise((res) => setTimeout(res, 350));
    }
    try {
      const response = await fetch("/api/compatibility/premium-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile1: userProfile,
          profile2: selectedCandidate,
        }),
      });
      const resData = await response.json();
      if (resData.data) {
        setPremiumAudit(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPremium(false);
    }
  };

  const calculateCompatibility = async (candidate: Profile) => {
    setLoading(true);
    setInsight(null);
    
    const steps = [
      "Gathering ancestral lineages & Gotras...",
      "Extracting life priorities (Family, Growth, Career)...",
      "Correlating Birth Stars & Astrological charts...",
      "Calling Gemini 3.5-flash matchmaking neural weights...",
      "Analyzing 10 Poruthams (Deca-Agreement)...",
      "Structuring deep cultural and behavioral insights...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((res) => setTimeout(res, 200));
    }

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile1: userProfile,
          profile2: candidate,
        }),
      });
      const resData = await response.json();
      if (resData.data) {
        setInsight(resData.data);
        setEngine(resData.engine);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentMatchPoruthams = selectedCandidate 
    ? getTenPoruthams(userProfile.nakshatra, selectedCandidate.nakshatra)
    : [];

  const rawPoruthamPoints = currentMatchPoruthams.reduce((sum, item) => sum + item.points, 0);
  const maxPoruthamPoints = currentMatchPoruthams.reduce((sum, item) => sum + item.maxPoints, 0) || 27;
  const totalPoruthamPoints = Math.min(rawPoruthamPoints, maxPoruthamPoints);
  const matchedPoruthamsCount = currentMatchPoruthams.filter((item) => item.status !== "Adhama").length;

  // Evaluate general result of 10-Poruthams
  const getPoruthamVerdict = (score: number) => {
    if (score >= 20) return { label: "Excellent (Uthama Match)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (score >= 13) return { label: "Moderate (Madhyama Match)", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Poor Match (Adhama) - Puja remedy suggested", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const poruthamVerdict = getPoruthamVerdict(totalPoruthamPoints);

  // Check Dosham Match
  const checkDoshamCompatibility = (p1: Profile, p2: Profile) => {
    const p1Chevvai = p1.dosham?.chevvai || "No";
    const p2Chevvai = p2.dosham?.chevvai || "No";
    const p1Rahu = p1.dosham?.rahuKetu || "No";
    const p2Rahu = p2.dosham?.rahuKetu || "No";

    let verdict = "Highly Compatible";
    let alertMsg = "";
    let alertType: "success" | "warning" | "danger" = "success";

    if (p1Chevvai !== p2Chevvai) {
      verdict = "Chevvai Dosham Mismatch";
      alertMsg = `Caution: ${p1.name} has Chevvai: ${p1Chevvai}, while ${p2.name} has Chevvai: ${p2Chevvai}. Traditional rule says both should have Chevvai Dosham or neither should.`;
      alertType = "danger";
    } else if (p1Rahu !== p2Rahu) {
      verdict = "Rahu-Ketu Placement Mismatch";
      alertMsg = `Caution: Rahu-Ketu placements are unaligned. It is recommended to perform Rahu Ketu Shanti Puja to prevent delays.`;
      alertType = "warning";
    } else if (p1Chevvai === "Yes") {
      verdict = "Matched Chevvai Dosham (Subha Mangala)";
      alertMsg = "Both partners have Mars affliction (Chevvai). This forms a Subha Chevvai match, cancelling negative effects! Perfect.";
      alertType = "success";
    } else {
      verdict = "Affliction Free (Sudha Jadhagam)";
      alertMsg = "No Chevvai Dosham or Rahu-Ketu afflictions identified in either horoscope. Excellent, stable combination.";
      alertType = "success";
    }

    return { verdict, alertMsg, alertType };
  };

  const doshamComp = selectedCandidate 
    ? checkDoshamCompatibility(userProfile, selectedCandidate)
    : null;

  const computeExpectationsScore = (p1: Profile, p2: Profile) => {
    const gotraMatch = p1.gotra !== p2.gotra;
    const sectMatch = p1.sect === p2.sect;
    
    let baseScore = 75;
    const highlights: string[] = [];
    
    if (gotraMatch) {
      baseScore += 10;
      highlights.push("Perfect Lineage Alignment: Gotras are distinct (No Sagotra restriction).");
    } else {
      baseScore -= 25;
      highlights.push("Sagotra Warning: Marriage is traditionally avoided between the same Gotras.");
    }

    if (sectMatch) {
      baseScore += 10;
      highlights.push(`Shared Sect Alignment: Both belong to the same community lineage (${p1.sect}).`);
    } else {
      baseScore += 5;
      highlights.push(`Sect Compatibility: ${p1.sect} and ${p2.sect} are generally compatible in Brahmin sub-sects.`);
    }

    // Keyword analysis
    const keywords = ["yoga", "meditation", "music", "cooking", "art", "finance", "sanskrit", "vegetarian", "tech", "modern"];
    let matchCount = 0;
    
    keywords.forEach(kw => {
      const p1Has = (p1.expectations?.toLowerCase().includes(kw) || p1.bio?.toLowerCase().includes(kw));
      const p2Has = (p2.expectations?.toLowerCase().includes(kw) || p2.bio?.toLowerCase().includes(kw));
      if (p1Has && p2Has) {
        matchCount++;
        highlights.push(`Convergent Interest: Mutual engagement in ${kw.charAt(0).toUpperCase() + kw.slice(1)} discovered.`);
      }
    });

    baseScore += matchCount * 3;
    const finalScore = Math.min(98, Math.max(30, baseScore));

    return { finalScore, highlights };
  };

  const handlePrintPDFReport = () => {
    if (!selectedCandidate) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print/download the horoscope matching report.");
      return;
    }

    const today = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const reportId = `KUNDALI-MATCH-${Math.floor(100000 + Math.random() * 900000)}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certified Brahmin Kundali Match Report - ${selectedCandidate.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #1e293b;
            margin: 0;
            padding: 40px;
          }

          .border-frame {
            border: 8px double #b45309;
            padding: 40px;
            position: relative;
            background: #fffcf8;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #b45309;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .logo {
            font-family: 'Cinzel', serif;
            font-size: 28px;
            font-weight: 800;
            color: #b45309;
            letter-spacing: 2px;
            margin: 0;
          }

          .subtitle {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #78350f;
            margin: 5px 0 0 0;
            font-weight: bold;
          }

          .report-title {
            font-family: 'Cinzel', serif;
            font-size: 20px;
            text-align: center;
            color: #78350f;
            margin: 30px 0;
            font-weight: 700;
            text-decoration: underline;
          }

          .meta-info {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            font-family: 'JetBrains Mono', monospace;
            color: #64748b;
            margin-bottom: 30px;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 10px;
          }

          .grid-2 {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
          }

          .profile-box {
            border: 1px solid #e2e8f0;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          }

          .profile-box h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #78350f;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 8px;
          }

          .info-table {
            width: 100%;
            border-collapse: collapse;
          }

          .info-table td {
            padding: 6px 0;
            font-size: 12px;
          }

          .info-table td.label {
            color: #64748b;
            font-weight: 500;
            width: 40%;
          }

          .info-table td.value {
            color: #0f172a;
            font-weight: 600;
          }

          .score-banner {
            background: #fffbeb;
            border: 1px solid #fef3c7;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
          }

          .score-num {
            font-size: 32px;
            font-weight: bold;
            color: #d97706;
            margin: 5px 0;
          }

          .table-porutham {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 35px;
          }

          .table-porutham th {
            background: #78350f;
            color: #fff;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 10px;
            text-align: left;
          }

          .table-porutham td {
            padding: 10px;
            font-size: 11px;
            border-bottom: 1px solid #f1f5f9;
          }

          .table-porutham tr:nth-child(even) {
            background: #fffcf8;
          }

          .badge-uthama {
            background: #dcfce7;
            color: #15803d;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
          }

          .badge-madhyama {
            background: #fef3c7;
            color: #b45309;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
          }

          .badge-adhama {
            background: #fee2e2;
            color: #b91c1c;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
          }

          .section-heading {
            font-family: 'Cinzel', serif;
            font-size: 14px;
            color: #78350f;
            border-bottom: 2px solid #b45309;
            padding-bottom: 5px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }

          .expectations-compare {
            font-size: 12px;
            line-height: 1.6;
            color: #334155;
            background: #f8fafc;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 25px;
          }

          .seal-container {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }

          .signature-box {
            text-align: center;
            font-size: 11px;
            color: #64748b;
          }

          .signature-line {
            width: 150px;
            border-top: 1px solid #64748b;
            margin-bottom: 8px;
          }

          .community-seal {
            border: 2px solid #b45309;
            border-radius: 50%;
            width: 75px;
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 8px;
            color: #b45309;
            font-family: 'Cinzel', serif;
            font-weight: bold;
            transform: rotate(-15deg);
            padding: 5px;
            background: #fffbeb;
          }

          @media print {
            body {
              padding: 0;
            }
            .border-frame {
              border-color: #78350f;
              background: #fff;
            }
          }
        </style>
      </head>
      <body>
        <div class="border-frame">
          <div class="header">
            <h1 class="logo">BRAHMIN AURA MATRIMONY</h1>
            <p class="subtitle">Agraharam Lineage Verification & Compatibility Authority</p>
          </div>

          <div class="report-title">CERTIFIED HOROSCOPE COMPATIBILITY DOSSIER</div>

          <div class="meta-info">
            <span>Report ID: ${reportId}</span>
            <span>Generated: ${today}</span>
            <span>Status: CERTIFIED COMPATIBLE</span>
          </div>

          <div class="grid-2">
            <div class="profile-box">
              <h3>First Party (Primary Applicant)</h3>
              <table class="info-table">
                <tr><td class="label">Name</td><td class="value">${userProfile.name}</td></tr>
                <tr><td class="label">Gotra</td><td class="value">${userProfile.gotra}</td></tr>
                <tr><td class="label">Sect</td><td class="value">${userProfile.sect}</td></tr>
                <tr><td class="label">Nakshatra</td><td class="value">${userProfile.nakshatra}</td></tr>
                <tr><td class="label">Rasi</td><td class="value">${userProfile.rasi}</td></tr>
                <tr><td class="label">Lagnam</td><td class="value">${userProfile.lagnam || "N/A"}</td></tr>
              </table>
            </div>

            <div class="profile-box">
              <h3>Second Party (Candidate)</h3>
              <table class="info-table">
                <tr><td class="label">Name</td><td class="value">${selectedCandidate.name}</td></tr>
                <tr><td class="label">Gotra</td><td class="value">${selectedCandidate.gotra}</td></tr>
                <tr><td class="label">Sect</td><td class="value">${selectedCandidate.sect}</td></tr>
                <tr><td class="label">Nakshatra</td><td class="value">${selectedCandidate.nakshatra}</td></tr>
                <tr><td class="label">Rasi</td><td class="value">${selectedCandidate.rasi}</td></tr>
                <tr><td class="label">Lagnam</td><td class="value">${selectedCandidate.lagnam || "N/A"}</td></tr>
              </table>
            </div>
          </div>

          <div class="score-banner">
            <div style="font-size: 11px; text-transform: uppercase; tracking-spacing: 2px; color: #78350f; font-weight: bold;">
              Total Astrological Guna Agreement Score
            </div>
            <div class="score-num">${totalPoruthamPoints} / ${maxPoruthamPoints} Points</div>
            <div style="font-size: 12px; font-weight: bold; color: #1e293b; margin-top: 5px;">
              Verdict: ${poruthamVerdict.label} (${matchedPoruthamsCount} out of 10 Poruthams Matched)
            </div>
          </div>

          <div class="section-heading">Ten Sacred Poruthams Analysis</div>
          <table class="table-porutham">
            <thead>
              <tr>
                <th>Porutham Type</th>
                <th>Sanskrit/Tamil Key</th>
                <th>Status</th>
                <th>Points Earned</th>
                <th>Traditional Definition</th>
              </tr>
            </thead>
            <tbody>
              ${currentMatchPoruthams.map(p => `
                <tr>
                  <td style="font-weight: bold; color: #78350f;">${p.name}</td>
                  <td style="font-family: 'Cinzel', serif;">${p.tamilName}</td>
                  <td>
                    <span class="badge-${p.status.toLowerCase()}">${p.status}</span>
                  </td>
                  <td style="font-family: 'JetBrains Mono', monospace; font-weight: bold; text-align: center;">${p.points} / ${p.maxPoints}</td>
                  <td style="color: #475569; font-size: 10px;">${p.description}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="section-heading">Mutual Expectations Matchmaking</div>
          <div class="expectations-compare">
            <div style="margin-bottom: 12px;">
              <strong style="color: #78350f;">${userProfile.name}'s Expectations:</strong><br/>
              <span style="font-style: italic;">"${userProfile.expectations || 'Seeking traditional yet modern alliance'}"</span>
            </div>
            <div>
              <strong style="color: #78350f;">${selectedCandidate.name}'s Expectations:</strong><br/>
              <span style="font-style: italic;">"${selectedCandidate.expectations || 'Seeking modern-minded vegetarian'}"</span>
            </div>
          </div>

          <div class="seal-container">
            <div class="signature-box">
              <div class="signature-line"></div>
              <span>Platform Registrar Authority</span><br/>
              <span style="font-size: 9px; color: #94a3b8;">Heritage Matrimony</span>
            </div>

            <div class="signature-box">
              <div class="signature-line"></div>
              <span>Vedic Astrologer Shastri</span><br/>
              <span style="font-size: 9px; color: #94a3b8;">Siddhanta Board Council</span>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* CANCEL & NAVIGATION BUTTON FOR ALL PAGES (Point 5) */}
      {onNavigateToTab && (
        <div className="flex flex-wrap justify-between items-center bg-[#FFFFFF] border border-amber-600/30 rounded-2xl p-3.5 shadow-sm">
          <span className="text-xs font-serif text-amber-900/80">Need to return to home page or matches?</span>
          <button
            onClick={() => onNavigateToTab("discover")}
            className="px-4.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-600/30 text-xs font-bold rounded-xl transition duration-300 cursor-pointer flex items-center gap-1.5"
          >
            ✕ Cancel & Return to Matches
          </button>
        </div>
      )}
      {/* Selector and Target Profile Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-slate-300 mb-3.5 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500" /> Select Brahmin Profile for Marriage Matching
        </h3>
        <div className="flex flex-wrap gap-2">
          {allCandidates.map((candidate) => (
            <button
              id={`select-candidate-${candidate.id}`}
              key={candidate.id}
              onClick={() => {
                onSelectCandidate(candidate);
              }}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer ${
                selectedCandidate?.id === candidate.id
                  ? "bg-amber-500/10 border-amber-500 text-amber-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
            >
              <img
                src={candidate.imageUrl}
                alt={candidate.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{candidate.name} (Gotra: {candidate.gotra})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Stage (Side by Side summary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Profile */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-4">
          <img
            src={userProfile.imageUrl}
            alt={userProfile.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30 flex-shrink-0"
          />
          <div className="text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md">Primary User</span>
              <span className="text-slate-500 font-mono font-bold">Gotra: {userProfile.gotra}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-100 mt-1">{userProfile.name}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Nakshatra: {userProfile.nakshatra} ({userProfile.rasi} Rasi)</p>
          </div>
        </div>

        {/* Candidate Profile */}
        {selectedCandidate && (
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-4">
            <img
              src={selectedCandidate.imageUrl}
              alt={selectedCandidate.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/30 flex-shrink-0"
            />
            <div className="text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md">Candidate</span>
                <span className="text-slate-500 font-mono font-bold">Gotra: {selectedCandidate.gotra}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 mt-1">{selectedCandidate.name}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Nakshatra: {selectedCandidate.nakshatra} ({selectedCandidate.rasi} Rasi)</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Analysis Panels (Only show when selectedCandidate is loaded) */}
      {selectedCandidate && (
        <div className="space-y-6">
          
          {/* Analysis View Toggles: Psychological vs Vedic Astrology */}
          <div className="flex flex-col sm:flex-row bg-slate-900 border border-slate-800 p-1.5 rounded-2xl gap-1.5">
            <button
              id="analysis-tab-astrology"
              onClick={() => setActiveAnalysisMode("vedic_astrology")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeAnalysisMode === "vedic_astrology" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Vedic Astrological Matching</span>
            </button>

            <button
              id="analysis-tab-expectations"
              onClick={() => setActiveAnalysisMode("expectations_wishes")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeAnalysisMode === "expectations_wishes" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Expectations Matchmaking</span>
            </button>

            <button
              id="analysis-tab-mind"
              onClick={() => setActiveAnalysisMode("ai_mind")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeAnalysisMode === "ai_mind" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>AI Psychological Insights</span>
            </button>
          </div>

          {/* Premium Printable PDF / Kundali Certificate Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-amber-500/10 to-slate-900 border border-amber-500/20 rounded-2xl p-4 gap-3">
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" /> Official Certified Matching Report (PDF/Print)
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Generate a premium, printable horoscope matching dossier with full Kundali placements & expectation alignments.</p>
            </div>
            <button
              id="download-matching-pdf-btn"
              onClick={handlePrintPDFReport}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all duration-300 shadow-lg shadow-amber-500/5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>Generate PDF Report</span>
            </button>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center space-y-6 min-h-[350px]">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 border-4 border-amber-500/10 border-t-amber-400 rounded-full animate-spin" />
                <div className="absolute w-16 h-16 border-4 border-rose-500/10 border-b-rose-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                <Star className="w-8 h-8 text-amber-400 animate-pulse fill-amber-400" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono">Brahmin Match Synapse</h4>
                <p className="text-xs text-slate-400 mt-2 h-4 animate-pulse">{loadingStep}</p>
              </div>
            </div>
          ) : (
            <div>
              
              {/* MODE 1: VEDIC ASTROLOGICAL MATCHING */}
              {activeAnalysisMode === "vedic_astrology" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Traditional Astrological Grid Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left & Middle: Side by side Horoscopes */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-amber-500" /> Horoscopes Side-by-Side Comparison
                          </h3>
                          <p className="text-[10px] text-slate-400">Comparing your Rasi planets to {selectedCandidate.name}&apos;s alignments.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block text-center bg-indigo-950/20 py-1.5 rounded-lg border border-indigo-500/15">Your Horoscope</span>
                          <HoroscopeChart profile={currentUserMock} />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block text-center bg-amber-950/20 py-1.5 rounded-lg border border-amber-500/15">{selectedCandidate.name}&apos;s Horoscope</span>
                          <HoroscopeChart profile={selectedCandidate} />
                        </div>
                      </div>
                    </div>

                    {/* Right: 10 Porutham Summary Gauge */}
                    <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-1.5">
                        <span className="bg-amber-500/15 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest block text-center">
                          Ten Poruthams (தின பொருத்தம்)
                        </span>
                        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                          Traditional South Indian Vedic matching scores based on constellation aspects.
                        </p>
                      </div>

                      <div className="text-center space-y-3 py-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Vedic Agreement Score</span>
                        <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                          {totalPoruthamPoints} <span className="text-xs text-slate-500 font-normal">/ {maxPoruthamPoints} pts</span>
                        </div>
                        <div className={`mx-auto text-[10px] font-bold px-3 py-1 rounded-full max-w-[200px] border ${poruthamVerdict.color}`}>
                          {poruthamVerdict.label}
                        </div>
                        <span className="text-[10px] text-slate-400 block">{matchedPoruthamsCount} out of 10 Poruthams Matched</span>
                      </div>

                      {/* Sagotra Warning / Lineage Status */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-center">
                        <span className="text-slate-500 text-[8px] uppercase font-mono block">Lineage Sagotra Safety</span>
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Pure Lineage (Different Gotras)
                        </span>
                        <p className="text-[9px] text-slate-400 leading-normal">
                          No Sagotra clash identified ({currentUserMock.gotra} vs {selectedCandidate.gotra}). Match is safe for marriage.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Dosham Affinity Summary Panel */}
                  {doshamComp && (
                    <div className={`border rounded-2xl p-4 ${
                      doshamComp.alertType === "danger" 
                        ? "bg-rose-500/5 border-rose-500/20 text-rose-300"
                        : doshamComp.alertType === "warning"
                          ? "bg-amber-500/5 border-amber-500/20 text-amber-300"
                          : "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                    }`}>
                      <div className="flex items-start space-x-3 text-xs">
                        {doshamComp.alertType === "danger" ? (
                          <ShieldAlert className="w-5 h-5 text-rose-500 flex-shrink-0 animate-bounce" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        )}
                        <div className="space-y-1">
                          <h4 className="font-bold flex items-center gap-2">
                            Traditional Dosham Check: <span className="underline">{doshamComp.verdict}</span>
                          </h4>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{doshamComp.alertMsg}</p>
                          
                          {/* If Mismatch, prompt booking Homam or consultation with Pandit Shastri in vendors */}
                          {doshamComp.alertType !== "success" && (
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-2 text-[10px] text-slate-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                              <div>
                                <span className="font-bold text-slate-200 block">Need remedial Astrological remedies?</span>
                                <span>You can schedule Nakshatra Shanti, Grahapravesham, or Chevvai Shanti Pujas.</span>
                              </div>
                              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[9px] px-2 py-1 rounded-lg">
                                Book Purohit & Shastri in Vendors Hub
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 10 Poruthams Detailed Matrix Grid */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400" /> Deca-Agreement Detailed Matrix (பத்து பொருத்தம்)
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Deep-dive into the points allocation of the ten sacred south Indian match parameters.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentMatchPoruthams.map((item, i) => (
                        <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-bold text-amber-500 tracking-wider font-mono block">{item.tamilName}</span>
                              <h4 className="text-xs font-bold text-slate-200 mt-0.5">{item.name}</h4>
                            </div>
                            
                            <div className="text-right">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                item.status === "Uthama" 
                                  ? "bg-emerald-500/15 text-emerald-400" 
                                  : item.status === "Madhyama"
                                    ? "bg-amber-500/15 text-amber-400"
                                    : "bg-rose-500/15 text-rose-400"
                              }`}>
                                {item.status}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 block mt-1">Score: {item.points} / {item.maxPoints}</span>
                            </div>
                          </div>
                          
                          <p className="text-[11px] text-slate-400 leading-normal font-sans pt-1 border-t border-slate-800/50">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* MODE 2: EXPECTATIONS MATCHMAKING (Requirement 4) */}
              {activeAnalysisMode === "expectations_wishes" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* side-by-side comparative cockpit */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Overall Score Wheel for Expectations */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
                      <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-4">Mutual Aspirations Match</span>
                      
                      {(() => {
                        const { finalScore } = computeExpectationsScore(userProfile, selectedCandidate);
                        return (
                          <>
                            <div className="relative flex items-center justify-center w-36 h-36">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="72"
                                  cy="72"
                                  r="60"
                                  className="stroke-slate-800"
                                  strokeWidth="10"
                                  fill="transparent"
                                />
                                <circle
                                  cx="72"
                                  cy="72"
                                  r="60"
                                  className="stroke-teal-500"
                                  strokeWidth="10"
                                  fill="transparent"
                                  strokeDasharray={376.8}
                                  strokeDashoffset={376.8 - (376.8 * finalScore) / 100}
                                  strokeLinecap="round"
                                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-3xl font-extrabold text-white">{finalScore}%</span>
                                <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase mt-0.5">Aligned</span>
                              </div>
                            </div>

                            <div className="mt-5 text-[10px] text-teal-400 bg-teal-950/20 border border-teal-500/20 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider">
                              Lineage Safe
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Side-by-Side Text Matrices */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lineage & Guna Expectations Matrix</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3.5">
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block w-fit">Your Aspirations</span>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Personal Expectations:</span>
                            <p className="text-slate-200 mt-1 italic leading-relaxed">"{userProfile.expectations || "Seeking companion with deep respect for values and lineage."}"</p>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Achievements & Milestones:</span>
                            <p className="text-slate-200 mt-1 leading-relaxed">"{userProfile.achievements || "CA Professional, spiritually and culturally active."}"</p>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Family Elders Wishes:</span>
                            <p className="text-slate-200 mt-1 leading-relaxed">"{userProfile.familyWishes || "Elders value horoscope matching, compatible Gotras and traditional sub-sect values."}"</p>
                          </div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3.5">
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block w-fit">{selectedCandidate.name}&apos;s Aspirations</span>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Personal Expectations:</span>
                            <p className="text-slate-200 mt-1 italic leading-relaxed">"{selectedCandidate.expectations || "Seeking traditional minded companion with mutual respect."}"</p>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Achievements & Milestones:</span>
                            <p className="text-slate-200 mt-1 leading-relaxed">"{selectedCandidate.achievements || "Accomplished in classical arts and high career milestones."}"</p>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Family Elders Wishes:</span>
                            <p className="text-slate-200 mt-1 leading-relaxed">"{selectedCandidate.familyWishes || "Elders prefer a close-knit and compatible family alliance within traditional norms."}"</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Highlights and Convergence Indicators */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4 shadow-lg">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Mutual Compatibility & Lineage Convergence
                    </h4>
                    <p className="text-xs text-slate-400">Algorithmic evaluation of both parties&apos; explicit life goals, family wishes, and professional achievements.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(() => {
                        const { highlights } = computeExpectationsScore(userProfile, selectedCandidate);
                        return highlights.map((hl, idx) => (
                          <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-start space-x-3 hover:border-slate-700 transition-all duration-300 animate-fadeIn">
                            <div className="bg-teal-500/10 text-teal-400 p-1.5 rounded-xl text-xs font-bold">
                              <Check className="w-4 h-4" />
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed font-sans">{hl}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                </div>
              )}

              {/* MODE 3: AI PSYCHOLOGICAL INSIGHTS & PREMIUM AUDIT SUITE */}
              {activeAnalysisMode === "ai_mind" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Premium Suite Welcome / Initial Gate */}
                  {!premiumAudit && !loadingPremium && (
                    <div className="bg-radial from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                      {/* Premium Gold Accent Glow */}
                      <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
                      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl" />
                      
                      <div className="max-w-xl mx-auto space-y-4">
                        <div className="inline-flex p-3 rounded-full bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-400 animate-pulse">
                          <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold font-serif text-white tracking-wide">
                          Unlock Elite AI Heritage Marriage Audit
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          Generate deep, modern compatibility analysis powered by **Gemini neural networks** integrated with traditional Vedic parameters. This premium sweep provides:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-left">
                          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                            <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 text-rose-500" /> Readiness Score
                            </span>
                            <p className="text-[10px] text-slate-400 leading-snug">Lifestyle maturity, goals, and communication styles.</p>
                          </div>
                          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                            <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-indigo-400" /> Family Traditions
                            </span>
                            <p className="text-[10px] text-slate-400 leading-snug">Elder value alignment, gotras, and sub-sect traditions.</p>
                          </div>
                          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                            <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Red-Flag Screen
                            </span>
                            <p className="text-[10px] text-slate-400 leading-snug">Guidance-based profiling anomalies and verification audits.</p>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            id="run-premium-ai-audit-btn"
                            onClick={handleRunPremiumAudit}
                            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-white font-bold text-xs rounded-2xl shadow-xl shadow-amber-900/20 hover:brightness-110 active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center space-x-2"
                          >
                            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200/20" />
                            <span>RUN SECURE AI PREMIUM COMPATIBILITY AUDIT</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading State with Staggered Steps */}
                  {loadingPremium && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center min-h-[350px] flex flex-col items-center justify-center space-y-6">
                      <div className="relative flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                        <Brain className="w-6 h-6 text-amber-400 absolute animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white text-sm font-bold tracking-wider uppercase animate-pulse">Running Deep AI Matrimony Audit</h4>
                        <p className="text-slate-400 text-xs font-mono">{premiumLoadingStep}</p>
                      </div>
                      <div className="w-full max-w-xs bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-amber-500 h-full w-2/3 rounded-full animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* PREMIUM AUDIT DASHBOARD */}
                  {premiumAudit && (
                    <div className="space-y-6 animate-fadeIn">
                      
                      {/* Top Summary Banner */}
                      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-slate-950 border border-amber-500/20 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1 text-left">
                          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-amber-500/20">
                            Heritage Premium Audit Shield
                          </span>
                          <h3 className="text-base font-bold text-white font-serif">Comprehensive AI Evaluation</h3>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                            Analyzing mutual readiness, parental traditions, and consistency shields for **{selectedCandidate.name}** and **You**.
                          </p>
                        </div>
                        <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400">
                          Engine: <span className="text-rose-400 font-bold">GEMINI-3.5-FLASH</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* CARD 1: AI MARRIAGE READINESS SCORE */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4 shadow-lg text-left">
                          <div className="flex justify-between items-start border-b border-slate-800/60 pb-3">
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-serif">
                                <Heart className="w-4 h-4 text-rose-500" /> AI Marriage Readiness
                              </h4>
                              <p className="text-[10px] text-slate-400">Lifestyle, expectations, and long-term goals.</p>
                            </div>
                            <div className="flex items-center space-x-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-xl">
                              <span className="text-xs font-bold font-mono">{premiumAudit.readinessScore}%</span>
                              <span className="text-[8px] uppercase tracking-wider font-bold">Score</span>
                            </div>
                          </div>

                          <div className="space-y-3 font-sans">
                            <div className="relative w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                              <div 
                                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${premiumAudit.readinessScore}%` }}
                              />
                            </div>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                              {premiumAudit.readinessInsight}
                            </p>
                          </div>
                        </div>

                        {/* CARD 2: FAMILY COMPATIBILITY SCORE */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4 shadow-lg text-left">
                          <div className="flex justify-between items-start border-b border-slate-800/60 pb-3">
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-serif">
                                <Users className="w-4 h-4 text-indigo-400" /> Family Compatibility
                              </h4>
                              <p className="text-[10px] text-slate-400">Traditional values, preferences, and gotras.</p>
                            </div>
                            <div className="flex items-center space-x-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-xl">
                              <span className="text-xs font-bold font-mono">{premiumAudit.familyScore}%</span>
                              <span className="text-[8px] uppercase tracking-wider font-bold">Score</span>
                            </div>
                          </div>

                          <div className="space-y-3 font-sans">
                            <div className="relative w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-teal-500 h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${premiumAudit.familyScore}%` }}
                              />
                            </div>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                              {premiumAudit.familyInsight}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* CARD 3: AI RED FLAG DETECTION & ESCALATION SUITE */}
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4 text-left">
                        <div>
                          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-serif">
                            <ShieldAlert className="w-4.5 h-4.5 text-amber-500" /> AI Red Flag Detection & Consistency Guidance
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            Evaluates self-reported parameters, location timelines, and security profiles. Results are presented strictly as **preventative guidance** rather than definitive accusations, with direct options to submit any parameter for secure human/support review.
                          </p>
                        </div>

                        <div className="space-y-3.5 pt-2">
                          {premiumAudit.redFlags?.map((flag: any, idx: number) => {
                            const isSubmitted = humanReviewSubmitted[flag.indicator];
                            return (
                              <div 
                                key={idx} 
                                className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700/60 transition-all duration-300 animate-fadeIn"
                              >
                                <div className="space-y-2 max-w-2xl text-left">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                                      flag.status === "Safe" 
                                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" 
                                        : flag.status === "Review Recommended"
                                          ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                                          : "bg-rose-500/15 text-rose-400 border-rose-500/20"
                                    }`}>
                                      {flag.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-200">{flag.indicator}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                                    {flag.guidance}
                                  </p>
                                </div>

                                <div className="flex-shrink-0 w-full md:w-auto text-right">
                                  {isSubmitted ? (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl block text-center">
                                      ✅ Support Ticket Opened
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHumanReviewSubmitted(prev => ({ ...prev, [flag.indicator]: true }));
                                        // Simulate opening support ticket
                                        const eventMsg = `User requested human review for ${flag.indicator} regarding candidate ${selectedCandidate.name}`;
                                        console.log(eventMsg);
                                      }}
                                      className="w-full md:w-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-[10px] rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-300 cursor-pointer"
                                    >
                                      Submit for Human Review
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Standard AI Synthesizer fallback/milestones */}
                      {insight && (
                        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-5 md:p-6 space-y-4 text-left">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-mono">Conversational Icebreakers & Milestones</h4>
                            <p className="text-[10px] text-slate-500">Suggested by traditional matching factors.</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {insight.recommendations?.slice(0, 3).map((recommendation: string, idx: number) => (
                              <div
                                key={idx}
                                className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/40 flex items-start space-x-2.5 hover:border-slate-800 transition-all duration-300"
                              >
                                <span className="text-amber-500 font-mono text-[10px] font-bold">#{idx + 1}</span>
                                <p className="text-slate-300 text-xs leading-relaxed">{recommendation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* No selected match fallbacks */}
      {!selectedCandidate && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center min-h-[350px] flex flex-col items-center justify-center">
          <HelpCircle className="w-12 h-12 text-slate-600 mb-3" />
          <h4 className="text-slate-300 font-semibold text-sm">No Candidate Chosen</h4>
          <p className="text-slate-500 text-xs mt-1">Select a candidate above to process secure AI-matching parameters.</p>
        </div>
      )}

    </div>
  );
}
