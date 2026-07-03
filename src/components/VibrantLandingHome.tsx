import React, { useState } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Heart, 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  Lock, 
  ChevronRight, 
  Award,
  Bell,
  CheckCircle2
} from "lucide-react";

interface VibrantLandingHomeProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
  onSectSelect?: (sect: string) => void;
  totalProfilesCount?: number;
  verifiedProfilesCount?: number;
  successfulMarriagesCount?: number;
}

export default function VibrantLandingHome({ 
  onRegisterClick, 
  onLoginClick, 
  onSectSelect,
  totalProfilesCount = 76543,
  verifiedProfilesCount = 4703,
  successfulMarriagesCount = 8312
}: VibrantLandingHomeProps) {
  const [showLockPrompt, setShowLockPrompt] = useState<{ visible: boolean; listType: "brides" | "grooms" | null }>({
    visible: false,
    listType: null
  });

  const [showSectLock, setShowSectLock] = useState<string | null>(null);
  const [showGoogleReviewsModal, setShowGoogleReviewsModal] = useState<boolean>(false);

  const handleListClick = (type: "brides" | "grooms") => {
    setShowLockPrompt({
      visible: true,
      listType: type
    });
  };

  const handleSectClick = (sect: string) => {
    if (sect === "Online store") {
      alert("🛒 Opening Brahmin Sacred Online Store. Get fresh Puja samagri, certified Rudrakshas, and homam setups delivered straight to your home!");
      return;
    }
    if (onSectSelect) {
      onSectSelect(sect);
    } else {
      setShowSectLock(sect);
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      
      {/* Top spacing instead of Ganesha center-piece */}
      <div className="pt-2"></div>

      {/* 2. TRADITIONAL SECTS BANNER BAR */}
      <div className="bg-gradient-to-r from-amber-600/10 via-amber-500/25 to-amber-600/10 border-y border-amber-500/30 py-2.5 px-4 overflow-x-auto whitespace-nowrap scrollbar-none flex justify-center items-center gap-1.5 md:gap-3 rounded-xl shadow-inner">
        {["Iyengar", "Iyer", "Kannada Madhva", "Telugu Brahmin", "Kerala Namboothiri", "II Marriage Welcome", "Online store"].map((sect, idx) => (
          <React.Fragment key={sect}>
            <span 
              onClick={() => handleSectClick(sect)}
              className="text-xs font-serif font-extrabold text-[#5C2E0B] tracking-wide hover:text-[#7C1C13] transition-colors cursor-pointer px-2 py-0.5 rounded-md hover:bg-amber-500/10"
            >
              {sect}
            </span>
            {idx < 6 && (
              <span className="text-amber-700/60 text-xs select-none font-bold">✦</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 3. HERO SECTION WITH GRAND TITLE */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#4C110C] leading-tight">
          India's Best Brahmin-Heritage Matrimony Site.
        </h1>
        <p className="text-base md:text-lg text-[#2A1408] font-serif font-semibold tracking-wide italic">
          "The perfect place to find your perfect partner with lineage integrity"
        </p>

        {/* Scrolling Latest Profiles Ticker */}
        <div className="bg-[#FFF9EA] border-2 border-[#D6A25E]/40 rounded-2xl py-2 px-4 max-w-2xl mx-auto flex items-center space-x-3 overflow-hidden shadow-md">
          <span className="bg-amber-700 text-amber-50 font-black text-[9px] px-2 py-1 rounded-md uppercase tracking-wider shrink-0 animate-pulse">
            Latest Profiles
          </span>
          <div className="relative flex-grow overflow-hidden h-5">
            <div className="absolute whitespace-nowrap text-xs text-[#3E1D08] font-serif font-bold animate-marquee flex items-center gap-6">
              <span>Aswin Srivatsa Sankaran, Morakkaniyanur (Iyer Vadama, Bharadwaj Gotra) - Team Lead Data Analyst • 27 Jun 2026</span>
              <span className="text-[#7C1C13]">✦</span>
              <span>Srinivas Gopalan, Bangalore (Iyengar Vadakalai, Srivatsa Gotra) - Senior Principal Cloud Architect • Just Joined</span>
              <span className="text-[#7C1C13]">✦</span>
              <span>Priya Shastry, Mysore (Smartha Hoysala, Vishwamitra Gotra) - Research Scholar • Just Registered</span>
              <span className="text-[#7C1C13]">✦</span>
              <span>Anirudh Bhat, Udupi (Madhva Shivalli, Harita Gotra) - Chartered Accountant • Verified Live Camera</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CALL TO ACTION INTERACTIVE MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto pt-2">
        {/* Module A: Register Card */}
        <div className="bg-gradient-to-b from-[#2a0e10] to-[#140506] border-2 border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-serif font-extrabold text-amber-300 text-base">Register With Us</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-serif">
              Join the sacred registry today. Fill your lineage details and register a family cross-reference contact.
            </p>
          </div>
          <button
            onClick={onRegisterClick}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-xl transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-1"
          >
            <span>Register Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module B: Brides Directory */}
        <div className="bg-gradient-to-b from-[#101b15] to-[#050a06] border border-emerald-500/30 rounded-3xl p-6 text-center space-y-4 shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-extrabold text-emerald-300 text-base">Brides List</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-serif">
              Browse profiles of verified, well-cultured Brahmin brides with rich traditional family backgrounds.
            </p>
          </div>
          <button
            onClick={() => handleListClick("brides")}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-slate-100 font-extrabold text-xs rounded-xl transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Explore Brides</span>
          </button>
        </div>

        {/* Module C: Grooms Directory */}
        <div className="bg-gradient-to-b from-[#101525] to-[#05070a] border border-indigo-500/30 rounded-3xl p-6 text-center space-y-4 shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="font-serif font-extrabold text-indigo-300 text-base">Grooms List</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-serif">
              Discover accomplished Brahmin professionals, priest scholars, and engineers from sacred clans.
            </p>
          </div>
          <button
            onClick={() => handleListClick("grooms")}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-700 hover:brightness-110 text-slate-100 font-extrabold text-xs rounded-xl transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Explore Grooms</span>
          </button>
        </div>
      </div>

      {/* 5. GOOGLE TRUST & RATING REVIEWS - Clickable to open reviews */}
      <div 
        onClick={() => setShowGoogleReviewsModal(true)}
        title="Click to view verified family reviews on Google"
        className="flex flex-col items-center justify-center space-y-1.5 max-w-sm mx-auto bg-black/40 border border-amber-500/25 hover:border-amber-400 py-4 px-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-black/60"
      >
        <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase block animate-pulse">✦ Click to View Reviews ✦</span>
        <div className="flex items-center space-x-1">
          <span className="text-lg font-black text-white">Google</span>
          <span className="text-xs bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">review</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-2xl font-black text-amber-400 font-mono">4.7</span>
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
            ))}
          </div>
        </div>
        <p className="text-[9px] text-slate-400 font-serif text-center underline decoration-amber-500/40">Based on 3000+ happy Brahmin families reviews</p>
      </div>

      {/* 6. VERIFIED STATS PANEL */}
      <div className="bg-[#1c0c0e] border border-amber-500/20 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        {/* Traditional border decoration accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-amber-500/25">
          <div className="space-y-1 pb-4 sm:pb-0">
            <span className="text-3xl md:text-4xl font-black font-mono text-amber-300 block drop-shadow-md">
              {totalProfilesCount.toLocaleString()}
            </span>
            <span className="text-xs font-serif font-bold text-amber-100 uppercase tracking-wider block">Registered Profiles</span>
            <span className="text-[10px] text-amber-400/60 font-mono">Across 18 sub-sects</span>
          </div>
          
          <div className="space-y-1 py-4 sm:py-0 sm:px-4">
            <span className="text-3xl md:text-4xl font-black font-mono text-emerald-400 block drop-shadow-md">
              {verifiedProfilesCount.toLocaleString()}
            </span>
            <span className="text-xs font-serif font-bold text-amber-100 uppercase tracking-wider block">Active Verified Profiles</span>
            <span className="text-[10px] text-amber-400/60 font-mono">100% Reference checked</span>
          </div>

          <div className="space-y-1 pt-4 sm:pt-0 sm:pl-4">
            <span className="text-3xl md:text-4xl font-black font-mono text-amber-300 block drop-shadow-md">
              {successfulMarriagesCount.toLocaleString()}
            </span>
            <span className="text-xs font-serif font-bold text-amber-100 uppercase tracking-wider block">Successful Marriages</span>
            <span className="text-[10px] text-amber-400/60 font-mono">Sacred home alliances</span>
          </div>
        </div>
      </div>

      {/* 7. AUTHENTIC BRAHMIN SWEET STORE ADS PROMO */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#2a1305] to-[#1a0b02] border-2 border-amber-600/30 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden group">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
        
        <div className="flex items-center space-x-4">
          <div className="bg-[#3e1d08] p-3 rounded-2xl border border-amber-500/20 text-center flex-shrink-0 relative">
            <span className="absolute -top-2 -right-2 bg-rose-600 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white animate-bounce">
              SPECIAL
            </span>
            <ShoppingBag className="w-10 h-10 text-amber-400 mx-auto" />
            <span className="text-[8px] text-amber-300 font-serif font-black block mt-1 uppercase">Brahmin Store</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Ghee Sweets combo
              </span>
            </div>
            <h4 className="font-serif font-extrabold text-amber-200 text-sm md:text-base">
              Famous Tirunelveli Halwa Combo - 400 Grams
            </h4>
            <p className="text-xs text-slate-400 font-serif leading-snug">
              Authentic melt-in-mouth traditional Brahmin ghee halwa made with cow milk extracts and auspicious purity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 line-through block">M.R.P ₹399</span>
            <span className="text-xl font-black text-amber-400 font-mono">₹299 <span className="text-xs font-serif font-normal text-slate-300">only</span></span>
          </div>
          
          <button 
            onClick={() => alert("🍯 Traditional Ghee Halwa Combo selected! This specialty is sourced directly from the holy Brahmin Stores of South India. Enjoy complimentary free delivery with your profile registration!")}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1 shadow-md shadow-amber-500/10"
          >
            <span>Order Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8. FIND PERFECT PARTNER - DESCRIPTIVE LINEAGE TEXT */}
      <div className="max-w-4xl mx-auto bg-[#FFFDF9] border-2 border-[#D6A25E]/30 rounded-3xl p-6 md:p-8 space-y-5 text-center font-serif shadow-lg shadow-[#D6A25E]/5">
        <h3 className="text-xl md:text-2xl font-black text-[#5C1D1B] font-serif tracking-wider">
          Find Your Perfect Lineage Partner
        </h3>
        
        <div className="space-y-4 text-xs md:text-sm text-[#2D1D16] leading-relaxed max-w-3xl mx-auto font-serif">
          <p>
            <strong className="text-[#7C1C13]">Brahmin-Heritage Matrimony</strong> is the only matrimony totally dedicated to the sacred community <strong className="text-[#7C1C13]">"Brahmin"</strong>. In this portal, the Brahmin community is not a minor part — instead, we dedicate 100% of our database, algorithms, and matches purely to the high standards of Brahmin lineage.
          </p>
          <p>
            It is the absolute right place for singles, families, and elders seeking a life partner with pure gotras, matching charts, identical stars, and aligned cultural values from the Brahmin community.
          </p>
          
          <div className="pt-2 border-t border-[#D6A25E]/20 space-y-3 text-left max-w-2xl mx-auto">
            <span className="text-xs uppercase font-extrabold text-[#5C1D1B] block tracking-widest text-center">
              Our Sanctity Mandate is Clear:
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start space-x-2 text-[#2D1D16]">
                <span className="text-[#7C1C13] mt-1">➔</span>
                <span><strong>Understand Global Concerns:</strong> We understand the concerns of singles worldwide through tireless research and astrological verification.</span>
              </li>
              <li className="flex items-start space-x-2 text-[#2D1D16]">
                <span className="text-[#7C1C13] mt-1">➔</span>
                <span><strong>Superior Experience & Matchmaking:</strong> We provide a satisfying, pure matchmaking atmosphere while zealously protecting privacy, secure identity logs, and elder supervision.</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-[#7C1C13] font-bold italic pt-2">
            "Every alliance is made in heaven, but here we secure its purity with the integrity of traditional values."
          </p>
        </div>
      </div>

      {/* LOCK PROMPT DIALOG */}
      {showLockPrompt.visible && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c0c0e] border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-200 animate-fadeIn space-y-5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-serif font-extrabold text-amber-300 text-sm">
                  🔒 Directory Access Is Protected
                </h3>
              </div>
              <button
                onClick={() => setShowLockPrompt({ visible: false, listType: null })}
                className="text-slate-400 hover:text-white font-mono text-sm font-bold bg-slate-900/60 px-2 py-0.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-serif text-center">
              To protect the privacy of our certified <strong className="text-amber-300">{showLockPrompt.listType === "brides" ? "Brahmin Brides" : "Brahmin Grooms"}</strong> and defend our directory from non-Brahmin intruders, full profiles and photos are strictly locked.
            </p>

            <div className="bg-black/50 p-4 rounded-2xl border border-amber-500/15 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lineage Purity Verified</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-snug">
                Unlock instantly by completing your <strong>Sacred Profile Registration</strong> with your astrological details and registered reference person!
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowLockPrompt({ visible: false, listType: null });
                  onRegisterClick();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer transition-all duration-300 shadow-md text-center"
              >
                Go to Verification Wizard (Free & Fast)
              </button>
              <button
                onClick={() => {
                  setShowLockPrompt({ visible: false, listType: null });
                  onLoginClick();
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-all duration-300 text-center"
              >
                Have Verified Account? Secure Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM SECT & SECOND MARRIAGE INFORMATIONAL DIALOG */}
      {showSectLock && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#1c0c0e] border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-serif font-extrabold text-amber-300 text-sm">
                  {showSectLock === "II Marriage Welcome" ? "💍 Brahmin Remarriage Registry" : `🛡️ ${showSectLock} Directory`}
                </h3>
              </div>
              <button
                onClick={() => setShowSectLock(null)}
                className="text-slate-400 hover:text-white font-mono text-sm font-bold bg-slate-900/60 px-2 py-0.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-serif text-center">
              {showSectLock === "II Marriage Welcome" ? (
                <span>
                  Our sacred <strong>Second Marriage / Remarriage Registry</strong> houses verified, respectful profiles of Brahmin brides and grooms looking to start a new, peaceful marital journey. To protect privacy and shield families, complete profile access is restricted to registered, logged-in members.
                </span>
              ) : (
                <span>
                  All verified candidate directories for the <strong className="text-amber-300">{showSectLock}</strong> community are completely active with dynamic matches! Details are protected to maintain gotra safety.
                </span>
              )}
            </p>

            <div className="bg-black/50 p-4 rounded-2xl border border-amber-500/15 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lineage & Marital Status Verified</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-snug">
                {showSectLock === "II Marriage Welcome" 
                  ? "We currently have 2 newly registered active second-marriage profiles with verified reference credentials!"
                  : "Profiles contain complete Kundali placements, Grahachara charts, and family background check status."}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowSectLock(null);
                  onRegisterClick();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer transition-all duration-300 shadow-md text-center"
              >
                Create Free Profile to View Registered Members
              </button>
              <button
                onClick={() => {
                  setShowSectLock(null);
                  onLoginClick();
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-all duration-300 text-center"
              >
                Already Registered? Secure Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE REVIEWS DETAILED MODAL */}
      {showGoogleReviewsModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#1c0c0e] border-2 border-amber-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                <h3 className="font-serif font-extrabold text-amber-300 text-sm uppercase">
                  Verified Google Reviews
                </h3>
              </div>
              <button
                onClick={() => setShowGoogleReviewsModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm font-bold bg-slate-900/60 px-2 py-0.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 bg-black/30 p-3 rounded-2xl border border-amber-500/10">
              <span className="text-3xl font-black text-white font-mono">4.7</span>
              <div className="flex flex-col">
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />)}
                </div>
                <span className="text-[10px] text-slate-400 font-serif leading-none mt-1">Based on 3000+ happy verified Brahmin reviews</span>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs font-serif divide-y divide-amber-500/10 scrollbar-none">
              
              <div className="pt-2 pb-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200">Swaminathan Sastry</span>
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />)}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Chennai, India • 2 weeks ago</span>
                <p className="text-slate-300 leading-relaxed italic">
                  "Absolutely stellar matrimony service! We found a highly compatible Iyer Vadama alliance for my elder son within 3 months of registration. The horoscope matching chart calculations are incredibly accurate and reliable. Excellent focus on sub-sects."
                </p>
              </div>

              <div className="pt-2 pb-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200">Dr. Shailaja Kulkarni</span>
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />)}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Bangalore, India • 1 month ago</span>
                <p className="text-slate-300 leading-relaxed italic">
                  "What I appreciate most is the safety of this platform. The government ID and real-time selfie verification check prevents fake registrations completely. It gave our family great confidence when initiating dialogues with other Brahmin candidates."
                </p>
              </div>

              <div className="pt-2 pb-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200">Pandit Vasudev Trivedi</span>
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />)}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Varanasi, India • 3 months ago</span>
                <p className="text-slate-300 leading-relaxed italic">
                  "As a temple priest, gotra purity and astrological constraints are critical to our families. This portal guards these traditional values perfectly, including automatic Sagotra warning prevention. Kudos to the creators for respecting Vedic rules!"
                </p>
              </div>

            </div>

            <div className="pt-2 border-t border-amber-500/10">
              <button
                onClick={() => {
                  setShowGoogleReviewsModal(false);
                  onRegisterClick();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer transition-all duration-300 text-center"
              >
                Join Our 3,000+ Happy Families Today
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
