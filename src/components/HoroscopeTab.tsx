/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles, Compass, Calendar, Clock, User, Check, AlertCircle, Heart,
  Info, MapPin, ChevronDown, ChevronUp, RefreshCw, Star
} from "lucide-react";

interface PlanetPosition {
  planet: string;
  house: number;
}

interface PersonHoroscope {
  name: string;
  dob: string;
  tob: string;
  rasi: string;
  nakshatra: string;
  lagnam: string;
  planetaryPositions: PlanetPosition[];
}

interface PoruthamDetail {
  name: string;
  match: string;
  explanation: string;
}

interface HoroscopeMatchResult {
  bride: PersonHoroscope;
  groom: PersonHoroscope;
  overallScore: number;
  matchingPoruthamsCount: number;
  poruthamDetails: PoruthamDetail[];
  suggestions: string[];
  detailedAstrologicalAnalysis: string;
}

export default function HoroscopeTab() {
  // Input states
  const [brideName, setBrideName] = useState("");
  const [brideDob, setBrideDob] = useState("");
  const [brideTob, setBrideTob] = useState("");
  const [bridePob, setBridePob] = useState("");

  const [groomName, setGroomName] = useState("");
  const [groomDob, setGroomDob] = useState("");
  const [groomTob, setGroomTob] = useState("");
  const [groomPob, setGroomPob] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HoroscopeMatchResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Default demo filler to make testing pleasant
  const loadDemoData = () => {
    setBrideName("Sowmya Iyer");
    setBrideDob("1998-05-14");
    setBrideTob("08:30");
    setBridePob("Chennai, Tamil Nadu");

    setGroomName("Karthik Subramanian");
    setGroomDob("1995-11-22");
    setGroomTob("14:15");
    setGroomPob("Bangalore, Karnataka");
  };

  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!brideName || !brideDob || !brideTob || !groomName || !groomDob || !groomTob) {
      setError("Please fill out all required fields for both Bride and Groom.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/horoscope/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brideName,
          brideDob,
          brideTob,
          bridePob,
          groomName,
          groomDob,
          groomTob,
          groomPob,
        }),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || "Failed to analyze horoscope matching.");
      }

      setResult(resJson.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Maps 1-12 house index directly to South Indian chart boxes
  // South Indian charts start from Pisces at top-left and run clockwise.
  // Aries (1), Taurus (2), Gemini (3), Cancer (4)
  // Pisces (12), [Empty], [Empty], Leo (5)
  // Aquarius (11), [Empty], [Empty], Virgo (6)
  // Capricorn (10), Sagittarius (9), Scorpio (8), Libra (7)
  const renderKundaliChart = (positions: PlanetPosition[]) => {
    const boxDef = [
      { id: 12, code: "Pi", name: "Meena (Pisces)" },
      { id: 1, code: "Ar", name: "Mesha (Aries)" },
      { id: 2, code: "Ta", name: "Vrishabha (Taurus)" },
      { id: 3, code: "Ge", name: "Mithuna (Gemini)" },
      { id: 11, code: "Aq", name: "Kumbha (Aquarius)" },
      { id: -1, code: "CENTER", name: "Center" }, // Spacer
      { id: -2, code: "CENTER", name: "Center" }, // Spacer
      { id: 4, code: "Cn", name: "Karka (Cancer)" },
      { id: 10, code: "Cp", name: "Makara (Capricorn)" },
      { id: -3, code: "CENTER", name: "Center" }, // Spacer
      { id: -4, code: "CENTER", name: "Center" }, // Spacer
      { id: 5, code: "Le", name: "Simha (Leo)" },
      { id: 9, code: "Sg", name: "Dhanus (Sagittarius)" },
      { id: 8, code: "Sc", name: "Vrishchika (Scorpio)" },
      { id: 7, code: "Li", name: "Tula (Libra)" },
      { id: 6, code: "Vi", name: "Kanya (Virgo)" },
    ];

    const getPlanetsInHouse = (houseId: number) => {
      // Map planet names to neat 2-character codes
      const codes: Record<string, string> = {
        "Ascendant": "As",
        "Sun": "Su",
        "Moon": "Mo",
        "Mars": "Ma",
        "Mercury": "Me",
        "Jupiter": "Ju",
        "Venus": "Ve",
        "Saturn": "Sa",
        "Rahu": "Ra",
        "Ketu": "Ke"
      };
      return positions
        .filter((p) => p.house === houseId)
        .map((p) => codes[p.planet] || p.planet.slice(0, 2));
    };

    return (
      <div className="grid grid-cols-4 gap-1 p-2 bg-[#fdfaf3] border-2 border-amber-600/20 rounded-2xl aspect-square w-full max-w-[280px] mx-auto shadow-inner">
        {boxDef.map((box, index) => {
          if (box.id < 0) {
            // Render beautiful merged center area for the grid
            if (box.id === -1) {
              return (
                <div key={index} className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-amber-500/5 border border-dashed border-amber-500/20 rounded-xl p-1 text-center select-none">
                  <Compass className="w-5 h-5 text-amber-700/60 animate-spin-slow" />
                  <span className="text-[9px] font-serif uppercase tracking-widest text-amber-800/60 mt-1">Rasi Chart</span>
                </div>
              );
            }
            return null; // Skip rendering other center spacers as they are covered by col/row-span
          }

          const planets = getPlanetsInHouse(box.id);
          const isLagnam = planets.includes("As");

          return (
            <div
              key={box.id}
              className={`flex flex-col justify-between p-1.5 border border-amber-500/30 rounded-lg min-h-[58px] transition duration-200 ${
                isLagnam
                  ? "bg-amber-500/10 border-amber-500"
                  : "bg-white hover:bg-amber-500/5"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-amber-800 font-serif">
                  {box.code}
                </span>
                <span className="text-[8px] text-slate-400 font-mono">
                  {box.id}
                </span>
              </div>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {planets.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    className={`px-1 py-0.5 text-[8px] font-extrabold rounded ${
                      p === "As"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-100 text-amber-950 border border-amber-300"
                    }`}
                    title={p}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-[#6b1419] border-2 border-amber-500/30 rounded-3xl p-6 text-center text-slate-100 shadow-xl space-y-2 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
        <div className="absolute left-0 bottom-0 -translate-x-12 translate-y-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />

        <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30">
          <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
        </div>
        <h2 className="text-xl md:text-2xl font-serif font-extrabold bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">
          Auspicious Horoscope Sync (Melap)
        </h2>
        <p className="text-xs text-amber-200/80 max-w-lg mx-auto font-serif">
          Enter birth credentials of the Bride and Groom to align their celestial bodies, chart Rasi positions, and receive a comprehensive match review.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={loadDemoData}
            className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-[11px] font-bold rounded-full transition duration-300 shadow"
          >
            Load Propitious Demo Pair
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleMatchSubmit} className="bg-white border-2 border-amber-600/15 rounded-3xl p-6 shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Bride Details */}
          <div className="bg-[#6b1419]/5 border border-[#6b1419]/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-serif font-extrabold text-[#6b1419] flex items-center gap-1.5 border-b border-[#6b1419]/10 pb-2">
              <Star className="w-4 h-4 text-rose-600 fill-rose-600/20" /> Bride Astrological Bio (Kanya)
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Bride's Full Name"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={brideDob}
                    onChange={(e) => setBrideDob(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Time of Birth *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    required
                    value={brideTob}
                    onChange={(e) => setBrideTob(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Place of Birth (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={bridePob}
                  onChange={(e) => setBridePob(e.target.value)}
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Groom Details */}
          <div className="bg-amber-600/5 border border-amber-600/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-serif font-extrabold text-amber-900 flex items-center gap-1.5 border-b border-amber-600/10 pb-2">
              <Star className="w-4 h-4 text-amber-600 fill-amber-600/20" /> Groom Astrological Bio (Vara)
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Groom's Full Name"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={groomDob}
                    onChange={(e) => setGroomDob(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Time of Birth *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    required
                    value={groomTob}
                    onChange={(e) => setGroomTob(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Place of Birth (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={groomPob}
                  onChange={(e) => setGroomPob(e.target.value)}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition duration-200"
                />
              </div>
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#6b1419] to-amber-700 hover:from-[#571014] hover:to-amber-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Seeking Divine Astrological Alignment...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Calculate Auspicious Match Compatibility</span>
            </>
          )}
        </button>
      </form>

      {/* Results Block */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Side by Side Horoscope Cards in One Page */}
          <div className="bg-white border-2 border-amber-600/10 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-serif font-extrabold text-slate-800 border-b border-slate-100 pb-3 text-center mb-6">
              Generated Horoscopes Side-by-Side
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Bride Card */}
              <div className="space-y-5 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
                <div className="bg-[#6b1419] text-white p-4 rounded-2xl flex justify-between items-center shadow">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-300">Kanya (Bride)</span>
                    <h4 className="text-base font-serif font-extrabold">{result.bride.name}</h4>
                  </div>
                  <Star className="w-5 h-5 text-amber-300 fill-amber-300/20" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Rasi (Zodiac)</span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{result.bride.rasi}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Nakshatra</span>
                    <p className="text-xs font-black text-[#6b1419] mt-0.5">{result.bride.nakshatra}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Lagnam</span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{result.bride.lagnam}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block text-center">
                    Bride's Rasi Kundali Grid
                  </span>
                  {renderKundaliChart(result.bride.planetaryPositions)}
                </div>
              </div>

              {/* Groom Card */}
              <div className="space-y-5">
                <div className="bg-amber-700 text-white p-4 rounded-2xl flex justify-between items-center shadow">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-200">Vara (Groom)</span>
                    <h4 className="text-base font-serif font-extrabold">{result.groom.name}</h4>
                  </div>
                  <Star className="w-5 h-5 text-amber-300 fill-amber-300/20" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Rasi (Zodiac)</span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{result.groom.rasi}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Nakshatra</span>
                    <p className="text-xs font-black text-amber-800 mt-0.5">{result.groom.nakshatra}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Lagnam</span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{result.groom.lagnam}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block text-center">
                    Groom's Rasi Kundali Grid
                  </span>
                  {renderKundaliChart(result.groom.planetaryPositions)}
                </div>
              </div>

            </div>
          </div>

          {/* Compatibility score and details */}
          <div className="bg-white border-2 border-amber-600/10 rounded-3xl p-6 shadow-md text-center space-y-6">
            <div className="inline-flex flex-col items-center justify-center p-6 rounded-full bg-amber-500/5 border border-amber-500/20 w-36 h-36">
              <Heart className="w-8 h-8 text-rose-600 fill-rose-600 animate-pulse" />
              <span className="text-2xl font-black text-slate-800 font-mono mt-1">{result.overallScore}%</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Vedic Sync</span>
            </div>

            <div className="max-w-2xl mx-auto space-y-2">
              <h4 className="text-sm font-serif font-extrabold text-slate-800">
                Celestial Guna Milap Score: {result.matchingPoruthamsCount} / 10 Poruthams Matched
              </h4>
              <p className="text-xs text-slate-600 font-serif leading-relaxed">
                {result.detailedAstrologicalAnalysis}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center space-x-1.5 text-xs text-amber-800 font-bold hover:underline"
              >
                <span>{showDetails ? "Hide" : "Show"} Traditional 10 Porutham Metrics</span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-left animate-slideDown">
                  {result.poruthamDetails.map((porutham, idx) => (
                    <div key={idx} className="bg-[#fdfaf3] border border-amber-500/15 rounded-2xl p-4 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-amber-950 font-serif">{porutham.name}</span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-black rounded-full uppercase">
                          {porutham.match}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {porutham.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Parenting advice & Verification recommendations as requested */}
          <div className="bg-gradient-to-b from-[#3a0a0c] to-[#1c0405] border-2 border-amber-500/30 rounded-3xl p-6 text-slate-200 space-y-4 shadow-xl">
            <h3 className="text-sm font-serif font-extrabold text-amber-300 flex items-center gap-1.5 border-b border-amber-500/20 pb-2.5">
              <Info className="w-4.5 h-4.5 text-amber-400" /> Auspicious Guidance for Parents & Candidates
            </h3>
            <p className="text-xs text-slate-300 font-serif leading-relaxed">
              While our system uses high-precision astronomical telemetry alignments to cross-reference their natal charts, marriage involves physical family alignment. Below are propitious actions and critical check suggestions:
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {result.suggestions.map((suggestion, idx) => (
                <li key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-3.5 text-xs text-slate-300 font-serif flex items-start space-x-3">
                  <div className="w-5 h-5 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 text-[10px] text-amber-200/60 font-serif text-center">
              🛡️ Heritage Matrimony Guidance: Compatibility reports are tools to foster dialogue; parents should independently crosscheck family credentials and educational background.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
