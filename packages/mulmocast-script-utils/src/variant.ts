import type { MulmoScript, MulmoBeat } from "@mulmocast/types";
import type { ExtendedMulmoScript, ExtendedMulmoBeat } from "@mulmocast/extended-types";

/**
 * Apply profile variant to a single beat
 * @returns Processed beat, or null if skip is set
 */
const applyVariantToBeat = (beat: ExtendedMulmoBeat, profileName: string): MulmoBeat | null => {
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
 * Apply profile to script and return standard MulmoScript
 */
export const applyProfile = (script: ExtendedMulmoScript, profileName: string): MulmoScript => {
  const { outputProfiles: __outputProfiles, scriptMeta: __scriptMeta, ...baseScript } = script;

  return {
    ...baseScript,
    beats: script.beats.map((beat) => applyVariantToBeat(beat, profileName)).filter((beat): beat is MulmoBeat => beat !== null),
  } as MulmoScript;
};
