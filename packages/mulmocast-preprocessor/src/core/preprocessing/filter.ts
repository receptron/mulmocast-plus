import type { MulmoScript, MulmoBeat } from "mulmocast";
import type { ExtendedScript, ExtendedBeat } from "@mulmocast/extended-types";

const stripBeatExtendedFields = (beat: ExtendedBeat): MulmoBeat => {
  const { variants: __variants, meta: __meta, ...baseBeat } = beat;
  return baseBeat;
};

const filterBeatsToMulmoScript = (script: ExtendedScript, predicate: (beat: ExtendedBeat) => boolean): MulmoScript => {
  const { outputProfiles: __outputProfiles, ...baseScript } = script;
  return {
    ...baseScript,
    beats: script.beats.filter(predicate).map(stripBeatExtendedFields),
  } as MulmoScript;
};

const filterBeatsPreservingMeta = (script: ExtendedScript, predicate: (beat: ExtendedBeat) => boolean): ExtendedScript => ({
  ...script,
  beats: script.beats.filter(predicate),
});

/**
 * Filter beats by section (preserves meta for chaining)
 */
export const filterBySection = (script: ExtendedScript, section: string): ExtendedScript =>
  filterBeatsPreservingMeta(script, (beat) => beat.meta?.section === section);

/**
 * Filter beats by tags (preserves meta for chaining)
 */
export const filterByTags = (script: ExtendedScript, tags: string[]): ExtendedScript => {
  const tagSet = new Set(tags);
  return filterBeatsPreservingMeta(script, (beat) => (beat.meta?.tags ?? []).some((tag) => tagSet.has(tag)));
};

/**
 * Strip variants and meta fields, converting to standard MulmoScript
 */
export const stripExtendedFields = (script: ExtendedScript): MulmoScript => filterBeatsToMulmoScript(script, () => true);
