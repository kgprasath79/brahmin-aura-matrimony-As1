import { Type } from "@google/genai";
import ai from "../config/ai";
import { validateAndSecurePrompt } from "../middleware/security";

export const getSimulatedHoroscopeMatch = (
  brideName: string,
  brideDob: string,
  brideTob: string,
  groomName: string,
  groomDob: string,
  groomTob: string
) => {
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const bHash = getHash(brideName + brideDob + brideTob);
  const gHash = getHash(groomName + groomDob + groomTob);

  const rasis = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
    "Dhanus (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
  ];
  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
  ];
  const lagnams = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika",
    "Dhanus", "Makara", "Kumbha", "Meena"
  ];

  const bRasiIdx = bHash % 12;
  const gRasiIdx = gHash % 12;
  const bNakIdx = bHash % 27;
  const gNakIdx = gHash % 27;
  const bLagIdx = (bHash + 3) % 12;
  const gLagIdx = (gHash + 5) % 12;

  const getPositions = (hashVal: number) => {
    const planets = ["Ascendant", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    return planets.map((p, idx) => ({
      planet: p,
      house: ((hashVal + idx * 7) % 12) + 1
    }));
  };

  const score = 68 + ((bHash + gHash) % 28);

  const matches = [
    { name: "Dina (Health & Longevity)", status: (bHash % 3 === 0) ? "Excellent Match" : "Good Compatibility", desc: "Aura and lifecycle markers flow smoothly together." },
    { name: "Gana (Temperament Alignment)", status: (gHash % 2 === 0) ? "High Harmony" : "Friendly Alignment", desc: "Temperament alignment fosters long-term domestic peace." },
    { name: "Mahendra (Lineage & Progeny)", status: ((bHash + gHash) % 3 === 0) ? "Auspicious Match" : "Moderate Support", desc: "Auspicious indicators for prosperity and strong offspring lineage." },
    { name: "Stree Deergha (Lifelong Wealth)", status: "Fully Agreeable", desc: "Groom's constellation distance from Bride's signals consistent wealth accumulation." },
    { name: "Yoni (Physical & Affinity Harmony)", status: (bHash % 4 === gHash % 4) ? "Perfect Affinity" : "Compatible Affinity", desc: "Deep mutual empathy, physical synergy, and friendly communication." },
    { name: "Rasi (Psychological & Mind Sync)", status: (bRasiIdx === gRasiIdx) ? "Highly Friendly" : "Auspicious Coexistence", desc: "Deep subconscious connection and mutual understanding between minds." },
    { name: "Rasiyathipathy (Friendly Lords)", status: "Very Harmonious", desc: "The ruling planets of both Rasis share a friendly astrological association." },
    { name: "Vasya (Magnetic Appeal)", status: "Attraction Present", desc: "Underlying magnetic pull that keeps the bond resilient under stress." },
    { name: "Rajju (Primal Husband Longevity)", status: "Fully Passed", desc: "CRITICAL: The constellations lie on different Rajju nodes, fully negating structural afflictions." },
    { name: "Vedha (Friction Mitigation)", status: "Passed", desc: "The birth stars do not form any mutual conflict or structural blockages." }
  ];

  return {
    bride: {
      name: brideName, dob: brideDob, tob: brideTob, rasi: rasis[bRasiIdx],
      nakshatra: nakshatras[bNakIdx], lagnam: lagnams[bLagIdx], planetaryPositions: getPositions(bHash)
    },
    groom: {
      name: groomName, dob: groomDob, tob: groomTob, rasi: rasis[gRasiIdx],
      nakshatra: nakshatras[gNakIdx], lagnam: lagnams[gLagIdx], planetaryPositions: getPositions(gHash)
    },
    overallScore: score,
    matchingPoruthamsCount: 7 + ((bHash + gHash) % 4),
    poruthamDetails: matches.map(m => ({ name: m.name, match: m.status, explanation: m.desc })),
    suggestions: ["Verify Kuja Dosha with an astrologer.", "Pay attention to Saturn's house."],
    detailedAstrologicalAnalysis: "A warm, stable alliance favored by many metrics."
  };
};
