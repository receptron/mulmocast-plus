import { GraphAILogger } from "graphai";
import { queryScript } from "../../core/ai/command/query/index.js";
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
}

/**
 * Query command handler - outputs answer to stdout
 */
export const queryCommand = async (scriptPath: string, question: string, options: QueryCommandOptions): Promise<void> => {
  try {
    const script = await loadScript(scriptPath);

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
