import { z } from "zod";
import { llmProviderSchema } from "./summarize.js";
import type { FetchedContent } from "../core/ai/utils/fetcher.js";

/**
 * Query Options - configuration for querying script content
 */
export const queryOptionsSchema = z.object({
  // LLM settings
  provider: llmProviderSchema.default("openai"),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),

  // Output language (e.g., "ja", "en", "fr")
  lang: z.string().optional(),

  // Custom prompt
  systemPrompt: z.string().optional(),

  // Processing options
  verbose: z.boolean().default(false),

  // Beat filtering
  section: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type QueryOptions = z.infer<typeof queryOptionsSchema>;

/**
 * Query Result - the generated answer
 */
export interface QueryResult {
  answer: string;
  question: string;
  scriptTitle: string;
  beatCount: number;
}

/**
 * Conversation message for interactive query
 */
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Interactive query session state
 */
export interface InteractiveQuerySession {
  scriptTitle: string;
  beatCount: number;
  history: ConversationMessage[];
  fetchedContent?: FetchedContent;
}
