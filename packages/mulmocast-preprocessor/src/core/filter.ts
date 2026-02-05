import type { MulmoScript, MulmoBeat } from "mulmocast";
import type { ExtendedScript, ExtendedBeat } from "../types/index.js";

/**
 * セクションでフィルタ
 */
export const filterBySection = (script: ExtendedScript, section: string): MulmoScript => {
  const filteredBeats: MulmoBeat[] = [];

  for (const beat of script.beats) {
    if (beat.meta?.section === section) {
      const { variants: __variants, meta: __meta, ...baseBeat } = beat;
      filteredBeats.push(baseBeat);
    }
  }

  const { outputProfiles: __outputProfiles, ...baseScript } = script;

  return {
    ...baseScript,
    beats: filteredBeats,
  } as MulmoScript;
};

/**
 * タグでフィルタ（指定されたタグのいずれかを持つbeatを抽出）
 */
export const filterByTags = (script: ExtendedScript, tags: string[]): MulmoScript => {
  const tagSet = new Set(tags);
  const filteredBeats: MulmoBeat[] = [];

  for (const beat of script.beats) {
    const beatTags = beat.meta?.tags ?? [];
    const hasMatchingTag = beatTags.some((tag) => tagSet.has(tag));

    if (hasMatchingTag) {
      const { variants: __variants, meta: __meta, ...baseBeat } = beat;
      filteredBeats.push(baseBeat);
    }
  }

  const { outputProfiles: __outputProfiles, ...baseScript } = script;

  return {
    ...baseScript,
    beats: filteredBeats,
  } as MulmoScript;
};

/**
 * variants と meta を除去して通常のMulmoScriptに変換
 */
export const stripExtendedFields = (script: ExtendedScript): MulmoScript => {
  const cleanedBeats: MulmoBeat[] = script.beats.map((beat: ExtendedBeat) => {
    const { variants: __variants, meta: __meta, ...baseBeat } = beat;
    return baseBeat;
  });

  const { outputProfiles: __outputProfiles, ...baseScript } = script;

  return {
    ...baseScript,
    beats: cleanedBeats,
  } as MulmoScript;
};
