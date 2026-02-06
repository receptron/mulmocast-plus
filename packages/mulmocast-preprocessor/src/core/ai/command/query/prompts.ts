import type { QueryOptions, ConversationMessage } from "../../../../types/query.js";
import type { ExtendedScript } from "../../../../types/index.js";
import { getLanguageName, buildScriptContent } from "../../llm.js";

/**
 * Default system prompt for query
 */
export const DEFAULT_SYSTEM_PROMPT = `You are answering questions based on the content provided.
- Answer based ONLY on the information in the provided content
- If the answer cannot be found in the content, say so clearly
- Be concise and direct in your answers
- Do not make up information that is not in the content`;

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
export const buildUserPrompt = (script: ExtendedScript, question: string): string => {
  const parts: string[] = [];

  // Add common script content (title, language, sections with beats)
  parts.push(buildScriptContent(script));

  parts.push("---");
  parts.push("");
  parts.push(`Question: ${question}`);
  parts.push("");
  parts.push("Answer:");

  return parts.join("\n");
};

/**
 * Default system prompt for interactive query
 */
export const DEFAULT_INTERACTIVE_SYSTEM_PROMPT = `You are answering questions based on the content provided.
- Answer based ONLY on the information in the provided content
- If the answer cannot be found in the content, say so clearly
- Be concise and direct in your answers
- Do not make up information that is not in the content
- You may reference previous conversation when answering follow-up questions`;

/**
 * Get system prompt for interactive mode
 */
export const getInteractiveSystemPrompt = (options: QueryOptions): string => {
  if (options.systemPrompt) {
    return options.systemPrompt;
  }

  const basePrompt = DEFAULT_INTERACTIVE_SYSTEM_PROMPT;

  if (options.lang) {
    const langName = getLanguageName(options.lang);
    return `${basePrompt}\n- IMPORTANT: Write the answer in ${langName}`;
  }

  return basePrompt;
};

/**
 * Build user prompt with conversation history for interactive mode
 */
export const buildInteractiveUserPrompt = (script: ExtendedScript, question: string, history: ConversationMessage[]): string => {
  const parts: string[] = [];

  // Add common script content (title, language, sections with beats)
  parts.push(buildScriptContent(script));

  parts.push("---");
  parts.push("");

  // Add conversation history if exists
  if (history.length > 0) {
    parts.push("Previous conversation:");
    history.forEach((msg) => {
      if (msg.role === "user") {
        parts.push(`Q: ${msg.content}`);
      } else {
        parts.push(`A: ${msg.content}`);
      }
    });
    parts.push("");
  }

  parts.push(`Current question: ${question}`);
  parts.push("");
  parts.push("Answer:");

  return parts.join("\n");
};
