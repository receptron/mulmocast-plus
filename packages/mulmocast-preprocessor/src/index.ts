// Preprocessing API
export { processScript } from "./core/preprocessing/process.js";
export { applyProfile } from "./core/preprocessing/variant.js";
export { filterBySection, filterByTags, stripExtendedFields } from "./core/preprocessing/filter.js";
export { listProfiles } from "./core/preprocessing/profiles.js";

// AI API
export { summarizeScript } from "./core/ai/command/summarize/index.js";
export { queryScript } from "./core/ai/command/query/index.js";
export {
  createInteractiveSession,
  sendInteractiveQuery,
  sendInteractiveQueryWithFetch,
  clearHistory,
  getHistory,
  getReferences,
  findReference,
  fetchReference,
  parseSuggestedFetch,
  removeSuggestFetchMarkers,
} from "./core/ai/command/query/interactive.js";

// Utilities
export { fetchUrlContent, stripHtml, extractTitle } from "./core/ai/utils/fetcher.js";
export type { FetchedContent } from "./core/ai/utils/fetcher.js";

// Types (local)
export type { ProcessOptions, ProfileInfo } from "./types/index.js";
export type { SummarizeOptions, SummarizeResult, LLMProvider, SummarizeFormat, ProviderConfig } from "./types/summarize.js";
export type { QueryOptions, QueryResult, ConversationMessage, InteractiveQuerySession } from "./types/query.js";

// Schemas (local)
export { summarizeOptionsSchema, llmProviderSchema, summarizeFormatSchema } from "./types/summarize.js";
export { queryOptionsSchema } from "./types/query.js";
