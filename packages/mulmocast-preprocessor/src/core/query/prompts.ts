import type { QueryOptions } from "../../types/query.js";
import type { ExtendedScript } from "../../types/index.js";

/**
 * Default system prompt for query
 */
export const DEFAULT_SYSTEM_PROMPT = `You are answering questions based on the content provided.
- Answer based ONLY on the information in the provided content
- If the answer cannot be found in the content, say so clearly
- Be concise and direct in your answers
- Do not make up information that is not in the content`;

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
 * Get system prompt based on options
 */
export const getSystemPrompt = (options: QueryOptions): string => {
  if (options.systemPrompt) {
    return options.systemPrompt;
  }

  const basePrompt = DEFAULT_SYSTEM_PROMPT;

  // Add language instruction if specified
  if (options.lang) {
    const langName = getLanguageName(options.lang);
    return `${basePrompt}\n- IMPORTANT: Write the answer in ${langName}`;
  }

  return basePrompt;
};

/**
 * Build user prompt from script and question
 */
export const buildUserPrompt = (script: ExtendedScript, question: string, __options: QueryOptions): string => {
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

  parts.push("");
  parts.push("---");
  parts.push("");
  parts.push(`Question: ${question}`);
  parts.push("");
  parts.push("Answer:");

  return parts.join("\n");
};
