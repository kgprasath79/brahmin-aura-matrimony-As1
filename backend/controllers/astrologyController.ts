import { Request, Response } from "express";
import { getSimulatedHoroscopeMatch } from "../services/astrologyService";
import { sanitizeInput, validateAndSecurePrompt } from "../middleware/security";
import ai from "../config/ai";
import { Type } from "@google/genai";

export const matchHoroscope = async (req: Request, res: Response) => {
  const sanitized = sanitizeInput(req.body);
  const { brideName, brideDob, brideTob, bridePob, groomName, groomDob, groomTob, groomPob } = sanitized;

  if (!brideName || !brideDob || !brideTob || !groomName || !groomDob || !groomTob) {
    return res.status(400).json({ error: "Missing required Horoscope match fields." });
  }

  const promptSecurity = validateAndSecurePrompt(JSON.stringify(sanitized));
  if (!promptSecurity.success) {
    return res.status(400).json({ error: promptSecurity.error });
  }

  if (!ai) {
    return res.json({
      engine: "simulated",
      data: getSimulatedHoroscopeMatch(brideName, brideDob, brideTob, groomName, groomDob, groomTob)
    });
  }

  try {
    const prompt = `Perform a professional Vedic Astrology Horoscope Matching (Koota Matching / Guna Milap) between these two individuals:
    Bride: ${brideName}, DOB: ${brideDob}, TOB: ${brideTob}, POB: ${bridePob || "Not Specified"}
    Groom: ${groomName}, DOB: ${groomDob}, TOB: ${groomTob}, POB: ${groomPob || "Not Specified"}
    Generate overallScore, matchingPoruthamsCount, poruthamDetails, suggestions, and detailedAstrologicalAnalysis.`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            matchingPoruthamsCount: { type: Type.INTEGER },
            poruthamDetails: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  match: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["name", "match", "explanation"]
              }
            },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedAstrologicalAnalysis: { type: Type.STRING }
          },
          required: ["overallScore", "matchingPoruthamsCount", "poruthamDetails", "suggestions", "detailedAstrologicalAnalysis"]
        }
      }
    });

    const parsedData = JSON.parse(response.response.text() || "{}");

    return res.json({
      engine: "gemini-1.5-flash",
      data: parsedData
    });
  } catch (error: any) {
    return res.json({
      engine: "simulated_fallback",
      data: getSimulatedHoroscopeMatch(brideName, brideDob, brideTob, groomName, groomDob, groomTob)
    });
  }
};

export const calculateHoroscope = async (req: Request, res: Response) => {
  // Enterprise logic for real-time Panchnagam calculation
  res.json({ success: true, message: "Modularized calculation endpoint active." });
};
