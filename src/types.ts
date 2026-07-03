/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VerificationDetails {
  documentType: string;
  idNumberMasked: string;
  selfieMatchScore: number; // 0 to 100
  verifiedAt: string;
  status: "verified" | "pending" | "unverified";
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  education: string;
  religion: string;
  sect: string;          // e.g., Iyer, Iyengar, Saraswat, Kanyakubj, Chitpavan, etc.
  gotra: string;         // e.g., Kashyapa, Bharadwaja, Vashishta, Gautama, Shandilya, etc.
  nakshatra: string;     // Star/Birth Star (e.g., Rohini, Revati, Ashwini, Krittika, etc.)
  bio: string;
  imageUrl: string;
  interests: string[];
  values: {
    family: "High" | "Medium" | "Low";
    career: "High" | "Medium" | "Low";
    lifestyle: "Traditional" | "Moderate" | "Modern";
    growth: "High" | "Medium" | "Low";
  };
  languages: string[];
  motherTongue?: string;
  verified: boolean;
  verification: VerificationDetails;
  rasi?: string;          // Moon Sign (e.g. Rishabha, Kataka, Mesha)
  lagnam?: string;        // Ascendant / Lagna (e.g. Tula, Kanya, Simha)
  birthDate?: string;     // e.g. "1998-05-14"
  birthTime?: string;     // e.g. "14:30"
  birthPlace?: string;    // e.g. "Chennai"
  subSect?: string;       // e.g. "Vadama"
  parentStatus?: string;  // e.g. "Both Parents Alive"
  parentGuardian?: string;// e.g. "Son of Sri..."
  height?: string;        // e.g. "5 Feet 11 Inches / 180 cms"
  familyStatus?: string;  // e.g. "Upper Middle Class"
  padam?: string;         // e.g. "pada I"
  attachments?: Record<string, { name: string; size: string; status: "Attached" }>;
  dosham?: {
    chevvai: "Yes" | "No"; // Mars Dosham
    rahuKetu: "Yes" | "No"; // Rahu Ketu Dosham
  };
  rasiChartPlacements?: Record<string, string>; // House-wise planet list e.g. { "Mesha": "Sy, Bu", ... }
  amsamChartPlacements?: Record<string, string>; // House-wise planet list e.g. { "Tula": "Ma, Gu", ... }
  expectations?: string;
  achievements?: string;
  familyWishes?: string;
  state?: string;
  pincode?: string;
  currentMilestone?: "Registration" | "Shortlisted" | "Engaged" | "Married" | "Happy Testimony";
  isSecondMarriage?: boolean;
  milestoneTimestamps?: {
    registration: string;
    shortlisted?: string;
    engaged?: string;
    married?: string;
    happyTestimony?: string;
  };
  trustFactors?: {
    emailVerified: boolean;
    mobileVerified: boolean;
    idVerified: boolean;
    employmentVerified: boolean;
    educationVerified: boolean;
    familyVerified: boolean;
    socialVerified: boolean;
    profileAgeDays: number;
    complaintsCount: number;
  };
  additionalPhotos?: string[];
  isCameraCaptured?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  ciphertext: string;
  decryptedText: string;
  timestamp: string;
  isEncrypted: boolean;
  algorithm: string;
  translationLanguage?: string;
  translatedText?: string;
}

export interface CompatibilityInsight {
  overallScore: number;
  lifestyleHarmony: number; // 0-100
  coreValuesAlign: number; // 0-100
  careerSynergy: number; // 0-100
  emotionalConnect: number; // 0-100
  detailedInsight: string;
  recommendations: string[];
}

export interface Vendor {
  id: string;
  name: string;
  category: "Purohit & Pujari" | "Vedic Astrologer" | "Sattvik Catering" | "Heritage Kalyana Mandapam";
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  pricing: string;
  imageUrl: string;
  bio: string;
  commissionRate: number; // e.g. 10 for 10%
  totalSales: number;     // total booking amount
  commissionPaid: number; // total commission paid to platform
  commissionDue: number;  // pending commission to pay
}

export interface PaymentTx {
  id: string;
  type: "Membership Upgrade" | "Vendor Commission" | "Vendor Registration Fee";
  amount: number;
  date: string;
  status: "Success" | "Failed";
  description: string;
}

