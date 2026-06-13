import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Creates a Groq AI provider using the OpenAI-compatible API.
 * Reads the API key from the GROQ_API_KEY environment variable.
 */
export function getAIProvider() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("AI is not configured. Set GROQ_API_KEY in your .env file.");
  }
  return createOpenAICompatible({
    name: "groq",
    baseURL: "https://api.groq.com/openai/v1",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
}
