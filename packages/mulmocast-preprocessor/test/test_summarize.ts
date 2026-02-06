import { describe, it } from "node:test";
import assert from "node:assert";
import { buildUserPrompt, getSystemPrompt, DEFAULT_SYSTEM_PROMPT_TEXT, DEFAULT_SYSTEM_PROMPT_MARKDOWN } from "../src/core/ai/command/summarize/prompts.js";
import { getProviderConfig } from "../src/core/ai/llm.js";
import type { ExtendedScript } from "../src/index.js";
import type { SummarizeOptions } from "../src/types/summarize.js";

const createTestOptions = (overrides?: Partial<SummarizeOptions>): SummarizeOptions => ({
  provider: "openai",
  format: "text",
  verbose: false,
  ...overrides,
});

const createTestScript = (): ExtendedScript => ({
  $mulmocast: { version: "1.1" },
  title: "Test Script",
  lang: "en",
  speechParams: {
    speakers: {
      Host: {
        voiceId: "shimmer",
        displayName: { en: "Host" },
      },
    },
  },
  beats: [
    {
      id: "beat1",
      speaker: "Host",
      text: "This is the first beat with a long explanation that could be shortened.",
      meta: {
        tags: ["intro"],
        section: "opening",
      },
    },
    {
      id: "beat2",
      speaker: "Host",
      text: "This is a detailed technical explanation that goes into depth.",
      meta: {
        tags: ["detail", "technical"],
        section: "chapter1",
      },
    },
    {
      id: "beat3",
      speaker: "Host",
      text: "Final conclusion wrapping up everything.",
      meta: {
        tags: ["conclusion"],
        section: "closing",
      },
    },
  ],
});

describe("buildUserPrompt", () => {
  it("should include script title and language", () => {
    const script = createTestScript();
    const options = createTestOptions();
    const prompt = buildUserPrompt(script, options);

    assert.ok(prompt.includes("# Script: Test Script"));
    assert.ok(prompt.includes("Language: en"));
  });

  it("should include all beat texts grouped by section", () => {
    const script = createTestScript();
    const options = createTestOptions();
    const prompt = buildUserPrompt(script, options);

    assert.ok(prompt.includes("## Section: opening"));
    assert.ok(prompt.includes("## Section: chapter1"));
    assert.ok(prompt.includes("## Section: closing"));
    assert.ok(prompt.includes("first beat"));
    assert.ok(prompt.includes("technical explanation"));
    assert.ok(prompt.includes("conclusion"));
  });

  it("should include target length when specified", () => {
    const script = createTestScript();
    const options = createTestOptions({ targetLengthChars: 200 });
    const prompt = buildUserPrompt(script, options);

    assert.ok(prompt.includes("Target summary length: approximately 200 characters"));
  });
});

describe("getSystemPrompt", () => {
  it("should return text prompt for text format", () => {
    const options = createTestOptions({ format: "text" });
    const prompt = getSystemPrompt(options);

    assert.strictEqual(prompt, DEFAULT_SYSTEM_PROMPT_TEXT);
    assert.ok(prompt.includes("plain text"));
  });

  it("should return markdown prompt for markdown format", () => {
    const options = createTestOptions({ format: "markdown" });
    const prompt = getSystemPrompt(options);

    assert.strictEqual(prompt, DEFAULT_SYSTEM_PROMPT_MARKDOWN);
    assert.ok(prompt.includes("markdown"));
  });

  it("should use custom system prompt when provided", () => {
    const customPrompt = "Custom summarization instruction";
    const options = createTestOptions({ systemPrompt: customPrompt });
    const prompt = getSystemPrompt(options);

    assert.strictEqual(prompt, customPrompt);
  });
});

describe("getProviderConfig", () => {
  it("should return correct config for openai", () => {
    const config = getProviderConfig("openai");
    assert.strictEqual(config.agentName, "openAIAgent");
    assert.strictEqual(config.keyName, "OPENAI_API_KEY");
    assert.ok(config.defaultModel);
  });

  it("should return correct config for anthropic", () => {
    const config = getProviderConfig("anthropic");
    assert.strictEqual(config.agentName, "anthropicAgent");
    assert.strictEqual(config.keyName, "ANTHROPIC_API_KEY");
    assert.ok(config.defaultModel);
  });

  it("should return correct config for groq", () => {
    const config = getProviderConfig("groq");
    assert.strictEqual(config.agentName, "groqAgent");
    assert.strictEqual(config.keyName, "GROQ_API_KEY");
    assert.ok(config.defaultModel);
  });

  it("should return correct config for gemini", () => {
    const config = getProviderConfig("gemini");
    assert.strictEqual(config.agentName, "geminiAgent");
    assert.strictEqual(config.keyName, "GEMINI_API_KEY");
    assert.ok(config.defaultModel);
  });
});
