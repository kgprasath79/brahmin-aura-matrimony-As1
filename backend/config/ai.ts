import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.length > 20) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "brahmin-aura-matrimony-enterprise",
        },
      },
    });
    console.log("Successfully initialized real GoogleGenAI Client.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.log("GEMINI_API_KEY is not defined or is placeholder. Falling back to simulated engine.");
}

export default ai;
