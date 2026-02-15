
import { GoogleGenAI, Type } from "@google/genai";
import { PersonaType, AIPipelineResult } from "../types";

export const processTechnicalUpdate = async (
  text: string,
  persona: PersonaType,
  projectName: string
): Promise<AIPipelineResult> => {
  // Use process.env.API_KEY directly for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    You are an AI Executive Communication Intelligence Engine. 
    Your task is to analyze technical developer updates and transform them for a ${persona} audience.
    
    The pipeline includes:
    1. Preprocessing: Extract key technical concepts.
    2. Complexity Scoring: Grade how "in-the-weeds" the original text is (0-100).
    3. Risk Extraction: Identify project delays, blockers, or security risks.
    4. Persona Adaptation: Rewrite for ${persona}.
    5. Executive Summary: Concise, high-impact overview.
    6. Readability Scoring: Score clarity for the target persona (0-100).
    7. Communication Gap Scoring: Quantify the delta between technical detail and executive insight (0-100).
  `;

  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for complex reasoning and adaptation tasks
    model: "gemini-3-pro-preview",
    contents: `Project: ${projectName}\nTechnical Update: ${text}`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          complexityScore: { type: Type.NUMBER },
          readabilityScore: { type: Type.NUMBER },
          communicationGapScore: { type: Type.NUMBER },
          risks: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          keyTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestedActionItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["executiveSummary", "complexityScore", "readabilityScore", "communicationGapScore", "risks", "keyTakeaways", "suggestedActionItems"]
      }
    }
  });

  // Access the .text property directly as per @google/genai guidelines
  const result = JSON.parse(response.text || '{}');
  return result as AIPipelineResult;
};
