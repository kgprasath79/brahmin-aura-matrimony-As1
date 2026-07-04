/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profile } from "../types";

export interface TrustFactorBreakdown {
  key: string;
  name: string;
  status: boolean;
  points: number;
  maxPoints: number;
  description: string;
}

export interface TrustScoreReport {
  score: number;
  starRating: number;
  starsDisplay: string;
  tier: string;
  tierColor: string;
  bgColor: string;
  borderColor: string;
  factors: TrustFactorBreakdown[];
}

/**
 * Derives default trust factors deterministically for a profile if they are not explicitly present.
 */
export function getProfileTrustFactors(profile: Profile) {
  if (profile.trustFactors) {
    return profile.trustFactors;
  }

  // Deterministic fallbacks based on profile ID or state
  const idNum = parseInt(profile.id) || 1;
  const isIdVerified = !!(profile.verified || profile.verification?.status === "verified");

  // Generate stable default values based on ID hashing
  const emailVerified = [1, 2, 3, 5, 6].includes(idNum) || (idNum % 2 === 0 && idNum !== 8);
  const mobileVerified = [1, 2, 4, 5, 7].includes(idNum) || (idNum % 3 !== 0);
  const employmentVerified = [1, 3, 4, 6].includes(idNum) || (idNum % 2 !== 0 && idNum !== 7);
  const educationVerified = [1, 2, 5, 7].includes(idNum) || (idNum % 3 === 1);
  const familyVerified = [1, 3, 5, 8].includes(idNum) || (idNum % 2 !== 0 && idNum !== 7);
  const socialVerified = [1, 2, 6].includes(idNum) || (idNum % 4 === 0);

  // Profile age estimation
  let profileAgeDays = 30;
  if (profile.milestoneTimestamps?.registration) {
    const diffTime = Math.abs(new Date().getTime() - new Date(profile.milestoneTimestamps.registration).getTime());
    profileAgeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  } else {
    // Hardcoded realistic profile ages
    const ages: Record<number, number> = {
      1: 185,
      2: 92,
      3: 45,
      4: 14,
      5: 120,
      6: 210,
      7: 8,
      8: 19
    };
    profileAgeDays = ages[idNum] || (15 + (idNum * 7) % 60);
  }

  // Complaint count
  let complaintsCount = 0;
  if (idNum === 4) complaintsCount = 1;
  if (idNum === 8) complaintsCount = 2;

  return {
    emailVerified,
    mobileVerified,
    idVerified: isIdVerified,
    employmentVerified,
    educationVerified,
    familyVerified,
    socialVerified,
    profileAgeDays,
    complaintsCount
  };
}

/**
 * Calculates a detailed trust report for any profile.
 */
export function calculateProfileTrust(profile: Profile): TrustScoreReport {
  const factors = getProfileTrustFactors(profile);

  const breakdown: TrustFactorBreakdown[] = [];

  // 1. Government ID verified (15 points)
  breakdown.push({
    key: "id",
    name: "Government ID Verified",
    status: factors.idVerified,
    points: factors.idVerified ? 15 : 0,
    maxPoints: 15,
    description: "Official government-issued Aadhaar or PAN verification match"
  });

  // 2. Email verified (15 points)
  breakdown.push({
    key: "email",
    name: "Email Address Verified",
    status: factors.emailVerified,
    points: factors.emailVerified ? 15 : 0,
    maxPoints: 15,
    description: "Verified email address via secure code transaction challenge"
  });

  // 3. Mobile verified (15 points)
  breakdown.push({
    key: "mobile",
    name: "Mobile Number Verified",
    status: factors.mobileVerified,
    points: factors.mobileVerified ? 15 : 0,
    maxPoints: 15,
    description: "Direct cellular OTP verification check"
  });

  // 4. Employment verified (10 points)
  breakdown.push({
    key: "employment",
    name: "Employment & Income Verified",
    status: factors.employmentVerified,
    points: factors.employmentVerified ? 10 : 0,
    maxPoints: 10,
    description: "Company email, payslip, or official corporate credentials validation"
  });

  // 5. Education verified (10 points)
  breakdown.push({
    key: "education",
    name: "Educational Degree Verified",
    status: factors.educationVerified,
    points: factors.educationVerified ? 10 : 0,
    maxPoints: 10,
    description: "Academic transcripts or university degree registry match"
  });

  // 6. Family verified (10 points)
  breakdown.push({
    key: "family",
    name: "Reference Family Verified",
    status: factors.familyVerified,
    points: factors.familyVerified ? 10 : 0,
    maxPoints: 10,
    description: "Guardian reference contact check or elder authorization"
  });

  // 7. Social media verified (10 points)
  breakdown.push({
    key: "social",
    name: "Social Media Verified",
    status: factors.socialVerified,
    points: factors.socialVerified ? 10 : 0,
    maxPoints: 10,
    description: "Linked active LinkedIn, Google, or professional profiles"
  });

  // 8. Profile age (10 points)
  const isProfileOlder = factors.profileAgeDays >= 30;
  breakdown.push({
    key: "age",
    name: "Established Profile Age",
    status: isProfileOlder,
    points: isProfileOlder ? 10 : Math.round((factors.profileAgeDays / 30) * 10),
    maxPoints: 10,
    description: `Registered for ${factors.profileAgeDays} days (Full points for 30+ days)`
  });

  // 9. Complaint history (5 points)
  const hasNoComplaints = factors.complaintsCount === 0;
  breakdown.push({
    key: "complaints",
    name: "Clean Compliance Record",
    status: hasNoComplaints,
    points: hasNoComplaints ? 5 : 0,
    maxPoints: 5,
    description: hasNoComplaints 
      ? "Zero user complaints or flags recorded against this profile" 
      : `${factors.complaintsCount} warning flags logged by members`
  });

  // Total Score Summation
  const score = breakdown.reduce((acc, f) => acc + f.points, 0);

  // Convert to star rating out of 5 stars
  // 90-100: 5 stars
  // 70-89: 4 stars
  // 50-69: 3 stars
  // 30-49: 2 stars
  // 0-29: 1 star
  let starRating = 1;
  let tier = "⭐ Low Trust Profile";
  let tierColor = "text-rose-400";
  let bgColor = "bg-rose-500/10";
  let borderColor = "border-rose-500/20";
  let starsDisplay = "⭐";

  if (score >= 90) {
    starRating = 5;
    tier = "⭐⭐⭐⭐⭐ Trusted Profile";
    tierColor = "text-emerald-400";
    bgColor = "bg-emerald-500/10";
    borderColor = "border-emerald-500/20";
    starsDisplay = "⭐⭐⭐⭐⭐";
  } else if (score >= 70) {
    starRating = 4;
    tier = "⭐⭐⭐⭐ Verified Profile";
    tierColor = "text-teal-400";
    bgColor = "bg-teal-500/10";
    borderColor = "border-teal-500/20";
    starsDisplay = "⭐⭐⭐⭐";
  } else if (score >= 50) {
    starRating = 3;
    tier = "⭐⭐⭐ Standard Profile";
    tierColor = "text-amber-400";
    bgColor = "bg-amber-500/10";
    borderColor = "border-amber-500/20";
    starsDisplay = "⭐⭐⭐";
  } else if (score >= 30) {
    starRating = 2;
    tier = "⭐⭐ Basic Profile";
    tierColor = "text-orange-400";
    bgColor = "bg-orange-500/10";
    borderColor = "border-orange-500/20";
    starsDisplay = "⭐⭐";
  }

  return {
    score,
    starRating,
    starsDisplay,
    tier,
    tierColor,
    bgColor,
    borderColor,
    factors: breakdown
  };
}
