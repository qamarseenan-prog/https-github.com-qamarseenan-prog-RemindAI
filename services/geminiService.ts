import { GoogleGenAI, Type } from "@google/genai";
import { SmartTaskInput, Priority, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseSmartTask = async (input: string): Promise<SmartTaskInput | null> => {
  try {
    const currentDateTime = new Date().toISOString();
    
    const prompt = `
      Current Date and Time: ${currentDateTime}.
      
      User Input: "${input}"
      
      Extract the following task details from the user input:
      1. Title (required, short summary)
      2. Description (optional, additional details)
      3. Due Date (optional, strictly ISO 8601 format string e.g., 2024-12-25T15:00:00.000Z. Calculate relative dates like 'tomorrow', 'next friday' based on current date).
      4. Priority (High, Medium, or Low. Default to Medium if not specified or implied).
      5. Category (Personal, Work, Health, Shopping, Other. Infer best fit).
      
      Return JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            dueDate: { type: Type.STRING, description: "ISO 8601 format date string" },
            priority: { type: Type.STRING, enum: [Priority.High, Priority.Medium, Priority.Low] },
            category: { type: Type.STRING, enum: [Category.Personal, Category.Work, Category.Health, Category.Shopping, Category.Other] }
          },
          required: ["title", "priority", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as SmartTaskInput;

  } catch (error) {
    console.error("Error parsing smart task with Gemini:", error);
    // Fallback or re-throw depending on desired behavior. 
    // For this app, returning null signals a failure to parse "smartly".
    return null;
  }
};
