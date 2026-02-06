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
 * Strip HTML tags and extract text content
 */
const stripHtml = (html: string): string => {
  // Remove script and style elements
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Replace common block elements with newlines
  text = text.replace(/<\/(p|div|h[1-6]|li|tr|br)[^>]*>/gi, "\n");

  // Remove all remaining HTML tags
  // eslint-disable-next-line sonarjs/slow-regex -- standard HTML tag removal pattern, safe for typical HTML
  text = text.replace(/<[^>]*>/g, " ");

  // Decode common HTML entities
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  // Normalize whitespace
  text = text.replace(/\s+/g, " ");
  text = text.replace(/\n\s*\n/g, "\n\n");

  return text.trim();
};

/**
 * Extract title from HTML
 */
const extractTitle = (html: string): string | null => {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
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
