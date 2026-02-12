import { readFileSync } from "fs";
import type { ExtendedMulmoScript } from "@mulmocast/extended-types";

/**
 * Check if input is a URL
 */
export const isUrl = (input: string): boolean => {
  return input.startsWith("http://") || input.startsWith("https://");
};

/**
 * Fetch JSON from URL with timeout
 */
const fetchJson = async (url: string): Promise<ExtendedMulmoScript> => {
  const controller = new AbortController();
  const timeout_ms = 30000;
  const timeoutId = setTimeout(() => controller.abort(), timeout_ms);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as ExtendedMulmoScript;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Load script from file path or URL
 */
export const loadScript = async (input: string): Promise<ExtendedMulmoScript> => {
  if (isUrl(input)) {
    return fetchJson(input);
  }
  const content = readFileSync(input, "utf-8");
  return JSON.parse(content) as ExtendedMulmoScript;
};
