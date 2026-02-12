import { describe, it } from "node:test";
import assert from "node:assert";
import { stripHtml, extractTitle, findMatchingReference } from "../src/core/ai/utils/fetcher.js";

describe("stripHtml", () => {
  it("should remove simple HTML tags", () => {
    const result = stripHtml("<p>Hello <b>world</b></p>");
    assert.ok(result.includes("Hello"));
    assert.ok(result.includes("world"));
    assert.ok(!result.includes("<p>"));
    assert.ok(!result.includes("<b>"));
  });

  it("should remove script elements", () => {
    const result = stripHtml('<p>Text</p><script>alert("xss")</script><p>More</p>');
    assert.ok(result.includes("Text"));
    assert.ok(result.includes("More"));
    assert.ok(!result.includes("alert"));
    assert.ok(!result.includes("script"));
  });

  it("should remove style elements", () => {
    const result = stripHtml("<style>body { color: red; }</style><p>Content</p>");
    assert.ok(result.includes("Content"));
    assert.ok(!result.includes("color"));
    assert.ok(!result.includes("red"));
  });

  it("should remove HTML comments", () => {
    const result = stripHtml("<p>Before</p><!-- comment --><p>After</p>");
    assert.ok(result.includes("Before"));
    assert.ok(result.includes("After"));
    assert.ok(!result.includes("comment"));
  });

  it("should decode HTML entities", () => {
    const result = stripHtml("<p>&lt;tag&gt; &amp; &quot;quoted&quot; &#39;apos&#39;</p>");
    assert.ok(result.includes("<tag>"));
    assert.ok(result.includes("&"));
    assert.ok(result.includes('"quoted"'));
    assert.ok(result.includes("'apos'"));
  });

  it("should decode &amp; last to prevent double-decoding", () => {
    const result = stripHtml("<p>&amp;lt;</p>");
    assert.strictEqual(result, "&lt;");
  });

  it("should decode &nbsp; as space", () => {
    const result = stripHtml("<p>Hello&nbsp;World</p>");
    assert.ok(result.includes("Hello World"));
  });

  it("should replace block element closings with newlines", () => {
    const result = stripHtml("<p>Paragraph 1</p><p>Paragraph 2</p>");
    assert.ok(result.includes("Paragraph 1"));
    assert.ok(result.includes("Paragraph 2"));
  });

  it("should normalize whitespace", () => {
    const result = stripHtml("<p>  Too   many    spaces  </p>");
    assert.ok(!result.includes("  "));
  });

  it("should handle empty string", () => {
    assert.strictEqual(stripHtml(""), "");
  });

  it("should handle plain text without HTML", () => {
    assert.strictEqual(stripHtml("Just plain text"), "Just plain text");
  });

  it("should handle script with attributes", () => {
    const result = stripHtml('<script type="text/javascript">var x = 1;</script><p>Safe</p>');
    assert.ok(result.includes("Safe"));
    assert.ok(!result.includes("var x"));
  });
});

describe("extractTitle", () => {
  it("should extract title from HTML", () => {
    const result = extractTitle("<html><head><title>My Page</title></head><body></body></html>");
    assert.strictEqual(result, "My Page");
  });

  it("should return null when no title", () => {
    const result = extractTitle("<html><head></head><body></body></html>");
    assert.strictEqual(result, null);
  });

  it("should trim whitespace from title", () => {
    const result = extractTitle("<title>  Spaced Title  </title>");
    assert.strictEqual(result, "Spaced Title");
  });

  it("should handle title with attributes", () => {
    const result = extractTitle('<title lang="en">English Title</title>');
    assert.strictEqual(result, "English Title");
  });
});

describe("findMatchingReference", () => {
  const references = [
    { url: "https://example.com/graphai", title: "GraphAI Documentation", description: "Official docs" },
    { url: "https://example.com/react", title: "React Guide", description: "Frontend framework" },
    { url: "https://example.com/node", title: "Node.js API", description: "Server runtime" },
  ];

  it("should find reference by matching keywords", () => {
    const result = findMatchingReference(references, "GraphAI Documentation");
    assert.ok(result);
    assert.strictEqual(result.url, "https://example.com/graphai");
  });

  it("should return null for no match", () => {
    const result = findMatchingReference(references, "xyz abc");
    assert.strictEqual(result, null);
  });

  it("should return null for undefined references", () => {
    const result = findMatchingReference(undefined, "test query");
    assert.strictEqual(result, null);
  });

  it("should return null for empty references", () => {
    const result = findMatchingReference([], "test query");
    assert.strictEqual(result, null);
  });

  it("should match single long keyword", () => {
    const result = findMatchingReference(references, "react");
    assert.ok(result);
    assert.strictEqual(result.url, "https://example.com/react");
  });

  it("should ignore short keywords (2 chars or less)", () => {
    const result = findMatchingReference(references, "ab cd");
    assert.strictEqual(result, null);
  });
});
