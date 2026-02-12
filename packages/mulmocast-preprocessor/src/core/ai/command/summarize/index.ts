import type { ExtendedMulmoScript } from "@mulmocast/extended-types";
import type { SummarizeOptions, SummarizeResult } from "../../../../types/summarize.js";
import { summarizeOptionsSchema } from "../../../../types/summarize.js";
import { executeLLM, filterScript } from "../../llm.js";
import { buildUserPrompt, getSystemPrompt } from "./prompts.js";

/**
 * Main summarize function - generates a summary of the entire script
 */
export const summarizeScript = async (script: ExtendedMulmoScript, options: Partial<SummarizeOptions> = {}): Promise<SummarizeResult> => {
  // Validate and apply defaults
  const validatedOptions = summarizeOptionsSchema.parse(options);

  // Filter script if section/tags specified
  const filteredScript = filterScript(script, validatedOptions);
  const scriptTitle = script.title || "Untitled";

  if (filteredScript.beats.length === 0) {
    return {
      summary: "No content to summarize.",
      format: validatedOptions.format,
      scriptTitle,
      beatCount: 0,
    };
  }

  // Build prompts
  const systemPrompt = getSystemPrompt(validatedOptions);
  const userPrompt = buildUserPrompt(filteredScript, validatedOptions);

  // Execute LLM
  const summary = await executeLLM(
    systemPrompt,
    userPrompt,
    validatedOptions,
    `Summarizing script "${script.title}" with ${validatedOptions.provider}... Beats: ${filteredScript.beats.length}, Format: ${validatedOptions.format}`,
  );

  return {
    summary,
    format: validatedOptions.format,
    scriptTitle,
    beatCount: filteredScript.beats.length,
  };
};

// Re-export types
export type { SummarizeOptions, SummarizeResult, LLMProvider, SummarizeFormat } from "../../../../types/summarize.js";
export { summarizeOptionsSchema, llmProviderSchema, summarizeFormatSchema } from "../../../../types/summarize.js";
