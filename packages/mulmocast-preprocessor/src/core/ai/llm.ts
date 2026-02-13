import dotenv from "dotenv";
import { GraphAI, GraphAILogger } from "graphai";
import type { GraphData } from "graphai";
import * as vanillaAgents from "@graphai/vanilla";
import { openAIAgent } from "@graphai/openai_agent";
import { anthropicAgent } from "@graphai/anthropic_agent";
import { groqAgent } from "@graphai/groq_agent";
import { geminiAgent } from "@graphai/gemini_agent";

import type { LLMProvider } from "../../types/summarize.js";

dotenv.config({ quiet: true });

const agents = vanillaAgents.default ?? vanillaAgents;

/**
 * Base options for LLM operations
 */
export interface BaseLLMOptions {
  provider: LLMProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  lang?: string;
  systemPrompt?: string;
  verbose?: boolean;
  section?: string;
  tags?: string[];
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  agentName: string;
  defaultModel: string;
  keyName: string;
  maxTokens?: number;
}

const provider2Agent: Record<LLMProvider, ProviderConfig> = {
  openai: {
    agentName: "openAIAgent",
    defaultModel: "gpt-4o-mini",
    keyName: "OPENAI_API_KEY",
    maxTokens: 4096,
  },
  anthropic: {
    agentName: "anthropicAgent",
    defaultModel: "claude-sonnet-4-20250514",
    keyName: "ANTHROPIC_API_KEY",
    maxTokens: 4096,
  },
  groq: {
    agentName: "groqAgent",
    defaultModel: "llama-3.1-8b-instant",
    keyName: "GROQ_API_KEY",
    maxTokens: 4096,
  },
  gemini: {
    agentName: "geminiAgent",
    defaultModel: "gemini-2.0-flash",
    keyName: "GEMINI_API_KEY",
    maxTokens: 4096,
  },
};

/**
 * Get provider configuration
 */
export const getProviderConfig = (provider: LLMProvider): ProviderConfig => {
  return provider2Agent[provider];
};

/**
 * Get API key for provider
 */
export const getProviderApiKey = (provider: LLMProvider): string | undefined => {
  const config = provider2Agent[provider];
  return process.env[config.keyName];
};

/**
 * Create GraphAI graph for LLM call
 */
const createLLMGraph = (agentName: string): GraphData => ({
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
        text: ":llmCall.text",
      },
    },
  },
});

/**
 * Execute LLM call with GraphAI
 */
export const executeLLM = async (systemPrompt: string, userPrompt: string, options: BaseLLMOptions, verboseMessage?: string): Promise<string> => {
  const providerConfig = getProviderConfig(options.provider);
  const apiKey = getProviderApiKey(options.provider);

  if (!apiKey) {
    throw new Error(`API key not found for provider "${options.provider}". Please set the ${providerConfig.keyName} environment variable.`);
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
    createLLMGraph(providerConfig.agentName),
    {
      ...agents,
      openAIAgent,
      anthropicAgent,
      groqAgent,
      geminiAgent,
    },
    { config },
  );

  if (options.verbose && verboseMessage) {
    GraphAILogger.info(verboseMessage);
  }

  // Inject values
  graph.injectValue("systemPrompt", systemPrompt);
  graph.injectValue("userPrompt", userPrompt);
  graph.injectValue("model", options.model ?? providerConfig.defaultModel);
  graph.injectValue("temperature", options.temperature ?? 0.7);
  graph.injectValue("maxTokens", options.maxTokens ?? providerConfig.maxTokens ?? 2048);

  // Run graph
  const graphResult = await graph.run();

  // Extract text from result node
  const resultNode = graphResult.result as { text?: string } | undefined;
  return resultNode?.text || "";
};
