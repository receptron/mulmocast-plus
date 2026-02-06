import { readFileSync } from "fs";
import { GraphAILogger } from "graphai";
import { queryScript } from "../../core/query/index.js";
import type { ExtendedScript } from "../../types/index.js";
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
 * Check if input is a URL
 */
const isUrl = (input: string): boolean => {
  return input.startsWith("http://") || input.startsWith("https://");
};

/**
 * Fetch JSON from URL with timeout
 */
const fetchJson = async (url: string): Promise<ExtendedScript> => {
  const controller = new AbortController();
  const timeout_ms = 30000;
  const timeoutId = setTimeout(() => controller.abort(), timeout_ms);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as ExtendedScript;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Load script from file path or URL
 */
const loadScript = async (input: string): Promise<ExtendedScript> => {
  if (isUrl(input)) {
    return fetchJson(input);
  }
  const content = readFileSync(input, "utf-8");
  return JSON.parse(content) as ExtendedScript;
};

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
