import type { MulmoScript, MulmoBeat } from "mulmocast";
import type { ExtendedScript, ExtendedBeat } from "../types/index.js";

const stripBeatExtendedFields = (beat: ExtendedBeat): MulmoBeat => {
  const { variants: __variants, meta: __meta, ...baseBeat } = beat;
  return baseBeat;
};

const stripScriptExtendedFields = <T extends ExtendedScript>(script: T, beats: MulmoBeat[]): MulmoScript => {
  const { outputProfiles: __outputProfiles, ...baseScript } = script;
  return { ...baseScript, beats } as MulmoScript;
};

/**
 * セクションでフィルタ
 */
export const filterBySection = (script: ExtendedScript, section: string): MulmoScript => {
  const filteredBeats = script.beats.filter((beat) => beat.meta?.section === section).map(stripBeatExtendedFields);

  return stripScriptExtendedFields(script, filteredBeats);
};

/**
 * タグでフィルタ（指定されたタグのいずれかを持つbeatを抽出）
 */
export const filterByTags = (script: ExtendedScript, tags: string[]): MulmoScript => {
  const tagSet = new Set(tags);

  const filteredBeats = script.beats.filter((beat) => (beat.meta?.tags ?? []).some((tag) => tagSet.has(tag))).map(stripBeatExtendedFields);

  return stripScriptExtendedFields(script, filteredBeats);
};

/**
 * variants と meta を除去して通常のMulmoScriptに変換
 */
export const stripExtendedFields = (script: ExtendedScript): MulmoScript => {
  return stripScriptExtendedFields(script, script.beats.map(stripBeatExtendedFields));
};
