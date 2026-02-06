import type { SummarizeOptions } from "../../../../types/summarize.js";
import type { ExtendedScript } from "../../../../types/index.js";
import { getLanguageName, buildScriptContent } from "../../llm.js";

/**
 * Default system prompt for text summary
 */
export const DEFAULT_SYSTEM_PROMPT_TEXT = `You are creating a summary based on the content provided.
- Extract and explain the actual information and knowledge from the content
- Do NOT describe what the presentation/script is about (avoid phrases like "this presentation explains..." or "the script describes...")
- Write as if you are directly explaining the topic to the reader
- Be concise and informative
- Output plain text only`;

/**
 * Default system prompt for markdown summary
 */
export const DEFAULT_SYSTEM_PROMPT_MARKDOWN = `You are creating a summary based on the content provided.
- Extract and explain the actual information and knowledge from the content
- Do NOT describe what the presentation/script is about (avoid phrases like "this presentation explains..." or "the script describes...")
- Write as if you are directly explaining the topic to the reader
- Use markdown formatting (headers, bullet points, etc.)
- Include a title, key points, and conclusion
- Output well-formatted markdown`;

/**
 * Build user prompt from entire script
 */
export const buildUserPrompt = (script: ExtendedScript, options: SummarizeOptions): string => {
  const parts: string[] = [];

  // Add common script content (title, language, sections with beats)
  parts.push(buildScriptContent(script));

  // Add target length if specified
  if (options.targetLengthChars) {
    parts.push(`Target summary length: approximately ${options.targetLengthChars} characters`);
  }

  parts.push("");
  parts.push("Based on the above content, explain the topic directly to the reader:");

  return parts.join("\n");
};

/**
 * Get system prompt based on format and language
 */
export const getSystemPrompt = (options: SummarizeOptions): string => {
  if (options.systemPrompt) {
    return options.systemPrompt;
  }

  const basePrompt = options.format === "markdown" ? DEFAULT_SYSTEM_PROMPT_MARKDOWN : DEFAULT_SYSTEM_PROMPT_TEXT;

  // Add language instruction if specified
  if (options.lang) {
    const langName = getLanguageName(options.lang);
    return `${basePrompt}\n- IMPORTANT: Write the output in ${langName}`;
  }

  return basePrompt;
};
