import dotenv from "dotenv";
import { GraphAI, GraphAILogger } from "graphai";
import type { GraphData } from "graphai";
import * as vanillaAgents from "@graphai/vanilla";
import { openAIAgent } from "@graphai/openai_agent";
import { anthropicAgent } from "@graphai/anthropic_agent";
import { groqAgent } from "@graphai/groq_agent";
import { geminiAgent } from "@graphai/gemini_agent";

import type { ExtendedScript } from "../../types/index.js";
import type { SummarizeOptions, SummarizeResult } from "../../types/summarize.js";
import { summarizeOptionsSchema } from "../../types/summarize.js";
import { getProviderConfig, getProviderApiKey } from "./provider.js";
import { buildUserPrompt, getSystemPrompt } from "./prompts.js";
import { filterBySection, filterByTags } from "../filter.js";

dotenv.config({ quiet: true });

const agents = vanillaAgents.default ?? vanillaAgents;

/**
 * Create GraphAI graph for summarizing script
 */
const createSummarizeGraph = (agentName: string): GraphData => ({
  version: 0.5,
  nodes: {
    systemPrompt: {},
    userPrompt: {},
    model: {},
    temperature: {},
    maxTokens: {},

    llmCall: {
      agent: agentName,
      inputs: {
        system: ":systemPrompt",
        prompt: ":userPrompt",
        model: ":model",
        temperature: ":temperature",
        max_tokens: ":maxTokens",
      },
    },

    result: {
      isResult: true,
      agent: "copyAgent",
      inputs: {
        summary: ":llmCall.text",
      },
    },
  },
});

/**
 * Filter script based on options (section, tags)
 */
const filterScript = (script: ExtendedScript, options: SummarizeOptions): ExtendedScript => {
  const afterSection = options.section ? filterBySection(script, options.section) : script;
  const afterTags = options.tags && options.tags.length > 0 ? filterByTags(afterSection, options.tags) : afterSection;
  return afterTags;
};

/**
 * Main summarize function - generates a summary of the entire script
 */
export const summarizeScript = async (script: ExtendedScript, options: Partial<SummarizeOptions> = {}): Promise<SummarizeResult> => {
  // Validate and apply defaults
  const validatedOptions = summarizeOptionsSchema.parse(options);

  const providerConfig = getProviderConfig(validatedOptions.provider);
  const apiKey = getProviderApiKey(validatedOptions.provider);

  if (!apiKey) {
    throw new Error(`API key not found for provider "${validatedOptions.provider}". ` + `Please set the ${providerConfig.keyName} environment variable.`);
  }

  // Filter script if section/tags specified
  const filteredScript = filterScript(script, validatedOptions);

  const scriptTitle = script.title || "Untitled";

  if (filteredScript.beats.length === 0) {
    return {
      summary: "No content to summarize.",
      format: validatedOptions.format,
      scriptTitle,
      beatCount: 0,
    };
  }

  // Build GraphAI config
  const config: Record<string, { apiKey?: string }> = {
    openAIAgent: { apiKey: process.env.OPENAI_API_KEY },
    anthropicAgent: { apiKey: process.env.ANTHROPIC_API_KEY },
    groqAgent: { apiKey: process.env.GROQ_API_KEY },
    geminiAgent: { apiKey: process.env.GEMINI_API_KEY },
  };

  // Create GraphAI instance
  const graph = new GraphAI(
    createSummarizeGraph(providerConfig.agentName),
    {
      ...agents,
      openAIAgent,
      anthropicAgent,
      groqAgent,
      geminiAgent,
    },
    { config },
  );

  // Build prompts
  const systemPrompt = getSystemPrompt(validatedOptions);
  const userPrompt = buildUserPrompt(filteredScript, validatedOptions);

  if (validatedOptions.verbose) {
    GraphAILogger.info(`Summarizing script "${script.title}" with ${validatedOptions.provider}...`);
    GraphAILogger.info(`Beats: ${filteredScript.beats.length}, Format: ${validatedOptions.format}`);
  }

  // Inject values
  graph.injectValue("systemPrompt", systemPrompt);
  graph.injectValue("userPrompt", userPrompt);
  graph.injectValue("model", validatedOptions.model ?? providerConfig.defaultModel);
  graph.injectValue("temperature", validatedOptions.temperature ?? 0.7);
  graph.injectValue("maxTokens", validatedOptions.maxTokens ?? providerConfig.maxTokens ?? 2048);

  // Run graph
  const graphResult = await graph.run();

  // Extract summary from result node
  const resultNode = graphResult.result as { summary?: string } | undefined;
  const summary = resultNode?.summary || "";

  return {
    summary,
    format: validatedOptions.format,
    scriptTitle,
    beatCount: filteredScript.beats.length,
  };
};

// Re-export types
export type { SummarizeOptions, SummarizeResult, LLMProvider, SummarizeFormat } from "../../types/summarize.js";
export { summarizeOptionsSchema, llmProviderSchema, summarizeFormatSchema } from "../../types/summarize.js";
