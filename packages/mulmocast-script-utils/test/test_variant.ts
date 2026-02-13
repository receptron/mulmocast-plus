import { describe, it } from "node:test";
import assert from "node:assert";
import { applyProfile, listProfiles, processScript, filterBySection, filterByTags, stripExtendedFields } from "../src/index.js";
import type { ExtendedMulmoScript } from "@mulmocast/extended-types";
import { mulmoScriptSchema } from "@mulmocast/types";

const createTestScript = (): ExtendedMulmoScript => ({
  $mulmocast: { version: "1.1" },
  title: "Test Script",
  lang: "ja",
  speechParams: {
    speakers: {
      Host: {
        voiceId: "shimmer",
        displayName: { ja: "ホスト" },
      },
    },
  },
  outputProfiles: {
    summary: {
      name: "要約版",
      description: "短縮版",
    },
    teaser: {
      name: "ティーザー",
      description: "SNS用",
    },
  },
  scriptMeta: {
    audience: "テスト対象者",
    background: "テスト用の背景情報",
    keywords: ["GraphAI", "テスト"],
    faq: [{ question: "テスト？", answer: "はい" }],
    references: [{ type: "web" as const, url: "https://example.com", title: "Example" }],
  },
  beats: [
    {
      id: "intro",
      speaker: "Host",
      text: "今日はGraphAIについて詳しくお話しします",
      variants: {
        summary: { text: "GraphAIの概要を説明します" },
        teaser: { text: "GraphAI紹介！" },
      },
      meta: {
        tags: ["intro"],
        section: "opening",
        context: "GraphAIはreceptron社が開発したフレームワーク",
        keywords: ["GraphAI", "オーケストレーション"],
        expectedQuestions: ["GraphAIとは？"],
      },
    },
    {
      id: "detail",
      speaker: "Host",
      text: "詳細な説明です...",
      variants: {
        summary: { skip: true },
        teaser: { skip: true },
      },
      meta: {
        tags: ["detail", "technical"],
        section: "chapter1",
      },
    },
    {
      id: "conclusion",
      speaker: "Host",
      text: "以上がGraphAIでした",
      variants: {
        summary: { text: "GraphAIをお試しください" },
        teaser: { text: "今すぐ試そう！" },
      },
      meta: {
        tags: ["conclusion"],
        section: "closing",
      },
    },
  ],
});

describe("applyProfile", () => {
  it("should apply summary profile", () => {
    const script = createTestScript();
    const result = applyProfile(script, "summary");

    assert.strictEqual(result.beats.length, 2);
    assert.strictEqual(result.beats[0].text, "GraphAIの概要を説明します");
    assert.strictEqual(result.beats[1].text, "GraphAIをお試しください");
  });

  it("should apply teaser profile", () => {
    const script = createTestScript();
    const result = applyProfile(script, "teaser");

    assert.strictEqual(result.beats.length, 2);
    assert.strictEqual(result.beats[0].text, "GraphAI紹介！");
    assert.strictEqual(result.beats[1].text, "今すぐ試そう！");
  });

  it("should keep original text for unknown profile", () => {
    const script = createTestScript();
    const result = applyProfile(script, "unknown");

    assert.strictEqual(result.beats.length, 3);
    assert.strictEqual(result.beats[0].text, "今日はGraphAIについて詳しくお話しします");
  });

  it("should remove variants and meta from output", () => {
    const script = createTestScript();
    const result = applyProfile(script, "summary");

    assert.strictEqual((result.beats[0] as Record<string, unknown>).variants, undefined);
    assert.strictEqual((result.beats[0] as Record<string, unknown>).meta, undefined);
  });
});

describe("listProfiles", () => {
  it("should list all profiles", () => {
    const script = createTestScript();
    const profiles = listProfiles(script);

    assert.strictEqual(profiles.length, 3);

    const defaultProfile = profiles.find((p) => p.name === "default");
    assert.ok(defaultProfile);
    assert.strictEqual(defaultProfile.beatCount, 3);
    assert.strictEqual(defaultProfile.skippedCount, 0);

    const summaryProfile = profiles.find((p) => p.name === "summary");
    assert.ok(summaryProfile);
    assert.strictEqual(summaryProfile.displayName, "要約版");
    assert.strictEqual(summaryProfile.beatCount, 2);
    assert.strictEqual(summaryProfile.skippedCount, 1);
  });
});

describe("processScript", () => {
  it("should process with profile option", () => {
    const script = createTestScript();
    const result = processScript(script, { profile: "summary" });

    assert.strictEqual(result.beats.length, 2);
  });

  it("should return all beats with default profile", () => {
    const script = createTestScript();
    const result = processScript(script, { profile: "default" });

    assert.strictEqual(result.beats.length, 3);
  });

  it("should return all beats without options", () => {
    const script = createTestScript();
    const result = processScript(script, {});

    assert.strictEqual(result.beats.length, 3);
  });
});

describe("filterBySection", () => {
  it("should filter by section", () => {
    const script = createTestScript();
    const result = filterBySection(script, "chapter1");

    assert.strictEqual(result.beats.length, 1);
    assert.strictEqual(result.beats[0].id, "detail");
  });
});

describe("filterByTags", () => {
  it("should filter by tags", () => {
    const script = createTestScript();
    const result = filterByTags(script, ["intro", "conclusion"]);

    assert.strictEqual(result.beats.length, 2);
    assert.strictEqual(result.beats[0].id, "intro");
    assert.strictEqual(result.beats[1].id, "conclusion");
  });

  it("should filter by single tag", () => {
    const script = createTestScript();
    const result = filterByTags(script, ["technical"]);

    assert.strictEqual(result.beats.length, 1);
    assert.strictEqual(result.beats[0].id, "detail");
  });
});

describe("MulmoScript schema validation after strip", () => {
  it("stripExtendedFields output should pass mulmoScriptSchema", () => {
    const script = createTestScript();
    const result = stripExtendedFields(script);

    // Must not throw - output should be valid MulmoScript
    const parsed = mulmoScriptSchema.parse(result);
    assert.ok(parsed);
    assert.strictEqual(parsed.beats.length, 3);
  });

  it("stripExtendedFields should remove scriptMeta", () => {
    const script = createTestScript();
    const result = stripExtendedFields(script);

    assert.strictEqual((result as Record<string, unknown>).scriptMeta, undefined);
    assert.strictEqual((result as Record<string, unknown>).outputProfiles, undefined);
  });

  it("applyProfile output should pass mulmoScriptSchema", () => {
    const script = createTestScript();
    const result = applyProfile(script, "summary");

    const parsed = mulmoScriptSchema.parse(result);
    assert.ok(parsed);
    assert.strictEqual(parsed.beats.length, 2);
  });

  it("processScript output should pass mulmoScriptSchema", () => {
    const script = createTestScript();
    const result = processScript(script, { profile: "summary", section: "opening" });

    const parsed = mulmoScriptSchema.parse(result);
    assert.ok(parsed);
  });

  it("processScript default output should pass mulmoScriptSchema", () => {
    const script = createTestScript();
    const result = processScript(script, {});

    const parsed = mulmoScriptSchema.parse(result);
    assert.ok(parsed);
    assert.strictEqual(parsed.beats.length, 3);
  });
});
