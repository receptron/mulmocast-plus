import type { ExtendedMulmoScript, Reference } from "@mulmocast/extended-types";
import type { QueryOptions, InteractiveQuerySession, ConversationMessage } from "../../../../types/query.js";
import { queryOptionsSchema } from "../../../../types/query.js";
import { executeLLM } from "../../llm.js";
import {
  filterScript,
  buildInteractiveQueryPrompt,
  buildSystemPrompt,
  DEFAULT_INTERACTIVE_SYSTEM_PROMPT,
  DEFAULT_INTERACTIVE_SYSTEM_PROMPT_WITH_FETCH,
} from "@mulmocast/script-utils";
import { fetchUrlContent, findMatchingReference, type FetchedContent } from "../../utils/fetcher.js";

/**
 * Create an interactive query session
 */
export const createInteractiveSession = (
  script: ExtendedMulmoScript,
  options: Partial<QueryOptions> = {},
): { session: InteractiveQuerySession; filteredScript: ExtendedMulmoScript; validatedOptions: QueryOptions } => {
  const validatedOptions = queryOptionsSchema.parse(options);
  const filteredScript = filterScript(script, validatedOptions);
  const scriptTitle = script.title || "Untitled";

  const session: InteractiveQuerySession = {
    scriptTitle,
    beatCount: filteredScript.beats.length,
    history: [],
  };

  return { session, filteredScript, validatedOptions };
};

/**
 * Send a question in an interactive session
 */
export const sendInteractiveQuery = async (
  filteredScript: ExtendedMulmoScript,
  question: string,
  session: InteractiveQuerySession,
  options: QueryOptions,
): Promise<string> => {
  if (filteredScript.beats.length === 0) {
    return "No content available to answer the question.";
  }

  const systemPrompt = buildSystemPrompt(DEFAULT_INTERACTIVE_SYSTEM_PROMPT, options);
  const userPrompt = buildInteractiveQueryPrompt(filteredScript, question, session.history);

  const answer = await executeLLM(systemPrompt, userPrompt, options, options.verbose ? `Interactive query: ${question}` : undefined);

  // Add to history
  session.history.push({ role: "user", content: question });
  session.history.push({ role: "assistant", content: answer });

  return answer;
};

/**
 * Clear conversation history
 */
export const clearHistory = (session: InteractiveQuerySession): void => {
  session.history = [];
};

/**
 * Get conversation history
 */
export const getHistory = (session: InteractiveQuerySession): ConversationMessage[] => {
  return [...session.history];
};

/**
 * Regex pattern for SUGGEST_FETCH marker (bounded quantifier to prevent ReDoS)
 */
export const SUGGEST_FETCH_PATTERN = /\[SUGGEST_FETCH:\s*([^\]]{1,2000})\]/;
export const SUGGEST_FETCH_PATTERN_GLOBAL = /\[SUGGEST_FETCH:\s*[^\]]{1,2000}\]/g;

/**
 * Parse suggested fetch URL from AI response
 */
export const parseSuggestedFetch = (response: string): string | null => {
  const match = response.match(SUGGEST_FETCH_PATTERN);
  return match ? match[1].trim() : null;
};

/**
 * Remove SUGGEST_FETCH markers from response
 */
export const removeSuggestFetchMarkers = (response: string): string => {
  return response.replace(SUGGEST_FETCH_PATTERN_GLOBAL, "").trim();
};

/**
 * Get available references from script
 */
export const getReferences = (script: ExtendedMulmoScript): Reference[] => {
  return script.scriptMeta?.references || [];
};

/**
 * Fetch reference content by URL
 */
export const fetchReference = async (url: string, verbose = false): Promise<FetchedContent> => {
  return fetchUrlContent(url, 8000, verbose);
};

/**
 * Find matching reference for a query
 */
export const findReference = (script: ExtendedMulmoScript, query: string): Reference | null => {
  const references = getReferences(script);
  return findMatchingReference(references, query);
};

/**
 * Send a question with fetched reference content
 */
export const sendInteractiveQueryWithFetch = async (
  filteredScript: ExtendedMulmoScript,
  question: string,
  fetchedContent: FetchedContent,
  session: InteractiveQuerySession,
  options: QueryOptions,
): Promise<string> => {
  if (filteredScript.beats.length === 0) {
    return "No content available to answer the question.";
  }

  // Build system prompt for fetched content mode
  const systemPrompt = buildSystemPrompt(DEFAULT_INTERACTIVE_SYSTEM_PROMPT_WITH_FETCH, options);

  // Build user prompt with fetched content
  const baseUserPrompt = buildInteractiveQueryPrompt(filteredScript, question, session.history);

  // Insert fetched content before the question
  const fetchedSection = [
    "",
    "---",
    "Additional reference content fetched from URL:",
    `URL: ${fetchedContent.url}`,
    fetchedContent.title ? `Title: ${fetchedContent.title}` : "",
    "",
    fetchedContent.content,
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  // Insert before "Current question:" or at the end
  const insertPoint = baseUserPrompt.indexOf("Current question:");
  const userPrompt =
    insertPoint >= 0 ? baseUserPrompt.slice(0, insertPoint) + fetchedSection + baseUserPrompt.slice(insertPoint) : baseUserPrompt + fetchedSection;

  const answer = await executeLLM(systemPrompt, userPrompt, options, options.verbose ? `Interactive query with fetch: ${question}` : undefined);

  // Add to history (include note about fetched content)
  session.history.push({ role: "user", content: `${question} (with reference: ${fetchedContent.url})` });
  session.history.push({ role: "assistant", content: answer });

  return answer;
};
