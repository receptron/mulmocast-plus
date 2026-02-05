import { readFileSync } from "fs";
import { GraphAILogger } from "graphai";
import { listProfiles } from "../../core/profiles.js";
import type { ExtendedScript } from "../../types/index.js";

/**
 * List available profiles in script
 */
export const profilesCommand = (scriptPath: string): void => {
  try {
    const content = readFileSync(scriptPath, "utf-8");
    const script: ExtendedScript = JSON.parse(content);

    const profiles = listProfiles(script);

    GraphAILogger.log("\nAvailable profiles:");
    profiles.forEach((profile) => {
      const displayName = profile.displayName ? ` (${profile.displayName})` : "";
      const skipped = profile.skippedCount > 0 ? `, ${profile.skippedCount} skipped` : "";
      GraphAILogger.log(`  ${profile.name}${displayName}: ${profile.beatCount} beats${skipped}`);
      if (profile.description) {
        GraphAILogger.log(`    ${profile.description}`);
      }
    });
    GraphAILogger.log("");
  } catch (error) {
    if (error instanceof Error) {
      GraphAILogger.error(`Error: ${error.message}`);
    } else {
      GraphAILogger.error("Unknown error occurred");
    }
    process.exit(1);
  }
};
