import type { MulmoScript } from "mulmocast";
import type { ExtendedScript, ProcessOptions } from "../types/index.js";
import { applyProfile } from "./variant.js";
import { filterBySection, filterByTags, stripExtendedFields } from "./filter.js";

/**
 * Main processing function
 * Applies filters first (while meta exists), then profile
 */
export const processScript = (script: ExtendedScript, options: ProcessOptions = {}): MulmoScript => {
  const afterSection = options.section ? filterBySection(script, options.section) : script;

  const afterTags = options.tags && options.tags.length > 0 ? filterByTags(afterSection, options.tags) : afterSection;

  const afterProfile = options.profile && options.profile !== "default" ? applyProfile(afterTags, options.profile) : stripExtendedFields(afterTags);

  return afterProfile;
};
