import { z } from "zod";

/**
 * LLM Provider - supported providers for summarization
 */
export const llmProviderSchema = z.enum(["openai", "anthropic", "groq", "gemini"]);
export type LLMProvider = z.infer<typeof llmProviderSchema>;

/**
 * Output format for summary
 */
export const summarizeFormatSchema = z.enum(["text", "markdown"]);
export type SummarizeFormat = z.infer<typeof summarizeFormatSchema>;

/**
 * Summarize Options - configuration for summarization
 */
export const summarizeOptionsSchema = z.object({
  // LLM settings
  provider: llmProviderSchema.default("openai"),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),

  // Output format
  format: summarizeFormatSchema.default("text"),

  // Target length (optional)
  targetLengthChars: z.number().positive().optional(),

  // Custom prompt
  systemPrompt: z.string().optional(),

  // Processing options
  verbose: z.boolean().default(false),

  // Beat filtering
  section: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type SummarizeOptions = z.infer<typeof summarizeOptionsSchema>;

/**
 * Summarize Result - the generated summary
 */
export interface SummarizeResult {
  summary: string;
  format: SummarizeFormat;
  scriptTitle: string;
  beatCount: number;
}

/**
 * Provider Config - configuration for LLM provider
 */
export interface ProviderConfig {
  agentName: string;
  defaultModel: string;
  keyName: string;
  maxTokens?: number;
}
