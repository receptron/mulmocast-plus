#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { processCommand } from "./commands/process.js";
import { profilesCommand } from "./commands/profiles.js";
import { summarizeCommand } from "./commands/summarize.js";
import { queryCommand } from "./commands/query.js";
import type { LLMProvider, SummarizeFormat } from "../types/summarize.js";

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
        })
        .option("section", {
          alias: "s",
          describe: "Filter by section name",
          type: "string",
        })
        .option("tags", {
          alias: "t",
          describe: "Filter by tags (comma-separated)",
          type: "string",
        }),
    (argv) => {
      const tags = argv.tags ? argv.tags.split(",").map((t) => t.trim()) : undefined;
      processCommand(argv.script, {
        profile: argv.profile,
        output: argv.output,
        section: argv.section,
        tags,
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
  .command(
    "summarize <script>",
    "Generate a summary of the script content",
    (builder) =>
      builder
        .positional("script", {
          describe: "Path or URL to MulmoScript JSON file",
          type: "string",
          demandOption: true,
        })
        .option("provider", {
          describe: "LLM provider (openai, anthropic, groq, gemini)",
          type: "string",
          default: "openai",
        })
        .option("model", {
          alias: "m",
          describe: "Model name",
          type: "string",
        })
        .option("format", {
          alias: "f",
          describe: "Output format (text, markdown)",
          type: "string",
          default: "text",
        })
        .option("lang", {
          alias: "l",
          describe: "Output language (e.g., ja, en, zh)",
          type: "string",
        })
        .option("target-length", {
          describe: "Target summary length in characters",
          type: "number",
        })
        .option("system-prompt", {
          describe: "Custom system prompt",
          type: "string",
        })
        .option("verbose", {
          describe: "Show detailed progress",
          type: "boolean",
          default: false,
        })
        .option("section", {
          alias: "s",
          describe: "Filter by section name",
          type: "string",
        })
        .option("tags", {
          alias: "t",
          describe: "Filter by tags (comma-separated)",
          type: "string",
        }),
    (argv) => {
      const tags = argv.tags ? argv.tags.split(",").map((t) => t.trim()) : undefined;
      summarizeCommand(argv.script, {
        provider: argv.provider as LLMProvider,
        model: argv.model,
        format: argv.format as SummarizeFormat,
        lang: argv.lang,
        targetLength: argv.targetLength,
        systemPrompt: argv.systemPrompt,
        verbose: argv.verbose,
        section: argv.section,
        tags,
      });
    },
  )
  .command(
    "query <script> [question]",
    "Ask a question about the script content",
    (builder) =>
      builder
        .positional("script", {
          describe: "Path or URL to MulmoScript JSON file",
          type: "string",
          demandOption: true,
        })
        .positional("question", {
          describe: "Question to ask about the script (omit for interactive mode)",
          type: "string",
        })
        .option("interactive", {
          alias: "i",
          describe: "Start interactive query mode",
          type: "boolean",
          default: false,
        })
        .option("provider", {
          describe: "LLM provider (openai, anthropic, groq, gemini)",
          type: "string",
          default: "openai",
        })
        .option("model", {
          alias: "m",
          describe: "Model name",
          type: "string",
        })
        .option("lang", {
          alias: "l",
          describe: "Output language (e.g., ja, en, zh)",
          type: "string",
        })
        .option("system-prompt", {
          describe: "Custom system prompt",
          type: "string",
        })
        .option("verbose", {
          describe: "Show detailed progress",
          type: "boolean",
          default: false,
        })
        .option("section", {
          alias: "s",
          describe: "Filter by section name",
          type: "string",
        })
        .option("tags", {
          alias: "t",
          describe: "Filter by tags (comma-separated)",
          type: "string",
        }),
    (argv) => {
      const tags = argv.tags ? argv.tags.split(",").map((t) => t.trim()) : undefined;
      queryCommand(argv.script, argv.question, {
        provider: argv.provider as LLMProvider,
        model: argv.model,
        lang: argv.lang,
        systemPrompt: argv.systemPrompt,
        verbose: argv.verbose,
        section: argv.section,
        tags,
        interactive: argv.interactive,
      });
    },
  )
  .example("$0 script.json --profile summary -o summary.json", "Apply summary profile and save to file")
  .example("$0 script.json -p teaser", "Apply teaser profile and output to stdout")
  .example("$0 script.json --section chapter1", "Filter by section")
  .example("$0 script.json --tags concept,demo", "Filter by tags")
  .example("$0 script.json -p summary -s chapter1", "Combine profile and section filter")
  .example("$0 profiles script.json", "List all available profiles")
  .example("$0 summarize script.json", "Generate text summary with OpenAI")
  .example("$0 summarize script.json --format markdown", "Generate markdown summary")
  .example("$0 summarize script.json -l ja", "Output summary in Japanese")
  .example("$0 summarize https://example.com/script.json", "Summarize from URL")
  .example('$0 query script.json "What is the main topic?"', "Ask a question about the script")
  .example('$0 query script.json "登場人物は？" -l ja', "Query in Japanese")
  .example("$0 query script.json -i", "Start interactive query mode")
  .example("$0 query script.json", "Interactive mode (question omitted)")
  .help()
  .alias("h", "help")
  .version()
  .alias("v", "version")
  .strict()
  .parse();
