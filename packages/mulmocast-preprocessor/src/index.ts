// Core API
export { processScript } from "./core/process.js";
export { applyProfile } from "./core/variant.js";
export { filterBySection, filterByTags, stripExtendedFields } from "./core/filter.js";
export { listProfiles } from "./core/profiles.js";

// Summarize API
export { summarizeScript } from "./core/summarize/index.js";

// Types
export type { BeatVariant, BeatMeta, ExtendedBeat, ExtendedScript, OutputProfile, ProcessOptions, ProfileInfo } from "./types/index.js";
export type { SummarizeOptions, SummarizeResult, LLMProvider, SummarizeFormat, ProviderConfig } from "./types/summarize.js";

// Schemas (for validation)
export { beatVariantSchema, beatMetaSchema, extendedBeatSchema, extendedScriptSchema, outputProfileSchema } from "./types/index.js";
export { summarizeOptionsSchema, llmProviderSchema, summarizeFormatSchema } from "./types/summarize.js";
