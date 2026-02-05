#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { processCommand } from "./commands/process.js";
import { profilesCommand } from "./commands/profiles.js";

yargs(hideBin(process.argv))
  .command(
    "$0 <script>",
    "Process MulmoScript with profile",
    (builder) =>
      builder
        .positional("script", {
          describe: "Path to MulmoScript JSON file",
          type: "string",
          demandOption: true,
        })
        .option("profile", {
          alias: "p",
          describe: "Profile name to apply",
          type: "string",
          default: "default",
        })
        .option("output", {
          alias: "o",
          describe: "Output file path (default: stdout)",
          type: "string",
        }),
    (argv) => {
      processCommand(argv.script, {
        profile: argv.profile,
        output: argv.output,
      });
    },
  )
  .command(
    "profiles <script>",
    "List available profiles in script",
    (builder) =>
      builder.positional("script", {
        describe: "Path to MulmoScript JSON file",
        type: "string",
        demandOption: true,
      }),
    (argv) => {
      profilesCommand(argv.script);
    },
  )
  .example("$0 script.json --profile summary -o summary.json", "Apply summary profile and save to file")
  .example("$0 script.json -p teaser", "Apply teaser profile and output to stdout")
  .example("$0 profiles script.json", "List all available profiles")
  .help()
  .alias("h", "help")
  .version()
  .alias("v", "version")
  .strict()
  .parse();
