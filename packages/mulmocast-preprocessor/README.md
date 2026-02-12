# mulmocast-preprocessor

Preprocessor for MulmoScript that enables generating multiple variations (full, summary, teaser, etc.) from a single script.

## Installation

```bash
npm install mulmocast-preprocessor
```

## Features

- **Profile-based variants**: Generate different versions (summary, teaser) from one script
- **Section filtering**: Extract beats by section
- **Tag filtering**: Extract beats by tags
- **Profile listing**: List available profiles with beat counts
- **AI Summarization**: Generate summaries using LLM (OpenAI, Anthropic, Groq, Gemini)
- **AI Query**: Ask questions about script content with interactive mode
- **CLI tool**: Command-line interface for processing scripts

## CLI Usage

```bash
# Process script with profile
mulmocast-preprocessor script.json --profile summary -o summary.json

# Output to stdout (for piping)
mulmocast-preprocessor script.json --profile teaser

# Filter by section
mulmocast-preprocessor script.json --section chapter1

# Filter by tags
mulmocast-preprocessor script.json --tags concept,demo

# Combine profile and filters
mulmocast-preprocessor script.json --profile summary --section chapter1

# List available profiles
mulmocast-preprocessor profiles script.json

# Summarize script content
mulmocast-preprocessor summarize script.json
mulmocast-preprocessor summarize script.json --format markdown
mulmocast-preprocessor summarize script.json -l ja  # Output in Japanese
mulmocast-preprocessor summarize https://example.com/script.json  # From URL

# Query script content
mulmocast-preprocessor query script.json "What is the main topic?"
mulmocast-preprocessor query script.json "登場人物は？" -l ja

# Interactive query mode
mulmocast-preprocessor query script.json -i
mulmocast-preprocessor query script.json  # Omit question for interactive mode
```

### CLI Options (process command)

| Option | Alias | Description |
|--------|-------|-------------|
| `--profile <name>` | `-p` | Profile name to apply (default: "default") |
| `--output <path>` | `-o` | Output file path (default: stdout) |
| `--section <name>` | `-s` | Filter by section name |
| `--tags <tags>` | `-t` | Filter by tags (comma-separated) |
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |

### CLI Options (summarize command)

| Option | Alias | Description |
|--------|-------|-------------|
| `--provider` | | LLM provider: openai, anthropic, groq, gemini (default: openai) |
| `--model` | `-m` | Model name |
| `--format` | `-f` | Output format: text, markdown (default: text) |
| `--lang` | `-l` | Output language (e.g., ja, en, zh) |
| `--target-length` | | Target summary length in characters |
| `--system-prompt` | | Custom system prompt |
| `--verbose` | | Show detailed progress |
| `--section` | `-s` | Filter by section name |
| `--tags` | `-t` | Filter by tags (comma-separated) |

### CLI Options (query command)

| Option | Alias | Description |
|--------|-------|-------------|
| `--interactive` | `-i` | Start interactive query mode |
| `--provider` | | LLM provider: openai, anthropic, groq, gemini (default: openai) |
| `--model` | `-m` | Model name |
| `--lang` | `-l` | Output language (e.g., ja, en, zh) |
| `--system-prompt` | | Custom system prompt |
| `--verbose` | | Show detailed progress |
| `--section` | `-s` | Filter by section name |
| `--tags` | `-t` | Filter by tags (comma-separated) |

### Interactive Query Commands

| Command | Description |
|---------|-------------|
| `/clear` | Clear conversation history |
| `/history` | Show conversation history |
| `/exit` | Exit interactive mode |

## Programmatic Usage

### Basic Example

```typescript
import { processScript, listProfiles, applyProfile } from "mulmocast-preprocessor";
import type { ExtendedMulmoScript } from "mulmocast-preprocessor";

const script: ExtendedMulmoScript = {
  title: "My Presentation",
  beats: [
    {
      text: "Full introduction text here...",
      variants: {
        summary: { text: "Brief intro" },
        teaser: { skip: true }
      },
      meta: { section: "intro", tags: ["important"] }
    },
    {
      text: "Main content...",
      meta: { section: "main", tags: ["core"] }
    }
  ]
};

// List available profiles
const profiles = listProfiles(script);
// [{ name: "default", beatCount: 2 }, { name: "summary", beatCount: 2 }, { name: "teaser", beatCount: 1, skippedCount: 1 }]

// Generate summary version
const summary = applyProfile(script, "summary");
// First beat's text is replaced with "Brief intro"

// Process with multiple options
const result = processScript(script, {
  profile: "summary",
  section: "intro"
});
```

## API

### `processScript(script, options)`

Main processing function that applies profile and filters.

**Parameters:**
- `script: ExtendedMulmoScript` - Input script with variants/meta
- `options: ProcessOptions` - Processing options
  - `profile?: string` - Profile name to apply
  - `section?: string` - Filter by section
  - `tags?: string[]` - Filter by tags (OR logic)

**Returns:** `MulmoScript` - Standard MulmoScript with variants/meta stripped

### `applyProfile(script, profileName)`

Apply a profile to the script, replacing text/image and skipping marked beats.

**Parameters:**
- `script: ExtendedMulmoScript` - Input script
- `profileName: string` - Profile name

**Returns:** `MulmoScript` - Processed script

### `listProfiles(script)`

Get list of available profiles from script.

**Parameters:**
- `script: ExtendedMulmoScript` - Input script

**Returns:** `ProfileInfo[]` - Array of profile info with beat counts

### `filterBySection(script, section)`

Filter beats by section.

### `filterByTags(script, tags)`

Filter beats by tags (extracts beats that have any of the specified tags).

### `summarizeScript(script, options)`

Generate a summary of the script content using LLM.

**Parameters:**
- `script: ExtendedMulmoScript` - Input script
- `options: SummarizeOptions` - Summarization options
  - `provider?: LLMProvider` - LLM provider (default: "openai")
  - `model?: string` - Model name
  - `format?: "text" | "markdown"` - Output format
  - `lang?: string` - Output language code
  - `targetLengthChars?: number` - Target length
  - `systemPrompt?: string` - Custom system prompt

**Returns:** `Promise<SummarizeResult>` - Summary result with text and metadata

### `queryScript(script, question, options)`

Ask a question about the script content.

**Parameters:**
- `script: ExtendedMulmoScript` - Input script
- `question: string` - Question to ask
- `options: QueryOptions` - Query options (same as summarize)

**Returns:** `Promise<QueryResult>` - Answer with question and metadata

### `createInteractiveSession(script, options)`

Create an interactive query session for follow-up questions.

**Parameters:**
- `script: ExtendedMulmoScript` - Input script
- `options: QueryOptions` - Query options

**Returns:** Session object with `sendInteractiveQuery()` method

## Environment Variables

For AI features (summarize, query), set the API key for your LLM provider:

| Provider | Environment Variable |
|----------|---------------------|
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Groq | `GROQ_API_KEY` |
| Gemini | `GEMINI_API_KEY` |

## Extended Schema

### ExtendedMulmoBeat

```typescript
interface ExtendedMulmoBeat extends MulmoBeat {
  variants?: Record<string, BeatVariant>;
  meta?: BeatMeta;
}
```

### BeatVariant

```typescript
interface BeatVariant {
  text?: string;       // Override text
  skip?: boolean;      // Skip this beat
  image?: MulmoImage;  // Override image
  imagePrompt?: string; // Override imagePrompt
}
```

### BeatMeta

```typescript
interface BeatMeta {
  tags?: string[];
  section?: string;
  context?: string;
  keywords?: string[];
  expectedQuestions?: string[];
}
```

## License

MIT
