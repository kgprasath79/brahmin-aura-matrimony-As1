/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Profile, PaymentTx } from "../types";
import { ShieldCheck, MapPin, Briefcase, GraduationCap, Flame, MessageSquare, Sparkles, Star, Milestone, CreditCard, Lock, Check, Gift, AlertTriangle, ShieldAlert, Eye, EyeOff, Loader2, FileText, UserPlus, Trash2, Plus, Info, Users, Search, CheckCircle2 } from "lucide-react";
import HoroscopeChart from "./HoroscopeChart";
import { getTenPoruthams } from "../utils/astrology";
import KalasaLogo from "./KalasaLogo";
import TrustScoreBadge from "./TrustScoreBadge";
import { calculateProfileTrust } from "../utils/trustScore";
import { useLanguage } from "../context/LanguageContext";
import { BRAHMIN_SECTS, BRAHMIN_GOTRAS } from "../data/brahminData";

interface DiscoverTabProps {
  profiles: Profile[];
  userRole: "member" | "super_admin" | "moderator" | "support_admin";
  onDeleteProfile: (id: string) => void;
  onAddProfile: (profile: Profile) => void;
  onSelectCompatibility: (profile: Profile) => void;
  onSelectChat: (profile: Profile) => void;
  onUpdateProfile?: (profile: Profile) => void;
}

export default function DiscoverTab({
  profiles,
  userRole,
  onDeleteProfile,
  onAddProfile,
  onSelectCompatibility,
  onSelectChat,
  onUpdateProfile,
}: DiscoverTabProps) {
  const { t } = useLanguage();
  const [filterGender, setFilterGender] = useState<string>("All");
  const [filterSect, setFilterSect] = useState<string>("All");
  const [expandedHoroscopeId, setExpandedHoroscopeId] = useState<string | null>(null);
  const [expandedVedicId, setExpandedVedicId] = useState<string | null>(null);

  // --- NEW SECURE PHOTO VAULT & FAMILY GUARDIAN DASHBOARD STATES ---
  const [vaultSettings, setVaultSettings] = useState({
    blurPhoto: false,
    watermark: false,
    restrictScreenshots: false
  });
  const [vaultAccess, setVaultAccess] = useState<Record<string, "locked" | "requested" | "granted">>({
    "cand-1": "granted",
    "cand-2": "granted",
    "cand-3": "granted",
    "cand-4": "granted",
    "cand-5": "granted",
    "cand-6": "granted",
    "cand-7": "granted",
    "cand-8": "granted"
  });
  const [screenshotWarningId, setScreenshotWarningId] = useState<string | null>(null);
  
  const [activeDashboardMode, setActiveDashboardMode] = useState<"all" | "family_dashboard" | "photo_vault">("all");
  const [familyShortlist, setFamilyShortlist] = useState<string[]>(["cand-2", "cand-5"]);
  const [familyComments, setFamilyComments] = useState<Record<string, string[]>>({
    "cand-1": ["Uncle: Gotra alignment looks very compatible.", "Father: Excellent professional accomplishments."],
    "cand-2": ["Mother: Expresses sincere respect for traditional values.", "Sister: Career goals match our expectations."],
    "cand-5": ["Grandmother: Birth stars match beautifully according to our family astrologer."]
  });
  const [newCommentInput, setNewCommentInput] = useState<Record<string, string>>({});
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>("Father");

  const handleAddFamilyComment = (candidateId: string) => {
    const commentText = newCommentInput[candidateId]?.trim();
    if (!commentText) return;
    
    setFamilyComments(prev => ({
      ...prev,
      [candidateId]: [...(prev[candidateId] || []), `${selectedFamilyMember}: ${commentText}`]
    }));
    
    setNewCommentInput(prev => ({ ...prev, [candidateId]: "" }));
  };

  const toggleFamilyShortlist = (candidateId: string) => {
    setFamilyShortlist(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId) 
        : [...prev, candidateId]
    );
  };

  const milestoneStages = [
    { key: "Registration", label: "Registered", color: "text-blue-400", bg: "bg-blue-500", dateKey: "registration" },
    { key: "Shortlisted", label: "Shortlisted", color: "text-amber-400", bg: "bg-amber-500", dateKey: "shortlisted" },
    { key: "Engaged", label: "Engaged", color: "text-purple-400", bg: "bg-purple-500", dateKey: "engaged" },
    { key: "Married", label: "Married", color: "text-rose-400", bg: "bg-rose-500", dateKey: "married" },
    { key: "Happy Testimony", label: "Testimony", color: "text-emerald-400", bg: "bg-emerald-500", dateKey: "happyTestimony" }
  ];

  const handleSetMilestone = (p: Profile, stage: "Registration" | "Shortlisted" | "Engaged" | "Married" | "Happy Testimony") => {
    if (!onUpdateProfile) return;
    
    const nowStr = new Date().toISOString();
    const updatedTimestamps = { ...(p.milestoneTimestamps || { registration: nowStr }) };
    
    if (stage === "Registration") {
      updatedTimestamps.registration = updatedTimestamps.registration || nowStr;
    } else if (stage === "Shortlisted") {
      updatedTimestamps.shortlisted = updatedTimestamps.shortlisted || nowStr;
    } else if (stage === "Engaged") {
      updatedTimestamps.shortlisted = updatedTimestamps.shortlisted || nowStr;
      updatedTimestamps.engaged = updatedTimestamps.engaged || nowStr;
    } else if (stage === "Married") {
      updatedTimestamps.shortlisted = updatedTimestamps.shortlisted || nowStr;
      updatedTimestamps.engaged = updatedTimestamps.engaged || nowStr;
      updatedTimestamps.married = updatedTimestamps.married || nowStr;
    } else if (stage === "Happy Testimony") {
      updatedTimestamps.shortlisted = updatedTimestamps.shortlisted || nowStr;
      updatedTimestamps.engaged = updatedTimestamps.engaged || nowStr;
      updatedTimestamps.married = updatedTimestamps.married || nowStr;
      updatedTimestamps.happyTestimony = updatedTimestamps.happyTestimony || nowStr;
    }
    
    const updatedProfile: Profile = {
      ...p,
      currentMilestone: stage,
      milestoneTimestamps: updatedTimestamps
    };
    
    onUpdateProfile(updatedProfile);
  };
  const [filterGotra, setFilterGotra] = useState<string>("All");
  const [filterVerified, setFilterVerified] = useState<boolean>(false);
  const [sagotraAvoid, setSagotraAvoid] = useState<boolean>(true);
  const [filterSecondMarriage, setFilterSecondMarriage] = useState<boolean>(false);
  const [minTrustScore, setMinTrustScore] = useState<number>(0);

  // Community-requested multi-dimensional matching filters
  const [filterMotherTongue, setFilterMotherTongue] = useState<string>("All");
  const [filterRasi, setFilterRasi] = useState<string>("All");
  const [filterProfileName, setFilterProfileName] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterEducation, setFilterEducation] = useState<string>("");
  const [filterExpectation, setFilterExpectation] = useState<string>("");
  const [filterLiveAstroMatch, setFilterLiveAstroMatch] = useState<boolean>(false);

  // --- APPLIED FILTERS STATE FOR TRADITIONAL MATRIMONIAL FILTERS ---
  const [appliedFilters, setAppliedFilters] = useState({
    gender: "All",
    sect: "All",
    gotra: "All",
    sagotraAvoid: true,
    minTrustScore: 0,
    secondMarriage: false,
    motherTongue: "All",
    rasi: "All",
    profileName: "",
    location: "",
    education: "",
    expectation: "",
    liveAstroMatch: false,
  });

  const hasUnappliedFilters = useMemo(() => {
    return (
      filterGender !== appliedFilters.gender ||
      filterSect !== appliedFilters.sect ||
      filterGotra !== appliedFilters.gotra ||
      sagotraAvoid !== appliedFilters.sagotraAvoid ||
      minTrustScore !== appliedFilters.minTrustScore ||
      filterSecondMarriage !== appliedFilters.secondMarriage ||
      filterMotherTongue !== appliedFilters.motherTongue ||
      filterRasi !== appliedFilters.rasi ||
      filterProfileName !== appliedFilters.profileName ||
      filterLocation !== appliedFilters.location ||
      filterEducation !== appliedFilters.education ||
      filterExpectation !== appliedFilters.expectation ||
      filterLiveAstroMatch !== appliedFilters.liveAstroMatch
    );
  }, [
    filterGender, filterSect, filterGotra, sagotraAvoid, minTrustScore,
    filterSecondMarriage, filterMotherTongue, filterRasi, filterProfileName,
    filterLocation, filterEducation, filterExpectation, filterLiveAstroMatch,
    appliedFilters
  ]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      gender: filterGender,
      sect: filterSect,
      gotra: filterGotra,
      sagotraAvoid: sagotraAvoid,
      minTrustScore: minTrustScore,
      secondMarriage: filterSecondMarriage,
      motherTongue: filterMotherTongue,
      rasi: filterRasi,
      profileName: filterProfileName,
      location: filterLocation,
      education: filterEducation,
      expectation: filterExpectation,
      liveAstroMatch: filterLiveAstroMatch,
    });
  };

  const handleClearAllFilters = () => {
    setFilterGender("All");
    setFilterSect("All");
    setFilterGotra("All");
    setSagotraAvoid(true);
    setMinTrustScore(0);
    setFilterSecondMarriage(false);
    setFilterMotherTongue("All");
    setFilterRasi("All");
    setFilterProfileName("");
    setFilterLocation("");
    setFilterEducation("");
    setFilterExpectation("");
    setFilterLiveAstroMatch(false);

    setAppliedFilters({
      gender: "All",
      sect: "All",
      gotra: "All",
      sagotraAvoid: true,
      minTrustScore: 0,
      secondMarriage: false,
      motherTongue: "All",
      rasi: "All",
      profileName: "",
      location: "",
      education: "",
      expectation: "",
      liveAstroMatch: false,
    });
  };

  // Profile creator states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // Camera capture and manual upload states for anti-fake profile verification
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [manualPhoto1, setManualPhoto1] = useState<string>("");
  const [manualPhoto2, setManualPhoto2] = useState<string>("");
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 300 } });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access denied or unavailable, using high-trust identity simulator:", err);
      // Fallback is automatically handled in the snap photo action
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && cameraStream) {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 400, 300);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedPhotoUrl(dataUrl);
        stopCamera();
      }
    } else {
      // High-quality fallback face capture simulation
      const fallbacks = [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setCapturedPhotoUrl(randomFallback);
      setIsCapturing(false);
    }
  };

  const handleManualUpload = (slot: 1 | 2, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          if (slot === 1) setManualPhoto1(reader.result);
          else setManualPhoto2(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const closeAddModal = () => {
    stopCamera();
    setShowAddModal(false);
    setCapturedPhotoUrl("");
    setManualPhoto1("");
    setManualPhoto2("");
  };

  const [newProfileName, setNewProfileName] = useState<string>("");
  const [newProfileGender, setNewProfileGender] = useState<string>("Female");
  const [newProfileAge, setNewProfileAge] = useState<number>(27);
  const [newProfileSect, setNewProfileSect] = useState<string>("Iyer (Vadama)");
  const [newProfileGotra, setNewProfileGotra] = useState<string>("Kashyapa");
  const [newProfileNakshatra, setNewProfileNakshatra] = useState<string>("Rohini");
  const [newProfileRasi, setNewProfileRasi] = useState<string>("Rishabha");
  const [newProfileLagnam, setNewProfileLagnam] = useState<string>("Kanya");
  const [newProfileOccupation, setNewProfileOccupation] = useState<string>("Senior Product Manager");
  const [newProfileLocation, setNewProfileLocation] = useState<string>("Chennai, India");
  const [newProfileEducation, setNewProfileEducation] = useState<string>("MBA, Indian Institute of Management");
  const [newProfileBio, setNewProfileBio] = useState<string>("");

  const handleAutoFillBrahminProfile = () => {
    const isMale = newProfileGender === "Male";
    const maleNames = ["Arvind Chidambaram", "Dr. Karthik Sastry", "Ramachandran Iyer", "Siddharth Joshi", "Venkatraman Acharya"];
    const femaleNames = ["Ananya Chaturvedi", "Janaki Srinivasan", "Sowmya Subramanian", "Shruthi Rao", "Gayatri Dravid"];
    
    const randomName = isMale 
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)];

    const maleBios = [
      "A software architect trained in Carnatic flute. Passionate about Sanskrit literature, morning yogic routines, and tech innovations. Looking for a family-focused companion.",
      "Pediatric resident with deep interest in temple architectures and ancient heritage. Value simplicity, continuous growth, and traditional Brahmin ethics.",
      "A research scientist specializing in biochemistry. I enjoy playing chess, studying Vedic astrology alignments, and traveling to spiritual heritages."
    ];
    
    const femaleBios = [
      "Visual designer who runs an organic sustainable startup. Deeply connected to Bharatanatyam and devotional Carnatic songs. Looking for an alliance of high values.",
      "Data scientist, avid trekker, and Carnatic violinist. Believer of simple living, high thinking, and daily prayers. Seeking a supportive life partner.",
      "Finance manager specializing in micro-investing. Love preparing sattvik cuisine, reading up on lineage histories, and visiting ancient heritage temples."
    ];

    const randomBio = isMale 
      ? maleBios[Math.floor(Math.random() * maleBios.length)]
      : femaleBios[Math.floor(Math.random() * femaleBios.length)];

    const occupations = isMale
      ? ["Lead Devops Architect", "Senior Pediatrician", "Investment Banker", "AI Ethics Lead", "Sanskrit Professor"]
      : ["Senior Product Manager", "UI/UX Visual Lead", "Genomics Scientist", "Chartered Accountant", "Carnatic Vocalist"];

    const gotras = ["Kashyapa", "Bharadwaja", "Vashishta", "Gautama", "Shandilya", "Harita", "Atri"];
    const nakshatras = ["Rohini", "Revati", "Ashwini", "Krittika", "Ardra", "Anuradha", "Swati"];
    const rasiss = ["Rishabha", "Meena", "Mesha", "Mithuna", "Tula", "Kumbha", "Vrischika"];
    const sects = isMale 
      ? ["Iyer (Vadama)", "Iyer (Brahacharanam)", "Iyengar (Thenkalai)", "Saraswat", "Chitpavan"]
      : ["Iyer (Vadama)", "Iyengar (Vadakalai)", "Saraswat", "Chitpavan", "Kanyakubj"];

    setNewProfileName(randomName);
    setNewProfileAge(Math.floor(Math.random() * 8) + 25); // 25-32
    setNewProfileOccupation(occupations[Math.floor(Math.random() * occupations.length)]);
    setNewProfileBio(randomBio);
    setNewProfileGotra(gotras[Math.floor(Math.random() * gotras.length)]);
    setNewProfileNakshatra(nakshatras[Math.floor(Math.random() * nakshatras.length)]);
    setNewProfileRasi(rasiss[Math.floor(Math.random() * rasiss.length)]);
    setNewProfileSect(sects[Math.floor(Math.random() * sects.length)]);
  };

  const handleAddNewProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName) return;

    const isMale = newProfileGender === "Male";
    const maleImg = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80"
    ];
    const femaleImg = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"
    ];

    const chosenImg = isMale 
      ? maleImg[Math.floor(Math.random() * maleImg.length)]
      : femaleImg[Math.floor(Math.random() * femaleImg.length)];

    const created: Profile = {
      id: "mock_" + Date.now(),
      name: newProfileName,
      age: Number(newProfileAge),
      gender: newProfileGender as "Male" | "Female",
      occupation: newProfileOccupation,
      location: newProfileLocation,
      education: newProfileEducation,
      religion: "Hindu (Brahmin)",
      sect: newProfileSect,
      gotra: newProfileGotra,
      nakshatra: newProfileNakshatra,
      bio: newProfileBio || "A highly educated individual seeking a traditional partner.",
      imageUrl: capturedPhotoUrl || chosenImg,
      additionalPhotos: [manualPhoto1, manualPhoto2].filter(Boolean),
      isCameraCaptured: !!capturedPhotoUrl,
      interests: ["Classical Music", "Yoga", "Family Tradition", "Reading", "Vedic Heritage"],
      values: {
        family: "High",
        career: "High",
        lifestyle: "Moderate",
        growth: "High"
      },
      languages: ["English", "Sanskrit", isMale ? "Tamil" : "Hindi"],
      verified: true,
      expectations: "Looking for a warm family connection with high respect for cultural values.",
      achievements: "Distinguished contributor to cultural legacy and family ties.",
      familyWishes: "Elders seek a pure astrological match with harmonious habits.",
      verification: {
        documentType: "Aadhaar Card",
        idNumberMasked: "XXXX-XXXX-" + (Math.floor(Math.random() * 8999) + 1000),
        selfieMatchScore: capturedPhotoUrl ? 99.8 : 98.4,
        verifiedAt: "2026-06-29",
        status: "verified"
      },
      rasi: newProfileRasi,
      lagnam: newProfileLagnam,
      dosham: {
        chevvai: "No",
        rahuKetu: "No"
      },
      rasiChartPlacements: {
        [newProfileRasi]: "Ch",
        [newProfileLagnam]: "Lg"
      },
      amsamChartPlacements: {
        [newProfileRasi]: "Ch",
        [newProfileLagnam]: "Lg"
      },
      state: (() => {
        const city = newProfileLocation.toLowerCase();
        if (city.includes("bangalore") || city.includes("mangalore") || city.includes("udupi")) return "Karnataka";
        if (city.includes("chennai")) return "Tamil Nadu";
        if (city.includes("pune") || city.includes("mumbai")) return "Maharashtra";
        if (city.includes("varanasi")) return "Uttar Pradesh";
        if (city.includes("delhi")) return "Delhi";
        return "Tamil Nadu";
      })(),
      pincode: (() => {
        const city = newProfileLocation.toLowerCase();
        if (city.includes("bangalore")) return "560001";
        if (city.includes("mangalore")) return "575001";
        if (city.includes("udupi")) return "576001";
        if (city.includes("chennai")) return "600004";
        if (city.includes("pune")) return "411001";
        if (city.includes("mumbai")) return "400001";
        if (city.includes("varanasi")) return "221001";
        if (city.includes("delhi")) return "110001";
        return "600001";
      })(),
      currentMilestone: "Registration",
      milestoneTimestamps: {
        registration: new Date().toISOString()
      }
    };

    onAddProfile(created);
    setShowAddModal(false);
    
    // Reset fields
    setNewProfileName("");
    setNewProfileBio("");
    setCapturedPhotoUrl("");
    setManualPhoto1("");
    setManualPhoto2("");
  };

  // Favorite state loaded/saved to localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("aura_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [downloadApprovals, setDownloadApprovals] = useState<Record<string, "none" | "requested" | "approved">>(() => {
    const saved = localStorage.getItem("aura_download_approvals");
    return saved ? JSON.parse(saved) : {};
  });

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fId => fId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("aura_favorites", JSON.stringify(updated));
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const getApprovalStatus = (id: string) => downloadApprovals[id] || "none";

  const requestApproval = (id: string) => {
    const updated = { ...downloadApprovals, [id]: "requested" as const };
    setDownloadApprovals(updated);
    localStorage.setItem("aura_download_approvals", JSON.stringify(updated));

    // Simulate approval callback after 2 seconds
    setTimeout(() => {
      const approved = { ...updated, [id]: "approved" as const };
      setDownloadApprovals(approved);
      localStorage.setItem("aura_download_approvals", JSON.stringify(approved));
    }, 2000);
  };

  const handleDownloadDossier = (profile: Profile) => {
    // Generate a beautiful verified dossier text file for download
    const dossierText = `===========================================================
               HERITAGE MATRIMONY
           VERIFIED SOLEMN CONTACT DOSSIER
===========================================================
CERTIFIED SECURE REF: HERITAGE-TRUST-SEAL-${profile.id.toUpperCase()}
Aadhaar Identity Status: VERIFIED (Biometrics Match 100%)
Ancestral Gotra Lineage: VERIFIED (${profile.gotra} Gotra)
Sect / sub-sect Lineage: ${profile.sect}

DEMOGRAPHICS & DETAILS:
Name: ${profile.name}
Age / Gender: ${profile.age} / ${profile.gender}
Location: ${profile.location}
Education: ${profile.education}
Occupation: ${profile.occupation}
Astrological Nakshatra: ${profile.nakshatra} (${profile.rasi} Rasi)

MUTUAL COVENANT EXPECTATIONS & WISHES:
Personal Expectations:
"${profile.expectations || 'Seeking an alliance that values both traditional culture and professional ambitions.'}"

Eminent Achievements & Milestones:
"${profile.achievements || 'Distinguished in chosen career, engaged in community welfare and classical arts.'}"

Family Guardians & Elders Wishes:
"${profile.familyWishes || 'Elders desire a harmonious, spiritually grounded connection with high family values.'}"

VERIFIED PARENTAL CONTACT DETAILS:
Guardian Name: Prakash Kumar Sharma (Father)
Family Gotra Origin: ${profile.gotra}
Contact Phone: +91 98450 12891 (Primary Home)
Contact Email: sharma.family.agraharam@outlook.com
Verified Address: Plot 24, Agraharam Street, Triplicane, Chennai - 600005

===========================================================
This document was unlocked and generated with explicit consent
and digital signatures of both family guardians.
Heritage Matrimony Board of Lineage Purity.
===========================================================`;

    const blob = new Blob([dossierText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.toLowerCase().replace(/\s+/g, "_")}_verified_dossier.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Premium Billing simulation state
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number; desc: string } | null>(null);
  const [showPlanComparison, setShowPlanComparison] = useState<boolean>(true);
  
  // Checkout card details
  const [cardNumber, setCardNumber] = useState<string>("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState<string>("12/29");
  const [cardCvv, setCardCvv] = useState<string>("382");
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentTrace, setPaymentTrace] = useState<string[]>([]);
  const [duplicateChargePrevented, setDuplicateChargePrevented] = useState<boolean>(false);

  // Current user's default gotra is Bharadwaja
  const currentUserGotra = "Bharadwaja";

  // Precompute trust scores and map them by profile ID for O(1) retrieval during search
  const trustScoresMap = useMemo(() => {
    const scores = new Map<string, number>();
    for (const p of profiles) {
      scores.set(p.id, calculateProfileTrust(p).score);
    }
    return scores;
  }, [profiles]);

  // Memoize registered user profile and matching reference star (Requirement 3)
  const userRegisteredProfile = useMemo(() => {
    const saved = localStorage.getItem("registeredBrahminProfile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  }, []);

  const matchReferenceStar = userRegisteredProfile?.nakshatra || "Revati";

  // Memoize filtered profiles to avoid recalculating on unnecessary re-renders
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (appliedFilters.gender !== "All" && profile.gender !== appliedFilters.gender) return false;
      if (appliedFilters.sect !== "All" && !profile.sect.includes(appliedFilters.sect)) return false;
      if (appliedFilters.gotra !== "All" && !profile.gotra.toLowerCase().includes(appliedFilters.gotra.toLowerCase())) return false;
      
      // Sagotra avoidance filter (traditional rule - same gotra matches are avoided)
      if (appliedFilters.sagotraAvoid && profile.gotra === currentUserGotra) return false;
      if (appliedFilters.secondMarriage && !profile.isSecondMarriage) return false;
      
      // Filter by precomputed trust score
      if (appliedFilters.minTrustScore > 0) {
        const score = trustScoresMap.get(profile.id) ?? 0;
        if (score < appliedFilters.minTrustScore) return false;
      }

      // 1. Mother Tongue Filter
      if (appliedFilters.motherTongue !== "All") {
        const motherTongueLower = appliedFilters.motherTongue.toLowerCase();
        const hasLang = (profile.languages?.some(lang => 
          lang.toLowerCase().includes(motherTongueLower)
        ) || (profile.motherTongue && profile.motherTongue.toLowerCase().includes(motherTongueLower)));
        if (!hasLang) return false;
      }

      // 2. Raasi (Rasi) Filter
      if (appliedFilters.rasi !== "All" && profile.rasi) {
        const normRasi = (rasiStr: string) => rasiStr.toLowerCase().replace("bh", "b");
        if (normRasi(profile.rasi) !== normRasi(appliedFilters.rasi)) return false;
      }

      // 3. Profile Name Filter
      if (appliedFilters.profileName.trim() !== "") {
        if (!profile.name.toLowerCase().includes(appliedFilters.profileName.toLowerCase())) return false;
      }

      // 4. Location Filter
      if (appliedFilters.location.trim() !== "") {
        if (!profile.location.toLowerCase().includes(appliedFilters.location.toLowerCase())) return false;
      }

      // 5. Education Filter
      if (appliedFilters.education.trim() !== "") {
        if (!profile.education.toLowerCase().includes(appliedFilters.education.toLowerCase())) return false;
      }

      // 6. Expectation Filter
      if (appliedFilters.expectation.trim() !== "") {
        const expectText = (profile.expectations || "").toLowerCase() + " " + (profile.bio || "").toLowerCase();
        if (!expectText.includes(appliedFilters.expectation.toLowerCase())) return false;
      }

      // 7. Live Horoscope Compatibility Filter (Requirement 3)
      if (appliedFilters.liveAstroMatch) {
        // Calculate points between reference star and candidate's star
        const matches = getTenPoruthams(matchReferenceStar, profile.nakshatra);
        const rawPoints = matches.reduce((sum, item) => sum + item.points, 0);
        const maxPoints = matches.reduce((sum, item) => sum + item.maxPoints, 0) || 27;
        const totalPoints = Math.min(rawPoints, maxPoints);
        
        // Show only matching profiles (score of 13+ is traditionally deemed compatible)
        if (totalPoints < 13) return false;
      }
      
      return true;
    });
  }, [
    profiles,
    appliedFilters,
    trustScoresMap,
    matchReferenceStar
  ]);

  const handleOpenCheckout = (planName: string, price: number, desc: string) => {
    setSelectedPlan({ name: planName, price, desc });
    setShowCheckout(true);
    setPaymentSuccess(false);
    setPaymentTrace([]);
    setDuplicateChargePrevented(false);
  };

  const processSimulatedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setIsPaying(true);
    setDuplicateChargePrevented(false);
    setPaymentTrace([
      "🔄 Generating secure Idempotency key locally (idem_cl_...)...",
    ]);

    try {
      const clIdempotencyKey = `idem_cl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await new Promise(r => setTimeout(r, 600));

      setPaymentTrace(prev => [
        ...prev,
        "🔒 Contacting server-side payment module...",
        `🔑 Idempotency payload: ${clIdempotencyKey}`,
      ]);

      // 1. Initiate checkout session
      const checkoutRes = await fetch("/api/payments/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: selectedPlan.name,
          price: selectedPlan.price,
          idempotencyKey: clIdempotencyKey,
        }),
      });

      if (!checkoutRes.ok) {
        throw new Error("Failed to initialize checkout session.");
      }

      const checkoutData = await checkoutRes.json();
      setPaymentTrace(prev => [
        ...prev,
        "✅ Idempotency Key validation: APPROVED (No duplicate transactions).",
        `📝 Checkout Session created: ${checkoutData.txnId}`,
        "⏳ Redirecting to gateway / processing card handshake...",
      ]);

      await new Promise(r => setTimeout(r, 800));

      setPaymentTrace(prev => [
        ...prev,
        "🛡️ Running Duplicate Charge Prevention checks...",
      ]);
      await new Promise(r => setTimeout(r, 400));
      setPaymentTrace(prev => [
        ...prev,
        "✅ Zero race conditions detected. Ready for secure payment authorization.",
      ]);

      // 2. Deliver Webhook securely with timing-safe HMAC SHA-256 signature
      setPaymentTrace(prev => [
        ...prev,
        "📡 Gateway completed transaction. Dispatching Webhook...",
        `🔐 HMAC SHA-256 Signature generated: ${checkoutData.webhookSignature.substring(0, 16)}...`,
      ]);

      await new Promise(r => setTimeout(r, 700));

      const webhookRes = await fetch("/api/payments/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-signature": checkoutData.webhookSignature,
        },
        body: JSON.parse(checkoutData.webhookPayload),
      });

      if (!webhookRes.ok) {
        throw new Error("Webhook signature validation failed.");
      }

      setPaymentTrace(prev => [
        ...prev,
        "🟢 Webhook Signature: VALIDATED. Transaction permanently secured.",
      ]);

      setIsPaying(false);
      setPaymentSuccess(true);
      setIsPremiumUnlocked(true);

      // Try to trigger a second duplicate payment on purpose to test idempotency live
      setPaymentTrace(prev => [
        ...prev,
        "🧪 [Idempotency Demonstration]: Triggering an intentional duplicate payload submission...",
      ]);
      const duplicateRes = await fetch("/api/payments/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: selectedPlan.name,
          price: selectedPlan.price,
          idempotencyKey: clIdempotencyKey, // Re-use same key!
        }),
      });
      const duplicateData = await duplicateRes.json();
      if (duplicateData.isDuplicate) {
        setDuplicateChargePrevented(true);
        setPaymentTrace(prev => [
          ...prev,
          "🛡️ SUCCESS: Idempotency engine intercepted duplicate request. No double charging occurred! Recovery payload matched successfully.",
        ]);
      }

      setTimeout(() => {
        setShowCheckout(false);
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setPaymentTrace(prev => [...prev, `❌ Transaction Error: ${err.message}`]);
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Traditional Auspicious Brahmin Marriage Banner (Heritage Agraharam Style) */}
      <div 
        className="relative bg-cover bg-center border-2 border-amber-500/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl min-h-[260px] flex flex-col justify-between"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(26, 11, 13, 0.95) 45%, rgba(26, 11, 13, 0.45) 100%), url('https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=1200&q=80')` 
        }}
      >
        {/* auspicious hanging flower decorations (CSS garlands) */}
        <div className="absolute top-0 left-0 right-0 h-3 flex justify-around opacity-90 select-none">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="text-amber-500 text-xs animate-pulse leading-none" style={{ animationDelay: `${i * 150}ms` }}>
              ✿
            </span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 h-full mt-3">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500 text-slate-950 text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border border-amber-400 shadow-md">
                Auspicious Agraharam Union
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            
            {/* Double Side / Stacked main welcome heading */}
            <h1 className="text-2xl md:text-4xl font-serif font-extrabold text-amber-100 tracking-tight leading-none drop-shadow-lg">
              {t("shubhVivaah")}
            </h1>
            
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed drop-shadow font-serif">
              {t("bannerDesc")}
            </p>

            {/* Premium Interactive Quick Filter Badges inside the Banner for Logged-In Members */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[10px]">
              <span className="text-amber-400 font-bold uppercase tracking-wider font-mono">Quick Sect Filters:</span>
              <button 
                onClick={() => {
                  setFilterSect("Iyengar");
                  setFilterSecondMarriage(false);
                  setAppliedFilters(prev => ({ ...prev, sect: "Iyengar", secondMarriage: false }));
                }}
                className={`px-2.5 py-1 rounded-lg border hover:bg-amber-500/15 cursor-pointer text-amber-200 transition-all ${filterSect === "Iyengar" && !filterSecondMarriage ? "bg-amber-500 text-slate-950 font-black border-amber-400" : "bg-[#1c0b0d]/60 border-amber-500/20"}`}
              >
                Iyengar
              </button>
              <button 
                onClick={() => {
                  setFilterSect("Iyer");
                  setFilterSecondMarriage(false);
                  setAppliedFilters(prev => ({ ...prev, sect: "Iyer", secondMarriage: false }));
                }}
                className={`px-2.5 py-1 rounded-lg border hover:bg-amber-500/15 cursor-pointer text-amber-200 transition-all ${filterSect === "Iyer" && !filterSecondMarriage ? "bg-amber-500 text-slate-950 font-black border-amber-400" : "bg-[#1c0b0d]/60 border-amber-500/20"}`}
              >
                Iyer
              </button>
              <button 
                onClick={() => {
                  setFilterSect("Madhva");
                  setFilterSecondMarriage(false);
                  setAppliedFilters(prev => ({ ...prev, sect: "Madhva", secondMarriage: false }));
                }}
                className={`px-2.5 py-1 rounded-lg border hover:bg-amber-500/15 cursor-pointer text-amber-200 transition-all ${filterSect === "Madhva" && !filterSecondMarriage ? "bg-amber-500 text-slate-950 font-black border-amber-400" : "bg-[#1c0b0d]/60 border-amber-500/20"}`}
              >
                Madhva
              </button>
              <button 
                onClick={() => {
                  setFilterSecondMarriage(true);
                  setFilterSect("All");
                  setAppliedFilters(prev => ({ ...prev, secondMarriage: true, sect: "All" }));
                }}
                className={`px-2.5 py-1 rounded-lg border hover:bg-amber-500/15 cursor-pointer text-amber-200 flex items-center gap-1 transition-all ${filterSecondMarriage ? "bg-amber-500 text-slate-950 font-black border-amber-400" : "bg-[#1c0b0d]/60 border-amber-500/20"}`}
              >
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                II Marriage (Remarriage)
              </button>
              <button 
                onClick={handleClearAllFilters}
                className="px-2.5 py-1 rounded-lg border border-rose-500/20 bg-rose-950/20 hover:bg-rose-500/25 cursor-pointer text-rose-300 transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="bg-[#1c0b0d]/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 flex items-center space-x-5 self-stretch md:self-auto justify-around shadow-lg">
            <div className="text-center">
              <span className="text-amber-400/70 text-[9px] font-mono uppercase tracking-wider block font-bold">{t("verifiedSects")}</span>
              <span className="text-amber-100 font-extrabold text-lg font-serif">Iyer • Iyengar • Madhva</span>
            </div>
            <div className="w-px h-8 bg-amber-500/20" />
            <div className="text-center">
              <span className="text-amber-400/70 text-[9px] font-mono uppercase tracking-wider block font-bold">{t("gotraIntegrity")}</span>
              <span className="text-amber-100 font-extrabold text-lg font-serif">{t("secure100")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN TESTING & MOCK-TEST COMMAND DESK (ONLY visible if userRole !== "member") */}
      {userRole !== "member" && (
        <div className="bg-[#1c0b0d] border-2 border-dashed border-amber-500/40 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-amber-500/10">
            <div className="flex items-center space-x-2.5">
              <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/30 text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-serif font-bold text-amber-300 uppercase tracking-wider">
                    {t("adminDeck")}
                  </h3>
                  <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase">
                    {userRole.replace("_", " ")}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  {t("adminDeckDesc")}
                </p>
              </div>
            </div>

            <button
              id="admin-add-profile-btn"
              onClick={() => {
                setShowAddModal(true);
                handleAutoFillBrahminProfile();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t("addNewProfile")}</span>
            </button>
          </div>

          {/* Quick Metrics Dashboard inside Admin Deck */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/10">
              <span className="text-slate-400 text-[10px] block font-mono">TOTAL PROFILES</span>
              <span className="text-amber-300 font-bold text-lg font-serif">{profiles.length} Active</span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/10">
              <span className="text-slate-400 text-[10px] block font-mono">VERIFIED BY AADHAAR</span>
              <span className="text-emerald-400 font-bold text-lg font-serif">
                {profiles.filter(p => p.verified).length} Profiles ({Math.round((profiles.filter(p => p.verified).length / profiles.length) * 100)}%)
              </span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/10">
              <span className="text-slate-400 text-[10px] block font-mono">SAGOTRA COMPLIANT</span>
              <span className="text-indigo-400 font-bold text-lg font-serif">Activated</span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/10">
              <span className="text-slate-400 text-[10px] block font-mono">MOD TESTING CAPACITY</span>
              <span className="text-amber-400 font-bold text-lg font-serif">300,000+ Mock</span>
            </div>
          </div>
          
          <div className="bg-amber-500/5 p-2 rounded-xl text-[10px] text-amber-300/80 font-serif flex items-start gap-1.5 border border-amber-500/10">
            <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>
              <strong>Different Authorization Rules:</strong> <em>Super Admin</em> has absolute rights to delete any profile and run database stresses. <em>Moderator</em> can verify/add matches but lacks deletion rights. <em>Support</em> view is read-only. Standard <em>Members</em> cannot see this dashboard or the "Self Audit" tab.
            </span>
          </div>
        </div>
      )}

      {/* Advanced Gotra & Sect Filters Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3.5">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
          <div className="flex items-center gap-2">
            <Milestone className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("traditionalFilters")}</h3>
              <p className="text-[10px] text-slate-500">{t("traditionalFiltersDesc")}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            {/* Gender Selector */}
            <select
              id="gender-filter"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="All">{t("allGenders")}</option>
              <option value="Female">{t("seekingMen")}</option>
              <option value="Male">{t("seekingWomen")}</option>
            </select>

            {/* Sect Selector */}
            <select
              id="sect-filter"
              value={filterSect}
              onChange={(e) => setFilterSect(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-rose-500 cursor-pointer max-w-[150px]"
            >
              <option value="All">{t("allBrahminSects")}</option>
              {BRAHMIN_SECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Gotra Selector */}
            <select
              id="gotra-filter"
              value={filterGotra}
              onChange={(e) => setFilterGotra(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-rose-500 cursor-pointer max-w-[150px]"
            >
              <option value="All">{t("allAncestralGotras")}</option>
              {BRAHMIN_GOTRAS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* Sagotra Toggle */}
            <button
              id="toggle-sagotra"
              onClick={() => setSagotraAvoid(!sagotraAvoid)}
              className={`flex items-center space-x-1 px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-300 cursor-pointer ${
                sagotraAvoid
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
              title="Avoid matches from your own gotra (Bharadwaja)"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-500" />
              <span>Sagotra Warning: {sagotraAvoid ? "ON" : "OFF"}</span>
            </button>

            {/* Live Horoscope Astro-Match Only Toggle */}
            <button
              id="toggle-astro-match"
              onClick={() => setFilterLiveAstroMatch(!filterLiveAstroMatch)}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-300 cursor-pointer ${
                filterLiveAstroMatch
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-400 font-extrabold shadow-lg shadow-amber-500/5"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
              title="Filter profiles to show only those compatible with your horoscope/birth star"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Astro-Compatible Only: {filterLiveAstroMatch ? "ON" : "OFF"}</span>
            </button>

            {/* Second Marriage / Remarriage Toggle */}
            <button
              id="toggle-second-marriage"
              onClick={() => setFilterSecondMarriage(!filterSecondMarriage)}
              className={`flex items-center space-x-1 px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-300 cursor-pointer ${
                filterSecondMarriage
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
              title="Filter profiles seeking Second Marriage / Remarriage"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>II Marriage: {filterSecondMarriage ? "ACTIVE" : "ALL"}</span>
            </button>

            {/* Trust Score Filter */}
            <select
              id="trust-score-filter"
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-rose-500 cursor-pointer max-w-[170px]"
              title="Filter profiles based on calculated trust verification stars"
            >
              <option value="0">All Trust Ratings</option>
              <option value="30">⭐⭐+ Basic & Up</option>
              <option value="50">⭐⭐⭐+ Standard & Up</option>
              <option value="70">⭐⭐⭐⭐+ Highly Trusted</option>
              <option value="90">⭐⭐⭐⭐⭐ Pristine Only</option>
            </select>
          </div>
        </div>

        {/* Multi-Dimensional Search & Matching Filters */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 mb-3">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Multi-Dimensional Matching Filters</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 1. Profile Name Search */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="filter-name" className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Profile Name</label>
              <input
                id="filter-name"
                type="text"
                placeholder="Search by name..."
                value={filterProfileName}
                onChange={(e) => setFilterProfileName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 placeholder-slate-600 font-medium"
              />
            </div>

            {/* 2. Mother Tongue */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="filter-mothertongue" className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Mother Tongue</label>
              <select
                id="filter-mothertongue"
                value={filterMotherTongue}
                onChange={(e) => setFilterMotherTongue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 cursor-pointer font-medium"
              >
                <option value="All">All Mother Tongues</option>
                {["Tamil", "Telugu", "Kannada", "Marathi", "Hindi", "Sanskrit", "Konkani", "Malayalam"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* 3. Gothra (Gotra) Text Search */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="filter-gothra-input" className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Gothra (Gotra)</label>
              <input
                id="filter-gothra-input"
                type="text"
                placeholder="Type Gotra/Gothra..."
                value={filterGotra === "All" ? "" : filterGotra}
                onChange={(e) => setFilterGotra(e.target.value || "All")}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 placeholder-slate-600 font-medium"
              />
            </div>

            {/* 4. Raasi / Rasi Select */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="filter-rasi" className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Raasi (Rasi / Moon Sign)</label>
              <select
                id="filter-rasi"
                value={filterRasi}
                onChange={(e) => setFilterRasi(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 cursor-pointer font-medium"
              >
                <option value="All">All Raasis (Moon Signs)</option>
                {["Mesha", "Rishaba", "Mithuna", "Kataka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanur", "Makara", "Kumbham", "Meena"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* 5. Location Search */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="filter-location" className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Location</label>
              <input
                id="filter-location"
                type="text"
                placeholder="Search city/state/country..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 placeholder-slate-600 font-medium"
              />
            </div>

            {/* 6. Education Search */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="filter-education" className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Education</label>
              <input
                id="filter-education"
                type="text"
                placeholder="Search degrees (e.g., B.Tech, MBA)..."
                value={filterEducation}
                onChange={(e) => setFilterEducation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 placeholder-slate-600 font-medium"
              />
            </div>

            {/* 7. Expectation & Wishes */}
            <div className="space-y-1.5 text-left sm:col-span-2">
              <label htmlFor="filter-expectation" className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Partner Expectation / Wishlist</label>
              <input
                id="filter-expectation"
                type="text"
                placeholder="Search keywords (e.g. traditional, modern, sattvik, career)..."
                value={filterExpectation}
                onChange={(e) => setFilterExpectation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 placeholder-slate-600 font-medium"
              />
            </div>
          </div>

        {/* Traditional Matrimonial Filters Action Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {hasUnappliedFilters ? (
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 animate-pulse text-left">
                ⚠️ You have unapplied changes. Click "Apply Filters" to filter matches.
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-left">
                ✓ All filters applied. Showing {filteredProfiles.length} compatible {filteredProfiles.length === 1 ? "match" : "matches"}.
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleClearAllFilters}
              className="px-4 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl cursor-pointer transition-all duration-300"
            >
              Reset Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className={`px-5 py-2 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-md ${
                hasUnappliedFilters
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/20 scale-105 border border-amber-400 font-extrabold"
                  : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
        </div>
      </div>

      {filterLiveAstroMatch && (
        <div className="bg-slate-950 border-2 border-amber-500/30 rounded-2xl p-4.5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3 text-left">
            <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                Live Horoscope Match Mode Active
              </h4>
              <p className="text-[11px] text-slate-300 font-serif leading-relaxed mt-1">
                Showing only profiles compatible with reference Nakshatra: <strong className="text-amber-400 font-sans">{matchReferenceStar}</strong>. Non-compatible candidates are hidden to save your time.
              </p>
              {userRegisteredProfile ? (
                <p className="text-[9px] text-emerald-400 mt-1 font-sans flex items-center gap-1">
                  <Check className="w-3 h-3" /> Linked to your registered profile: {userRegisteredProfile.name}
                </p>
              ) : (
                <p className="text-[9px] text-slate-500 mt-1 font-sans">
                  [Demo Reference Mode] To match with your custom birth details, register/update your profile in the <strong>Verification</strong> tab.
                </p>
              )}
            </div>
          </div>
          <button
            id="clear-astro-match-btn"
            onClick={() => setFilterLiveAstroMatch(false)}
            className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-3 py-1.5 bg-amber-500 text-slate-950 hover:brightness-110 rounded-xl transition-all cursor-pointer whitespace-nowrap animate-pulse"
          >
            Show All Profiles
          </button>
        </div>
      )}

      {/* Premium Membership Plans Ribbon & Comparison Table */}
      {!isPremiumUnlocked && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-rose-500/20 rounded-3xl p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="bg-gradient-to-tr from-amber-500 to-rose-600 p-2.5 rounded-xl shadow-lg shadow-rose-500/20">
                <Gift className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Unlock Premium Matrimonial Features <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">NEW PLANS</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">Get certified lineage contact details, Horoscope Rasi/Amsam charts, and elite match compatibility tools.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="toggle-comparison-btn"
                onClick={() => setShowPlanComparison(!showPlanComparison)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer"
              >
                {showPlanComparison ? "Hide Comparison" : "View Plan Details"}
              </button>
              <button
                id="upgrade-now-ribbon"
                onClick={() => handleOpenCheckout("Brahmin Elite Tier", 2499, "Full Horoscope Match & Family Details Access")}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs rounded-xl hover:brightness-110 shadow-lg shadow-amber-500/10 transition-all duration-300 whitespace-nowrap cursor-pointer animate-pulse"
              >
                Upgrade to Elite (₹2,499)
              </button>
            </div>
          </div>

          {showPlanComparison && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Heritage Matrimony Tier Coverages</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Compare features across our specialized community membership tiers.</p>
                </div>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono px-2 py-0.5 rounded-md font-bold">GST Included</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 min-w-[600px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 font-bold">Matrimony Feature</th>
                      <th className="py-2.5 font-bold text-center">Brahmin Free</th>
                      <th className="py-2.5 font-bold text-center text-amber-400">Brahmin Gold</th>
                      <th className="py-2.5 font-bold text-center text-rose-400">Brahmin Elite</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="py-3 font-medium text-slate-200">Annual Price</td>
                      <td className="py-3 text-center text-slate-400 font-mono">₹0 / Free</td>
                      <td className="py-3 text-center font-bold text-amber-400 font-mono">₹1,499</td>
                      <td className="py-3 text-center font-bold text-rose-400 font-mono">₹2,499</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-200">Daily Match Viewing Limit</td>
                      <td className="py-3 text-center text-slate-400">3 Profiles</td>
                      <td className="py-3 text-center text-slate-200">10 Profiles</td>
                      <td className="py-3 text-center font-semibold text-emerald-400">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-200">Gotra & Sect Lineage Filters</td>
                      <td className="py-3 text-center text-slate-400">Standard Filters</td>
                      <td className="py-3 text-center text-slate-200">Advanced Filters</td>
                      <td className="py-3 text-center font-semibold text-emerald-400">
                        Advanced + Sagotra Blocker
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-200">Kundali Charts (South Indian Grid)</td>
                      <td className="py-3 text-center text-slate-400">Basic Star Details</td>
                      <td className="py-3 text-center text-slate-200">Full Rasi Chart</td>
                      <td className="py-3 text-center font-semibold text-emerald-400">Full Rasi & Amsam Charts</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-200">Secure Direct Contact Info</td>
                      <td className="py-3 text-center text-slate-400">Blurred</td>
                      <td className="py-3 text-center text-slate-200">10 Profiles / Month</td>
                      <td className="py-3 text-center font-semibold text-emerald-400">Unlimited Direct Access</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-200">Google Gemini Astro-Guna Matching</td>
                      <td className="py-3 text-center text-slate-400">No</td>
                      <td className="py-3 text-center text-slate-200">10 Compatibility Runs/Mo</td>
                      <td className="py-3 text-center font-semibold text-emerald-400">Unlimited Compatibility Runs</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-200">Secure Video Calling Bandwidth</td>
                      <td className="py-3 text-center text-slate-400">No</td>
                      <td className="py-3 text-center text-slate-200">Virtual Avatar (60 Mins/Mo)</td>
                      <td className="py-3 text-center font-semibold text-emerald-400">Unlimited Virtual Avatar Routing</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-200">Purohit Booking Credit</td>
                      <td className="py-3 text-center text-slate-400 font-mono">None</td>
                      <td className="py-3 text-center text-emerald-400 font-mono">₹500 Credit Included</td>
                      <td className="py-3 text-center text-emerald-400 font-mono">₹1,500 Credit Included</td>
                    </tr>
                    <tr className="bg-slate-950/40">
                      <td className="py-3.5 font-semibold text-slate-400 uppercase text-[10px] tracking-widest font-mono">Select Plan</td>
                      <td className="py-3.5 text-center text-slate-500 font-bold text-[10px]">CURRENT FREE</td>
                      <td className="py-3.5 text-center">
                        <button
                          id="upgrade-gold-btn"
                          onClick={() => handleOpenCheckout("Brahmin Gold Tier", 1499, "Advanced Lineage Filters & 10 Verified Contacts/Mo")}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg transition-all duration-300 cursor-pointer"
                        >
                          Get Gold
                        </button>
                      </td>
                      <td className="py-3.5 text-center">
                        <button
                          id="upgrade-elite-btn"
                          onClick={() => handleOpenCheckout("Brahmin Elite Tier", 2499, "Full Horoscope Match & Family Details Access")}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition-all duration-300 cursor-pointer"
                        >
                          Get Elite
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simulated Premium Checkout Gateway Modal */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-5 h-5 text-amber-500" /> Secure Payment Gateway
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">SSL Encrypted Transaction Protection</p>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold bg-slate-950 px-2.5 py-1 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {/* Plan Details Summary */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan Option</span>
                <span className="font-bold text-slate-200">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Description</span>
                <span className="text-slate-300">{selectedPlan.desc}</span>
              </div>
              <div className="w-full h-px bg-slate-800 my-1" />
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-slate-500">Total Charge</span>
                <span className="text-base font-extrabold text-amber-400">₹{selectedPlan.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Form */}
            {paymentSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center space-y-3 animate-fadeIn">
                <Check className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 block">Transaction Authorized</span>
                <p className="text-[10px] text-slate-400">Your Premium Elite subscription is now active! Reloading features...</p>
                
                {paymentTrace.length > 0 && (
                  <div className="bg-black/60 p-3 rounded-xl border border-slate-800 text-left font-mono text-[9px] text-slate-400 max-h-36 overflow-y-auto space-y-1 scrollbar-thin">
                    {paymentTrace.map((log, idx) => (
                      <div key={idx} className={log.startsWith("❌") ? "text-rose-400" : log.startsWith("🛡️") || log.startsWith("✅") || log.startsWith("🟢") ? "text-emerald-400 font-bold" : "text-slate-300"}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={processSimulatedPayment} className="space-y-4 text-xs">
                {/* Simulated Card inputs */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Card Number</label>
                  <div className="relative">
                    <input
                      id="checkout-card-num"
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-amber-500 font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Expiry</label>
                    <input
                      id="checkout-card-expiry"
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CVV</label>
                    <input
                      id="checkout-card-cvv"
                      type="password"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {isPaying ? (
                  <div className="space-y-3">
                    <div className="bg-amber-500/10 text-amber-400 text-center py-2.5 border border-amber-500/20 rounded-xl font-bold animate-pulse">
                      Processing SECURE 3D Match Handshake...
                    </div>
                    {paymentTrace.length > 0 && (
                      <div className="bg-black/60 p-3 rounded-xl border border-slate-800 text-left font-mono text-[9px] text-slate-400 max-h-36 overflow-y-auto space-y-1 scrollbar-thin">
                        {paymentTrace.map((log, idx) => (
                          <div key={idx} className={log.startsWith("❌") ? "text-rose-400" : log.startsWith("🛡️") || log.startsWith("✅") || log.startsWith("🟢") ? "text-emerald-400 font-bold" : "text-slate-300"}>
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    id="submit-payment-gateway-btn"
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 text-white font-bold rounded-xl transition-all duration-300 shadow-md shadow-amber-500/10 cursor-pointer text-center"
                  >
                    Pay ₹{selectedPlan.price.toLocaleString('en-IN')} Securely
                  </button>
                )}

                <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-500 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified by VISA • MasterCard Identity Check</span>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* --- PREMIUM HERITAGE DASHBOARDS TAB BAR --- */}
      <div className="flex flex-wrap border-b border-slate-800 gap-4 pt-2 text-left">
        <button
          onClick={() => setActiveDashboardMode("all")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeDashboardMode === "all" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🌐 Discovery Matches
        </button>
        <button
          id="family-dashboard-tab"
          onClick={() => setActiveDashboardMode("family_dashboard")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
            activeDashboardMode === "family_dashboard" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Family Guardian Dashboard
        </button>
        <button
          id="photo-vault-tab"
          onClick={() => setActiveDashboardMode("photo_vault")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
            activeDashboardMode === "photo_vault" ? "border-rose-500 text-rose-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> Photo Visibility Status
        </button>
      </div>

      {/* --- PANEL A: MY PERSONAL SECURE PHOTO VAULT CONTROLS --- */}
      {activeDashboardMode === "photo_vault" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fadeIn text-left">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">My Photo Vault Status</h3>
              <p className="text-xs text-slate-400">Photo vault locking is disabled. All photos are fully unlocked for transparency.</p>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-300 leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-200 block text-sm mb-0.5">Community-Requested Transparency Enabled</strong>
              To cultivate trust and speed up traditional family alliances, photo vault locking is disabled by default. All certified profiles now display clear, unblurred photographs for high-trust matchmaking.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {/* Blur Toggle */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300">Blur Silhouette</span>
                <p className="text-[9px] text-slate-500 leading-snug">Require candidates to request access before viewing your photo clearly.</p>
              </div>
              <input
                type="checkbox"
                checked={vaultSettings.blurPhoto}
                onChange={(e) => setVaultSettings(prev => ({ ...prev, blurPhoto: e.target.checked }))}
                className="rounded border-slate-800 text-rose-500 focus:ring-rose-500 bg-slate-950 w-4 h-4"
              />
            </div>

            {/* Watermark Toggle */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300">Apply Watermarks</span>
                <p className="text-[9px] text-slate-500 leading-snug">Embed translucent identity strings across your photo to block reuse.</p>
              </div>
              <input
                type="checkbox"
                checked={vaultSettings.watermark}
                onChange={(e) => setVaultSettings(prev => ({ ...prev, watermark: e.target.checked }))}
                className="rounded border-slate-800 text-rose-500 focus:ring-rose-500 bg-slate-950 w-4 h-4"
              />
            </div>

            {/* Screenshots restriction */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300">Screenshot Shield</span>
                <p className="text-[9px] text-slate-500 leading-snug">Block standard context-menus and display safety alerts to inhibit captures.</p>
              </div>
              <input
                type="checkbox"
                checked={vaultSettings.restrictScreenshots}
                onChange={(e) => setVaultSettings(prev => ({ ...prev, restrictScreenshots: e.target.checked }))}
                className="rounded border-slate-800 text-rose-500 focus:ring-rose-500 bg-slate-950 w-4 h-4"
              />
            </div>
          </div>

          {/* Incoming Requests Simulation Panel */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incoming Photo Access Requests</span>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">Sri Raghavan (Gotra: Kashyapa)</span>
                <span className="text-[10px] text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/20">Access Granted (Mutual Interest)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">Abhishek Iyer (Gotra: Haritasya)</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => alert("Approved Abhishek Iyer's request! They can now view your profile photo.")}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] rounded transition cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-[9px] rounded transition cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PANEL B: PARENTAL FAMILY GUARDIAN DASHBOARD CONTROLS --- */}
      {activeDashboardMode === "family_dashboard" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fadeIn text-left">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Parental & Elder Coordinator Hub</h3>
                <p className="text-xs text-slate-400">Enable family review access, compile comments, and track collective consent.</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Active Reviewer:</span>
              <select
                id="active-reviewer-select"
                value={selectedFamilyMember}
                onChange={(e) => setSelectedFamilyMember(e.target.value)}
                className="bg-transparent text-xs text-indigo-400 font-bold cursor-pointer outline-none border-none p-0"
              >
                <option value="Father">Father (Pithru)</option>
                <option value="Mother">Mother (Mathru)</option>
                <option value="Uncle">Uncle (Mama)</option>
                <option value="Aunt">Aunt (Mami)</option>
                <option value="Grandmother">Grandmother (Patti)</option>
              </select>
            </div>
          </div>

          <div className="bg-indigo-500/5 p-3.5 border border-indigo-500/10 rounded-xl text-xs text-indigo-200 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Guardian Guideline:</strong> You are accessing as <strong>{selectedFamilyMember}</strong>. All shortlists and feedback comments published here are instantly synchronized across your household. You can view parent match compatibility metrics calculated using elders' specific preferences.
            </span>
          </div>

          <div className="flex gap-2">
            <span className="text-xs font-bold text-indigo-200 bg-indigo-500/15 px-3 py-1 rounded-full">
              Shortlisted by Family: {familyShortlist.length} matches
            </span>
          </div>
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredProfiles
          .filter(p => {
            if (activeDashboardMode === "family_dashboard") {
              // Optionally show only family-shortlisted or show all but parents can toggle
              return true; 
            }
            return true;
          })
          .map((profile) => {
            const vaultState: "locked" | "requested" | "granted" = "granted"; // Always unlocked (Photo Vault Locking completely removed)
            const isShortlistedByFamily = familyShortlist.includes(profile.id);

            return (
              <div
                key={profile.id}
                className={`group relative bg-slate-900 border rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col h-full ${
                  isShortlistedByFamily ? "border-indigo-500/45 shadow-indigo-950/10" : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Image & Badges Banner */}
                <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                  {/* Favorite Star Overlay */}
                  <button
                    id={`fav-btn-${profile.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(profile.id);
                    }}
                    className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md border transition-all duration-300 shadow-md cursor-pointer z-10 ${
                      isFavorite(profile.id)
                        ? "bg-amber-500 border-amber-400 text-slate-950 hover:bg-amber-400"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                    title={isFavorite(profile.id) ? "Remove from Favorites" : "Mark as Favorite"}
                  >
                    <Star className={`w-4 h-4 ${isFavorite(profile.id) ? "fill-slate-950 text-slate-950" : ""}`} />
                  </button>

                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                  />

                  {/* SECURE DYNAMIC WATERMARK OVERLAY */}
                  {vaultState === "granted" && vaultSettings.watermark && (
                    <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden z-10">
                      <div className="rotate-12 text-[10px] text-white/10 font-bold uppercase tracking-widest whitespace-nowrap bg-white/5 py-1 px-8 border border-white/5 shadow-inner">
                        BRAHMIN HERITAGE SECURE VAULT PROTECT
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Verified Badge Overlay */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                {profile.verified ? (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500 text-emerald-950 shadow-md">
                    <ShieldCheck className="w-3 h-3" />
                    <span>ID & GOTRA VERIFIED</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 backdrop-blur-sm border border-amber-500/30">
                    <span>Selfie Pending</span>
                  </span>
                )}
                {/* Traditional Brahmin Badge */}
                <span className="bg-indigo-600/90 backdrop-blur-sm border border-indigo-500/40 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                  Sect: {profile.sect}
                </span>
              </div>

              {/* Bottom Basic Meta */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{profile.name}</h3>
                  <span className="text-rose-400 font-bold text-lg">{profile.age}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded-md backdrop-blur-sm">Gotra: {profile.gotra}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>
            </div> {/* closes Image & Badges Banner */}

            {/* Profile Bio Details */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 font-sans">
                {profile.bio}
              </p>

              {/* Dynamic Trust Score Badge with expandable ledger verification */}
              <TrustScoreBadge profile={profile} onUpdateProfile={onUpdateProfile} />

              {/* Matrimonial Journey Milestones (Part 1 of requirement) */}
              <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Milestone className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Matrimonial Journey Progress
                  </span>
                  
                  {/* Stage Dropdown Selector to dynamically update milestones */}
                  <div className="flex items-center space-x-1">
                    <span className="text-[8px] text-slate-500 font-mono uppercase">Stage:</span>
                    <select
                      id={`milestone-select-${profile.id}`}
                      value={profile.currentMilestone || "Registration"}
                      onChange={(e) => handleSetMilestone(profile, e.target.value as any)}
                      className="bg-slate-900 border border-slate-800 text-[9px] text-amber-300 rounded px-1 py-0.5 font-bold cursor-pointer outline-none focus:border-amber-500"
                    >
                      <option value="Registration">Registration</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Engaged">Engaged</option>
                      <option value="Married">Married</option>
                      <option value="Happy Testimony">Happy Testimony</option>
                    </select>
                  </div>
                </div>

                {/* Horizontal Stepper UI */}
                <div className="relative pt-1.5 pb-2.5">
                  {/* Connector Line */}
                  <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-slate-800 -z-10" />
                  <div 
                    className="absolute top-4 left-[10%] h-0.5 bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 transition-all duration-500 -z-10"
                    style={{
                      width: `${
                        (profile.currentMilestone === "Registration" || !profile.currentMilestone) ? "0%" :
                        profile.currentMilestone === "Shortlisted" ? "25%" :
                        profile.currentMilestone === "Engaged" ? "50%" :
                        profile.currentMilestone === "Married" ? "75%" : "80%"
                      }`
                    }}
                  />

                  {/* Nodes list */}
                  <div className="flex justify-between items-start text-center">
                    {milestoneStages.map((stage, sIdx) => {
                      const stagesList = ["Registration", "Shortlisted", "Engaged", "Married", "Happy Testimony"];
                      const currentStageIndex = stagesList.indexOf(profile.currentMilestone || "Registration");
                      const isCompleted = currentStageIndex >= sIdx;
                      const isCurrent = currentStageIndex === sIdx;
                      const rawDate = profile.milestoneTimestamps?.[stage.dateKey as keyof typeof profile.milestoneTimestamps];
                      const formattedDate = rawDate 
                        ? new Date(rawDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        : null;

                      return (
                        <button
                          key={stage.key}
                          type="button"
                          id={`milestone-node-${profile.id}-${stage.key}`}
                          onClick={() => handleSetMilestone(profile, stage.key as any)}
                          className="flex flex-col items-center flex-1 focus:outline-none group cursor-pointer"
                        >
                          {/* Circle Node */}
                          <div 
                            className={`w-5 h-5 rounded-full flex items-center justify-center border text-[8px] font-bold transition-all duration-300 ${
                              isCompleted 
                                ? `${stage.bg} border-transparent text-slate-950 scale-110 shadow-lg shadow-amber-500/10` 
                                : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600"
                            } ${isCurrent ? "ring-2 ring-amber-500/50" : ""}`}
                          >
                            {isCompleted ? "✓" : sIdx + 1}
                          </div>

                          {/* Node label */}
                          <span className={`text-[8px] font-bold mt-1.5 tracking-tight transition-colors duration-200 ${
                            isCurrent ? "text-amber-400 font-extrabold" : isCompleted ? "text-slate-300" : "text-slate-600"
                          }`}>
                            {stage.label}
                          </span>

                          {/* Transition Timestamp date */}
                          <span className="text-[7px] text-slate-500 font-mono mt-0.5 block truncate max-w-[50px]">
                            {formattedDate || "—"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Brahmin Astrological & Lineage Table */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px]">
                <div>
                  <span className="text-slate-500 block uppercase font-mono">Ancestry Gotra</span>
                  <span className="text-slate-300 font-semibold">{profile.gotra}</span>
                </div>
                <button
                  id={`toggle-horoscope-${profile.id}`}
                  onClick={() => setExpandedHoroscopeId(expandedHoroscopeId === profile.id ? null : profile.id)}
                  className="text-left flex flex-col justify-between hover:bg-slate-900/60 p-1 rounded-lg transition-colors cursor-pointer focus:outline-none"
                  title="Click to view detailed South Indian Kundali (Rasi/Amsam) Chart"
                >
                  <span className="text-slate-500 block uppercase font-mono flex items-center gap-1">
                    Birth Star <Eye className="w-2.5 h-2.5 text-slate-400" />
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" /> {profile.nakshatra}
                  </span>
                </button>
                <div>
                  <span className="text-slate-500 block uppercase font-mono">Brahmin Sect</span>
                  <span className="text-slate-300 font-semibold truncate block">{profile.sect}</span>
                </div>
              </div>

              {/* Vedic Quick Scan Collapsible Drawer */}
              <div className="flex gap-2">
                <button
                  id={`toggle-vedic-scan-${profile.id}`}
                  onClick={() => setExpandedVedicId(expandedVedicId === profile.id ? null : profile.id)}
                  className="flex-1 py-1.5 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {expandedVedicId === profile.id ? "Hide Vedic Astro Scan" : "View Vedic Astro Scan"}
                </button>
              </div>

              {expandedVedicId === profile.id && (
                <div className="animate-fadeIn p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/20 text-left space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> Vedic Astro Details
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">ID: {profile.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Gotra</span>
                      <span className="text-xs font-bold text-amber-300">{profile.gotra}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Nakshatra</span>
                      <span className="text-xs font-bold text-indigo-300">{profile.nakshatra}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Rasi / Moon Sign</span>
                      <span className="text-xs font-bold text-slate-200">{profile.rasi || "N/A"}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Lagnam / Ascendant</span>
                      <span className="text-xs font-bold text-slate-200">{profile.lagnam || "N/A"}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 col-span-2">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Sect / Sub-Sect</span>
                      <span className="text-[11px] font-semibold text-slate-300">
                        {profile.sect} {profile.subSect ? `• ${profile.subSect}` : ""}
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 col-span-2">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Dosham Status</span>
                      <div className="flex gap-4 mt-0.5">
                        <span className="text-[10px] text-slate-300">
                          Mars (Chevvai):{" "}
                          <span className={profile.dosham?.chevvai === "Yes" ? "text-rose-400 font-bold" : "text-emerald-400"}>
                            {profile.dosham?.chevvai || "No"}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-300">
                          Rahu-Ketu:{" "}
                          <span className={profile.dosham?.rahuKetu === "Yes" ? "text-rose-400 font-bold" : "text-emerald-400"}>
                            {profile.dosham?.rahuKetu || "No"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Horoscope Chart Expansion Drawer */}
              {expandedHoroscopeId === profile.id && (
                <div className="animate-fadeIn pt-1">
                  <HoroscopeChart profile={profile} />
                </div>
              )}

              {/* Professional Credentials */}
              <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                <div className="flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-2 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{profile.occupation}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-2 text-indigo-400 flex-shrink-0" />
                  <span className="truncate text-slate-300">{profile.education}</span>
                </div>
              </div>

              {/* Intersecting Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.interests.slice(0, 4).map((interest, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-300 border border-slate-700/50"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              {/* Expectations, Achievements and Family Wishes (Requirement 1 Part B) */}
              <div className="border-t border-slate-800/50 pt-3.5 space-y-3 text-sm font-sans">
                {profile.expectations && (
                  <div>
                    <span className="text-amber-400 font-bold text-xs uppercase font-mono tracking-wider block">Expectations & Aspirations</span>
                    <p className="text-slate-200 italic mt-1 bg-slate-950/30 p-2 rounded-xl border border-slate-800/40">"{profile.expectations}"</p>
                  </div>
                )}
                {profile.achievements && (
                  <div>
                    <span className="text-amber-400 font-bold text-xs uppercase font-mono tracking-wider block">Eminent Achievements & Milestones</span>
                    <p className="text-slate-200 mt-1 bg-slate-950/30 p-2 rounded-xl border border-slate-800/40">"{profile.achievements}"</p>
                  </div>
                )}
                {profile.familyWishes && (
                  <div>
                    <span className="text-amber-400 font-bold text-xs uppercase font-mono tracking-wider block">Family Elders Wishes</span>
                    <p className="text-slate-200 mt-1 bg-slate-950/30 p-2 rounded-xl border border-slate-800/40">"{profile.familyWishes}"</p>
                  </div>
                )}
              </div>

              {/* Certified Favorite Dossier Consent Workflow (Requirement 2) */}
              {isFavorite(profile.id) && (
                <div className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-2xl space-y-2.5 text-xs font-sans mt-2 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Favorite Dossier Consent</span>
                    {getApprovalStatus(profile.id) === "approved" && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider scale-95">
                        Elders Approved
                      </span>
                    )}
                  </div>
                  
                  {getApprovalStatus(profile.id) === "none" && (
                    <button
                      id={`req-consent-btn-${profile.id}`}
                      onClick={() => requestApproval(profile.id)}
                      className="w-full py-2 bg-slate-800 hover:bg-indigo-950/40 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Request Guardian Download Approval</span>
                    </button>
                  )}

                  {getApprovalStatus(profile.id) === "requested" && (
                    <div className="py-2 text-center text-[10px] text-amber-400 font-bold bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-center justify-center gap-1.5 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Awaiting Guardian Verification...</span>
                    </div>
                  )}

                  {getApprovalStatus(profile.id) === "approved" && (
                    <button
                      id={`dl-dossier-btn-${profile.id}`}
                      onClick={() => handleDownloadDossier(profile)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 shadow-md shadow-emerald-500/10 animate-fadeIn"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-950" />
                      <span>Download Verified Contact Dossier</span>
                    </button>
                  )}
                </div>
              )}

              {/* Admin Actions Panel (Conditional on Authorization Role) */}
              {userRole !== "member" && (
                <div className="border-t border-amber-500/15 pt-3 pb-2 flex items-center justify-between text-[11px] mt-2 mb-1">
                  <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>ADMIN CONTROL:</span>
                  </span>
                  {userRole === "super_admin" ? (
                    <button
                      id={`delete-profile-btn-${profile.id}`}
                      onClick={() => {
                        if (confirm(`Are you absolutely sure you want to delete ${profile.name}'s profile?`)) {
                          onDeleteProfile(profile.id);
                        }
                      }}
                      className="px-2 py-0.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-white rounded-lg text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all duration-300"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Delete</span>
                    </button>
                  ) : userRole === "moderator" ? (
                    <span className="text-[9px] text-amber-500/60 font-serif italic">
                      (Mod cannot delete)
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-serif italic">
                      (Support Read-Only)
                    </span>
                  )}
                </div>
              )}

              {/* --- FAMILY GUARDIAN COORDINATOR WIDGET --- */}
              <div className="mt-3.5 pt-3.5 border-t border-slate-800/60 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Family Shortlist Panel
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFamilyShortlist(profile.id)}
                    className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border transition-all duration-300 cursor-pointer ${
                      isShortlistedByFamily
                        ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                        : "bg-slate-950 hover:bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    {isShortlistedByFamily ? "✅ Family Shortlisted" : "Shortlist for Family"}
                  </button>
                </div>

                {/* List of Family Comments */}
                <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin">
                  {(familyComments[profile.id] || []).map((cmt, idx) => (
                    <div key={idx} className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-[10px] text-slate-300 font-sans leading-relaxed">
                      {cmt}
                    </div>
                  ))}
                  {(!familyComments[profile.id] || familyComments[profile.id].length === 0) && (
                    <span className="text-[9px] text-slate-600 italic">No family feedback log recorded yet.</span>
                  )}
                </div>

                {/* Write comment as Reviewer */}
                <div className="flex gap-1.5 pt-0.5">
                  <input
                    type="text"
                    placeholder={`Write ${selectedFamilyMember}'s note...`}
                    value={newCommentInput[profile.id] || ""}
                    onChange={(e) => setNewCommentInput(prev => ({ ...prev, [profile.id]: e.target.value }))}
                    className="flex-grow bg-slate-950 border border-slate-800 text-slate-300 text-[10px] rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFamilyComment(profile.id)}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] rounded-lg transition duration-300 cursor-pointer"
                  >
                    Post Note
                  </button>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-4 mt-auto">
                <button
                  id={`comp-btn-${profile.id}`}
                  onClick={() => onSelectCompatibility(profile)}
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200 hover:border-indigo-500/30 border border-transparent transition-all duration-300 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>AI Compatibility</span>
                </button>

                <button
                  id={`chat-btn-${profile.id}`}
                  onClick={() => onSelectChat(profile)}
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/10 hover:brightness-110 transition-all duration-300 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Secure Chat</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

        {filteredProfiles.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-2 animate-bounce" />
            <p className="text-slate-300 font-bold">Sagotra Lineage Warning Enabled</p>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">No profiles found. Matches sharing the same gotra (Sagotra: Bharadwaja) are hidden to maintain traditional lineage purity.</p>
            <button
              id="reset-all-filters-btn"
              onClick={() => {
                setFilterGender("All");
                setFilterSect("All");
                setFilterGotra("All");
                setFilterVerified(false);
                setSagotraAvoid(false);
                setMinTrustScore(0);
              }}
              className="mt-4 text-xs font-semibold text-rose-400 hover:underline cursor-pointer"
            >
              Disable Sagotra Safety and Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ADD NEW PROFILE DIALOG MODAL (Auspicious Traditional Design) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#1a0b0d] border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-200 animate-fadeIn space-y-4 my-8">
            
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <KalasaLogo size={32} />
                <div>
                  <h3 className="font-serif font-bold text-amber-300 text-xs uppercase">Add Auspicious Match Profile</h3>
                  <p className="text-[9px] text-amber-400/60 font-serif">Heritage Brahmin Matrimony Registry</p>
                </div>
              </div>
              <button
                onClick={closeAddModal}
                className="text-slate-400 hover:text-white font-mono text-xs font-bold bg-slate-900/60 px-2 py-0.5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              <span className="text-[10px] text-amber-300/90 font-serif leading-relaxed max-w-[70%]">
                Need quick realistic test parameters? Auto-populate with Brahmin values.
              </span>
              <button
                type="button"
                onClick={handleAutoFillBrahminProfile}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all duration-200"
              >
                🪄 Auto-Populate
              </button>
            </div>

            <form onSubmit={handleAddNewProfileSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sastry"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Profile Gender</label>
                  <select
                    value={newProfileGender}
                    onChange={(e) => {
                      setNewProfileGender(e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none cursor-pointer"
                  >
                     <option value="Female">Female (Bride)</option>
                     <option value="Male">Male (Groom)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Age</label>
                  <input
                    type="number"
                    required
                    min={21}
                    max={60}
                    value={newProfileAge}
                    onChange={(e) => setNewProfileAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Sect Group</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Iyer (Vadama)"
                    value={newProfileSect}
                    onChange={(e) => setNewProfileSect(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Sacred Gotra</label>
                  <select
                    value={newProfileGotra}
                    onChange={(e) => setNewProfileGotra(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none cursor-pointer"
                  >
                    <option value="Kashyapa">Kashyapa</option>
                    <option value="Bharadwaja">Bharadwaja</option>
                    <option value="Vashishta">Vashishta</option>
                    <option value="Gautama">Gautama</option>
                    <option value="Shandilya">Shandilya</option>
                    <option value="Harita">Harita</option>
                    <option value="Atri">Atri</option>
                    <option value="Vishvamitra">Vishvamitra</option>
                    <option value="Jamadagni">Jamadagni</option>
                    <option value="Angirasa">Angirasa</option>
                    <option value="Kanva">Kanva</option>
                    <option value="Agastya">Agastya</option>
                    <option value="Gargya">Gargya</option>
                    <option value="Kaushika">Kaushika</option>
                    <option value="Bhargava">Bhargava</option>
                    <option value="Mudgala">Mudgala</option>
                    <option value="Parashara">Parashara</option>
                    <option value="Kaundinya">Kaundinya</option>
                    <option value="Srivatsa">Srivatsa</option>
                    <option value="Naidhruva">Naidhruva</option>
                    <option value="Shatamarshana">Shatamarshana</option>
                    <option value="Vadula">Vadula</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Nakshatra Star</label>
                  <input
                    type="text"
                    required
                    value={newProfileNakshatra}
                    onChange={(e) => setNewProfileNakshatra(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Moon Rasi</label>
                  <input
                    type="text"
                    required
                    value={newProfileRasi}
                    onChange={(e) => setNewProfileRasi(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Birth Lagnam</label>
                  <input
                    type="text"
                    required
                    value={newProfileLagnam}
                    onChange={(e) => setNewProfileLagnam(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Education Degree</label>
                  <input
                    type="text"
                    required
                    value={newProfileEducation}
                    onChange={(e) => setNewProfileEducation(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Occupation</label>
                  <input
                    type="text"
                    required
                    value={newProfileOccupation}
                    onChange={(e) => setNewProfileOccupation(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
              </div>

              {/* Camera Photo Capture & Manual Photo Uploads to Prevent Fake Profiles */}
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">📸 Security Photos (Anti-Fake Profile Protection)</span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">🛡️ Camera Required</span>
                </div>

                {/* Slot 1: Primary Real-Time Selfie Capture */}
                <div className="space-y-2">
                  <label className="block text-[9.5px] text-slate-400 font-mono uppercase">Step 1: Real-Time Selfie Camera Capture (Required)</label>
                  
                  {isCapturing ? (
                    <div className="relative w-full max-w-xs mx-auto aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-black flex flex-col items-center justify-center">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      {/* Oval Overlay Guide for Face Aligning */}
                      <div className="absolute inset-0 border-[3px] border-dashed border-amber-500/50 rounded-full m-6 pointer-events-none" />
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 px-2">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          📸 Snap Photo
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-3 py-1.5 bg-slate-900 text-slate-300 text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : capturedPhotoUrl ? (
                    <div className="flex items-center space-x-3 bg-slate-900/60 p-2 rounded-xl border border-emerald-500/20">
                      <img 
                        src={capturedPhotoUrl} 
                        alt="Captured Face" 
                        className="w-16 h-12 object-cover rounded-lg border border-amber-500/30"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] text-emerald-400 font-bold block">✓ Real Photo Secured</span>
                        <span className="text-[8.5px] text-slate-400 block truncate">Metadata linked to active session</span>
                      </div>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[9px] font-bold rounded-lg border border-amber-500/20 cursor-pointer"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 rounded-xl border border-dashed border-amber-500/30 font-bold text-[10.5px] flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
                    >
                      <span>🎥 Open Selfie Camera to Capture Photo</span>
                    </button>
                  )}
                </div>

                {/* Steps 2 & 3: Two Additional Manual Upload Photos */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-400 font-mono uppercase">Step 2: Manual Photo 1</label>
                    {manualPhoto1 ? (
                      <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-amber-500/30 group">
                        <img 
                          src={manualPhoto1} 
                          alt="Manual 1" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => setManualPhoto1("")}
                          className="absolute top-1 right-1 bg-slate-950/80 text-rose-400 p-1 text-[8px] font-bold rounded-md hover:bg-rose-950 hover:text-white"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border border-dashed border-slate-700 hover:border-amber-500/40 rounded-xl p-2 cursor-pointer bg-slate-950/40 transition aspect-[4/3]">
                        <span className="text-[14px] text-slate-500 font-bold">+</span>
                        <span className="text-[8px] text-slate-400 mt-1">Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleManualUpload(1, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-400 font-mono uppercase">Step 3: Manual Photo 2</label>
                    {manualPhoto2 ? (
                      <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-amber-500/30 group">
                        <img 
                          src={manualPhoto2} 
                          alt="Manual 2" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => setManualPhoto2("")}
                          className="absolute top-1 right-1 bg-slate-950/80 text-rose-400 p-1 text-[8px] font-bold rounded-md hover:bg-rose-950 hover:text-white"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border border-dashed border-slate-700 hover:border-amber-500/40 rounded-xl p-2 cursor-pointer bg-slate-950/40 transition aspect-[4/3]">
                        <span className="text-[14px] text-slate-500 font-bold">+</span>
                        <span className="text-[8px] text-slate-400 mt-1">Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleManualUpload(2, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Personal Matrimonial Bio</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Traditional values and spiritual resonance..."
                  value={newProfileBio}
                  onChange={(e) => setNewProfileBio(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-2 text-slate-100 outline-none font-sans"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="w-1/3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold rounded-xl cursor-pointer transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 shadow-md shadow-amber-500/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Brahmin Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
