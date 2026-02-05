import type { ExtendedScript, ProfileInfo } from "../types/index.js";

/**
 * スクリプトからプロファイル一覧を取得
 */
export const listProfiles = (script: ExtendedScript): ProfileInfo[] => {
  const profiles: ProfileInfo[] = [];
  const profileNames = new Set<string>();

  profileNames.add("default");

  for (const beat of script.beats) {
    if (beat.variants) {
      for (const profileName of Object.keys(beat.variants)) {
        profileNames.add(profileName);
      }
    }
  }

  for (const profileName of profileNames) {
    const outputProfile = script.outputProfiles?.[profileName];

    let beatCount = 0;
    let skippedCount = 0;

    for (const beat of script.beats) {
      const variant = beat.variants?.[profileName];
      if (variant?.skip) {
        skippedCount++;
      } else {
        beatCount++;
      }
    }

    if (profileName === "default") {
      beatCount = script.beats.length;
      skippedCount = 0;
    }

    profiles.push({
      name: profileName,
      displayName: outputProfile?.name,
      description: outputProfile?.description,
      beatCount,
      skippedCount,
    });
  }

  profiles.sort((a, b) => {
    if (a.name === "default") return -1;
    if (b.name === "default") return 1;
    return a.name.localeCompare(b.name);
  });

  return profiles;
};
