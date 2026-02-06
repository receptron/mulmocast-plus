import type { SummarizeOptions } from "../../types/summarize.js";
import type { ExtendedScript } from "../../types/index.js";

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

  // Add script metadata
  parts.push(`# Script: ${script.title}`);
  parts.push(`Language: ${script.lang}`);
  parts.push("");

  // Collect all text from beats
  const sections = new Map<string, string[]>();

  script.beats.forEach((beat, index) => {
    const text = beat.text || "";
    if (!text.trim()) return;

    const section = beat.meta?.section || "main";
    if (!sections.has(section)) {
      sections.set(section, []);
    }
    sections.get(section)!.push(`[${index}] ${text}`);
  });

  // Output by section
  sections.forEach((texts, section) => {
    parts.push(`## Section: ${section}`);
    texts.forEach((t) => parts.push(t));
    parts.push("");
  });

  // Add target length if specified
  if (options.targetLengthChars) {
    parts.push(`Target summary length: approximately ${options.targetLengthChars} characters`);
  }

  parts.push("");
  parts.push("Based on the above content, explain the topic directly to the reader:");

  return parts.join("\n");
};

/**
 * Get language name from code
 */
const getLanguageName = (langCode: string): string => {
  const langMap: Record<string, string> = {
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
  return langMap[langCode] || langCode;
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
