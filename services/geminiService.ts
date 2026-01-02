import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData, SuggestionResult } from "../types";

const apiKey = process.env.API_KEY;

export const getResumeSuggestions = async (resumeData: ResumeData): Promise<SuggestionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  if (!apiKey) return {};

  const dataForPrompt = {
    summary: resumeData.personal.summary,
    experiences: resumeData.experience.map(e => ({ id: e.id, company: e.company, description: e.description })),
  };

  const prompt = `
    Analyze this resume data and suggest improvements:
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
            improved: { type: Type.STRING },
            critique: { type: Type.STRING }
          },
          required: ["original", "improved", "critique"]
        },
        experiences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              improved: { type: Type.STRING },
              critique: { type: Type.STRING }
            },
            required: ["id", "improved", "critique"]
          }
        }
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Suggestions error:", error);
    return {};
  }
};

/**
 * AI INTERVIEW LOGIC
 */

export const getNextInterviewQuestion = async (currentData: ResumeData, chatHistory: { role: 'user' | 'model', text: string }[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are an expert resume interviewer. Your goal is to build a complete resume for the user.
    Look at the current resume data: ${JSON.stringify(currentData)}.
    Identify what is missing or could be expanded (e.g., more experience details, skills, projects, or summary).
    Ask ONE short, professional question to the user to get more information.
    Be encouraging but concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: chatHistory.length === 0 ? prompt : [...chatHistory.map(h => ({ role: h.role, parts: [{ text: h.text }] })), { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a professional resume writer named ResuCoach. You interview users to extract their best achievements.",
      }
    });
    return response.text || "Tell me about your professional background.";
  } catch (error) {
    return "What is your current or most recent job title?";
  }
};

export const processInterviewAnswer = async (answer: string, currentData: ResumeData): Promise<Partial<ResumeData>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    A user just answered a question for their resume: "${answer}"
    Update the resume data based on this answer. 
    Current data: ${JSON.stringify(currentData)}
    
    Return a JSON object that contains the UPDATED fields only. 
    Map the answer to personal.summary, experience, education, skills, etc. as appropriate.
    If it's experience, make sure to structure it as an item in the experience array.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    description: "The partial resume data updates",
    properties: {
      personal: { type: Type.OBJECT, properties: { fullName: {type: Type.STRING}, summary: {type: Type.STRING}, jobTitle: {type: Type.STRING} } },
      experience: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, company: {type: Type.STRING}, position: {type: Type.STRING}, description: {type: Type.STRING} } } },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      education: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { institution: {type: Type.STRING}, degree: {type: Type.STRING} } } }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Processing error:", error);
    return {};
  }
};