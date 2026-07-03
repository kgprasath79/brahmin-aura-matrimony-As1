/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Profile } from "../types";
import { Star, Eye, Calendar, Award } from "lucide-react";

interface HoroscopeChartProps {
  profile: Profile;
}

export default function HoroscopeChart({ profile }: HoroscopeChartProps) {
  const [chartType, setChartType] = useState<"rasi" | "amsam">("rasi");

  const getNormalSignName = (name: string): string => {
    if (name === "Rishabha") return "Rishaba";
    if (name === "Kumbha") return "Kumbham";
    if (name === "Dhanus") return "Dhanur";
    return name;
  };

  const signMapping = [
    // Row 0
    { name: "Meena", label: "Pisces (Meena)", row: 0, col: 0 },
    { name: "Mesha", label: "Aries (Mesha)", row: 0, col: 1 },
    { name: "Rishabha", label: "Taurus (Rishabha)", row: 0, col: 2 },
    { name: "Mithuna", label: "Gemini (Mithuna)", row: 0, col: 3 },
    // Row 1
    { name: "Kumbha", label: "Aquarius (Kumbha)", row: 1, col: 0 },
    { name: "center-1", label: "", row: 1, col: 1, isCenter: true },
    { name: "center-2", label: "", row: 1, col: 2, isCenter: true },
    { name: "Kataka", label: "Cancer (Kataka)", row: 1, col: 3 },
    // Row 2
    { name: "Makara", label: "Capricorn (Makara)", row: 2, col: 0 },
    { name: "center-3", label: "", row: 2, col: 1, isCenter: true },
    { name: "center-4", label: "", row: 2, col: 2, isCenter: true },
    { name: "Simha", label: "Leo (Simha)", row: 2, col: 3 },
    // Row 3
    { name: "Dhanus", label: "Sagittarius (Dhanus)", row: 3, col: 0 },
    { name: "Vrischika", label: "Scorpio (Vrischika)", row: 3, col: 1 },
    { name: "Tula", label: "Libra (Tula)", row: 3, col: 2 },
    { name: "Kanya", label: "Virgo (Kanya)", row: 3, col: 3 },
  ];

  const placements = chartType === "rasi" 
    ? profile.rasiChartPlacements || {} 
    : profile.amsamChartPlacements || {};

  return (
    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-4">
      {/* Astrological Chart Header */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" /> 
            Vedic Astro Kundali
          </h4>
          <p className="text-[10px] text-slate-500 font-sans mt-0.5">
            South Indian Style {chartType === "rasi" ? "Rasi (Moon)" : "Amsam (D9)"} Chart
          </p>
        </div>
        
        {/* Chart Selector Buttons */}
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
          <button
            id={`chart-btn-rasi-${profile.id}`}
            onClick={() => setChartType("rasi")}
            className={`px-2.5 py-1 rounded-md transition-all duration-300 cursor-pointer ${
              chartType === "rasi"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            Rasi (D1)
          </button>
          <button
            id={`chart-btn-amsam-${profile.id}`}
            onClick={() => setChartType("amsam")}
            className={`px-2.5 py-1 rounded-md transition-all duration-300 cursor-pointer ${
              chartType === "amsam"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            Amsam (D9)
          </button>
        </div>
      </div>

      {/* 4x4 Grid Container */}
      <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800/60 aspect-square max-w-[280px] mx-auto w-full">
        {signMapping.map((cell, idx) => {
          if (cell.isCenter) {
            // Render the central empty space (4 cells forming a 2x2 in the middle)
            // We only want to render something beautiful here once, say at cell index 5 (Row 1 Col 1)
            if (cell.name === "center-1") {
              return (
                <div
                  key={idx}
                  className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-slate-950 rounded-xl relative border border-slate-800/40 text-center p-2 select-none"
                  style={{ gridColumn: "span 2", gridRow: "span 2" }}
                >
                  {/* Subtle decorative mandala cross in background */}
                  <div className="absolute inset-0 border border-amber-500/5 rounded-lg rotate-45 pointer-events-none" />
                  <div className="absolute inset-0 border border-rose-500/5 rounded-lg pointer-events-none" />
                  
                  <span className="text-[10px] font-extrabold text-amber-500 tracking-widest uppercase">
                    {chartType.toUpperCase()}
                  </span>
                  <span className="text-[7px] text-slate-500 tracking-wider mt-0.5">
                    Lagna: {profile.lagnam || "Tula"}
                  </span>
                </div>
              );
            }
            // Skip the other center indices as we spanned them with col-span-2 row-span-2
            return null;
          }

          const planetContent = placements[cell.name] || placements[getNormalSignName(cell.name)];

          return (
            <div
              key={idx}
              className="flex flex-col justify-between bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 hover:border-amber-500/30 transition-all duration-300 min-h-[56px] select-none text-[8px]"
            >
              {/* Sign label */}
              <span className="text-slate-500 text-[7px] block truncate font-medium">
                {cell.name}
              </span>

              {/* Planet Placements */}
              {planetContent ? (
                <div className="text-center py-0.5">
                  <span className="bg-amber-500/10 text-amber-300 font-extrabold font-mono text-[9px] px-1 py-0.5 rounded border border-amber-500/20 block tracking-tight truncate">
                    {planetContent}
                  </span>
                </div>
              ) : (
                <div className="h-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Astro Meta Info Footer */}
      <div className="grid grid-cols-2 gap-2 text-[9px] bg-slate-900/60 p-2 rounded-xl border border-slate-800/40">
        <div className="flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="text-slate-400">Nakshatra: <b className="text-slate-200">{profile.nakshatra}</b></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="text-slate-400">Rasi Sign: <b className="text-slate-200">{profile.rasi || "Rishabha"}</b></span>
        </div>
      </div>
    </div>
  );
}
