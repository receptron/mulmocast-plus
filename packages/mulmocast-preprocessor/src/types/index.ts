// Re-export from @mulmocast/extended-types
export {
  beatVariantSchema,
  type BeatVariant,
  beatMetaSchema,
  type BeatMeta,
  extendedBeatSchema,
  type ExtendedBeat,
  outputProfileSchema,
  type OutputProfile,
  referenceSchema,
  type Reference,
  faqSchema,
  type FAQ,
  scriptMetaSchema,
  type ScriptMeta,
  extendedScriptSchema,
  type ExtendedScript,
  type MulmoImageAsset,
} from "@mulmocast/extended-types";

/**
 * Process Options - options for processScript
 */
export interface ProcessOptions {
  profile?: string;
  section?: string;
  tags?: string[];
}

/**
 * Profile Info - profile metadata with beat counts
 */
export interface ProfileInfo {
  name: string;
  displayName?: string;
  description?: string;
  beatCount: number;
  skippedCount: number;
}
