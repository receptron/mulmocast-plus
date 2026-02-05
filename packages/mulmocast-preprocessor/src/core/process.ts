import type { MulmoScript } from "mulmocast";
import type { ExtendedScript, ProcessOptions } from "../types/index.js";
import { applyProfile } from "./variant.js";
import { filterBySection, filterByTags, stripExtendedFields } from "./filter.js";

/**
 * メイン処理関数
 * プロファイル適用とフィルタを一括実行
 */
export const processScript = (script: ExtendedScript, options: ProcessOptions = {}): MulmoScript => {
  let result: MulmoScript;

  if (options.profile && options.profile !== "default") {
    result = applyProfile(script, options.profile);
  } else {
    result = stripExtendedFields(script);
  }

  if (options.section) {
    const extendedResult: ExtendedScript = {
      ...result,
      beats: result.beats.map((beat) => ({ ...beat })),
    };
    result = filterBySection(extendedResult, options.section);
  }

  if (options.tags && options.tags.length > 0) {
    const extendedResult: ExtendedScript = {
      ...result,
      beats: result.beats.map((beat) => ({ ...beat })),
    };
    result = filterByTags(extendedResult, options.tags);
  }

  return result;
};
