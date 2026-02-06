import type { ProviderConfig, LLMProvider } from "../../types/summarize.js";

/**
 * Provider to LLM agent configuration mapping
 * Following mulmocast-cli provider2agent pattern
 */
export const provider2SummarizeAgent: Record<LLMProvider, ProviderConfig> = {
  openai: {
    agentName: "openAIAgent",
    defaultModel: "gpt-4o-mini",
    keyName: "OPENAI_API_KEY",
    maxTokens: 8192,
  },
  anthropic: {
    agentName: "anthropicAgent",
    defaultModel: "claude-sonnet-4-20250514",
    keyName: "ANTHROPIC_API_KEY",
    maxTokens: 8192,
  },
  groq: {
    agentName: "groqAgent",
    defaultModel: "llama-3.1-8b-instant",
    keyName: "GROQ_API_KEY",
    maxTokens: 4096,
  },
  gemini: {
    agentName: "geminiAgent",
    defaultModel: "gemini-2.0-flash",
    keyName: "GEMINI_API_KEY",
    maxTokens: 8192,
  },
};

/**
 * Get provider config by provider name
 */
export const getProviderConfig = (provider: LLMProvider): ProviderConfig => {
  return provider2SummarizeAgent[provider];
};

/**
 * Get API key from environment for provider
 */
export const getProviderApiKey = (provider: LLMProvider): string | undefined => {
  const config = provider2SummarizeAgent[provider];
  return process.env[config.keyName];
};
