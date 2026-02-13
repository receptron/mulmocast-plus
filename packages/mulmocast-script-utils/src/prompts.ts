import type { ExtendedMulmoScript } from "@mulmocast/extended-types";
import type { SystemPromptOptions, ConversationMessage } from "./types.js";
import { buildScriptContent, scriptToViewerData } from "./context-builder.js";

/**
 * Language code to display name mapping
 */
const LANG_MAP: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  zh: "Chinese",
  ko: "Korean",
  fr: "French",
  de: "German",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
};

/**
 * Get language display name from code
 */
export const getLanguageName = (langCode: string): string => LANG_MAP[langCode] || langCode;

// --- System Prompt Constants ---

/** Default system prompt for single-shot query */
export const DEFAULT_QUERY_SYSTEM_PROMPT = `You are answering questions based on the content provided.
- Answer based ONLY on the information in the provided content
- If the answer cannot be found in the content, say so clearly
- Be concise and direct in your answers
- Do not make up information that is not in the content`;

/** Default system prompt for interactive query with fetched reference content */
export const DEFAULT_INTERACTIVE_SYSTEM_PROMPT_WITH_FETCH = `You are answering questions based on the content provided, including fetched reference content.
- Answer based on both the main content and any fetched reference content
- If the answer cannot be found, say so clearly
- Be concise and direct in your answers
- Do not make up information
- You may reference previous conversation when answering follow-up questions
- Prioritize information from fetched content when it's more detailed and relevant`;

/** Default system prompt for text summary */
export const DEFAULT_SUMMARIZE_TEXT_SYSTEM_PROMPT = `You are creating a summary based on the content provided.
- Extract and explain the actual information and knowledge from the content
- Do NOT describe what the presentation/script is about (avoid phrases like "this presentation explains..." or "the script describes...")
- Write as if you are directly explaining the topic to the reader
- Be concise and informative
- Output plain text only`;

/** Default system prompt for markdown summary */
export const DEFAULT_SUMMARIZE_MARKDOWN_SYSTEM_PROMPT = `You are creating a summary based on the content provided.
- Extract and explain the actual information and knowledge from the content
- Do NOT describe what the presentation/script is about (avoid phrases like "this presentation explains..." or "the script describes...")
- Write as if you are directly explaining the topic to the reader
- Use markdown formatting (headers, bullet points, etc.)
- Include a title, key points, and conclusion
- Output well-formatted markdown`;

// --- Common System Prompt Builder ---

/**
 * Build a system prompt from a base prompt with optional language instruction.
 * If options.systemPrompt is set, it takes priority over basePrompt.
 */
export const buildSystemPrompt = (basePrompt: string, options: SystemPromptOptions): string => {
  if (options.systemPrompt) {
    return options.systemPrompt;
  }
  if (options.lang) {
    return `${basePrompt}\n- IMPORTANT: Write the answer in ${getLanguageName(options.lang)}`;
  }
  return basePrompt;
};

// --- User Prompt Builders ---

/**
 * Build user prompt for a single-shot query
 */
export const buildQueryPrompt = (script: ExtendedMulmoScript, question: string): string => {
  const parts: string[] = [];
  parts.push(buildScriptContent(scriptToViewerData(script)));
  parts.push("---");
  parts.push("");
  parts.push(`Question: ${question}`);
  parts.push("");
  parts.push("Answer:");
  return parts.join("\n");
};

/**
 * Build user prompt with conversation history for interactive query
 */
export const buildInteractiveQueryPrompt = (script: ExtendedMulmoScript, question: string, history: ConversationMessage[]): string => {
  const parts: string[] = [];
  parts.push(buildScriptContent(scriptToViewerData(script)));
  parts.push("---");
  parts.push("");

  if (history.length > 0) {
    parts.push("Previous conversation:");
    history.forEach((msg) => {
      parts.push(msg.role === "user" ? `Q: ${msg.content}` : `A: ${msg.content}`);
    });
    parts.push("");
  }

  parts.push(`Current question: ${question}`);
  parts.push("");
  parts.push("Answer:");
  return parts.join("\n");
};

/**
 * Build user prompt for summarization
 */
export const buildSummarizePrompt = (script: ExtendedMulmoScript, options: { targetLengthChars?: number }): string => {
  const parts: string[] = [];
  parts.push(buildScriptContent(scriptToViewerData(script)));

  if (options.targetLengthChars) {
    parts.push(`Target summary length: approximately ${options.targetLengthChars} characters`);
  }

  parts.push("");
  parts.push("Based on the above content, explain the topic directly to the reader:");
  return parts.join("\n");
};
