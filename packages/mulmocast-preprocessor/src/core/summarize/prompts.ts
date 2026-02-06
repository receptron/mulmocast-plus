import type { SummarizeOptions } from "../../types/summarize.js";
import type { ExtendedScript } from "../../types/index.js";

/**
 * Default system prompt for text summary
 */
export const DEFAULT_SYSTEM_PROMPT_TEXT = `You are summarizing a presentation/podcast script.
- Read all the content and create a concise summary
- Capture the main topic, key points, and conclusion
- Write in a clear, informative style
- Output plain text only`;

/**
 * Default system prompt for markdown summary
 */
export const DEFAULT_SYSTEM_PROMPT_MARKDOWN = `You are summarizing a presentation/podcast script.
- Read all the content and create a structured summary
- Include: title, overview, key points, and conclusion
- Use markdown formatting (headers, bullet points, etc.)
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
  parts.push("Please summarize this script:");

  return parts.join("\n");
};

/**
 * Get system prompt based on format
 */
export const getSystemPrompt = (options: SummarizeOptions): string => {
  if (options.systemPrompt) {
    return options.systemPrompt;
  }
  return options.format === "markdown" ? DEFAULT_SYSTEM_PROMPT_MARKDOWN : DEFAULT_SYSTEM_PROMPT_TEXT;
};
