import type { ExtendedScript, Reference } from "../../../../types/index.js";
import type { QueryOptions, InteractiveQuerySession, ConversationMessage } from "../../../../types/query.js";
import { queryOptionsSchema } from "../../../../types/query.js";
import { executeLLM, filterScript, getLanguageName } from "../../llm.js";
import { buildInteractiveUserPrompt, getInteractiveSystemPrompt, DEFAULT_INTERACTIVE_SYSTEM_PROMPT_WITH_FETCH } from "./prompts.js";
import { fetchUrlContent, findMatchingReference, type FetchedContent } from "../../utils/fetcher.js";

/**
 * Create an interactive query session
 */
export const createInteractiveSession = (
  script: ExtendedScript,
  options: Partial<QueryOptions> = {},
): { session: InteractiveQuerySession; filteredScript: ExtendedScript; validatedOptions: QueryOptions } => {
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
  filteredScript: ExtendedScript,
  question: string,
  session: InteractiveQuerySession,
  options: QueryOptions,
): Promise<string> => {
  if (filteredScript.beats.length === 0) {
    return "No content available to answer the question.";
  }

  const systemPrompt = getInteractiveSystemPrompt(options);
  const userPrompt = buildInteractiveUserPrompt(filteredScript, question, session.history);

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
 * Parse suggested fetch URL from AI response
 */
export const parseSuggestedFetch = (response: string): string | null => {
  // Use bounded quantifier to prevent ReDoS
  const match = response.match(/\[SUGGEST_FETCH:\s*([^\]]{1,2000})\]/);
  return match ? match[1].trim() : null;
};

/**
 * Get available references from script
 */
export const getReferences = (script: ExtendedScript): Reference[] => {
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
export const findReference = (script: ExtendedScript, query: string): Reference | null => {
  const references = getReferences(script);
  return findMatchingReference(references, query);
};

/**
 * Send a question with fetched reference content
 */
export const sendInteractiveQueryWithFetch = async (
  filteredScript: ExtendedScript,
  question: string,
  fetchedContent: FetchedContent,
  session: InteractiveQuerySession,
  options: QueryOptions,
): Promise<string> => {
  if (filteredScript.beats.length === 0) {
    return "No content available to answer the question.";
  }

  // Build system prompt for fetched content mode
  let systemPrompt = DEFAULT_INTERACTIVE_SYSTEM_PROMPT_WITH_FETCH;
  if (options.lang) {
    const langName = getLanguageName(options.lang);
    systemPrompt = `${systemPrompt}\n- IMPORTANT: Write the answer in ${langName}`;
  }

  // Build user prompt with fetched content
  const baseUserPrompt = buildInteractiveUserPrompt(filteredScript, question, session.history);

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
