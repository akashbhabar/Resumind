import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData, SuggestionResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export const getResumeSuggestions = async (resumeData: ResumeData): Promise<SuggestionResult> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return {};
  }

  // Create a simplified version of data for the prompt to save tokens, ensuring IDs are present
  const dataForPrompt = {
    summary: resumeData.personal.summary,
    experiences: resumeData.experience.map(e => ({ id: e.id, company: e.company, description: e.description })),
  };

  const prompt = `
    You are an expert resume writer. Analyze the provided resume summary and experience descriptions.
    Your task is to rewrite the summary to be more professional, impactful, and concise.
    Also, for each experience entry, rewrite the description to use strong action verbs, quantify achievements where possible (add placeholders like [X]% if needed), and improve clarity.
    
    Return a structured JSON object with the improvements.
    
    Resume Data:
    ${JSON.stringify(dataForPrompt, null, 2)}
  `;

  try {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            improved: { type: Type.STRING, description: "The rewritten, improved summary." },
            critique: { type: Type.STRING, description: "Why this change is better." }
          },
          required: ["original", "improved", "critique"]
        },
        experiences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "The ID of the experience entry." },
              company: { type: Type.STRING },
              original: { type: Type.STRING },
              improved: { type: Type.STRING, description: "The rewritten, improved description." },
              critique: { type: Type.STRING, description: "Why this change is better." }
            },
            required: ["id", "improved", "critique"]
          }
        }
      },
      required: ["summary", "experiences"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a top-tier career coach. Be direct, professional, and result-oriented.",
      },
    });

    const text = response.text;
    if (!text) return {};

    const result = JSON.parse(text) as SuggestionResult;
    return result;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return {};
  }
};