import { z } from "zod";
import { mulmoBeatSchema, mulmoScriptSchema, mulmoImageAssetSchema } from "mulmocast";

export type { MulmoImageAsset } from "mulmocast";

/**
 * Beat Variant - profile-specific content overrides
 */
export const beatVariantSchema = z.object({
  text: z.string().optional(),
  skip: z.boolean().optional(),
  image: mulmoImageAssetSchema.optional(),
  imagePrompt: z.string().optional(),
});

export type BeatVariant = z.infer<typeof beatVariantSchema>;

/**
 * Beat Meta - metadata for filtering and context
 */
export const beatMetaSchema = z.object({
  tags: z.array(z.string()).optional(),
  section: z.string().optional(),
  context: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  expectedQuestions: z.array(z.string()).optional(),
});

export type BeatMeta = z.infer<typeof beatMetaSchema>;

/**
 * Extended Beat - beat with variants and meta fields
 */
export const extendedBeatSchema = mulmoBeatSchema.extend({
  variants: z.record(z.string(), beatVariantSchema).optional(),
  meta: beatMetaSchema.optional(),
});

export type ExtendedBeat = z.infer<typeof extendedBeatSchema>;

/**
 * Output Profile - profile display information
 */
export const outputProfileSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type OutputProfile = z.infer<typeof outputProfileSchema>;

/**
 * Extended Script - script with variants, meta, and outputProfiles
 */
export const extendedScriptSchema = mulmoScriptSchema.extend({
  beats: z.array(extendedBeatSchema),
  outputProfiles: z.record(z.string(), outputProfileSchema).optional(),
});

export type ExtendedScript = z.infer<typeof extendedScriptSchema>;

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
