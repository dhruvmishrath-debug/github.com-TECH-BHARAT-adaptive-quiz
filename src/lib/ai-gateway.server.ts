import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Creates a Google Generative AI provider using the Gemini API directly.
 * Reads the API key from the GOOGLE_GENERATIVE_AI_API_KEY environment variable.
 */
export function getGeminiProvider() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI is not configured. Set GOOGLE_GENERATIVE_AI_API_KEY in your .env file.");
  }
  return createGoogleGenerativeAI({ apiKey });
}
