
import { GoogleGenAI, Chat, Type } from "@google/genai";

let chatSession: Chat | null = null;

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const startChat = (systemInstruction: string) => {
  const client = getAIClient();
  if (!client) return null;

  chatSession = client.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction,
    },
  });
  return chatSession;
};

export const sendMessage = async (message: string): Promise<string> => {
  if (!chatSession) {
    // If no session exists, try to start a default one (fallback)
    startChat("You are a helpful university teaching assistant. You help explain concepts but never give the direct answer to quizzes. Guide the student.");
    if (!chatSession) return "Error: AI Service unavailable. Please check API Key.";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    // Use .text property instead of method
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the knowledge base right now.";
  }
};

export const validateContent = async (text: string): Promise<{ safe: boolean; reason?: string }> => {
  const client = getAIClient();
  if (!client) return { safe: true }; 

  try {
    // Use ai.models.generateContent directly as per guidelines and implement responseSchema
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following text for offensive, unethical, hate speech, or harmful language. Text to analyze: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: {
              type: Type.BOOLEAN,
              description: 'Whether the text is safe to post.',
            },
            reason: {
              type: Type.STRING,
              description: 'Short explanation if the text is unsafe.',
            },
          },
          required: ["safe"],
        },
      },
    });
    
    // response.text property directly returns the string output
    const resultText = response.text || "";
    try {
      return JSON.parse(resultText.trim());
    } catch (parseError) {
      console.error("Moderation JSON Parse Error:", parseError);
      return { safe: true };
    }
  } catch (error) {
    console.error("Moderation Error:", error);
    // Fail safe for UX but log it.
    return { safe: true }; 
  }
};
