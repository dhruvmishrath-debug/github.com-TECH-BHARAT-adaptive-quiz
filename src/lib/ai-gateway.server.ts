import { createGroq } from "@ai-sdk/groq";

/**
 * Creates a Groq AI provider using the dedicated @ai-sdk/groq package.
 * Reads the API key from the GROQ_API_KEY environment variable.
 */
export function getAIProvider() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("AI is not configured. Set GROQ_API_KEY in your .env file.");
  }
  return createGroq({ apiKey });
}
