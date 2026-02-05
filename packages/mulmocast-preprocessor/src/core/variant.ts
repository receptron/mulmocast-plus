import type { MulmoScript, MulmoBeat } from "mulmocast";
import type { ExtendedScript, ExtendedBeat } from "../types/index.js";

/**
 * 単一のbeatにプロファイルを適用する
 * @returns 処理済みbeat、またはskipの場合はnull
 */
const applyVariantToBeat = (beat: ExtendedBeat, profileName: string): MulmoBeat | null => {
  const variant = beat.variants?.[profileName];

  if (variant?.skip) {
    return null;
  }

  const { variants: __variants, meta: __meta, ...baseBeat } = beat;

  if (!variant) {
    return baseBeat;
  }

  const result: MulmoBeat = { ...baseBeat };

  if (variant.text !== undefined) {
    result.text = variant.text;
  }

  if (variant.image !== undefined) {
    result.image = variant.image;
  }

  if (variant.imagePrompt !== undefined) {
    result.imagePrompt = variant.imagePrompt;
  }

  return result;
};

/**
 * スクリプトにプロファイルを適用し、通常のMulmoScriptを返す
 */
export const applyProfile = (script: ExtendedScript, profileName: string): MulmoScript => {
  const processedBeats: MulmoBeat[] = [];

  for (const beat of script.beats) {
    const processed = applyVariantToBeat(beat, profileName);
    if (processed !== null) {
      processedBeats.push(processed);
    }
  }

  const { outputProfiles: __outputProfiles, ...baseScript } = script;

  return {
    ...baseScript,
    beats: processedBeats,
  } as MulmoScript;
};
