import { GraphAILogger } from "graphai";
import { summarizeScript } from "../../core/summarize/index.js";
import { loadScript } from "../utils.js";
import type { LLMProvider, SummarizeFormat } from "../../types/summarize.js";

interface SummarizeCommandOptions {
  provider?: LLMProvider;
  model?: string;
  format?: SummarizeFormat;
  lang?: string;
  targetLength?: number;
  systemPrompt?: string;
  verbose?: boolean;
  section?: string;
  tags?: string[];
}

/**
 * Summarize command handler - outputs summary to stdout
 */
export const summarizeCommand = async (scriptPath: string, options: SummarizeCommandOptions): Promise<void> => {
  try {
    const script = await loadScript(scriptPath);

    const result = await summarizeScript(script, {
      provider: options.provider ?? "openai",
      model: options.model,
      format: options.format ?? "text",
      lang: options.lang,
      targetLengthChars: options.targetLength,
      systemPrompt: options.systemPrompt,
      verbose: options.verbose ?? false,
      section: options.section,
      tags: options.tags,
    });

    // Output summary to stdout
    process.stdout.write(result.summary + "\n");
  } catch (error) {
    if (error instanceof Error) {
      GraphAILogger.error(`Error: ${error.message}`);
    } else {
      GraphAILogger.error("Unknown error occurred");
    }
    process.exit(1);
  }
};
