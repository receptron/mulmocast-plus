import { z } from "zod";
import { mulmoBeatSchema, mulmoScriptSchema, mulmoImageAssetSchema } from "@mulmocast/types";

export type { MulmoImageAsset } from "@mulmocast/types";

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
  notes: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  expectedQuestions: z.array(z.string()).optional(),
});

export type BeatMeta = z.infer<typeof beatMetaSchema>;

/**
 * Extended Beat - beat with variants and meta fields
 */
export const extendedMulmoBeatSchema = mulmoBeatSchema.extend({
  variants: z.record(z.string(), beatVariantSchema).optional(),
  meta: beatMetaSchema.optional(),
});

export type ExtendedMulmoBeat = z.infer<typeof extendedMulmoBeatSchema>;

/**
 * Output Profile - profile display information
 */
export const outputProfileSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type OutputProfile = z.infer<typeof outputProfileSchema>;

/**
 * Reference - external resource reference
 */
export const referenceSchema = z.object({
  type: z.enum(["web", "code", "document", "video"]).optional(),
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export type Reference = z.infer<typeof referenceSchema>;

/**
 * FAQ - frequently asked question
 */
export const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
  relatedBeats: z.array(z.string()).optional(),
});

export type FAQ = z.infer<typeof faqSchema>;

/**
 * Script Meta - script-level metadata for AI features
 */
export const scriptMetaSchema = z.object({
  // Target audience and prerequisites
  audience: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),

  // Learning goals and background
  goals: z.array(z.string()).optional(),
  background: z.string().optional(),

  // FAQ for quick Q&A matching
  faq: z.array(faqSchema).optional(),

  // Search and discovery
  keywords: z.array(z.string()).optional(),
  references: z.array(referenceSchema).optional(),

  // Authoring info
  author: z.string().optional(),
  version: z.string().optional(),
});

export type ScriptMeta = z.infer<typeof scriptMetaSchema>;

/**
 * Extended Script - script with variants, meta, and outputProfiles
 */
export const extendedMulmoScriptSchema = mulmoScriptSchema.extend({
  beats: z.array(extendedMulmoBeatSchema),
  outputProfiles: z.record(z.string(), outputProfileSchema).optional(),
  scriptMeta: scriptMetaSchema.optional(),
});

export type ExtendedMulmoScript = z.infer<typeof extendedMulmoScriptSchema>;
