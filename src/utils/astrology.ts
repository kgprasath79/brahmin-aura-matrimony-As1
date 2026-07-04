/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BRAHMIN_NAKSHATRAS, BRAHMIN_RASIS, BRAHMIN_PADAMS } from "../data/brahminData";

export interface PoruthamMatch {
  name: string;
  tamilName: string;
  status: "Uthama" | "Madhyama" | "Adhama";
  points: number;
  maxPoints: number;
  description: string;
}

export interface AstrologyProfile {
  nakshatra: string;
  rasi: string;
  padam: string;
  lagnam: string;
  rasiChartPlacements: Record<string, string>;
  amsamChartPlacements: Record<string, string>;
}

// Helper to clean and find Nakshatra index from text
export const getNakshatraIndex = (name: string): number => {
  if (!name) return 0;
  const norm = name.toUpperCase().replace(/[^A-Z]/g, "");
  
  // First match by direct substring
  for (let i = 0; i < BRAHMIN_NAKSHATRAS.length; i++) {
    const starNorm = BRAHMIN_NAKSHATRAS[i].toUpperCase().replace(/[^A-Z]/g, "");
    if (starNorm.includes(norm) || norm.includes(starNorm)) {
      return i;
    }
  }
  
  // Match by splits
  for (let i = 0; i < BRAHMIN_NAKSHATRAS.length; i++) {
    const parts = BRAHMIN_NAKSHATRAS[i].split("/");
    for (const p of parts) {
      const pNorm = p.toUpperCase().trim().replace(/[^A-Z]/g, "");
      if (pNorm === norm || pNorm.includes(norm) || norm.includes(pNorm)) {
        return i;
      }
    }
  }
  return 0; // Fallback
};

// Map Nakshatra index and optional Pada to Rasi index in BRAHMIN_RASIS
// Rasi order: "Dhanur" (0), "Kadaka" (1), "Kanya" (2), "Kumbham" (3), "Makara" (4), "Meena" (5), "Mesha" (6), "Mithuna" (7), "Rishaba" (8), "Simha" (9), "Tula" (10), "Vrischika" (11)
export const getNakshatraRasiIndex = (idx: number, padaNum: number = 1): number => {
  if (idx === 0 || idx === 1) return 6; // Ashwini, Bharani (Mesha)
  if (idx === 2) { // Krittika
    return padaNum === 1 ? 6 : 8; // Pada 1 is Mesha, Padas 2,3,4 are Rishaba
  }
  if (idx === 3) return 8; // Rohini (Rishaba)
  if (idx === 4) { // Mrigashira
    return (padaNum === 1 || padaNum === 2) ? 8 : 7; // Padas 1,2 are Rishaba, 3,4 are Mithuna
  }
  if (idx === 5) return 7; // Arudra (Mithuna)
  if (idx === 6) { // Punarvasu
    return padaNum === 4 ? 1 : 7; // Padas 1,2,3 are Mithuna, Pada 4 is Kadaka
  }
  if (idx === 7 || idx === 8) return 1; // Pushya, Ashlesha (Kadaka/Cancer)
  
  if (idx === 9 || idx === 10) return 9; // Magha, Poorvaphalguni (Simha)
  if (idx === 11) { // Uttaraphalguni
    return padaNum === 1 ? 9 : 2; // Pada 1 is Simha, Padas 2,3,4 are Kanya
  }
  if (idx === 12) return 2; // Hasta (Kanya)
  if (idx === 13) { // Chitra
    return (padaNum === 1 || padaNum === 2) ? 2 : 10; // Padas 1,2 are Kanya, 3,4 are Tula
  }
  if (idx === 14) return 10; // Swati (Tula)
  if (idx === 15) { // Vishakha
    return padaNum === 4 ? 11 : 10; // Padas 1,2,3 are Tula, Pada 4 is Vrischika
  }
  if (idx === 16 || idx === 17) return 11; // Anuradha, Jyeshta (Vrischika)
  
  if (idx === 18 || idx === 19) return 0; // Moola, Poorvashadha (Dhanur)
  if (idx === 20) { // Uttarashadha
    return padaNum === 1 ? 0 : 4; // Pada 1 is Dhanur, Padas 2,3,4 are Makara
  }
  if (idx === 21) return 4; // Shravana (Makara)
  if (idx === 22) { // Dhanishta
    return (padaNum === 1 || padaNum === 2) ? 4 : 3; // Padas 1,2 are Makara, 3,4 are Kumbha
  }
  if (idx === 23) return 3; // Shatabhisha (Kumbha)
  if (idx === 24) { // Poorvabhadra
    return padaNum === 4 ? 5 : 3; // Padas 1,2,3 are Kumbha, Pada 4 is Meena
  }
  if (idx === 25 || idx === 26) return 5; // Uttarabhadra, Revati (Meena)
  
  return 6; // default fallback
};

// Traditional Gana classification
export const getGana = (idx: number): "Deva" | "Manusha" | "Rakshasa" => {
  const deva = [0, 4, 6, 7, 12, 14, 16, 21, 26];
  const manusha = [1, 3, 5, 10, 11, 13, 19, 20, 24];
  if (deva.includes(idx)) return "Deva";
  if (manusha.includes(idx)) return "Manusha";
  return "Rakshasa";
};

// Traditional Animal classification for Yoni
export const getNakshatraAnimal = (idx: number): number => {
  const horse = [0, 23]; // Ashwini, Shatabhisha
  const elephant = [1, 26]; // Bharani, Revati
  const goat = [2, 7]; // Krittika, Pushya
  const serpent = [3, 4]; // Rohini, Mrigashira
  const dog = [5, 18]; // Ardra, Moola
  const cat = [6, 8]; // Punarvasu, Ashlesha
  const rat = [9, 10]; // Magha, Poorva Phalguni
  const cow = [11, 25]; // Uttara Phalguni, Uttarabhadrapada
  const buffalo = [12, 14]; // Hasta, Swati
  const tiger = [13, 15]; // Chitra, Vishakha
  const deer = [16, 17]; // Anuradha, Jyeshta
  const monkey = [19, 21]; // Poorvashadha, Shravana
  const lion = [20, 22]; // Uttarashadha, Dhanishta
  return mongoose.includes(idx) ? 13 : 13; // Mongoose as fallback/Poorvabhadra (24)
};
const mongoose = [24];

// Traditional planetary lord friendship
export const getLord = (rasiIdx: number): string => {
  if ([0, 5].includes(rasiIdx)) return "Jupiter";
  if (rasiIdx === 1) return "Moon";
  if ([2, 7].includes(rasiIdx)) return "Mercury";
  if ([3, 4].includes(rasiIdx)) return "Saturn";
  if ([6, 11].includes(rasiIdx)) return "Mars";
  if ([8, 10].includes(rasiIdx)) return "Venus";
  return "Sun"; // Simha (9)
};

export const getLordFriendship = (l1: string, l2: string): number => {
  if (l1 === l2) return 1.0;
  const friends: Record<string, string[]> = {
    Sun: ["Moon", "Mars", "Jupiter"],
    Moon: ["Sun", "Mercury"],
    Mars: ["Sun", "Moon", "Jupiter"],
    Mercury: ["Sun", "Venus"],
    Jupiter: ["Sun", "Moon", "Mars"],
    Venus: ["Mercury", "Saturn"],
    Saturn: ["Mercury", "Venus"]
  };
  if (friends[l1]?.includes(l2) && friends[l2]?.includes(l1)) {
    return 1.0;
  }
  return 0.5; // default neutral/average
};

// Check Vasya connection
export const isVasya = (r1: number, r2: number): boolean => {
  const vasyaMap: Record<number, number[]> = {
    6: [9, 11], // Mesha -> Simha, Vrischika
    8: [1, 10], // Rishaba -> Kataka, Tula
    7: [10],    // Mithuna -> Tula
    1: [11, 12], // Kataka -> Vrischika, Dhanur
    9: [10],    // Simha -> Tula
    2: [10, 5], // Kanya -> Tula, Meena
    10: [11, 6], // Tula -> Vrischika, Mesha
    11: [1],    // Vrischika -> Kataka
    0: [5],     // Dhanur -> Meena
    4: [3, 6],  // Makara -> Kumbha, Mesha
    3: [9],     // Kumbha -> Simha
    5: [4]      // Meena -> Makara
  };
  return vasyaMap[r1]?.includes(r2) || vasyaMap[r2]?.includes(r1) || r1 === r2;
};

// Traditional Rajju classification
export const getRajjuGroup = (idx: number): number => {
  if ([4, 13, 22].includes(idx)) return 0; // Siro
  if ([3, 5, 12, 14, 21, 23].includes(idx)) return 1; // Kanta
  if ([2, 6, 11, 15, 20, 24].includes(idx)) return 2; // Udara
  if ([1, 7, 10, 16, 19, 25].includes(idx)) return 3; // Uru
  return 4; // Pada / Foot
};

// Traditional Vedha pairs
export const isVedha = (idx1: number, idx2: number): boolean => {
  const vedhas: Record<number, number> = {
    0: 17, 17: 0,
    1: 16, 16: 1,
    2: 15, 15: 2,
    3: 14, 14: 3,
    5: 21, 21: 5,
    6: 20, 20: 6,
    7: 19, 19: 7,
    8: 18, 18: 8,
    9: 26, 26: 9,
    10: 25, 25: 10,
    11: 24, 24: 11,
    12: 23, 23: 12
  };
  return vedhas[idx1] === idx2;
};

// Calculate traditional 10 Poruthams matching matrix
export const getTenPoruthams = (userStar: string, matchStar: string): PoruthamMatch[] => {
  const brideIdx = getNakshatraIndex(userStar);
  const groomIdx = getNakshatraIndex(matchStar);
  
  // 1. Dina Porutham
  const dist = ((groomIdx - brideIdx + 27) % 27) + 1;
  const rem = dist % 9;
  const dinaPoints = (rem === 2 || rem === 4 || rem === 6 || rem === 8 || rem === 0) ? 2 : 0;
  
  // 2. Gana Porutham
  const brideGana = getGana(brideIdx);
  const groomGana = getGana(groomIdx);
  let ganaPoints = 0;
  if (brideGana === groomGana) ganaPoints = 3;
  else if ((brideGana === "Deva" && groomGana === "Manusha") || (brideGana === "Manusha" && groomGana === "Deva")) ganaPoints = 1.5;
  else if ((brideGana === "Manusha" && groomGana === "Rakshasa") || (brideGana === "Rakshasa" && groomGana === "Manusha")) ganaPoints = 1;
  
  // 3. Mahendra Porutham
  const mahendraOk = [4, 7, 10, 13, 16, 19, 22, 25].includes(dist);
  const mahendraPoints = mahendraOk ? 2 : 0;
  
  // 4. Stree Deergha Porutham
  let streePoints = 0;
  if (dist > 13) streePoints = 2;
  else if (dist >= 9 && dist <= 13) streePoints = 1;
  
  // 5. Yoni Porutham
  const bAnim = getNakshatraAnimal(brideIdx);
  const gAnim = getNakshatraAnimal(groomIdx);
  const isYoniEnemy = (a: number, b: number): boolean => {
    const enemies = [[0, 8], [1, 12], [2, 11], [3, 13], [4, 10], [5, 6], [7, 9]];
    return enemies.some(pair => (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a));
  };
  const yoniPoints = bAnim === gAnim ? 4 : isYoniEnemy(bAnim, gAnim) ? 0 : 2;
  
  // 6. Rasi Porutham
  const brideRasi = getNakshatraRasiIndex(brideIdx);
  const groomRasi = getNakshatraRasiIndex(groomIdx);
  const rasiDist = ((groomRasi - brideRasi + 12) % 12) + 1;
  const isShashtashtaka = rasiDist === 6 || rasiDist === 8;
  const isDwirdwadasa = rasiDist === 2 || rasiDist === 12;
  const rasiPoints = (rasiDist === 7 || rasiDist === 1) ? 4 : (isShashtashtaka || isDwirdwadasa) ? 0 : 3;
  
  // 7. Rasiyadhipati Porutham
  const bLord = getLord(brideRasi);
  const gLord = getLord(groomRasi);
  const lordFriendship = getLordFriendship(bLord, gLord);
  const rasiyadhipatiPoints = lordFriendship === 1.0 ? 1 : lordFriendship === 0.5 ? 0.5 : 0;
  
  // 8. Vasya Porutham
  const vasyaPoints = isVasya(brideRasi, groomRasi) ? 2 : 0;
  
  // 9. Rajju Porutham
  const bRajju = getRajjuGroup(brideIdx);
  const gRajju = getRajjuGroup(groomIdx);
  const rajjuPoints = bRajju === gRajju ? 0 : 5;
  
  // 10. Vedha Porutham
  const vedhaPoints = isVedha(brideIdx, groomIdx) ? 0 : 2;
  
  return [
    {
      name: "Dina Porutham",
      tamilName: "தின பொருத்தம்",
      status: dinaPoints === 2 ? "Uthama" : "Adhama",
      points: dinaPoints,
      maxPoints: 2,
      description: "Day-to-day compatibility, physical wellness, and health longevity."
    },
    {
      name: "Gana Porutham",
      tamilName: "கண பொருத்தம்",
      status: ganaPoints === 3 ? "Uthama" : ganaPoints >= 1 ? "Madhyama" : "Adhama",
      points: ganaPoints,
      maxPoints: 3,
      description: "Classifies temperaments (Divine, Human, Demonic) for mutual behavior alignment."
    },
    {
      name: "Mahendra Porutham",
      tamilName: "மகேந்திர பொருத்தம்",
      status: mahendraPoints === 2 ? "Uthama" : "Adhama",
      points: mahendraPoints,
      maxPoints: 2,
      description: "Governs progeny (offspring lineage), continuous growth, and family prosperity."
    },
    {
      name: "Stree Deergha Porutham",
      tamilName: "ஸ்திரீ தீர்க்க பொருத்தம்",
      status: streePoints === 2 ? "Uthama" : streePoints === 1 ? "Madhyama" : "Adhama",
      points: streePoints,
      maxPoints: 2,
      description: "Longevity of the bride, financial stability, and mutual peace."
    },
    {
      name: "Yoni Porutham",
      tamilName: "யோனி பொருத்தம்",
      status: yoniPoints === 4 ? "Uthama" : yoniPoints === 2 ? "Madhyama" : "Adhama",
      points: yoniPoints,
      maxPoints: 4,
      description: "Biological compatibility and sexual/temperamental affinity represented by animal elements."
    },
    {
      name: "Rasi Porutham",
      tamilName: "ராசி பொருத்தம்",
      status: rasiPoints === 4 ? "Uthama" : rasiPoints === 3 ? "Madhyama" : "Adhama",
      points: rasiPoints,
      maxPoints: 4,
      description: "Harmony of familial minds and social lineage unification."
    },
    {
      name: "Rasiyadhipati Porutham",
      tamilName: "ராசியாதிபதி பொருத்தம்",
      status: rasiyadhipatiPoints === 1 ? "Uthama" : rasiyadhipatiPoints === 0.5 ? "Madhyama" : "Adhama",
      points: rasiyadhipatiPoints,
      maxPoints: 1,
      description: "Intellectual friendship between planetary ruling lords."
    },
    {
      name: "Vasya Porutham",
      tamilName: "வசிய பொருத்தம்",
      status: vasyaPoints === 2 ? "Uthama" : "Adhama",
      points: vasyaPoints,
      maxPoints: 2,
      description: "Magnetic attraction, mutual love, and romantic alignment."
    },
    {
      name: "Rajju Porutham",
      tamilName: "ரஜ்ஜு பொருத்தம்",
      status: rajjuPoints === 5 ? "Uthama" : "Adhama",
      points: rajjuPoints,
      maxPoints: 5,
      description: "The absolute most vital South Indian matching metric. Governs longevity of the marital bond."
    },
    {
      name: "Vedha Porutham",
      tamilName: "வேதை பொருத்தம்",
      status: vedhaPoints === 2 ? "Uthama" : "Adhama",
      points: vedhaPoints,
      maxPoints: 2,
      description: "Excludes star combinations that are destructive, preventing separations or severe strife."
    }
  ];
};

// Generate Horoscope details and chart placements from Birth Date & Birth Time
export function generateDynamicHoroscope(
  dayStr: string,
  monthStr: string,
  yearStr: string,
  hourStr: string,
  minStr: string,
  amPmStr: string
): AstrologyProfile {
  const day = parseInt(dayStr) || 15;
  const year = parseInt(yearStr) || 1998;
  const hour = parseInt(hourStr) || 9;
  const min = parseInt(minStr) || 30;
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIdx = months.indexOf(monthStr) !== -1 ? months.indexOf(monthStr) + 1 : 5;
  
  const hour24 = (hour % 12) + (amPmStr === "PM" ? 12 : 0);
  const hourDecimal = hour24 + (min / 60);

  // Compute Julian Date
  let Y = year;
  let M = monthIdx;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = Math.floor(A / 4);
  const C = 2 - A + B;
  const E = Math.floor(365.25 * (Y + 4716));
  const F = Math.floor(30.6001 * (M + 1));
  const jd = C + day + E + F - 1524.5 + (hourDecimal / 24);

  // Days since J2000.0 (Jan 1.5, 2000)
  const d = jd - 2451545.0;

  // Lahiri Ayanamsa: approximately 23.85 degrees in 2000, changing slowly
  const ayanamsa = 23.85 + (0.00014 * d);

  // Moon's Orbital Elements relative to J2000
  // Moon Mean Longitude (L)
  const moonL = (218.316 + 13.176396 * d) % 360;
  // Moon Mean Anomaly (M)
  const moonM = (134.963 + 13.064993 * d) % 360;
  // Moon Mean Elongation (D)
  const moonD = (297.850 + 12.190749 * d) % 360;
  // Sun Mean Anomaly (M')
  const sunM = (357.529 + 0.985600 * d) % 360;

  // Convert to radians for trigonometric functions
  const rad = Math.PI / 180;

  // Key perturbation terms in Moon's longitude
  const correction = 
    6.289 * Math.sin(moonM * rad) + 
    1.274 * Math.sin((2 * moonD - moonM) * rad) + 
    0.658 * Math.sin((2 * moonD) * rad) - 
    0.186 * Math.sin(sunM * rad) - 
    0.114 * Math.sin(moonD * rad);

  const tropicalMoonLong = (moonL + correction + 360) % 360;
  const siderealMoonLong = (tropicalMoonLong - ayanamsa + 360) % 360;

  // 108 padas in Zodiac (27 Nakshatras * 4 Padas)
  // Sidereal longitude maps to Nakshatra and Pada
  const currentPadaIndex = Math.floor(siderealMoonLong / (360 / 108)) % 108;
  const nakshatraIndex = Math.floor(currentPadaIndex / 4) % 27;
  const padaNum = (currentPadaIndex % 4) + 1; // 1, 2, 3, 4

  const nakshatra = BRAHMIN_NAKSHATRAS[nakshatraIndex];
  const padam = BRAHMIN_PADAMS[padaNum - 1];

  // Rasi Index (0-11) corresponding to Mesha, Rishaba, etc.
  const zodiacRasiIdx = Math.floor(siderealMoonLong / 30) % 12;
  // Map zodiac indices to alphabetical BRAHMIN_RASIS list
  // 0: Mesha -> 6, 1: Rishaba -> 8, 2: Mithuna -> 7, 3: Kadaka -> 1, 4: Simha -> 9, 5: Kanya -> 2
  // 6: Tula -> 10, 7: Vrischika -> 11, 8: Dhanur -> 0, 9: Makara -> 4, 10: Kumbha -> 3, 11: Meena -> 5
  const zodiacToBrahminRasiIdx = [6, 8, 7, 1, 9, 2, 10, 11, 0, 4, 3, 5];
  const rasiIdx = zodiacToBrahminRasiIdx[zodiacRasiIdx];
  const rasi = BRAHMIN_RASIS[rasiIdx] || "Rishaba";

  // Sun Mean Longitude
  const sunL = (280.460 + 0.9856474 * d) % 360;
  const sunSidereal = (sunL - ayanamsa + 360) % 360;

  // Lagnam (Ascendant)
  // Sunrise is roughly 6:00 AM, where Lagnam equals Sun Sidereal
  const hoursSinceSunrise = (hourDecimal - 6.0 + 24) % 24;
  const lagnamLongitude = (sunSidereal + hoursSinceSunrise * 15.0) % 360;
  const zodiacLagnamIdx = Math.floor(lagnamLongitude / 30) % 12;
  const lagnamIdx = zodiacToBrahminRasiIdx[zodiacLagnamIdx];
  const lagnam = BRAHMIN_RASIS[lagnamIdx] || "Tula";

  // Build dynamic rasi and amsam grids
  const rasiPlacements: Record<string, string[]> = {};
  const amsamPlacements: Record<string, string[]> = {};
  
  BRAHMIN_RASIS.forEach(r => {
    rasiPlacements[r] = [];
    amsamPlacements[r] = [];
  });

  // Precise planetary sidereal coordinates
  const marsLong = (355.453 + 0.5240207 * d - ayanamsa + 720) % 360;
  const mercLong = (250.252 + 4.0923388 * d - ayanamsa + 720) % 360;
  const jupLong = (34.404 + 0.0830853 * d - ayanamsa + 720) % 360;
  const venLong = (181.979 + 1.6021302 * d - ayanamsa + 720) % 360;
  const satLong = (50.077 + 0.0334442 * d - ayanamsa + 720) % 360;
  const rahuLong = (125.122 - 0.0529536 * d - ayanamsa + 720) % 360;
  const ketuLong = (rahuLong + 180) % 360;

  const getRasiKey = (long: number) => BRAHMIN_RASIS[zodiacToBrahminRasiIdx[Math.floor(long / 30) % 12]];
  const getAmsamKey = (long: number) => {
    // Navamsa: 1/9th of 30 degrees is 3.333333 degrees
    const navamsaSignIdx = Math.floor(long / 3.333333) % 12;
    return BRAHMIN_RASIS[zodiacToBrahminRasiIdx[navamsaSignIdx]];
  };

  // Place core components
  rasiPlacements[lagnam]?.push("As");
  rasiPlacements[rasi]?.push("Ch");
  rasiPlacements[getRasiKey(sunSidereal)]?.push("Sy");
  rasiPlacements[getRasiKey(marsLong)]?.push("Ma");
  rasiPlacements[getRasiKey(mercLong)]?.push("Bu");
  rasiPlacements[getRasiKey(jupLong)]?.push("Gu");
  rasiPlacements[getRasiKey(venLong)]?.push("Su");
  rasiPlacements[getRasiKey(satLong)]?.push("Sa");
  rasiPlacements[getRasiKey(rahuLong)]?.push("Ra");
  rasiPlacements[getRasiKey(ketuLong)]?.push("Ke");

  amsamPlacements[getAmsamKey(lagnamLongitude)]?.push("As");
  amsamPlacements[getAmsamKey(siderealMoonLong)]?.push("Ch");
  amsamPlacements[getAmsamKey(sunSidereal)]?.push("Sy");
  amsamPlacements[getAmsamKey(marsLong)]?.push("Ma");
  amsamPlacements[getAmsamKey(mercLong)]?.push("Bu");
  amsamPlacements[getAmsamKey(jupLong)]?.push("Gu");
  amsamPlacements[getAmsamKey(venLong)]?.push("Su");
  amsamPlacements[getAmsamKey(satLong)]?.push("Sa");
  amsamPlacements[getAmsamKey(rahuLong)]?.push("Ra");
  amsamPlacements[getAmsamKey(ketuLong)]?.push("Ke");

  // Format to display-ready strings
  const rasiChartPlacements: Record<string, string> = {};
  const amsamChartPlacements: Record<string, string> = {};
  
  BRAHMIN_RASIS.forEach(r => {
    if (rasiPlacements[r] && rasiPlacements[r].length > 0) {
      rasiChartPlacements[r] = rasiPlacements[r].join(", ");
    }
    if (amsamPlacements[r] && amsamPlacements[r].length > 0) {
      amsamChartPlacements[r] = amsamPlacements[r].join(", ");
    }
  });

  return {
    nakshatra,
    rasi,
    padam,
    lagnam,
    rasiChartPlacements,
    amsamChartPlacements
  };
}
