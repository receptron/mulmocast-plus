import { readFileSync, writeFileSync } from "fs";
import { GraphAILogger } from "graphai";
import { processScript } from "@mulmocast/script-utils";
import type { ExtendedMulmoScript } from "@mulmocast/extended-types";

interface ProcessOptions {
  profile?: string;
  output?: string;
  section?: string;
  tags?: string[];
}

/**
 * Process script with profile and output result
 */
export const processCommand = (scriptPath: string, options: ProcessOptions): void => {
  try {
    const content = readFileSync(scriptPath, "utf-8");
    const script: ExtendedMulmoScript = JSON.parse(content);

    const result = processScript(script, {
      profile: options.profile,
      section: options.section,
      tags: options.tags,
    });

    const output = JSON.stringify(result, null, 2);

    if (options.output) {
      writeFileSync(options.output, output);
      GraphAILogger.info(`Output written to ${options.output}`);
    } else {
      process.stdout.write(output + "\n");
    }
  } catch (error) {
    if (error instanceof Error) {
      GraphAILogger.error(`Error: ${error.message}`);
    } else {
      GraphAILogger.error("Unknown error occurred");
    }
    process.exit(1);
  }
};
