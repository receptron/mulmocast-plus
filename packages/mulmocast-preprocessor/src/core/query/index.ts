import dotenv from "dotenv";
import { GraphAI, GraphAILogger } from "graphai";
import type { GraphData } from "graphai";
import * as vanillaAgents from "@graphai/vanilla";
import { openAIAgent } from "@graphai/openai_agent";
import { anthropicAgent } from "@graphai/anthropic_agent";
import { groqAgent } from "@graphai/groq_agent";
import { geminiAgent } from "@graphai/gemini_agent";

import type { ExtendedScript } from "../../types/index.js";
import type { QueryOptions, QueryResult } from "../../types/query.js";
import { queryOptionsSchema } from "../../types/query.js";
import { getProviderConfig, getProviderApiKey } from "../summarize/provider.js";
import { buildUserPrompt, getSystemPrompt } from "./prompts.js";
import { filterBySection, filterByTags } from "../filter.js";

dotenv.config({ quiet: true });

const agents = vanillaAgents.default ?? vanillaAgents;

/**
 * Create GraphAI graph for querying script
 */
const createQueryGraph = (agentName: string): GraphData => ({
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
        answer: ":llmCall.text",
      },
    },
  },
});

/**
 * Filter script based on options (section, tags)
 */
const filterScript = (script: ExtendedScript, options: QueryOptions): ExtendedScript => {
  const afterSection = options.section ? filterBySection(script, options.section) : script;
  const afterTags = options.tags && options.tags.length > 0 ? filterByTags(afterSection, options.tags) : afterSection;
  return afterTags;
};

/**
 * Main query function - answers a question based on script content
 */
export const queryScript = async (script: ExtendedScript, question: string, options: Partial<QueryOptions> = {}): Promise<QueryResult> => {
  // Validate and apply defaults
  const validatedOptions = queryOptionsSchema.parse(options);

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
      answer: "No content available to answer the question.",
      question,
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
    createQueryGraph(providerConfig.agentName),
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
  const userPrompt = buildUserPrompt(filteredScript, question, validatedOptions);

  if (validatedOptions.verbose) {
    GraphAILogger.info(`Querying script "${script.title}" with ${validatedOptions.provider}...`);
    GraphAILogger.info(`Beats: ${filteredScript.beats.length}, Question: ${question}`);
  }

  // Inject values
  graph.injectValue("systemPrompt", systemPrompt);
  graph.injectValue("userPrompt", userPrompt);
  graph.injectValue("model", validatedOptions.model ?? providerConfig.defaultModel);
  graph.injectValue("temperature", validatedOptions.temperature ?? 0.7);
  graph.injectValue("maxTokens", validatedOptions.maxTokens ?? providerConfig.maxTokens ?? 2048);

  // Run graph
  const graphResult = await graph.run();

  // Extract answer from result node
  const resultNode = graphResult.result as { answer?: string } | undefined;
  const answer = resultNode?.answer || "";

  return {
    answer,
    question,
    scriptTitle,
    beatCount: filteredScript.beats.length,
  };
};

// Re-export types
export type { QueryOptions, QueryResult } from "../../types/query.js";
export { queryOptionsSchema } from "../../types/query.js";
