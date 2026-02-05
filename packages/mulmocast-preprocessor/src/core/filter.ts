import type { MulmoScript, MulmoBeat } from "mulmocast";
import type { ExtendedScript, ExtendedBeat } from "../types/index.js";

const stripBeatExtendedFields = (beat: ExtendedBeat): MulmoBeat => {
  const { variants: __variants, meta: __meta, ...baseBeat } = beat;
  return baseBeat;
};

const filterBeats = (script: ExtendedScript, predicate: (beat: ExtendedBeat) => boolean): MulmoScript => {
  const { outputProfiles: __outputProfiles, ...baseScript } = script;
  return {
    ...baseScript,
    beats: script.beats.filter(predicate).map(stripBeatExtendedFields),
  } as MulmoScript;
};

/**
 * セクションでフィルタ
 */
export const filterBySection = (script: ExtendedScript, section: string): MulmoScript => filterBeats(script, (beat) => beat.meta?.section === section);

/**
 * タグでフィルタ（指定されたタグのいずれかを持つbeatを抽出）
 */
export const filterByTags = (script: ExtendedScript, tags: string[]): MulmoScript => {
  const tagSet = new Set(tags);
  return filterBeats(script, (beat) => (beat.meta?.tags ?? []).some((tag) => tagSet.has(tag)));
};

/**
 * variants と meta を除去して通常のMulmoScriptに変換
 */
export const stripExtendedFields = (script: ExtendedScript): MulmoScript => filterBeats(script, () => true);
