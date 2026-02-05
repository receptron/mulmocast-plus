// Core API
export { processScript } from "./core/process.js";
export { applyProfile } from "./core/variant.js";
export { filterBySection, filterByTags, stripExtendedFields } from "./core/filter.js";
export { listProfiles } from "./core/profiles.js";

// Types
export type { BeatVariant, BeatMeta, ExtendedBeat, ExtendedScript, OutputProfile, ProcessOptions, ProfileInfo } from "./types/index.js";

// Schemas (for validation)
export { beatVariantSchema, beatMetaSchema, extendedBeatSchema, extendedScriptSchema, outputProfileSchema } from "./types/index.js";
