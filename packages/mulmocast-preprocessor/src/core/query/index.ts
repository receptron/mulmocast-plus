import type { ExtendedScript } from "../../types/index.js";
import type { QueryOptions, QueryResult } from "../../types/query.js";
import { queryOptionsSchema } from "../../types/query.js";
import { executeLLM, filterScript } from "../llm/index.js";
import { buildUserPrompt, getSystemPrompt } from "./prompts.js";

/**
 * Main query function - answers a question based on script content
 */
export const queryScript = async (script: ExtendedScript, question: string, options: Partial<QueryOptions> = {}): Promise<QueryResult> => {
  // Validate and apply defaults
  const validatedOptions = queryOptionsSchema.parse(options);

  // Filter script if section/tags specified
  const filteredScript = filterScript(script, validatedOptions);
  const scriptTitle = script.title || "Untitled";

  if (filteredScript.beats.length === 0) {
    return {
      answer: "No content available to answer the question.",
      question,
      scriptTitle,
      beatCount: 0,
    };
  }

  // Build prompts
  const systemPrompt = getSystemPrompt(validatedOptions);
  const userPrompt = buildUserPrompt(filteredScript, question);

  // Execute LLM
  const answer = await executeLLM(
    systemPrompt,
    userPrompt,
    validatedOptions,
    `Querying script "${script.title}" with ${validatedOptions.provider}... Beats: ${filteredScript.beats.length}, Question: ${question}`,
  );

  return {
    answer,
    question,
    scriptTitle,
    beatCount: filteredScript.beats.length,
  };
};

// Re-export types
export type { QueryOptions, QueryResult } from "../../types/query.js";
export { queryOptionsSchema } from "../../types/query.js";
