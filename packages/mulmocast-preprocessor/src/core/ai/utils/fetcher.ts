import { GraphAILogger } from "graphai";

/**
 * Fetched content result
 */
export interface FetchedContent {
  url: string;
  title: string | null;
  content: string;
  error?: string;
}

/**
 * Remove all occurrences of a tag block (e.g. <script>...</script>) using indexOf
 */
const removeTagBlock = (html: string, openTag: string, closeTag: string): string => {
  let result = html;
  let lower = result.toLowerCase();
  let start = lower.indexOf(openTag);
  while (start !== -1) {
    const end = lower.indexOf(closeTag, start);
    if (end === -1) break;
    result = result.substring(0, start) + result.substring(end + closeTag.length);
    lower = result.toLowerCase();
    start = lower.indexOf(openTag);
  }
  return result;
};

const BLOCK_ELEMENTS = new Set(["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "li", "tr", "br"]);

/**
 * Remove all HTML tags using indexOf, replacing block closings with newlines
 */
const removeTags = (html: string): string => {
  const parts: string[] = [];
  let i = 0;
  while (i < html.length) {
    const tagStart = html.indexOf("<", i);
    if (tagStart === -1) {
      parts.push(html.substring(i));
      break;
    }
    parts.push(html.substring(i, tagStart));
    const tagEnd = html.indexOf(">", tagStart);
    if (tagEnd === -1) {
      parts.push(html.substring(tagStart));
      break;
    }
    const tagContent = html.substring(tagStart + 1, tagEnd);
    const closeMatch = tagContent.match(/^\/(\w+)/);
    if (closeMatch && BLOCK_ELEMENTS.has(closeMatch[1].toLowerCase())) {
      parts.push("\n");
    }
    i = tagEnd + 1;
  }
  return parts.join("");
};

/**
 * Strip HTML tags and extract text content
 */
export const stripHtml = (html: string): string => {
  // Remove script, style elements and comments using indexOf (avoids regex ReDoS)
  let text = removeTagBlock(html, "<script", "</script>");
  text = removeTagBlock(text, "<style", "</style>");
  text = removeTagBlock(text, "<!--", "-->");

  // Remove all HTML tags
  text = removeTags(text);

  // Decode common HTML entities (&amp; must be last to prevent double-decoding)
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&amp;/g, "&");

  // Normalize whitespace
  text = text.replace(/\s+/g, " ");
  text = text.replace(/\n\s*\n/g, "\n\n");

  return text.trim();
};

/**
 * Extract title from HTML using indexOf (avoids regex ReDoS)
 */
export const extractTitle = (html: string): string | null => {
  const lower = html.toLowerCase();
  const titleStart = lower.indexOf("<title");
  if (titleStart === -1) return null;
  const contentStart = html.indexOf(">", titleStart);
  if (contentStart === -1) return null;
  const titleEnd = lower.indexOf("</title>", contentStart);
  if (titleEnd === -1) return null;
  const title = html.substring(contentStart + 1, titleEnd).trim();
  return title || null;
};

/**
 * Fetch URL content and extract text
 */
export const fetchUrlContent = async (url: string, maxLength = 8000, verbose = false): Promise<FetchedContent> => {
  try {
    if (verbose) {
      GraphAILogger.info(`Fetching URL: ${url}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MulmoCast/1.0; +https://github.com/receptron/mulmocast)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        url,
        title: null,
        content: "",
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type") || "";

    // Handle non-HTML content
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      if (contentType.includes("text/plain")) {
        const text = await response.text();
        return {
          url,
          title: null,
          content: text.substring(0, maxLength),
        };
      }
      return {
        url,
        title: null,
        content: "",
        error: `Unsupported content type: ${contentType}`,
      };
    }

    const html = await response.text();
    const title = extractTitle(html);
    const content = stripHtml(html);

    // Truncate if needed
    const truncatedContent = content.length > maxLength ? content.substring(0, maxLength) + "..." : content;

    if (verbose) {
      GraphAILogger.info(`Fetched ${content.length} chars from ${url}`);
    }

    return {
      url,
      title,
      content: truncatedContent,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      url,
      title: null,
      content: "",
      error: errorMessage,
    };
  }
};

/**
 * Find matching reference URL from script metadata
 */
export const findMatchingReference = (
  references: Array<{ url: string; title?: string; description?: string }> | undefined,
  query: string,
): { url: string; title?: string; description?: string } | null => {
  if (!references || references.length === 0) {
    return null;
  }

  const lowerQuery = query.toLowerCase();

  // Try to find a reference that matches keywords in the query
  for (const ref of references) {
    const refText = [ref.title, ref.description, ref.url].filter(Boolean).join(" ").toLowerCase();

    // Simple keyword matching
    const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
    const matchScore = queryWords.filter((word) => refText.includes(word)).length;

    if (matchScore >= 2 || (queryWords.length === 1 && matchScore === 1)) {
      return ref;
    }
  }

  return null;
};
