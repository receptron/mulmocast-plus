import type { MulmoScript } from "mulmocast";
import type { ExtendedScript, ProcessOptions } from "../types/index.js";
import { applyProfile } from "./variant.js";
import { filterBySection, filterByTags, stripExtendedFields } from "./filter.js";

const toExtendedScript = (script: MulmoScript): ExtendedScript => ({
  ...script,
  beats: script.beats.map((beat) => ({ ...beat })),
});

/**
 * メイン処理関数
 * プロファイル適用とフィルタを一括実行
 */
export const processScript = (script: ExtendedScript, options: ProcessOptions = {}): MulmoScript => {
  const afterProfile = options.profile && options.profile !== "default" ? applyProfile(script, options.profile) : stripExtendedFields(script);

  const afterSection = options.section ? filterBySection(toExtendedScript(afterProfile), options.section) : afterProfile;

  const afterTags = options.tags && options.tags.length > 0 ? filterByTags(toExtendedScript(afterSection), options.tags) : afterSection;

  return afterTags;
};
