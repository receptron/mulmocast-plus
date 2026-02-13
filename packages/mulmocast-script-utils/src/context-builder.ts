import type { ExtendedMulmoScript, ExtendedMulmoViewerData, ExtendedMulmoViewerBeat } from "@mulmocast/extended-types";

/**
 * Default system prompt for interactive query
 */
export const DEFAULT_INTERACTIVE_SYSTEM_PROMPT = `You are answering questions based on the content provided.
- Answer based ONLY on the information in the provided content
- If the answer cannot be found in the content, say so clearly
- Be concise and direct in your answers
- Do not make up information that is not in the content
- You may reference previous conversation when answering follow-up questions
- If references are available and the user asks for more details, mention which reference could provide more information
- When you suggest fetching a reference for more details, include [SUGGEST_FETCH: <url>] in your response`;

/**
 * Build beat content including metadata
 */
export const buildBeatContent = (beat: ExtendedMulmoViewerBeat, index: number): string => {
  const lines: string[] = [];

  // Main text
  const text = beat.text || "";
  if (!text.trim()) return "";

  lines.push(`[${index}] ${text}`);

  // Add metadata if available
  const meta = beat.meta;
  if (meta) {
    // Tags for categorization
    if (meta.tags && meta.tags.length > 0) {
      lines.push(`  Tags: ${meta.tags.join(", ")}`);
    }
    // Context provides additional information not in the text
    if (meta.context) {
      lines.push(`  Context: ${meta.context}`);
    }
    // Keywords highlight important terms
    if (meta.keywords && meta.keywords.length > 0) {
      lines.push(`  Keywords: ${meta.keywords.join(", ")}`);
    }
    // Expected questions this beat can answer
    if (meta.expectedQuestions && meta.expectedQuestions.length > 0) {
      lines.push(`  Can answer: ${meta.expectedQuestions.join("; ")}`);
    }
  }

  return lines.join("\n");
};

/**
 * Build script-level metadata section
 */
export const buildScriptMetaContent = (data: ExtendedMulmoViewerData): string => {
  const meta = data.scriptMeta;
  if (!meta) return "";

  const lines: string[] = [];

  // Background info
  if (meta.background) {
    lines.push(`Background: ${meta.background}`);
  }

  // Audience and prerequisites
  if (meta.audience) {
    lines.push(`Target audience: ${meta.audience}`);
  }
  if (meta.prerequisites && meta.prerequisites.length > 0) {
    lines.push(`Prerequisites: ${meta.prerequisites.join(", ")}`);
  }

  // Goals
  if (meta.goals && meta.goals.length > 0) {
    lines.push(`Goals: ${meta.goals.join("; ")}`);
  }

  // Keywords
  if (meta.keywords && meta.keywords.length > 0) {
    lines.push(`Keywords: ${meta.keywords.join(", ")}`);
  }

  // References
  if (meta.references && meta.references.length > 0) {
    lines.push("References:");
    meta.references.forEach((ref) => {
      const title = ref.title || ref.url;
      const desc = ref.description ? ` - ${ref.description}` : "";
      lines.push(`  - [${ref.type || "web"}] ${title}: ${ref.url}${desc}`);
    });
  }

  // FAQ
  if (meta.faq && meta.faq.length > 0) {
    lines.push("FAQ:");
    meta.faq.forEach((faq) => {
      lines.push(`  Q: ${faq.question}`);
      lines.push(`  A: ${faq.answer}`);
    });
  }

  // Author info
  if (meta.author) {
    lines.push(`Author: ${meta.author}`);
  }

  return lines.length > 0 ? lines.join("\n") : "";
};

/**
 * Convert ExtendedMulmoScript to ExtendedMulmoViewerData (extract only needed fields)
 */
export const scriptToViewerData = (script: ExtendedMulmoScript): ExtendedMulmoViewerData => {
  return {
    beats: script.beats.map((b) => ({
      text: b.text,
      meta: b.meta,
      variants: b.variants,
      id: b.id,
    })),
    title: script.title,
    lang: script.lang,
    scriptMeta: script.scriptMeta,
    outputProfiles: script.outputProfiles,
  };
};

/**
 * Build script content for user prompt (common part)
 */
export const buildScriptContent = (data: ExtendedMulmoViewerData): string => {
  const parts: string[] = [];

  // Add script title and language
  parts.push(`# Script: ${data.title}`);
  parts.push(`Language: ${data.lang}`);
  parts.push("");

  // Add script-level metadata
  const scriptMetaContent = buildScriptMetaContent(data);
  if (scriptMetaContent) {
    parts.push("## About this content");
    parts.push(scriptMetaContent);
    parts.push("");
  }

  // Collect all content from beats grouped by section
  const sections = new Map<string, string[]>();

  data.beats.forEach((beat, index) => {
    const content = buildBeatContent(beat, index);
    if (!content) return;

    const section = beat.meta?.section || "main";
    if (!sections.has(section)) {
      sections.set(section, []);
    }
    sections.get(section)!.push(content);
  });

  // Output by section
  sections.forEach((contents, section) => {
    parts.push(`## Section: ${section}`);
    contents.forEach((c) => parts.push(c));
    parts.push("");
  });

  return parts.join("\n");
};
