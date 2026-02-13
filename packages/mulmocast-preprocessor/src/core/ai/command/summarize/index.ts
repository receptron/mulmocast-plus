import type { ExtendedMulmoScript } from "@mulmocast/extended-types";
import type { SummarizeOptions, SummarizeResult } from "../../../../types/summarize.js";
import { summarizeOptionsSchema } from "../../../../types/summarize.js";
import { executeLLM } from "../../llm.js";
import {
  filterScript,
  buildSummarizePrompt,
  buildSystemPrompt,
  DEFAULT_SUMMARIZE_TEXT_SYSTEM_PROMPT,
  DEFAULT_SUMMARIZE_MARKDOWN_SYSTEM_PROMPT,
} from "@mulmocast/script-utils";

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
  const basePrompt = validatedOptions.format === "markdown" ? DEFAULT_SUMMARIZE_MARKDOWN_SYSTEM_PROMPT : DEFAULT_SUMMARIZE_TEXT_SYSTEM_PROMPT;
  const systemPrompt = buildSystemPrompt(basePrompt, validatedOptions);
  const userPrompt = buildSummarizePrompt(filteredScript, validatedOptions);

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
