// Preprocessing API
export { processScript } from "./core/preprocessing/process.js";
export { applyProfile } from "./core/preprocessing/variant.js";
export { filterBySection, filterByTags, stripExtendedFields } from "./core/preprocessing/filter.js";
export { listProfiles } from "./core/preprocessing/profiles.js";

// AI API
export { summarizeScript } from "./core/ai/command/summarize/index.js";
export { queryScript } from "./core/ai/command/query/index.js";

// Types
export type { BeatVariant, BeatMeta, ExtendedBeat, ExtendedScript, OutputProfile, ProcessOptions, ProfileInfo } from "./types/index.js";
export type { SummarizeOptions, SummarizeResult, LLMProvider, SummarizeFormat, ProviderConfig } from "./types/summarize.js";
export type { QueryOptions, QueryResult } from "./types/query.js";

// Schemas (for validation)
export { beatVariantSchema, beatMetaSchema, extendedBeatSchema, extendedScriptSchema, outputProfileSchema } from "./types/index.js";
export { summarizeOptionsSchema, llmProviderSchema, summarizeFormatSchema } from "./types/summarize.js";
export { queryOptionsSchema } from "./types/query.js";
