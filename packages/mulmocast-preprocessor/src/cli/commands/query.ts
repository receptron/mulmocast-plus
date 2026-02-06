import { createInterface } from "node:readline";
import { GraphAILogger } from "graphai";
import { queryScript } from "../../core/ai/command/query/index.js";
import {
  createInteractiveSession,
  sendInteractiveQuery,
  sendInteractiveQueryWithFetch,
  clearHistory,
  getReferences,
  fetchReference,
  parseSuggestedFetch,
} from "../../core/ai/command/query/interactive.js";
import { loadScript } from "../utils.js";
import type { LLMProvider } from "../../types/summarize.js";
import type { Reference } from "../../types/index.js";

interface QueryCommandOptions {
  provider?: LLMProvider;
  model?: string;
  lang?: string;
  systemPrompt?: string;
  verbose?: boolean;
  section?: string;
  tags?: string[];
  interactive?: boolean;
}

/**
 * Query command handler - outputs answer to stdout
 */
export const queryCommand = async (scriptPath: string, question: string | undefined, options: QueryCommandOptions): Promise<void> => {
  try {
    const script = await loadScript(scriptPath);

    // Interactive mode
    if (options.interactive || question === undefined) {
      await runInteractiveMode(scriptPath, script, options);
      return;
    }

    // Single query mode
    const result = await queryScript(script, question, {
      provider: options.provider ?? "openai",
      model: options.model,
      lang: options.lang,
      systemPrompt: options.systemPrompt,
      verbose: options.verbose ?? false,
      section: options.section,
      tags: options.tags,
    });

    // Output answer to stdout
    process.stdout.write(result.answer + "\n");
  } catch (error) {
    if (error instanceof Error) {
      GraphAILogger.error(`Error: ${error.message}`);
    } else {
      GraphAILogger.error("Unknown error occurred");
    }
    process.exit(1);
  }
};

/**
 * Format references for display
 */
const formatReferences = (references: Reference[]): string => {
  return references.map((ref, i) => `  ${i + 1}. [${ref.type || "web"}] ${ref.title || ref.url}`).join("\n");
};

/**
 * Run interactive query mode
 */
const runInteractiveMode = async (scriptPath: string, script: Awaited<ReturnType<typeof loadScript>>, options: QueryCommandOptions): Promise<void> => {
  const { session, filteredScript, validatedOptions } = createInteractiveSession(script, {
    provider: options.provider ?? "openai",
    model: options.model,
    lang: options.lang,
    systemPrompt: options.systemPrompt,
    verbose: options.verbose ?? false,
    section: options.section,
    tags: options.tags,
  });

  if (filteredScript.beats.length === 0) {
    GraphAILogger.error("No content available to query.");
    process.exit(1);
  }

  const references = getReferences(script);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  GraphAILogger.info(`Interactive query mode for "${session.scriptTitle}" (${session.beatCount} beats)`);
  GraphAILogger.info("Commands: /clear (clear history), /history (show history), /refs (show references), /fetch <url> (fetch URL), /exit (quit)");
  if (references.length > 0) {
    GraphAILogger.info(`Available references: ${references.length}`);
  }
  GraphAILogger.info("");

  let lastSuggestedUrl: string | null = null;

  const prompt = (): void => {
    rl.question("You: ", async (input) => {
      const trimmedInput = input.trim();

      if (!trimmedInput) {
        prompt();
        return;
      }

      // Handle commands
      if (trimmedInput === "/exit" || trimmedInput === "/quit") {
        GraphAILogger.info("Goodbye!");
        rl.close();
        return;
      }

      if (trimmedInput === "/clear") {
        clearHistory(session);
        lastSuggestedUrl = null;
        GraphAILogger.info("Conversation history cleared.\n");
        prompt();
        return;
      }

      if (trimmedInput === "/history") {
        if (session.history.length === 0) {
          GraphAILogger.info("No conversation history.\n");
        } else {
          GraphAILogger.info("Conversation history:");
          session.history.forEach((msg) => {
            const prefix = msg.role === "user" ? "Q" : "A";
            GraphAILogger.info(`${prefix}: ${msg.content}`);
          });
          GraphAILogger.info("");
        }
        prompt();
        return;
      }

      if (trimmedInput === "/refs" || trimmedInput === "/references") {
        if (references.length === 0) {
          GraphAILogger.info("No references available.\n");
        } else {
          GraphAILogger.info("Available references:");
          GraphAILogger.info(formatReferences(references));
          GraphAILogger.info("");
        }
        prompt();
        return;
      }

      // Handle /fetch command
      if (trimmedInput.startsWith("/fetch")) {
        const urlArg = trimmedInput.replace(/^\/fetch\s*/, "").trim();
        const urlToFetch = urlArg || lastSuggestedUrl;

        if (!urlToFetch) {
          GraphAILogger.info("Usage: /fetch <url> or /fetch (to fetch last suggested URL)\n");
          prompt();
          return;
        }

        GraphAILogger.info(`Fetching: ${urlToFetch}...`);
        try {
          const fetchedContent = await fetchReference(urlToFetch, validatedOptions.verbose);
          if (fetchedContent.error) {
            GraphAILogger.error(`Fetch error: ${fetchedContent.error}\n`);
          } else {
            GraphAILogger.info(`Fetched ${fetchedContent.content.length} chars from ${fetchedContent.title || urlToFetch}`);
            GraphAILogger.info("Content loaded. Ask a question to use this reference.\n");

            // Store for next query
            session.fetchedContent = fetchedContent;
          }
        } catch (error) {
          if (error instanceof Error) {
            GraphAILogger.error(`Fetch error: ${error.message}\n`);
          } else {
            GraphAILogger.error("Unknown fetch error\n");
          }
        }
        prompt();
        return;
      }

      // Send query
      try {
        let answer: string;

        // If we have fetched content, use it
        if (session.fetchedContent) {
          answer = await sendInteractiveQueryWithFetch(filteredScript, trimmedInput, session.fetchedContent, session, validatedOptions);
          // Clear fetched content after use
          session.fetchedContent = undefined;
        } else {
          answer = await sendInteractiveQuery(filteredScript, trimmedInput, session, validatedOptions);
        }

        // Check for suggested fetch URL
        const suggestedUrl = parseSuggestedFetch(answer);
        if (suggestedUrl) {
          lastSuggestedUrl = suggestedUrl;
          // Remove the suggestion marker from displayed answer (bounded quantifier to prevent ReDoS)
          const cleanAnswer = answer.replace(/\[SUGGEST_FETCH:\s*[^\]]{1,2000}\]/g, "").trim();
          GraphAILogger.info(`\nAssistant: ${cleanAnswer}`);
          GraphAILogger.info(`\n(Suggested reference: ${suggestedUrl})`);
          GraphAILogger.info("Type /fetch to load this reference for more details.\n");
        } else {
          GraphAILogger.info(`\nAssistant: ${answer}\n`);
        }
      } catch (error) {
        if (error instanceof Error) {
          GraphAILogger.error(`Error: ${error.message}\n`);
        } else {
          GraphAILogger.error("Unknown error occurred\n");
        }
      }

      prompt();
    });
  };

  // Handle Ctrl+C
  rl.on("close", () => {
    process.exit(0);
  });

  prompt();
};
