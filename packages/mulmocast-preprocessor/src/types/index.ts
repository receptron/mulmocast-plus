import { z } from "zod";
import { mulmoBeatSchema, mulmoScriptSchema, type MulmoBeat } from "mulmocast";

/**
 * MulmoBeat の image フィールドの型を取得
 */
export type MulmoImage = MulmoBeat["image"];

/**
 * Beat Variant - プロファイル別の差し替え定義
 */
export const beatVariantSchema = z.object({
  text: z.string().optional(),
  skip: z.boolean().optional(),
  image: z.any().optional(), // MulmoImage type at runtime
  imagePrompt: z.string().optional(),
});

export type BeatVariant = z.infer<typeof beatVariantSchema>;

/**
 * Beat Meta - beatのメタデータ
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
 * Extended Beat - variants と meta を持つ拡張beat
 */
export const extendedBeatSchema = mulmoBeatSchema.extend({
  variants: z.record(z.string(), beatVariantSchema).optional(),
  meta: beatMetaSchema.optional(),
});

export type ExtendedBeat = z.infer<typeof extendedBeatSchema>;

/**
 * Output Profile - 出力プロファイル定義
 */
export const outputProfileSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type OutputProfile = z.infer<typeof outputProfileSchema>;

/**
 * Extended Script - variants/meta/outputProfiles を持つ拡張スクリプト
 */
export const extendedScriptSchema = mulmoScriptSchema.extend({
  beats: z.array(extendedBeatSchema),
  outputProfiles: z.record(z.string(), outputProfileSchema).optional(),
});

export type ExtendedScript = z.infer<typeof extendedScriptSchema>;

/**
 * Process Options - 処理オプション
 */
export interface ProcessOptions {
  profile?: string;
  section?: string;
  tags?: string[];
}

/**
 * Profile Info - プロファイル情報
 */
export interface ProfileInfo {
  name: string;
  displayName?: string;
  description?: string;
  beatCount: number;
  skippedCount: number;
}
