import test from "node:test";
import assert from "node:assert";
import {
  beatVariantSchema,
  beatMetaSchema,
  extendedMulmoBeatSchema,
  outputProfileSchema,
  referenceSchema,
  faqSchema,
  scriptMetaSchema,
  extendedMulmoScriptSchema,
} from "../src/index.js";

const minimalMulmoScript = {
  $mulmocast: { version: "1.1" as const },
  speechParams: { speakers: {} },
  imageParams: { provider: "openai" as const, images: {} },
  beats: [],
};

test("beatVariantSchema: valid variant", () => {
  const result = beatVariantSchema.safeParse({
    text: "override text",
    skip: false,
    imagePrompt: "a sunset",
  });
  assert.strictEqual(result.success, true);
});

test("beatVariantSchema: empty object is valid", () => {
  const result = beatVariantSchema.safeParse({});
  assert.strictEqual(result.success, true);
});

test("beatVariantSchema: rejects invalid skip type", () => {
  const result = beatVariantSchema.safeParse({ skip: "yes" });
  assert.strictEqual(result.success, false);
});

test("beatMetaSchema: valid meta with all fields", () => {
  const result = beatMetaSchema.safeParse({
    tags: ["intro", "overview"],
    section: "opening",
    context: "Background context",
    notes: "Raw extracted text from source document",
    keywords: ["api", "graphai"],
    expectedQuestions: ["What is GraphAI?"],
  });
  assert.strictEqual(result.success, true);
});

test("beatMetaSchema: empty object is valid", () => {
  const result = beatMetaSchema.safeParse({});
  assert.strictEqual(result.success, true);
});

test("beatMetaSchema: rejects invalid tags type", () => {
  const result = beatMetaSchema.safeParse({ tags: "not-an-array" });
  assert.strictEqual(result.success, false);
});

test("outputProfileSchema: valid profile", () => {
  const result = outputProfileSchema.safeParse({
    name: "beginner",
    description: "For beginners",
  });
  assert.strictEqual(result.success, true);
});

test("outputProfileSchema: rejects missing name", () => {
  const result = outputProfileSchema.safeParse({ description: "no name" });
  assert.strictEqual(result.success, false);
});

test("referenceSchema: valid reference with all fields", () => {
  const result = referenceSchema.safeParse({
    type: "web",
    url: "https://example.com",
    title: "Example",
    description: "An example",
  });
  assert.strictEqual(result.success, true);
});

test("referenceSchema: minimal reference (url only)", () => {
  const result = referenceSchema.safeParse({ url: "https://example.com" });
  assert.strictEqual(result.success, true);
});

test("referenceSchema: rejects invalid type", () => {
  const result = referenceSchema.safeParse({ url: "https://example.com", type: "invalid" });
  assert.strictEqual(result.success, false);
});

test("referenceSchema: rejects missing url", () => {
  const result = referenceSchema.safeParse({ type: "web" });
  assert.strictEqual(result.success, false);
});

test("faqSchema: valid FAQ", () => {
  const result = faqSchema.safeParse({
    question: "What is this?",
    answer: "A test",
    relatedBeats: ["0", "1"],
  });
  assert.strictEqual(result.success, true);
});

test("faqSchema: rejects missing question", () => {
  const result = faqSchema.safeParse({ answer: "no question" });
  assert.strictEqual(result.success, false);
});

test("scriptMetaSchema: valid full meta", () => {
  const result = scriptMetaSchema.safeParse({
    audience: "developers",
    prerequisites: ["TypeScript basics"],
    goals: ["Understand ExtendedMulmoScript"],
    background: "Background info",
    faq: [{ question: "Q?", answer: "A" }],
    keywords: ["mulmocast"],
    references: [{ url: "https://example.com", type: "web" }],
    author: "test",
    version: "1.0",
  });
  assert.strictEqual(result.success, true);
});

test("scriptMetaSchema: empty object is valid", () => {
  const result = scriptMetaSchema.safeParse({});
  assert.strictEqual(result.success, true);
});

test("extendedMulmoBeatSchema: valid beat with meta", () => {
  const result = extendedMulmoBeatSchema.safeParse({
    text: "Hello world",
    meta: {
      tags: ["intro"],
      section: "opening",
      context: "Opening slide",
    },
  });
  assert.strictEqual(result.success, true);
});

test("extendedMulmoBeatSchema: valid beat with variants", () => {
  const result = extendedMulmoBeatSchema.safeParse({
    text: "Hello world",
    variants: {
      beginner: { text: "Simple hello" },
      advanced: { skip: true },
    },
  });
  assert.strictEqual(result.success, true);
});

test("extendedMulmoScriptSchema: valid minimal ExtendedMulmoScript", () => {
  const result = extendedMulmoScriptSchema.safeParse({
    ...minimalMulmoScript,
    beats: [{ text: "slide 1" }],
  });
  assert.strictEqual(result.success, true);
});

test("extendedMulmoScriptSchema: valid full ExtendedMulmoScript", () => {
  const result = extendedMulmoScriptSchema.safeParse({
    ...minimalMulmoScript,
    beats: [
      {
        text: "slide 1",
        meta: { tags: ["intro"], section: "opening", context: "First slide" },
        variants: { beginner: { text: "Easy version" } },
      },
    ],
    outputProfiles: {
      beginner: { name: "beginner", description: "For beginners" },
    },
    scriptMeta: {
      audience: "developers",
      goals: ["Learn the basics"],
      keywords: ["test"],
    },
  });
  assert.strictEqual(result.success, true);
});

test("extendedMulmoScriptSchema: rejects missing $mulmocast", () => {
  const result = extendedMulmoScriptSchema.safeParse({
    beats: [{ text: "slide 1" }],
  });
  assert.strictEqual(result.success, false);
});

test("extendedMulmoScriptSchema: rejects invalid scriptMeta", () => {
  const result = extendedMulmoScriptSchema.safeParse({
    ...minimalMulmoScript,
    beats: [{ text: "slide 1" }],
    scriptMeta: { audience: 123 },
  });
  assert.strictEqual(result.success, false);
});
