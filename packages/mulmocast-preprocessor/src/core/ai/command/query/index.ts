import type { ExtendedMulmoScript } from "@mulmocast/extended-types";
import type { QueryOptions, QueryResult } from "../../../../types/query.js";
import { queryOptionsSchema } from "../../../../types/query.js";
import { executeLLM } from "../../llm.js";
import { filterScript, buildQueryPrompt, buildSystemPrompt, DEFAULT_QUERY_SYSTEM_PROMPT } from "@mulmocast/script-utils";

/**
 * Main query function - answers a question based on script content
 */
export const queryScript = async (script: ExtendedMulmoScript, question: string, options: Partial<QueryOptions> = {}): Promise<QueryResult> => {
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
  const systemPrompt = buildSystemPrompt(DEFAULT_QUERY_SYSTEM_PROMPT, validatedOptions);
  const userPrompt = buildQueryPrompt(filteredScript, question);

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
