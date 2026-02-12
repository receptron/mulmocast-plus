import { z } from "zod";
import {
  mulmoViewerBeatSchema,
  mulmoViewerDataSchema,
} from "@mulmocast/types";
import {
  beatVariantSchema,
  beatMetaSchema,
  outputProfileSchema,
  scriptMetaSchema,
} from "./mulmoBeat.js";

/**
 * Extended Viewer Beat - viewer beat with variants and meta fields
 */
export const extendedMulmoViewerBeatSchema = mulmoViewerBeatSchema.extend({
  variants: z.record(z.string(), beatVariantSchema).optional(),
  meta: beatMetaSchema.optional(),
});

export type ExtendedMulmoViewerBeat = z.infer<
  typeof extendedMulmoViewerBeatSchema
>;

/**
 * Extended Viewer Data - viewer data with extended beats and metadata
 */
export const extendedMulmoViewerDataSchema = mulmoViewerDataSchema.extend({
  beats: z.array(extendedMulmoViewerBeatSchema),
  outputProfiles: z.record(z.string(), outputProfileSchema).optional(),
  scriptMeta: scriptMetaSchema.optional(),
});

export type ExtendedMulmoViewerData = z.infer<
  typeof extendedMulmoViewerDataSchema
>;
