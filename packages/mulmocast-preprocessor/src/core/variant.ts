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

  const { skip: __skip, ...overrides } = variant;
  return { ...baseBeat, ...overrides };
};

/**
 * スクリプトにプロファイルを適用し、通常のMulmoScriptを返す
 */
export const applyProfile = (script: ExtendedScript, profileName: string): MulmoScript => {
  const { outputProfiles: __outputProfiles, ...baseScript } = script;

  return {
    ...baseScript,
    beats: script.beats.map((beat) => applyVariantToBeat(beat, profileName)).filter((beat): beat is MulmoBeat => beat !== null),
  } as MulmoScript;
};
