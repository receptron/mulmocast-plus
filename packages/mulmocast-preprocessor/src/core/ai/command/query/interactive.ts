import type { ExtendedScript } from "../../../../types/index.js";
import type { QueryOptions, InteractiveQuerySession, ConversationMessage } from "../../../../types/query.js";
import { queryOptionsSchema } from "../../../../types/query.js";
import { executeLLM, filterScript } from "../../llm.js";
import { buildInteractiveUserPrompt, getInteractiveSystemPrompt } from "./prompts.js";

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
