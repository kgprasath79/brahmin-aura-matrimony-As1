/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Profile } from "../types";
import { calculateProfileTrust, getProfileTrustFactors } from "../utils/trustScore";
import { 
  ShieldCheck, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Mail, 
  Smartphone, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Share2, 
  Calendar, 
  AlertTriangle,
  Award,
  Sparkles
} from "lucide-react";

interface TrustScoreBadgeProps {
  profile: Profile;
  onUpdateProfile?: (profile: Profile) => void;
  interactive?: boolean;
}

export default function TrustScoreBadge({ profile, onUpdateProfile, interactive = true }: TrustScoreBadgeProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const report = calculateProfileTrust(profile);
  const currentFactors = getProfileTrustFactors(profile);

  // Helper to map factor keys to Lucide icons for gorgeous presentation
  const getFactorIcon = (key: string) => {
    switch (key) {
      case "id":
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case "email":
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
      case "mobile":
        return <Smartphone className="w-3.5 h-3.5 text-purple-400" />;
      case "employment":
        return <Briefcase className="w-3.5 h-3.5 text-indigo-400" />;
      case "education":
        return <GraduationCap className="w-3.5 h-3.5 text-teal-400" />;
      case "family":
        return <Users className="w-3.5 h-3.5 text-amber-400" />;
      case "social":
        return <Share2 className="w-3.5 h-3.5 text-pink-400" />;
      case "age":
        return <Calendar className="w-3.5 h-3.5 text-orange-400" />;
      case "complaints":
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleToggleFactor = (factorKey: string) => {
    if (!onUpdateProfile) return;

    const updatedFactors = { ...currentFactors };
    
    if (factorKey === "id") {
      updatedFactors.idVerified = !updatedFactors.idVerified;
    } else if (factorKey === "email") {
      updatedFactors.emailVerified = !updatedFactors.emailVerified;
    } else if (factorKey === "mobile") {
      updatedFactors.mobileVerified = !updatedFactors.mobileVerified;
    } else if (factorKey === "employment") {
      updatedFactors.employmentVerified = !updatedFactors.employmentVerified;
    } else if (factorKey === "education") {
      updatedFactors.educationVerified = !updatedFactors.educationVerified;
    } else if (factorKey === "family") {
      updatedFactors.familyVerified = !updatedFactors.familyVerified;
    } else if (factorKey === "social") {
      updatedFactors.socialVerified = !updatedFactors.socialVerified;
    } else if (factorKey === "age") {
      // Toggle profile age between new (5 days) and old (90 days)
      updatedFactors.profileAgeDays = updatedFactors.profileAgeDays >= 30 ? 5 : 90;
    } else if (factorKey === "complaints") {
      // Toggle complaints count between 0 and 1
      updatedFactors.complaintsCount = updatedFactors.complaintsCount > 0 ? 0 : 1;
    }

    const updatedProfile: Profile = {
      ...profile,
      verified: factorKey === "id" ? updatedFactors.idVerified : profile.verified,
      trustFactors: updatedFactors
    };

    onUpdateProfile(updatedProfile);
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 md:p-4 space-y-3.5">
      
      {/* HEADER ROW WITH STAR GAUGE */}
      <div 
        id={`trust-score-header-${profile.id}`}
        className="flex items-center justify-between cursor-pointer group select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Award className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Heritage Trust Rating</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xs font-black font-serif ${report.tierColor}`}>
                {report.tier}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-bold">
                {report.score}/100
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 hover:text-white transition-colors">
          <span>{isOpen ? "Hide Breakdown" : "View Breakdown"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* CONSOLIDATED MINI METRIC BAR */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${report.score}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
          <span>Pristine Safe Threshold: 70%</span>
          <span className={report.tierColor}>Current Status: {report.score >= 70 ? "SAFE & TRUSTED" : "AWAITING CLEARANCE"}</span>
        </div>
      </div>

      {/* EXPANDABLE VERIFICATION LEDGER */}
      {isOpen && (
        <div className="pt-2 border-t border-slate-900 space-y-3 animate-fadeIn text-left">
          <p className="text-[10px] text-slate-400 leading-normal">
            Heritage Brahmin Matrimony enforces high standards of verification. Click on any factor to toggle or verify elements during simulation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {report.factors.map((factor) => (
              <div 
                key={factor.key}
                id={`trust-factor-row-${profile.id}-${factor.key}`}
                onClick={() => interactive && handleToggleFactor(factor.key)}
                className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 text-left ${
                  interactive ? "hover:bg-slate-900/80 cursor-pointer" : ""
                } ${
                  factor.status 
                    ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80" 
                    : "bg-slate-950 border-slate-900 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-slate-900 rounded-lg border border-slate-800">
                    {getFactorIcon(factor.key)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-200 block">{factor.name}</span>
                    <span className="text-[8.5px] text-slate-500 block leading-tight truncate max-w-[150px]" title={factor.description}>
                      {factor.description}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`text-[9px] font-mono font-bold flex items-center gap-0.5 ${factor.status ? "text-emerald-400" : "text-slate-500"}`}>
                    {factor.status ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>+{factor.points}</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-slate-600" />
                        <span>0</span>
                      </>
                    )}
                  </span>
                  <span className="text-[7.5px] text-slate-600 font-mono">max {factor.maxPoints}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-[9px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Rating algorithm: Summation of verified digital credentials
            </span>
            <span className={`font-extrabold ${report.tierColor}`}>
              Total Verified: {report.score}/100
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
