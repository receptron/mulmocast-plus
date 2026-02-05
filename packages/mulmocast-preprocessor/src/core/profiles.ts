import type { ExtendedScript, ProfileInfo } from "../types/index.js";

/**
 * Get list of available profiles from script
 */
export const listProfiles = (script: ExtendedScript): ProfileInfo[] => {
  const profileNames = new Set<string>(["default"]);

  script.beats
    .filter((beat) => beat.variants)
    .flatMap((beat) => Object.keys(beat.variants!))
    .forEach((name) => profileNames.add(name));

  const buildProfileInfo = (profileName: string): ProfileInfo => {
    const outputProfile = script.outputProfiles?.[profileName];

    const { beatCount, skippedCount } =
      profileName === "default"
        ? { beatCount: script.beats.length, skippedCount: 0 }
        : script.beats.reduce(
            (acc, beat) => {
              const isSkipped = beat.variants?.[profileName]?.skip === true;
              return {
                beatCount: acc.beatCount + (isSkipped ? 0 : 1),
                skippedCount: acc.skippedCount + (isSkipped ? 1 : 0),
              };
            },
            { beatCount: 0, skippedCount: 0 },
          );

    return {
      name: profileName,
      displayName: outputProfile?.name,
      description: outputProfile?.description,
      beatCount,
      skippedCount,
    };
  };

  return Array.from(profileNames)
    .map(buildProfileInfo)
    .sort((a, b) => {
      if (a.name === "default") return -1;
      if (b.name === "default") return 1;
      return a.name.localeCompare(b.name);
    });
};
