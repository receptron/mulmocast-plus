import type { MulmoScript, MulmoBeat } from "@mulmocast/types";
import type { ExtendedMulmoScript, ExtendedMulmoBeat } from "@mulmocast/extended-types";
import type { FilterOptions } from "./types.js";

const stripBeatExtendedFields = (beat: ExtendedMulmoBeat): MulmoBeat => {
  const { variants: __variants, meta: __meta, ...baseBeat } = beat;
  return baseBeat;
};

const filterBeatsToMulmoScript = (script: ExtendedMulmoScript, predicate: (beat: ExtendedMulmoBeat) => boolean): MulmoScript => {
  const { outputProfiles: __outputProfiles, scriptMeta: __scriptMeta, ...baseScript } = script;
  return {
    ...baseScript,
    beats: script.beats.filter(predicate).map(stripBeatExtendedFields),
  } as MulmoScript;
};

const filterBeatsPreservingMeta = (script: ExtendedMulmoScript, predicate: (beat: ExtendedMulmoBeat) => boolean): ExtendedMulmoScript => ({
  ...script,
  beats: script.beats.filter(predicate),
});

/**
 * Filter beats by section (preserves meta for chaining)
 */
export const filterBySection = (script: ExtendedMulmoScript, section: string): ExtendedMulmoScript =>
  filterBeatsPreservingMeta(script, (beat) => beat.meta?.section === section);

/**
 * Filter beats by tags (preserves meta for chaining)
 */
export const filterByTags = (script: ExtendedMulmoScript, tags: string[]): ExtendedMulmoScript => {
  const tagSet = new Set(tags);
  return filterBeatsPreservingMeta(script, (beat) => (beat.meta?.tags ?? []).some((tag) => tagSet.has(tag)));
};

/**
 * Strip variants and meta fields, converting to standard MulmoScript
 */
export const stripExtendedFields = (script: ExtendedMulmoScript): MulmoScript => filterBeatsToMulmoScript(script, () => true);

/**
 * Filter script by section and/or tags (preserves metadata)
 */
export const filterScript = (script: ExtendedMulmoScript, options: FilterOptions): ExtendedMulmoScript => {
  const afterSection = options.section ? filterBySection(script, options.section) : script;
  return options.tags && options.tags.length > 0 ? filterByTags(afterSection, options.tags) : afterSection;
};
