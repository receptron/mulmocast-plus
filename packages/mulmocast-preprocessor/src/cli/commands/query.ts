import { createInterface } from "node:readline";
import { GraphAILogger } from "graphai";
import { queryScript } from "../../core/ai/command/query/index.js";
import { createInteractiveSession, sendInteractiveQuery, clearHistory } from "../../core/ai/command/query/interactive.js";
import { loadScript } from "../utils.js";
import type { LLMProvider } from "../../types/summarize.js";

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

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  GraphAILogger.info(`Interactive query mode for "${session.scriptTitle}" (${session.beatCount} beats)`);
  GraphAILogger.info("Commands: /clear (clear history), /history (show history), /exit or Ctrl+C (quit)");
  GraphAILogger.info("");

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

      // Send query
      try {
        const answer = await sendInteractiveQuery(filteredScript, trimmedInput, session, validatedOptions);
        GraphAILogger.info(`\nAssistant: ${answer}\n`);
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
